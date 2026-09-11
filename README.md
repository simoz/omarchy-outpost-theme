# Outpost · Omarchy 4

<img src="docs/branding/logo.png" alt="Three distinct Outpost robot heads" width="480">

A pixel art theme for Omarchy inspired by remote outposts, wild landscapes, and life alongside robots.

[![Outpost theme on Omarchy with an editor, terminal, btop, and file manager](docs/screenshots/hero.webp)](docs/screenshots/hero.webp)

## Backgrounds

Twelve wallpapers, all 3840 × 2160. Click a preview to open the full-resolution PNG.

| | | |
| --- | --- | --- |
| [![Forest](docs/previews/01-forest.jpg)](backgrounds/01-forest.png)<br>Forest | [![Desert](docs/previews/02-desert.jpg)](backgrounds/02-desert.png)<br>Desert | [![Mediterranean](docs/previews/03-mediterranean.jpg)](backgrounds/03-mediterranean.png)<br>Mediterranean |
| [![Tundra](docs/previews/04-tundra.jpg)](backgrounds/04-tundra.png)<br>Tundra | [![Swamp](docs/previews/05-swamp.jpg)](backgrounds/05-swamp.png)<br>Swamp | [![Volcanic](docs/previews/06-volcanic.jpg)](backgrounds/06-volcanic.png)<br>Volcanic |
| [![Steppe](docs/previews/07-steppe.jpg)](backgrounds/07-steppe.png)<br>Steppe | [![Tropical archipelago](docs/previews/08-tropical-archipelago.jpg)](backgrounds/08-tropical-archipelago.png)<br>Tropical archipelago | [![Alpine mountains](docs/previews/09-alpine.jpg)](backgrounds/09-alpine.png)<br>Alpine mountains |
| [![Rolling hills](docs/previews/10-rolling-hills.jpg)](backgrounds/10-rolling-hills.png)<br>Rolling hills | [![Water city](docs/previews/11-water-city.jpg)](backgrounds/11-water-city.png)<br>Water city | [![Overgrown ruins](docs/previews/12-overgrown-ruins.jpg)](backgrounds/12-overgrown-ruins.png)<br>Overgrown ruins |

## Inspiration

Weathered retrofuturistic structures frame vast, open landscapes, while small maintenance robots lend a sense of scale. Petroleum shadows, bronze metal, and ivory light tie together ten biomes and two urban settings. The interface palette draws from these shared tones and remains consistent as wallpapers change.

## Installation

Once this repository has been published, run this command on your Omarchy 4 machine:

```sh
omarchy theme install https://github.com/simoz/omarchy-outpost-theme
```

To switch back, select your previous theme from Omarchy's theme menu.

## Unlock screen

![Outpost unlock concept with the three original robot designs](docs/branding/unlock-three-robots-preview.png)

This generated concept shows the three Outpost robots in an unlock-screen layout; it is not a screenshot from a running system. The current `unlock.png` still contains the single robot with a transparent background. Select **Style → Unlock → Outpost** to apply that boot artwork on a system configured with Plymouth.

## About

[The optional About artwork](about.txt) shows a block-art robot with **NO SIGNAL. STILL HERE.** beneath it.

After installing or updating the theme, run these commands on your Omarchy machine. If you already have custom About artwork, save a copy of `~/.config/omarchy/branding/about.txt` first; the copy command replaces it.

```sh
mkdir -p ~/.config/omarchy/branding
cp ~/.config/omarchy/themes/outpost/about.txt ~/.config/omarchy/branding/about.txt
```

Close and reopen **About** to see the change. This is a personal branding setting: selecting or updating Outpost does not copy the artwork automatically, and switching themes does not remove it. Repeat the copy command after updating the artwork.

The artwork has not yet been tested in a live Omarchy session.

## Screensaver

[The optional screensaver](screensaver.txt) pairs the same block-art robot used in About with the Outpost wordmark and **NO SIGNAL. STILL HERE.** Omarchy supplies the animation effects.

After installing the theme, run these commands on your Omarchy machine to activate it. If you already have a custom screensaver, save a copy of `~/.config/omarchy/branding/screensaver.txt` first; the copy command replaces it.

```sh
mkdir -p ~/.config/omarchy/branding
cp ~/.config/omarchy/themes/outpost/screensaver.txt ~/.config/omarchy/branding/screensaver.txt
```

Open **System → Screensaver** to preview it. This is a personal branding setting: selecting Outpost does not activate it automatically, and switching themes does not remove it. Use **Style → Screensaver → Restore Default** to restore the Omarchy logo.

The artwork has not yet been tested in a live Omarchy session.

## Shell

Petroleum surfaces, ivory text and bronze borders carry through the bar, menus, launcher, notifications and authentication dialogs. Selected menu rows use a solid blue-green background. `shell.toml` defines the appearance; personal settings in `~/.config/omarchy/shell.toml` take precedence.

The session lock uses the current wallpaper with Omarchy’s built-in blur, an opaque petroleum password field and bronze borders. The robot belongs to the separate boot unlock screen.

## Desktop previews

Click a screenshot to view it at full size. Captured on Omarchy 4.0.2-1.

| Desktop | Terminal |
| --- | --- |
| [![Outpost desktop with the forest wallpaper](docs/screenshots/desktop.webp)](docs/screenshots/desktop.webp) | [![Transparent terminal with the Outpost color palette](docs/screenshots/terminal.webp)](docs/screenshots/terminal.webp) |
| **Omarchy menu** | **Lock screen** |
| [![Omarchy menu with bronze borders and petroleum surfaces](docs/screenshots/menu.webp)](docs/screenshots/menu.webp) | [![Outpost lock screen with a blurred wallpaper and bronze password-field border](docs/screenshots/lock.webp)](docs/screenshots/lock.webp) |

## Palette

![Outpost palette](docs/palette.svg)

| Role | Color |
| --- | --- |
| Petroleum background | `#14282d` |
| Surfaces | `#253c41` |
| Ivory text | `#e8dfc4` |
| Bronze accent | `#d3ae78` |
| Selection | `#3d5960` |
| Secondary text | `#a1afa9` |
| Terracotta | `#d78f79` |
| Mist blue | `#91afc5` |

`colors.toml` contains the proposed palette, including bright terminal variants. `icons.theme` selects `Yaru-wartybrown`.

Opaque-color contrast: primary text 11.51:1 on the background; primary text 5.64:1 on selection; secondary text 5.12:1 on lighter surfaces. The eight semantic terminal colors exceed 4.5:1 on the main background. Transparency and application customizations may change these results.

## Compatibility

The theme uses the Omarchy 4 central palette format. Omarchy generates application configurations from its [official templates](https://github.com/omacom/omarchy/tree/quattro/default/themed), so separate configuration copies for each application are unnecessary. The included `shell.toml` customizes the shared shell surfaces. The screenshots above show the theme running on Omarchy 4.0.2-1.

## Image credits

Artwork created for Outpost with OpenAI image generation. Wallpapers are 3840 × 2160, with no post-generation upscaling; gallery previews are reduced copies. The generated unlock concept references the layout of [Omarchy’s Plymouth theme](https://github.com/omacom/omarchy/tree/quattro/default/plymouth).

## License

See the [MIT License](LICENSE).
