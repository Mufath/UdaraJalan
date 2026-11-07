//
//  ShiftExposureCardView.swift
//  UdaraJalan
//
//  Created for UdaraJalan Mobile Native Clean Mobility & Air Quality Sensing.
//  Design Standards: Native Clean System Guidelines (DESIGN.md)
//  Adapted from IQAir Today's Exposure 24-Hour Radial Clock for Driver Health.
//

import SwiftUI

public struct ShiftExposureCardView: View {
    public let validatedKm: Double
    public let shiftSeconds: Int
    
    public init(validatedKm: Double = 38.4, shiftSeconds: Int = 15840) {
        self.validatedKm = validatedKm
        self.shiftSeconds = shiftSeconds
    }
    
    private var shiftHours: Int { shiftSeconds / 3600 }
    private var shiftMinutes: Int { (shiftSeconds % 3600) / 60 }
    
    public var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            // Header
            HStack {
                HStack(spacing: 6) {
                    Image(systemName: "heart.text.square.fill")
                        .font(.system(size: 14))
                        .foregroundStyle(Color.red)
                    Text("Paparan Polusi Shift Mitra")
                        .font(.subheadline)
                        .fontWeight(.bold)
                        .foregroundStyle(Color(uiColor: .label))
                }
                
                Spacer()
                
                Text("\(shiftHours)j \(shiftMinutes)m Shift")
                    .font(.caption2)
                    .fontWeight(.bold)
                    .monospacedDigit()
                    .foregroundStyle(Color(uiColor: .secondaryLabel))
                    .padding(.horizontal, 8)
                    .padding(.vertical, 3)
                    .background(Color(uiColor: .systemGroupedBackground))
                    .clipShape(Capsule())
            }
            
            // Radial Gauge & Metrics
            HStack(spacing: 16) {
                // Radial Dial
                ZStack {
                    Circle()
                        .stroke(Color(uiColor: .systemGroupedBackground), lineWidth: 10)
                        .frame(width: 84, height: 84)
                    
                    Circle()
                        .trim(from: 0.0, to: 0.42)
                        .stroke(Color.green, style: StrokeStyle(lineWidth: 10, lineCap: .round))
                        .frame(width: 84, height: 84)
                        .rotationEffect(.degrees(-90))
                    
                    Circle()
                        .trim(from: 0.44, to: 0.88)
                        .stroke(Color.orange, style: StrokeStyle(lineWidth: 10, lineCap: .round))
                        .frame(width: 84, height: 84)
                        .rotationEffect(.degrees(-90))
                    
                    Circle()
                        .trim(from: 0.90, to: 1.0)
                        .stroke(Color.red, style: StrokeStyle(lineWidth: 10, lineCap: .round))
                        .frame(width: 84, height: 84)
                        .rotationEffect(.degrees(-90))
                    
                    VStack(spacing: 0) {
                        Text("21.8")
                            .font(.system(size: 18, weight: .black, design: .default))
                            .monospacedDigit()
                        Text("µg/m³")
                            .font(.system(size: 8))
                            .foregroundStyle(Color(uiColor: .secondaryLabel))
                    }
                }
                
                // Zone Breakdown Pills
                VStack(spacing: 6) {
                    HStack {
                        Circle().fill(Color.green).frame(width: 6, height: 6)
                        Text("Zona Bersih:").font(.caption2).foregroundStyle(Color(uiColor: .secondaryLabel))
                        Spacer()
                        Text("1j 50m (42%)").font(.caption2).fontWeight(.bold).monospacedDigit()
                    }
                    HStack {
                        Circle().fill(Color.orange).frame(width: 6, height: 6)
                        Text("Zona Sedang:").font(.caption2).foregroundStyle(Color(uiColor: .secondaryLabel))
                        Spacer()
                        Text("2j 05m (46%)").font(.caption2).fontWeight(.bold).monospacedDigit()
                    }
                    HStack {
                        Circle().fill(Color.red).frame(width: 6, height: 6)
                        Text("Zona Padat:").font(.caption2).foregroundStyle(Color(uiColor: .secondaryLabel))
                        Spacer()
                        Text("29m (12%)").font(.caption2).fontWeight(.bold).monospacedDigit()
                    }
                }
            }
            
            // Health Action Notice
            HStack(alignment: .top, spacing: 8) {
                Image(systemName: "exclamationmark.shield.fill")
                    .font(.system(size: 12))
                    .foregroundStyle(Color.orange)
                    .padding(.top, 1)
                Text("Terpapar koridor padat 29 menit. Disarankan hidrasi & ganti masker medis di titik istirahat.")
                    .font(.caption2)
                    .foregroundStyle(Color(uiColor: .secondaryLabel))
                    .lineLimit(2)
            }
            .padding(10)
            .background(Color.orange.opacity(0.08))
            .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
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
