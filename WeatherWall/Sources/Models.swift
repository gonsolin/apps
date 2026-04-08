import Foundation
import CoreGraphics

// MARK: - Weather Condition

enum WeatherCondition: String {
    case clear
    case partlyCloudy
    case cloudy
    case foggy
    case drizzle
    case rainy
    case snowy
    case stormy

    var displayName: String {
        switch self {
        case .clear:        return "Clear Sky"
        case .partlyCloudy: return "Partly Cloudy"
        case .cloudy:       return "Overcast"
        case .foggy:        return "Foggy"
        case .drizzle:      return "Drizzle"
        case .rainy:        return "Rainy"
        case .snowy:        return "Snowy"
        case .stormy:       return "Thunderstorm"
        }
    }

    var sfSymbol: String {
        switch self {
        case .clear:        return "sun.max.fill"
        case .partlyCloudy: return "cloud.sun.fill"
        case .cloudy:       return "cloud.fill"
        case .foggy:        return "cloud.fog.fill"
        case .drizzle:      return "cloud.drizzle.fill"
        case .rainy:        return "cloud.rain.fill"
        case .snowy:        return "cloud.snow.fill"
        case .stormy:       return "cloud.bolt.rain.fill"
        }
    }

    var nightSfSymbol: String {
        switch self {
        case .clear:        return "moon.stars.fill"
        case .partlyCloudy: return "cloud.moon.fill"
        default:            return sfSymbol
        }
    }

    var hasClouds: Bool {
        switch self {
        case .clear: return false
        default:     return true
        }
    }

    var hasRain: Bool {
        switch self {
        case .drizzle, .rainy, .stormy: return true
        default: return false
        }
    }

    /// Short keyword for image search queries.
    var searchTerm: String {
        switch self {
        case .clear:        return "sunny clear sky"
        case .partlyCloudy: return "cloudy"
        case .cloudy:       return "overcast"
        case .foggy:        return "fog"
        case .drizzle:      return "rain"
        case .rainy:        return "rain"
        case .snowy:        return "snow"
        case .stormy:       return "storm"
        }
    }

    /// Map WMO weather code to our condition enum
    static func from(code: Int) -> WeatherCondition {
        switch code {
        case 0...1:                     return .clear
        case 2:                         return .partlyCloudy
        case 3:                         return .cloudy
        case 45, 48:                    return .foggy
        case 51, 53, 55, 56, 57:       return .drizzle
        case 61, 63, 65, 66, 67, 80, 81, 82: return .rainy
        case 71, 73, 75, 77, 85, 86:   return .snowy
        case 95, 96, 99:               return .stormy
        default:                        return .partlyCloudy
        }
    }
}

// MARK: - Time of Day

enum TimeOfDay: String {
    case night      // 10pm – 5am
    case dawn       // 5am – 7am
    case morning    // 7am – 12pm
    case afternoon  // 12pm – 5pm
    case sunset     // 5pm – 7pm
    case evening    // 7pm – 10pm

    /// Compute the current time-of-day using actual sunrise/sunset when available,
    /// falling back to fixed clock hours otherwise.
    static func current(sunrise: Date? = nil, sunset: Date? = nil) -> TimeOfDay {
        let now = Date()

        if let rise = sunrise, let set = sunset {
            let dawnStart    = rise.addingTimeInterval(-30 * 60)   // 30 min before sunrise
            let morningStart = rise.addingTimeInterval(45 * 60)    // 45 min after sunrise
            let solarNoon    = Date(timeIntervalSince1970:
                (rise.timeIntervalSince1970 + set.timeIntervalSince1970) / 2)
            let goldenStart  = set.addingTimeInterval(-75 * 60)    // 75 min before sunset
            let eveningStart = set.addingTimeInterval(20 * 60)     // 20 min after sunset
            let nightStart   = set.addingTimeInterval(60 * 60)     // 60 min after sunset

            if now < dawnStart    { return .night }
            if now < morningStart { return .dawn }
            if now < solarNoon    { return .morning }
            if now < goldenStart  { return .afternoon }
            if now < eveningStart { return .sunset }
            if now < nightStart   { return .evening }
            return .night
        }

        // Fixed-hour fallback
        let hour = Calendar.current.component(.hour, from: now)
        switch hour {
        case 0..<5:   return .night
        case 5..<7:   return .dawn
        case 7..<12:  return .morning
        case 12..<17: return .afternoon
        case 17..<19: return .sunset
        case 19..<22: return .evening
        default:      return .night
        }
    }

    var isNight: Bool {
        self == .night || self == .evening
    }

    /// Photographic search term matching how images are tagged on Unsplash.
    var searchModifier: String {
        switch self {
        case .night:     return "night"
        case .dawn:      return "sunrise"
        case .morning:   return "morning"
        case .afternoon: return "afternoon"
        case .sunset:    return "sunset golden hour"
        case .evening:   return "dusk twilight"
        }
    }
}

// MARK: - Search Query Builder

func buildSearchQuery(location: LocationData, condition: WeatherCondition, timeOfDay: TimeOfDay) -> String {
    var parts: [String] = []

    // Neighborhood first — it's the most specific geographic signal.
    // e.g. "Inner Sunset" or "Financial District"
    if !location.neighborhood.isEmpty {
        parts.append(location.neighborhood)
    }
    // Area of interest adds landmarks ("Golden Gate Park", "Embarcadero")
    // but only if we don't already have a neighborhood to avoid query bloat.
    else if !location.areaOfInterest.isEmpty {
        parts.append(location.areaOfInterest)
    }

    // City anchors the broader location.
    if !location.city.isEmpty {
        parts.append(location.city)
    }

    parts.append(condition.searchTerm)
    parts.append(timeOfDay.searchModifier)

    return parts.joined(separator: " ")
}

// MARK: - Weather Data

struct WeatherData {
    let temperature: Double
    let windSpeed: Double
    let weatherCode: Int
    let isDay: Bool
    let condition: WeatherCondition
    let sunrise: Date?
    let sunset: Date?
}

// MARK: - Location Data

struct LocationData {
    let latitude: Double
    let longitude: Double
    let city: String
    let region: String
    var neighborhood: String = ""   // e.g. "Inner Sunset", "Financial District"
    var areaOfInterest: String = "" // e.g. "Golden Gate Park"
}

// MARK: - Sky Palette

struct SkyPalette {
    let colors: [(r: CGFloat, g: CGFloat, b: CGFloat)]
    let locations: [CGFloat]

    func cgColors(alpha: CGFloat = 1.0) -> [CGColor] {
        colors.map { CGColor(red: $0.r, green: $0.g, blue: $0.b, alpha: alpha) }
    }

    /// Blend palette toward a target gray to simulate weather desaturation
    func blended(toward target: (r: CGFloat, g: CGFloat, b: CGFloat), amount: CGFloat) -> SkyPalette {
        let blended = colors.map { c in
            (
                r: c.r + (target.r - c.r) * amount,
                g: c.g + (target.g - c.g) * amount,
                b: c.b + (target.b - c.b) * amount
            )
        }
        return SkyPalette(colors: blended, locations: locations)
    }
}
