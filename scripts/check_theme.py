"""Check palette contrast, wallpapers, and previews (Python 3.11+, Pillow).

Optionally pass a directory containing Omarchy's default/themed/*.tpl files.
Templates are read as text, never executed.
"""

import hashlib
import json
from pathlib import Path
import re
import sys
import tomllib

from PIL import Image


root = Path(__file__).resolve().parents[1]
palette = tomllib.loads((root / "colors.toml").read_text())
assert palette["mode"] == "dark"
for key, value in palette.items():
    if key != "mode":
        assert re.fullmatch(r"#[0-9a-fA-F]{6}", value), key


def luminance(value):
    channels = [int(value[i:i + 2], 16) / 255 for i in (1, 3, 5)]
    linear = [c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4 for c in channels]
    return sum(c * weight for c, weight in zip(linear, (0.2126, 0.7152, 0.0722)))


def contrast(first, second):
    low, high = sorted(luminance(palette[key]) for key in (first, second))
    return (high + 0.05) / (low + 0.05)


pairs = [("foreground", "background"), ("bright_foreground", "selection"),
         ("muted", "lighter_background"), ("background", "accent")]
pairs += [(key, "background") for key in
          ("red", "green", "yellow", "orange", "blue", "magenta", "cyan", "brown")]
for first, second in pairs:
    ratio = contrast(first, second)
    assert ratio >= 4.5, (first, second, ratio)
    print(f"{first}/{second}: {ratio:.2f}:1")

records = json.loads((root / "docs/backgrounds.json").read_text())
assert len(records) == 36
assert records[0]["file"] == "backgrounds/01-forest.webp"
assert [r["file"] for r in records] == sorted(r["file"] for r in records)
assert {r["file"] for r in records} == {str(p.relative_to(root)) for p in (root / "backgrounds").glob("*.webp")}
assert {r["preview"] for r in records} == {str(p.relative_to(root)) for p in (root / "docs/previews").glob("*.jpg")}
for record in records:
    path = root / record["file"]
    assert hashlib.sha256(path.read_bytes()).hexdigest() == record["sha256"], path
    with Image.open(path) as picture:
        picture.load()
        assert picture.size == (record["width"], record["height"]), path
        assert picture.width >= 3840 and picture.height >= 2160, path
        assert max(picture.size) <= 5120, path
        assert picture.size == (3840, 2160), path
        assert record["model"] == "gpt-image-2", path
        assert record["requested_size"] == "3840x2160", path
        assert record["quality"] == "high", path
    with Image.open(root / record["preview"]) as preview:
        preview.load()
        assert max(preview.size) == 1280, record["preview"]
        assert preview.size == (1280, 720), record["preview"]
with Image.open(root / "preview.png") as cover:
    cover.load()
    assert cover.size == (1920, 1080)
assert (root / "icons.theme").read_text().strip() == "Yaru-wartybrown"

for document in (root / "README.md",):
    for target in re.findall(r"\]\(([^)]+)\)", document.read_text()):
        if not target.startswith(("https://", "http://", "#")):
            assert (document.parent / target).is_file(), (document, target)
print("36 wallpapers and 36 previews decoded; dimensions, order, SHA-256, and local links verified")

if len(sys.argv) > 1:
    templates = sorted(Path(sys.argv[1]).glob("*.tpl"))
    assert templates, "No templates found"
    # Aliases provided by Omarchy's omarchy-theme-color (quattro).
    values = dict(palette)
    values.update(selection_background=palette["selection"],
                  selection_foreground=palette["bright_foreground"],
                  theme_type=palette["mode"], purple=palette["magenta"])
    for key, value in list(values.items()):
        values[key + "_strip"] = value.removeprefix("#")
        if value.startswith("#"):
            values[key + "_rgb"] = ",".join(str(int(value[i:i + 2], 16)) for i in (1, 3, 5))
    def resolve(match):
        parts = match[1].split()
        if len(parts) == 1:
            return values[parts[0]]
        if parts[0] == "mix":
            _, first, second, amount = parts
            fraction = float(amount.removesuffix("%"))
            if amount.endswith("%") or fraction > 1:
                fraction /= 100
            channels = [int(int(values[first][i:i + 2], 16) * (1 - fraction)
                            + int(values[second][i:i + 2], 16) * fraction + 0.5)
                        for i in (1, 3, 5)]
            return "#" + "".join(f"{c:02x}" for c in channels)
        if parts[0] in ("hypr_gradient", "shell_gradient"):
            _, key, fallback = parts
            value = values.get(key, values.get(fallback, fallback))
            return json.dumps(value) if parts[0] == "hypr_gradient" else value
        raise ValueError(f"Unsupported template expression: {match[1]}")

    for template in templates:
        result = re.sub(r"\{\{\s*(.*?)\s*\}\}", resolve, template.read_text())
        assert "{{" not in result, template
        if template.name.endswith(".json.tpl"):
            json.loads(result)
        elif template.name.endswith(".toml.tpl"):
            tomllib.loads(result)
    print(f"{len(templates)} templates resolved; generated JSON/TOML parsed")
