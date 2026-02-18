import type { NoiseType } from '../types';

// Apply brightness and contrast adjustments
export function adjustBrightnessContrast(
  imageData: ImageData,
  brightness: number,
  contrast: number
): ImageData {
  const { data } = imageData;

  // Normalize values: brightness -100~100 -> -255~255
  // contrast -100~200 -> factor 0~3 (extended range for overexposure effect)
  const brightnessOffset = (brightness / 100) * 255;
  const contrastFactor = (contrast + 100) / 100;

  for (let i = 0; i < data.length; i += 4) {
    for (let c = 0; c < 3; c++) {
      let value = data[i + c];
      // Apply contrast (centered at 128)
      value = (value - 128) * contrastFactor + 128;
      // Apply brightness
      value += brightnessOffset;
      // Clamp
      data[i + c] = Math.max(0, Math.min(255, Math.round(value)));
    }
  }

  return imageData;
}

// Convert to grayscale using luminance formula
export function toGrayscale(imageData: ImageData): ImageData {
  const { data } = imageData;

  for (let i = 0; i < data.length; i += 4) {
    const gray = Math.round(
      0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
    );
    data[i] = gray;
    data[i + 1] = gray;
    data[i + 2] = gray;
  }

  return imageData;
}

// Add grayscale noise (same noise value for all channels)
export function addGrayscaleNoise(imageData: ImageData, amount: number): ImageData {
  if (amount <= 0) return imageData;

  const { data } = imageData;
  const noiseStrength = (amount / 100) * 50;

  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 2 * noiseStrength;
    for (let c = 0; c < 3; c++) {
      data[i + c] = Math.max(0, Math.min(255, Math.round(data[i + c] + noise)));
    }
  }

  return imageData;
}

// Add RGB noise (independent noise for each channel) - CRT effect
export function addRgbNoise(imageData: ImageData, amount: number): ImageData {
  if (amount <= 0) return imageData;

  const { data } = imageData;
  const noiseStrength = (amount / 100) * 60;

  for (let i = 0; i < data.length; i += 4) {
    // Each channel gets independent random noise
    data[i] = Math.max(0, Math.min(255, Math.round(
      data[i] + (Math.random() - 0.5) * 2 * noiseStrength
    )));
    data[i + 1] = Math.max(0, Math.min(255, Math.round(
      data[i + 1] + (Math.random() - 0.5) * 2 * noiseStrength
    )));
    data[i + 2] = Math.max(0, Math.min(255, Math.round(
      data[i + 2] + (Math.random() - 0.5) * 2 * noiseStrength
    )));
  }

  return imageData;
}

// Main noise function with type selection
export function addNoise(
  imageData: ImageData,
  amount: number,
  type: NoiseType = 'grayscale'
): ImageData {
  if (amount <= 0) return imageData;

  if (type === 'rgb') {
    return addRgbNoise(imageData, amount);
  }
  return addGrayscaleNoise(imageData, amount);
}
