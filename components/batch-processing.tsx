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

  const downloadAllAsZip = () => {
    onLogEntry("Preparing batch download...", "BATCH")
    // In a real implementation, we would use JSZip to create a zip file
    // For now, we'll just download each image individually
    Object.entries(processedImages).forEach(([id, dataUrl]) => {
      const link = document.createElement("a")
      link.href = dataUrl
      link.download = `dithered_${id}.png`
      link.click()
    })
    onLogEntry("Batch download complete", "BATCH")
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
      <div className="border border-[#999999] bg-[#e8e8e8]">
        <div className="bg-[#d0d0d0] border-b border-[#999999] p-1">
          <div className="text-[12px] uppercase font-bold tracking-[1px]">Batch Processing Queue</div>
        </div>
        <div className="p-2">
          <div className="flex justify-between mb-2">
            <div className="text-[11px]">
              {batchImages.length} image{batchImages.length !== 1 ? "s" : ""} in queue
            </div>
            <div className="space-x-2">
              <button
                className="px-2 py-1 text-[11px] uppercase font-bold border border-[#999999] bg-[#3366cc] text-white hover:bg-[#4477dd] disabled:bg-[#999999]"
                onClick={handleProcessBatch}
                disabled={processing || batchImages.length === 0}
              >
                <Play className="h-3 w-3 inline-block mr-1" />
                Process All
              </button>
              <button
                className="px-2 py-1 text-[11px] uppercase font-bold border border-[#999999] bg-[#d8d8d8] hover:bg-[#e8e8e8] disabled:bg-[#999999]"
                onClick={downloadAllAsZip}
                disabled={Object.keys(processedImages).length === 0}
              >
                <Download className="h-3 w-3 inline-block mr-1" />
                Download All
              </button>
            </div>
          </div>

          {batchImages.length === 0 ? (
            <div className="border border-[#999999] p-4 text-center bg-[#f0f0f0]">
              <div className="text-[12px]">No images in batch queue</div>
              <div className="text-[11px] text-[#666666] mt-1">Add images to the batch queue from the main editor</div>
            </div>
          ) : (
            <table className="w-full border-collapse text-[11px]">
              <thead>
                <tr className="bg-[#d0d0d0]">
                  <th className="border border-[#999999] p-1 text-left">ID</th>
                  <th className="border border-[#999999] p-1 text-left">Preview</th>
                  <th className="border border-[#999999] p-1 text-left">Size</th>
                  <th className="border border-[#999999] p-1 text-left">Algorithm</th>
                  <th className="border border-[#999999] p-1 text-left">Palette</th>
                  <th className="border border-[#999999] p-1 text-left">Status</th>
                  <th className="border border-[#999999] p-1 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {batchImages.map((image, index) => (
                  <tr key={image.id} className={index % 2 === 0 ? "bg-[#f0f0f0]" : "bg-[#e8e8e8]"}>
                    <td className="border border-[#999999] p-1">
                      <div className="font-mono">{image.id.substring(0, 8)}</div>
                    </td>
                    <td className="border border-[#999999] p-1">
                      <div className="w-[60px] h-[40px] bg-[#d8d8d8] border border-[#999999] overflow-hidden flex items-center justify-center">
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
                    <td className="border border-[#999999] p-1">
                      {image.image.width} x {image.image.height}
                    </td>
                    <td className="border border-[#999999] p-1">{image.ditheringOptions.algorithm}</td>
                    <td className="border border-[#999999] p-1">{image.ditheringOptions.palette}</td>
                    <td className="border border-[#999999] p-1">
                      {image.status === "pending" && <span className="text-[#666666]">Pending</span>}
                      {image.status === "processing" && (
                        <span className="text-[#cc6600] bg-[#ffcc33] px-1 font-bold">PROCESSING</span>
                      )}
                      {image.status === "completed" && (
                        <span className="text-[#006600] bg-[#ccffcc] px-1 font-bold">
                          <Check className="h-3 w-3 inline-block mr-1" />
                          DONE
                        </span>
                      )}
                      {image.status === "error" && (
                        <span className="text-[#cc0000] bg-[#ffcccc] px-1 font-bold">
                          <X className="h-3 w-3 inline-block mr-1" />
                          ERROR
                        </span>
                      )}
                    </td>
                    <td className="border border-[#999999] p-1">
                      <div className="flex space-x-1">
                        <button
                          className="px-1 text-[10px] uppercase border border-[#999999] bg-[#d8d8d8] hover:bg-[#e8e8e8] disabled:bg-[#999999]"
                          onClick={() => downloadSingle(image.id)}
                          disabled={!processedImages[image.id]}
                          title="Download"
                        >
                          <Download className="h-3 w-3" />
                        </button>
                        <button
                          className="px-1 text-[10px] uppercase border border-[#999999] bg-[#ffcccc] hover:bg-[#ffdddd]"
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
