//
//  PublicMapView.swift
//  UdaraJalan
//
//  Created for UdaraJalan Mobile Native Clean Mobility & Air Quality Sensing.
//  Design Standards: Native Clean System Guidelines (DESIGN.md / DESIGN_SYSTEM.md)
//

import SwiftUI
import MapKit

public struct PublicMapView: View {
    @StateObject private var viewModel = PublicMapViewModel()
    @State private var position: MapCameraPosition = .region(
        MKCoordinateRegion(
            center: CLLocationCoordinate2D(latitude: -6.2250, longitude: 106.8250),
            span: MKCoordinateSpan(latitudeDelta: 0.05, longitudeDelta: 0.05)
        )
    )
    
    public init() {}
    
    public var body: some View {
        ZStack(alignment: .top) {
            // MapKit Full-Screen Canvas
            Map(position: $position) {
                ForEach(viewModel.roadSegments) { segment in
                    MapPolyline(coordinates: segment.coordinates)
                        .stroke(
                            Color(hex: segment.category.hexColor),
                            lineWidth: viewModel.selectedSegment?.id == segment.id ? 7 : 5
                        )
                    
                    if let firstCoord = segment.coordinates.first {
                        Annotation(segment.name, coordinate: firstCoord) {
                            Button(action: {
                                viewModel.selectSegment(segment)
                            }) {
                                HStack(spacing: 4) {
                                    Circle()
                                        .fill(Color(hex: segment.category.hexColor))
                                        .frame(width: 8, height: 8)
                                    Text("\(Int(segment.currentPM25))")
                                        .monospacedDigit()
                                        .font(.caption2)
                                        .fontWeight(.bold)
                                        .foregroundStyle(Color(uiColor: .label))
                                }
                                .padding(.horizontal, 6)
                                .padding(.vertical, 3)
                                .background(.ultraThinMaterial)
                                .clipShape(Capsule())
                                .shadow(color: .black.opacity(0.1), radius: 2, y: 1)
                            }
                        }
                    }
                }
            }
            .mapStyle(.standard(elevation: .realistic))
            .ignoresSafeArea(edges: .top)
            
            // Floating Top Search Bar & Layer Switcher (Clean Map Style)
            VStack(spacing: 8) {
                HStack {
                    Image(systemName: "magnifyingglass")
                        .foregroundStyle(Color(uiColor: .secondaryLabel))
                    
                    Text("Cari ruas jalan atau area...")
                        .font(.subheadline)
                        .foregroundStyle(Color(uiColor: .secondaryLabel))
                    
                    Spacer()
                    
                    Image(systemName: "mic.fill")
                        .foregroundStyle(Color(uiColor: .secondaryLabel))
                }
                .padding(.horizontal, 14)
                .padding(.vertical, 12)
                .background(.ultraThinMaterial)
                .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
                .shadow(color: .black.opacity(0.08), radius: 8, y: 3)
                
                // Segmented Control Filter Layer (PM2.5 vs Suhu Mikro)
                Picker("Layer", selection: $viewModel.selectedLayer) {
                    ForEach(MapLayerMode.allCases) { mode in
                        Text(mode.rawValue).tag(mode)
                    }
                }
                .pickerStyle(.segmented)
                .background(.ultraThinMaterial)
                .clipShape(RoundedRectangle(cornerRadius: 9, style: .continuous))
            }
            .padding(.horizontal, 16)
            .padding(.top, 8)
        }
        // Native Bottom Sheet with 24pt corner radius per DESIGN.md & DESIGN_SYSTEM.md
        .sheet(isPresented: $viewModel.isSheetPresented) {
            if let segment = viewModel.selectedSegment {
                RoadDetailSheetView(segment: segment, routeComparison: viewModel.routeComparison)
                    .presentationDetents([.fraction(0.38), .large])
                    .presentationDragIndicator(.visible)
                    .presentationCornerRadius(24)
            }
        }
        .onAppear {
            if viewModel.selectedSegment != nil {
                viewModel.isSheetPresented = true
            }
        }
    }
}

// MARK: - Lembar Bottom Sheet Detail Ruas & Rute Rendah Polusi (24pt Top Radius)
struct RoadDetailSheetView: View {
    let segment: RoadSegment
    let routeComparison: NavigationRouteComparison?
    
    var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                // Hero AQI Card dengan Avatar Ekspresi & Trio Mikroklimat
                HeroAqiCardView(segment: segment)
                
                // Prakiraan Per Jam & Harian
                HourlyForecastBarView(segment: segment)
                
                Divider()
                
                // Card Perbandingan: Rute Rendah Polusi (Low-Exposure Route)
                if let comparison = routeComparison {
                    VStack(alignment: .leading, spacing: 12) {
                        Text("Opsi Rute Rendah Paparan")
                            .font(.subheadline)
                            .fontWeight(.bold)
                            .foregroundStyle(Color(uiColor: .label))
                        
                        // Perbandingan Tabel Langsung Rute Tercepat vs Rute Bersih Rekomendasi
                        VStack(spacing: 8) {
                            // 1. Rute Tercepat
                            HStack {
                                VStack(alignment: .leading, spacing: 2) {
                                    Text("Rute Tercepat: \(comparison.fastestRoute.durationMinutes) Menit")
                                        .font(.subheadline)
                                        .fontWeight(.semibold)
                                    Text("Paparan PM2.5: \(Int(comparison.fastestRoute.averagePM25)) µg/m³ • \(String(format: "%.1f", comparison.fastestRoute.distanceKm)) km")
                                        .font(.caption)
                                        .foregroundStyle(Color(uiColor: .secondaryLabel))
                                }
                                Spacer()
                                Text("Jalur Utama")
                                    .font(.caption2)
                                    .foregroundStyle(Color(uiColor: .secondaryLabel))
                                    .padding(.horizontal, 6)
                                    .padding(.vertical, 2)
                                    .background(Color(uiColor: .tertiarySystemGroupedBackground))
                                    .clipShape(Capsule())
                            }
                            .padding(12)
                            .background(Color(uiColor: .secondarySystemGroupedBackground))
                            .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
                            
                            // 2. Rute Bersih Rekomendasi
                            VStack(alignment: .leading, spacing: 8) {
                                HStack {
                                    VStack(alignment: .leading, spacing: 2) {
                                        Text("Rute Bersih Rekomendasi: \(comparison.cleanAirRoute.durationMinutes) Menit")
                                            .font(.subheadline)
                                            .fontWeight(.bold)
                                            .foregroundStyle(Color(uiColor: .systemGreen))
                                        Text("Paparan: \(Int(comparison.cleanAirRoute.averagePM25)) µg/m³ • Menurunkan dosis inhalasi 62%")
                                            .font(.caption)
                                            .fontWeight(.medium)
                                            .foregroundStyle(Color(uiColor: .secondaryLabel))
                                    }
                                    Spacer()
                                    Text(comparison.cleanAirRoute.badgeText)
                                        .font(.caption2)
                                        .fontWeight(.bold)
                                        .foregroundStyle(Color(uiColor: .systemGreen))
                                        .padding(.horizontal, 6)
                                        .padding(.vertical, 2)
                                        .background(Color(uiColor: .systemGreen).opacity(0.12))
                                        .clipShape(Capsule())
                                }
                                
                                Button(action: {}) {
                                    HStack {
                                        Image(systemName: "arrow.triangle.turn.up.right.diamond.fill")
                                        Text("Ikuti Rute Rendah Polusi")
                                    }
                                    .font(.subheadline)
                                    .fontWeight(.bold)
                                    .foregroundStyle(.white)
                                    .frame(maxWidth: .infinity)
                                    .padding(.vertical, 12)
                                    .background(Color(uiColor: .systemBlue))
                                    .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
                                }
                            }
                            .padding(14)
                            .background(Color(uiColor: .secondarySystemGroupedBackground))
                            .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
                        }
                    }
                }
            }
            .padding(20)
        }
        .background(Color(uiColor: .systemGroupedBackground))
    }
}

// MARK: - Color Hex Extension
extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 6: // RGB (24-bit)
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (255, 0, 0, 0)
        }
        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue: Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}
