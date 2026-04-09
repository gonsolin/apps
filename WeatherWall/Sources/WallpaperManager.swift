import Cocoa
import ImageIO

/// Orchestrates wallpaper updates: tries web image search first, falls back to the
/// procedural renderer, and can save/restore the user's original wallpaper on quit.
///
/// v0.9: Multi-display panorama (scale-to-fill + slice), location text overlay.
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

    func saveOriginalWallpapers() {
        let ws = NSWorkspace.shared
        var current: [SavedWallpaper] = []
        for screen in NSScreen.screens {
            let sid = screenID(screen)
            if let url = ws.desktopImageURL(for: screen) {
                let opts = ws.desktopImageOptions(for: screen) ?? [:]
                let scaling = (opts[.imageScaling] as? NSNumber)?.intValue
                    ?? Int(NSImageScaling.scaleProportionallyUpOrDown.rawValue)
                let clipping = (opts[.allowClipping] as? NSNumber)?.boolValue ?? true
                current.append(SavedWallpaper(screenID: sid, url: url,
                                              scaling: scaling, allowClipping: clipping))
            }
        }

        let isOurs = current.contains { isWeatherWallFile($0.url) }

        if isOurs, let persisted = loadPersistedOriginals(), !persisted.isEmpty {
            savedWallpapers = persisted
        } else {
            savedWallpapers = current
            persistOriginals()
        }
    }

    func restoreOriginalWallpapers() {
        let ws = NSWorkspace.shared
        for screen in NSScreen.screens {
            let sid = screenID(screen)
            if let entry = savedWallpapers.first(where: { $0.screenID == sid }) {
                let opts: [NSWorkspace.DesktopImageOptionKey: Any] = [
                    .imageScaling: NSNumber(value: entry.scaling),
                    .allowClipping: NSNumber(value: entry.allowClipping)
                ]
                if FileManager.default.fileExists(atPath: entry.url.path) {
                    try? ws.setDesktopImageURL(entry.url, for: screen, options: opts)
                }
            }
        }
        let file = wallpaperDir.appendingPathComponent("original_wallpapers.json")
        try? FileManager.default.removeItem(at: file)
    }

    // MARK: - Update Wallpaper

    func update(condition: WeatherCondition, timeOfDay: TimeOfDay,
                temperature: Double, location: LocationData) async {

        let screens = sortedScreens()
        guard !screens.isEmpty else { return }

        // Build location label for the text overlay
        let locationLabel = buildLocationLabel(location: location)

        // Single screen path
        if screens.count == 1 {
            let screen = screens[0].screen
            let scale = screen.backingScaleFactor
            let w = Int(screen.frame.width * scale)
            let h = Int(screen.frame.height * scale)

            if let image = await fetchOrRender(condition: condition, timeOfDay: timeOfDay,
                                               width: w, height: h, location: location) {
                let labeled = overlayLocationText(on: image, label: locationLabel)
                let url = wallpaperDir.appendingPathComponent("current.png")
                if savePNG(image: labeled, to: url) {
                    DispatchQueue.main.async { self.applyToAllScreens(url) }
                }
            }
            return
        }

        // Multi-display path: panorama
        await updatePanorama(screens: screens, condition: condition, timeOfDay: timeOfDay,
                            temperature: temperature, location: location,
                            locationLabel: locationLabel)
    }

    // MARK: - Panorama (Multi-Display)

    /// For multiple screens:
    /// 1. Download the best image (at the primary screen resolution — Unsplash quality)
    /// 2. Scale the image to FILL the combined canvas (no blank stripes)
    /// 3. Slice per-screen and apply
    /// If slicing fails for any reason, fall back to the same image on all screens.
    private func updatePanorama(screens: [ScreenInfo],
                                condition: WeatherCondition, timeOfDay: TimeOfDay,
                                temperature: Double, location: LocationData,
                                locationLabel: String) async {

        // Compute the combined canvas in pixels
        let canvas = computeCanvas(screens: screens)

        // Fetch the image at the tallest screen resolution (Unsplash handles scaling)
        let reqW = canvas.totalWidth
        let reqH = canvas.maxHeight

        guard let sourceImage = await fetchOrRenderCGImage(
            condition: condition, timeOfDay: timeOfDay,
            width: reqW, height: reqH, location: location
        ) else { return }

        // Scale the source to exactly fill the canvas (cover mode)
        guard let filled = scaleToFill(image: sourceImage,
                                        targetWidth: canvas.totalWidth,
                                        targetHeight: canvas.maxHeight) else {
            // Fallback: same image on all screens
            let labeled = overlayLocationText(on: sourceImage, label: locationLabel)
            let url = wallpaperDir.appendingPathComponent("current.png")
            if savePNG(image: labeled, to: url) {
                DispatchQueue.main.async { self.applyToAllScreens(url) }
            }
            return
        }

        // Add location label to the full panorama before slicing
        let labeled = overlayLocationText(on: filled, label: locationLabel)

        // Slice per screen
        let ws = NSWorkspace.shared
        let opts: [NSWorkspace.DesktopImageOptionKey: Any] = [
            .imageScaling: NSNumber(value: Int(NSImageScaling.scaleProportionallyUpOrDown.rawValue)),
            .allowClipping: NSNumber(value: true)
        ]

        DispatchQueue.main.async {
            var xOffset = 0
            for info in canvas.screenSlices {
                let rect = CGRect(x: xOffset, y: 0, width: info.pixelWidth, height: canvas.maxHeight)
                if let cropped = labeled.cropping(to: rect) {
                    let file = self.wallpaperDir.appendingPathComponent("screen_\(info.displayID).png")
                    if self.savePNG(image: cropped, to: file) {
                        try? ws.setDesktopImageURL(file, for: info.screen, options: opts)
                    }
                }
                xOffset += info.pixelWidth
            }
        }
    }

    private struct Canvas {
        let totalWidth: Int
        let maxHeight: Int
        let screenSlices: [(screen: NSScreen, displayID: CGDirectDisplayID, pixelWidth: Int, pixelHeight: Int)]
    }

    private func computeCanvas(screens: [ScreenInfo]) -> Canvas {
        var totalW = 0
        var maxH = 0
        var slices: [(screen: NSScreen, displayID: CGDirectDisplayID, pixelWidth: Int, pixelHeight: Int)] = []
        for info in screens {
            let scale = info.screen.backingScaleFactor
            let pw = Int(info.screen.frame.width * scale)
            let ph = Int(info.screen.frame.height * scale)
            totalW += pw
            maxH = max(maxH, ph)
            slices.append((screen: info.screen, displayID: info.displayID,
                           pixelWidth: pw, pixelHeight: ph))
        }
        return Canvas(totalWidth: totalW, maxHeight: maxH, screenSlices: slices)
    }

    /// Scale an image to exactly fill `targetWidth × targetHeight` (cover mode).
    /// The image is scaled proportionally to fill, then center-cropped.
    private func scaleToFill(image: CGImage, targetWidth: Int, targetHeight: Int) -> CGImage? {
        let srcW = CGFloat(image.width)
        let srcH = CGFloat(image.height)
        let tgtW = CGFloat(targetWidth)
        let tgtH = CGFloat(targetHeight)

        // Scale to cover: use whichever scale factor is larger
        let scaleX = tgtW / srcW
        let scaleY = tgtH / srcH
        let scale = max(scaleX, scaleY)

        let scaledW = srcW * scale
        let scaledH = srcH * scale

        // Center-crop offsets
        let drawX = (tgtW - scaledW) / 2
        let drawY = (tgtH - scaledH) / 2

        guard let ctx = CGContext(data: nil, width: targetWidth, height: targetHeight,
                                  bitsPerComponent: 8, bytesPerRow: 0,
                                  space: CGColorSpaceCreateDeviceRGB(),
                                  bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue) else { return nil }

        ctx.interpolationQuality = .high
        ctx.draw(image, in: CGRect(x: drawX, y: drawY, width: scaledW, height: scaledH))
        return ctx.makeImage()
    }

    // MARK: - Location Text Overlay

    /// Draw the location name vertically along the bottom-right edge of the image,
    /// reading from bottom to top, with a subtle semi-transparent appearance.
    private func overlayLocationText(on image: CGImage, label: String) -> CGImage {
        let w = image.width
        let h = image.height
        guard w > 0, h > 0, !label.isEmpty else { return image }

        guard let ctx = CGContext(data: nil, width: w, height: h,
                                  bitsPerComponent: 8, bytesPerRow: 0,
                                  space: CGColorSpaceCreateDeviceRGB(),
                                  bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue) else { return image }

        // Draw the original image
        ctx.draw(image, in: CGRect(x: 0, y: 0, width: w, height: h))

        // Text styling — subtle white text with slight shadow
        let fontSize = CGFloat(max(14, min(h / 60, 32)))
        let font = CTFontCreateWithName("Helvetica Neue" as CFString, fontSize, nil)
        let attrs: [NSAttributedString.Key: Any] = [
            .font: font,
            .foregroundColor: CGColor(red: 1, green: 1, blue: 1, alpha: 0.55),
        ]
        let attrStr = NSAttributedString(string: label.uppercased(), attributes: attrs)
        let line = CTLineCreateWithAttributedString(attrStr)
        let textBounds = CTLineGetBoundsWithOptions(line, .useOpticalBounds)

        // Position: bottom-right corner, rotated 90° CCW (text reads bottom→top)
        let margin = fontSize * 0.8
        let xPos = CGFloat(w) - margin             // right edge
        let yPos = margin                           // start near bottom

        ctx.saveGState()

        // Drop shadow for readability
        ctx.setShadow(offset: CGSize(width: 1, height: -1), blur: 3,
                      color: CGColor(red: 0, green: 0, blue: 0, alpha: 0.5))

        // Move to bottom-right, rotate 90° CCW
        ctx.translateBy(x: xPos, y: yPos)
        ctx.rotate(by: .pi / 2)  // 90° CCW in CoreGraphics (Y-up)

        // Draw the text
        CTLineDraw(line, ctx)

        ctx.restoreGState()

        return ctx.makeImage() ?? image
    }

    private func buildLocationLabel(location: LocationData) -> String {
        let hood = !location.neighborhood.isEmpty ? location.neighborhood
                 : !location.areaOfInterest.isEmpty ? location.areaOfInterest
                 : ""
        if hood.isEmpty {
            return location.city.isEmpty ? "" : location.city
        }
        return "\(hood), \(location.city)"
    }

    // MARK: - Fetch / Render Helpers

    /// Fetch a web image or render a procedural one, return the file URL.
    private func fetchOrRender(condition: WeatherCondition, timeOfDay: TimeOfDay,
                               width: Int, height: Int, location: LocationData) async -> CGImage? {
        return await fetchOrRenderCGImage(condition: condition, timeOfDay: timeOfDay,
                                          width: width, height: height, location: location)
    }

    private func fetchOrRenderCGImage(condition: WeatherCondition, timeOfDay: TimeOfDay,
                                       width: Int, height: Int, location: LocationData) async -> CGImage? {
        // Try web image first
        if imageSearch.hasAPIKey {
            let queries = buildSearchQueries(location: location,
                                             condition: condition,
                                             timeOfDay: timeOfDay)
            if let url = await imageSearch.fetchImage(queries: queries,
                                                      width: width, height: height) {
                if let src = CGImageSourceCreateWithURL(url as CFURL, nil),
                   let img = CGImageSourceCreateImageAtIndex(src, 0, nil) {
                    return img
                }
            }
        }

        // Fallback: procedural renderer
        let size = CGSize(width: CGFloat(width), height: CGFloat(height))
        return renderer.render(condition: condition, timeOfDay: timeOfDay, size: size)
    }

    // MARK: - Screen Helpers

    private struct ScreenInfo {
        let screen: NSScreen
        let displayID: CGDirectDisplayID
        let originX: CGFloat
    }

    private func sortedScreens() -> [ScreenInfo] {
        NSScreen.screens.map { screen in
            ScreenInfo(screen: screen,
                       displayID: screenID(screen),
                       originX: screen.frame.origin.x)
        }.sorted { $0.originX < $1.originX }
    }

    // MARK: - Apply Wallpaper

    private func applyToAllScreens(_ url: URL) {
        let ws = NSWorkspace.shared
        let opts: [NSWorkspace.DesktopImageOptionKey: Any] = [
            .imageScaling: NSNumber(value: Int(NSImageScaling.scaleProportionallyUpOrDown.rawValue)),
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

    private func isWeatherWallFile(_ url: URL) -> Bool {
        url.path.contains("WeatherWall")
    }

    // MARK: - Persist / Load Originals

    private var originalsFile: URL {
        wallpaperDir.appendingPathComponent("original_wallpapers.json")
    }

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

    private func loadPersistedOriginals() -> [SavedWallpaper]? {
        guard let data = try? Data(contentsOf: originalsFile),
              let array = try? JSONSerialization.jsonObject(with: data) as? [[String: Any]]
        else { return nil }

        return array.compactMap { dict -> SavedWallpaper? in
            guard let idStr = dict["id"] as? String,
                  let id = UInt32(idStr),
                  let path = dict["path"] as? String else { return nil }
            let scaling = (dict["scaling"] as? Int)
                ?? Int(NSImageScaling.scaleProportionallyUpOrDown.rawValue)
            let clipping = (dict["allowClipping"] as? Bool) ?? true
            return SavedWallpaper(screenID: CGDirectDisplayID(id),
                                 url: URL(fileURLWithPath: path),
                                 scaling: scaling, allowClipping: clipping)
        }
    }
}
