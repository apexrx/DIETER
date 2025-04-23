import type { ImageAdjustments } from "./types"

// Apply all image adjustments to the image data
export function applyAdjustments(imageData: ImageData, adjustments: ImageAdjustments): ImageData {
  const { brightness, contrast, saturation, grayscale, invert, blur, posterize } = adjustments

  // Create a copy of the image data to work with
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")!
  canvas.width = imageData.width
  canvas.height = imageData.height

  // Apply adjustments in sequence
  let processedData = imageData

  // Apply brightness and contrast
  if (brightness !== 100 || contrast !== 100) {
    processedData = applyBrightnessContrast(processedData, brightness / 100, contrast / 100)
  }

  // Apply saturation
  if (saturation !== 100) {
    processedData = applySaturation(processedData, saturation / 100)
  }

  // Apply grayscale
  if (grayscale) {
    processedData = applyGrayscale(processedData)
  }

  // Apply invert
  if (invert) {
    processedData = applyInvert(processedData)
  }

  // Apply blur/sharpen
  if (blur !== 0) {
    processedData = blur > 0 ? applyBlur(processedData, blur) : applySharpen(processedData, Math.abs(blur))
  }

  // Apply posterization
  if (posterize > 0) {
    processedData = applyPosterize(processedData, posterize)
  }

  return processedData
}

// Apply brightness and contrast adjustments
function applyBrightnessContrast(imageData: ImageData, brightness: number, contrast: number): ImageData {
  const data = imageData.data
  const factor = (259 * (contrast * 255 + 255)) / (255 * (259 - contrast * 255))

  for (let i = 0; i < data.length; i += 4) {
    // Apply brightness
    data[i] = data[i] * brightness
    data[i + 1] = data[i + 1] * brightness
    data[i + 2] = data[i + 2] * brightness

    // Apply contrast
    data[i] = factor * (data[i] - 128) + 128
    data[i + 1] = factor * (data[i + 1] - 128) + 128
    data[i + 2] = factor * (data[i + 2] - 128) + 128

    // Clamp values
    data[i] = Math.max(0, Math.min(255, data[i]))
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1]))
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2]))
  }

  return imageData
}

// Apply saturation adjustment
function applySaturation(imageData: ImageData, saturation: number): ImageData {
  const data = imageData.data

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]

    // Calculate grayscale value (luminance)
    const gray = 0.2989 * r + 0.587 * g + 0.114 * b

    // Apply saturation
    data[i] = Math.max(0, Math.min(255, gray + saturation * (r - gray)))
    data[i + 1] = Math.max(0, Math.min(255, gray + saturation * (g - gray)))
    data[i + 2] = Math.max(0, Math.min(255, gray + saturation * (b - gray)))
  }

  return imageData
}

// Convert image to grayscale
function applyGrayscale(imageData: ImageData): ImageData {
  const data = imageData.data

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]

    // Calculate grayscale value (luminance)
    const gray = 0.2989 * r + 0.587 * g + 0.114 * b

    data[i] = gray
    data[i + 1] = gray
    data[i + 2] = gray
  }

  return imageData
}

// Invert image colors
function applyInvert(imageData: ImageData): ImageData {
  const data = imageData.data

  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255 - data[i]
    data[i + 1] = 255 - data[i + 1]
    data[i + 2] = 255 - data[i + 2]
  }

  return imageData
}

// Apply blur effect
function applyBlur(imageData: ImageData, intensity: number): ImageData {
  const width = imageData.width
  const height = imageData.height
  const data = imageData.data
  const copy = new Uint8ClampedArray(data)

  // Simple box blur
  const size = Math.floor(intensity * 2) + 1
  const halfSize = Math.floor(size / 2)

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0,
        g = 0,
        b = 0,
        count = 0

      // Sample the surrounding pixels
      for (let ky = -halfSize; ky <= halfSize; ky++) {
        for (let kx = -halfSize; kx <= halfSize; kx++) {
          const px = Math.min(width - 1, Math.max(0, x + kx))
          const py = Math.min(height - 1, Math.max(0, y + ky))
          const i = (py * width + px) * 4

          r += copy[i]
          g += copy[i + 1]
          b += copy[i + 2]
          count++
        }
      }

      // Set the pixel to the average color
      const i = (y * width + x) * 4
      data[i] = r / count
      data[i + 1] = g / count
      data[i + 2] = b / count
    }
  }

  return imageData
}

// Apply sharpen effect
function applySharpen(imageData: ImageData, intensity: number): ImageData {
  const width = imageData.width
  const height = imageData.height
  const data = imageData.data
  const copy = new Uint8ClampedArray(data)

  // Unsharp mask
  const blurred = applyBlur(new ImageData(new Uint8ClampedArray(copy), width, height), 1).data
  const factor = intensity * 0.5

  for (let i = 0; i < data.length; i += 4) {
    // Apply unsharp mask formula: original + (original - blurred) * amount
    data[i] = Math.max(0, Math.min(255, copy[i] + (copy[i] - blurred[i]) * factor))
    data[i + 1] = Math.max(0, Math.min(255, copy[i + 1] + (copy[i + 1] - blurred[i + 1]) * factor))
    data[i + 2] = Math.max(0, Math.min(255, copy[i + 2] + (copy[i + 2] - blurred[i + 2]) * factor))
  }

  return imageData
}

// Apply posterization (reduce number of colors)
function applyPosterize(imageData: ImageData, levels: number): ImageData {
  if (levels <= 1) return imageData

  const data = imageData.data
  const step = 255 / (levels - 1)

  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.round(Math.round(data[i] / step) * step)
    data[i + 1] = Math.round(Math.round(data[i + 1] / step) * step)
    data[i + 2] = Math.round(Math.round(data[i + 2] / step) * step)
  }

  return imageData
}
