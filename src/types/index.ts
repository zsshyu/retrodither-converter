export type DitherAlgorithm = 'bayer' | 'none';
export type MatrixSize = 2 | 4 | 8 | 16 | 32;
export type ExportFormat = 'png' | 'jpeg' | 'webp';
export type ExportScale = 1 | 2 | 4;
export type NoiseType = 'grayscale' | 'rgb';

export interface DitherParams {
  pixelSize: number;
  brightness: number;
  contrast: number;
  algorithm: DitherAlgorithm;
  matrixSize: MatrixSize;
  threshold: number;

  // Bloom parameters
  bloomThreshold: number;
  bloomIntensity: number;
  bloomRadius: number;

  // Palette System
  palette: string[]; // Array of hex colors

  // Legacy support (optional)
  darkColor?: string;
  lightColor?: string;

  noiseType: NoiseType;
  noiseAmount: number;
}

export interface Preset {
  name: string;
  palette: string[];
  bloomThreshold?: number;
  bloomIntensity?: number;
  noiseType?: NoiseType;
  noiseAmount?: number;
}

export interface ProcessMessage {
  type: 'process';
  requestId: number;
  imageData: ImageData;
  params: DitherParams;
}

export interface ProcessResult {
  type: 'result';
  requestId: number;
  imageData: ImageData;
}

export interface ProgressMessage {
  type: 'progress';
  requestId: number;
  percent: number;
}

export type WorkerMessage = ProcessMessage;
export type WorkerResponse = ProcessResult | ProgressMessage;

export interface AppState {
  originalImage: HTMLImageElement | null;
  params: DitherParams;
  isProcessing: boolean;
  progress: number;
}
