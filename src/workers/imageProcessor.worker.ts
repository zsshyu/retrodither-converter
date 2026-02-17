import type { DitherParams, WorkerMessage, WorkerResponse } from '../types';
import { pixelate } from '../algorithms/pixelate';
import { adjustBrightnessContrast, toGrayscale, addNoise } from '../algorithms/adjustments';
import { bayerDither } from '../algorithms/dither/bayer';
import { floydSteinbergDither } from '../algorithms/dither/floydSteinberg';
import { atkinsonDither } from '../algorithms/dither/atkinson';
import { jarvisDither } from '../algorithms/dither/jarvis';
import { mapToColors } from '../algorithms/colorMap';

function processImage(imageData: ImageData, params: DitherParams): ImageData {
  let result = imageData;

  // 1. Pixelate
  if (params.pixelSize > 1) {
    result = pixelate(result, params.pixelSize);
  }

  // 2. Adjust brightness/contrast
  if (params.brightness !== 0 || params.contrast !== 0) {
    result = adjustBrightnessContrast(result, params.brightness, params.contrast);
  }

  // 3. Convert to grayscale
  result = toGrayscale(result);

  // 4. For Tint mode: skip dithering, apply color mapping directly with noise
  if (params.colorMode === 'tint') {
    // Apply color mapping first (preserves grayscale levels)
    result = mapToColors(result, params.darkColor, params.lightColor, 'tint');
    // Add noise after color mapping for CRT effect
    if (params.noiseAmount > 0) {
      result = addNoise(result, params.noiseAmount, params.noiseType);
    }
    return result;
  }

  // 5. For Duotone mode: add noise before dithering
  if (params.noiseAmount > 0 && params.noiseType === 'grayscale') {
    result = addNoise(result, params.noiseAmount, 'grayscale');
  }

  // 6. Apply dithering algorithm
  switch (params.algorithm) {
    case 'bayer':
      result = bayerDither(result, params.matrixSize, params.threshold);
      break;
    case 'floyd-steinberg':
      result = floydSteinbergDither(result, params.threshold);
      break;
    case 'atkinson':
      result = atkinsonDither(result, params.threshold);
      break;
    case 'jarvis':
      result = jarvisDither(result, params.threshold);
      break;
  }

  // 7. Map to colors (duotone)
  result = mapToColors(result, params.darkColor, params.lightColor, 'duotone');

  // 8. Add RGB noise after color mapping for duotone mode
  if (params.noiseAmount > 0 && params.noiseType === 'rgb') {
    result = addNoise(result, params.noiseAmount, 'rgb');
  }

  return result;
}

self.onmessage = (e: MessageEvent<WorkerMessage>) => {
  const { type, imageData, params } = e.data;

  if (type === 'process') {
    const result = processImage(imageData, params);
    const response: WorkerResponse = { type: 'result', imageData: result };
    self.postMessage(response);
  }
};
