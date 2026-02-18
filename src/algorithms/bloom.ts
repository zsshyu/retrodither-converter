import { boxBlur } from '../utils/blur';
import { getLuminance } from '../utils/color';

export function applyBloom(
    imageData: ImageData,
    threshold: number,
    intensity: number,
    radius: number = 2
): ImageData {
    const { width, height, data } = imageData;

    // 1. Extract highlights
    const highlights = new ImageData(width, height);
    const highlightsData = highlights.data;

    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        // Calculate luminance
        const lum = getLuminance(r, g, b);

        // Check threshold
        if (a !== 0 && lum >= threshold) {
            highlightsData[i] = r;
            highlightsData[i + 1] = g;
            highlightsData[i + 2] = b;
            highlightsData[i + 3] = a;
        } else {
            highlightsData[i] = 0;
            highlightsData[i + 1] = 0;
            highlightsData[i + 2] = 0;
            highlightsData[i + 3] = 0; // Transparent
        }
    }

    // 2. Blur highlights
    const blurredHighlights = boxBlur(highlights, radius);
    const blurredData = blurredHighlights.data;

    // 3. Composite (Additive)
    const result = new ImageData(width, height);
    const resultData = result.data;

    for (let i = 0; i < data.length; i += 4) {
        // Add original + blurred highlight * intensity
        resultData[i] = Math.min(255, data[i] + blurredData[i] * intensity);
        resultData[i + 1] = Math.min(255, data[i + 1] + blurredData[i + 1] * intensity);
        resultData[i + 2] = Math.min(255, data[i + 2] + blurredData[i + 2] * intensity);
        resultData[i + 3] = data[i + 3];
    }

    return result;
}
