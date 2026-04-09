#!/usr/bin/env bash
#
# build.sh — Compile WeatherWall, package as .app, and create a .dmg installer.
# Requirements: Xcode Command Line Tools (xcode-select --install)
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BUILD_DIR="$SCRIPT_DIR/build"
APP_DIR="$BUILD_DIR/WeatherWall.app/Contents"
DMG_STAGING="$BUILD_DIR/dmg_staging"
DMG_PATH="$BUILD_DIR/WeatherWall.dmg"

echo "🔨 Compiling WeatherWall…"

rm -rf "$BUILD_DIR"
mkdir -p "$APP_DIR/MacOS" "$APP_DIR/Resources"

# Detect architecture
ARCH="$(uname -m)"   # arm64 or x86_64

swiftc \
    -target "${ARCH}-apple-macosx13.0" \
    -sdk "$(xcrun --show-sdk-path)" \
    -framework Cocoa \
    -framework CoreLocation \
    -framework ImageIO \
    -O \
    -o "$APP_DIR/MacOS/WeatherWall" \
    "$SCRIPT_DIR"/Sources/*.swift

echo "📦 Packaging app bundle…"

cp "$SCRIPT_DIR/Resources/Info.plist" "$APP_DIR/Info.plist"
cp "$SCRIPT_DIR/Resources/AppIcon.icns" "$APP_DIR/Resources/AppIcon.icns"

# Ad-hoc code sign with entitlements (required for location access)
codesign --force --sign - \
    --entitlements "$SCRIPT_DIR/WeatherWall.entitlements" \
    "$BUILD_DIR/WeatherWall.app"

echo "💿 Creating DMG installer…"

rm -rf "$DMG_STAGING" "$DMG_PATH"
mkdir -p "$DMG_STAGING"

# Copy the signed app and create an Applications alias for drag-to-install
cp -R "$BUILD_DIR/WeatherWall.app" "$DMG_STAGING/"
ln -s /Applications "$DMG_STAGING/Applications"

hdiutil create \
    -volname "WeatherWall" \
    -srcfolder "$DMG_STAGING" \
    -ov \
    -format UDZO \
    "$DMG_PATH"

rm -rf "$DMG_STAGING"

echo ""
echo "✅ Build complete!"
echo ""
echo "   DMG installer:  $DMG_PATH"
echo "   App bundle:     $BUILD_DIR/WeatherWall.app"
echo ""
echo "Open the DMG and drag WeatherWall into Applications to install."
