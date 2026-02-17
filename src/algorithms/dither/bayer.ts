import { getBayerMatrix } from '../../constants/matrices';
import type { MatrixSize } from '../../types';

// Bayer ordered dithering - produces regular pattern
export function bayerDither(
  imageData: ImageData,
  matrixSize: MatrixSize,
  threshold: number
): ImageData {
  const { width, height, data } = imageData;
  const result = new ImageData(width, height);
  const resultData = result.data;

  const matrix = getBayerMatrix(matrixSize);
  const matrixMax = matrixSize * matrixSize;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const gray = data[idx];

      // Get threshold from Bayer matrix
      const matrixValue = matrix[y % matrixSize][x % matrixSize];
      const normalizedThreshold = ((matrixValue + 0.5) / matrixMax) * 255;

      // Apply threshold adjustment
      const adjustedThreshold = normalizedThreshold + (threshold - 128);
      const newValue = gray > adjustedThreshold ? 255 : 0;

      resultData[idx] = newValue;
      resultData[idx + 1] = newValue;
      resultData[idx + 2] = newValue;
      resultData[idx + 3] = 255;
    }
  }

  return result;
}
