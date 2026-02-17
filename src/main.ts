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

// Bloom
const bloomIntensityInput = document.getElementById('bloom-intensity') as HTMLInputElement;
const bloomThresholdInput = document.getElementById('bloom-threshold') as HTMLInputElement;
const bloomRadiusInput = document.getElementById('bloom-radius') as HTMLInputElement;

// Adjustments
const brightnessInput = document.getElementById('brightness') as HTMLInputElement;
const contrastInput = document.getElementById('contrast') as HTMLInputElement;

// Algorithm
const algorithmSelect = document.getElementById('algorithm') as HTMLSelectElement;
const matrixSection = document.getElementById('matrix-section')!;
const thresholdSection = document.getElementById('threshold-section')!;
const matrixSizeSelect = document.getElementById('matrix-size') as HTMLSelectElement;
const thresholdInput = document.getElementById('threshold') as HTMLInputElement;

// Palette
const paletteEditors = document.getElementById('palette-editors')!;
const colorCountSelect = document.getElementById('color-count') as HTMLSelectElement;

// Noise
const noiseTypeSelect = document.getElementById('noise-type') as HTMLSelectElement;
const noiseInput = document.getElementById('noise') as HTMLInputElement;

// Value displays
const pixelSizeValue = document.getElementById('pixel-size-value')!;
const brightnessValue = document.getElementById('brightness-value')!;
const contrastValue = document.getElementById('contrast-value')!;
const thresholdValue = document.getElementById('threshold-value')!;
const noiseValue = document.getElementById('noise-value')!;

// Bloom Values
const bloomIntensityValue = document.getElementById('bloom-intensity-value')!;
const bloomThresholdValue = document.getElementById('bloom-threshold-value')!;
const bloomRadiusValue = document.getElementById('bloom-radius-value')!;


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

  // Structural elements
  document.getElementById('subtitle')!.textContent = t.subtitle;
  document.getElementById('upload-hint')!.textContent = t.uploadHint;
  document.getElementById('upload-support')!.textContent = t.uploadSupport;
  document.getElementById('processing-text')!.textContent = t.processing;

  // Buttons
  document.getElementById('compare-btn')!.textContent = t.compareBtn;
  document.getElementById('new-image-btn')!.textContent = t.newImageBtn;
  document.getElementById('reset-btn')!.textContent = t.reset;
  document.getElementById('download-btn')!.textContent = t.download;
  document.getElementById('confirm-download-btn')!.textContent = t.confirmDownload;

  // Sections (Headings)
  document.getElementById('heading-bloom')!.textContent = t.bloomEffect;
  document.getElementById('heading-adjustments')!.textContent = t.adjustments;
  document.getElementById('heading-dithering')!.textContent = t.dithering;
  document.getElementById('heading-palette')!.textContent = t.palette;
  document.getElementById('heading-noise')!.textContent = t.noise;

  // Labels - Common
  document.getElementById('label-preset')!.textContent = t.preset;
  document.getElementById('label-pixel-size')!.textContent = t.pixelSize;
  document.getElementById('option-custom')!.textContent = t.custom;

  // Labels - Bloom
  document.getElementById('label-bloom-intensity')!.textContent = t.bloomIntensity;
  document.getElementById('label-bloom-threshold')!.textContent = t.bloomThreshold;
  document.getElementById('label-bloom-radius')!.textContent = t.bloomRadius;

  // Labels - Adjustments
  document.getElementById('label-brightness')!.textContent = t.brightness;
  document.getElementById('label-contrast')!.textContent = t.contrast;

  // Labels - Dithering
  document.getElementById('label-algorithm')!.textContent = t.algorithm;
  document.getElementById('option-bayer')!.textContent = t.bayerOrdered;
  document.getElementById('option-none')!.textContent = t.none; // New 'None' option

  document.getElementById('label-matrix')!.textContent = t.matrixSize;
  document.getElementById('label-threshold')!.textContent = t.ditherBias; // Changed from threshold

  // Labels - Noise
  document.getElementById('label-noise-type')!.textContent = t.noiseType;
  document.getElementById('option-grayscale')!.textContent = t.grayscaleNoise;
  document.getElementById('option-rgb')!.textContent = t.rgbNoise;
  document.getElementById('label-noise-amount')!.textContent = t.noiseAmount;

  // Labels - Export
  document.getElementById('label-format')!.textContent = t.format;
  document.getElementById('label-scale')!.textContent = t.scale;
  document.getElementById('option-scale-1')!.textContent = `1x (${t.scaleOriginal})`;

  // Hints
  const hintPalette = document.getElementById('hint-palette');
  if (hintPalette) hintPalette.textContent = `${t.palette} colors are defined by preset.`; // Simplify for now or translate fully

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
        alert('Image too large (max 4096px)');
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

function renderPaletteEditors(colors: string[]) {
  paletteEditors.innerHTML = '';
  colors.forEach((color, i) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'flex-1 flex flex-col items-center';
    wrapper.style.minWidth = '0';

    const input = document.createElement('input');
    input.type = 'color';
    input.value = color;
    input.className = 'w-full h-10 cursor-pointer border-0 bg-transparent p-0';
    input.style.minWidth = '0';

    const label = document.createElement('span');
    label.className = 'text-[10px] text-text-secondary font-mono mt-1';
    label.textContent = color.toUpperCase();

    input.addEventListener('input', () => {
      const params = store.getParams();
      const newPalette = [...params.palette];
      newPalette[i] = input.value;
      store.updateParams({ palette: newPalette });
      presetSelect.value = '';
      label.textContent = input.value.toUpperCase();
      debouncedProcess();
    });

    wrapper.appendChild(input);
    wrapper.appendChild(label);
    paletteEditors.appendChild(wrapper);
  });
}

// Update UI from state
function updateUI(): void {
  const params = store.getParams();

  pixelSizeInput.value = String(params.pixelSize);
  pixelSizeValue.textContent = `${params.pixelSize}px`;

  // Bloom
  bloomIntensityInput.value = String(params.bloomIntensity);
  bloomIntensityValue.textContent = `${params.bloomIntensity}%`;

  bloomThresholdInput.value = String(params.bloomThreshold);
  bloomThresholdValue.textContent = String(params.bloomThreshold);

  bloomRadiusInput.value = String(params.bloomRadius);
  bloomRadiusValue.textContent = `${params.bloomRadius}px`;

  brightnessInput.value = String(params.brightness);
  brightnessValue.textContent = String(params.brightness);

  contrastInput.value = String(params.contrast);
  contrastValue.textContent = String(params.contrast);

  algorithmSelect.value = params.algorithm;
  matrixSizeSelect.value = String(params.matrixSize);

  thresholdInput.value = String(params.threshold);
  thresholdValue.textContent = String(params.threshold);

  // Palette
  colorCountSelect.value = String(params.palette.length);
  renderPaletteEditors(params.palette);

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
      palette: preset.palette,
      bloomThreshold: preset.bloomThreshold,
      bloomIntensity: preset.bloomIntensity,
      noiseType: preset.noiseType || 'grayscale',
      noiseAmount: preset.noiseAmount ?? 0
    });
    updateUI();
    debouncedProcess();
  }
});

// Color count change
colorCountSelect.addEventListener('change', () => {
  const count = parseInt(colorCountSelect.value);
  const params = store.getParams();
  let newPalette = [...params.palette];
  if (count > newPalette.length) {
    // Add colors - interpolate toward white
    while (newPalette.length < count) {
      newPalette.push('#ffffff');
    }
  } else {
    newPalette = newPalette.slice(0, count);
  }
  store.updateParams({ palette: newPalette });
  presetSelect.value = ''; // Switch to Custom
  renderPaletteEditors(newPalette);
  debouncedProcess();
});

// Parameter controls
pixelSizeInput.addEventListener('input', () => {
  store.updateParams({ pixelSize: parseInt(pixelSizeInput.value) });
  pixelSizeValue.textContent = `${pixelSizeInput.value}px`;
  debouncedProcess();
});

// Bloom
bloomIntensityInput.addEventListener('input', () => {
  store.updateParams({ bloomIntensity: parseInt(bloomIntensityInput.value) });
  bloomIntensityValue.textContent = `${bloomIntensityInput.value}%`;
  debouncedProcess();
});

bloomThresholdInput.addEventListener('input', () => {
  store.updateParams({ bloomThreshold: parseInt(bloomThresholdInput.value) });
  bloomThresholdValue.textContent = bloomThresholdInput.value;
  debouncedProcess();
});

bloomRadiusInput.addEventListener('input', () => {
  store.updateParams({ bloomRadius: parseInt(bloomRadiusInput.value) });
  bloomRadiusValue.textContent = `${bloomRadiusInput.value}px`;
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
  const isBayer = algorithmSelect.value === 'bayer';
  matrixSection.style.display = isBayer ? 'block' : 'none';
  thresholdSection.style.display = isBayer ? 'block' : 'none';
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

noiseTypeSelect.addEventListener('change', () => {
  store.updateParams({ noiseType: noiseTypeSelect.value as NoiseType });
  debouncedProcess();
});

noiseInput.addEventListener('input', () => {
  store.updateParams({ noiseAmount: parseInt(noiseInput.value) });
  noiseValue.textContent = `${noiseInput.value}%`;
  debouncedProcess();
});

// Compare button
// Compare button
compareBtn.addEventListener('mousedown', () => {
  originalCanvas.classList.remove('hidden');
});
compareBtn.addEventListener('mouseup', () => {
  originalCanvas.classList.add('hidden');
});
compareBtn.addEventListener('mouseleave', () => {
  originalCanvas.classList.add('hidden');
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

// Initialize language (Simplified)
const currentLang = getLanguage();
applyLanguage(currentLang);

// Language change event
languageSelect.addEventListener('change', () => {
  const lang = languageSelect.value as Language;
  setLanguage(lang);
  applyLanguage(lang);
});
