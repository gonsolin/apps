import Cocoa
import CoreLocation

// MARK: - Editable Text Field
// NSTextField inside an NSAlert loses access to the Edit menu, so Cmd+V/C/X/A
// don't work.  This subclass routes those key-equivalents manually.
private class EditableTextField: NSTextField {
    override func performKeyEquivalent(with event: NSEvent) -> Bool {
        let flags = event.modifierFlags.intersection(.deviceIndependentFlagsMask)
        if flags == .command, let chars = event.charactersIgnoringModifiers {
            switch chars {
            case "v": return NSApp.sendAction(#selector(NSText.paste(_:)),   to: nil, from: self)
            case "c": return NSApp.sendAction(#selector(NSText.copy(_:)),    to: nil, from: self)
            case "x": return NSApp.sendAction(#selector(NSText.cut(_:)),     to: nil, from: self)
            case "a": return NSApp.sendAction(#selector(NSText.selectAll(_:)), to: nil, from: self)
            default: break
            }
        }
        return super.performKeyEquivalent(with: event)
    }
}

class AppDelegate: NSObject, NSApplicationDelegate {

    private var statusItem: NSStatusItem!
    private var locationService: LocationService!
    private var weatherService: WeatherService!
    private var wallpaperManager: WallpaperManager!
    private var updateTimer: Timer?

    // Menu items (updated dynamically)
    private var conditionItem: NSMenuItem!
    private var temperatureItem: NSMenuItem!
    private var locationItem: NSMenuItem!
    private var lastUpdateItem: NSMenuItem!
    private var apiKeyItem: NSMenuItem!

    // Current state
    private var lastWeather: WeatherData?
    private var lastLocation: LocationData?

    // MARK: - Lifecycle

    func applicationDidFinishLaunching(_ notification: Notification) {
        NSApp.setActivationPolicy(.accessory) // Hide dock icon

        locationService  = LocationService()
        weatherService   = WeatherService()
        wallpaperManager = WallpaperManager()

        // Save the user's current wallpaper so we can restore on quit
        wallpaperManager.saveOriginalWallpapers()

        buildStatusItem()

        // If no API key yet, prompt the user on first launch
        if !wallpaperManager.imageSearch.hasAPIKey {
            DispatchQueue.main.asyncAfter(deadline: .now() + 1) { [weak self] in
                self?.promptForAPIKey(isFirstLaunch: true)
            }
        }

        performUpdate()

        // Refresh every 30 minutes
        updateTimer = Timer.scheduledTimer(withTimeInterval: 1800, repeats: true) { [weak self] _ in
            self?.performUpdate()
        }
    }

    func applicationWillTerminate(_ notification: Notification) {
        updateTimer?.invalidate()
        // Restore the wallpaper that was set before we launched
        wallpaperManager.restoreOriginalWallpapers()
    }

    // MARK: - Status Bar

    private func buildStatusItem() {
        statusItem = NSStatusBar.system.statusItem(withLength: NSStatusItem.variableLength)

        if let button = statusItem.button {
            button.image = NSImage(systemSymbolName: "cloud.sun.fill",
                                   accessibilityDescription: "WeatherWall")
        }

        let menu = NSMenu()

        conditionItem   = makeInfoItem("Fetching weather…")
        temperatureItem = makeInfoItem("")
        locationItem    = makeInfoItem("")
        lastUpdateItem  = makeInfoItem("")

        menu.addItem(conditionItem)
        menu.addItem(temperatureItem)
        menu.addItem(locationItem)
        menu.addItem(lastUpdateItem)
        menu.addItem(NSMenuItem.separator())

        let updateNow = NSMenuItem(title: "Update Now", action: #selector(refreshTapped), keyEquivalent: "r")
        updateNow.target = self
        menu.addItem(updateNow)

        menu.addItem(NSMenuItem.separator())

        apiKeyItem = NSMenuItem(title: apiKeyMenuTitle(), action: #selector(apiKeyTapped), keyEquivalent: "")
        apiKeyItem.target = self
        menu.addItem(apiKeyItem)

        menu.addItem(NSMenuItem.separator())

        let quit = NSMenuItem(title: "Quit WeatherWall", action: #selector(quitTapped), keyEquivalent: "q")
        quit.target = self
        menu.addItem(quit)

        statusItem.menu = menu
    }

    private func makeInfoItem(_ title: String) -> NSMenuItem {
        let item = NSMenuItem(title: title, action: nil, keyEquivalent: "")
        item.isEnabled = false
        return item
    }

    private func apiKeyMenuTitle() -> String {
        wallpaperManager.imageSearch.hasAPIKey
            ? "Change Unsplash API Key…"
            : "Set Unsplash API Key…"
    }

    // MARK: - Actions

    @objc private func refreshTapped() {
        performUpdate()
    }

    @objc private func apiKeyTapped() {
        promptForAPIKey(isFirstLaunch: false)
    }

    @objc private func quitTapped() {
        NSApp.terminate(nil)
    }

    // MARK: - API Key Dialog

    private func promptForAPIKey(isFirstLaunch: Bool) {
        NSApp.activate(ignoringOtherApps: true)

        let alert = NSAlert()
        alert.messageText = "Unsplash API Key"
        alert.informativeText = isFirstLaunch
            ? "WeatherWall uses Unsplash to find wallpapers that match your city and weather.\n\n"
              + "Get a free API key at unsplash.com/developers (takes ~30 seconds).\n\n"
              + "Without a key, the app will use procedural gradient wallpapers instead."
            : "Enter your Unsplash Access Key.\nGet one free at unsplash.com/developers."

        let textField = EditableTextField(frame: NSRect(x: 0, y: 0, width: 340, height: 24))
        textField.placeholderString = "Paste your Access Key here"
        if let existing = wallpaperManager.imageSearch.apiKey {
            textField.stringValue = existing
        }
        alert.accessoryView = textField

        alert.addButton(withTitle: "Save")
        alert.addButton(withTitle: isFirstLaunch ? "Skip" : "Cancel")

        let openWeb = alert.addButton(withTitle: "Open Unsplash")

        let response = alert.runModal()

        if response == .alertFirstButtonReturn {
            let key = textField.stringValue.trimmingCharacters(in: .whitespacesAndNewlines)
            if !key.isEmpty {
                wallpaperManager.imageSearch.saveAPIKey(key)
                apiKeyItem.title = apiKeyMenuTitle()
                performUpdate() // re-fetch with new key
            }
        } else if response == openWeb.tag as? NSApplication.ModalResponse ?? .alertThirdButtonReturn {
            NSWorkspace.shared.open(URL(string: "https://unsplash.com/developers")!)
        }
    }

    // MARK: - Update Pipeline

    private func performUpdate() {
        Task {
            await runUpdatePipeline()
        }
    }

    private func runUpdatePipeline() async {
        // 1. Location
        guard let location = await locationService.fetchLocation() else {
            DispatchQueue.main.async { self.conditionItem.title = "⚠️ Location unavailable" }
            return
        }
        lastLocation = location

        // 2. Weather
        guard let weather = await weatherService.fetch(latitude: location.latitude,
                                                       longitude: location.longitude) else {
            DispatchQueue.main.async { self.conditionItem.title = "⚠️ Weather fetch failed" }
            return
        }
        lastWeather = weather

        // 3. Render & apply wallpaper (web image → procedural fallback)
        let timeOfDay = TimeOfDay.current()
        await wallpaperManager.update(condition: weather.condition, timeOfDay: timeOfDay,
                                      temperature: weather.temperature, location: location)

        // 4. Update menu bar
        DispatchQueue.main.async {
            self.refreshMenu(weather: weather, location: location, timeOfDay: timeOfDay)
        }
    }

    private func refreshMenu(weather: WeatherData, location: LocationData, timeOfDay: TimeOfDay) {
        conditionItem.title   = "\(weather.condition.displayName)"
        temperatureItem.title = "🌡️ \(String(format: "%.0f", weather.temperature))°F"

        let loc = location.neighborhood.isEmpty
            ? "\(location.city), \(location.region)"
            : "\(location.neighborhood), \(location.city)"
        locationItem.title = "📍 \(loc)"

        let fmt = DateFormatter()
        fmt.timeStyle = .short
        lastUpdateItem.title = "Updated \(fmt.string(from: Date()))"

        // Status bar icon
        let symbol = timeOfDay.isNight ? weather.condition.nightSfSymbol : weather.condition.sfSymbol
        if let img = NSImage(systemSymbolName: symbol,
                             accessibilityDescription: weather.condition.displayName) {
            statusItem.button?.image = img
        }
    }
}
