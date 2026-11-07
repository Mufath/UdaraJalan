//
//  CommuterExposureClockView.swift
//  UdaraJalan
//
//  Created for UdaraJalan Mobile Native Clean Mobility & Air Quality Sensing.
//  Design Standards: Native Clean System Guidelines (DESIGN.md)
//  Adapted from IQAir 24-Hour Exposure Clock for Mobility-First Commuters.
//

import SwiftUI

public struct CommuterExposureClockView: View {
    @Environment(\.dismiss) private var dismiss
    
    public init() {}
    
    public var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 20) {
                    // Header Description
                    VStack(alignment: .leading, spacing: 4) {
                        Text("Dosis Paparan Harian Komuter")
                            .font(.headline)
                            .fontWeight(.bold)
                            .foregroundStyle(Color(uiColor: .label))
                        
                        Text("Estimasi akumulasi partikulat PM2.5 yang dihirup paru-paru selama perjalanan dan waktu istirahat.")
                            .font(.caption)
                            .foregroundStyle(Color(uiColor: .secondaryLabel))
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(.horizontal, 16)
                    .padding(.top, 8)
                    
                    // Radial 24-Hour Dial
                    VStack(spacing: 12) {
                        ZStack {
                            // 24h Background Track
                            Circle()
                                .stroke(Color(uiColor: .systemGroupedBackground), lineWidth: 16)
                                .frame(width: 180, height: 180)
                            
                            // Rumah Malam (00:00 - 07:00) 29%
                            Circle()
                                .trim(from: 0.0, to: 0.29)
                                .stroke(Color.green, style: StrokeStyle(lineWidth: 16, lineCap: .butt))
                                .frame(width: 180, height: 180)
                                .rotationEffect(.degrees(-90))
                            
                            // Komuter Pagi (07:00 - 08:30) 6%
                            Circle()
                                .trim(from: 0.29, to: 0.35)
                                .stroke(Color.blue, style: StrokeStyle(lineWidth: 16, lineCap: .butt))
                                .frame(width: 180, height: 180)
                                .rotationEffect(.degrees(-90))
                            
                            // Kantor / Kampus (08:30 - 17:00) 35%
                            Circle()
                                .trim(from: 0.35, to: 0.70)
                                .stroke(Color.green, style: StrokeStyle(lineWidth: 16, lineCap: .butt))
                                .frame(width: 180, height: 180)
                                .rotationEffect(.degrees(-90))
                            
                            // Komuter Sore (17:00 - 18:30) 6%
                            Circle()
                                .trim(from: 0.70, to: 0.76)
                                .stroke(Color.orange, style: StrokeStyle(lineWidth: 16, lineCap: .butt))
                                .frame(width: 180, height: 180)
                                .rotationEffect(.degrees(-90))
                            
                            // Rumah Malam (18:30 - 24:00) 24%
                            Circle()
                                .trim(from: 0.76, to: 1.0)
                                .stroke(Color.green, style: StrokeStyle(lineWidth: 16, lineCap: .butt))
                                .frame(width: 180, height: 180)
                                .rotationEffect(.degrees(-90))
                            
                            // Center Metric Display
                            VStack(spacing: 2) {
                                Text("12.8")
                                    .font(.system(size: 26, weight: .black, design: .default))
                                    .monospacedDigit()
                                Text("µg/m³ Harian")
                                    .font(.caption2)
                                    .foregroundStyle(Color(uiColor: .secondaryLabel))
                                Text("Dosis Bersih")
                                    .font(.system(size: 9, weight: .bold))
                                    .foregroundStyle(Color.green)
                                    .padding(.horizontal, 6)
                                    .padding(.vertical, 2)
                                    .background(Color.green.opacity(0.12))
                                    .clipShape(Capsule())
                            }
                        }
                        
                        // Legend
                        HStack(spacing: 12) {
                            HStack(spacing: 4) {
                                Circle().fill(Color.green).frame(width: 6, height: 6)
                                Text("Rumah/Kantor").font(.caption2).foregroundStyle(Color(uiColor: .secondaryLabel))
                            }
                            HStack(spacing: 4) {
                                Circle().fill(Color.blue).frame(width: 6, height: 6)
                                Text("Komuter Pagi").font(.caption2).foregroundStyle(Color(uiColor: .secondaryLabel))
                            }
                            HStack(spacing: 4) {
                                Circle().fill(Color.orange).frame(width: 6, height: 6)
                                Text("Komuter Sore").font(.caption2).foregroundStyle(Color(uiColor: .secondaryLabel))
                            }
                        }
                    }
                    .padding(20)
                    .frame(maxWidth: .infinity)
                    .background(Color(uiColor: .systemBackground))
                    .clipShape(RoundedRectangle(cornerRadius: 22, style: .continuous))
                    .padding(.horizontal, 16)
                    
                    // Card Penghematan Dosis Rute Bersih
                    HStack(spacing: 14) {
                        Image(systemName: "arrow.down.right.circle.fill")
                            .font(.system(size: 28))
                            .foregroundStyle(Color.green)
                        
                        VStack(alignment: .leading, spacing: 2) {
                            Text("Hemat -38% Dosis Polusi")
                                .font(.subheadline)
                                .fontWeight(.bold)
                                .foregroundStyle(Color(uiColor: .label))
                            Text("Berkat pemilihan Rute Rendah Polusi saat jam sibuk jalanan.")
                                .font(.caption2)
                                .foregroundStyle(Color(uiColor: .secondaryLabel))
                        }
                        Spacer()
                    }
                    .padding(14)
                    .background(Color.green.opacity(0.1))
                    .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
                    .padding(.horizontal, 16)
                    
                    // Card Edukasi "Tahukah Anda?"
                    VStack(alignment: .leading, spacing: 6) {
                        HStack(spacing: 6) {
                            Image(systemName: "lightbulb.fill")
                                .font(.system(size: 13))
                                .foregroundStyle(Color.blue)
                            Text("Tahukah Anda?")
                                .font(.caption)
                                .fontWeight(.bold)
                                .foregroundStyle(Color(uiColor: .label))
                        }
                        Text("Lebih dari 60% racun partikulat yang merusak saluran napas dihirup saat komuter di jalan raya pada jam sibuk, meskipun waktu perjalanan hanya 10-15% dari hari kita.")
                            .font(.caption2)
                            .foregroundStyle(Color(uiColor: .secondaryLabel))
                            .lineSpacing(2)
                    }
                    .padding(14)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .background(Color(uiColor: .systemBackground))
                    .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
                    .padding(.horizontal, 16)
                }
                .padding(.bottom, 24)
            }
            .background(Color(uiColor: .systemGroupedBackground))
            .navigationTitle("Jam Paparan 24 Jam")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Tutup") {
                        dismiss()
                    }
                    .fontWeight(.semibold)
                }
            }
        }
    }
}
