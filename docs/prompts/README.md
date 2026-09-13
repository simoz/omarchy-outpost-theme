# Outpost lighting variants

Two companion packs are specified here: 12 night scenes and 12 dawn/sunset scenes, each based on the corresponding original wallpaper.

- [Night manifest](night-wallpapers.json)
- [Dawn/sunset manifest](golden-hour-wallpapers.json)

Each manifest records the original reference, intended output filename and exact prompt. Individual `.txt` files contain the same prompts for use with the bundled imagegen CLI.

Generation settings: OpenAI Image API, `gpt-image-2`, `high` quality, PNG, explicit native `3840x2160` output. Use the CLI `edit` command with the original image as `--image`, the saved text as `--prompt-file`, and `--no-augment` to send the exact saved prompt. Generate into `output/imagegen/`, verify the actual dimensions and artwork, then copy accepted originals into `backgrounds/`.

No post-generation upscaling, cropping or recoloring is intended. Lower-resolution built-in generation trials are not final pack assets.

All 24 companion wallpapers were generated on 2026-09-13, checked visually, and verified as 3840 × 2160 PNGs. Accepted API outputs are stored unchanged in `backgrounds/`; the staging copies were removed after byte-for-byte comparison. Gallery previews are reduced JPEG copies. File checksums, source references and prompt links are recorded in [the wallpaper metadata](../backgrounds.json).
