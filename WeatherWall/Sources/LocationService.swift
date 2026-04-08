import Foundation
import CoreLocation

final class LocationService: NSObject, CLLocationManagerDelegate {

    private let manager = CLLocationManager()
    private var continuation: CheckedContinuation<CLLocation?, Never>?
    private var resumed = false

    override init() {
        super.init()
        manager.delegate = self
        manager.desiredAccuracy = kCLLocationAccuracyKilometer
    }

    // MARK: - Public

    /// Returns location using CoreLocation if authorized, otherwise falls back to IP geolocation.
    func fetchLocation() async -> LocationData? {
        // Try CoreLocation first
        if let cl = await coreLocationRequest() {
            let geo = await reverseGeocode(cl)
            return LocationData(latitude: cl.coordinate.latitude,
                                longitude: cl.coordinate.longitude,
                                city: geo.city,
                                region: geo.region,
                                neighborhood: geo.neighborhood)
        }
        // Fallback: IP geolocation
        return await ipGeolocate()
    }

    // MARK: - CoreLocation

    private func coreLocationRequest() async -> CLLocation? {
        let status = manager.authorizationStatus
        if status == .denied || status == .restricted { return nil }

        if status == .notDetermined {
            manager.requestWhenInUseAuthorization()
            try? await Task.sleep(nanoseconds: 3_000_000_000)
            guard manager.authorizationStatus == .authorized ||
                  manager.authorizationStatus == .authorizedAlways else { return nil }
        }

        resumed = false
        return await withCheckedContinuation { cont in
            self.continuation = cont
            manager.requestLocation()

            // Timeout after 10 s
            DispatchQueue.main.asyncAfter(deadline: .now() + 10) { [weak self] in
                guard let self = self, !self.resumed else { return }
                self.resumed = true
                self.continuation?.resume(returning: nil)
                self.continuation = nil
            }
        }
    }

    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        guard !resumed else { return }
        resumed = true
        continuation?.resume(returning: locations.first)
        continuation = nil
    }

    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        guard !resumed else { return }
        resumed = true
        continuation?.resume(returning: nil)
        continuation = nil
    }

    // MARK: - Reverse Geocode

    private func reverseGeocode(_ location: CLLocation) async -> (city: String, region: String, neighborhood: String) {
        let geocoder = CLGeocoder()
        let placemarks = try? await geocoder.reverseGeocodeLocation(location)
        guard let p = placemarks?.first else { return ("—", "", "") }
        return (
            city: p.locality ?? "—",
            region: p.administrativeArea ?? "",
            neighborhood: p.subLocality ?? ""
        )
    }

    // MARK: - IP Geolocation Fallback

    private func ipGeolocate() async -> LocationData? {
        guard let url = URL(string: "http://ip-api.com/json/?fields=lat,lon,city,regionName") else { return nil }
        guard let (data, _) = try? await URLSession.shared.data(from: url) else { return nil }
        guard let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
              let lat    = json["lat"] as? Double,
              let lon    = json["lon"] as? Double,
              let city   = json["city"] as? String,
              let region = json["regionName"] as? String else { return nil }
        return LocationData(latitude: lat, longitude: lon, city: city, region: region)
    }
}
