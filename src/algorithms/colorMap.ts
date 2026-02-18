import { hexToRgb } from '../utils/color';

// Map grayscale to a palette of colors
export function mapToPalette(
  imageData: ImageData,
  palette: string[]
): ImageData {
  const { data } = imageData;

  // Convert hex palette to RGB objects
  const rgbPalette = palette.map(hex => hexToRgb(hex));

  // Create a Lookup Table (LUT) for 0-255 grayscale values
  const lut = new Uint8ClampedArray(256 * 3); // R, G, B for each gray level

  for (let i = 0; i < 256; i++) {
    // Normalize 0-255 to 0-(palette.length - 1)
    const position = (i / 255) * (rgbPalette.length - 1);
    const index = Math.floor(position);
    const nextIndex = Math.min(rgbPalette.length - 1, index + 1);
    const t = position - index; // Interpolation factor

    // Linear interpolation
    const c1 = rgbPalette[index];
    const c2 = rgbPalette[nextIndex];

    lut[i * 3] = c1.r + (c2.r - c1.r) * t;
    lut[i * 3 + 1] = c1.g + (c2.g - c1.g) * t;
    lut[i * 3 + 2] = c1.b + (c2.b - c1.b) * t;
  }

  for (let i = 0; i < data.length; i += 4) {
    // Input is grayscale, so R=G=B. We use R.
    const gray = data[i];

    data[i] = lut[gray * 3];
    data[i + 1] = lut[gray * 3 + 1];
    data[i + 2] = lut[gray * 3 + 2];
  }

  return imageData;
}
