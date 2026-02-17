export function createCanvas(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

export function imageToCanvas(img: HTMLImageElement): HTMLCanvasElement {
  const canvas = createCanvas(img.naturalWidth, img.naturalHeight);
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0);
  return canvas;
}

export function getImageData(canvas: HTMLCanvasElement): ImageData {
  const ctx = canvas.getContext('2d')!;
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

export function putImageData(canvas: HTMLCanvasElement, imageData: ImageData): void {
  const ctx = canvas.getContext('2d')!;
  ctx.putImageData(imageData, 0, 0);
}

export function scaleImageNearestNeighbor(
  sourceCanvas: HTMLCanvasElement,
  scale: number
): HTMLCanvasElement {
  const targetCanvas = createCanvas(
    sourceCanvas.width * scale,
    sourceCanvas.height * scale
  );
  const ctx = targetCanvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(
    sourceCanvas,
    0, 0,
    sourceCanvas.width, sourceCanvas.height,
    0, 0,
    targetCanvas.width, targetCanvas.height
  );
  return targetCanvas;
}
