import './style.css';
import { store } from './state/store';
import { PRESETS } from './constants/presets';
import { debounce } from './utils/debounce';
import { imageToCanvasScaled, getImageData, putImageData, scaleImageNearestNeighbor } from './utils/canvas';
import type { DitherAlgorithm, MatrixSize, ExportFormat, ExportScale, WorkerResponse, NoiseType } from './types';
import ImageProcessorWorker from './workers/imageProcessor.worker?worker&inline';
import { translations, getLanguage, setLanguage, type Language } from './i18n';

// DOM Elements
const uploadArea = document.getElementById('upload-area')!;
const canvasArea = document.getElementById('canvas-area')!;
const canvasContainer = document.getElementById('canvas-container')!;
const fileInput = document.getElementById('file-input') as HTMLInputElement;
const previewCanvas = document.getElementById('preview-canvas') as HTMLCanvasElement;
const originalCanvas = document.getElementById('original-canvas') as HTMLCanvasElement;
const loadingOverlay = document.getElementById('loading-overlay')!;

// Controls
const presetSelect = document.getElementById('preset-select') as HTMLSelectElement;
const pixelSizeInput = document.getElementById('pixel-size') as HTMLInputElement;
const brightnessInput = document.getElementById('brightness') as HTMLInputElement;
const contrastInput = document.getElementById('contrast') as HTMLInputElement;
const algorithmSelect = document.getElementById('algorithm') as HTMLSelectElement;
const matrixSection = document.getElementById('matrix-section')!;
const matrixSizeSelect = document.getElementById('matrix-size') as HTMLSelectElement;
const thresholdInput = document.getElementById('threshold') as HTMLInputElement;
const darkColorInput = document.getElementById('dark-color') as HTMLInputElement;
const lightColorInput = document.getElementById('light-color') as HTMLInputElement;
const noiseTypeSelect = document.getElementById('noise-type') as HTMLSelectElement;
const noiseInput = document.getElementById('noise') as HTMLInputElement;

// Value displays
const pixelSizeValue = document.getElementById('pixel-size-value')!;
const brightnessValue = document.getElementById('brightness-value')!;
const contrastValue = document.getElementById('contrast-value')!;
const thresholdValue = document.getElementById('threshold-value')!;
const noiseValue = document.getElementById('noise-value')!;

// Buttons
const compareBtn = document.getElementById('compare-btn')!;
const newImageBtn = document.getElementById('new-image-btn')!;
const resetBtn = document.getElementById('reset-btn')!;
const downloadBtn = document.getElementById('download-btn')!;
const exportOptions = document.getElementById('export-options')!;
const exportFormatSelect = document.getElementById('export-format') as HTMLSelectElement;
const exportScaleSelect = document.getElementById('export-scale') as HTMLSelectElement;
const confirmDownloadBtn = document.getElementById('confirm-download-btn')!;

// Language
const languageSelect = document.getElementById('language-select') as HTMLSelectElement;

// Worker
let worker: Worker | null = null;

// Apply language translations
function applyLanguage(lang: Language): void {
  const t = translations[lang];

  // Update text content
  document.getElementById('subtitle')!.textContent = t.subtitle;
  document.getElementById('upload-hint')!.textContent = t.uploadHint;
  document.getElementById('upload-support')!.textContent = t.uploadSupport;
  document.getElementById('processing-text')!.textContent = t.processing;
  document.getElementById('compare-btn')!.textContent = t.compareBtn;
  document.getElementById('new-image-btn')!.textContent = t.newImageBtn;
  document.getElementById('label-preset')!.textContent = t.preset;
  document.getElementById('option-custom')!.textContent = t.custom;
  document.getElementById('label-pixel-size')!.textContent = t.pixelSize;
  document.getElementById('label-brightness')!.textContent = t.brightness;
  document.getElementById('label-contrast')!.textContent = t.contrast;
  document.getElementById('label-algorithm')!.textContent = t.algorithm;
  document.getElementById('option-bayer')!.textContent = t.bayerOrdered;
  document.getElementById('option-floyd')!.textContent = t.floydSteinberg;
  document.getElementById('option-atkinson')!.textContent = t.atkinsonHigh;
  document.getElementById('option-jarvis')!.textContent = t.jarvisSmooth;
  document.getElementById('label-matrix')!.textContent = t.matrixSize;
  document.getElementById('label-threshold')!.textContent = t.threshold;
  document.getElementById('label-colors')!.textContent = t.colors;
  document.getElementById('label-dark')!.textContent = t.darkColor;
  document.getElementById('label-light')!.textContent = t.lightColor;
  document.getElementById('label-noise-type')!.textContent = t.noiseType;
  document.getElementById('option-grayscale')!.textContent = t.grayscaleNoise;
  document.getElementById('option-rgb')!.textContent = t.rgbNoise;
  document.getElementById('label-noise-amount')!.textContent = t.noiseAmount;
  document.getElementById('reset-btn')!.textContent = t.reset;
  document.getElementById('download-btn')!.textContent = t.download;
  document.getElementById('label-format')!.textContent = t.format;
  document.getElementById('label-scale')!.textContent = t.scale;
  document.getElementById('option-scale-1')!.textContent = `1x (${t.scaleOriginal})`;
  document.getElementById('confirm-download-btn')!.textContent = t.confirmDownload;

  // Update language selector
  languageSelect.value = lang;
}

// Initialize presets
PRESETS.forEach((preset, index) => {
  const option = document.createElement('option');
  option.value = String(index);
  option.textContent = preset.name;
  presetSelect.appendChild(option);
});

// Load image
function loadImage(file: File): void {
  if (!file.type.startsWith('image/')) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      // Check size limit
      if (img.naturalWidth > 4096 || img.naturalHeight > 4096) {
        alert(translations[getLanguage()].imageSizeError);
        return;
      }

      store.setImage(img);
      uploadArea.classList.add('hidden');
      canvasArea.classList.remove('hidden');

      // Wait for layout to calculate container size
      requestAnimationFrame(() => {
        processImage();
      });
    };
    img.src = e.target?.result as string;
  };
  reader.readAsDataURL(file);
}

// Process image with worker
function processImage(): void {
  const state = store.getState();
  if (!state.originalImage) return;

  store.setProcessing(true);
  loadingOverlay.classList.remove('hidden');

  // Get container size for WYSIWYG
  const containerRect = canvasContainer.getBoundingClientRect();
  const maxWidth = containerRect.width - 20; // padding
  const maxHeight = containerRect.height - 20;

  // Scale image to fit container (WYSIWYG)
  const scaledCanvas = imageToCanvasScaled(state.originalImage, maxWidth, maxHeight);
  const imageData = getImageData(scaledCanvas);

  // Set canvas size to scaled size
  previewCanvas.width = scaledCanvas.width;
  previewCanvas.height = scaledCanvas.height;
  originalCanvas.width = scaledCanvas.width;
  originalCanvas.height = scaledCanvas.height;
  originalCanvas.getContext('2d')!.drawImage(scaledCanvas, 0, 0);

  // Create worker if needed
  if (!worker) {
    worker = new ImageProcessorWorker();
    worker.onmessage = (e: MessageEvent<WorkerResponse>) => {
      if (e.data.type === 'result') {
        putImageData(previewCanvas, e.data.imageData);
        store.setProcessing(false);
        loadingOverlay.classList.add('hidden');
      }
    };
  }

  // Send to worker
  worker.postMessage({
    type: 'process',
    imageData,
    params: state.params
  });
}

const debouncedProcess = debounce(processImage, 100);

// Update visibility of matrix section based on algorithm
function updateMatrixVisibility(): void {
  const params = store.getParams();
  matrixSection.style.display = params.algorithm === 'bayer' ? 'block' : 'none';
}

// Update UI from state
function updateUI(): void {
  const params = store.getParams();

  pixelSizeInput.value = String(params.pixelSize);
  pixelSizeValue.textContent = `${params.pixelSize}px`;

  brightnessInput.value = String(params.brightness);
  brightnessValue.textContent = String(params.brightness);

  contrastInput.value = String(params.contrast);
  contrastValue.textContent = String(params.contrast);

  algorithmSelect.value = params.algorithm;
  matrixSizeSelect.value = String(params.matrixSize);

  thresholdInput.value = String(params.threshold);
  thresholdValue.textContent = String(params.threshold);

  darkColorInput.value = params.darkColor;
  lightColorInput.value = params.lightColor;

  noiseTypeSelect.value = params.noiseType;
  noiseInput.value = String(params.noiseAmount);
  noiseValue.textContent = `${params.noiseAmount}%`;

  updateMatrixVisibility();
}

// Event Listeners

// File upload
uploadArea.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', () => {
  if (fileInput.files?.[0]) loadImage(fileInput.files[0]);
});

// Drag and drop
uploadArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadArea.classList.add('border-accent');
});
uploadArea.addEventListener('dragleave', () => {
  uploadArea.classList.remove('border-accent');
});
uploadArea.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadArea.classList.remove('border-accent');
  if (e.dataTransfer?.files?.[0]) loadImage(e.dataTransfer.files[0]);
});

// Preset selection
presetSelect.addEventListener('change', () => {
  const index = parseInt(presetSelect.value);
  if (!isNaN(index) && PRESETS[index]) {
    const preset = PRESETS[index];
    store.updateParams({
      darkColor: preset.darkColor,
      lightColor: preset.lightColor,
      noiseType: preset.noiseType || 'grayscale',
      noiseAmount: preset.noiseAmount ?? 0
    });
    updateUI();
    debouncedProcess();
  }
});

// Parameter controls
pixelSizeInput.addEventListener('input', () => {
  store.updateParams({ pixelSize: parseInt(pixelSizeInput.value) });
  pixelSizeValue.textContent = `${pixelSizeInput.value}px`;
  debouncedProcess();
});

brightnessInput.addEventListener('input', () => {
  store.updateParams({ brightness: parseInt(brightnessInput.value) });
  brightnessValue.textContent = brightnessInput.value;
  debouncedProcess();
});

contrastInput.addEventListener('input', () => {
  store.updateParams({ contrast: parseInt(contrastInput.value) });
  contrastValue.textContent = contrastInput.value;
  debouncedProcess();
});

algorithmSelect.addEventListener('change', () => {
  store.updateParams({ algorithm: algorithmSelect.value as DitherAlgorithm });
  matrixSection.style.display = algorithmSelect.value === 'bayer' ? 'block' : 'none';
  debouncedProcess();
});

matrixSizeSelect.addEventListener('change', () => {
  store.updateParams({ matrixSize: parseInt(matrixSizeSelect.value) as MatrixSize });
  debouncedProcess();
});

thresholdInput.addEventListener('input', () => {
  store.updateParams({ threshold: parseInt(thresholdInput.value) });
  thresholdValue.textContent = thresholdInput.value;
  debouncedProcess();
});

darkColorInput.addEventListener('input', () => {
  store.updateParams({ darkColor: darkColorInput.value });
  presetSelect.value = '';
  debouncedProcess();
});

lightColorInput.addEventListener('input', () => {
  store.updateParams({ lightColor: lightColorInput.value });
  presetSelect.value = '';
  debouncedProcess();
});

noiseTypeSelect.addEventListener('change', () => {
  store.updateParams({ noiseType: noiseTypeSelect.value as NoiseType });
  presetSelect.value = '';
  debouncedProcess();
});

noiseInput.addEventListener('input', () => {
  store.updateParams({ noiseAmount: parseInt(noiseInput.value) });
  noiseValue.textContent = `${noiseInput.value}%`;
  debouncedProcess();
});

// Compare button
compareBtn.addEventListener('mousedown', () => {
  previewCanvas.classList.add('hidden');
  originalCanvas.classList.remove('hidden');
});
compareBtn.addEventListener('mouseup', () => {
  originalCanvas.classList.add('hidden');
  previewCanvas.classList.remove('hidden');
});
compareBtn.addEventListener('mouseleave', () => {
  originalCanvas.classList.add('hidden');
  previewCanvas.classList.remove('hidden');
});

// New image button
newImageBtn.addEventListener('click', () => fileInput.click());

// Reset button
resetBtn.addEventListener('click', () => {
  store.resetParams();
  presetSelect.value = '';
  updateUI();
  debouncedProcess();
});

// Download button
downloadBtn.addEventListener('click', () => {
  exportOptions.classList.toggle('hidden');
});

// Confirm download
confirmDownloadBtn.addEventListener('click', () => {
  const format = exportFormatSelect.value as ExportFormat;
  const scale = parseInt(exportScaleSelect.value) as ExportScale;

  let exportCanvas: HTMLCanvasElement = previewCanvas;

  // Scale if needed
  if (scale > 1) {
    exportCanvas = scaleImageNearestNeighbor(previewCanvas, scale);
  }

  // Get mime type
  const mimeTypes: Record<ExportFormat, string> = {
    png: 'image/png',
    jpeg: 'image/jpeg',
    webp: 'image/webp'
  };

  // Download
  exportCanvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `retrodither-${Date.now()}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  }, mimeTypes[format], format === 'jpeg' ? 0.95 : undefined);

  exportOptions.classList.add('hidden');
});

// Initialize UI
updateUI();

// Initialize language
const currentLang = getLanguage();
applyLanguage(currentLang);

// Language change event
languageSelect.addEventListener('change', () => {
  const lang = languageSelect.value as Language;
  setLanguage(lang);
  applyLanguage(lang);
});
