import type { Palette, RGB } from "./types"

// Define color palettes
export const palettes: Record<string, Palette> = {
  bw: {
    name: "Black & White",
    colors: [
      { r: 0, g: 0, b: 0 },
      { r: 255, g: 255, b: 255 },
    ],
  },
  grayscale4: {
    name: "Grayscale (4 levels)",
    colors: [
      { r: 0, g: 0, b: 0 },
      { r: 85, g: 85, b: 85 },
      { r: 170, g: 170, b: 170 },
      { r: 255, g: 255, b: 255 },
    ],
  },
  grayscale8: {
    name: "Grayscale (8 levels)",
    colors: [
      { r: 0, g: 0, b: 0 },
      { r: 36, g: 36, b: 36 },
      { r: 73, g: 73, b: 73 },
      { r: 109, g: 109, b: 109 },
      { r: 146, g: 146, b: 146 },
      { r: 182, g: 182, b: 182 },
      { r: 219, g: 219, b: 219 },
      { r: 255, g: 255, b: 255 },
    ],
  },
  gameboy: {
    name: "Game Boy",
    colors: [
      { r: 15, g: 56, b: 15 },
      { r: 48, g: 98, b: 48 },
      { r: 139, g: 172, b: 15 },
      { r: 155, g: 188, b: 15 },
    ],
  },
  cga: {
    name: "CGA",
    colors: [
      { r: 0, g: 0, b: 0 },
      { r: 85, g: 255, b: 255 },
      { r: 255, g: 85, b: 255 },
      { r: 255, g: 255, b: 255 },
    ],
  },
  ega: {
    name: "EGA (16 colors)",
    colors: [
      { r: 0, g: 0, b: 0 },
      { r: 0, g: 0, b: 170 },
      { r: 0, g: 170, b: 0 },
      { r: 0, g: 170, b: 170 },
      { r: 170, g: 0, b: 0 },
      { r: 170, g: 0, b: 170 },
      { r: 170, g: 85, b: 0 },
      { r: 170, g: 170, b: 170 },
      { r: 85, g: 85, b: 85 },
      { r: 85, g: 85, b: 255 },
      { r: 85, g: 255, b: 85 },
      { r: 85, g: 255, b: 255 },
      { r: 255, g: 85, b: 85 },
      { r: 255, g: 85, b: 255 },
      { r: 255, g: 255, b: 85 },
      { r: 255, g: 255, b: 255 },
    ],
  },
  c64: {
    name: "Commodore 64",
    colors: [
      { r: 0, g: 0, b: 0 },
      { r: 255, g: 255, b: 255 },
      { r: 136, g: 0, b: 0 },
      { r: 170, g: 255, b: 238 },
      { r: 204, g: 68, b: 204 },
      { r: 0, g: 204, b: 85 },
      { r: 0, g: 0, b: 170 },
      { r: 238, g: 238, b: 119 },
      { r: 221, g: 136, b: 85 },
      { r: 102, g: 68, b: 0 },
      { r: 255, g: 119, b: 119 },
      { r: 51, g: 51, b: 51 },
      { r: 119, g: 119, b: 119 },
      { r: 170, g: 255, b: 102 },
      { r: 0, g: 136, b: 255 },
      { r: 187, g: 187, b: 187 },
    ],
  },
  apple2: {
    name: "Apple II",
    colors: [
      { r: 0, g: 0, b: 0 },
      { r: 114, g: 38, b: 64 },
      { r: 64, g: 51, b: 127 },
      { r: 228, g: 52, b: 254 },
      { r: 14, g: 89, b: 64 },
      { r: 128, g: 128, b: 128 },
      { r: 27, g: 154, b: 254 },
      { r: 191, g: 179, b: 255 },
      { r: 64, g: 76, b: 0 },
      { r: 228, g: 101, b: 1 },
      { r: 128, g: 128, b: 128 },
      { r: 241, g: 166, b: 191 },
      { r: 27, g: 203, b: 1 },
      { r: 191, g: 204, b: 128 },
      { r: 141, g: 217, b: 191 },
      { r: 255, g: 255, b: 255 },
    ],
  },
  zxspectrum: {
    name: "ZX Spectrum",
    colors: [
      { r: 0, g: 0, b: 0 },
      { r: 0, g: 0, b: 215 },
      { r: 215, g: 0, b: 0 },
      { r: 215, g: 0, b: 215 },
      { r: 0, g: 215, b: 0 },
      { r: 0, g: 215, b: 215 },
      { r: 215, g: 215, b: 0 },
      { r: 215, g: 215, b: 215 },
      { r: 0, g: 0, b: 255 },
      { r: 255, g: 0, b: 0 },
      { r: 255, g: 0, b: 255 },
      { r: 0, g: 255, b: 0 },
      { r: 0, g: 255, b: 255 },
      { r: 255, g: 255, b: 0 },
      { r: 255, g: 255, b: 255 },
    ],
  },
}

// Find the closest color in a palette
export function findClosestColor(color: RGB, palette: RGB[]): RGB {
  let minDistance = Number.MAX_VALUE
  let closestColor = palette[0]

  for (const paletteColor of palette) {
    const distance = colorDistance(color, paletteColor)
    if (distance < minDistance) {
      minDistance = distance
      closestColor = paletteColor
    }
  }

  return closestColor
}

// Calculate Euclidean distance between two colors
function colorDistance(color1: RGB, color2: RGB): number {
  const rDiff = color1.r - color2.r
  const gDiff = color1.g - color2.g
  const bDiff = color1.b - color2.b
  return rDiff * rDiff + gDiff * gDiff + bDiff * bDiff
}
