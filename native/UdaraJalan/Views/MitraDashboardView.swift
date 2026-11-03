//
//  MitraDashboardView.swift
//  UdaraJalan
//
//  Created for UdaraJalan Mobile Native Clean Mobility & Air Quality Sensing.
//

import SwiftUI
import MapKit

public struct MitraDashboardView: View {
    @StateObject private var viewModel = DriverViewModel()
    @State private var cameraPosition: MapCameraPosition = .region(
        MKCoordinateRegion(
            center: CLLocationCoordinate2D(latitude: -6.2088, longitude: 106.8229),
            span: MKCoordinateSpan(latitudeDelta: 0.02, longitudeDelta: 0.02)
        )
    )
    
    public init() {}
    
    public var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 16) {
                    // Sub-Header Profil & Status Alat (Subtitle style)
                    subHeaderDeviceBar
                    
                    // Card Capaian Harian (Health Metric Style)
                    dailyAchievementCard
                    
                    // Card Status Anti-Cheat Engine Multi-Sensor
                    antiCheatEngineCard
                    
                    // Card Misi Ruas Heksagonal H3 (2x Points Zone)
                    h3MissionZoneCard
                    
                    // Card Status Hardware & Siklus Auto-Cleaning
                    hardwareTelemetryStatusCard
                }
                .padding(.horizontal, 16)
                .padding(.top, 8)
                .padding(.bottom, 24)
            }
            .background(Color(uiColor: .systemGroupedBackground))
            .navigationTitle("Ringkasan Mitra")
            .navigationBarTitleDisplayMode(.large)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button(action: {}) {
                        Image(systemName: "bell.badge")
                            .foregroundStyle(Color(uiColor: .systemBlue))
                    }
                }
            }
        }
    }
    
    // MARK: - Sub-Header Baris Status Alat
    private var subHeaderDeviceBar: some View {
        HStack {
            VStack(alignment: .leading, spacing: 2) {
                Text(viewModel.driverName)
                    .font(.subheadline)
                    .fontWeight(.semibold)
                    .foregroundStyle(Color(uiColor: .label))
                
                Text(viewModel.fleetNumber)
                    .font(.caption)
                    .foregroundStyle(Color(uiColor: .secondaryLabel))
            }
            
            Spacer()
            
            // Indikator Hardware IoT Clip-on (Sesuai HIG: Ikon kecil tanpa badge mencolok)
            HStack(spacing: 6) {
                Image(systemName: "checkmark.circle.fill")
                    .font(.system(size: 14))
                    .foregroundStyle(Color(uiColor: .systemGreen))
                
                Text("Sensor Aktif")
                    .font(.caption2)
                    .fontWeight(.medium)
                    .foregroundStyle(Color(uiColor: .secondaryLabel))
                
                Text("•")
                    .font(.caption2)
                    .foregroundStyle(Color(uiColor: .tertiaryLabel))
                
                Image(systemName: "battery.75percent")
                    .font(.system(size: 14))
                    .foregroundStyle(Color(uiColor: .systemGreen))
                
                Text("\(viewModel.batteryPercentage)%")
                    .monospacedDigit()
                    .font(.caption2)
                    .fontWeight(.semibold)
                    .foregroundStyle(Color(uiColor: .label))
            }
            .padding(.horizontal, 10)
            .padding(.vertical, 6)
            .background(Color(uiColor: .secondarySystemGroupedBackground))
            .clipShape(Capsule())
        }
    }
    
    // MARK: - Card Capaian Poin (Health Metric Card)
    private var dailyAchievementCard: some View {
        VStack(alignment: .leading, spacing: 14) {
            HStack {
                Text("Capaian Poin Hari Ini")
                    .font(.subheadline)
                    .fontWeight(.medium)
                    .foregroundStyle(Color(uiColor: .secondaryLabel))
                
                Spacer()
                
                Text("Target: 20.000 Pts")
                    .font(.caption)
                    .foregroundStyle(Color(uiColor: .tertiaryLabel))
            }
            
            HStack(alignment: .firstTextBaseline) {
                Text("\(viewModel.accumulatedPoints.formatted())")
                    .monospacedDigit()
                    .font(.system(size: 34, weight: .bold, design: .rounded))
                    .foregroundStyle(Color(uiColor: .label))
                
                Text("Pts")
                    .font(.headline)
                    .fontWeight(.semibold)
                    .foregroundStyle(Color(uiColor: .systemGreen))
                
                Spacer()
                
                Text("Rp\(viewModel.todayEarningsRupiah.formatted())")
                    .monospacedDigit()
                    .font(.title3)
                    .fontWeight(.semibold)
                    .foregroundStyle(Color(uiColor: .label))
            }
            
            // ProgressView Native
            VStack(alignment: .leading, spacing: 6) {
                ProgressView(value: viewModel.progressRatio)
                    .tint(Color(uiColor: .systemGreen))
                    .scaleEffect(x: 1, y: 1.6, anchor: .center)
                    .clipShape(RoundedRectangle(cornerRadius: 4))
                
                HStack {
                    Text("\(viewModel.progressPercentageString) tercapai")
                        .font(.caption)
                        .fontWeight(.medium)
                        .foregroundStyle(Color(uiColor: .secondaryLabel))
                    
                    Spacer()
                    
                    Text("\(String(format: "%.1f", viewModel.validatedKilometers)) Km Tervalidasi")
                        .font(.caption)
                        .fontWeight(.semibold)
                        .foregroundStyle(Color(uiColor: .label))
                }
            }
        }
        .padding(18)
        .background(Color(uiColor: .secondarySystemGroupedBackground))
        .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
    }
    
    // MARK: - Card Status Anti-Cheat Engine
    private var antiCheatEngineCard: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Text("Integritas Multi-Sensor")
                    .font(.subheadline)
                    .fontWeight(.medium)
                    .foregroundStyle(Color(uiColor: .secondaryLabel))
                
                Spacer()
                
                // Pill Validasi Anti-Curang (System Green)
                HStack(spacing: 4) {
                    Image(systemName: viewModel.isAntiCheatPassed ? "checkmark.shield.fill" : "exclamationmark.triangle.fill")
                        .font(.system(size: 11))
                    
                    Text(viewModel.isAntiCheatPassed ? "Validasi: Lolos" : "Peringatan Anomali")
                        .font(.caption2)
                        .fontWeight(.semibold)
                }
                .foregroundStyle(viewModel.isAntiCheatPassed ? Color(uiColor: .systemGreen) : Color(uiColor: .systemOrange))
                .padding(.horizontal, 8)
                .padding(.vertical, 4)
                .background(
                    viewModel.isAntiCheatPassed
                    ? Color(uiColor: .systemGreen).opacity(0.12)
                    : Color(uiColor: .systemOrange).opacity(0.12)
                )
                .clipShape(Capsule())
            }
            
            // Grid 3 Metrik Fusi Sensor (Kecepatan, Akselerometer RMS, GNSS Fix)
            HStack(spacing: 12) {
                telemetryMetricTile(
                    title: "Kecepatan GNSS",
                    value: "\(Int(viewModel.currentSpeed)) km/j",
                    subtext: "Ambang: 10–65 km/j"
                )
                
                telemetryMetricTile(
                    title: "Getaran RMS",
                    value: String(format: "%.2fg", viewModel.currentAccelerometerRMS),
                    subtext: "Ambang: > 0.15g"
                )
                
                telemetryMetricTile(
                    title: "Status GNSS",
                    value: "1 Hz Fix",
                    subtext: "u-blox Multiband"
                )
            }
            
            // Tombol Simulasi Pengujian (Untuk Demonstrasi Audit Integritas)
            Button(action: {
                withAnimation(.spring(response: 0.3, dampingFraction: 0.8)) {
                    viewModel.toggleAnomalySimulation()
                }
            }) {
                HStack {
                    Image(systemName: viewModel.isSimulatingAnomaly ? "arrow.counterclockwise" : "shield.lefthalf.filled")
                        .font(.caption)
                    Text(viewModel.isSimulatingAnomaly ? "Kembalikan ke Kondisi Normal" : "Uji Skenario Curang (Mock GPS / 0.0g)")
                        .font(.caption)
                        .fontWeight(.medium)
                }
                .foregroundStyle(Color(uiColor: .systemBlue))
                .frame(maxWidth: .infinity)
                .padding(.vertical, 6)
            }
        }
        .padding(18)
        .background(Color(uiColor: .secondarySystemGroupedBackground))
        .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
    }
    
    // MARK: - Card Misi Ruas H3 (MapKit Mini Widget)
    private var h3MissionZoneCard: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    Text("Misi Ruas Heksagon (H3)")
                        .font(.subheadline)
                        .fontWeight(.medium)
                        .foregroundStyle(Color(uiColor: .secondaryLabel))
                    
                    Text(viewModel.activeMission.zoneName)
                        .font(.headline)
                        .foregroundStyle(Color(uiColor: .label))
                }
                
                Spacer()
                
                // Multiplier Badge 2x
                HStack(spacing: 2) {
                    Image(systemName: "bolt.fill")
                        .font(.caption2)
                    Text("2x Multiplier")
                        .font(.caption2)
                        .fontWeight(.bold)
                }
                .foregroundStyle(Color(uiColor: .systemOrange))
                .padding(.horizontal, 8)
                .padding(.vertical, 4)
                .background(Color(uiColor: .systemOrange).opacity(0.12))
                .clipShape(Capsule())
            }
            
            // Peta Mini MapKit Inset (Estetika Vektor Bersih)
            Map(position: $cameraPosition) {
                Marker("Posisi Mitra", coordinate: viewModel.activeMission.centerCoordinate)
                    .tint(Color(uiColor: .systemBlue))
                
                MapCircle(center: viewModel.activeMission.centerCoordinate, radius: viewModel.activeMission.radiusMeters)
                    .foregroundStyle(Color(uiColor: .systemOrange).opacity(0.2))
                    .stroke(Color(uiColor: .systemOrange), lineWidth: 1.5)
            }
            .frame(height: 140)
            .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
            .allowsHitTesting(false)
            
            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    Text("Belum terukur > \(viewModel.activeMission.unmeasuredMinutes) menit")
                        .font(.caption)
                        .foregroundStyle(Color(uiColor: .secondaryLabel))
                    
                    Text("Reward: Rp240/km (Standar: Rp120)")
                        .font(.caption)
                        .fontWeight(.semibold)
                        .foregroundStyle(Color(uiColor: .systemGreen))
                }
                
                Spacer()
                
                Button(action: {
                    viewModel.startMissionNavigation()
                }) {
                    Text("Mulai Navigasi")
                        .font(.subheadline)
                        .fontWeight(.semibold)
                        .foregroundStyle(.white)
                        .padding(.horizontal, 16)
                        .padding(.vertical, 10)
                        .background(Color(uiColor: .systemBlue))
                        .clipShape(RoundedRectangle(cornerRadius: 10, style: .continuous))
                }
            }
        }
        .padding(18)
        .background(Color(uiColor: .secondarySystemGroupedBackground))
        .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
    }
    
    // MARK: - Card Hardware & Buffer Telemetri
    private var hardwareTelemetryStatusCard: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Telemetri Sensor Clip-on")
                .font(.subheadline)
                .fontWeight(.medium)
                .foregroundStyle(Color(uiColor: .secondaryLabel))
            
            HStack(spacing: 12) {
                HStack(spacing: 8) {
                    Image(systemName: "aqi.medium")
                        .font(.title3)
                        .foregroundStyle(Color(uiColor: .systemGreen))
                    
                    VStack(alignment: .leading, spacing: 1) {
                        Text("Sensirion SPS30")
                            .font(.caption2)
                            .foregroundStyle(Color(uiColor: .secondaryLabel))
                        Text("\(String(format: "%.1f", viewModel.currentPM25)) µg/m³")
                            .monospacedDigit()
                            .font(.subheadline)
                            .fontWeight(.semibold)
                    }
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(10)
                .background(Color(uiColor: .systemGroupedBackground))
                .clipShape(RoundedRectangle(cornerRadius: 10))
                
                HStack(spacing: 8) {
                    Image(systemName: "thermometer.medium")
                        .font(.title3)
                        .foregroundStyle(Color(uiColor: .systemOrange))
                    
                    VStack(alignment: .leading, spacing: 1) {
                        Text("Sensirion SHT40")
                            .font(.caption2)
                            .foregroundStyle(Color(uiColor: .secondaryLabel))
                        Text("31.2°C / 68% RH")
                            .font(.subheadline)
                            .fontWeight(.semibold)
                    }
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(10)
                .background(Color(uiColor: .systemGroupedBackground))
                .clipShape(RoundedRectangle(cornerRadius: 10))
            }
            
            HStack {
                Text("Buffer SQLite Offline: 0 antrian (Sinkron)")
                    .font(.caption2)
                    .foregroundStyle(Color(uiColor: .secondaryLabel))
                Spacer()
                Text("Auto-Clean: 4.8 Jam")
                    .font(.caption2)
                    .foregroundStyle(Color(uiColor: .tertiaryLabel))
            }
        }
        .padding(18)
        .background(Color(uiColor: .secondarySystemGroupedBackground))
        .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
    }
    
    // MARK: - Helper Tile Metrik
    private func telemetryMetricTile(title: String, value: String, subtext: String) -> some View {
        VStack(alignment: .leading, spacing: 3) {
            Text(title)
                .font(.caption2)
                .foregroundStyle(Color(uiColor: .secondaryLabel))
            
            Text(value)
                .font(.callout)
                .fontWeight(.bold)
                .foregroundStyle(Color(uiColor: .label))
            
            Text(subtext)
                .font(.system(size: 9))
                .foregroundStyle(Color(uiColor: .tertiaryLabel))
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(10)
        .background(Color(uiColor: .systemGroupedBackground))
        .clipShape(RoundedRectangle(cornerRadius: 10))
    }
}
