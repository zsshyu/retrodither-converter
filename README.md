# RetroDither Converter

A lightweight web tool for generating retro dithering style images. Upload any image and apply classic dithering algorithms with customizable colors to create vintage digital art. 🎨

## ✨ Features

- 🔲 **4 Dithering Algorithms**: Bayer (ordered), Floyd-Steinberg, Atkinson, Jarvis
- 🎨 **2 Color Modes**: Duotone (hard threshold) and Tint (gradient mapping)
- 📺 **Noise Effects**: Grayscale and RGB colored noise (CRT effect)
- 🎛️ **12 Built-in Presets**: Classic B&W, Macintosh, Amber Terminal, CRT Blue, etc.
- ⚡ **Real-time Preview**: Instant feedback with Web Worker processing
- 📤 **Export Options**: PNG/JPEG/WebP formats with 1x/2x/4x scaling
- 🌍 **Multi-language**: English, Chinese, French

## 🖼️ Usage

1. Drag & drop an image or click to upload (max 4096x4096)
2. Adjust parameters: pixel size, brightness, contrast
3. Choose dithering algorithm and color mode
4. Pick dark/light colors or select a preset
5. Add noise for extra retro effect
6. Download the result

## 🛠️ Tech Stack

- Vanilla TypeScript + Vite
- Tailwind CSS
- Canvas API + Web Worker
- Zero framework dependencies

## 📄 License

MIT License

Copyright (c) 2026 zsshyu

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
