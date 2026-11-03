//
//  DriverViewModel.swift
//  UdaraJalan
//
//  Created for UdaraJalan Mobile Native Clean Mobility & Air Quality Sensing.
//

import Foundation
import CoreLocation
import Combine

@MainActor
public final class DriverViewModel: ObservableObject {
    @Published public var driverName: String = "Bang Rian"
    @Published public var fleetNumber: String = "EV-FLT #B-4819-SXX"
    
    // Poin & Metrik Capaian
    @Published public var accumulatedPoints: Int = 14850
    @Published public var dailyPointTarget: Int = 20000
    @Published public var validatedKilometers: Double = 38.4
    @Published public var todayEarningsRupiah: Int = 1782000
    
    // Status Anti-Cheat & Telemetri
    @Published public var isAntiCheatPassed: Bool = true
    @Published public var currentSpeed: Double = 34.0
    @Published public var currentAccelerometerRMS: Double = 0.28
    @Published public var antiCheatStatusText: String = "Validasi Anti-Curang: Lolos"
    @Published public var isSimulatingAnomaly: Bool = false
    
    // Data Misi Ruas H3
    @Published public var activeMission: H3MissionZone = H3MissionZone()
    @Published public var isNavigatingMission: Bool = false
    
    // Device & Hardware
    @Published public var batteryPercentage: Int = 84
    @Published public var isClipOnConnected: Bool = true
    @Published public var sps30Health: String = "Normal"
    @Published public var currentPM25: Double = 18.2
    
    private let antiCheatEngine = AntiCheatEngine()
    
    public init() {}
    
    public var progressRatio: Double {
        min(Double(accumulatedPoints) / Double(dailyPointTarget), 1.0)
    }
    
    public var progressPercentageString: String {
        let percent = Int(progressRatio * 100)
        return "\(percent)%"
    }
    
    /// Toggle simulasi antara kondisi berkendara normal vs indikasi anomali mock GPS (meja)
    public func toggleAnomalySimulation() {
        isSimulatingAnomaly.toggle()
        if isSimulatingAnomaly {
            // Skenario curang: Kecepatan dilaporkan 45 km/jam tetapi getaran motor 0.01g
            currentSpeed = 45.0
            currentAccelerometerRMS = 0.02
            isAntiCheatPassed = false
            antiCheatStatusText = "Peringatan Anomali (Getaran 0.02g Statis)"
        } else {
            // Skenario normal: Kecepatan 34 km/jam dengan getaran EV motor 0.28g
            currentSpeed = 34.0
            currentAccelerometerRMS = 0.28
            isAntiCheatPassed = true
            antiCheatStatusText = "Validasi Anti-Curang: Lolos"
        }
    }
    
    /// Memulai navigasi Misi Ruas H3 Multiplier 2x
    public func startMissionNavigation() {
        isNavigatingMission = true
    }
}
