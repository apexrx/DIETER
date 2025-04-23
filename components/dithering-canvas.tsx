"use client"

import { useEffect, useRef, useState } from "react"
import type { ImageAdjustments, DitheringOptions } from "@/lib/types"
import { applyDithering } from "@/lib/dithering"
import { applyAdjustments } from "@/lib/image-processing"

interface DitheringCanvasProps {
  originalImage: HTMLImageElement
  adjustments: ImageAdjustments
  ditheringOptions: DitheringOptions
  onProcessingChange?: (isProcessing: boolean) => void
  onLogEntry?: (message: string, type?: string) => void
  fullSize?: boolean
}

export default function DitheringCanvas({
  originalImage,
  adjustments,
  ditheringOptions,
  onProcessingChange,
  onLogEntry,
  fullSize = false,
}: DitheringCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })

  // Process the image when inputs change
  useEffect(() => {
    if (!canvasRef.current || !originalImage) return

    const processImage = async () => {
      setIsProcessing(true)
      if (onProcessingChange) onProcessingChange(true)
      if (onLogEntry) onLogEntry("Processing image...", "PROCESS")

      // Get the canvas context
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d", { willReadFrequently: true })
      if (!ctx) return

      // Calculate canvas size based on original image
      let width = originalImage.width
      let height = originalImage.height

      // Scale down large images for preview if not fullSize
      const maxDimension = fullSize ? 2000 : 800
      if (width > maxDimension || height > maxDimension) {
        const ratio = width / height
        if (width > height) {
          width = maxDimension
          height = Math.round(width / ratio)
        } else {
          height = maxDimension
          width = Math.round(height * ratio)
        }
      }

      // Set canvas size
      canvas.width = width
      canvas.height = height
      setCanvasSize({ width, height })

      if (onLogEntry) onLogEntry(`Canvas size set to ${width}x${height}px`, "PROCESS")

      // Draw the original image
      ctx.drawImage(originalImage, 0, 0, width, height)

      // Get image data
      let imageData = ctx.getImageData(0, 0, width, height)

      if (onLogEntry) onLogEntry("Applying pre-dithering adjustments...", "ADJUST")

      // Apply pre-dithering adjustments
      imageData = applyAdjustments(imageData, adjustments)

      if (onLogEntry) onLogEntry(`Applying dithering algorithm: ${ditheringOptions.algorithm}`, "DITHER")

      // Apply dithering
      imageData = applyDithering(imageData, ditheringOptions)

      // Put the processed image data back on the canvas
      ctx.putImageData(imageData, 0, 0)

      if (onLogEntry) onLogEntry("Image processing complete", "PROCESS")

      // Setup download button
      const downloadButton = document.getElementById("download-button") as HTMLButtonElement
      if (downloadButton) {
        downloadButton.onclick = () => {
          const link = document.createElement("a")
          link.download = "dithered-image.png"
          link.href = canvas.toDataURL("image/png")
          link.click()
          if (onLogEntry) onLogEntry("Image downloaded", "ACTION")
        }
      }

      setIsProcessing(false)
      if (onProcessingChange) onProcessingChange(false)
    }

    // Use requestAnimationFrame to avoid blocking the UI
    const timeoutId = setTimeout(() => {
      requestAnimationFrame(processImage)
    }, 100)

    return () => clearTimeout(timeoutId)
  }, [originalImage, adjustments, ditheringOptions, fullSize, onProcessingChange, onLogEntry])

  return (
    <div className="relative">
      <canvas ref={canvasRef} className={`max-w-full ${isProcessing ? "opacity-50" : "opacity-100"}`} />
      {isProcessing && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="border border-[#999999] bg-[#ffcc33] px-2 py-1">
            <span className="text-[11px] uppercase font-bold animate-pulse">EXECUTING...</span>
          </div>
        </div>
      )}
    </div>
  )
}
