import Foundation
import CoreLocation

final class LocationService: NSObject, CLLocationManagerDelegate {

    private let manager = CLLocationManager()
    private var continuation: CheckedContinuation<CLLocation?, Never>?
    private var resumed = false

    /// Tracks the last known neighborhood so we can detect when the user moves.
    private var lastNeighborhood: String = ""

    /// Fires when the user has moved to a different neighborhood.
    /// AppDelegate hooks into this to trigger an immediate wallpaper refresh.
    var onNeighborhoodChange: (() -> Void)?

    override init() {
        super.init()
        manager.delegate = self
        // Hundred-meter accuracy gives meaningful neighborhood resolution
        // while staying efficient on a laptop.
        manager.desiredAccuracy = kCLLocationAccuracyHundredMeters
    }

    // MARK: - Continuous Monitoring

    /// Begin watching for significant location changes (cell-tower level, ~500 m).
    /// Battery-efficient — perfect for detecting neighborhood transitions.
    func startMonitoring() {
        let status = manager.authorizationStatus
        if status == .notDetermined {
            manager.requestWhenInUseAuthorization()
        }
        if CLLocationManager.significantLocationChangeMonitoringAvailable() {
            manager.startMonitoringSignificantLocationChanges()
        }
    }

    // MARK: - One-Shot Fetch

    /// Returns the best available location (CoreLocation → IP fallback).
    func fetchLocation() async -> LocationData? {
        if let cl = await coreLocationRequest() {
            let geo = await reverseGeocode(cl)
            lastNeighborhood = geo.neighborhood
            return LocationData(latitude: cl.coordinate.latitude,
                                longitude: cl.coordinate.longitude,
                                city: geo.city,
                                region: geo.region,
                                neighborhood: geo.neighborhood,
                                areaOfInterest: geo.areaOfInterest)
        }
        return await ipGeolocate()
    }

    // MARK: - CoreLocation Request

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

            DispatchQueue.main.asyncAfter(deadline: .now() + 10) { [weak self] in
                guard let self = self, !self.resumed else { return }
                self.resumed = true
                self.continuation?.resume(returning: nil)
                self.continuation = nil
            }
        }
    }

    // MARK: - CLLocationManagerDelegate

    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        guard let location = locations.last else { return }

        // If a one-shot requestLocation() is pending, fulfil it.
        if !resumed, continuation != nil {
            resumed = true
            continuation?.resume(returning: location)
            continuation = nil
            return
        }

        // Otherwise this came from significant-change monitoring.
        // Reverse-geocode and check whether the neighborhood changed.
        Task { [weak self] in
            guard let self = self else { return }
            let geo = await self.reverseGeocode(location)
            let newHood = geo.neighborhood

            if !newHood.isEmpty, newHood != self.lastNeighborhood {
                self.lastNeighborhood = newHood
                DispatchQueue.main.async {
                    self.onNeighborhoodChange?()
                }
            }
        }
    }

    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        guard !resumed else { return }
        resumed = true
        continuation?.resume(returning: nil)
        continuation = nil
    }

    func locationManager(_ manager: CLLocationManager,
                         didChangeAuthorization status: CLAuthorizationStatus) {
        // Begin monitoring as soon as the user grants permission.
        if status == .authorized || status == .authorizedAlways {
            if CLLocationManager.significantLocationChangeMonitoringAvailable() {
                manager.startMonitoringSignificantLocationChanges()
            }
        }
    }

    // MARK: - Reverse Geocode

    private func reverseGeocode(_ location: CLLocation)
        async -> (city: String, region: String, neighborhood: String, areaOfInterest: String)
    {
        let geocoder = CLGeocoder()
        let placemarks = try? await geocoder.reverseGeocodeLocation(location)
        guard let p = placemarks?.first else { return ("—", "", "", "") }

        // subLocality → "Inner Sunset", "Financial District", "SoMa", etc.
        let neighborhood = p.subLocality ?? ""
        // areasOfInterest → landmarks or named areas like "Golden Gate Park"
        let aoi = p.areasOfInterest?.first ?? ""

        return (
            city:           p.locality ?? "—",
            region:         p.administrativeArea ?? "",
            neighborhood:   neighborhood,
            areaOfInterest: aoi
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
