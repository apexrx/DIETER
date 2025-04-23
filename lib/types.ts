// Image adjustment settings
export interface ImageAdjustments {
  brightness: number // 0-200 (100 is normal)
  contrast: number // 0-200 (100 is normal)
  saturation: number // 0-200 (100 is normal)
  grayscale: boolean
  invert: boolean
  blur: number // -10 to 10 (negative for sharpen, positive for blur)
  posterize: number // 0-8 (0 is off, 2-8 is number of levels)
}

// Dithering algorithm options
export interface DitheringOptions {
  algorithm: string
  palette: string
  threshold: number // 0-255
  diffusionStrength: number // 0-2
  ditherScale: number // 0.5-4
  colorQuantization?: string // 'none', 'medianCut', 'kMeans', 'octree', 'neuQuant'
  colorCount?: number // 2-256
}

// Color type
export interface RGB {
  r: number
  g: number
  b: number
}

// Palette type
export interface Palette {
  name: string
  colors: RGB[]
}

// Log entry type
export interface LogEntry {
  timestamp: string
  type: string
  message: string
}

// Batch image type
export interface BatchImage {
  id: string
  image: HTMLImageElement
  adjustments: ImageAdjustments
  ditheringOptions: DitheringOptions
  status: "pending" | "processing" | "completed" | "error"
}
