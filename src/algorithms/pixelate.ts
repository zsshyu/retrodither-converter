// Pixelate image by averaging blocks of pixels
export function pixelate(
  imageData: ImageData,
  pixelSize: number
): ImageData {
  if (pixelSize <= 1) return imageData;

  const { width, height, data } = imageData;
  const result = new ImageData(width, height);
  const resultData = result.data;

  for (let y = 0; y < height; y += pixelSize) {
    for (let x = 0; x < width; x += pixelSize) {
      let r = 0, g = 0, b = 0, count = 0;

      // Average colors in the block
      for (let dy = 0; dy < pixelSize && y + dy < height; dy++) {
        for (let dx = 0; dx < pixelSize && x + dx < width; dx++) {
          const idx = ((y + dy) * width + (x + dx)) * 4;
          r += data[idx];
          g += data[idx + 1];
          b += data[idx + 2];
          count++;
        }
      }

      r = Math.round(r / count);
      g = Math.round(g / count);
      b = Math.round(b / count);

      // Fill the block with averaged color
      for (let dy = 0; dy < pixelSize && y + dy < height; dy++) {
        for (let dx = 0; dx < pixelSize && x + dx < width; dx++) {
          const idx = ((y + dy) * width + (x + dx)) * 4;
          resultData[idx] = r;
          resultData[idx + 1] = g;
          resultData[idx + 2] = b;
          resultData[idx + 3] = 255;
        }
      }
    }
  }

  return result;
}
