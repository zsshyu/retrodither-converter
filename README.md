# RetroDither Converter

A lightweight web tool for generating retro dithering style images. Upload any image and apply classic dithering algorithms with customizable colors to create vintage digital art.

## Features

- **4 Dithering Algorithms**: Bayer (ordered), Floyd-Steinberg, Atkinson, Jarvis
- **2 Color Modes**: Duotone (hard threshold) and Tint (gradient mapping)
- **Noise Effects**: Grayscale and RGB colored noise (CRT effect)
- **12 Built-in Presets**: Classic B&W, Macintosh, Amber Terminal, CRT Blue, etc.
- **Real-time Preview**: Instant feedback with Web Worker processing
- **Export Options**: PNG/JPEG/WebP formats with 1x/2x/4x scaling
- **Multi-language**: English, Chinese, French

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Usage

1. Drag & drop an image or click to upload (max 4096x4096)
2. Adjust parameters: pixel size, brightness, contrast
3. Choose dithering algorithm and color mode
4. Pick dark/light colors or select a preset
5. Add noise for extra retro effect
6. Download the result

## Tech Stack

- Vanilla TypeScript + Vite
- Tailwind CSS
- Canvas API + Web Worker
- Zero framework dependencies

## License

MIT
