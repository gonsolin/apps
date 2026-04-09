import Cocoa
import ImageIO

/// Orchestrates wallpaper updates: tries web image search first, falls back to the
/// procedural renderer, and can save/restore the user's original wallpaper on quit.
///
/// Multi-display: when screens are arranged side-by-side and the source image is wide
/// enough, the image is spanned across all screens (each gets a slice). Otherwise, the
/// same image is applied to every screen independently.
final class WallpaperManager {

    private let renderer = WallpaperRenderer()
    let imageSearch = ImageSearchService()
    private let wallpaperDir: URL

    // Original wallpapers saved on launch so we can restore on quit
    private var savedWallpapers: [SavedWallpaper] = []

    /// Represents one screen's saved wallpaper state.
    private struct SavedWallpaper {
        let screenID: CGDirectDisplayID
        let url: URL
        let scaling: Int   // NSImageScaling raw value
        let allowClipping: Bool
    }

    init() {
        let base = FileManager.default.urls(for: .applicationSupportDirectory,
                                            in: .userDomainMask).first!
        wallpaperDir = base.appendingPathComponent("WeatherWall", isDirectory: true)
        try? FileManager.default.createDirectory(at: wallpaperDir, withIntermediateDirectories: true)
    }

    // MARK: - Save / Restore Original Wallpaper

    /// Call once at app launch, before the first wallpaper update.
    /// If the current wallpaper is one of ours (from a previous session), we reload
    /// the persisted originals instead — this ensures we always restore the user's
    /// actual wallpaper, not a WeatherWall-generated one.
    func saveOriginalWallpapers() {
        let ws = NSWorkspace.shared
        var current: [SavedWallpaper] = []
        for screen in NSScreen.screens {
            let sid = screenID(screen)
            if let url = ws.desktopImageURL(for: screen) {
                let opts = ws.desktopImageOptions(for: screen) ?? [:]
                let scaling = (opts[.imageScaling] as? NSNumber)?.intValue
                    ?? NSImageScaling.scaleProportionallyUpOrDown.rawValue
                let clipping = (opts[.allowClipping] as? NSNumber)?.boolValue ?? true
                current.append(SavedWallpaper(screenID: sid, url: url,
                                              scaling: scaling, allowClipping: clipping))
            }
        }

        // Check if any current wallpaper points to a WeatherWall file
        let isOurs = current.contains { isWeatherWallFile($0.url) }

        if isOurs, let persisted = loadPersistedOriginals(), !persisted.isEmpty {
            // The screens are showing our wallpaper from a previous session —
            // use the originals we saved earlier so we can restore the user's real wallpaper.
            savedWallpapers = persisted
        } else {
            // Fresh start: the screens show the user's actual wallpaper.
            savedWallpapers = current
            persistOriginals()
        }
    }

    /// Restore the wallpapers that were active when the app (or its first session) launched.
    func restoreOriginalWallpapers() {
        let ws = NSWorkspace.shared
        for screen in NSScreen.screens {
            let sid = screenID(screen)
            if let entry = savedWallpapers.first(where: { $0.screenID == sid }) {
                var opts: [NSWorkspace.DesktopImageOptionKey: Any] = [
                    .imageScaling: NSNumber(value: entry.scaling),
                    .allowClipping: NSNumber(value: entry.allowClipping)
                ]
                // Verify the file still exists
                if FileManager.default.fileExists(atPath: entry.url.path) {
                    try? ws.setDesktopImageURL(entry.url, for: screen, options: opts)
                }
            }
        }
        // Clean up the persisted originals since we've restored successfully
        let file = wallpaperDir.appendingPathComponent("original_wallpapers.json")
        try? FileManager.default.removeItem(at: file)
    }

    // MARK: - Update Wallpaper

    /// Fetch a web image (or generate a procedural one) and apply it.
    /// Handles multi-display spanning when possible.
    func update(condition: WeatherCondition, timeOfDay: TimeOfDay,
                temperature: Double, location: LocationData) async {

        let screens = sortedScreens()
        guard let primary = screens.first else { return }

        let scale = primary.screen.backingScaleFactor
        let layout = ScreenLayout(screens: screens, scale: scale)

        // Request the full canvas size from the image service
        var imageURL: URL?

        if imageSearch.hasAPIKey {
            let queries = buildSearchQueries(location: location,
                                             condition: condition,
                                             timeOfDay: timeOfDay)
            imageURL = await imageSearch.fetchImage(queries: queries,
                                                   width: layout.canvasWidth,
                                                   height: layout.canvasHeight)
        }

        // Fallback: procedural renderer at canvas size
        if imageURL == nil {
            let size = CGSize(width: CGFloat(layout.canvasWidth),
                              height: CGFloat(layout.canvasHeight))
            if let cgImage = renderer.render(condition: condition, timeOfDay: timeOfDay, size: size) {
                let fallbackURL = wallpaperDir.appendingPathComponent("current.png")
                if savePNG(image: cgImage, to: fallbackURL) {
                    imageURL = fallbackURL
                }
            }
        }

        guard let finalURL = imageURL else { return }

        // Load the image to check its actual dimensions
        guard let imageSource = CGImageSourceCreateWithURL(finalURL as CFURL, nil),
              let cgImage = CGImageSourceCreateImageAtIndex(imageSource, 0, nil) else {
            // Can't read the image — apply as-is to all screens
            DispatchQueue.main.async { self.applyToAllScreens(finalURL) }
            return
        }

        let imgW = cgImage.width
        let imgH = cgImage.height

        if screens.count > 1 && layout.canSpan(imageWidth: imgW, imageHeight: imgH) {
            // Span the image across screens — slice and apply each piece
            let slices = layout.computeSlices(imageWidth: imgW, imageHeight: imgH)
            DispatchQueue.main.async {
                self.applySpanned(image: cgImage, slices: slices, screens: screens)
            }
        } else {
            // Single screen or image too small — same image on all
            DispatchQueue.main.async { self.applyToAllScreens(finalURL) }
        }
    }

    // MARK: - Screen Layout

    /// Represents a screen with its display ID and sorted position.
    private struct ScreenInfo {
        let screen: NSScreen
        let displayID: CGDirectDisplayID
        let originX: CGFloat   // in global point coordinates
    }

    /// Layout computation for multi-display spanning.
    private struct ScreenLayout {
        let canvasWidth: Int
        let canvasHeight: Int
        let totalPointsWidth: CGFloat
        let screenInfos: [(screen: NSScreen, id: CGDirectDisplayID,
                           xOffset: CGFloat, pointWidth: CGFloat, pixelWidth: Int, pixelHeight: Int)]

        init(screens: [ScreenInfo], scale: CGFloat) {
            // Calculate combined canvas at retina resolution
            let minX = screens.map { $0.originX }.min() ?? 0
            let maxX = screens.map { $0.originX + $0.screen.frame.width }.max() ?? 0
            let maxH = screens.map { $0.screen.frame.height }.max() ?? 0

            totalPointsWidth = maxX - minX
            canvasWidth  = Int(totalPointsWidth * scale)
            canvasHeight = Int(maxH * scale)

            screenInfos = screens.map { info in
                let pw = Int(info.screen.frame.width * scale)
                let ph = Int(info.screen.frame.height * scale)
                return (screen: info.screen, id: info.displayID,
                        xOffset: info.originX - minX,
                        pointWidth: info.screen.frame.width,
                        pixelWidth: pw, pixelHeight: ph)
            }
        }

        /// Can we meaningfully span? The image must be at least as wide as the total canvas
        /// and each screen slice must be at least 75% of its native width (avoid excessive stretch).
        func canSpan(imageWidth: Int, imageHeight: Int) -> Bool {
            // Image must cover at least 70% of the combined width
            return imageWidth >= Int(Double(canvasWidth) * 0.7)
        }

        /// Compute the crop rect (in image pixels) for each screen.
        /// The image is scaled to fill the canvas height, then sliced horizontally.
        func computeSlices(imageWidth: Int, imageHeight: Int) -> [(screenIndex: Int,
                                                                    cropRect: CGRect)] {
            // Scale factor to fit the image height to the canvas height
            let heightScale = CGFloat(canvasHeight) / CGFloat(imageHeight)
            let scaledImgWidth = CGFloat(imageWidth) * heightScale

            // Center the scaled image horizontally if it's wider than the canvas
            let canvasW = CGFloat(canvasWidth)
            let xShift = max(0, (scaledImgWidth - canvasW) / 2)

            var slices: [(screenIndex: Int, cropRect: CGRect)] = []
            for (i, info) in screenInfos.enumerated() {
                // This screen's position in the canvas (in canvas pixels)
                let screenStartInCanvas = info.xOffset / totalPointsWidth * canvasW
                let screenEndInCanvas = screenStartInCanvas + CGFloat(info.pixelWidth)

                // Map back to image coordinates
                let imgX = (screenStartInCanvas + xShift) / heightScale
                let imgY: CGFloat = 0
                let imgW = CGFloat(info.pixelWidth) / heightScale
                let imgH = CGFloat(imageHeight)

                // Clamp to image bounds
                var rect = CGRect(x: imgX, y: imgY, width: imgW, height: imgH)
                if rect.maxX > CGFloat(imageWidth) {
                    rect.origin.x = CGFloat(imageWidth) - rect.width
                }
                if rect.origin.x < 0 {
                    rect.origin.x = 0
                    rect.size.width = min(rect.width, CGFloat(imageWidth))
                }

                slices.append((screenIndex: i, cropRect: rect))
            }
            return slices
        }
    }

    /// Return all screens sorted left-to-right by their global origin.
    private func sortedScreens() -> [ScreenInfo] {
        NSScreen.screens.map { screen in
            ScreenInfo(screen: screen,
                       displayID: screenID(screen),
                       originX: screen.frame.origin.x)
        }.sorted { $0.originX < $1.originX }
    }

    // MARK: - Apply Wallpaper

    /// Span a single image across multiple screens by cropping slices.
    private func applySpanned(image: CGImage, slices: [(screenIndex: Int, cropRect: CGRect)],
                              screens: [ScreenInfo]) {
        let ws = NSWorkspace.shared
        let opts: [NSWorkspace.DesktopImageOptionKey: Any] = [
            .imageScaling: NSNumber(value: NSImageScaling.scaleProportionallyUpOrDown.rawValue),
            .allowClipping: NSNumber(value: true)
        ]

        for slice in slices {
            let info = screens[slice.screenIndex]
            // Crop the slice from the full image
            let intRect = CGRect(x: round(slice.cropRect.origin.x),
                                 y: round(slice.cropRect.origin.y),
                                 width: round(slice.cropRect.width),
                                 height: round(slice.cropRect.height))
            guard let cropped = image.cropping(to: intRect) else { continue }

            // Save to a screen-specific file
            let file = wallpaperDir.appendingPathComponent("screen_\(info.displayID).png")
            if savePNG(image: cropped, to: file) {
                try? ws.setDesktopImageURL(file, for: info.screen, options: opts)
            }
        }
    }

    /// Apply the same image to all screens (fallback).
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

    // MARK: - Helpers

    private func savePNG(image: CGImage, to url: URL) -> Bool {
        guard let dest = CGImageDestinationCreateWithURL(url as CFURL,
                                                         "public.png" as CFString, 1, nil) else { return false }
        CGImageDestinationAddImage(dest, image, nil)
        return CGImageDestinationFinalize(dest)
    }

    private func screenID(_ screen: NSScreen) -> CGDirectDisplayID {
        (screen.deviceDescription[NSDeviceDescriptionKey("NSScreenNumber")] as? CGDirectDisplayID) ?? 0
    }

    /// Check if a URL points to a file inside our app support directory.
    private func isWeatherWallFile(_ url: URL) -> Bool {
        url.path.contains("WeatherWall")
    }

    // MARK: - Persist / Load Originals

    private var originalsFile: URL {
        wallpaperDir.appendingPathComponent("original_wallpapers.json")
    }

    /// Write original wallpaper paths to disk so we can recover across sessions.
    private func persistOriginals() {
        let entries: [[String: Any]] = savedWallpapers.map {
            [
                "id":            "\($0.screenID)",
                "path":          $0.url.path,
                "scaling":       $0.scaling,
                "allowClipping": $0.allowClipping
            ]
        }
        if let data = try? JSONSerialization.data(withJSONObject: entries, options: .prettyPrinted) {
            try? data.write(to: originalsFile)
        }
    }

    /// Load persisted originals from disk (survives app restart / crash).
    private func loadPersistedOriginals() -> [SavedWallpaper]? {
        guard let data = try? Data(contentsOf: originalsFile),
              let array = try? JSONSerialization.jsonObject(with: data) as? [[String: Any]]
        else { return nil }

        return array.compactMap { dict -> SavedWallpaper? in
            guard let idStr = dict["id"] as? String,
                  let id = UInt32(idStr),
                  let path = dict["path"] as? String else { return nil }
            let scaling = (dict["scaling"] as? Int)
                ?? NSImageScaling.scaleProportionallyUpOrDown.rawValue
            let clipping = (dict["allowClipping"] as? Bool) ?? true
            return SavedWallpaper(screenID: CGDirectDisplayID(id),
                                 url: URL(fileURLWithPath: path),
                                 scaling: scaling, allowClipping: clipping)
        }
    }
}
