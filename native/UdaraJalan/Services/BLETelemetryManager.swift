//
//  BLETelemetryManager.swift
//  UdaraJalan
//
//  Created for UdaraJalan Mobile Native Clean Mobility & Air Quality Sensing.
//

import Foundation
import CoreBluetooth
import CoreLocation

/// Manager Komunikasi Bluetooth Low Energy (BLE 5.2) ke Hardware Clip-on UdaraJalan
@MainActor
public final class BLETelemetryManager: NSObject, ObservableObject {
    @Published public var deviceStatus: ClipOnDeviceStatus = ClipOnDeviceStatus()
    @Published public var currentReading: TelemetryReading?
    @Published public var offlineBufferedCount: Int = 0
    @Published public var isAutoCleaningActive: Bool = false
    
    public override init() {
        super.init()
        // Menginisialisasi data awal sensor
        self.currentReading = TelemetryReading(
            coordinate: CLLocationCoordinate2D(latitude: -6.2088, longitude: 106.8229),
            speedKmh: 34.0,
            accelerometerRMS: 0.28,
            pm25: 18.2,
            temperatureCelsius: 31.4,
            relativeHumidity: 68.0
        )
    }
    
    /// Memulai siklus pembersihan kipas & optik laser Sensirion SPS30
    public func triggerManualLaserCleaning() {
        self.isAutoCleaningActive = true
        self.deviceStatus = ClipOnDeviceStatus(
            deviceId: deviceStatus.deviceId,
            isConnected: deviceStatus.isConnected,
            batteryPercentage: deviceStatus.batteryPercentage,
            isCharging: deviceStatus.isCharging,
            sps30Status: .cleaning,
            sht40Status: deviceStatus.sht40Status,
            gnssFixStatus: deviceStatus.gnssFixStatus,
            hoursUntilNextAutoClean: 12.0
        )
        
        // Simulasi durasi auto-cleaning (10 detik siklus pembersihan kipas RPM tinggi)
        DispatchQueue.main.asyncAfter(deadline: .now() + 10.0) { [weak self] in
            guard let self = self else { return }
            self.isAutoCleaningActive = false
            self.deviceStatus = ClipOnDeviceStatus(
                deviceId: self.deviceStatus.deviceId,
                isConnected: self.deviceStatus.isConnected,
                batteryPercentage: self.deviceStatus.batteryPercentage,
                isCharging: self.deviceStatus.isCharging,
                sps30Status: .normal,
                sht40Status: self.deviceStatus.sht40Status,
                gnssFixStatus: self.deviceStatus.gnssFixStatus,
                hoursUntilNextAutoClean: 12.0
            )
        }
    }
    
    /// Sinkronisasi buffer offline (SQLite) saat sinyal 4G/BLE pulih
    public func flushOfflineBuffer() {
        guard offlineBufferedCount > 0 else { return }
        // Batch upload ke server telemetri
        self.offlineBufferedCount = 0
    }
}
