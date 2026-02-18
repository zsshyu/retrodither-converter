// Simple box blur for bloom effect
export function boxBlur(imageData: ImageData, radius: number): ImageData {
  const { width, height, data } = imageData;
  const sourceData = data;

  const result = new ImageData(width, height);
  const resultData = result.data;

  if (radius < 1) {
    resultData.set(sourceData);
    return result;
  }

  const windowSize = radius * 2 + 1;

  const temp = new Uint8ClampedArray(sourceData.length);

  // Horizontal pass (sliding window, edge-clamped)
  for (let y = 0; y < height; y++) {
    const rowOffset = y * width;

    let sumR = 0;
    let sumG = 0;
    let sumB = 0;

    for (let k = -radius; k <= radius; k++) {
      const px = Math.min(width - 1, Math.max(0, k));
      const idx = (rowOffset + px) * 4;
      sumR += sourceData[idx];
      sumG += sourceData[idx + 1];
      sumB += sourceData[idx + 2];
    }

    for (let x = 0; x < width; x++) {
      const idx = (rowOffset + x) * 4;
      temp[idx] = Math.round(sumR / windowSize);
      temp[idx + 1] = Math.round(sumG / windowSize);
      temp[idx + 2] = Math.round(sumB / windowSize);
      temp[idx + 3] = sourceData[idx + 3];

      const outX = Math.min(width - 1, Math.max(0, x - radius));
      const inX = Math.min(width - 1, Math.max(0, x + radius + 1));
      const idxOut = (rowOffset + outX) * 4;
      const idxIn = (rowOffset + inX) * 4;

      sumR += sourceData[idxIn] - sourceData[idxOut];
      sumG += sourceData[idxIn + 1] - sourceData[idxOut + 1];
      sumB += sourceData[idxIn + 2] - sourceData[idxOut + 2];
    }
  }

  // Vertical pass (sliding window, edge-clamped)
  for (let x = 0; x < width; x++) {
    let sumR = 0;
    let sumG = 0;
    let sumB = 0;

    for (let k = -radius; k <= radius; k++) {
      const py = Math.min(height - 1, Math.max(0, k));
      const idx = (py * width + x) * 4;
      sumR += temp[idx];
      sumG += temp[idx + 1];
      sumB += temp[idx + 2];
    }

    for (let y = 0; y < height; y++) {
      const idx = (y * width + x) * 4;
      resultData[idx] = Math.round(sumR / windowSize);
      resultData[idx + 1] = Math.round(sumG / windowSize);
      resultData[idx + 2] = Math.round(sumB / windowSize);
      resultData[idx + 3] = sourceData[idx + 3];

      const outY = Math.min(height - 1, Math.max(0, y - radius));
      const inY = Math.min(height - 1, Math.max(0, y + radius + 1));
      const idxOut = (outY * width + x) * 4;
      const idxIn = (inY * width + x) * 4;

      sumR += temp[idxIn] - temp[idxOut];
      sumG += temp[idxIn + 1] - temp[idxOut + 1];
      sumB += temp[idxIn + 2] - temp[idxOut + 2];
    }
  }

  return result;
}
