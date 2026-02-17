// Simple box blur for bloom effect
export function boxBlur(imageData: ImageData, radius: number): ImageData {
  const { width, height, data } = imageData;
  const result = new ImageData(width, height);
  const resultData = result.data;
  const sourceData = data;

  // Copy alpha channel and RGB initially
  resultData.set(sourceData);

  if (radius < 1) return result;

  // Horizontal pass
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0, g = 0, b = 0;
      let count = 0;

      for (let k = -radius; k <= radius; k++) {
        const px = Math.min(width - 1, Math.max(0, x + k));
        const idx = (y * width + px) * 4;
        r += sourceData[idx];
        g += sourceData[idx + 1];
        b += sourceData[idx + 2];
        count++;
      }

      const idx = (y * width + x) * 4;
      resultData[idx] = r / count;
      resultData[idx + 1] = g / count;
      resultData[idx + 2] = b / count;
    }
  }

  // Vertical pass (using the result of horizontal pass)
  const tempData = new Uint8ClampedArray(resultData);
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let r = 0, g = 0, b = 0;
      let count = 0;

      for (let k = -radius; k <= radius; k++) {
        const py = Math.min(height - 1, Math.max(0, y + k));
        const idx = (py * width + x) * 4;
        r += tempData[idx];
        g += tempData[idx + 1];
        b += tempData[idx + 2];
        count++;
      }

      const idx = (y * width + x) * 4;
      resultData[idx] = r / count;
      resultData[idx + 1] = g / count;
      resultData[idx + 2] = b / count;
    }
  }

  return result;
}
