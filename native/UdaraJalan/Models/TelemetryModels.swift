//
//  TelemetryModels.swift
//  UdaraJalan
//
//  Created for UdaraJalan Mobile Native Clean Mobility & Air Quality Sensing.
//

import Foundation
import CoreLocation

/// Model status koneksi dan kesehatan hardware clip-on IoT UdaraJalan
public struct ClipOnDeviceStatus: Sendable, Equatable {
    public let deviceId: String
    public let isConnected: Bool
    public let batteryPercentage: Int
    public let isCharging: Bool
    public let sps30Status: SensorHealthStatus
    public let sht40Status: SensorHealthStatus
    public let gnssFixStatus: GNSSFixStatus
    public let hoursUntilNextAutoClean: Double
    
    public init(
        deviceId: String = "UJ-EV-2026-X84",
        isConnected: Bool = true,
        batteryPercentage: Int = 84,
        isCharging: Bool = false,
        sps30Status: SensorHealthStatus = .normal,
        sps30PM25: Double = 18.2,
        sht40Status: SensorHealthStatus = .normal,
        gnssFixStatus: GNSSFixStatus = .fix3D,
        hoursUntilNextAutoClean: Double = 4.8
    ) {
        self.deviceId = deviceId
        self.isConnected = isConnected
        self.batteryPercentage = batteryPercentage
        self.isCharging = isCharging
        self.sps30Status = sps30Status
        self.sht40Status = sht40Status
        self.gnssFixStatus = gnssFixStatus
        self.hoursUntilNextAutoClean = hoursUntilNextAutoClean
    }
}

public enum SensorHealthStatus: String, Sendable, Equatable {
    case normal = "Normal"
    case cleaning = "Pembersihan Laser Aktif"
    case degraded = "Perlu Kalibrasi"
    case error = "Sensor Bermasalah"
}

public enum GNSSFixStatus: String, Sendable, Equatable {
    case noFix = "Mencari Sinyal"
    case fix2D = "2D Fix"
    case fix3D = "1 Hz u-blox 3D Fix"
}

/// Model Telemetri Real-time per Detik
public struct TelemetryReading: Identifiable, Sendable {
    public let id: UUID
    public let timestamp: Date
    public let coordinate: CLLocationCoordinate2D
    public let speedKmh: Double
    public let accelerometerRMS: Double
    public let pm25: Double
    public let temperatureCelsius: Double
    public let relativeHumidity: Double
    public let isValidated: Bool
    public let anomalyNote: String?
    
    public init(
        id: UUID = UUID(),
        timestamp: Date = Date(),
        coordinate: CLLocationCoordinate2D,
        speedKmh: Double,
        accelerometerRMS: Double,
        pm25: Double,
        temperatureCelsius: Double,
        relativeHumidity: Double,
        isValidated: Bool = true,
        anomalyNote: String? = nil
    ) {
        self.id = id
        self.timestamp = timestamp
        self.coordinate = coordinate
        self.speedKmh = speedKmh
        self.accelerometerRMS = accelerometerRMS
        self.pm25 = pm25
        self.temperatureCelsius = temperatureCelsius
        self.relativeHumidity = relativeHumidity
        self.isValidated = isValidated
        self.anomalyNote = anomalyNote
    }
}

/// Model Kategori Kualitas Udara Jalanan
public enum AirQualityCategory: String, Sendable, CaseIterable {
    case good = "Baik"
    case moderate = "Sedang"
    case unhealthy = "Tidak Sehat"
    case hazardous = "Berbahaya"
    
    public static func evaluate(pm25: Double) -> AirQualityCategory {
        switch pm25 {
        case 0..<15.1:
            return .good
        case 15.1..<35.5:
            return .moderate
        case 35.5..<55.5:
            return .unhealthy
        default:
            return .hazardous
        }
    }
    
    public var hexColor: String {
        switch self {
        case .good: return "#34C759"
        case .moderate: return "#FF9500"
        case .unhealthy: return "#FF3B30"
        case .hazardous: return "#AF52DE"
        }
    }
}

/// Model Misi Ruas Heksagonal Uber H3
public struct H3MissionZone: Identifiable, Sendable {
    public let id: String
    public let zoneName: String
    public let centerCoordinate: CLLocationCoordinate2D
    public let multiplier: Double
    public let unmeasuredMinutes: Int
    public let radiusMeters: Double
    public let rewardPerKm: Int
    
    public init(
        id: String = "ID-H3-886541",
        zoneName: String = "Koridor Sudirman - Bundaran HI",
        centerCoordinate: CLLocationCoordinate2D = CLLocationCoordinate2D(latitude: -6.2088, longitude: 106.8229),
        multiplier: Double = 2.0,
        unmeasuredMinutes: Int = 68,
        radiusMeters: Double = 500.0,
        rewardPerKm: Int = 240
    ) {
        self.id = id
        self.zoneName = zoneName
        self.centerCoordinate = centerCoordinate
        self.multiplier = multiplier
        self.unmeasuredMinutes = unmeasuredMinutes
        self.radiusMeters = radiusMeters
        self.rewardPerKm = rewardPerKm
    }
}
