import { hexToRgb } from '../utils/color';
import type { ColorMode } from '../types';

// Duotone: Map grayscale to two colors based on dithered black/white
export function mapToDuotone(
  imageData: ImageData,
  darkColor: string,
  lightColor: string
): ImageData {
  const { width, height, data } = imageData;
  const result = new ImageData(width, height);
  const resultData = result.data;

  const dark = hexToRgb(darkColor);
  const light = hexToRgb(lightColor);

  for (let i = 0; i < data.length; i += 4) {
    // After dithering, pixels are either 0 or 255
    const isLight = data[i] > 127;
    const color = isLight ? light : dark;

    resultData[i] = color.r;
    resultData[i + 1] = color.g;
    resultData[i + 2] = color.b;
    resultData[i + 3] = 255;
  }

  return result;
}

// Tint: Gradient mapping that preserves grayscale levels
export function mapToTint(
  imageData: ImageData,
  darkColor: string,
  lightColor: string
): ImageData {
  const { width, height, data } = imageData;
  const result = new ImageData(width, height);
  const resultData = result.data;

  const dark = hexToRgb(darkColor);
  const light = hexToRgb(lightColor);

  for (let i = 0; i < data.length; i += 4) {
    // Use grayscale value as interpolation factor (0-1)
    const t = data[i] / 255;

    // Linear interpolation between dark and light colors
    resultData[i] = Math.round(dark.r + (light.r - dark.r) * t);
    resultData[i + 1] = Math.round(dark.g + (light.g - dark.g) * t);
    resultData[i + 2] = Math.round(dark.b + (light.b - dark.b) * t);
    resultData[i + 3] = 255;
  }

  return result;
}

// Main color mapping function
export function mapToColors(
  imageData: ImageData,
  darkColor: string,
  lightColor: string,
  mode: ColorMode = 'duotone'
): ImageData {
  if (mode === 'tint') {
    return mapToTint(imageData, darkColor, lightColor);
  }
  return mapToDuotone(imageData, darkColor, lightColor);
}
