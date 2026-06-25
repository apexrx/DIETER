"use client"

import { useEffect, useRef, useState } from "react"
import type { ImageAdjustments, DitheringOptions, RGB } from "@/lib/types"

interface DitheringCanvasProps {
  originalImage: HTMLImageElement
  adjustments: ImageAdjustments
  ditheringOptions: DitheringOptions
  onProcessingChange?: (isProcessing: boolean) => void
  onLogEntry?: (message: string, type?: string) => void
  fullSize?: boolean
  customPalettes?: Record<string, RGB[]>
}

export default function DitheringCanvas({
  originalImage,
  adjustments,
  ditheringOptions,
  onProcessingChange,
  onLogEntry,
  fullSize = false,
  customPalettes,
}: DitheringCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const workerRef = useRef<Worker | null>(null)
  const reqIdRef = useRef(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })
  const [pixelZoom, setPixelZoom] = useState(false)
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 })

  // Setup worker once
  useEffect(() => {
    const worker = new Worker(new URL("../lib/processing-worker", import.meta.url))
    workerRef.current = worker
    worker.onerror = (err) => {
      if (onLogEntry) onLogEntry(`Worker load error: ${err.message}`, "ERROR")
    }
    return () => {
      worker.terminate()
      workerRef.current = null
    }
  }, [onLogEntry])

  // Process the image when inputs change
  useEffect(() => {
    if (!canvasRef.current || !originalImage) return

    const processImage = () => {
      setIsProcessing(true)
      if (onProcessingChange) onProcessingChange(true)
      if (onLogEntry) onLogEntry("Processing image...", "PROCESS")

      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext("2d", { willReadFrequently: true })
      if (!ctx) return

      let width = originalImage.width
      let height = originalImage.height

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

      canvas.width = width
      canvas.height = height
      setCanvasSize({ width, height })

      ctx.drawImage(originalImage, 0, 0, width, height)
      const imageData = ctx.getImageData(0, 0, width, height)

      const reqId = ++reqIdRef.current
      const worker = workerRef.current
      if (!worker) return

      // Serialize options for transfer to worker
      const ditherOpts = { ...ditheringOptions }
      if (customPalettes) ditherOpts.customPalettes = customPalettes
      const adj: Record<string, number | boolean> = {}
      for (const key of Object.keys(adjustments) as (keyof ImageAdjustments)[]) {
        const v = adjustments[key]
        if (typeof v === "number" || typeof v === "boolean") adj[key] = v
      }

      worker.onmessage = (e: MessageEvent) => {
        if (e.data.reqId !== reqIdRef.current) return
        if (e.data.error) {
          if (onLogEntry) onLogEntry(`Worker error: ${e.data.error}`, "ERROR")
          setIsProcessing(false)
          if (onProcessingChange) onProcessingChange(false)
          return
        }
        const result = e.data.imageData
        const imageDataResult = new ImageData(
          new Uint8ClampedArray(result.data),
          result.width,
          result.height,
        )
        ctx.putImageData(imageDataResult, 0, 0)
        if (onLogEntry) onLogEntry("Image processing complete", "PROCESS")
        setIsProcessing(false)
        if (onProcessingChange) onProcessingChange(false)
      }

      worker.postMessage(
        {
          reqId,
          imageData: { data: Array.from(imageData.data), width: imageData.width, height: imageData.height },
          adjustments: adj,
          ditheringOptions: ditherOpts,
        },
      )
    }

    let rafId: number
    const handle = setTimeout(() => { rafId = requestAnimationFrame(processImage) }, 100)
    return () => {
      clearTimeout(handle)
      if (rafId !== undefined) cancelAnimationFrame(rafId)
    }
  }, [originalImage, adjustments, ditheringOptions, fullSize, onProcessingChange, onLogEntry, customPalettes])

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = Math.round((e.clientX - rect.left) / rect.width * canvas.width)
    const y = Math.round((e.clientY - rect.top) / rect.height * canvas.height)
    setZoomPos({ x, y })
    setPixelZoom(!pixelZoom)
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <canvas
        id="dieter-canvas"
        ref={canvasRef}
          className={`max-w-full max-h-full ${isProcessing ? "opacity-50" : "opacity-100"} ${pixelZoom ? "cursor-crosshair" : "cursor-default"}`}
        onClick={handleCanvasClick}
      />
      {isProcessing && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="border border-border bg-accent px-2 py-1">
            <span className="text-[11px] uppercase font-bold animate-pulse">EXECUTING...</span>
          </div>
        </div>
      )}
      {pixelZoom && (
        <ZoomPreview
          sourceCanvas={canvasRef.current}
          zoomPos={zoomPos}
          canvasWidth={canvasSize.width}
        />
      )}
    </div>
  )
}

function ZoomPreview({
  sourceCanvas,
  zoomPos,
  canvasWidth,
}: {
  sourceCanvas: HTMLCanvasElement | null
  zoomPos: { x: number; y: number }
  canvasWidth: number
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const el = canvasRef.current
    const src = sourceCanvas
    if (!el || !src) return
    const ctx = el.getContext("2d")
    if (!ctx) return
    el.width = 128
    el.height = 128
    ctx.imageSmoothingEnabled = false
    const sx = Math.max(0, Math.min(zoomPos.x - 4, src.width - 8))
    const sy = Math.max(0, Math.min(zoomPos.y - 4, src.height - 8))
    ctx.drawImage(src, sx, sy, 8, 8, 0, 0, 128, 128)
  }, [sourceCanvas, zoomPos])

  return (
    <div
      className="absolute border-2 border-accent  z-10 bg-bg"
      style={{
        left: Math.min(zoomPos.x + 20, canvasWidth - 130),
        top: Math.max(zoomPos.y - 65, 10),
        width: 128,
        height: 128,
      }}
    >
      <canvas ref={canvasRef} className="w-full h-full" style={{ imageRendering: "pixelated" }} />
      <div className="absolute bottom-0 left-0 bg-accent text-[9px] px-1 font-bold">
        {zoomPos.x},{zoomPos.y}
      </div>
    </div>
  )
}
