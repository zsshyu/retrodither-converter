// Floyd-Steinberg error diffusion dithering
// Distributes quantization error to neighboring pixels
export function floydSteinbergDither(
  imageData: ImageData,
  threshold: number
): ImageData {
  const { width, height } = imageData;
  const result = new ImageData(width, height);

  // Work with float array for error diffusion
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

      // Distribute error: right 7/16, bottom-left 3/16, bottom 5/16, bottom-right 1/16
      if (x + 1 < width) buffer[idx + 1] += error * 7 / 16;
      if (y + 1 < height) {
        if (x > 0) buffer[idx + width - 1] += error * 3 / 16;
        buffer[idx + width] += error * 5 / 16;
        if (x + 1 < width) buffer[idx + width + 1] += error * 1 / 16;
      }
    }
  }

  // Copy to result
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
