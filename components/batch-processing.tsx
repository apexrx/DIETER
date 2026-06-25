"use client"

import { useState } from "react"
import { Download, Trash, Play, Check, X } from "lucide-react"
import type { BatchImage } from "@/lib/types"
import { applyDithering } from "@/lib/dithering"
import { applyAdjustments } from "@/lib/image-processing"

interface BatchProcessingProps {
  batchImages: BatchImage[]
  onRemoveImage: (id: string) => void
  onProcessBatch: () => void
  onLogEntry: (message: string, type?: string) => void
}

export default function BatchProcessing({
  batchImages,
  onRemoveImage,
  onProcessBatch,
  onLogEntry,
}: BatchProcessingProps) {
  const [processing, setProcessing] = useState(false)
  const [processedImages, setProcessedImages] = useState<Record<string, string>>({})

  const handleProcessBatch = async () => {
    if (processing || batchImages.length === 0) return

    setProcessing(true)
    onProcessBatch()

    const processed: Record<string, string> = {}

    for (let i = 0; i < batchImages.length; i++) {
      const batchImage = batchImages[i]

      // Skip already processed images
      if (batchImage.status === "completed") continue

      onLogEntry(`Processing batch image ${i + 1}/${batchImages.length}: ${batchImage.id}`, "BATCH")

      try {
        // Create a canvas to process the image
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d", { willReadFrequently: true })

        if (!ctx) {
          onLogEntry(`Failed to get canvas context for image ${batchImage.id}`, "ERROR")
          continue
        }

        // Set canvas dimensions
        canvas.width = batchImage.image.width
        canvas.height = batchImage.image.height

        // Draw the original image
        ctx.drawImage(batchImage.image, 0, 0)

        // Get image data
        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

        // Apply adjustments
        imageData = applyAdjustments(imageData, batchImage.adjustments)

        // Apply dithering
        imageData = applyDithering(imageData, batchImage.ditheringOptions)

        // Put processed data back on canvas
        ctx.putImageData(imageData, 0, 0)

        // Convert to data URL
        const dataUrl = canvas.toDataURL("image/png")
        processed[batchImage.id] = dataUrl

        // Update batch image status
        batchImage.status = "completed"

        onLogEntry(`Completed processing image ${batchImage.id}`, "BATCH")

        // Small delay to prevent UI freezing
        await new Promise((resolve) => setTimeout(resolve, 100))
      } catch (error) {
        onLogEntry(`Error processing image ${batchImage.id}: ${error}`, "ERROR")
        batchImage.status = "error"
      }
    }

    setProcessedImages(processed)
    setProcessing(false)
    onLogEntry(`Batch processing complete. Processed ${Object.keys(processed).length} images.`, "BATCH")
  }

  const downloadAllAsZip = async () => {
    onLogEntry("Preparing batch download as ZIP...", "BATCH")
    const JSZip = (await import("jszip")).default
    const zip = new JSZip()
    Object.entries(processedImages).forEach(([id, dataUrl]) => {
      zip.file(`dithered_${id}.png`, dataUrl.split(",")[1], { base64: true })
    })
    const blob = await zip.generateAsync({ type: "blob" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `dieter-batch-${Date.now()}.zip`
    link.click()
    URL.revokeObjectURL(link.href)
    onLogEntry(`Batch download complete: ${Object.keys(processedImages).length} images`, "BATCH")
  }

  const downloadSingle = (id: string) => {
    if (processedImages[id]) {
      const link = document.createElement("a")
      link.href = processedImages[id]
      link.download = `dithered_${id}.png`
      link.click()
      onLogEntry(`Downloaded image ${id}`, "BATCH")
    }
  }

  return (
    <div className="space-y-2">
      <div>
        <div className="flex justify-between mb-2 border-b border-border pb-1">
          <div className="text-[11px] uppercase font-bold tracking-[1px]">Batch Processing Queue</div>
          <div className="text-[11px] text-muted">
            {batchImages.length} image{batchImages.length !== 1 ? "s" : ""} in queue
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-end gap-2">
            <button
              className="px-2 py-1 text-[11px] uppercase font-bold bg-accent text-white hover:bg-accent-dim disabled:bg-disabled"
              onClick={handleProcessBatch}
              disabled={processing || batchImages.length === 0}
            >
              <Play className="h-3 w-3 inline-block mr-1" />
              Process All
            </button>
            <button
              className="px-2 py-1 text-[11px] uppercase font-bold bg-transparent hover:bg-surface disabled:bg-disabled"
              onClick={downloadAllAsZip}
              disabled={Object.keys(processedImages).length === 0}
            >
              <Download className="h-3 w-3 inline-block mr-1" />
              Download All
            </button>
          </div>

          {batchImages.length === 0 ? (
            <div className="p-4 text-center">
              <div className="text-[12px]">No images in batch queue</div>
              <div className="text-[11px] text-muted mt-1">Add images to the batch queue from the main editor</div>
            </div>
          ) : (
            <table className="w-full text-[11px] border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="p-1 text-left uppercase font-bold">ID</th>
                  <th className="p-1 text-left uppercase font-bold">Preview</th>
                  <th className="p-1 text-left uppercase font-bold">Size</th>
                  <th className="p-1 text-left uppercase font-bold">Algo</th>
                  <th className="p-1 text-left uppercase font-bold">Palette</th>
                  <th className="p-1 text-left uppercase font-bold">Status</th>
                  <th className="p-1 text-left uppercase font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {batchImages.map((image) => (
                  <tr key={image.id} className="border-b border-border">
                    <td className="p-1 font-mono">{image.id.substring(0, 8)}</td>
                    <td className="p-1">
                      <div className="w-[60px] h-[40px] bg-surface border border-border overflow-hidden flex items-center justify-center">
                        {processedImages[image.id] ? (
                          <img
                            src={processedImages[image.id] || "/placeholder.svg"}
                            alt="Processed"
                            className="max-w-full max-h-full"
                          />
                        ) : (
                          <img
                            src={image.image.src || "/placeholder.svg"}
                            alt="Original"
                            className="max-w-full max-h-full"
                          />
                        )}
                      </div>
                    </td>
                    <td className="p-1">
                      {image.image.width} x {image.image.height}
                    </td>
                    <td className="p-1">{image.ditheringOptions.algorithm}</td>
                    <td className="p-1">{image.ditheringOptions.palette}</td>
                    <td className="p-1">
                      {image.status === "pending" && <span className="text-muted">Pending</span>}
                      {image.status === "processing" && (
                        <span className="text-white bg-accent px-1 font-bold">PROCESSING</span>
                      )}
                      {image.status === "completed" && (
                        <span className="text-white bg-success px-1 font-bold">
                          <Check className="h-3 w-3 inline-block mr-1" />
                          DONE
                        </span>
                      )}
                      {image.status === "error" && (
                        <span className="text-white bg-accent px-1 font-bold">
                          <X className="h-3 w-3 inline-block mr-1" />
                          ERROR
                        </span>
                      )}
                    </td>
                    <td className="p-1">
                      <div className="flex gap-1">
                        <button
                          className="px-1 text-[10px] uppercase bg-transparent hover:bg-surface"
                          onClick={() => downloadSingle(image.id)}
                          disabled={!processedImages[image.id]}
                          title="Download"
                        >
                          <Download className="h-3 w-3" />
                        </button>
                        <button
                          className="px-1 text-[10px] uppercase bg-transparent text-accent hover:bg-accent hover:text-white"
                          onClick={() => onRemoveImage(image.id)}
                          title="Remove"
                        >
                          <Trash className="h-3 w-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
