import { applyAdjustments } from "./image-processing"
import { applyDithering } from "./dithering"

self.onmessage = (e: MessageEvent<{
  reqId: number
  imageData: { data: number[]; width: number; height: number }
  adjustments: Record<string, number | boolean>
  ditheringOptions: Record<string, string | number | Record<string, number[][]> | undefined>
}>) => {
  const { reqId, imageData, adjustments, ditheringOptions } = e.data

  try {
    const clamped = new Uint8ClampedArray(imageData.data)
    const imgData = new ImageData(clamped, imageData.width, imageData.height)

    let data = imgData

    if (Object.keys(adjustments).length > 0) {
      data = applyAdjustments(imgData, adjustments as any)
    }

    data = applyDithering(data, ditheringOptions as any)

    self.postMessage(
      { reqId, imageData: data },
      { transfer: [data.data.buffer] },
    )
  } catch (err) {
    self.postMessage({ reqId, error: (err as Error).message || String(err) })
  }
}
