# WeatherWall

A lightweight macOS menu-bar app that sets your desktop wallpaper to a real photo matching the current weather at your location — inspired by the iPhone's dynamic weather wallpaper.

**Current version: 0.9**

## Features

- **Real-photo wallpapers** — searches [Unsplash](https://unsplash.com) for images matching your city, neighborhood, weather, and time of day (e.g. _"San Francisco Financial District rain night"_).
- **Procedural fallback** — if no API key is set or no photos are found, the app generates gradient sky wallpapers with stars, sun/moon, clouds, rain, and snow.
- **Restore on quit** — your original wallpaper is saved on launch and automatically restored when you quit the app.
- **Time-of-day awareness** — dawn, morning, afternoon, sunset, evening, and night all influence the search query.
- **Auto-updates every 30 minutes** in the background.
- **Image caching** — downloaded photos are cached for 2 hours to avoid redundant network calls; cache is pruned daily.
- **No API key required to run** — the Unsplash key is optional; without it, you still get beautiful procedural wallpapers.
- **Multi-display spanning** — when screens are arranged side-by-side and the image is wide enough, one panoramic image is sliced across all displays (left third / middle / right third). Falls back to the same image on all screens if the resolution is insufficient.
- **Neighborhood tracking** — continuous significant-location-change monitoring detects when you move to a different neighborhood and refreshes the wallpaper immediately.
- **Location detection** — CoreLocation with reverse geocoding (gives neighborhood + landmark precision), or IP geolocation as a zero-permission fallback.
- **Menu-bar only** — no Dock icon; shows a weather-condition icon.

## Requirements

- macOS 13 (Ventura) or later
- Xcode Command Line Tools (`xcode-select --install`)
- _(Optional)_ A free Unsplash API key for real-photo wallpapers

## Quick Start

```bash
cd WeatherWall
./build.sh
open build/WeatherWall.dmg
```

Drag **WeatherWall** into **Applications** and launch it. The app will prompt you for an Unsplash API key on first run — you can skip this to use procedural wallpapers instead.

## Getting an Unsplash API Key (free)

1. Go to [unsplash.com/developers](https://unsplash.com/developers) and sign up / log in.
2. Click **New Application**, accept the terms, give it any name.
3. Copy the **Access Key** (not the Secret Key).
4. Paste it into the dialog that WeatherWall shows on first launch, or click **Set Unsplash API Key…** in the menu bar dropdown at any time.

The free tier allows 50 requests/hour — more than enough for updates every 30 minutes.

## Launch at Login

1. Open **System Settings → General → Login Items**.
2. Click **+** and select **WeatherWall** from Applications.

## Menu-Bar Controls

| Item | Description |
|------|-------------|
| **Condition** | Current weather (e.g., Clear Sky, Rainy) |
| **Temperature** | Current temperature in °F |
| **Location** | Detected neighborhood and city |
| **Updated** | Timestamp of last wallpaper refresh |
| **Lock / Unlock Wallpaper (⌘L)** | Freeze the current wallpaper until unlocked |
| **Override → Location** | Auto (GPS) or custom city/neighborhood |
| **Override → Weather** | Auto or pick a specific condition |
| **Override → Time** | Auto or pick a specific time of day |
| **Update Now (⌘R)** | Force an immediate refresh (bypasses lock) |
| **Set / Change Unsplash API Key…** | Enter or update your API key |
| **Quit (⌘Q)** | Restore original wallpaper and exit |

## How It Works

1. **Location** — CoreLocation + reverse geocoding for city and neighborhood, or IP geolocation via `ip-api.com` as fallback.
2. **Weather** — Open-Meteo's current-weather endpoint (free, no key) returns a WMO weather code, temperature, and day/night flag.
3. **Image search** — builds a query like _"San Francisco rain night"_ and searches Unsplash for landscape photos; picks a random result from the top 5 for variety.
4. **Caching** — downloaded images are saved to `~/Library/Application Support/WeatherWall/cache/` and reused for 2 hours; files older than 24 hours are pruned on launch.
5. **Fallback** — if Unsplash is unavailable or no API key is set, the app generates a procedural sky gradient with weather-appropriate elements via Core Graphics.
6. **Wallpaper apply** — the image is set on all screens via `NSWorkspace.setDesktopImageURL`.
7. **Restore on quit** — on launch, the current wallpaper for each screen is saved (in memory + to `original_wallpapers.json`); on quit, those originals are restored.

## Project Structure

```
WeatherWall/
├── Sources/
│   ├── main.swift                # App entry point
│   ├── AppDelegate.swift         # Menu-bar UI, update timer, API key dialog
│   ├── Models.swift              # WeatherCondition, TimeOfDay, search query builder
│   ├── LocationService.swift     # CoreLocation + IP-geolocation fallback
│   ├── WeatherService.swift      # Open-Meteo API client
│   ├── ImageSearchService.swift  # Unsplash search, download, and caching
│   ├── WallpaperRenderer.swift   # Core Graphics procedural sky renderer (fallback)
│   ├── WallpaperManager.swift    # Orchestrates web/procedural images + save/restore
│   └── LocationSearchPanel.swift # Predictive location search with MKLocalSearchCompleter
├── Resources/
│   ├── AppIcon.icns             # App icon (SF skyline + Golden Gate)
│   └── Info.plist
├── WeatherWall.entitlements
├── build.sh                      # Compile → sign → DMG
└── README.md
```

## Customization

- **Update interval** — change `1800` (seconds) in `AppDelegate.swift`.
- **Temperature unit** — change `fahrenheit` to `celsius` in `WeatherService.swift`.
- **Color palettes** — edit `basePalette(for:)` in `WallpaperRenderer.swift`.
- **Search queries** — tweak `buildSearchQuery()` in `Models.swift` to adjust what the app searches for.
- **Overrides** — set location, weather, or time of day from the menu bar; persisted in `~/Library/Application Support/WeatherWall/overrides.json`.
- **Cache duration** — change the `7200` (seconds) in `ImageSearchService.swift`.

## Version History

### 0.9 — April 8, 2026
- **Added** location text overlay — the current location name is rendered vertically along the bottom-right edge of the wallpaper, reading from bottom to top. Subtle white text with shadow for readability against any background.
- **Fixed** multi-display panorama — completely rewritten spanning logic. The image is now scaled to fill the combined canvas (cover mode) using Core Graphics before slicing, guaranteeing no blank stripes. Each screen gets its corresponding slice of the panoramic image. Works with any number of side-by-side screens.
- **Added** predictive location search — the location override now opens a dedicated search panel powered by `MKLocalSearchCompleter` (Apple’s MapKit). As you type, real-time suggestions appear just like Google Maps — cities, neighborhoods, landmarks, and points of interest. Click a suggestion or double-click to apply immediately.
- Added MapKit framework dependency.

### 0.8 — April 8, 2026
- **Fixed** wallpaper restore on quit — the app now reliably restores the user's own wallpaper, not a system default or a WeatherWall-generated image from a previous session. On launch, if the current wallpaper is one of ours, the app loads the persisted originals from disk instead of re-saving them.
- **Improved** original wallpaper persistence — now stores scaling mode and clipping options alongside the file path, so the restored wallpaper matches the user's exact display settings.
- **Added** multi-display spanning — when multiple screens are arranged side-by-side and the source image is wide enough (≥70% of the combined canvas), the image is cropped into per-screen slices so it flows continuously across all displays. Each screen gets its corresponding portion (left, center, right).
- Falls back gracefully to the same image on all screens when the source image is too narrow or screens are stacked vertically.
- Screens are sorted by their global x-coordinate for correct left-to-right ordering.
- Per-screen slice files are saved as `screen_<displayID>.png` in the app support directory.

### 0.7 — April 8, 2026
- **Added** override controls in the dropdown menu — enforce a specific location, weather condition, or time of day instead of auto-detecting them. Each override persists across app restarts.
  - **Location** — set any city or neighborhood name (e.g. "Financial District, San Francisco") for wallpaper searches while still using your real coordinates for weather data.
  - **Weather** — pick any condition (Clear, Rainy, Snowy, etc.) from a submenu with SF Symbols icons.
  - **Time of Day** — choose Dawn, Morning, Afternoon, Sunset, Evening, or Night.
  - Each override shows a checkmark on the active selection and an ⊘ indicator in the status display.
- **Added** wallpaper lock (⌘L) — freezes the current wallpaper, blocking all auto-updates and location-triggered refreshes until you unlock. "Update Now" (⌘R) bypasses the lock for one-off refreshes.
- Override state and lock are persisted to `overrides.json` and survive app restarts.

### 0.6 — April 8, 2026
- **Added** custom app icon — SF skyline with the Golden Gate Bridge and a subtle sunset glow.
- **Fixed** wallpaper falling back to the procedural renderer when the neighborhood query was too specific for Unsplash.
- **Added** cascading search fallback — the app now tries progressively broader queries until it finds a real photo:
  1. `Inner Sunset San Francisco rain afternoon` (neighborhood + city + weather + time)
  2. `San Francisco rain afternoon` (city + weather + time)
  3. `San Francisco rain` (city + weather)
  4. `San Francisco` (city only)
- Cache is checked for all query levels before making any API calls, minimizing network usage.
- The procedural gradient renderer is now truly a last resort, only used when all Unsplash queries fail or no API key is set.

### 0.5 — April 8, 2026
- **Added** continuous neighborhood tracking via `startMonitoringSignificantLocationChanges()` — when the user moves ~500 m (e.g. Inner Sunset → Financial District), the wallpaper refreshes immediately without waiting for the 30-minute timer.
- **Improved** reverse geocoding now extracts `subLocality` (neighborhood) and `areasOfInterest` (landmarks) from `CLPlacemark` for richer place names.
- **Improved** location accuracy upgraded from ~1 km to ~100 m for meaningful neighborhood resolution.
- **Improved** search queries now lead with the neighborhood (e.g. _"Inner Sunset San Francisco sunny afternoon"_) for more locally relevant photos.
- **Added** automatic monitoring start when the user grants location permission mid-session.
- Menu bar now displays the detected neighborhood (e.g. "📍 Inner Sunset, San Francisco").

### 0.4 — April 8, 2026
- **Improved** time-of-day detection now uses actual sunrise/sunset data from Open-Meteo instead of fixed clock hours — dawn, golden hour, and dusk shift naturally with the season and latitude.
- **Improved** search queries now include a time modifier for all six periods (night, sunrise, morning, afternoon, sunset/golden hour, dusk/twilight) instead of only three.
- **Improved** Unsplash queries use photographic terms (`golden hour`, `dusk`, `twilight`) that match how photographers tag their images, yielding more accurate results.

### 0.3 — April 8, 2026
- **Fixed** Cmd+V / Cmd+C / Cmd+X / Cmd+A now work in the API key dialog (custom `EditableTextField` subclass routes key equivalents inside `NSAlert`).
- **Added** version tracking in `Info.plist` and this changelog.
- API key persistence confirmed — key is saved to `~/Library/Application Support/WeatherWall/config.json` and loaded automatically on every launch.

### 0.2 — April 8, 2026
- **Added** real-photo wallpapers via the Unsplash API, matched to city + neighborhood + weather + time of day.
- **Added** image caching (2-hour expiry, 24-hour auto-prune) to minimize network calls.
- **Added** wallpaper restore on quit — original wallpaper is saved on launch and restored when the app exits.
- **Added** API key setup dialog (prompted on first launch; accessible anytime from the menu bar).
- **Added** neighborhood detection via CoreLocation reverse geocoding for more precise search queries.
- Procedural gradient renderer retained as a fallback when no API key is configured or Unsplash is unreachable.

### 0.1 — April 8, 2026
- Initial release.
- Procedural Core Graphics wallpaper renderer with layered sky gradients, sun/moon, stars, clouds, rain, snow, and fog.
- Weather data from Open-Meteo (free, no API key).
- Location via CoreLocation with IP geolocation fallback (ip-api.com).
- Auto-updates every 30 minutes.
- Menu-bar-only app with weather icon, temperature, location, and manual refresh.
- Multi-display support.
- DMG installer via `build.sh`.

## Credits

- Photo search: [Unsplash](https://unsplash.com)
- Weather data: [Open-Meteo](https://open-meteo.com) (free, open-source)
- Geolocation fallback: [ip-api.com](http://ip-api.com)
