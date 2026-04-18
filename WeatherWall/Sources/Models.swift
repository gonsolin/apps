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

    /// Compute the time-of-day **at the target location** using sunrise/sunset when
    /// available, falling back to fixed clock hours in the location's timezone.
    ///
    /// - Parameters:
    ///   - sunrise: Today's sunrise at the target location (UTC Date).
    ///   - sunset:  Today's sunset  at the target location (UTC Date).
    ///   - utcOffsetSeconds: The target location's UTC offset so the fixed-hour
    ///     fallback uses the correct local clock (e.g. 7200 for CEST, -25200 for PDT).
    ///     Pass `nil` to use the Mac's system timezone.
    static func current(sunrise: Date? = nil, sunset: Date? = nil,
                        utcOffsetSeconds: Int? = nil) -> TimeOfDay {
        let now = Date()

        // When sunrise/sunset are available (as UTC absolute dates from Open-Meteo),
        // the comparison against `now` (also UTC) is timezone-correct.
        if let rise = sunrise, let set = sunset {
            let dawnStart    = rise.addingTimeInterval(-30 * 60)
            let morningStart = rise.addingTimeInterval(45 * 60)
            let solarNoon    = Date(timeIntervalSince1970:
                (rise.timeIntervalSince1970 + set.timeIntervalSince1970) / 2)
            let goldenStart  = set.addingTimeInterval(-75 * 60)
            let eveningStart = set.addingTimeInterval(20 * 60)
            let nightStart   = set.addingTimeInterval(60 * 60)

            if now < dawnStart    { return .night }
            if now < morningStart { return .dawn }
            if now < solarNoon    { return .morning }
            if now < goldenStart  { return .afternoon }
            if now < eveningStart { return .sunset }
            if now < nightStart   { return .evening }
            return .night
        }

        // Fixed-hour fallback — compute the hour at the target location's timezone.
        let localHour: Int
        if let offset = utcOffsetSeconds {
            let tz = TimeZone(secondsFromGMT: offset) ?? .current
            var cal = Calendar(identifier: .gregorian)
            cal.timeZone = tz
            localHour = cal.component(.hour, from: now)
        } else {
            localHour = Calendar.current.component(.hour, from: now)
        }

        switch localHour {
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

    var displayName: String {
        switch self {
        case .night:     return "Night"
        case .dawn:      return "Dawn"
        case .morning:   return "Morning"
        case .afternoon: return "Afternoon"
        case .sunset:    return "Sunset"
        case .evening:   return "Evening"
        }
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

/// Build a cascade of search queries from most specific to broadest.
/// The image service tries them in order until one returns results.
///
/// Example output for Inner Sunset + sunny + afternoon:
///   1. "Inner Sunset San Francisco sunny clear sky afternoon"
///   2. "San Francisco sunny clear sky afternoon"
///   3. "San Francisco sunny clear sky"
///   4. "San Francisco"
func buildSearchQueries(location: LocationData, condition: WeatherCondition, timeOfDay: TimeOfDay) -> [String] {
    let city    = location.city.isEmpty ? "" : location.city
    let hood    = !location.neighborhood.isEmpty ? location.neighborhood
                : !location.areaOfInterest.isEmpty ? location.areaOfInterest
                : ""
    let weather = condition.searchTerm
    let time    = timeOfDay.searchModifier

    var queries: [String] = []

    // 1. Neighborhood + city + weather + time  (most specific)
    if !hood.isEmpty {
        queries.append([hood, city, weather, time].joined(separator: " "))
    }

    // 2. City + weather + time
    if !city.isEmpty {
        queries.append([city, weather, time].joined(separator: " "))
    }

    // 3. City + weather  (drop time-of-day)
    if !city.isEmpty {
        queries.append([city, weather].joined(separator: " "))
    }

    // 4. City only  (broadest geographic anchor)
    if !city.isEmpty {
        queries.append(city)
    }

    return queries
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
    let utcOffsetSeconds: Int   // location's UTC offset (e.g. 7200 for CEST, -25200 for PDT)
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

// MARK: - User Overrides

/// Persistent overrides the user can set from the menu bar.
/// When an override is active, the auto-detected value is replaced.
struct UserOverrides: Codable {
    var locationName: String?        // e.g. "Financial District, San Francisco"
    var locationLatitude: Double?    // geocoded lat for weather/timezone
    var locationLongitude: Double?   // geocoded lon for weather/timezone
    var weatherCondition: String?    // raw value of WeatherCondition
    var timeOfDay: String?           // raw value of TimeOfDay
    var isLocked: Bool = false       // freeze the current wallpaper

    var overriddenCondition: WeatherCondition? {
        guard let raw = weatherCondition else { return nil }
        return WeatherCondition(rawValue: raw)
    }

    var overriddenTimeOfDay: TimeOfDay? {
        guard let raw = timeOfDay else { return nil }
        return TimeOfDay(rawValue: raw)
    }

    // MARK: Persistence

    private static var fileURL: URL {
        let base = FileManager.default.urls(for: .applicationSupportDirectory,
                                            in: .userDomainMask).first!
        let dir = base.appendingPathComponent("WeatherWall", isDirectory: true)
        try? FileManager.default.createDirectory(at: dir, withIntermediateDirectories: true)
        return dir.appendingPathComponent("overrides.json")
    }

    static func load() -> UserOverrides {
        guard let data = try? Data(contentsOf: fileURL),
              let obj = try? JSONDecoder().decode(UserOverrides.self, from: data)
        else { return UserOverrides() }
        return obj
    }

    func save() {
        if let data = try? JSONEncoder().encode(self) {
            try? data.write(to: Self.fileURL, options: .atomic)
        }
    }
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
