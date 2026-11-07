//
//  HourlyForecastBarView.swift
//  UdaraJalan
//
//  Created for UdaraJalan Mobile Native Clean Mobility & Air Quality Sensing.
//  Design Standards: Native Clean System Guidelines (DESIGN.md)
//  Inspired by IQAir Hourly & Daily Multi-Horizon Forecasting.
//

import SwiftUI

public struct HourlyForecastItemModel: Identifiable, Sendable {
    public let id = UUID()
    public let time: String
    public let usAqi: Int
    public let pm25: Double
    public let category: AirQualityCategory
    public let temp: Int
    public let humidity: Int
    public let windSpeed: Int
    public let windDir: String
}

public struct HourlyForecastBarView: View {
    public let segment: RoadSegment
    @State private var selectedHorizon: Int = 0 // 0: Hourly, 1: 3 Days, 2: 7 Days
    
    // Sample hourly forecast generator based on segment baseline
    private var hourlyItems: [HourlyForecastItemModel] {
        let basePM = segment.currentPM25
        let baseTemp = Int(segment.temperature)
        let hours = ["Sekarang", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"]
        let dirs = ["TL", "T", "TG", "S", "BD", "B", "BL", "U"]
        
        return hours.enumerated().map { index, time in
            let pmMult = index >= 3 && index <= 5 ? 1.30 : (index >= 6 ? 1.15 : 1.0)
            let pm = basePM * pmMult
            let cat = AirQualityCategory.evaluate(pm25: pm)
            let aqi = Int(round(pm * 3.8))
            
            return HourlyForecastItemModel(
                time: time,
                usAqi: aqi,
                pm25: pm,
                category: cat,
                temp: baseTemp - (index > 2 ? index - 2 : 0),
                humidity: min(85, Int(segment.humidity) + index * 2),
                windSpeed: 18 + (index % 3) * 3,
                windDir: dirs[index % dirs.count]
            )
        }
    }
    
    public init(segment: RoadSegment) {
        self.segment = segment
    }
    
    public var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            // Header & Horizon Picker
            HStack {
                HStack(spacing: 6) {
                    Image(systemName: "clock")
                        .font(.system(size: 13, weight: .bold))
                        .foregroundStyle(Color(uiColor: .secondaryLabel))
                    Text("Prakiraan Kualitas Udara")
                        .font(.subheadline)
                        .fontWeight(.bold)
                        .foregroundStyle(Color(uiColor: .label))
                }
                
                Spacer()
                
                Picker("Horizon", selection: $selectedHorizon) {
                    Text("Per Jam").tag(0)
                    Text("3 Hari").tag(1)
                    Text("7 Hari").tag(2)
                }
                .pickerStyle(.segmented)
                .frame(width: 170)
            }
            
            // Hourly Horizontal Scroll View
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 8) {
                    ForEach(hourlyItems) { item in
                        VStack(spacing: 8) {
                            Text(item.time)
                                .font(.caption2)
                                .fontWeight(.bold)
                                .monospacedDigit()
                                .foregroundStyle(Color(uiColor: .secondaryLabel))
                            
                            // AQI Pill
                            Text("\(item.usAqi)")
                                .font(.system(size: 13, weight: .black, design: .default))
                                .monospacedDigit()
                                .foregroundStyle(item.category == .moderate ? Color(red: 0.12, green: 0.16, blue: 0.22) : Color.white)
                                .padding(.horizontal, 8)
                                .padding(.vertical, 3)
                                .background(Color(hex: item.category.hexColor))
                                .clipShape(Capsule())
                            
                            // Weather Icon
                            Image(systemName: item.time == "Sekarang" || item.time == "14:00" ? "sun.max.fill" : "cloud.sun.fill")
                                .font(.system(size: 14))
                                .foregroundStyle(Color.orange)
                            
                            // Temp
                            Text("\(item.temp)°")
                                .font(.caption)
                                .fontWeight(.bold)
                                .monospacedDigit()
                                .foregroundStyle(Color(uiColor: .label))
                            
                            // Wind
                            HStack(spacing: 2) {
                                Image(systemName: "wind")
                                    .font(.system(size: 9))
                                Text("\(item.windSpeed)")
                                    .font(.system(size: 10, weight: .semibold))
                                    .monospacedDigit()
                            }
                            .foregroundStyle(Color(uiColor: .secondaryLabel))
                            
                            // Humidity
                            HStack(spacing: 2) {
                                Image(systemName: "humidity.fill")
                                    .font(.system(size: 9))
                                    .foregroundStyle(Color.cyan)
                                Text("\(item.humidity)%")
                                    .font(.system(size: 9))
                                    .monospacedDigit()
                            }
                            .foregroundStyle(Color(uiColor: .secondaryLabel))
                        }
                        .padding(.vertical, 10)
                        .padding(.horizontal, 10)
                        .background(Color(uiColor: .systemGroupedBackground))
                        .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
                    }
                }
            }
            
            // Cleanest Time Window Insight
            HStack(spacing: 6) {
                Circle().fill(Color.green).frame(width: 6, height: 6)
                Text("Waktu Terbersih: 14:00 (15.2 µg/m³)")
                    .font(.caption2)
                    .fontWeight(.semibold)
                    .foregroundStyle(Color(uiColor: .secondaryLabel))
                Spacer()
                Text("Rekomendasi Warga")
                    .font(.system(size: 9, weight: .bold))
                    .foregroundStyle(Color.green)
                    .padding(.horizontal, 6)
                    .padding(.vertical, 2)
                    .background(Color.green.opacity(0.12))
                    .clipShape(Capsule())
            }
            .padding(.top, 4)
        }
        .padding(16)
        .background(Color(uiColor: .systemBackground))
        .clipShape(RoundedRectangle(cornerRadius: 22, style: .continuous))
        .overlay(
            RoundedRectangle(cornerRadius: 22, style: .continuous)
                .stroke(Color(uiColor: .separator).opacity(0.4), lineWidth: 0.5)
        )
    }
}
