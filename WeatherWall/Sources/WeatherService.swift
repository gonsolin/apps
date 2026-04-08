import Foundation

final class WeatherService {

    private let baseURL = "https://api.open-meteo.com/v1/forecast"

    /// Fetch current weather **and** today's sunrise/sunset for the given coordinates.
    func fetch(latitude: Double, longitude: Double) async -> WeatherData? {
        let urlString = "\(baseURL)?latitude=\(latitude)&longitude=\(longitude)"
                      + "&current_weather=true"
                      + "&daily=sunrise,sunset"
                      + "&temperature_unit=fahrenheit"
                      + "&timezone=auto"
        guard let url = URL(string: urlString) else { return nil }
        guard let (data, _) = try? await URLSession.shared.data(from: url) else { return nil }
        guard let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
              let cw   = json["current_weather"] as? [String: Any],
              let temp  = cw["temperature"] as? Double,
              let wind  = cw["windspeed"]   as? Double,
              let code  = cw["weathercode"] as? Int,
              let isDay = cw["is_day"]      as? Int else { return nil }

        // Parse sunrise / sunset (ISO 8601 local time, e.g. "2026-04-08T06:38")
        var sunrise: Date?
        var sunset: Date?
        if let daily = json["daily"] as? [String: Any],
           let sunriseArr = daily["sunrise"] as? [String],
           let sunsetArr  = daily["sunset"]  as? [String],
           let riseStr = sunriseArr.first,
           let setStr  = sunsetArr.first {
            let fmt = ISO8601DateFormatter()
            fmt.formatOptions = [.withFullDate, .withDashSeparatorInDate,
                                 .withTime, .withColonSeparatorInTime]
            // Open-Meteo returns local time without a timezone offset,
            // so we parse in the current system calendar.
            let localFmt = DateFormatter()
            localFmt.dateFormat = "yyyy-MM-dd'T'HH:mm"
            localFmt.locale = Locale(identifier: "en_US_POSIX")
            sunrise = localFmt.date(from: riseStr)
            sunset  = localFmt.date(from: setStr)
        }

        let condition = WeatherCondition.from(code: code)
        return WeatherData(temperature: temp,
                           windSpeed: wind,
                           weatherCode: code,
                           isDay: isDay == 1,
                           condition: condition,
                           sunrise: sunrise,
                           sunset: sunset)
    }
}
