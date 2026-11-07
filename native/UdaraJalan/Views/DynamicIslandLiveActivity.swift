//
//  DynamicIslandLiveActivity.swift
//  UdaraJalan
//
//  Created for UdaraJalan Mobile Native Clean Mobility & Air Quality Sensing.
//  Design Standards: Native Clean System Guidelines (DESIGN.md / DESIGN_SYSTEM.md)
//

import ActivityKit
import WidgetKit
import SwiftUI

/// Atribut Aktivitas Live Activity Biker Mode UdaraJalan
public struct UdaraJalanActivityAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        public var validatedKm: Double
        public var currentPM25: Double
        public var earnedPoints: Int
        public var batteryPercentage: Int
        public var isAntiCheatPassed: Bool
        
        public init(
            validatedKm: Double = 6.2,
            currentPM25: Double = 18.2,
            earnedPoints: Int = 744,
            batteryPercentage: Int = 84,
            isAntiCheatPassed: Bool = true
        ) {
            self.validatedKm = validatedKm
            self.currentPM25 = currentPM25
            self.earnedPoints = earnedPoints
            self.batteryPercentage = batteryPercentage
            self.isAntiCheatPassed = isAntiCheatPassed
        }
    }

    public var sessionTitle: String
    
    public init(sessionTitle: String = "Sesi Berkendara EV") {
        self.sessionTitle = sessionTitle
    }
}

/// Widget Extension Live Activity & Dynamic Island (Native Clean)
public struct UdaraJalanLiveActivityWidget: Widget {
    public var body: some WidgetConfiguration {
        ActivityConfiguration(for: UdaraJalanActivityAttributes.self) { context in
            // Tampilan di Lock Screen / StandBy Mode
            VStack(alignment: .leading, spacing: 10) {
                HStack {
                    Label("UdaraJalan Biker Mode", systemImage: "scooter")
                        .font(.caption)
                        .fontWeight(.semibold)
                        .foregroundStyle(Color(uiColor: .systemGreen))
                    Spacer()
                    Text("\(context.state.batteryPercentage)% LiFePO4")
                        .monospacedDigit()
                        .font(.caption2)
                        .foregroundStyle(.secondary)
                }
                
                HStack {
                    VStack(alignment: .leading, spacing: 2) {
                        Text("\(String(format: "%.1f", context.state.validatedKm)) Km")
                            .monospacedDigit()
                            .font(.title2)
                            .fontWeight(.bold)
                        Text("Tervalidasi (+Rp120/km)")
                            .font(.caption2)
                            .foregroundStyle(.secondary)
                    }
                    
                    Spacer()
                    
                    VStack(alignment: .trailing, spacing: 2) {
                        Text("\(Int(context.state.currentPM25)) µg/m³")
                            .monospacedDigit()
                            .font(.title3)
                            .fontWeight(.bold)
                            .foregroundStyle(Color(uiColor: .systemGreen))
                        Text("PM2.5 Sensirion SPS30")
                            .font(.caption2)
                            .foregroundStyle(.secondary)
                    }
                }
            }
            .padding(16)
            .activityBackgroundTint(Color.black.opacity(0.85))
            
        } dynamicIsland: { context in
            DynamicIsland {
                // Tampilan Dynamic Island Expanded
                DynamicIslandExpandedRegion(.leading) {
                    HStack(spacing: 6) {
                        Image(systemName: "scooter")
                            .foregroundStyle(Color(uiColor: .systemGreen))
                        VStack(alignment: .leading, spacing: 1) {
                            Text("\(String(format: "%.1f", context.state.validatedKm)) Km")
                                .monospacedDigit()
                                .font(.headline)
                                .fontWeight(.bold)
                            Text("+Rp120/km")
                                .font(.caption2)
                                .foregroundStyle(.secondary)
                        }
                    }
                    .padding(.leading, 8)
                }
                
                DynamicIslandExpandedRegion(.trailing) {
                    HStack(spacing: 8) {
                        VStack(alignment: .trailing, spacing: 1) {
                            Text("\(Int(context.state.currentPM25)) µg/m³")
                                .monospacedDigit()
                                .font(.headline)
                                .fontWeight(.bold)
                                .foregroundStyle(
                                    context.state.currentPM25 <= 15.0 ? Color(uiColor: .systemGreen) :
                                    (context.state.currentPM25 <= 35.4 ? Color(uiColor: .systemOrange) : Color(uiColor: .systemRed))
                                )
                            Text(
                                context.state.currentPM25 <= 15.0 ? "Mutu: Baik" :
                                (context.state.currentPM25 <= 35.4 ? "Mutu: Sedang" : "Tidak Sehat")
                            )
                            .font(.caption2)
                            .foregroundStyle(.secondary)
                        }
                        
                        AirQualityAvatarView(
                            category: context.state.currentPM25 <= 15.0 ? .good :
                                      (context.state.currentPM25 <= 35.4 ? .moderate : .unhealthy),
                            size: 26,
                            isDarkContrast: false
                        )
                    }
                    .padding(.trailing, 8)
                }
                
                DynamicIslandExpandedRegion(.bottom) {
                    HStack {
                        Label(
                            context.state.isAntiCheatPassed ? "Validasi: Lolos" : "Peringatan Anomali",
                            systemImage: context.state.isAntiCheatPassed ? "checkmark.shield.fill" : "exclamationmark.triangle.fill"
                        )
                        .font(.caption2)
                        .foregroundStyle(context.state.isAntiCheatPassed ? Color(uiColor: .systemGreen) : Color(uiColor: .systemOrange))
                        
                        Spacer()
                        
                        Text("Bat: \(context.state.batteryPercentage)%")
                            .monospacedDigit()
                            .font(.caption2)
                            .foregroundStyle(.secondary)
                    }
                    .padding(.horizontal, 10)
                    .padding(.top, 4)
                }
            } compactLeading: {
                // Compact Leading: Ikon Motor Listrik
                Image(systemName: "scooter")
                    .foregroundStyle(Color(uiColor: .systemGreen))
            } compactTrailing: {
                // Compact Trailing: Jarak Km Valid dengan Titik Hijau Aktif
                HStack(spacing: 3) {
                    Text("\(String(format: "%.1f", context.state.validatedKm)) Km")
                        .monospacedDigit()
                        .font(.caption2)
                        .fontWeight(.bold)
                    Circle()
                        .fill(Color(uiColor: .systemGreen))
                        .frame(width: 4, height: 4)
                }
            } minimal: {
                Image(systemName: "wind")
                    .foregroundStyle(Color(uiColor: .systemGreen))
            }
        }
    }
}
