// Jarvis-Judice-Ninke dithering - smoothest gradients with 5x3 diffusion matrix
export function jarvisDither(
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
      const error = oldValue - newValue;

      buffer[idx] = newValue;

      // Jarvis 5x3 matrix (divided by 48)
      // Row 0:       X   7   5
      // Row 1:   3   5   7   5   3
      // Row 2:   1   3   5   3   1
      if (x + 1 < width) buffer[idx + 1] += error * 7 / 48;
      if (x + 2 < width) buffer[idx + 2] += error * 5 / 48;

      if (y + 1 < height) {
        if (x > 1) buffer[idx + width - 2] += error * 3 / 48;
        if (x > 0) buffer[idx + width - 1] += error * 5 / 48;
        buffer[idx + width] += error * 7 / 48;
        if (x + 1 < width) buffer[idx + width + 1] += error * 5 / 48;
        if (x + 2 < width) buffer[idx + width + 2] += error * 3 / 48;
      }

      if (y + 2 < height) {
        if (x > 1) buffer[idx + width * 2 - 2] += error * 1 / 48;
        if (x > 0) buffer[idx + width * 2 - 1] += error * 3 / 48;
        buffer[idx + width * 2] += error * 5 / 48;
        if (x + 1 < width) buffer[idx + width * 2 + 1] += error * 3 / 48;
        if (x + 2 < width) buffer[idx + width * 2 + 2] += error * 1 / 48;
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
