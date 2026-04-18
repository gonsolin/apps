import Foundation

final class WeatherService {

    private let baseURL = "https://api.open-meteo.com/v1/forecast"

    /// Fetch current weather **and** today's sunrise/sunset for the given coordinates.
    /// Sunrise/sunset are returned as Unix timestamps (UTC) to avoid timezone parsing errors.
    /// The response also includes `utc_offset_seconds` so the caller can compute
    /// what time it is locally at the queried location.
    func fetch(latitude: Double, longitude: Double) async -> WeatherData? {
        let urlString = "\(baseURL)?latitude=\(latitude)&longitude=\(longitude)"
                      + "&current_weather=true"
                      + "&daily=sunrise,sunset"
                      + "&temperature_unit=fahrenheit"
                      + "&timezone=auto"
                      + "&timeformat=unixtime"           // ← sunrise/sunset as epoch seconds
        guard let url = URL(string: urlString) else { return nil }
        guard let (data, _) = try? await URLSession.shared.data(from: url) else { return nil }
        guard let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
              let cw   = json["current_weather"] as? [String: Any],
              let temp  = cw["temperature"] as? Double,
              let wind  = cw["windspeed"]   as? Double,
              let code  = cw["weathercode"] as? Int,
              let isDay = cw["is_day"]      as? Int else { return nil }

        // UTC offset for the queried location (e.g. 7200 for CEST, -25200 for PDT)
        let utcOffset = json["utc_offset_seconds"] as? Int ?? 0

        // Parse sunrise / sunset as Unix timestamps (seconds since epoch)
        var sunrise: Date?
        var sunset: Date?
        if let daily = json["daily"] as? [String: Any],
           let sunriseArr = daily["sunrise"] as? [Any],
           let sunsetArr  = daily["sunset"]  as? [Any],
           let riseVal = sunriseArr.first,
           let setVal  = sunsetArr.first {
            if let riseEpoch = riseVal as? Double {
                sunrise = Date(timeIntervalSince1970: riseEpoch)
            } else if let riseEpoch = riseVal as? Int {
                sunrise = Date(timeIntervalSince1970: Double(riseEpoch))
            }
            if let setEpoch = setVal as? Double {
                sunset = Date(timeIntervalSince1970: setEpoch)
            } else if let setEpoch = setVal as? Int {
                sunset = Date(timeIntervalSince1970: Double(setEpoch))
            }
        }

        let condition = WeatherCondition.from(code: code)
        return WeatherData(temperature: temp,
                           windSpeed: wind,
                           weatherCode: code,
                           isDay: isDay == 1,
                           condition: condition,
                           sunrise: sunrise,
                           sunset: sunset,
                           utcOffsetSeconds: utcOffset)
    }
}
