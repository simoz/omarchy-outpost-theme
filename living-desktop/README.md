# Outpost · Living desktop

A living pixel-art companion to **Forest — Night**, with autonomous maintenance
robots, occasional cargo drones, short repairs, shooting stars, river highlights,
fireflies and a distant station beacon. The original 3840 × 2160 wallpaper stays
intact. The camera stays still; activity happens inside the scene.

Inspired by the living scenes in [NO SIGNAL's Living Desktops chapter](https://www.youtube.com/watch?v=lGAhLsS5ndk&t=1043s).
This version uses a real-time 2D simulation and hand-drawn procedural pixel sprites.
Each session has a different event sequence; it is not a repeating video.

## Preview

Open `index.html` in a browser. All assets are local; no installation, build,
network connection or account is needed. Keep this directory inside the theme,
next to `backgrounds/`.

- **Pausa / Riprendi** pauses the simulation.
- **Invia drone**, **Manutenzione** and **Meteora** trigger a preview of an event.
- **Quiete / Viva / Più attività** sets ambient intensity and event frequency.
- **Solo sfondo** hides the controls; press **H** to show them again.
- **Space** pauses or resumes. **Schermo intero** opens fullscreen.

The browser pauses the simulation while its tab is hidden, caps the overlay at
24 fps and starts paused when reduced motion is requested. Add `?wallpaper=1` to
hide the interface, or `?seed=42` to reproduce an event sequence. `?still=1` starts
paused for inspecting the artwork.

## On Omarchy / Hyprland

The included `shell.qml` creates a standalone Quickshell background surface on
each connected monitor, beneath application windows, without taking keyboard or
pointer input. Start it from the theme checkout **after omarchy-shell is running**:

```sh
quickshell -p /path/to/omarchy-outpost-theme/living-desktop/shell.qml
```

Leave the process running. **Ctrl+C** in that terminal stops it and reveals the
usual static wallpaper. This does not change shell configuration or install a
plugin. For now, start it manually; automatic startup and theme-switch integration
are not included.

The wrapper uses [Quickshell PanelWindow](https://quickshell.org/docs/v0.2.1/types/Quickshell/PanelWindow/),
the [Wayland background layer](https://quickshell.org/docs/v0.2.1/types/Quickshell.Wayland/WlrLayershell/)
and [Qt Quick Canvas](https://doc.qt.io/qt-6/qml-qtquick-canvas.html). The animated
overlay is capped at 1920 pixels wide and about 24 fps; the static image retains
its full resolution. **The native wrapper has not been run on a live Omarchy
session.** The timer is designed to pause when Hyprland reports a fullscreen
window on that monitor's active workspace. Browser rendering and simulation
behavior are verified separately.

## Verification

```sh
node --check living-desktop/scene.js
node --test living-desktop/scene.test.cjs
```

The tests cover a simulated day of activity, event expiry, reproducible sessions,
pause behavior and activity settings. Browser smoke checks cover image loading,
animation, manual events, pause/resume and control visibility.

`scene.js` is shared by the browser and Quickshell, keeping the behavior of both
versions in one place. Original wallpaper: `../backgrounds/13-forest-night.webp`.
