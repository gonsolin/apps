import Cocoa
import CoreLocation
import MapKit

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
    private var lockItem: NSMenuItem!

    // Override submenus
    private var locationOverrideItem: NSMenuItem!
    private var weatherOverrideItem: NSMenuItem!
    private var timeOverrideItem: NSMenuItem!

    // Location search panel (predictive text)
    private var locationSearchPanel: LocationSearchPanel!

    // Current state
    private var lastWeather: WeatherData?
    private var lastLocation: LocationData?
    private var overrides = UserOverrides.load()

    // MARK: - Lifecycle

    func applicationDidFinishLaunching(_ notification: Notification) {
        NSApp.setActivationPolicy(.accessory) // Hide dock icon

        locationService     = LocationService()
        weatherService      = WeatherService()
        wallpaperManager    = WallpaperManager()
        locationSearchPanel = LocationSearchPanel()

        // Save the user's current wallpaper so we can restore on quit
        wallpaperManager.saveOriginalWallpapers()

        // Begin tracking location changes — triggers an immediate wallpaper
        // refresh whenever the user moves to a different neighborhood.
        locationService.onNeighborhoodChange = { [weak self] in
            self?.performUpdate()
        }
        locationService.startMonitoring()

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

        // ── Lock Wallpaper ──
        lockItem = NSMenuItem(title: lockMenuTitle(), action: #selector(lockTapped), keyEquivalent: "l")
        lockItem.target = self
        menu.addItem(lockItem)

        menu.addItem(NSMenuItem.separator())

        // ── Override Controls ──
        let overrideHeader = makeInfoItem("Override")
        let attr = NSMutableAttributedString(string: "Override",
                                             attributes: [.font: NSFont.systemFont(ofSize: 11, weight: .semibold),
                                                          .foregroundColor: NSColor.secondaryLabelColor])
        overrideHeader.attributedTitle = attr
        menu.addItem(overrideHeader)

        locationOverrideItem = NSMenuItem(title: locationOverrideTitle(), action: nil, keyEquivalent: "")
        locationOverrideItem.submenu = buildLocationOverrideMenu()
        menu.addItem(locationOverrideItem)

        weatherOverrideItem = NSMenuItem(title: weatherOverrideTitle(), action: nil, keyEquivalent: "")
        weatherOverrideItem.submenu = buildWeatherOverrideMenu()
        menu.addItem(weatherOverrideItem)

        timeOverrideItem = NSMenuItem(title: timeOverrideTitle(), action: nil, keyEquivalent: "")
        timeOverrideItem.submenu = buildTimeOverrideMenu()
        menu.addItem(timeOverrideItem)

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

    // MARK: - Lock

    private func lockMenuTitle() -> String {
        overrides.isLocked ? "🔒 Unlock Wallpaper" : "🔓 Lock Wallpaper"
    }

    @objc private func lockTapped() {
        overrides.isLocked.toggle()
        overrides.save()
        lockItem.title = lockMenuTitle()
        if !overrides.isLocked {
            // Unlocking: refresh immediately to apply any pending changes
            performUpdate()
        }
    }

    // MARK: - Location Override

    private func locationOverrideTitle() -> String {
        if let loc = overrides.locationName {
            return "📍 Location: \(loc)"
        }
        return "📍 Location: Auto"
    }

    private func buildLocationOverrideMenu() -> NSMenu {
        let sub = NSMenu()

        let auto = NSMenuItem(title: "Auto (detect from GPS)", action: #selector(locationAutoTapped), keyEquivalent: "")
        auto.target = self
        if overrides.locationName == nil { auto.state = .on }
        sub.addItem(auto)

        sub.addItem(NSMenuItem.separator())

        let custom = NSMenuItem(title: "Set Custom Location…", action: #selector(locationCustomTapped), keyEquivalent: "")
        custom.target = self
        if overrides.locationName != nil { custom.state = .on }
        sub.addItem(custom)

        return sub
    }

    @objc private func locationAutoTapped() {
        overrides.locationName = nil
        overrides.save()
        refreshOverrideMenus()
        performUpdate()
    }

    @objc private func locationCustomTapped() {
        locationSearchPanel.show(currentValue: overrides.locationName) { [weak self] selected in
            guard let self = self, let value = selected else { return }
            self.overrides.locationName = value
            self.overrides.save()
            self.refreshOverrideMenus()
            self.performUpdate()
        }
    }

    // MARK: - Weather Condition Override

    private func weatherOverrideTitle() -> String {
        if let cond = overrides.overriddenCondition {
            return "\(cond.sfSymbol.isEmpty ? "🌤" : "") Weather: \(cond.displayName)"
        }
        return "🌤 Weather: Auto"
    }

    private func buildWeatherOverrideMenu() -> NSMenu {
        let sub = NSMenu()

        let auto = NSMenuItem(title: "Auto (detect from weather API)", action: #selector(weatherAutoTapped), keyEquivalent: "")
        auto.target = self
        if overrides.weatherCondition == nil { auto.state = .on }
        sub.addItem(auto)

        sub.addItem(NSMenuItem.separator())

        let conditions: [WeatherCondition] = [.clear, .partlyCloudy, .cloudy, .foggy, .drizzle, .rainy, .snowy, .stormy]
        for cond in conditions {
            let item = NSMenuItem(title: cond.displayName, action: #selector(weatherConditionSelected(_:)), keyEquivalent: "")
            item.target = self
            item.representedObject = cond.rawValue
            if let img = NSImage(systemSymbolName: cond.sfSymbol, accessibilityDescription: cond.displayName) {
                item.image = img
            }
            if overrides.weatherCondition == cond.rawValue { item.state = .on }
            sub.addItem(item)
        }

        return sub
    }

    @objc private func weatherAutoTapped() {
        overrides.weatherCondition = nil
        overrides.save()
        refreshOverrideMenus()
        performUpdate()
    }

    @objc private func weatherConditionSelected(_ sender: NSMenuItem) {
        guard let raw = sender.representedObject as? String else { return }
        overrides.weatherCondition = raw
        overrides.save()
        refreshOverrideMenus()
        performUpdate()
    }

    // MARK: - Time of Day Override

    private func timeOverrideTitle() -> String {
        if let tod = overrides.overriddenTimeOfDay {
            return "🕐 Time: \(tod.displayName)"
        }
        return "🕐 Time: Auto"
    }

    private func buildTimeOverrideMenu() -> NSMenu {
        let sub = NSMenu()

        let auto = NSMenuItem(title: "Auto (detect from clock + sunrise/sunset)", action: #selector(timeAutoTapped), keyEquivalent: "")
        auto.target = self
        if overrides.timeOfDay == nil { auto.state = .on }
        sub.addItem(auto)

        sub.addItem(NSMenuItem.separator())

        let periods: [TimeOfDay] = [.dawn, .morning, .afternoon, .sunset, .evening, .night]
        for tod in periods {
            let item = NSMenuItem(title: tod.displayName, action: #selector(timeSelected(_:)), keyEquivalent: "")
            item.target = self
            item.representedObject = tod.rawValue
            if overrides.timeOfDay == tod.rawValue { item.state = .on }
            sub.addItem(item)
        }

        return sub
    }

    @objc private func timeAutoTapped() {
        overrides.timeOfDay = nil
        overrides.save()
        refreshOverrideMenus()
        performUpdate()
    }

    @objc private func timeSelected(_ sender: NSMenuItem) {
        guard let raw = sender.representedObject as? String else { return }
        overrides.timeOfDay = raw
        overrides.save()
        refreshOverrideMenus()
        performUpdate()
    }

    // MARK: - Refresh Override Menus

    private func refreshOverrideMenus() {
        locationOverrideItem.title = locationOverrideTitle()
        locationOverrideItem.submenu = buildLocationOverrideMenu()

        weatherOverrideItem.title = weatherOverrideTitle()
        weatherOverrideItem.submenu = buildWeatherOverrideMenu()

        timeOverrideItem.title = timeOverrideTitle()
        timeOverrideItem.submenu = buildTimeOverrideMenu()

        lockItem.title = lockMenuTitle()
    }

    // MARK: - Actions

    @objc private func refreshTapped() {
        // Manual refresh bypasses the lock
        performUpdate(bypassLock: true)
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

    private func performUpdate(bypassLock: Bool = false) {
        // If the wallpaper is locked and this isn't a manual refresh, skip
        if overrides.isLocked && !bypassLock { return }

        Task {
            await runUpdatePipeline()
        }
    }

    private func runUpdatePipeline() async {
        // 1. Location (use override if set)
        var location: LocationData
        if let overrideName = overrides.locationName {
            // Use a synthetic LocationData with the override name as city
            // We still need coordinates for weather, so fetch real location silently
            let realLocation = await locationService.fetchLocation()
            location = LocationData(
                latitude: realLocation?.latitude ?? 37.7749,
                longitude: realLocation?.longitude ?? -122.4194,
                city: overrideName,
                region: realLocation?.region ?? ""
            )
        } else {
            guard let loc = await locationService.fetchLocation() else {
                DispatchQueue.main.async { self.conditionItem.title = "⚠️ Location unavailable" }
                return
            }
            location = loc
        }
        lastLocation = location

        // 2. Weather
        guard let weather = await weatherService.fetch(latitude: location.latitude,
                                                       longitude: location.longitude) else {
            DispatchQueue.main.async { self.conditionItem.title = "⚠️ Weather fetch failed" }
            return
        }
        lastWeather = weather

        // 3. Apply overrides for condition and time-of-day
        let condition = overrides.overriddenCondition ?? weather.condition
        let timeOfDay = overrides.overriddenTimeOfDay
            ?? TimeOfDay.current(sunrise: weather.sunrise, sunset: weather.sunset)

        // 4. Render & apply wallpaper (web image → procedural fallback)
        await wallpaperManager.update(condition: condition, timeOfDay: timeOfDay,
                                      temperature: weather.temperature, location: location)

        // 5. Update menu bar
        DispatchQueue.main.async {
            self.refreshMenu(weather: weather, location: location,
                           condition: condition, timeOfDay: timeOfDay)
        }
    }

    private func refreshMenu(weather: WeatherData, location: LocationData,
                            condition: WeatherCondition, timeOfDay: TimeOfDay) {
        // Show override indicator if any override is active
        let condPrefix = overrides.overriddenCondition != nil ? "⊘ " : ""
        conditionItem.title   = "\(condPrefix)\(condition.displayName)"
        temperatureItem.title = "🌡️ \(String(format: "%.0f", weather.temperature))°F"

        let hood = !location.neighborhood.isEmpty ? location.neighborhood
                 : !location.areaOfInterest.isEmpty ? location.areaOfInterest
                 : ""
        let loc = hood.isEmpty
            ? "\(location.city), \(location.region)"
            : "\(hood), \(location.city)"
        let locPrefix = overrides.locationName != nil ? "⊘ " : ""
        locationItem.title = "📍 \(locPrefix)\(loc)"

        let fmt = DateFormatter()
        fmt.timeStyle = .short
        let lockLabel = overrides.isLocked ? " 🔒" : ""
        lastUpdateItem.title = "Updated \(fmt.string(from: Date()))\(lockLabel)"

        // Status bar icon
        let symbol = timeOfDay.isNight ? condition.nightSfSymbol : condition.sfSymbol
        if let img = NSImage(systemSymbolName: symbol,
                             accessibilityDescription: condition.displayName) {
            statusItem.button?.image = img
        }
    }
}
