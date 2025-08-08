# Reverse Dino Run (Web + React Native / Expo)

This is a customized Chrome Dino-style runner with gravity flips, a devil world, glowing orbs, ink splats, a local leaderboard, and mobile touch controls via Expo.

## Web (Desktop/Browser)
- Open `DINO GAME.html` directly in a modern browser.
- Controls:
  - Space/Click: Jump
  - Down Arrow: Duck
  - P: Pause/Resume

## React Native (Expo)
The exact HTML game is embedded in a WebView. Touch is mapped as:
- Tap: Jump
- Press and hold: Duck (release to stand)

### Create and run the Expo app
```powershell
# From the project root
cd "C:\Users\bonit\Downloads\app game"
npx create-expo-app@latest dino-rn -t blank
cd dino-rn
npx expo install react-native-webview

# Copy the prepared files
Copy-Item -Force "..\rn-game-files\App.js" ".\App.js"
Copy-Item -Force "..\rn-game-files\game.html" ".\game.html"

# Start (clear cache recommended when testing controls)
npx expo start -c --tunnel
```

If you already have the app, just refresh files and restart:
```powershell
cd "C:\Users\bonit\Downloads\app game\dino-rn"
Copy-Item -Force "..\rn-game-files\App.js" ".\App.js"
Copy-Item -Force "..\rn-game-files\game.html" ".\game.html"
npx expo start -c --tunnel
```

### Known limitation (mobile ducking)
- Some devices may not detect hold-to-duck reliably depending on WebView timing. The app injects capture-phase listeners and repeatedly calls `duck()` while a finger is down. If ducking still fails on your device, lower the tap threshold or disable original touch handlers inside the WebView (ready to toggle in `rn-game-files/App.js`).

## Chroma-key sprite background removal
- The in-game loader auto-removes a flat background color from the sprite sheet by sampling the top-left pixel and converting similar colors to transparent.
- Tweak tolerance in `chromaKeyToTransparent(sprite, 55)` in `rn-game-files/game.html` if needed.

## Features
- Gravity flips every 8s with a cinematic transition
- Devil World mode with skull stacks and embers
- Orbs that trigger an ink overlay effect (non-lethal)
- Local leaderboard (stored in `localStorage`)
- Pause (P), start screen, and high score save

## Screenshots
![Gravity Flipping Demo](DEMO/gravity%20flipping%20DEMO.png)
![Devil World Mode](DEMO/Devil%20world.png)
![Orbs Demo](DEMO/orbs%20DEMO.png)

---
Built with HTML5 Canvas and JavaScript. Original concept inspired by Google’s Chrome Dino game.
