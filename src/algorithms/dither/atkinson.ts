// Atkinson dithering - only diffuses 75% of error for higher contrast
// Popular on early Macintosh computers
export function atkinsonDither(
  imageData: ImageData,
  threshold: number
): ImageData {
  const { width, height } = imageData;
  const result = new ImageData(width, height);

  const buffer = new Float32Array(width * height);
  for (let i = 0; i < buffer.length; i++) {
    buffer[i] = imageData.data[i * 4];
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const oldValue = buffer[idx];
      const newValue = oldValue > threshold ? 255 : 0;
      // Only 6/8 = 75% of error is diffused
      const error = (oldValue - newValue) / 8;

      buffer[idx] = newValue;

      // Atkinson pattern: 1/8 to each of 6 neighbors
      if (x + 1 < width) buffer[idx + 1] += error;
      if (x + 2 < width) buffer[idx + 2] += error;
      if (y + 1 < height) {
        if (x > 0) buffer[idx + width - 1] += error;
        buffer[idx + width] += error;
        if (x + 1 < width) buffer[idx + width + 1] += error;
      }
      if (y + 2 < height) {
        buffer[idx + width * 2] += error;
      }
    }
  }

  const resultData = result.data;
  for (let i = 0; i < buffer.length; i++) {
    const v = Math.max(0, Math.min(255, Math.round(buffer[i])));
    resultData[i * 4] = v;
    resultData[i * 4 + 1] = v;
    resultData[i * 4 + 2] = v;
    resultData[i * 4 + 3] = 255;
  }

  return result;
}
