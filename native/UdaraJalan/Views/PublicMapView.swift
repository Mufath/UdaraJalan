//
//  PublicMapView.swift
//  UdaraJalan
//
//  Created for UdaraJalan Mobile Native Clean Mobility & Air Quality Sensing.
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
                    
                    Text("Cari ruas jalan atau stasiun transit...")
                        .font(.subheadline)
                        .foregroundStyle(Color(uiColor: .secondaryLabel))
                    
                    Spacer()
                    
                    Image(systemName: "mic.fill")
                        .foregroundStyle(Color(uiColor: .secondaryLabel))
                }
                .padding(.horizontal, 14)
                .padding(.vertical, 12)
                .background(.ultraThinMaterial)
                .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
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
        // Native Bottom Sheet (UISheetPresentationController Style)
        .sheet(isPresented: $viewModel.isSheetPresented) {
            if let segment = viewModel.selectedSegment {
                RoadDetailSheetView(segment: segment, routeComparison: viewModel.routeComparison)
                    .presentationDetents([.fraction(0.38), .large])
                    .presentationDragIndicator(.visible)
            }
        }
        .onAppear {
            if viewModel.selectedSegment != nil {
                viewModel.isSheetPresented = true
            }
        }
    }
}

// MARK: - Lembar Bottom Sheet Detail Ruas & Rute Rendah Polusi
struct RoadDetailSheetView: View {
    let segment: RoadSegment
    let routeComparison: NavigationRouteComparison?
    
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                // Header Nama Jalan & Kategori Kualitas Udara
                HStack(alignment: .top) {
                    VStack(alignment: .leading, spacing: 4) {
                        Text(segment.name)
                            .font(.headline)
                            .fontWeight(.bold)
                            .foregroundStyle(Color(uiColor: .label))
                        
                        Text("Diperbarui \(segment.ageInMinutes) menit lalu dari \(segment.uniquePassesCount) armada")
                            .font(.caption)
                            .foregroundStyle(Color(uiColor: .secondaryLabel))
                    }
                    
                    Spacer()
                    
                    VStack(alignment: .trailing, spacing: 2) {
                        Text("\(String(format: "%.1f", segment.currentPM25))")
                            .monospacedDigit()
                            .font(.system(size: 28, weight: .bold, design: .default))
                            .foregroundStyle(Color(hex: segment.category.hexColor))
                        Text("µg/m³ PM2.5")
                            .font(.caption2)
                            .foregroundStyle(Color(uiColor: .secondaryLabel))
                    }
                }
                
                // Indikator Transparansi: Badge Data Indikatif + Confidence Score
                HStack(spacing: 8) {
                    // Badge Data Indikatif (Kepatuhan Regulasi & Standar)
                    HStack(spacing: 4) {
                        Image(systemName: "info.circle.fill")
                            .font(.system(size: 11))
                        Text("Data Indikatif")
                            .font(.caption2)
                            .fontWeight(.semibold)
                    }
                    .foregroundStyle(Color(uiColor: .secondaryLabel))
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                    .background(Color(uiColor: .systemGroupedBackground))
                    .clipShape(Capsule())
                    
                    // Confidence Score Pill (Tinggi / Sedang / Rendah)
                    HStack(spacing: 4) {
                        Circle()
                            .fill(Color(hex: segment.confidenceScore.badgeColorHex))
                            .frame(width: 6, height: 6)
                        Text(segment.confidenceScore.rawValue)
                            .font(.caption2)
                            .fontWeight(.semibold)
                    }
                    .foregroundStyle(Color(hex: segment.confidenceScore.badgeColorHex))
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                    .background(Color(hex: segment.confidenceScore.badgeColorHex).opacity(0.12))
                    .clipShape(Capsule())
                }
                
                Divider()
                
                // Card Perbandingan: Rute Rendah Polusi (Low-Exposure Route)
                if let comparison = routeComparison {
                    VStack(alignment: .leading, spacing: 12) {
                        Text("Alternatif Rute Sehat Komuter")
                            .font(.subheadline)
                            .fontWeight(.semibold)
                            .foregroundStyle(Color(uiColor: .label))
                        
                        // Opsi Rute Bersih (Clean Air Route)
                        VStack(alignment: .leading, spacing: 8) {
                            HStack {
                                Text(comparison.cleanAirRoute.title)
                                    .font(.subheadline)
                                    .fontWeight(.bold)
                                    .foregroundStyle(Color(uiColor: .systemGreen))
                                
                                Spacer()
                                
                                Text(comparison.cleanAirRoute.badgeText)
                                    .font(.caption2)
                                    .fontWeight(.semibold)
                                    .foregroundStyle(Color(uiColor: .systemGreen))
                                    .padding(.horizontal, 6)
                                    .padding(.vertical, 2)
                                    .background(Color(uiColor: .systemGreen).opacity(0.12))
                                    .clipShape(Capsule())
                            }
                            
                            HStack(spacing: 16) {
                                Label("\(comparison.cleanAirRoute.durationMinutes) Menit", systemImage: "clock")
                                    .font(.caption)
                                Label("\(String(format: "%.1f", comparison.cleanAirRoute.distanceKm)) Km", systemImage: "point.topleft.down.curvedto.point.bottomright.up")
                                    .font(.caption)
                                Label("\(Int(comparison.cleanAirRoute.averagePM25)) µg/m³", systemImage: "wind")
                                    .font(.caption)
                                    .foregroundStyle(Color(uiColor: .systemGreen))
                            }
                            .foregroundStyle(Color(uiColor: .secondaryLabel))
                            
                            Text(comparison.cleanAirRoute.pathDescription)
                                .font(.caption)
                                .foregroundStyle(Color(uiColor: .secondaryLabel))
                            
                            Button(action: {}) {
                                HStack {
                                    Image(systemName: "arrow.triangle.turn.up.right.diamond.fill")
                                    Text("Navigasi Jalur Rendah Polusi")
                                }
                                .font(.subheadline)
                                .fontWeight(.semibold)
                                .foregroundStyle(.white)
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 12)
                                .background(Color(uiColor: .systemGreen))
                                .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
                            }
                        }
                        .padding(14)
                        .background(Color(uiColor: .systemGroupedBackground))
                        .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
                    }
                }
            }
            .padding(20)
        }
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
