import type { RGB } from "./types"

export function quantizeColors(imageData: ImageData, method: string, colorCount: number): RGB[] {
  const pixels: RGB[] = []
  const data = imageData.data

  for (let i = 0; i < data.length; i += 4) {
    pixels.push({
      r: data[i],
      g: data[i + 1],
      b: data[i + 2],
    })
  }

  switch (method) {
    case "medianCut":
      return medianCut(pixels, colorCount)
    case "kMeans":
      return kMeansClustering(pixels, colorCount)
    case "octree":
      return octreeQuantization(pixels, colorCount)
    case "neuQuant":
      return neuQuantQuantization(pixels, colorCount)
    default:
      return medianCut(pixels, colorCount)
  }
}

function medianCut(pixels: RGB[], colorCount: number): RGB[] {
  if (pixels.length === 0) return []
  if (colorCount <= 0) return []

  const buckets: RGB[][] = [pixels]

  while (buckets.length < colorCount) {
    let bucketToSplit = 0
    let maxRange = -1

    for (let i = 0; i < buckets.length; i++) {
      const bucket = buckets[i]
      if (bucket.length <= 1) continue

      let rMin = 255, rMax = 0, gMin = 255, gMax = 0, bMin = 255, bMax = 0

      for (const pixel of bucket) {
        rMin = Math.min(rMin, pixel.r)
        rMax = Math.max(rMax, pixel.r)
        gMin = Math.min(gMin, pixel.g)
        gMax = Math.max(gMax, pixel.g)
        bMin = Math.min(bMin, pixel.b)
        bMax = Math.max(bMax, pixel.b)
      }

      const maxBucketRange = Math.max(rMax - rMin, gMax - gMin, bMax - bMin)

      if (maxBucketRange > maxRange) {
        maxRange = maxBucketRange
        bucketToSplit = i
      }
    }

    if (maxRange <= 0) break

    const bucket = buckets[bucketToSplit]

    let rMin = 255, rMax = 0, gMin = 255, gMax = 0, bMin = 255, bMax = 0

    for (const pixel of bucket) {
      rMin = Math.min(rMin, pixel.r)
      rMax = Math.max(rMax, pixel.r)
      gMin = Math.min(gMin, pixel.g)
      gMax = Math.max(gMax, pixel.g)
      bMin = Math.min(bMin, pixel.b)
      bMax = Math.max(bMax, pixel.b)
    }

    const rRange = rMax - rMin
    const gRange = gMax - gMin
    const bRange = bMax - bMin

    let sortChannel: keyof RGB
    if (rRange >= gRange && rRange >= bRange) {
      sortChannel = "r"
    } else if (gRange >= rRange && gRange >= bRange) {
      sortChannel = "g"
    } else {
      sortChannel = "b"
    }

    bucket.sort((a, b) => a[sortChannel] - b[sortChannel])

    const medianIndex = Math.floor(bucket.length / 2)
    const bucket1 = bucket.slice(0, medianIndex)
    const bucket2 = bucket.slice(medianIndex)

    buckets.splice(bucketToSplit, 1, bucket1, bucket2)
  }

  return buckets.map((bucket) => {
    if (bucket.length === 0) {
      return { r: 0, g: 0, b: 0 }
    }

    let rSum = 0, gSum = 0, bSum = 0

    for (const pixel of bucket) {
      rSum += pixel.r
      gSum += pixel.g
      bSum += pixel.b
    }

    return {
      r: Math.round(rSum / bucket.length),
      g: Math.round(gSum / bucket.length),
      b: Math.round(bSum / bucket.length),
    }
  })
}

function kMeansClustering(pixels: RGB[], k: number): RGB[] {
  if (pixels.length === 0) return []
  if (k <= 0) return []

  const centroids: RGB[] = []
  for (let i = 0; i < k; i++) {
    const randomIndex = Math.floor(Math.random() * pixels.length)
    centroids.push({ ...pixels[randomIndex] })
  }

  const maxIterations = 10
  let iterations = 0
  let changed = true

  while (changed && iterations < maxIterations) {
    const clusters: RGB[][] = Array.from({ length: k }, () => [])

    for (const pixel of pixels) {
      let minDistance = Number.MAX_VALUE
      let closestCentroid = 0

      for (let i = 0; i < k; i++) {
        const distance = colorDistance(pixel, centroids[i])
        if (distance < minDistance) {
          minDistance = distance
          closestCentroid = i
        }
      }

      clusters[closestCentroid].push(pixel)
    }

    changed = false
    for (let i = 0; i < k; i++) {
      const cluster = clusters[i]
      if (cluster.length === 0) continue

      let rSum = 0, gSum = 0, bSum = 0

      for (const pixel of cluster) {
        rSum += pixel.r
        gSum += pixel.g
        bSum += pixel.b
      }

      const newCentroid = {
        r: Math.round(rSum / cluster.length),
        g: Math.round(gSum / cluster.length),
        b: Math.round(bSum / cluster.length),
      }

      if (newCentroid.r !== centroids[i].r || newCentroid.g !== centroids[i].g || newCentroid.b !== centroids[i].b) {
        centroids[i] = newCentroid
        changed = true
      }
    }

    iterations++
  }

  return centroids
}

class OctreeNode {
  children: (OctreeNode | null)[] = [null, null, null, null, null, null, null, null]
  count = 0
  r = 0
  g = 0
  b = 0
  isLeaf = false

  add(color: RGB, depth: number) {
    this.r += color.r
    this.g += color.g
    this.b += color.b
    this.count++

    if (depth === 8) {
      this.isLeaf = true
      return
    }

    const rBit = (color.r >> (7 - depth)) & 1
    const gBit = (color.g >> (7 - depth)) & 1
    const bBit = (color.b >> (7 - depth)) & 1
    const index = (rBit << 2) | (gBit << 1) | bBit

    if (!this.children[index]) {
      this.children[index] = new OctreeNode()
    }
    this.children[index]!.add(color, depth + 1)
  }

  reduce(depth: number, target: number, leaves: OctreeNode[]): number {
    if (this.isLeaf) return 1

    let leafCount = 0
    for (const child of this.children) {
      if (child) {
        leafCount += child.reduce(depth + 1, target, leaves)
      }
    }

    if (depth > 0 && leafCount <= target && leafCount > 0) {
      let r = 0, g = 0, b = 0, count = 0
      for (let i = 0; i < 8; i++) {
        const child = this.children[i]
        if (child && child.count > 0) {
          r += child.r
          g += child.g
          b += child.b
          count += child.count
          this.children[i] = null
        }
      }
      this.r = r
      this.g = g
      this.b = b
      this.count = count
      this.isLeaf = true
      leafCount = 1
    }

    return leafCount
  }

  collectPalette(palette: RGB[]) {
    if (this.isLeaf && this.count > 0) {
      palette.push({
        r: Math.round(this.r / this.count),
        g: Math.round(this.g / this.count),
        b: Math.round(this.b / this.count),
      })
      return
    }
    for (const child of this.children) {
      if (child) child.collectPalette(palette)
    }
  }
}

function octreeQuantization(pixels: RGB[], colorCount: number): RGB[] {
  if (pixels.length === 0) return []
  if (colorCount <= 0) return []

  const root = new OctreeNode()

  for (const pixel of pixels) {
    root.add(pixel, 0)
  }

  const leaves: OctreeNode[] = []
  root.reduce(0, colorCount, leaves)

  const palette: RGB[] = []
  root.collectPalette(palette)

  while (palette.length < colorCount) {
    palette.push({ r: 0, g: 0, b: 0 })
  }

  return palette.slice(0, colorCount)
}

function neuQuantQuantization(pixels: RGB[], colorCount: number): RGB[] {
  if (pixels.length === 0) return []
  if (colorCount <= 0) return []

  const network: RGB[] = []
  for (let i = 0; i < colorCount; i++) {
    const idx = Math.floor((i * pixels.length) / colorCount)
    network.push({ ...pixels[Math.min(idx, pixels.length - 1)] })
  }

  const maxCycles = Math.min(100, pixels.length / 10)
  const learnRate = 0.1
  const adjustRate = 0.01

  for (let cycle = 0; cycle < maxCycles; cycle++) {
    const pixel = pixels[Math.floor(Math.random() * pixels.length)]

    let winner = 0
    let minDist = Infinity
    for (let i = 0; i < network.length; i++) {
      const d = colorDistance(pixel, network[i])
      if (d < minDist) {
        minDist = d
        winner = i
      }
    }

    const radius = Math.max(1, Math.floor(colorCount * (1 - cycle / maxCycles) * 0.5))
    const rate = learnRate * (1 - cycle / maxCycles)

    for (let i = 0; i < network.length; i++) {
      const dist = Math.abs(i - winner)
      if (dist <= radius) {
        const influence = rate * (1 - dist / radius)
        network[i].r = Math.max(0, Math.min(255, network[i].r + (pixel.r - network[i].r) * influence))
        network[i].g = Math.max(0, Math.min(255, network[i].g + (pixel.g - network[i].g) * influence))
        network[i].b = Math.max(0, Math.min(255, network[i].b + (pixel.b - network[i].b) * influence))
      }
    }
  }

  return network
}

function colorDistance(color1: RGB, color2: RGB): number {
  const rDiff = color1.r - color2.r
  const gDiff = color1.g - color2.g
  const bDiff = color1.b - color2.b
  return rDiff * rDiff + gDiff * gDiff + bDiff * bDiff
}
