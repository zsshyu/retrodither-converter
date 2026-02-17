# RetroDither Converter

A lightweight web tool for generating retro dithering style images. Upload any image and apply classic dithering algorithms with customizable colors to create vintage digital art. 🎨

## ✨ Features

- 🔲 **4 Dithering Algorithms**: Bayer (ordered), Floyd-Steinberg, Atkinson, Jarvis
- 🎨 **Duotone Color Mapping**: Hard threshold two-color effect
- 📺 **Noise Effects**: Grayscale and RGB colored noise (CRT effect)
- 🎛️ **10 Built-in Presets**: Classic B&W, Macintosh, Amber Terminal, CRT Blue, etc.
- ⚡ **WYSIWYG Preview**: What you see is what you get - preview matches download
- 📤 **Export Options**: PNG/JPEG/WebP formats with 1x/2x/4x scaling
- 🌍 **Multi-language**: English, Chinese, French

## 🖼️ Usage

1. Drag & drop an image or click to upload (max 4096x4096)
2. Adjust parameters: pixel size, brightness, contrast
3. Choose dithering algorithm
4. Pick dark/light colors or select a preset
5. Add noise for extra retro effect
6. Download the result (matches preview exactly)

## 🛠️ Tech Stack

- Vanilla TypeScript + Vite
- Tailwind CSS
- Canvas API + Web Worker
- Zero framework dependencies

## 📄 License

MIT License