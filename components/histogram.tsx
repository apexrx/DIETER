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

      // Calculate luminance (simple average for speed)
      const l = Math.round((r + g + b) / 3)
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

    // Clear canvas
    ctx.fillStyle = "#f0f0f0"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw grid lines
    ctx.strokeStyle = "#cccccc"
    ctx.beginPath()
    for (let i = 0; i < 256; i += 32) {
      ctx.moveTo(i, 0)
      ctx.lineTo(i, canvas.height)
    }
    for (let i = 0; i < canvas.height; i += 25) {
      ctx.moveTo(0, i)
      ctx.lineTo(canvas.width, i)
    }
    ctx.stroke()

    // Draw border
    ctx.strokeStyle = "#999999"
    ctx.strokeRect(0, 0, canvas.width, canvas.height)

    // Draw histograms
    const drawHistogram = (histogram: number[], color: string) => {
      ctx.strokeStyle = color
      ctx.beginPath()

      for (let i = 0; i < 256; i++) {
        const h = (histogram[i] / maxValue) * canvas.height

        if (i === 0) {
          ctx.moveTo(i, canvas.height - h)
        } else {
          ctx.lineTo(i, canvas.height - h)
        }
      }

      ctx.stroke()
    }

    // Draw luminance histogram first (as background)
    drawHistogram(histogramL, "#333333")

    // Draw RGB histograms
    drawHistogram(histogramR, "#cc0000")
    drawHistogram(histogramG, "#00cc00")
    drawHistogram(histogramB, "#0000cc")

    // Draw legend
    ctx.fillStyle = "#333333"
    ctx.fillRect(5, 5, 10, 5)
    ctx.fillStyle = "#cc0000"
    ctx.fillRect(50, 5, 10, 5)
    ctx.fillStyle = "#00cc00"
    ctx.fillRect(95, 5, 10, 5)
    ctx.fillStyle = "#0000cc"
    ctx.fillRect(140, 5, 10, 5)

    ctx.fillStyle = "#333333"
    ctx.font = "8px monospace"
    ctx.fillText("Lum", 17, 10)
    ctx.fillText("R", 62, 10)
    ctx.fillText("G", 107, 10)
    ctx.fillText("B", 152, 10)
  }, [image])

  return (
    <div className="w-full">
      <div className="text-[11px] font-bold uppercase mb-1 text-center bg-[#d0d0d0] border border-[#999999] py-1">
        Histogram
      </div>
      <canvas ref={canvasRef} className="w-full h-[100px] bg-[#f0f0f0] border border-[#999999]"></canvas>
    </div>
  )
}
