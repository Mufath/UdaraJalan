//
//  RouteModel.swift
//  UdaraJalan
//
//  Created for UdaraJalan Mobile Native Clean Mobility & Air Quality Sensing.
//

import Foundation
import CoreLocation

/// Model Ruas Jalan dengan Data Polusi & Tingkat Keyakinan (Confidence Score)
public struct RoadSegment: Identifiable, Sendable {
    public let id: String
    public let name: String
    public let coordinates: [CLLocationCoordinate2D]
    public let currentPM25: Double
    public let temperature: Double
    public let humidity: Double
    public let confidenceScore: ConfidenceLevel
    public let uniquePassesCount: Int
    public let ageInMinutes: Int
    public let varianceSigma: Double
    public let isIndicativeData: Bool
    
    public init(
        id: String,
        name: String,
        coordinates: [CLLocationCoordinate2D],
        currentPM25: Double,
        temperature: Double,
        humidity: Double,
        uniquePassesCount: Int,
        ageInMinutes: Int,
        varianceSigma: Double,
        isIndicativeData: Bool = true
    ) {
        self.id = id
        self.name = name
        self.coordinates = coordinates
        self.currentPM25 = currentPM25
        self.temperature = temperature
        self.humidity = humidity
        self.uniquePassesCount = uniquePassesCount
        self.ageInMinutes = ageInMinutes
        self.varianceSigma = varianceSigma
        self.isIndicativeData = isIndicativeData
        
        // Perhitungan Confidence Score berdasarkan PRD 3.5.2
        if uniquePassesCount >= 5 && ageInMinutes <= 30 && varianceSigma < 8.0 {
            self.confidenceScore = .high
        } else if uniquePassesCount >= 2 && ageInMinutes <= 60 {
            self.confidenceScore = .medium
        } else if ageInMinutes <= 120 {
            self.confidenceScore = .low
        } else {
            self.confidenceScore = .expired
        }
    }
    
    public var category: AirQualityCategory {
        AirQualityCategory.evaluate(pm25: currentPM25)
    }
}

public enum ConfidenceLevel: String, Sendable, CaseIterable {
    case high = "Keyakinan Tinggi (High)"
    case medium = "Keyakinan Sedang (Medium)"
    case low = "Keyakinan Rendah (Low)"
    case expired = "Data Kadaluarsa (> 120m)"
    
    public var badgeColorHex: String {
        switch self {
        case .high: return "#34C759"
        case .medium: return "#FF9500"
        case .low: return "#8E8E93"
        case .expired: return "#C7C7CC"
        }
    }
}

/// Opsi Navigasi: Rute Tercepat vs Rute Rendah Paparan Polutan
public struct NavigationRouteComparison: Sendable {
    public let originName: String
    public let destinationName: String
    public let fastestRoute: RouteOption
    public let cleanAirRoute: RouteOption
    
    public struct RouteOption: Sendable {
        public let title: String
        public let durationMinutes: Int
        public let distanceKm: Double
        public let averagePM25: Double
        public let pathDescription: String
        public let reductionPercentage: Double?
        public let badgeText: String
    }
}
