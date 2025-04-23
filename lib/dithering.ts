import type { DitheringOptions, RGB } from "./types"
import { palettes, findClosestColor } from "./palettes"
import { quantizeColors } from "./color-quantization"

// Apply dithering to the image data
export function applyDithering(imageData: ImageData, options: DitheringOptions): ImageData {
  const {
    algorithm,
    palette: paletteName,
    threshold,
    diffusionStrength,
    ditherScale,
    colorQuantization,
    colorCount,
  } = options

  // Create a copy of the image data to work with
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")!
  canvas.width = imageData.width
  canvas.height = imageData.height
  ctx.putImageData(imageData, 0, 0)

  // Scale the image if ditherScale is not 1
  let scaledWidth = imageData.width
  let scaledHeight = imageData.height

  if (ditherScale !== 1) {
    // Scale down for processing
    scaledWidth = Math.max(1, Math.round(imageData.width / ditherScale))
    scaledHeight = Math.max(1, Math.round(imageData.height / ditherScale))

    const scaledCanvas = document.createElement("canvas")
    const scaledCtx = scaledCanvas.getContext("2d")!
    scaledCanvas.width = scaledWidth
    scaledCanvas.height = scaledHeight

    scaledCtx.drawImage(canvas, 0, 0, scaledWidth, scaledHeight)
    canvas.width = scaledWidth
    canvas.height = scaledHeight
    ctx.drawImage(scaledCanvas, 0, 0)
  }

  // Get the scaled image data
  const scaledImageData = ctx.getImageData(0, 0, scaledWidth, scaledHeight)

  // Get the selected palette or apply color quantization
  let selectedPalette: RGB[]

  if (colorQuantization && colorQuantization !== "none" && colorCount) {
    // Apply color quantization to generate a custom palette
    selectedPalette = quantizeColors(scaledImageData, colorQuantization, colorCount)
  } else {
    // Use the selected palette
    selectedPalette = palettes[paletteName]?.colors || palettes.bw.colors
  }

  // Apply the selected dithering algorithm
  let ditheredData: ImageData

  switch (algorithm) {
    case "floydSteinberg":
      ditheredData = floydSteinbergDithering(scaledImageData, selectedPalette, diffusionStrength)
      break
    case "atkinson":
      ditheredData = atkinsonDithering(scaledImageData, selectedPalette, diffusionStrength)
      break
    case "jarvis":
      ditheredData = jarvisDithering(scaledImageData, selectedPalette, diffusionStrength)
      break
    case "stucki":
      ditheredData = stuckiDithering(scaledImageData, selectedPalette, diffusionStrength)
      break
    case "burkes":
      ditheredData = burkesDithering(scaledImageData, selectedPalette, diffusionStrength)
      break
    case "sierra":
      ditheredData = sierraDithering(scaledImageData, selectedPalette, diffusionStrength)
      break
    case "sierra2":
      ditheredData = sierra2Dithering(scaledImageData, selectedPalette, diffusionStrength)
      break
    case "sierraLite":
      ditheredData = sierraLiteDithering(scaledImageData, selectedPalette, diffusionStrength)
      break
    case "bayer2x2":
      ditheredData = bayerDithering(scaledImageData, selectedPalette, 2, threshold)
      break
    case "bayer4x4":
      ditheredData = bayerDithering(scaledImageData, selectedPalette, 4, threshold)
      break
    case "bayer8x8":
      ditheredData = bayerDithering(scaledImageData, selectedPalette, 8, threshold)
      break
    case "clusteredDot":
      ditheredData = clusteredDotDithering(scaledImageData, selectedPalette, threshold)
      break
    case "halftone":
      ditheredData = halftoneDithering(scaledImageData, selectedPalette, threshold)
      break
    case "random":
      ditheredData = randomDithering(scaledImageData, selectedPalette, threshold)
      break
    case "threshold":
    default:
      ditheredData = thresholdDithering(scaledImageData, selectedPalette, threshold)
      break
  }

  // If we scaled the image, scale it back up
  if (ditherScale !== 1) {
    ctx.putImageData(ditheredData, 0, 0)

    const finalCanvas = document.createElement("canvas")
    const finalCtx = finalCanvas.getContext("2d")!
    finalCanvas.width = imageData.width
    finalCanvas.height = imageData.height

    // Use nearest-neighbor scaling to maintain the pixelated look
    finalCtx.imageSmoothingEnabled = false
    finalCtx.drawImage(canvas, 0, 0, imageData.width, imageData.height)

    return finalCtx.getImageData(0, 0, imageData.width, imageData.height)
  }

  return ditheredData
}

// Simple threshold dithering
function thresholdDithering(imageData: ImageData, palette: RGB[], threshold: number): ImageData {
  const data = imageData.data
  const width = imageData.width
  const height = imageData.height

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4

      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]

      // Find the closest color in the palette
      const closestColor = findClosestColor({ r, g, b }, palette)

      // Set the pixel to the closest color
      data[i] = closestColor.r
      data[i + 1] = closestColor.g
      data[i + 2] = closestColor.b
    }
  }

  return imageData
}

// Floyd-Steinberg dithering
function floydSteinbergDithering(imageData: ImageData, palette: RGB[], diffusionStrength: number): ImageData {
  const data = new Uint8ClampedArray(imageData.data)
  const width = imageData.width
  const height = imageData.height

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4

      const oldR = data[i]
      const oldG = data[i + 1]
      const oldB = data[i + 2]

      const closestColor = findClosestColor({ r: oldR, g: oldG, b: oldB }, palette)

      data[i] = closestColor.r
      data[i + 1] = closestColor.g
      data[i + 2] = closestColor.b

      // Calculate quantization error
      const errorR = (oldR - closestColor.r) * diffusionStrength
      const errorG = (oldG - closestColor.g) * diffusionStrength
      const errorB = (oldB - closestColor.b) * diffusionStrength

      // Distribute error to neighboring pixels
      if (x + 1 < width) {
        data[i + 4] = Math.max(0, Math.min(255, data[i + 4] + (errorR * 7) / 16))
        data[i + 5] = Math.max(0, Math.min(255, data[i + 5] + (errorG * 7) / 16))
        data[i + 6] = Math.max(0, Math.min(255, data[i + 6] + (errorB * 7) / 16))
      }

      if (y + 1 < height) {
        if (x > 0) {
          data[i + width * 4 - 4] = Math.max(0, Math.min(255, data[i + width * 4 - 4] + (errorR * 3) / 16))
          data[i + width * 4 - 3] = Math.max(0, Math.min(255, data[i + width * 4 - 3] + (errorG * 3) / 16))
          data[i + width * 4 - 2] = Math.max(0, Math.min(255, data[i + width * 4 - 2] + (errorB * 3) / 16))
        }

        data[i + width * 4] = Math.max(0, Math.min(255, data[i + width * 4] + (errorR * 5) / 16))
        data[i + width * 4 + 1] = Math.max(0, Math.min(255, data[i + width * 4 + 1] + (errorG * 5) / 16))
        data[i + width * 4 + 2] = Math.max(0, Math.min(255, data[i + width * 4 + 2] + (errorB * 5) / 16))

        if (x + 1 < width) {
          data[i + width * 4 + 4] = Math.max(0, Math.min(255, data[i + width * 4 + 4] + (errorR * 1) / 16))
          data[i + width * 4 + 5] = Math.max(0, Math.min(255, data[i + width * 4 + 5] + (errorG * 1) / 16))
          data[i + width * 4 + 6] = Math.max(0, Math.min(255, data[i + width * 4 + 6] + (errorB * 1) / 16))
        }
      }
    }
  }

  return new ImageData(data, width, height)
}

// Atkinson dithering
function atkinsonDithering(imageData: ImageData, palette: RGB[], diffusionStrength: number): ImageData {
  const data = new Uint8ClampedArray(imageData.data)
  const width = imageData.width
  const height = imageData.height

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4

      const oldR = data[i]
      const oldG = data[i + 1]
      const oldB = data[i + 2]

      const closestColor = findClosestColor({ r: oldR, g: oldG, b: oldB }, palette)

      data[i] = closestColor.r
      data[i + 1] = closestColor.g
      data[i + 2] = closestColor.b

      // Calculate quantization error
      const errorR = (oldR - closestColor.r) * diffusionStrength
      const errorG = (oldG - closestColor.g) * diffusionStrength
      const errorB = (oldB - closestColor.b) * diffusionStrength

      // Distribute error (1/8) to neighboring pixels
      const distribution = [
        [1, 0],
        [2, 0],
        [-1, 1],
        [0, 1],
        [1, 1],
        [0, 2],
      ]

      for (const [dx, dy] of distribution) {
        const nx = x + dx
        const ny = y + dy

        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          const ni = (ny * width + nx) * 4

          data[ni] = Math.max(0, Math.min(255, data[ni] + errorR / 8))
          data[ni + 1] = Math.max(0, Math.min(255, data[ni + 1] + errorG / 8))
          data[ni + 2] = Math.max(0, Math.min(255, data[ni + 2] + errorB / 8))
        }
      }
    }
  }

  return new ImageData(data, width, height)
}

// Jarvis-Judice-Ninke dithering
function jarvisDithering(imageData: ImageData, palette: RGB[], diffusionStrength: number): ImageData {
  const data = new Uint8ClampedArray(imageData.data)
  const width = imageData.width
  const height = imageData.height

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4

      const oldR = data[i]
      const oldG = data[i + 1]
      const oldB = data[i + 2]

      const closestColor = findClosestColor({ r: oldR, g: oldG, b: oldB }, palette)

      data[i] = closestColor.r
      data[i + 1] = closestColor.g
      data[i + 2] = closestColor.b

      // Calculate quantization error
      const errorR = (oldR - closestColor.r) * diffusionStrength
      const errorG = (oldG - closestColor.g) * diffusionStrength
      const errorB = (oldB - closestColor.b) * diffusionStrength

      // Jarvis-Judice-Ninke distribution pattern
      const distribution = [
        [1, 0, 7 / 48],
        [2, 0, 5 / 48],
        [-2, 1, 3 / 48],
        [-1, 1, 5 / 48],
        [0, 1, 7 / 48],
        [1, 1, 5 / 48],
        [2, 1, 3 / 48],
        [-2, 2, 1 / 48],
        [-1, 2, 3 / 48],
        [0, 2, 5 / 48],
        [1, 2, 3 / 48],
        [2, 2, 1 / 48],
      ]

      for (const [dx, dy, factor] of distribution) {
        const nx = x + dx
        const ny = y + dy

        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          const ni = (ny * width + nx) * 4

          data[ni] = Math.max(0, Math.min(255, data[ni] + errorR * factor))
          data[ni + 1] = Math.max(0, Math.min(255, data[ni + 1] + errorG * factor))
          data[ni + 2] = Math.max(0, Math.min(255, data[ni + 2] + errorB * factor))
        }
      }
    }
  }

  return new ImageData(data, width, height)
}

// Stucki dithering
function stuckiDithering(imageData: ImageData, palette: RGB[], diffusionStrength: number): ImageData {
  const data = new Uint8ClampedArray(imageData.data)
  const width = imageData.width
  const height = imageData.height

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4

      const oldR = data[i]
      const oldG = data[i + 1]
      const oldB = data[i + 2]

      const closestColor = findClosestColor({ r: oldR, g: oldG, b: oldB }, palette)

      data[i] = closestColor.r
      data[i + 1] = closestColor.g
      data[i + 2] = closestColor.b

      // Calculate quantization error
      const errorR = (oldR - closestColor.r) * diffusionStrength
      const errorG = (oldG - closestColor.g) * diffusionStrength
      const errorB = (oldB - closestColor.b) * diffusionStrength

      // Stucki distribution pattern
      const distribution = [
        [1, 0, 8 / 42],
        [2, 0, 4 / 42],
        [-2, 1, 2 / 42],
        [-1, 1, 4 / 42],
        [0, 1, 8 / 42],
        [1, 1, 4 / 42],
        [2, 1, 2 / 42],
        [-2, 2, 1 / 42],
        [-1, 2, 2 / 42],
        [0, 2, 4 / 42],
        [1, 2, 2 / 42],
        [2, 2, 1 / 42],
      ]

      for (const [dx, dy, factor] of distribution) {
        const nx = x + dx
        const ny = y + dy

        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          const ni = (ny * width + nx) * 4

          data[ni] = Math.max(0, Math.min(255, data[ni] + errorR * factor))
          data[ni + 1] = Math.max(0, Math.min(255, data[ni + 1] + errorG * factor))
          data[ni + 2] = Math.max(0, Math.min(255, data[ni + 2] + errorB * factor))
        }
      }
    }
  }

  return new ImageData(data, width, height)
}

// Burkes dithering
function burkesDithering(imageData: ImageData, palette: RGB[], diffusionStrength: number): ImageData {
  const data = new Uint8ClampedArray(imageData.data)
  const width = imageData.width
  const height = imageData.height

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4

      const oldR = data[i]
      const oldG = data[i + 1]
      const oldB = data[i + 2]

      const closestColor = findClosestColor({ r: oldR, g: oldG, b: oldB }, palette)

      data[i] = closestColor.r
      data[i + 1] = closestColor.g
      data[i + 2] = closestColor.b

      // Calculate quantization error
      const errorR = (oldR - closestColor.r) * diffusionStrength
      const errorG = (oldG - closestColor.g) * diffusionStrength
      const errorB = (oldB - closestColor.b) * diffusionStrength

      // Burkes distribution pattern
      const distribution = [
        [1, 0, 8 / 32],
        [2, 0, 4 / 32],
        [-2, 1, 2 / 32],
        [-1, 1, 4 / 32],
        [0, 1, 8 / 32],
        [1, 1, 4 / 32],
        [2, 1, 2 / 32],
      ]

      for (const [dx, dy, factor] of distribution) {
        const nx = x + dx
        const ny = y + dy

        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          const ni = (ny * width + nx) * 4

          data[ni] = Math.max(0, Math.min(255, data[ni] + errorR * factor))
          data[ni + 1] = Math.max(0, Math.min(255, data[ni + 1] + errorG * factor))
          data[ni + 2] = Math.max(0, Math.min(255, data[ni + 2] + errorB * factor))
        }
      }
    }
  }

  return new ImageData(data, width, height)
}

// Sierra dithering
function sierraDithering(imageData: ImageData, palette: RGB[], diffusionStrength: number): ImageData {
  const data = new Uint8ClampedArray(imageData.data)
  const width = imageData.width
  const height = imageData.height

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4

      const oldR = data[i]
      const oldG = data[i + 1]
      const oldB = data[i + 2]

      const closestColor = findClosestColor({ r: oldR, g: oldG, b: oldB }, palette)

      data[i] = closestColor.r
      data[i + 1] = closestColor.g
      data[i + 2] = closestColor.b

      // Calculate quantization error
      const errorR = (oldR - closestColor.r) * diffusionStrength
      const errorG = (oldG - closestColor.g) * diffusionStrength
      const errorB = (oldB - closestColor.b) * diffusionStrength

      // Sierra distribution pattern
      const distribution = [
        [1, 0, 5 / 32],
        [2, 0, 3 / 32],
        [-2, 1, 2 / 32],
        [-1, 1, 4 / 32],
        [0, 1, 5 / 32],
        [1, 1, 4 / 32],
        [2, 1, 2 / 32],
        [-1, 2, 2 / 32],
        [0, 2, 3 / 32],
        [1, 2, 2 / 32],
      ]

      for (const [dx, dy, factor] of distribution) {
        const nx = x + dx
        const ny = y + dy

        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          const ni = (ny * width + nx) * 4

          data[ni] = Math.max(0, Math.min(255, data[ni] + errorR * factor))
          data[ni + 1] = Math.max(0, Math.min(255, data[ni + 1] + errorG * factor))
          data[ni + 2] = Math.max(0, Math.min(255, data[ni + 2] + errorB * factor))
        }
      }
    }
  }

  return new ImageData(data, width, height)
}

// Sierra Lite dithering
function sierraLiteDithering(imageData: ImageData, palette: RGB[], diffusionStrength: number): ImageData {
  const data = new Uint8ClampedArray(imageData.data)
  const width = imageData.width
  const height = imageData.height

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4

      const oldR = data[i]
      const oldG = data[i + 1]
      const oldB = data[i + 2]

      const closestColor = findClosestColor({ r: oldR, g: oldG, b: oldB }, palette)

      data[i] = closestColor.r
      data[i + 1] = closestColor.g
      data[i + 2] = closestColor.b

      // Calculate quantization error
      const errorR = (oldR - closestColor.r) * diffusionStrength
      const errorG = (oldG - closestColor.g) * diffusionStrength
      const errorB = (oldB - closestColor.b) * diffusionStrength

      // Sierra Lite distribution pattern
      const distribution = [
        [1, 0, 2 / 4],
        [-1, 1, 1 / 4],
        [0, 1, 1 / 4],
      ]

      for (const [dx, dy, factor] of distribution) {
        const nx = x + dx
        const ny = y + dy

        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          const ni = (ny * width + nx) * 4

          data[ni] = Math.max(0, Math.min(255, data[ni] + errorR * factor))
          data[ni + 1] = Math.max(0, Math.min(255, data[ni + 1] + errorG * factor))
          data[ni + 2] = Math.max(0, Math.min(255, data[ni + 2] + errorB * factor))
        }
      }
    }
  }

  return new ImageData(data, width, height)
}

// Sierra-2 dithering
function sierra2Dithering(imageData: ImageData, palette: RGB[], diffusionStrength: number): ImageData {
  const data = new Uint8ClampedArray(imageData.data)
  const width = imageData.width
  const height = imageData.height

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4

      const oldR = data[i]
      const oldG = data[i + 1]
      const oldB = data[i + 2]

      const closestColor = findClosestColor({ r: oldR, g: oldG, b: oldB }, palette)

      data[i] = closestColor.r
      data[i + 1] = closestColor.g
      data[i + 2] = closestColor.b

      // Calculate quantization error
      const errorR = (oldR - closestColor.r) * diffusionStrength
      const errorG = (oldG - closestColor.g) * diffusionStrength
      const errorB = (oldB - closestColor.b) * diffusionStrength

      // Sierra-2 distribution pattern
      const distribution = [
        [1, 0, 4 / 16],
        [2, 0, 3 / 16],
        [-2, 1, 1 / 16],
        [-1, 1, 2 / 16],
        [0, 1, 3 / 16],
        [1, 1, 2 / 16],
        [2, 1, 1 / 16],
      ]

      for (const [dx, dy, factor] of distribution) {
        const nx = x + dx
        const ny = y + dy

        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          const ni = (ny * width + nx) * 4

          data[ni] = Math.max(0, Math.min(255, data[ni] + errorR * factor))
          data[ni + 1] = Math.max(0, Math.min(255, data[ni + 1] + errorG * factor))
          data[ni + 2] = Math.max(0, Math.min(255, data[ni + 2] + errorB * factor))
        }
      }
    }
  }

  return new ImageData(data, width, height)
}

// Bayer dithering with different matrix sizes
function bayerDithering(imageData: ImageData, palette: RGB[], size: number, threshold: number): ImageData {
  const data = new Uint8ClampedArray(imageData.data)
  const width = imageData.width
  const height = imageData.height

  // Define Bayer matrices
  const bayer2x2 = [
    [0, 2],
    [3, 1],
  ]

  const bayer4x4 = [
    [0, 8, 2, 10],
    [12, 4, 14, 6],
    [3, 11, 1, 9],
    [15, 7, 13, 5],
  ]

  const bayer8x8 = [
    [0, 32, 8, 40, 2, 34, 10, 42],
    [48, 16, 56, 24, 50, 18, 58, 26],
    [12, 44, 4, 36, 14, 46, 6, 38],
    [60, 28, 52, 20, 62, 30, 54, 22],
    [3, 35, 11, 43, 1, 33, 9, 41],
    [51, 19, 59, 27, 49, 17, 57, 25],
    [15, 47, 7, 39, 13, 45, 5, 37],
    [63, 31, 55, 23, 61, 29, 53, 21],
  ]

  // Select the appropriate matrix
  let matrix
  let matrixSize

  if (size === 2) {
    matrix = bayer2x2
    matrixSize = 2
  } else if (size === 4) {
    matrix = bayer4x4
    matrixSize = 4
  } else {
    matrix = bayer8x8
    matrixSize = 8
  }

  // Normalize the matrix values to 0-255 range
  const matrixFactor = 256 / (matrixSize * matrixSize)

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4

      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]

      // Get the Bayer threshold value for this pixel
      const thresholdValue = matrix[y % matrixSize][x % matrixSize] * matrixFactor - 128 + threshold

      // Apply the threshold to each color channel
      const newR = r > thresholdValue ? 255 : 0
      const newG = g > thresholdValue ? 255 : 0
      const newB = b > thresholdValue ? 255 : 0

      // Find the closest color in the palette
      const closestColor = findClosestColor({ r: newR, g: newG, b: newB }, palette)

      data[i] = closestColor.r
      data[i + 1] = closestColor.g
      data[i + 2] = closestColor.b
    }
  }

  return new ImageData(data, width, height)
}

// Clustered dot dithering
function clusteredDotDithering(imageData: ImageData, palette: RGB[], threshold: number): ImageData {
  const data = new Uint8ClampedArray(imageData.data)
  const width = imageData.width
  const height = imageData.height

  // Define a clustered dot matrix (4x4)
  const clusteredDot = [
    [12, 5, 6, 13],
    [4, 0, 1, 7],
    [11, 3, 2, 8],
    [15, 10, 9, 14],
  ]

  // Normalize the matrix values to 0-255 range
  const matrixFactor = 256 / 16

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4

      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]

      // Get the threshold value for this pixel
      const thresholdValue = clusteredDot[y % 4][x % 4] * matrixFactor - 128 + threshold

      // Apply the threshold to each color channel
      const newR = r > thresholdValue ? 255 : 0
      const newG = g > thresholdValue ? 255 : 0
      const newB = b > thresholdValue ? 255 : 0

      // Find the closest color in the palette
      const closestColor = findClosestColor({ r: newR, g: newG, b: newB }, palette)

      data[i] = closestColor.r
      data[i + 1] = closestColor.g
      data[i + 2] = closestColor.b
    }
  }

  return new ImageData(data, width, height)
}

// Halftone dithering
function halftoneDithering(imageData: ImageData, palette: RGB[], threshold: number): ImageData {
  const data = new Uint8ClampedArray(imageData.data)
  const width = imageData.width
  const height = imageData.height

  // Define a halftone pattern (8x8)
  const halftone = [
    [24, 10, 12, 26, 35, 47, 49, 37],
    [8, 0, 2, 14, 45, 59, 61, 51],
    [22, 6, 4, 16, 43, 57, 63, 53],
    [30, 20, 18, 28, 33, 41, 55, 39],
    [34, 46, 48, 36, 25, 11, 13, 27],
    [44, 58, 60, 50, 9, 1, 3, 15],
    [42, 56, 62, 52, 23, 7, 5, 17],
    [32, 40, 54, 38, 31, 21, 19, 29],
  ]

  // Normalize the matrix values to 0-255 range
  const matrixFactor = 256 / 64

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4

      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]

      // Get the threshold value for this pixel
      const thresholdValue = halftone[y % 8][x % 8] * matrixFactor - 128 + threshold

      // Apply the threshold to each color channel
      const newR = r > thresholdValue ? 255 : 0
      const newG = g > thresholdValue ? 255 : 0
      const newB = b > thresholdValue ? 255 : 0

      // Find the closest color in the palette
      const closestColor = findClosestColor({ r: newR, g: newG, b: newB }, palette)

      data[i] = closestColor.r
      data[i + 1] = closestColor.g
      data[i + 2] = closestColor.b
    }
  }

  return new ImageData(data, width, height)
}

// Random dithering
function randomDithering(imageData: ImageData, palette: RGB[], threshold: number): ImageData {
  const data = new Uint8ClampedArray(imageData.data)
  const width = imageData.width
  const height = imageData.height

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4

      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]

      // Generate a random threshold adjustment
      const randomAdjustment = Math.floor(Math.random() * 256) - 128
      const adjustedThreshold = threshold + randomAdjustment

      // Apply the threshold to each color channel
      const newR = r > adjustedThreshold ? 255 : 0
      const newG = g > adjustedThreshold ? 255 : 0
      const newB = b > adjustedThreshold ? 255 : 0

      // Find the closest color in the palette
      const closestColor = findClosestColor({ r: newR, g: newG, b: newB }, palette)

      data[i] = closestColor.r
      data[i + 1] = closestColor.g
      data[i + 2] = closestColor.b
    }
  }

  return new ImageData(data, width, height)
}
