import type { AppState, DitherParams } from '../types';

type Listener = () => void;

const DEFAULT_PARAMS: DitherParams = {
  pixelSize: 4,
  brightness: 0,
  contrast: 20,
  algorithm: 'bayer',
  matrixSize: 4,
  threshold: 128,
  darkColor: '#000000',
  lightColor: '#ffffff',
  noiseType: 'grayscale',
  noiseAmount: 0
};

class Store {
  private state: AppState = {
    originalImage: null,
    params: { ...DEFAULT_PARAMS },
    isProcessing: false,
    progress: 0
  };

  private listeners: Set<Listener> = new Set();

  getState(): AppState {
    return this.state;
  }

  getParams(): DitherParams {
    return this.state.params;
  }

  setImage(image: HTMLImageElement | null): void {
    this.state = { ...this.state, originalImage: image };
    this.notify();
  }

  updateParams(partial: Partial<DitherParams>): void {
    this.state = {
      ...this.state,
      params: { ...this.state.params, ...partial }
    };
    this.notify();
  }

  setProcessing(isProcessing: boolean): void {
    this.state = { ...this.state, isProcessing };
    this.notify();
  }

  setProgress(progress: number): void {
    this.state = { ...this.state, progress };
    this.notify();
  }

  resetParams(): void {
    this.state = { ...this.state, params: { ...DEFAULT_PARAMS } };
    this.notify();
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach(listener => listener());
  }
}

export const store = new Store();
