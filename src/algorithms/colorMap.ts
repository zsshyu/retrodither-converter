import { hexToRgb } from '../utils/color';

// Map grayscale to two colors based on dithered black/white
export function mapToColors(
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
