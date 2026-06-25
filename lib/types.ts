export interface ImageAdjustments {
  brightness: number
  contrast: number
  saturation: number
  grayscale: boolean
  invert: boolean
  blur: number
  posterize: number
}

export interface DitheringOptions {
  algorithm: string
  palette: string
  threshold: number
  diffusionStrength: number
  ditherScale: number
  colorQuantization?: string
  colorCount?: number
  customPalettes?: Record<string, RGB[]>
}

export interface RGB {
  r: number
  g: number
  b: number
}

export interface Palette {
  name: string
  colors: RGB[]
}

export interface LogEntry {
  timestamp: string
  type: string
  message: string
}

export interface BatchImage {
  id: string
  image: HTMLImageElement
  adjustments: ImageAdjustments
  ditheringOptions: DitheringOptions
  status: "pending" | "processing" | "completed" | "error"
}
