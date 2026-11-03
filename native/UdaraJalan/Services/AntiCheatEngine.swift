//
//  AntiCheatEngine.swift
//  UdaraJalan
//
//  Created for UdaraJalan Mobile Native Clean Mobility & Air Quality Sensing.
//

import Foundation
import CoreLocation

/// Status Keputusan Engine Validasi Anti-Curang
public enum AntiCheatStatus: Sendable, Equatable {
    case passed(speed: Double, rms: Double)
    case warningAnomaly(reason: AnomalyReason)
    case pendingSignal
    
    public enum AnomalyReason: String, Sendable {
        case staticDeviceWithMockGPS = "Indikasi Lokasi Palsu (Akselerometer 0.0g saat bergerak)"
        case speedBelowThreshold = "Kecepatan di Bawah Batas (< 10 km/jam / Terjebak Macet Statis)"
        case speedExcessive = "Kecepatan di Luar Pola Motor Listrik (> 65 km/jam)"
        case teleportationDetected = "Lompatan Koordinat Tidak Wajar (GPS Jump)"
    }
}

/// Anti-Cheat Engine UdaraJalan (Fusi GNSS + 3-Axis MEMS Accelerometer)
public actor AntiCheatEngine {
    private var lastCoordinate: CLLocationCoordinate2D?
    private var lastTimestamp: Date?
    
    public init() {}
    
    /// Memvalidasi telemetri per detik untuk menentukan apakah jarak berhak memperoleh reward Rp120/km
    public func validateStep(
        coordinate: CLLocationCoordinate2D,
        speedKmh: Double,
        accelerometerRMS: Double,
        isMockProviderActive: Bool = false
    ) -> AntiCheatStatus {
        // 1. Deteksi mock location provider pihak ketiga
        if isMockProviderActive {
            return .warningAnomaly(reason: .staticDeviceWithMockGPS)
        }
        
        // 2. Deteksi anomali getaran (simulator GPS berjalan namun HP diam di meja)
        if speedKmh > 12.0 && accelerometerRMS < 0.05 {
            return .warningAnomaly(reason: .staticDeviceWithMockGPS)
        }
        
        // 3. Batas kecepatan motor listrik perkotaan
        if speedKmh < 10.0 {
            // Sesuai PRD, macet tidak diblokir sepihak, namun pertambahan km dijeda sementara
            return .warningAnomaly(reason: .speedBelowThreshold)
        }
        
        if speedKmh > 65.0 {
            return .warningAnomaly(reason: .speedExcessive)
        }
        
        // 4. Deteksi lompatan koordinat tak wajar (Teleportation)
        if let lastCoord = lastCoordinate, let lastTime = lastTimestamp {
            let loc1 = CLLocation(latitude: lastCoord.latitude, longitude: lastCoord.longitude)
            let loc2 = CLLocation(latitude: coordinate.latitude, longitude: coordinate.longitude)
            let distanceMeters = loc1.distance(from: loc2)
            let timeDeltaSeconds = max(Date().timeIntervalSince(lastTime), 1.0)
            let calculatedSpeedMps = distanceMeters / timeDeltaSeconds
            let calculatedSpeedKmh = calculatedSpeedMps * 3.6
            
            if calculatedSpeedKmh > 120.0 {
                return .warningAnomaly(reason: .teleportationDetected)
            }
        }
        
        // Simpan titik terakhir
        self.lastCoordinate = coordinate
        self.lastTimestamp = Date()
        
        // 5. Validasi lolos multi-sensor
        if accelerometerRMS >= 0.15 && speedKmh >= 10.0 && speedKmh <= 65.0 {
            return .passed(speed: speedKmh, rms: accelerometerRMS)
        }
        
        return .passed(speed: speedKmh, rms: accelerometerRMS)
    }
}
