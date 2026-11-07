//
//  StreetLeaderboardView.swift
//  UdaraJalan
//
//  Created for UdaraJalan Mobile Native Clean Mobility & Air Quality Sensing.
//  Design Standards: Native Clean System Guidelines (DESIGN.md)
//  Inspired by IQAir Live City Ranking (Screenshot 5).
//

import SwiftUI

public struct StreetLeaderboardView: View {
    public let segments: [RoadSegment]
    public let activeCityName: String
    public var onSelectSegment: ((RoadSegment) -> Void)?
    
    @State private var selectedTab: Int = 0 // 0: Semua, 1: Terbersih, 2: Berpolusi
    @Environment(\.dismiss) private var dismiss
    
    private var sortedSegments: [RoadSegment] {
        switch selectedTab {
        case 1:
            return segments.sorted(by: { $0.currentPM25 < $1.currentPM25 })
        case 2:
            return segments.sorted(by: { $0.currentPM25 > $1.currentPM25 })
        default:
            return segments.sorted(by: { $0.currentPM25 < $1.currentPM25 })
        }
    }
    
    public init(
        segments: [RoadSegment],
        activeCityName: String = "Surabaya",
        onSelectSegment: ((RoadSegment) -> Void)? = nil
    ) {
        self.segments = segments
        self.activeCityName = activeCityName
        self.onSelectSegment = onSelectSegment
    }
    
    public var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                // Live Pulse Bar
                HStack {
                    HStack(spacing: 6) {
                        Circle()
                            .fill(Color.red)
                            .frame(width: 8, height: 8)
                        Text("LIVE • 13.00 - 14.00 WIB")
                            .font(.caption2)
                            .fontWeight(.bold)
                            .foregroundStyle(Color.red)
                    }
                    
                    Spacer()
                    
                    Text("6 Nov 2026")
                        .font(.caption2)
                        .foregroundStyle(Color(uiColor: .secondaryLabel))
                }
                .padding(.horizontal, 16)
                .padding(.vertical, 8)
                .background(Color(uiColor: .systemGroupedBackground))
                
                // Filter Segmented Control
                Picker("Filter", selection: $selectedTab) {
                    Text("Semua (\(segments.count))").tag(0)
                    Text("Top Terbersih").tag(1)
                    Text("Top Berpolusi").tag(2)
                }
                .pickerStyle(.segmented)
                .padding(.horizontal, 16)
                .padding(.vertical, 10)
                
                // List Peringkat
                List {
                    ForEach(Array(sortedSegments.enumerated()), id: \.element.id) { index, segment in
                        Button(action: {
                            onSelectSegment?(segment)
                            dismiss()
                        }) {
                            HStack(spacing: 12) {
                                // Rank Number
                                Text("\(index + 1)")
                                    .font(.subheadline)
                                    .fontWeight(.bold)
                                    .monospacedDigit()
                                    .foregroundStyle(index < 3 ? Color.orange : Color(uiColor: .secondaryLabel))
                                    .frame(width: 24, alignment: .leading)
                                
                                // Road Name & Area
                                VStack(alignment: .leading, spacing: 2) {
                                    Text(segment.name)
                                        .font(.subheadline)
                                        .fontWeight(.semibold)
                                        .foregroundStyle(Color(uiColor: .label))
                                        .lineLimit(1)
                                    
                                    Text("\(segment.uniquePassesCount) armada melintas")
                                        .font(.caption2)
                                        .foregroundStyle(Color(uiColor: .secondaryLabel))
                                }
                                
                                Spacer()
                                
                                // PM2.5 & Temp
                                VStack(alignment: .trailing, spacing: 2) {
                                    Text("\(String(format: "%.1f", segment.currentPM25)) µg")
                                        .font(.caption)
                                        .fontWeight(.bold)
                                        .monospacedDigit()
                                        .foregroundStyle(Color(uiColor: .label))
                                    
                                    Text("\(String(format: "%.0f", segment.temperature))°C")
                                        .font(.caption2)
                                        .foregroundStyle(Color(uiColor: .secondaryLabel))
                                }
                                
                                // AQI Pill
                                Text(segment.category.rawValue)
                                    .font(.caption2)
                                    .fontWeight(.bold)
                                    .foregroundStyle(segment.category == .moderate ? Color(red: 0.12, green: 0.16, blue: 0.22) : Color.white)
                                    .padding(.horizontal, 8)
                                    .padding(.vertical, 4)
                                    .background(Color(hex: segment.category.hexColor))
                                    .clipShape(Capsule())
                            }
                            .padding(.vertical, 4)
                        }
                    }
                }
                .listStyle(.plain)
            }
            .navigationTitle("Peringkat Ruas \(activeCityName)")
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
