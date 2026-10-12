import QtQuick
import Quickshell
import Quickshell.Wayland
import Quickshell.Hyprland
import "scene.js" as Scene

// Standalone background surface. Start after omarchy-shell so this surface sits
// above the static wallpaper. Stopping this process reveals the theme wallpaper.
ShellRoot {
    Variants {
        model: Quickshell.screens
        PanelWindow {
            id: wallpaper
            required property var modelData
            screen: modelData
            anchors { top: true; bottom: true; left: true; right: true }
            exclusionMode: ExclusionMode.Ignore
            WlrLayershell.layer: WlrLayer.Background
            WlrLayershell.namespace: "outpost-living-desktop"
            WlrLayershell.keyboardFocus: WlrKeyboardFocus.None
            mask: Region {}
            color: "#0c191e"
            readonly property var monitor: Hyprland.monitorFor(screen)
            readonly property bool covered: monitor && monitor.activeWorkspace
                ? monitor.activeWorkspace.hasFullscreen : false

            Image {
                id: landscape
                anchors.fill: parent
                source: Qt.resolvedUrl("../backgrounds/13-forest-night.webp")
                fillMode: Image.PreserveAspectCrop
                asynchronous: true
            }

            Canvas {
                id: life
                // Upload a bounded overlay, keeping the underlying image at 4K.
                width: Math.min(wallpaper.width, 1920)
                height: wallpaper.height * width / wallpaper.width
                scale: wallpaper.width / width
                transformOrigin: Item.TopLeft
                property var scene: Scene.createScene(Date.now() + wallpaper.screen.name.length * 101)
                property double lastTick: Date.now()
                Component.onCompleted: loadImage(landscape.source)
                onImageLoaded: requestPaint()
                onPaint: {
                    var context = getContext("2d");
                    context.clearRect(0, 0, width, height);
                    context.imageSmoothingEnabled = false;
                    scene.render(context, width, height,
                        isImageLoaded(landscape.source) ? landscape.source : null);
                }
                Timer {
                    interval: 42
                    repeat: true
                    running: wallpaper.visible && !wallpaper.covered && landscape.status === Image.Ready
                    onRunningChanged: life.lastTick = Date.now()
                    onTriggered: {
                        var now = Date.now();
                        life.scene.update(Math.min((now - life.lastTick) / 1000, 0.1));
                        life.lastTick = now;
                        life.requestPaint();
                    }
                }
            }
        }
    }
}
