"use client"

import { useEffect, useRef } from "react"

interface HistogramProps {
  image: HTMLImageElement
}

export default function Histogram({ image }: HistogramProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || !image) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Create a temporary canvas to get image data
    const tempCanvas = document.createElement("canvas")
    const tempCtx = tempCanvas.getContext("2d", { willReadFrequently: true })
    if (!tempCtx) return

    // Set dimensions and draw image
    tempCanvas.width = image.width
    tempCanvas.height = image.height
    tempCtx.drawImage(image, 0, 0)

    // Get image data
    const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height)
    const data = imageData.data

    // Initialize histogram arrays
    const histogramR = new Array(256).fill(0)
    const histogramG = new Array(256).fill(0)
    const histogramB = new Array(256).fill(0)
    const histogramL = new Array(256).fill(0) // Luminance

    // Calculate histograms
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]

      histogramR[r]++
      histogramG[g]++
      histogramB[b]++

      // Calculate luminance (perceptual weights)
      const l = Math.round(0.2989 * r + 0.587 * g + 0.114 * b)
      histogramL[l]++
    }

    // Find max value for scaling
    const maxR = Math.max(...histogramR)
    const maxG = Math.max(...histogramG)
    const maxB = Math.max(...histogramB)
    const maxL = Math.max(...histogramL)
    const maxValue = Math.max(maxR, maxG, maxB, maxL)

    // Set canvas dimensions
    canvas.width = 256
    canvas.height = 100

    // Dark scope background
    ctx.fillStyle = "#1a1a1a"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const barWidth = 1
    const maxBarHeight = canvas.height - 2

    const drawBars = (histogram: number[], color: string, offset = 0) => {
      ctx.fillStyle = color
      for (let i = 0; i < 256; i++) {
        const h = (histogram[i] / maxValue) * maxBarHeight
        if (h > 0.5) {
          ctx.fillRect(i * barWidth + offset, canvas.height - h, barWidth, h)
        }
      }
    }

    drawBars(histogramR, "#ff5c00", 0)
    drawBars(histogramG, "#ff5c00", 0)
    drawBars(histogramB, "#ff5c00", 0)
    drawBars(histogramL, "#ff5c00", 0)

    // Luminance outline (brighter)
    ctx.strokeStyle = "#ff8833"
    ctx.lineWidth = 1
    ctx.beginPath()
    for (let i = 0; i < 256; i++) {
      const h = (histogramL[i] / maxValue) * maxBarHeight
      if (i === 0) ctx.moveTo(i, canvas.height - h)
      else ctx.lineTo(i, canvas.height - h)
    }
    ctx.stroke()
  }, [image])

  return (
    <div className="w-full">
      <canvas ref={canvasRef} className="w-full h-[100px]"></canvas>
    </div>
  )
}
