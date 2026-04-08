import CoreGraphics
import Foundation

/// Generates procedural sky wallpapers using Core Graphics.
final class WallpaperRenderer {

    // MARK: - Public

    func render(condition: WeatherCondition, timeOfDay: TimeOfDay, size: CGSize) -> CGImage? {
        guard let ctx = createContext(size: size) else { return nil }

        drawSkyGradient(ctx: ctx, condition: condition, timeOfDay: timeOfDay, size: size)
        drawHorizonGlow(ctx: ctx, timeOfDay: timeOfDay, size: size)

        if timeOfDay == .night || timeOfDay == .evening {
            drawStars(ctx: ctx, condition: condition, size: size)
        }

        if !timeOfDay.isNight {
            drawSun(ctx: ctx, timeOfDay: timeOfDay, condition: condition, size: size)
        } else {
            drawMoon(ctx: ctx, condition: condition, size: size)
        }

        if condition.hasClouds {
            drawClouds(ctx: ctx, condition: condition, timeOfDay: timeOfDay, size: size)
        }

        if condition.hasRain {
            drawRain(ctx: ctx, condition: condition, size: size)
        }

        if condition == .snowy {
            drawSnow(ctx: ctx, size: size)
        }

        if condition == .foggy {
            drawFog(ctx: ctx, size: size)
        }

        return ctx.makeImage()
    }

    // MARK: - Context

    private func createContext(size: CGSize) -> CGContext? {
        CGContext(data: nil,
                  width: Int(size.width),
                  height: Int(size.height),
                  bitsPerComponent: 8,
                  bytesPerRow: 0,
                  space: CGColorSpaceCreateDeviceRGB(),
                  bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)
    }

    // MARK: - Sky Gradient

    private func drawSkyGradient(ctx: CGContext, condition: WeatherCondition, timeOfDay: TimeOfDay, size: CGSize) {
        let palette = resolvedPalette(condition: condition, timeOfDay: timeOfDay)
        guard let gradient = CGGradient(colorsSpace: CGColorSpaceCreateDeviceRGB(),
                                        colors: palette.cgColors() as CFArray,
                                        locations: palette.locations) else { return }

        ctx.drawLinearGradient(gradient,
                               start: CGPoint(x: size.width / 2, y: size.height),  // top
                               end:   CGPoint(x: size.width / 2, y: 0),            // bottom
                               options: [.drawsBeforeStartLocation, .drawsAfterEndLocation])
    }

    // MARK: - Horizon Glow

    private func drawHorizonGlow(ctx: CGContext, timeOfDay: TimeOfDay, size: CGSize) {
        let (r, g, b, a): (CGFloat, CGFloat, CGFloat, CGFloat)
        switch timeOfDay {
        case .dawn, .sunset:    (r, g, b, a) = (1.0,  0.55, 0.15, 0.35)
        case .morning:          (r, g, b, a) = (0.65, 0.82, 1.0,  0.12)
        case .afternoon:        (r, g, b, a) = (0.70, 0.85, 1.0,  0.10)
        case .evening:          (r, g, b, a) = (0.45, 0.18, 0.28, 0.20)
        case .night:            (r, g, b, a) = (0.08, 0.08, 0.18, 0.10)
        }

        let colors = [
            CGColor(red: r, green: g, blue: b, alpha: a),
            CGColor(red: r, green: g, blue: b, alpha: 0)
        ] as CFArray

        guard let grad = CGGradient(colorsSpace: CGColorSpaceCreateDeviceRGB(),
                                    colors: colors, locations: [0, 1]) else { return }

        ctx.drawLinearGradient(grad,
                               start: CGPoint(x: size.width / 2, y: 0),
                               end:   CGPoint(x: size.width / 2, y: size.height * 0.4),
                               options: [.drawsBeforeStartLocation])
    }

    // MARK: - Stars

    private func drawStars(ctx: CGContext, condition: WeatherCondition, size: CGSize) {
        let density: CGFloat
        switch condition {
        case .clear:        density = 1.0
        case .partlyCloudy: density = 0.5
        default:            density = 0.15
        }

        let count = Int(size.width * size.height / 18000 * density)
        // Use a deterministic seed so stars stay put within the same hour
        srand48(Int(Date().timeIntervalSince1970 / 3600))

        for _ in 0..<count {
            let x = CGFloat(drand48()) * size.width
            let y = CGFloat(drand48()) * size.height * 0.85 + size.height * 0.15 // upper 85 %
            let radius   = CGFloat(drand48()) * 1.5 + 0.4
            let bright   = CGFloat(drand48()) * 0.6 + 0.4

            ctx.setFillColor(CGColor(red: 1, green: 1, blue: bright * 0.85 + 0.15, alpha: bright))
            ctx.fillEllipse(in: CGRect(x: x - radius, y: y - radius,
                                       width: radius * 2, height: radius * 2))
        }
    }

    // MARK: - Sun

    private func drawSun(ctx: CGContext, timeOfDay: TimeOfDay, condition: WeatherCondition, size: CGSize) {
        // Don't draw a visible sun behind heavy clouds
        if condition == .cloudy || condition == .rainy || condition == .stormy || condition == .foggy { return }

        let (cx, cy, intensity): (CGFloat, CGFloat, CGFloat)
        switch timeOfDay {
        case .dawn:      (cx, cy, intensity) = (size.width * 0.72, size.height * 0.12, 0.7)
        case .morning:   (cx, cy, intensity) = (size.width * 0.70, size.height * 0.65, 0.9)
        case .afternoon: (cx, cy, intensity) = (size.width * 0.48, size.height * 0.78, 1.0)
        case .sunset:    (cx, cy, intensity) = (size.width * 0.28, size.height * 0.12, 0.75)
        default:         return
        }
        let center = CGPoint(x: cx, y: cy)
        let baseR  = min(size.width, size.height) * 0.04

        // Outer glow
        let glowR = baseR * 5
        if let glow = CGGradient(colorsSpace: CGColorSpaceCreateDeviceRGB(), colors: [
            CGColor(red: 1, green: 0.88, blue: 0.45, alpha: 0.30 * intensity),
            CGColor(red: 1, green: 0.80, blue: 0.30, alpha: 0.0)
        ] as CFArray, locations: [0, 1]) {
            ctx.drawRadialGradient(glow, startCenter: center, startRadius: 0,
                                   endCenter: center, endRadius: glowR, options: [])
        }

        // Inner disc
        if let disc = CGGradient(colorsSpace: CGColorSpaceCreateDeviceRGB(), colors: [
            CGColor(red: 1.0, green: 1.0,  blue: 0.95, alpha: intensity),
            CGColor(red: 1.0, green: 0.85, blue: 0.42, alpha: 0.8 * intensity),
            CGColor(red: 1.0, green: 0.72, blue: 0.22, alpha: 0.0)
        ] as CFArray, locations: [0, 0.4, 1]) {
            ctx.drawRadialGradient(disc, startCenter: center, startRadius: 0,
                                   endCenter: center, endRadius: baseR, options: [])
        }
    }

    // MARK: - Moon

    private func drawMoon(ctx: CGContext, condition: WeatherCondition, size: CGSize) {
        if condition == .cloudy || condition == .stormy || condition == .foggy { return }

        let center = CGPoint(x: size.width * 0.75, y: size.height * 0.82)
        let radius = min(size.width, size.height) * 0.025
        let alpha: CGFloat = condition == .clear ? 0.95 : 0.55

        // Glow
        if let glow = CGGradient(colorsSpace: CGColorSpaceCreateDeviceRGB(), colors: [
            CGColor(red: 0.85, green: 0.88, blue: 1.0, alpha: 0.25 * alpha),
            CGColor(red: 0.85, green: 0.88, blue: 1.0, alpha: 0.0)
        ] as CFArray, locations: [0, 1]) {
            ctx.drawRadialGradient(glow, startCenter: center, startRadius: 0,
                                   endCenter: center, endRadius: radius * 5, options: [])
        }

        // Disc
        ctx.setFillColor(CGColor(red: 0.92, green: 0.93, blue: 0.98, alpha: alpha))
        ctx.fillEllipse(in: CGRect(x: center.x - radius, y: center.y - radius,
                                   width: radius * 2, height: radius * 2))

        // Crescent shadow — slightly offset circle in the background color
        let shadowOffset = radius * 0.45
        ctx.setFillColor(CGColor(red: 0.04, green: 0.04, blue: 0.12, alpha: alpha * 0.85))
        ctx.fillEllipse(in: CGRect(x: center.x - radius + shadowOffset,
                                   y: center.y - radius + shadowOffset * 0.4,
                                   width: radius * 1.7, height: radius * 1.7))
    }

    // MARK: - Clouds

    private func drawClouds(ctx: CGContext, condition: WeatherCondition, timeOfDay: TimeOfDay, size: CGSize) {
        let count: Int
        switch condition {
        case .partlyCloudy, .drizzle: count = 5
        case .cloudy, .foggy:         count = 10
        case .rainy, .stormy:         count = 12
        default:                      count = 3
        }

        let cloudAlpha: CGFloat
        let cloudBrightness: CGFloat
        switch condition {
        case .stormy:         cloudAlpha = 0.75; cloudBrightness = 0.30
        case .rainy:          cloudAlpha = 0.65; cloudBrightness = 0.45
        case .cloudy:         cloudAlpha = 0.55; cloudBrightness = 0.70
        default:              cloudAlpha = 0.40; cloudBrightness = 0.92
        }

        let nightDarken: CGFloat = timeOfDay.isNight ? 0.55 : 1.0
        let b = cloudBrightness * nightDarken

        srand48(Int(Date().timeIntervalSince1970 / 1800) &* 7)

        for _ in 0..<count {
            let cx = CGFloat(drand48()) * size.width * 1.2 - size.width * 0.1
            let cy = CGFloat(drand48()) * size.height * 0.65 + size.height * 0.25
            let scale = CGFloat(drand48()) * 0.7 + 0.5

            drawSingleCloud(ctx: ctx, center: CGPoint(x: cx, y: cy), scale: scale * min(size.width, size.height) * 0.001,
                            color: CGColor(red: b, green: b, blue: b + 0.03, alpha: cloudAlpha))
        }
    }

    private func drawSingleCloud(ctx: CGContext, center: CGPoint, scale: CGFloat, color: CGColor) {
        // A cloud is a cluster of overlapping ellipses
        let parts: [(dx: CGFloat, dy: CGFloat, rx: CGFloat, ry: CGFloat)] = [
            ( 0,    0,   60, 40),
            (-50, -10,   45, 32),
            ( 50, -10,   45, 32),
            (-25,  18,   52, 35),
            ( 25,  18,   52, 35),
            (  0,  28,   38, 25),
        ]

        ctx.setFillColor(color)
        for p in parts {
            let rect = CGRect(x: center.x + p.dx * scale - p.rx * scale,
                              y: center.y + p.dy * scale - p.ry * scale,
                              width: p.rx * 2 * scale,
                              height: p.ry * 2 * scale)
            ctx.fillEllipse(in: rect)
        }
    }

    // MARK: - Rain

    private func drawRain(ctx: CGContext, condition: WeatherCondition, size: CGSize) {
        let layers: [(count: Int, alpha: CGFloat, width: CGFloat)] = condition == .stormy
            ? [(250, 0.12, 0.6), (200, 0.20, 0.8), (150, 0.30, 1.0), (100, 0.40, 1.3)]
            : [(180, 0.10, 0.5), (140, 0.18, 0.7), (100, 0.28, 1.0)]

        let angle: CGFloat = .pi / 7  // slight slant

        for layer in layers {
            ctx.setStrokeColor(CGColor(red: 0.58, green: 0.62, blue: 0.72, alpha: layer.alpha))
            ctx.setLineWidth(layer.width)
            ctx.setLineCap(.round)

            for _ in 0..<layer.count {
                let x = CGFloat.random(in: -40...size.width + 40)
                let y = CGFloat.random(in: 0...size.height)
                let len = CGFloat.random(in: 18...42) * (layer.alpha + 0.5)

                ctx.move(to: CGPoint(x: x, y: y))
                ctx.addLine(to: CGPoint(x: x + sin(angle) * len, y: y - cos(angle) * len))
            }
            ctx.strokePath()
        }
    }

    // MARK: - Snow

    private func drawSnow(ctx: CGContext, size: CGSize) {
        let count = Int(size.width * size.height / 12000)

        for _ in 0..<count {
            let x = CGFloat.random(in: 0...size.width)
            let y = CGFloat.random(in: 0...size.height)
            let r = CGFloat.random(in: 1...4)
            let a = CGFloat.random(in: 0.25...0.85)

            ctx.setFillColor(CGColor(red: 1, green: 1, blue: 1, alpha: a))
            ctx.fillEllipse(in: CGRect(x: x - r, y: y - r, width: r * 2, height: r * 2))
        }
    }

    // MARK: - Fog

    private func drawFog(ctx: CGContext, size: CGSize) {
        for i in 0..<6 {
            let bandY = CGFloat(i) * size.height / 6
            let bandH = size.height / 3.5
            let a: CGFloat = 0.18 - CGFloat(i) * 0.025

            let colors = [
                CGColor(red: 0.88, green: 0.88, blue: 0.90, alpha: max(a, 0)),
                CGColor(red: 0.88, green: 0.88, blue: 0.90, alpha: max(a * 0.4, 0)),
                CGColor(red: 0.88, green: 0.88, blue: 0.90, alpha: 0)
            ] as CFArray

            guard let grad = CGGradient(colorsSpace: CGColorSpaceCreateDeviceRGB(),
                                        colors: colors, locations: [0, 0.5, 1]) else { continue }

            ctx.drawLinearGradient(grad,
                                   start: CGPoint(x: size.width / 2, y: bandY),
                                   end:   CGPoint(x: size.width / 2, y: bandY + bandH),
                                   options: [])
        }
    }

    // MARK: - Palettes

    private func basePalette(for timeOfDay: TimeOfDay) -> SkyPalette {
        switch timeOfDay {
        case .night:
            return SkyPalette(
                colors: [(0.01, 0.01, 0.06), (0.03, 0.03, 0.12), (0.06, 0.06, 0.18)],
                locations: [0, 0.5, 1])
        case .dawn:
            return SkyPalette(
                colors: [(0.08, 0.05, 0.18), (0.30, 0.12, 0.22), (0.60, 0.22, 0.18),
                          (0.88, 0.42, 0.15), (0.96, 0.68, 0.28)],
                locations: [0, 0.25, 0.50, 0.75, 1])
        case .morning:
            return SkyPalette(
                colors: [(0.18, 0.44, 0.84), (0.34, 0.58, 0.88), (0.55, 0.74, 0.92)],
                locations: [0, 0.5, 1])
        case .afternoon:
            return SkyPalette(
                colors: [(0.12, 0.36, 0.80), (0.26, 0.52, 0.86), (0.46, 0.68, 0.92)],
                locations: [0, 0.5, 1])
        case .sunset:
            return SkyPalette(
                colors: [(0.08, 0.04, 0.20), (0.32, 0.08, 0.26), (0.68, 0.16, 0.18),
                          (0.92, 0.38, 0.12), (0.96, 0.62, 0.18)],
                locations: [0, 0.25, 0.50, 0.75, 1])
        case .evening:
            return SkyPalette(
                colors: [(0.02, 0.02, 0.07), (0.08, 0.04, 0.14), (0.18, 0.07, 0.12)],
                locations: [0, 0.5, 1])
        }
    }

    private func resolvedPalette(condition: WeatherCondition, timeOfDay: TimeOfDay) -> SkyPalette {
        let base = basePalette(for: timeOfDay)

        switch condition {
        case .clear:
            return base
        case .partlyCloudy:
            return base.blended(toward: (0.52, 0.52, 0.56), amount: 0.18)
        case .cloudy:
            return base.blended(toward: (0.48, 0.48, 0.52), amount: 0.35)
        case .foggy:
            return base.blended(toward: (0.68, 0.68, 0.70), amount: 0.50)
        case .drizzle:
            return base.blended(toward: (0.35, 0.37, 0.42), amount: 0.35)
        case .rainy:
            return base.blended(toward: (0.22, 0.24, 0.30), amount: 0.48)
        case .snowy:
            return base.blended(toward: (0.62, 0.64, 0.70), amount: 0.42)
        case .stormy:
            return base.blended(toward: (0.12, 0.10, 0.18), amount: 0.58)
        }
    }
}
