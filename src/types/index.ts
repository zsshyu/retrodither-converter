export type DitherAlgorithm = 'bayer' | 'floyd-steinberg' | 'atkinson' | 'jarvis';
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
  darkColor: string;
  lightColor: string;
  noiseType: NoiseType;
  noiseAmount: number;
}

export interface Preset {
  name: string;
  darkColor: string;
  lightColor: string;
  noiseType?: NoiseType;
  noiseAmount?: number;
}

export interface ProcessMessage {
  type: 'process';
  imageData: ImageData;
  params: DitherParams;
}

export interface ProcessResult {
  type: 'result';
  imageData: ImageData;
}

export interface ProgressMessage {
  type: 'progress';
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
