import Foundation

/// Searches Unsplash for wallpaper photos matching a location + weather query,
/// downloads them at the requested resolution, and caches results for 2 hours.
final class ImageSearchService {

    private let appDir: URL
    private let cacheDir: URL
    private let configFile: URL
    private(set) var apiKey: String?

    init() {
        let base = FileManager.default.urls(for: .applicationSupportDirectory,
                                            in: .userDomainMask).first!
        appDir    = base.appendingPathComponent("WeatherWall", isDirectory: true)
        cacheDir  = appDir.appendingPathComponent("cache", isDirectory: true)
        configFile = appDir.appendingPathComponent("config.json")
        try? FileManager.default.createDirectory(at: cacheDir, withIntermediateDirectories: true)
        loadAPIKey()
        pruneOldCache()
    }

    var hasAPIKey: Bool { !(apiKey ?? "").isEmpty }

    // MARK: - Search + Download

    /// Try a cascade of queries from most specific to broadest.
    /// Checks all caches first (cheap), then hits the API in order (expensive).
    func fetchImage(queries: [String], width: Int, height: Int) async -> URL? {
        guard hasAPIKey else { return nil }

        // Phase 1 — cache sweep (most specific wins)
        for query in queries {
            let cached = cacheDir.appendingPathComponent("\(cacheKey(for: query)).jpg")
            if isCacheValid(at: cached) { return cached }
        }

        // Phase 2 — API calls, stop at the first query that returns results
        for query in queries {
            if let url = await searchAndDownload(query: query, width: width, height: height) {
                return url
            }
        }

        return nil
    }

    /// Single-query Unsplash search + download.  Returns nil if no results or on error.
    private func searchAndDownload(query: String, width: Int, height: Int) async -> URL? {
        guard let key = apiKey, !key.isEmpty else { return nil }

        let encoded = query.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? query
        let endpoint = "https://api.unsplash.com/search/photos"
            + "?query=\(encoded)&orientation=landscape&per_page=10&content_filter=high"
        guard let url = URL(string: endpoint) else { return nil }

        var req = URLRequest(url: url)
        req.setValue("Client-ID \(key)", forHTTPHeaderField: "Authorization")

        guard let (data, resp) = try? await URLSession.shared.data(for: req),
              let http = resp as? HTTPURLResponse, http.statusCode == 200 else { return nil }

        guard let json    = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
              let results = json["results"] as? [[String: Any]],
              !results.isEmpty else { return nil }

        // Pick a random result from the top 5 for variety
        let top = Array(results.prefix(5))
        guard let pick   = top.randomElement(),
              let urls   = pick["urls"] as? [String: Any],
              let rawURL = urls["raw"] as? String else { return nil }

        // Download at screen resolution
        let imageURLStr = "\(rawURL)&w=\(width)&h=\(height)&fit=crop&q=85&fm=jpg"
        guard let imageURL = URL(string: imageURLStr) else { return nil }
        guard let (imgData, imgResp) = try? await URLSession.shared.data(from: imageURL),
              let imgHTTP = imgResp as? HTTPURLResponse, imgHTTP.statusCode == 200 else { return nil }

        // Cache the downloaded image keyed to this query
        let cachedFile = cacheDir.appendingPathComponent("\(cacheKey(for: query)).jpg")
        try? imgData.write(to: cachedFile)
        return cachedFile
    }

    // MARK: - API Key Management

    func loadAPIKey() {
        guard let data = try? Data(contentsOf: configFile),
              let json = try? JSONSerialization.jsonObject(with: data) as? [String: String] else { return }
        apiKey = json["unsplash_api_key"]
    }

    func saveAPIKey(_ key: String) {
        apiKey = key
        let json: [String: String] = ["unsplash_api_key": key]
        if let data = try? JSONSerialization.data(withJSONObject: json, options: .prettyPrinted) {
            try? data.write(to: configFile)
        }
    }

    // MARK: - Cache Helpers

    private func cacheKey(for query: String) -> String {
        query.lowercased()
            .components(separatedBy: CharacterSet.alphanumerics.inverted)
            .filter { !$0.isEmpty }
            .joined(separator: "_")
    }

    private func isCacheValid(at url: URL) -> Bool {
        guard let attrs = try? FileManager.default.attributesOfItem(atPath: url.path),
              let modified = attrs[.modificationDate] as? Date else { return false }
        return Date().timeIntervalSince(modified) < 7200 // 2 hours
    }

    /// Remove cached images older than 24 hours to reclaim disk space.
    private func pruneOldCache() {
        guard let files = try? FileManager.default.contentsOfDirectory(at: cacheDir,
                                                                       includingPropertiesForKeys: [.contentModificationDateKey]) else { return }
        for file in files {
            guard let attrs = try? file.resourceValues(forKeys: [.contentModificationDateKey]),
                  let modified = attrs.contentModificationDate else { continue }
            if Date().timeIntervalSince(modified) > 86400 {
                try? FileManager.default.removeItem(at: file)
            }
        }
    }
}
