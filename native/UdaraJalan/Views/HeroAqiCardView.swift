//
//  HeroAqiCardView.swift
//  UdaraJalan
//
//  Created for UdaraJalan Mobile Native Clean Mobility & Air Quality Sensing.
//  Design Standards: Native Clean System Guidelines (DESIGN.md)
//  Inspired by IQAir glanceable emotional cues with strict Anti-Slop (No gradients, WCAG AA contrast)
//

import SwiftUI

/// Vector Expression Avatar for Air Quality Levels
public struct AirQualityAvatarView: View {
    public let category: AirQualityCategory
    public var size: CGFloat = 52
    public var isDarkContrast: Bool = false
    
    private var strokeColor: Color {
        if isDarkContrast {
            return Color(red: 0.12, green: 0.16, blue: 0.22) // Dark Slate for Amber/Yellow card
        } else {
            return Color.white
        }
    }
    
    public init(category: AirQualityCategory, size: CGFloat = 52, isDarkContrast: Bool = false) {
        self.category = category
        self.size = size
        self.isDarkContrast = isDarkContrast
    }
    
    public var body: some View {
        Canvas { context, canvasSize in
            let scale = canvasSize.width / 64.0
            
            // 1. Universal Head Contour
            var head = Path()
            head.move(to: CGPoint(x: 18 * scale, y: 24 * scale))
            head.addCurve(
                to: CGPoint(x: 46 * scale, y: 24 * scale),
                control1: CGPoint(x: 18 * scale, y: 12 * scale),
                control2: CGPoint(x: 46 * scale, y: 12 * scale)
            )
            head.addCurve(
                to: CGPoint(x: 32 * scale, y: 50 * scale),
                control1: CGPoint(x: 46 * scale, y: 38 * scale),
                control2: CGPoint(x: 42 * scale, y: 50 * scale)
            )
            head.addCurve(
                to: CGPoint(x: 18 * scale, y: 24 * scale),
                control1: CGPoint(x: 22 * scale, y: 50 * scale),
                control2: CGPoint(x: 18 * scale, y: 38 * scale)
            )
            head.closeSubpath()
            context.stroke(head, with: .color(strokeColor), lineWidth: 2.0 * scale)
            
            // 2. Ears
            var ears = Path()
            ears.move(to: CGPoint(x: 18 * scale, y: 26 * scale))
            ears.addCurve(to: CGPoint(x: 18 * scale, y: 34 * scale), control1: CGPoint(x: 14.5 * scale, y: 26 * scale), control2: CGPoint(x: 14.5 * scale, y: 33 * scale))
            ears.move(to: CGPoint(x: 46 * scale, y: 26 * scale))
            ears.addCurve(to: CGPoint(x: 46 * scale, y: 34 * scale), control1: CGPoint(x: 49.5 * scale, y: 26 * scale), control2: CGPoint(x: 49.5 * scale, y: 33 * scale))
            context.stroke(ears, with: .color(strokeColor), lineWidth: 1.8 * scale)
            
            // 3. Hairline
            var hair = Path()
            hair.move(to: CGPoint(x: 18 * scale, y: 22 * scale))
            hair.addCurve(to: CGPoint(x: 36 * scale, y: 13 * scale), control1: CGPoint(x: 22 * scale, y: 14 * scale), control2: CGPoint(x: 30 * scale, y: 15 * scale))
            hair.addCurve(to: CGPoint(x: 46 * scale, y: 22 * scale), control1: CGPoint(x: 42 * scale, y: 11 * scale), control2: CGPoint(x: 46 * scale, y: 18 * scale))
            context.stroke(hair, with: .color(strokeColor), lineWidth: 2.0 * scale)
            
            // 4. Expression Features by Category
            switch category {
            case .good:
                // Smiling gentle eyes
                var eyes = Path()
                eyes.move(to: CGPoint(x: 22.5 * scale, y: 26 * scale))
                eyes.addCurve(to: CGPoint(x: 29.5 * scale, y: 26 * scale), control1: CGPoint(x: 24.5 * scale, y: 23.8 * scale), control2: CGPoint(x: 27.5 * scale, y: 23.8 * scale))
                eyes.move(to: CGPoint(x: 34.5 * scale, y: 26 * scale))
                eyes.addCurve(to: CGPoint(x: 41.5 * scale, y: 26 * scale), control1: CGPoint(x: 36.5 * scale, y: 23.8 * scale), control2: CGPoint(x: 39.5 * scale, y: 23.8 * scale))
                context.stroke(eyes, with: .color(strokeColor), lineWidth: 2.0 * scale)
                
                // Friendly smile
                var smile = Path()
                smile.move(to: CGPoint(x: 26 * scale, y: 37 * scale))
                smile.addCurve(to: CGPoint(x: 38 * scale, y: 37 * scale), control1: CGPoint(x: 28.5 * scale, y: 42 * scale), control2: CGPoint(x: 35.5 * scale, y: 42 * scale))
                context.stroke(smile, with: .color(strokeColor), lineWidth: 2.0 * scale)
                
            case .moderate:
                // Neutral eyebrows & mouth (IQAir Signature)
                var brows = Path()
                brows.move(to: CGPoint(x: 22 * scale, y: 22 * scale))
                brows.addLine(to: CGPoint(x: 28 * scale, y: 22 * scale))
                brows.move(to: CGPoint(x: 36 * scale, y: 22 * scale))
                brows.addLine(to: CGPoint(x: 42 * scale, y: 22 * scale))
                context.stroke(brows, with: .color(strokeColor), lineWidth: 1.8 * scale)
                
                // Dot eyes
                context.fill(Path(ellipseIn: CGRect(x: 23.5 * scale, y: 25.5 * scale, width: 3.5 * scale, height: 3.5 * scale)), with: .color(strokeColor))
                context.fill(Path(ellipseIn: CGRect(x: 37.5 * scale, y: 25.5 * scale, width: 3.5 * scale, height: 3.5 * scale)), with: .color(strokeColor))
                
                // Straight calm mouth
                var mouth = Path()
                mouth.move(to: CGPoint(x: 26.5 * scale, y: 39 * scale))
                mouth.addLine(to: CGPoint(x: 37.5 * scale, y: 39 * scale))
                context.stroke(mouth, with: .color(strokeColor), lineWidth: 2.0 * scale)
                
            case .unhealthy:
                // Concerned eyebrows
                var brows = Path()
                brows.move(to: CGPoint(x: 22 * scale, y: 23 * scale))
                brows.addLine(to: CGPoint(x: 28 * scale, y: 21 * scale))
                brows.move(to: CGPoint(x: 36 * scale, y: 21 * scale))
                brows.addLine(to: CGPoint(x: 42 * scale, y: 23 * scale))
                context.stroke(brows, with: .color(strokeColor), lineWidth: 1.8 * scale)
                
                // Cautious eyes
                context.fill(Path(ellipseIn: CGRect(x: 23.5 * scale, y: 24.5 * scale, width: 3.5 * scale, height: 3.5 * scale)), with: .color(strokeColor))
                context.fill(Path(ellipseIn: CGRect(x: 37.5 * scale, y: 24.5 * scale, width: 3.5 * scale, height: 3.5 * scale)), with: .color(strokeColor))
                
                // Surgical / Medical face mask
                var mask = Path()
                mask.move(to: CGPoint(x: 19 * scale, y: 31 * scale))
                mask.addCurve(to: CGPoint(x: 45 * scale, y: 31 * scale), control1: CGPoint(x: 23 * scale, y: 29.5 * scale), control2: CGPoint(x: 41 * scale, y: 29.5 * scale))
                mask.addLine(to: CGPoint(x: 43.5 * scale, y: 45 * scale))
                mask.addCurve(to: CGPoint(x: 20.5 * scale, y: 45 * scale), control1: CGPoint(x: 38 * scale, y: 48.5 * scale), control2: CGPoint(x: 26 * scale, y: 48.5 * scale))
                mask.closeSubpath()
                context.stroke(mask, with: .color(strokeColor), lineWidth: 2.0 * scale)
                
            case .hazardous:
                // Troubled angled eyebrows
                var brows = Path()
                brows.move(to: CGPoint(x: 21.5 * scale, y: 23.5 * scale))
                brows.addLine(to: CGPoint(x: 28 * scale, y: 20.5 * scale))
                brows.move(to: CGPoint(x: 36 * scale, y: 20.5 * scale))
                brows.addLine(to: CGPoint(x: 42.5 * scale, y: 23.5 * scale))
                context.stroke(brows, with: .color(strokeColor), lineWidth: 2.0 * scale)
                
                // Alert wide eyes
                context.fill(Path(ellipseIn: CGRect(x: 23 * scale, y: 23.5 * scale, width: 4 * scale, height: 4 * scale)), with: .color(strokeColor))
                context.fill(Path(ellipseIn: CGRect(x: 37 * scale, y: 23.5 * scale, width: 4 * scale, height: 4 * scale)), with: .color(strokeColor))
                
                // N95 Respirator Cup Mask with Valve
                var respirator = Path()
                respirator.move(to: CGPoint(x: 20 * scale, y: 29.5 * scale))
                respirator.addLine(to: CGPoint(x: 32 * scale, y: 26.5 * scale))
                respirator.addLine(to: CGPoint(x: 44 * scale, y: 29.5 * scale))
                respirator.addLine(to: CGPoint(x: 42 * scale, y: 46 * scale))
                respirator.addCurve(to: CGPoint(x: 22 * scale, y: 46 * scale), control1: CGPoint(x: 36.5 * scale, y: 49.5 * scale), control2: CGPoint(x: 27.5 * scale, y: 49.5 * scale))
                respirator.closeSubpath()
                context.stroke(respirator, with: .color(strokeColor), lineWidth: 2.0 * scale)
                
                // Center Valve Circle
                context.stroke(Path(ellipseIn: CGRect(x: 28 * scale, y: 34 * scale, width: 8 * scale, height: 8 * scale)), with: .color(strokeColor), lineWidth: 1.6 * scale)
            }
        }
        .frame(width: size, height: size)
        .accessibilityLabel("Indikator ekspresi mutu udara: \(category.rawValue)")
    }
}

/// Unified Hero AQI Card Component for UdaraJalan Native
public struct HeroAqiCardView: View {
    public let segment: RoadSegment
    
    // EPA US AQI conversion helper
    private var usAqi: Int {
        let pm = segment.currentPM25
        if pm <= 0 { return 0 }
        if pm <= 12.0 {
            return Int(round(((50.0 - 0.0) / (12.0 - 0.0)) * (pm - 0.0) + 0.0))
        } else if pm <= 35.4 {
            return Int(round(((100.0 - 51.0) / (35.4 - 12.1)) * (pm - 12.1) + 51.0))
        } else if pm <= 55.4 {
            return Int(round(((150.0 - 101.0) / (55.4 - 35.5)) * (pm - 35.5) + 101.0))
        } else if pm <= 150.4 {
            return Int(round(((200.0 - 151.0) / (150.4 - 55.5)) * (pm - 55.5) + 151.0))
        } else {
            return min(500, Int(round(((300.0 - 201.0) / (250.4 - 150.5)) * (pm - 150.5) + 201.0)))
        }
    }
    
    private var isModerate: Bool {
        segment.category == .moderate
    }
    
    // Solid background color with strict zero-slop principles
    private var solidCardColor: Color {
        switch segment.category {
        case .good: return Color(red: 0.02, green: 0.59, blue: 0.41)      // #059669 Emerald
        case .moderate: return Color(red: 0.96, green: 0.62, blue: 0.04)  // #F59E0B Amber (IQAir Style)
        case .unhealthy: return Color(red: 0.88, green: 0.11, blue: 0.28) // #E11D48 Crimson Red
        case .hazardous: return Color(red: 0.49, green: 0.13, blue: 0.81) // #7E22CE Purple
        }
    }
    
    private var primaryTextColor: Color {
        isModerate ? Color(red: 0.11, green: 0.16, blue: 0.23) : Color.white
    }
    
    private var secondaryTextColor: Color {
        isModerate ? Color(red: 0.22, green: 0.27, blue: 0.35) : Color.white.opacity(0.85)
    }
    
    public init(segment: RoadSegment) {
        self.segment = segment
    }
    
    public var body: some View {
        VStack(spacing: 0) {
            // Main Content Area
            VStack(alignment: .leading, spacing: 14) {
                // 1. Header: Road Area & Age
                HStack {
                    Text(segment.name)
                        .font(.subheadline)
                        .fontWeight(.bold)
                        .foregroundStyle(primaryTextColor)
                        .lineLimit(1)
                    
                    Spacer()
                    
                    HStack(spacing: 4) {
                        Image(systemName: "clock")
                            .font(.system(size: 11))
                        Text("\(segment.ageInMinutes)m lalu")
                            .font(.caption2)
                            .monospacedDigit()
                    }
                    .foregroundStyle(secondaryTextColor)
                }
                
                // 2. AQI Metric & Expression Avatar
                HStack(alignment: .center, spacing: 14) {
                    // AQI Box
                    VStack(spacing: 2) {
                        Text("\(usAqi)")
                            .font(.system(size: 34, weight: .black, design: .default))
                            .monospacedDigit()
                            .lineLimit(1)
                        Text("US AQI")
                            .font(.system(size: 8, weight: .bold))
                            .textCase(.uppercase)
                            .opacity(0.85)
                    }
                    .foregroundStyle(primaryTextColor)
                    .padding(.horizontal, 12)
                    .padding(.vertical, 8)
                    .background(isModerate ? Color.black.opacity(0.12) : Color.white.opacity(0.20))
                    .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
                    
                    // Category & Pollutant specs
                    VStack(alignment: .leading, spacing: 3) {
                        Text(segment.category.rawValue)
                            .font(.title3)
                            .fontWeight(.heavy)
                            .foregroundStyle(primaryTextColor)
                        
                        Text("Polutan utama: PM2.5 • \(String(format: "%.1f", segment.currentPM25)) µg/m³")
                            .font(.caption)
                            .fontWeight(.medium)
                            .foregroundStyle(secondaryTextColor)
                    }
                    
                    Spacer()
                    
                    // Expression Avatar
                    AirQualityAvatarView(
                        category: segment.category,
                        size: 56,
                        isDarkContrast: isModerate
                    )
                }
                
                // 3. Spectrum Progress Bar
                VStack(spacing: 4) {
                    GeometryReader { geo in
                        let progress = min(1.0, max(0.0, segment.currentPM25 / 65.0))
                        ZStack(alignment: .leading) {
                            Capsule()
                                .fill(isModerate ? Color.black.opacity(0.15) : Color.black.opacity(0.20))
                                .frame(height: 6)
                            Capsule()
                                .fill(isModerate ? Color.black : Color.white)
                                .frame(width: geo.size.width * progress, height: 6)
                        }
                    }
                    .frame(height: 6)
                    
                    HStack {
                        Text("0 Baik").font(.system(size: 9)).monospacedDigit()
                        Spacer()
                        Text("15 Sedang").font(.system(size: 9)).monospacedDigit()
                        Spacer()
                        Text("35 Tdk Sehat").font(.system(size: 9)).monospacedDigit()
                        Spacer()
                        Text("55+ Bahaya").font(.system(size: 9)).monospacedDigit()
                    }
                    .foregroundStyle(secondaryTextColor)
                }
                
                // 4. Trio Mikroklimat Bar (SHT40 Temp, Wind, Humidity)
                HStack {
                    HStack(spacing: 4) {
                        Image(systemName: "sun.max.fill")
                            .font(.system(size: 12))
                        Text("\(String(format: "%.0f", segment.temperature))°C")
                            .font(.caption)
                            .fontWeight(.bold)
                            .monospacedDigit()
                    }
                    
                    Spacer()
                    Divider().frame(height: 12).opacity(0.3)
                    Spacer()
                    
                    HStack(spacing: 4) {
                        Image(systemName: "wind")
                            .font(.system(size: 12))
                        Text("18 km/j")
                            .font(.caption)
                            .fontWeight(.bold)
                            .monospacedDigit()
                    }
                    
                    Spacer()
                    Divider().frame(height: 12).opacity(0.3)
                    Spacer()
                    
                    HStack(spacing: 4) {
                        Image(systemName: "humidity.fill")
                            .font(.system(size: 12))
                        Text("\(String(format: "%.0f", segment.humidity))% RH")
                            .font(.caption)
                            .fontWeight(.bold)
                            .monospacedDigit()
                    }
                }
                .foregroundStyle(primaryTextColor)
                .padding(.horizontal, 12)
                .padding(.vertical, 8)
                .background(isModerate ? Color.black.opacity(0.08) : Color.white.opacity(0.15))
                .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
            }
            .padding(16)
            
            // 5. Contiguous Attribution Footer
            HStack {
                HStack(spacing: 6) {
                    Image(systemName: "scooter")
                        .font(.system(size: 11))
                    Text("\(segment.uniquePassesCount) armada EV tervalidasi")
                        .font(.caption2)
                        .fontWeight(.semibold)
                    Text("•")
                    Text(segment.confidenceScore.rawValue)
                        .font(.caption2)
                        .fontWeight(.semibold)
                }
                
                Spacer()
                
                Text("Data Indikatif")
                    .font(.system(size: 9, weight: .bold))
                    .padding(.horizontal, 6)
                    .padding(.vertical, 2)
                    .background(isModerate ? Color.black.opacity(0.12) : Color.white.opacity(0.20))
                    .clipShape(Capsule())
            }
            .foregroundStyle(primaryTextColor)
            .padding(.horizontal, 16)
            .padding(.vertical, 10)
            .background(isModerate ? Color.black.opacity(0.08) : Color.black.opacity(0.15))
        }
        .background(solidCardColor)
        .clipShape(RoundedRectangle(cornerRadius: 22, style: .continuous))
        .shadow(color: Color.black.opacity(0.06), radius: 8, x: 0, y: 4)
    }
}
