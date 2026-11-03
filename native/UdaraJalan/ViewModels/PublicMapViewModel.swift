//
//  PublicMapViewModel.swift
//  UdaraJalan
//
//  Created for UdaraJalan Mobile Native Clean Mobility & Air Quality Sensing.
//

import Foundation
import CoreLocation
import Combine

public enum MapLayerMode: String, CaseIterable, Identifiable {
    case pm25 = "PM2.5 (Partikulat)"
    case temperature = "Suhu Mikro (SHT40)"
    
    public var id: String { rawValue }
}

@MainActor
public final class PublicMapViewModel: ObservableObject {
    @Published public var selectedLayer: MapLayerMode = .pm25
    @Published public var roadSegments: [RoadSegment] = []
    @Published public var selectedSegment: RoadSegment? = nil
    @Published public var isSheetPresented: Bool = false
    @Published public var routeComparison: NavigationRouteComparison? = nil
    
    public init() {
        loadMockJakartaRoads()
    }
    
    private func loadMockJakartaRoads() {
        // Contoh koridor jalan utama DKI Jakarta dengan variasi tingkat PM2.5
        let senopati = RoadSegment(
            id: "SEG-JKT-01",
            name: "Jl. Senopati (Koridor Hijau Kebayoran)",
            coordinates: [
                CLLocationCoordinate2D(latitude: -6.2300, longitude: 106.8080),
                CLLocationCoordinate2D(latitude: -6.2325, longitude: 106.8120),
                CLLocationCoordinate2D(latitude: -6.2350, longitude: 106.8160)
            ],
            currentPM25: 12.4, // Baik (Hijau)
            temperature: 29.8,
            humidity: 72.0,
            uniquePassesCount: 8,
            ageInMinutes: 14,
            varianceSigma: 3.2
        )
        
        let rasunaSaid = RoadSegment(
            id: "SEG-JKT-02",
            name: "Jl. H.R. Rasuna Said (Kuningan)",
            coordinates: [
                CLLocationCoordinate2D(latitude: -6.2150, longitude: 106.8300),
                CLLocationCoordinate2D(latitude: -6.2250, longitude: 106.8315),
                CLLocationCoordinate2D(latitude: -6.2350, longitude: 106.8330)
            ],
            currentPM25: 26.8, // Sedang (Kuning)
            temperature: 32.1,
            humidity: 64.0,
            uniquePassesCount: 6,
            ageInMinutes: 28,
            varianceSigma: 5.4
        )
        
        let gatotSubroto = RoadSegment(
            id: "SEG-JKT-03",
            name: "Jl. Gatot Subroto (Semanggi Arah Pancoran)",
            coordinates: [
                CLLocationCoordinate2D(latitude: -6.2290, longitude: 106.8180),
                CLLocationCoordinate2D(latitude: -6.2340, longitude: 106.8280),
                CLLocationCoordinate2D(latitude: -6.2400, longitude: 106.8400)
            ],
            currentPM25: 44.2, // Tidak Sehat (Merah)
            temperature: 34.0,
            humidity: 58.0,
            uniquePassesCount: 7,
            ageInMinutes: 19,
            varianceSigma: 6.8
        )
        
        let kuninganUnderpass = RoadSegment(
            id: "SEG-JKT-04",
            name: "Underpass Mampang - Kuningan",
            coordinates: [
                CLLocationCoordinate2D(latitude: -6.2380, longitude: 106.8240),
                CLLocationCoordinate2D(latitude: -6.2420, longitude: 106.8250)
            ],
            currentPM25: 64.5, // Berbahaya / Sangat Tidak Sehat (Ungu)
            temperature: 35.6,
            humidity: 52.0,
            uniquePassesCount: 5,
            ageInMinutes: 12,
            varianceSigma: 7.1
        )
        
        self.roadSegments = [senopati, rasunaSaid, gatotSubroto, kuninganUnderpass]
        self.selectedSegment = gatotSubroto
        
        // Inisialisasi komparasi rute cerdas (PRD 3.6.1)
        self.routeComparison = NavigationRouteComparison(
            originName: "Stasiun MRT Bundaran HI",
            destinationName: "Menara BCA Thamrin",
            fastestRoute: .init(
                title: "Rute Tercepat",
                durationMinutes: 8,
                distanceKm: 2.1,
                averagePM25: 42.0,
                pathDescription: "Melalui koridor arteri utama (padat kendaraan combustion)",
                reductionPercentage: nil,
                badgeText: "Standar"
            ),
            cleanAirRoute: .init(
                title: "Rute Rendah Polusi",
                durationMinutes: 11,
                distanceKm: 2.4,
                averagePM25: 16.0,
                pathDescription: "Melalui koridor jalur hijau & kawasan pedestrian kanopi",
                reductionPercentage: 61.9,
                badgeText: "Rekomendasi Sehat (-62% PM2.5)"
            )
        )
    }
    
    public func selectSegment(_ segment: RoadSegment) {
        self.selectedSegment = segment
        self.isSheetPresented = true
    }
}
