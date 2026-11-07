//
//  MitraDashboardView.swift
//  UdaraJalan
//
//  Created for UdaraJalan Mobile Native Clean Mobility & Air Quality Sensing.
//  Design Standards: Apple iOS 18 Modular Bento Grid Style (DESIGN.md / DESIGN_SYSTEM.md)
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
                    
                    // MARK: - ROW 1: Modular Bento Grid (Hero AQI + Hero Weather)
                    HStack(alignment: .top, spacing: 14) {
                        heroAqiWidget
                        heroWeatherWidget
                    }
                    
                    // MARK: - ROW 2: Data Widget: Capaian Poin & Jarak (Clean Surface #FFFFFF)
                    dailyAchievementCard
                    
                    // MARK: - ROW 3: Paparan Polusi Shift Mitra (IQAir Exposure Style)
                    ShiftExposureCardView(validatedKm: viewModel.todayValidatedKm)
                    
                    // MARK: - ROW 4: 2 Col Bento Grid (Anti-Cheat Engine + Sensor Diagnostics)
                    HStack(alignment: .top, spacing: 14) {
                        antiCheatEngineCard
                        sensorDiagnosticsCard
                    }
                    
                    // MARK: - ROW 5: Data Widget: Misi Ruas Aktif H3 Hex (Clean Surface #FFFFFF)
                    h3MissionZoneCard
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
    
    // MARK: - Bento Widget 1: Hero AQI Widget (Rich System Color #34C759 / #FF9500 / #FF3B30)
    private var heroAqiWidget: some View {
        let isBaik = viewModel.currentPM25 <= 15.0
        let aqiColor = isBaik
            ? Color(hex: "34C759")
            : (viewModel.currentPM25 <= 35.4 ? Color(hex: "FF9500") : Color(hex: "FF3B30"))
        
        return VStack(alignment: .leading, spacing: 10) {
            HStack {
                HStack(spacing: 4) {
                    Image(systemName: "wind")
                        .font(.caption)
                    Text("SPS30 PM2.5")
                        .font(.caption)
                        .fontWeight(.semibold)
                }
                Spacer()
                Text(isBaik ? "Baik" : "Sedang")
                    .font(.system(size: 10, weight: .bold))
                    .padding(.horizontal, 6)
                    .padding(.vertical, 2)
                    .background(Color.white.opacity(0.2))
                    .clipShape(Capsule())
            }
            
            HStack(alignment: .bottom) {
                VStack(alignment: .leading, spacing: 2) {
                    Text("\(Int(viewModel.currentPM25))")
                        .font(.system(size: 36, weight: .bold, design: .default))
                        .monospacedDigit()
                        .lineLimit(1)
                    Text("µg/m³ • Baku 15-35")
                        .font(.caption2)
                        .opacity(0.9)
                }
                
                Spacer()
                
                AirQualityAvatarView(
                    category: isBaik ? .good : .moderate,
                    size: 34,
                    isDarkContrast: false
                )
            }
            
            // Sub-status semi transparan
            HStack {
                Circle()
                    .fill(Color.white)
                    .frame(width: 5, height: 5)
                Text("1 Hz Real-time • MCERTS")
                    .font(.system(size: 10))
                    .opacity(0.85)
            }
            .padding(.top, 2)
        }
        .padding(16)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(aqiColor)
        .foregroundStyle(.white)
        .clipShape(RoundedRectangle(cornerRadius: 24, style: .continuous))
        .shadow(color: aqiColor.opacity(0.25), radius: 12, y: 4)
    }
    
    // MARK: - Bento Widget 2: Hero Weather Widget (Official Rich iOS Blue #0A84FF)
    private var heroWeatherWidget: some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack {
                HStack(spacing: 4) {
                    Image(systemName: "location.fill")
                        .font(.caption2)
                    Text("Jakarta Pusat")
                        .font(.caption)
                        .fontWeight(.semibold)
                }
                Spacer()
                Image(systemName: "sun.max.fill")
                    .font(.caption)
                    .foregroundStyle(.yellow)
            }
            
            VStack(alignment: .leading, spacing: 2) {
                Text("31.2°")
                    .font(.system(size: 36, weight: .bold, design: .default))
                    .monospacedDigit()
                Text("Cerah Berawan • RH 68%")
                    .font(.caption2)
                    .opacity(0.9)
            }
            
            // Mini Weather Forecast Capsule Strip (Soft capsules per iOS 18 Bento)
            HStack(spacing: 4) {
                ForEach(["Sen", "Sel", "Rab", "Kam"], id: \.self) { day in
                    VStack(spacing: 2) {
                        Text(day)
                            .font(.system(size: 9))
                            .opacity(0.8)
                        Text("31°")
                            .font(.system(size: 10, weight: .bold))
                            .monospacedDigit()
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 3)
                    .background(Color.white.opacity(0.15))
                    .clipShape(RoundedRectangle(cornerRadius: 8, style: .continuous))
                }
            }
            .padding(.top, 2)
        }
        .padding(16)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color(hex: "0A84FF"))
        .foregroundStyle(.white)
        .clipShape(RoundedRectangle(cornerRadius: 24, style: .continuous))
        .shadow(color: Color(hex: "0A84FF").opacity(0.25), radius: 12, y: 4)
    }
    
    // MARK: - Card Capaian Poin & Jarak (Clean Surface #FFFFFF)
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
                    .font(.system(size: 34, weight: .bold, design: .default))
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
                    
                    Text("\(String(format: "%.1f", viewModel.validatedKilometers)) Km Tervalidasi • Rp120/km")
                        .font(.caption)
                        .fontWeight(.semibold)
                        .foregroundStyle(Color(uiColor: .label))
                }
            }
        }
        .padding(18)
        .background(Color(uiColor: .secondarySystemGroupedBackground))
        .clipShape(RoundedRectangle(cornerRadius: 24, style: .continuous))
        .shadow(color: Color.black.opacity(0.04), radius: 20, y: 4)
        .overlay(
            RoundedRectangle(cornerRadius: 24, style: .continuous)
                .stroke(Color.black.opacity(0.04), lineWidth: 1)
        )
    }
    
    // MARK: - Card Status Anti-Cheat Engine (Clean Surface #FFFFFF)
    private var antiCheatEngineCard: some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack {
                Text("Anti-Cheat")
                    .font(.caption)
                    .fontWeight(.semibold)
                    .foregroundStyle(Color(uiColor: .secondaryLabel))
                
                Spacer()
                
                // Pill Validasi Anti-Curang
                HStack(spacing: 3) {
                    Image(systemName: viewModel.isAntiCheatPassed ? "checkmark.shield.fill" : "exclamationmark.triangle.fill")
                        .font(.system(size: 10))
                    Text(viewModel.isAntiCheatPassed ? "Lolos" : "Anomali")
                        .font(.system(size: 10, weight: .bold))
                }
                .foregroundStyle(viewModel.isAntiCheatPassed ? Color(uiColor: .systemGreen) : Color(uiColor: .systemOrange))
                .padding(.horizontal, 6)
                .padding(.vertical, 3)
                .background(
                    viewModel.isAntiCheatPassed
                    ? Color(uiColor: .systemGreen).opacity(0.12)
                    : Color(uiColor: .systemOrange).opacity(0.12)
                )
                .clipShape(Capsule())
            }
            
            VStack(alignment: .leading, spacing: 4) {
                Text("Laju: \(Int(viewModel.currentSpeed)) km/j")
                    .font(.caption)
                    .fontWeight(.bold)
                    .monospacedDigit()
                Text("Getaran: \(String(format: "%.2fg", viewModel.currentAccelerometerRMS)) RMS")
                    .font(.caption2)
                    .monospacedDigit()
                    .foregroundStyle(Color(uiColor: .secondaryLabel))
                Text("GNSS: 1 Hz Fix (u-blox)")
                    .font(.caption2)
                    .foregroundStyle(Color(uiColor: .tertiaryLabel))
            }
            
            Spacer(minLength: 4)
            
            Button(action: {
                withAnimation(.spring(response: 0.3, dampingFraction: 0.8)) {
                    viewModel.toggleAnomalySimulation()
                }
            }) {
                Text(viewModel.isSimulatingAnomaly ? "Normalkan" : "Uji Anomali")
                    .font(.caption2)
                    .fontWeight(.semibold)
                    .foregroundStyle(Color(uiColor: .systemBlue))
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 6)
                    .background(Color(uiColor: .systemGroupedBackground))
                    .clipShape(RoundedRectangle(cornerRadius: 10, style: .continuous))
            }
        }
        .padding(14)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color(uiColor: .secondarySystemGroupedBackground))
        .clipShape(RoundedRectangle(cornerRadius: 24, style: .continuous))
        .shadow(color: Color.black.opacity(0.04), radius: 20, y: 4)
        .overlay(
            RoundedRectangle(cornerRadius: 24, style: .continuous)
                .stroke(Color.black.opacity(0.04), lineWidth: 1)
        )
    }
    
    // MARK: - Card Sensor Diagnostics (Clean Surface #FFFFFF)
    private var sensorDiagnosticsCard: some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack {
                Text("Diagnostik")
                    .font(.caption)
                    .fontWeight(.semibold)
                    .foregroundStyle(Color(uiColor: .secondaryLabel))
                Spacer()
                Text("MCERTS")
                    .font(.system(size: 9, weight: .bold))
                    .foregroundStyle(Color(uiColor: .secondaryLabel))
                    .padding(.horizontal, 5)
                    .padding(.vertical, 2)
                    .background(Color(uiColor: .systemGroupedBackground))
                    .clipShape(Capsule())
            }
            
            VStack(alignment: .leading, spacing: 4) {
                Text("SPS30: Normal")
                    .font(.caption)
                    .fontWeight(.bold)
                Text("SHT40: 31°C / 68% RH")
                    .font(.caption2)
                    .foregroundStyle(Color(uiColor: .secondaryLabel))
                Text("Buffer: 0 Pending (Sinkron)")
                    .font(.caption2)
                    .foregroundStyle(Color(uiColor: .tertiaryLabel))
            }
            
            Spacer(minLength: 4)
            
            HStack {
                Image(systemName: "fanblades")
                    .font(.caption2)
                    .foregroundStyle(Color(uiColor: .secondaryLabel))
                Text("Siklus: 4.8 Jam")
                    .font(.caption2)
                    .fontWeight(.medium)
                    .foregroundStyle(Color(uiColor: .secondaryLabel))
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(.vertical, 6)
            .padding(.horizontal, 8)
            .background(Color(uiColor: .systemGroupedBackground))
            .clipShape(RoundedRectangle(cornerRadius: 10, style: .continuous))
        }
        .padding(14)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color(uiColor: .secondarySystemGroupedBackground))
        .clipShape(RoundedRectangle(cornerRadius: 24, style: .continuous))
        .shadow(color: Color.black.opacity(0.04), radius: 20, y: 4)
        .overlay(
            RoundedRectangle(cornerRadius: 24, style: .continuous)
                .stroke(Color.black.opacity(0.04), lineWidth: 1)
        )
    }
    
    // MARK: - Card Misi Ruas H3 (MapKit Mini Widget - Clean Surface #FFFFFF)
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
            .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
            .allowsHitTesting(false)
            
            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    Text("Belum terukur > \(viewModel.activeMission.unmeasuredMinutes) menit • Radius 500m")
                        .font(.caption)
                        .foregroundStyle(Color(uiColor: .secondaryLabel))
                    
                    Text("Bonus Poin: 2x Lipat (Rp240/km)")
                        .font(.caption)
                        .fontWeight(.semibold)
                        .foregroundStyle(Color(uiColor: .systemGreen))
                }
                
                Spacer()
                
                Button(action: {
                    viewModel.startMissionNavigation()
                }) {
                    Text("Mulai Navigasi Misi Ruas")
                        .font(.subheadline)
                        .fontWeight(.semibold)
                        .foregroundStyle(.white)
                        .padding(.horizontal, 16)
                        .padding(.vertical, 10)
                        .background(Color(uiColor: .systemBlue))
                        .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
                }
            }
        }
        .padding(18)
        .background(Color(uiColor: .secondarySystemGroupedBackground))
        .clipShape(RoundedRectangle(cornerRadius: 24, style: .continuous))
        .shadow(color: Color.black.opacity(0.04), radius: 20, y: 4)
        .overlay(
            RoundedRectangle(cornerRadius: 24, style: .continuous)
                .stroke(Color.black.opacity(0.04), lineWidth: 1)
        )
    }
}
