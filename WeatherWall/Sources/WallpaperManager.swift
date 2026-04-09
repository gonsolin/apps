import Cocoa
import ImageIO

/// Orchestrates wallpaper updates: tries web image search first, falls back to the
/// procedural renderer, and can save/restore the user's original wallpaper on quit.
final class WallpaperManager {

    private let renderer = WallpaperRenderer()
    let imageSearch = ImageSearchService()
    private let wallpaperDir: URL

    // Original wallpapers saved on launch so we can restore on quit
    private var savedWallpapers: [(screenID: CGDirectDisplayID, url: URL,
                                   options: [NSWorkspace.DesktopImageOptionKey: Any])] = []

    init() {
        let base = FileManager.default.urls(for: .applicationSupportDirectory,
                                            in: .userDomainMask).first!
        wallpaperDir = base.appendingPathComponent("WeatherWall", isDirectory: true)
        try? FileManager.default.createDirectory(at: wallpaperDir, withIntermediateDirectories: true)
    }

    // MARK: - Save / Restore Original Wallpaper

    /// Call once at app launch, before the first wallpaper update.
    func saveOriginalWallpapers() {
        savedWallpapers.removeAll()
        let ws = NSWorkspace.shared
        for screen in NSScreen.screens {
            let sid = screenID(screen)
            if let url = ws.desktopImageURL(for: screen) {
                let opts = ws.desktopImageOptions(for: screen) ?? [:]
                savedWallpapers.append((screenID: sid, url: url, options: opts))
            }
        }
        // Persist to disk as a safety net (manual recovery after a crash)
        persistOriginals()
    }

    /// Restore the wallpapers that were active when the app launched.
    func restoreOriginalWallpapers() {
        let ws = NSWorkspace.shared
        for screen in NSScreen.screens {
            let sid = screenID(screen)
            if let entry = savedWallpapers.first(where: { $0.screenID == sid }) {
                try? ws.setDesktopImageURL(entry.url, for: screen, options: entry.options)
            }
        }
    }

    // MARK: - Update Wallpaper

    /// Fetch a web image (or generate a procedural one) and apply it.
    func update(condition: WeatherCondition, timeOfDay: TimeOfDay,
                temperature: Double, location: LocationData) async {

        let screen   = NSScreen.main ?? NSScreen.screens.first!
        let scale    = screen.backingScaleFactor
        let pixelW   = Int(screen.frame.width  * scale)
        let pixelH   = Int(screen.frame.height * scale)

        var imageURL: URL?

        // 1. Try web image search with cascading fallback
        //    e.g. "Inner Sunset San Francisco rain afternoon"
        //       → "San Francisco rain afternoon"
        //       → "San Francisco rain"
        //       → "San Francisco"
        if imageSearch.hasAPIKey {
            let queries = buildSearchQueries(location: location,
                                             condition: condition,
                                             timeOfDay: timeOfDay)
            imageURL = await imageSearch.fetchImage(queries: queries, width: pixelW, height: pixelH)
        }

        // 2. Fallback: procedural renderer
        if imageURL == nil {
            let size = CGSize(width: CGFloat(pixelW), height: CGFloat(pixelH))
            if let cgImage = renderer.render(condition: condition, timeOfDay: timeOfDay, size: size) {
                let fallbackURL = wallpaperDir.appendingPathComponent("current.png")
                if savePNG(image: cgImage, to: fallbackURL) {
                    imageURL = fallbackURL
                }
            }
        }

        guard let finalURL = imageURL else { return }

        DispatchQueue.main.async {
            self.applyToAllScreens(finalURL)
        }
    }

    // MARK: - Helpers

    private func applyToAllScreens(_ url: URL) {
        let ws = NSWorkspace.shared
        let opts: [NSWorkspace.DesktopImageOptionKey: Any] = [
            .imageScaling: NSNumber(value: NSImageScaling.scaleProportionallyUpOrDown.rawValue),
            .allowClipping: NSNumber(value: true)
        ]
        for screen in NSScreen.screens {
            try? ws.setDesktopImageURL(url, for: screen, options: opts)
        }
    }

    private func savePNG(image: CGImage, to url: URL) -> Bool {
        guard let dest = CGImageDestinationCreateWithURL(url as CFURL,
                                                         "public.png" as CFString, 1, nil) else { return false }
        CGImageDestinationAddImage(dest, image, nil)
        return CGImageDestinationFinalize(dest)
    }

    private func screenID(_ screen: NSScreen) -> CGDirectDisplayID {
        (screen.deviceDescription[NSDeviceDescriptionKey("NSScreenNumber")] as? CGDirectDisplayID) ?? 0
    }

    /// Write original wallpaper paths to disk so the user can recover after a crash.
    private func persistOriginals() {
        let entries = savedWallpapers.map { ["id": "\($0.screenID)", "path": $0.url.path] }
        let file = wallpaperDir.appendingPathComponent("original_wallpapers.json")
        if let data = try? JSONSerialization.data(withJSONObject: entries, options: .prettyPrinted) {
            try? data.write(to: file)
        }
    }
}
