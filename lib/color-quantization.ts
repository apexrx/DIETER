import type { RGB } from "./types"

// Main function to quantize colors based on the selected method
export function quantizeColors(imageData: ImageData, method: string, colorCount: number): RGB[] {
  // Extract pixel data
  const pixels: RGB[] = []
  const data = imageData.data

  for (let i = 0; i < data.length; i += 4) {
    pixels.push({
      r: data[i],
      g: data[i + 1],
      b: data[i + 2],
    })
  }

  // Apply the selected quantization method
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
      // Default to median cut if method not recognized
      return medianCut(pixels, colorCount)
  }
}

// Median Cut algorithm
function medianCut(pixels: RGB[], colorCount: number): RGB[] {
  if (pixels.length === 0) return []
  if (colorCount <= 0) return []

  // Start with all pixels in one bucket
  const buckets: RGB[][] = [pixels]

  // Split buckets until we have enough
  while (buckets.length < colorCount) {
    // Find the bucket with the largest range
    let bucketToSplit = 0
    let maxRange = -1

    for (let i = 0; i < buckets.length; i++) {
      const bucket = buckets[i]
      if (bucket.length <= 1) continue

      // Find the color channel with the largest range
      let rMin = 255,
        rMax = 0,
        gMin = 255,
        gMax = 0,
        bMin = 255,
        bMax = 0

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
      const maxBucketRange = Math.max(rRange, gRange, bRange)

      if (maxBucketRange > maxRange) {
        maxRange = maxBucketRange
        bucketToSplit = i
      }
    }

    // If no bucket can be split further, break
    if (maxRange <= 0) break

    const bucket = buckets[bucketToSplit]

    // Determine which channel to split on
    let rMin = 255,
      rMax = 0,
      gMin = 255,
      gMax = 0,
      bMin = 255,
      bMax = 0

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

    // Sort the bucket by the selected channel
    bucket.sort((a, b) => a[sortChannel] - b[sortChannel])

    // Split the bucket in half
    const medianIndex = Math.floor(bucket.length / 2)
    const bucket1 = bucket.slice(0, medianIndex)
    const bucket2 = bucket.slice(medianIndex)

    // Replace the original bucket with the two new ones
    buckets.splice(bucketToSplit, 1, bucket1, bucket2)
  }

  // Calculate the average color for each bucket
  return buckets.map((bucket) => {
    if (bucket.length === 0) {
      return { r: 0, g: 0, b: 0 }
    }

    let rSum = 0,
      gSum = 0,
      bSum = 0

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

// K-Means Clustering algorithm
function kMeansClustering(pixels: RGB[], k: number): RGB[] {
  if (pixels.length === 0) return []
  if (k <= 0) return []

  // Initialize centroids randomly
  const centroids: RGB[] = []
  for (let i = 0; i < k; i++) {
    const randomIndex = Math.floor(Math.random() * pixels.length)
    centroids.push({ ...pixels[randomIndex] })
  }

  const maxIterations = 10
  let iterations = 0
  let changed = true

  // Assign pixels to clusters and update centroids
  while (changed && iterations < maxIterations) {
    // Assign each pixel to the nearest centroid
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

    // Update centroids
    changed = false
    for (let i = 0; i < k; i++) {
      const cluster = clusters[i]
      if (cluster.length === 0) continue

      let rSum = 0,
        gSum = 0,
        bSum = 0

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

      // Check if centroid changed
      if (newCentroid.r !== centroids[i].r || newCentroid.g !== centroids[i].g || newCentroid.b !== centroids[i].b) {
        centroids[i] = newCentroid
        changed = true
      }
    }

    iterations++
  }

  return centroids
}

// Octree Quantization (simplified version)
function octreeQuantization(pixels: RGB[], colorCount: number): RGB[] {
  // For simplicity, we'll use a hybrid approach for this demo
  // In a real implementation, this would be a full octree algorithm

  // First, reduce the color space to 5 bits per channel
  const reducedPixels = pixels.map((pixel) => ({
    r: Math.floor(pixel.r / 8) * 8,
    g: Math.floor(pixel.g / 8) * 8,
    b: Math.floor(pixel.b / 8) * 8,
  }))

  // Then count frequency of each color
  const colorMap = new Map<string, { color: RGB; count: number }>()

  for (const pixel of reducedPixels) {
    const key = `${pixel.r},${pixel.g},${pixel.b}`
    if (colorMap.has(key)) {
      colorMap.get(key)!.count++
    } else {
      colorMap.set(key, { color: pixel, count: 1 })
    }
  }

  // Sort by frequency
  const sortedColors = Array.from(colorMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, colorCount)
    .map((item) => item.color)

  // If we don't have enough colors, add some
  while (sortedColors.length < colorCount) {
    sortedColors.push({ r: 0, g: 0, b: 0 })
  }

  return sortedColors
}

// NeuQuant Neural Network Quantization (simplified version)
function neuQuantQuantization(pixels: RGB[], colorCount: number): RGB[] {
  // This is a simplified version for demonstration
  // A real implementation would use the full NeuQuant algorithm

  // For this demo, we'll use a combination of median cut and k-means
  const initialPalette = medianCut(pixels, colorCount)
  return kMeansClustering(pixels, colorCount)
}

// Calculate Euclidean distance between two colors
function colorDistance(color1: RGB, color2: RGB): number {
  const rDiff = color1.r - color2.r
  const gDiff = color1.g - color2.g
  const bDiff = color1.b - color2.b
  return rDiff * rDiff + gDiff * gDiff + bDiff * bDiff
}
