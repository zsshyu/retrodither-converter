# RetroDither Converter

A lightweight web tool for generating retro dithering style images. Upload any image and apply classic dithering algorithms with customizable colors to create vintage digital art. 🎨

## ✨ Features

- 🔲 **Dithering Algorithms**: Bayer (ordered) and None (direct mapping)
- 🎨 **Customizable Palette**: 2-4 color palette with color pickers and HEX display
- 🌟 **Bloom Effect**: Adjustable intensity, threshold, and radius
- 📺 **Noise Effects**: Grayscale and RGB colored noise (CRT effect)
- 🎛️ **6 Built-in Presets**: Retro Blue, Classic B&W, GameBoy Green, Amber Terminal, Sunset, Neon Cyan
- ⚡ **WYSIWYG Preview**: What you see is what you get - preview matches download
- 📤 **Export Options**: PNG/JPEG/WebP formats with 1x/2x/4x scaling
- 🌍 **Multi-language**: English, Chinese, French

## 🖼️ Usage

1. Drag & drop an image or click to upload (max 4096x4096)
2. Select a preset or customize the palette (2-4 colors)
3. Adjust parameters: pixel size, brightness, contrast, bloom
4. Choose dithering algorithm (Bayer or None)
5. Add noise for extra retro effect
6. Download the result (matches preview exactly)

## 🛠️ Tech Stack

- Vanilla TypeScript + Vite
- Tailwind CSS
- Canvas API + Web Worker
- Single-file build (vite-plugin-singlefile)
- Zero framework dependencies

## 🚀 Deployment

Built as a single HTML file for easy deployment on itch.io or any static host.

```bash
npm run build
# Output: dist/index.html (single file)
```

## 📄 License

MIT License