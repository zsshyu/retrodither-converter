import type { DitherParams, WorkerMessage, WorkerResponse } from '../types';
import { pixelate } from '../algorithms/pixelate';
import { adjustBrightnessContrast, toGrayscale, addNoise } from '../algorithms/adjustments';
import { bayerDither } from '../algorithms/dither/bayer';
import { mapToPalette } from '../algorithms/colorMap';
import { applyBloom } from '../algorithms/bloom';

function processImage(imageData: ImageData, params: DitherParams): ImageData {
  let result = imageData;

  // 1. Pixelate (Downsampling)
  if (params.pixelSize > 1) {
    result = pixelate(result, params.pixelSize);
  }

  // 2. Apply Bloom (New Step)
  // Only apply if intensity > 0
  if (params.bloomIntensity > 0) {
    // Threshold is 0-255 in params, algorithm expects 0-255
    // Intensity is 0-100 in params, algorithm expects factor (e.g. 0.5)
    // Radius is fixed or param
    result = applyBloom(
      result,
      params.bloomThreshold,
      params.bloomIntensity / 100,
      params.bloomRadius || 4
    );
  }

  // 3. Adjust brightness/contrast
  if (params.brightness !== 0 || params.contrast !== 0) {
    result = adjustBrightnessContrast(result, params.brightness, params.contrast);
  }

  // 4. Convert to grayscale
  result = toGrayscale(result);

  // 5. Add grayscale noise before dithering
  if (params.noiseAmount > 0 && params.noiseType === 'grayscale') {
    result = addNoise(result, params.noiseAmount, 'grayscale');
  }

  // 6. Apply dithering algorithm
  // Note: Bayer now returns multi-level grayscale if configured, 
  // others might still range 0-255 but binary.
  switch (params.algorithm) {
    case 'bayer':
      result = bayerDither(result, params.matrixSize, params.threshold);
      break;
    case 'none':
      // Do nothing, keep grayscale
      break;
  }

  // 7. Map to Palette (New Step)
  // If palette is provided, use it. Fallback to BW if empty.
  const palette = (params.palette && params.palette.length > 0)
    ? params.palette
    : ['#000000', '#ffffff'];

  result = mapToPalette(result, palette);

  // 8. Add RGB noise after color mapping
  if (params.noiseAmount > 0 && params.noiseType === 'rgb') {
    result = addNoise(result, params.noiseAmount, 'rgb');
  }

  return result;
}

self.onmessage = (e: MessageEvent<WorkerMessage>) => {
  const { type, requestId, imageData, params } = e.data;

  if (type === 'process') {
    const result = processImage(imageData, params);
    const response: WorkerResponse = { type: 'result', requestId, imageData: result };
    self.postMessage(response);
  }
};
