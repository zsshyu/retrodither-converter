export type Language = 'zh' | 'en' | 'fr';

export interface Translations {
  subtitle: string;
  uploadHint: string;
  uploadSupport: string;
  processing: string;
  compareBtn: string;
  newImageBtn: string;
  preset: string;
  custom: string;
  pixelSize: string;
  brightness: string;
  contrast: string;
  colorMode: string;
  duotone: string;
  tint: string;
  algorithm: string;
  bayerOrdered: string;
  floydSteinberg: string;
  atkinsonHigh: string;
  jarvisSmooth: string;
  matrixSize: string;
  threshold: string;
  colors: string;
  darkColor: string;
  lightColor: string;
  noiseType: string;
  grayscaleNoise: string;
  rgbNoise: string;
  noiseAmount: string;
  reset: string;
  download: string;
  format: string;
  scale: string;
  scaleOriginal: string;
  confirmDownload: string;
  imageSizeError: string;
}

export const translations: Record<Language, Translations> = {
  zh: {
    subtitle: '复古抖动风格生成器',
    uploadHint: '拖拽图片到此处或点击上传',
    uploadSupport: '支持 JPG, PNG, WebP (最大 4096x4096)',
    processing: '处理中...',
    compareBtn: '按住对比原图',
    newImageBtn: '上传新图片',
    preset: '预设风格',
    custom: '自定义',
    pixelSize: '像素大小',
    brightness: '亮度',
    contrast: '对比度',
    colorMode: '颜色模式',
    duotone: 'Duotone (双色抖动)',
    tint: 'Tint (渐变色调)',
    algorithm: '抖动算法',
    bayerOrdered: 'Bayer (有序抖动)',
    floydSteinberg: 'Floyd-Steinberg (误差扩散)',
    atkinsonHigh: 'Atkinson (高对比度)',
    jarvisSmooth: 'Jarvis (平滑过渡)',
    matrixSize: '矩阵尺寸',
    threshold: '阈值',
    colors: '颜色',
    darkColor: '暗部',
    lightColor: '亮部',
    noiseType: '噪点类型',
    grayscaleNoise: '灰度噪点',
    rgbNoise: 'RGB 彩色噪点 (CRT效果)',
    noiseAmount: '噪点强度',
    reset: '重置参数',
    download: '下载图片',
    format: '格式',
    scale: '缩放',
    scaleOriginal: '原始',
    confirmDownload: '确认下载',
    imageSizeError: '图片尺寸超过限制 (最大 4096x4096)'
  },
  en: {
    subtitle: 'Retro Dither Style Generator',
    uploadHint: 'Drag & drop image here or click to upload',
    uploadSupport: 'Supports JPG, PNG, WebP (max 4096x4096)',
    processing: 'Processing...',
    compareBtn: 'Hold to compare',
    newImageBtn: 'Upload new',
    preset: 'Presets',
    custom: 'Custom',
    pixelSize: 'Pixel Size',
    brightness: 'Brightness',
    contrast: 'Contrast',
    colorMode: 'Color Mode',
    duotone: 'Duotone',
    tint: 'Tint (Gradient)',
    algorithm: 'Dither Algorithm',
    bayerOrdered: 'Bayer (Ordered)',
    floydSteinberg: 'Floyd-Steinberg (Error Diffusion)',
    atkinsonHigh: 'Atkinson (High Contrast)',
    jarvisSmooth: 'Jarvis (Smooth)',
    matrixSize: 'Matrix Size',
    threshold: 'Threshold',
    colors: 'Colors',
    darkColor: 'Dark',
    lightColor: 'Light',
    noiseType: 'Noise Type',
    grayscaleNoise: 'Grayscale',
    rgbNoise: 'RGB Color (CRT Effect)',
    noiseAmount: 'Noise Amount',
    reset: 'Reset',
    download: 'Download',
    format: 'Format',
    scale: 'Scale',
    scaleOriginal: 'Original',
    confirmDownload: 'Confirm Download',
    imageSizeError: 'Image size exceeds limit (max 4096x4096)'
  },
  fr: {
    subtitle: 'Générateur de Style Rétro Dither',
    uploadHint: 'Glissez-déposez une image ou cliquez pour télécharger',
    uploadSupport: 'Supporte JPG, PNG, WebP (max 4096x4096)',
    processing: 'Traitement...',
    compareBtn: 'Maintenir pour comparer',
    newImageBtn: 'Nouvelle image',
    preset: 'Préréglages',
    custom: 'Personnalisé',
    pixelSize: 'Taille des pixels',
    brightness: 'Luminosité',
    contrast: 'Contraste',
    colorMode: 'Mode couleur',
    duotone: 'Duotone',
    tint: 'Teinte (Dégradé)',
    algorithm: 'Algorithme de tramage',
    bayerOrdered: 'Bayer (Ordonné)',
    floydSteinberg: 'Floyd-Steinberg (Diffusion d\'erreur)',
    atkinsonHigh: 'Atkinson (Contraste élevé)',
    jarvisSmooth: 'Jarvis (Lisse)',
    matrixSize: 'Taille de matrice',
    threshold: 'Seuil',
    colors: 'Couleurs',
    darkColor: 'Sombre',
    lightColor: 'Clair',
    noiseType: 'Type de bruit',
    grayscaleNoise: 'Niveaux de gris',
    rgbNoise: 'RGB Couleur (Effet CRT)',
    noiseAmount: 'Intensité du bruit',
    reset: 'Réinitialiser',
    download: 'Télécharger',
    format: 'Format',
    scale: 'Échelle',
    scaleOriginal: 'Original',
    confirmDownload: 'Confirmer',
    imageSizeError: 'La taille de l\'image dépasse la limite (max 4096x4096)'
  }
};

export function getLanguage(): Language {
  const saved = localStorage.getItem('language') as Language;
  if (saved && translations[saved]) return saved;

  const browserLang = navigator.language.slice(0, 2);
  if (browserLang === 'zh') return 'zh';
  if (browserLang === 'fr') return 'fr';
  return 'en';
}

export function setLanguage(lang: Language): void {
  localStorage.setItem('language', lang);
}
