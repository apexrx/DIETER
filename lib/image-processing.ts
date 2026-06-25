import type { ImageAdjustments } from "./types"

export function applyAdjustments(imageData: ImageData, adjustments: ImageAdjustments): ImageData {
  const { brightness, contrast, saturation, grayscale, invert, blur, posterize } = adjustments

  let processedData = imageData

  if (brightness !== 100 || contrast !== 100) {
    processedData = applyBrightnessContrast(processedData, brightness, contrast)
  }

  if (saturation !== 100) {
    processedData = applySaturation(processedData, saturation / 100)
  }

  if (grayscale) {
    processedData = applyGrayscale(processedData)
  }

  if (invert) {
    processedData = applyInvert(processedData)
  }

  if (blur !== 0) {
    processedData = blur > 0 ? applyBlur(processedData, blur) : applySharpen(processedData, Math.abs(blur))
  }

  if (posterize > 0) {
    processedData = applyPosterize(processedData, posterize)
  }

  return processedData
}

function applyBrightnessContrast(imageData: ImageData, brightness: number, contrast: number): ImageData {
  const data = imageData.data

  const bOffset = (brightness - 100) / 100 * 255

  const cMapped = ((contrast - 100) / 100) * 255
  const factor = cMapped >= 0
    ? (259 * (cMapped + 255)) / (255 * (259 - cMapped))
    : (259 * (cMapped + 255)) / (255 * (259 - cMapped))

  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.max(0, Math.min(255, data[i] + bOffset))
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + bOffset))
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + bOffset))

    data[i] = Math.max(0, Math.min(255, factor * (data[i] - 128) + 128))
    data[i + 1] = Math.max(0, Math.min(255, factor * (data[i + 1] - 128) + 128))
    data[i + 2] = Math.max(0, Math.min(255, factor * (data[i + 2] - 128) + 128))
  }

  return imageData
}

function applySaturation(imageData: ImageData, saturation: number): ImageData {
  const data = imageData.data

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]

    const gray = 0.2989 * r + 0.587 * g + 0.114 * b

    data[i] = Math.max(0, Math.min(255, gray + saturation * (r - gray)))
    data[i + 1] = Math.max(0, Math.min(255, gray + saturation * (g - gray)))
    data[i + 2] = Math.max(0, Math.min(255, gray + saturation * (b - gray)))
  }

  return imageData
}

function applyGrayscale(imageData: ImageData): ImageData {
  const data = imageData.data

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]

    const gray = 0.2989 * r + 0.587 * g + 0.114 * b

    data[i] = gray
    data[i + 1] = gray
    data[i + 2] = gray
  }

  return imageData
}

function applyInvert(imageData: ImageData): ImageData {
  const data = imageData.data

  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255 - data[i]
    data[i + 1] = 255 - data[i + 1]
    data[i + 2] = 255 - data[i + 2]
  }

  return imageData
}

function applyBlur(imageData: ImageData, intensity: number): ImageData {
  const width = imageData.width
  const height = imageData.height
  const data = imageData.data
  const copy = new Uint8ClampedArray(data)

  const size = Math.floor(intensity * 2) + 1
  const halfSize = Math.floor(size / 2)

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0, g = 0, b = 0, count = 0

      for (let ky = -halfSize; ky <= halfSize; ky++) {
        for (let kx = -halfSize; kx <= halfSize; kx++) {
          const px = Math.min(width - 1, Math.max(0, x + kx))
          const py = Math.min(height - 1, Math.max(0, y + ky))
          const idx = (py * width + px) * 4

          r += copy[idx]
          g += copy[idx + 1]
          b += copy[idx + 2]
          count++
        }
      }

      const idx = (y * width + x) * 4
      data[idx] = r / count
      data[idx + 1] = g / count
      data[idx + 2] = b / count
    }
  }

  return imageData
}

function applySharpen(imageData: ImageData, intensity: number): ImageData {
  const width = imageData.width
  const height = imageData.height
  const data = imageData.data
  const copy = new Uint8ClampedArray(data)

  const blurred = applyBlur(new ImageData(new Uint8ClampedArray(copy), width, height), 1).data
  const factor = intensity * 0.5

  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.max(0, Math.min(255, copy[i] + (copy[i] - blurred[i]) * factor))
    data[i + 1] = Math.max(0, Math.min(255, copy[i + 1] + (copy[i + 1] - blurred[i + 1]) * factor))
    data[i + 2] = Math.max(0, Math.min(255, copy[i + 2] + (copy[i + 2] - blurred[i + 2]) * factor))
  }

  return imageData
}

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
