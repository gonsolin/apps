import Foundation

final class WeatherService {

    private let baseURL = "https://api.open-meteo.com/v1/forecast"

    /// Fetch current weather for the given coordinates.  Returns nil on failure.
    func fetch(latitude: Double, longitude: Double) async -> WeatherData? {
        let urlString = "\(baseURL)?latitude=\(latitude)&longitude=\(longitude)" +
                        "&current_weather=true&temperature_unit=fahrenheit&timezone=auto"
        guard let url = URL(string: urlString) else { return nil }
        guard let (data, _) = try? await URLSession.shared.data(from: url) else { return nil }
        guard let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
              let cw   = json["current_weather"] as? [String: Any],
              let temp  = cw["temperature"] as? Double,
              let wind  = cw["windspeed"]   as? Double,
              let code  = cw["weathercode"] as? Int,
              let isDay = cw["is_day"]      as? Int else { return nil }

        let condition = WeatherCondition.from(code: code)
        return WeatherData(temperature: temp,
                           windSpeed: wind,
                           weatherCode: code,
                           isDay: isDay == 1,
                           condition: condition)
    }
}
