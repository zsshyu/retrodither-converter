import { getBayerMatrix } from '../../constants/matrices';
import type { MatrixSize } from '../../types';

// Bayer ordered dithering - produces regular pattern
export function bayerDither(
  imageData: ImageData,
  matrixSize: MatrixSize,
  threshold: number // threshold is now used as a bias (0-255), defaults to 128
): ImageData {
  const { width, height, data } = imageData;
  const result = new ImageData(width, height);
  const resultData = result.data;

  const matrix = getBayerMatrix(matrixSize);
  const matrixMax = matrixSize * matrixSize;

  // Number of color levels (4 levels = 3 intervals: 0, 85, 170, 255)
  // This matches a 2-bit grayscale depth
  const levels = 4;
  const divisor = 255 / (levels - 1);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const gray = data[idx];

      // Get threshold from Bayer matrix (-0.5 to 0.5 range)
      const matrixValue = matrix[y % matrixSize][x % matrixSize];
      const ditherValue = ((matrixValue + 0.5) / matrixMax) - 0.5;

      // Scale dither strength (arbitrary scaling factor to make it visible but not overwhelming)
      // 32 is roughly 1/8th of 255, covering the gap between levels
      const ditherStrength = 32;

      // Add dither noise to the original pixel
      // We add (threshold - 128) as a global brightness bias
      let ditheredVal = gray + (ditherValue * ditherStrength) + (threshold - 128);

      // Quantize
      // 1. Normalize to 0-1 (conceptually) by dividing by divisor
      // 2. Round to nearest integer (level)
      // 3. Scale back up

      let quantizedVal = Math.round(ditheredVal / divisor) * divisor;

      // Clamping
      quantizedVal = Math.max(0, Math.min(255, quantizedVal));

      resultData[idx] = quantizedVal;
      resultData[idx + 1] = quantizedVal;
      resultData[idx + 2] = quantizedVal;
      resultData[idx + 3] = 255;
    }
  }

  return result;
}
