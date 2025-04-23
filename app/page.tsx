"use client"

import { useCallback, useEffect, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Upload, Info, Zap, Plus } from "lucide-react"
import ImageUploader from "@/components/image-uploader"
import DitheringCanvas from "@/components/dithering-canvas"
import BatchProcessing from "@/components/batch-processing"
import PaletteEditor from "@/components/palette-editor"
import Histogram from "@/components/histogram"
import ProcessingLog from "@/components/processing-log"
import AboutDialog from "@/components/about-dialog"
import HelpPage from "@/components/help-page"
import type { ImageAdjustments, DitheringOptions, LogEntry, BatchImage, RGB } from "@/lib/types"

export default function DieterApp() {
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeTab, setActiveTab] = useState("main")
  const [showHistogram, setShowHistogram] = useState(false)
  const [logEntries, setLogEntries] = useState<LogEntry[]>([])
  const [batchImages, setBatchImages] = useState<BatchImage[]>([])
  const [customPalettes, setCustomPalettes] = useState<Record<string, RGB[]>>({})
  const [activePalette, setActivePalette] = useState<RGB[]>([])
  const [showAboutDialog, setShowAboutDialog] = useState(false)
  const [showHelpPage, setShowHelpPage] = useState(false)

  // Image adjustment states
  const [adjustments, setAdjustments] = useState<ImageAdjustments>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    grayscale: false,
    invert: false,
    blur: 0,
    posterize: 0,
  })

  // Dithering options states
  const [ditheringOptions, setDitheringOptions] = useState<DitheringOptions>({
    algorithm: "floydSteinberg",
    palette: "bw",
    threshold: 128,
    diffusionStrength: 1,
    ditherScale: 1,
    colorQuantization: "none",
    colorCount: 8,
  })

  // Add log entry
  const addLogEntry = useCallback((message: string, type = "INFO") => {
    const now = new Date()
    const timestamp = `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}.${now
      .getMilliseconds()
      .toString()
      .padStart(3, "0")}`

    setLogEntries((prev) => [
      { timestamp, type, message },
      ...prev.slice(0, 99), // Keep only the last 100 entries
    ])
  }, [])

  // Handle image upload
  const handleImageUpload = useCallback(
    (image: HTMLImageElement) => {
      setOriginalImage(image)
      addLogEntry(`Image loaded: ${image.width}x${image.height}px`, "INIT")
    },
    [addLogEntry],
  )

  // Handle adjustment changes
  const handleAdjustmentChange = useCallback(
    (key: keyof ImageAdjustments, value: number | boolean) => {
      setAdjustments((prev) => ({ ...prev, [key]: value }))
      addLogEntry(`Adjustment changed: ${key} = ${value}`, "ADJUST")
    },
    [addLogEntry],
  )

  // Handle dithering option changes
  const handleDitheringOptionChange = useCallback(
    (key: keyof DitheringOptions, value: string | number) => {
      setDitheringOptions((prev) => ({ ...prev, [key]: value }))
      addLogEntry(`Dithering option changed: ${key} = ${value}`, "CONFIG")
    },
    [addLogEntry],
  )

  // Add image to batch
  const addToBatch = useCallback(() => {
    if (!originalImage) return

    const newBatchImage: BatchImage = {
      id: Date.now().toString(),
      image: originalImage,
      adjustments: { ...adjustments },
      ditheringOptions: { ...ditheringOptions },
      status: "pending",
    }

    setBatchImages((prev) => [...prev, newBatchImage])
    addLogEntry(`Added image to batch queue: ${originalImage.width}x${originalImage.height}px`, "BATCH")
  }, [originalImage, adjustments, ditheringOptions, addLogEntry])

  // Remove image from batch
  const removeFromBatch = useCallback(
    (id: string) => {
      setBatchImages((prev) => prev.filter((img) => img.id !== id))
      addLogEntry(`Removed image from batch queue: ID ${id}`, "BATCH")
    },
    [addLogEntry],
  )

  // Process batch
  const processBatch = useCallback(() => {
    addLogEntry(`Starting batch processing of ${batchImages.length} images`, "BATCH")
    // Processing logic will be in the BatchProcessing component
  }, [batchImages.length, addLogEntry])

  // Save custom palette
  const saveCustomPalette = useCallback(
    (name: string, colors: RGB[]) => {
      setCustomPalettes((prev) => ({
        ...prev,
        [name]: colors,
      }))
      addLogEntry(`Saved custom palette: ${name} with ${colors.length} colors`, "PALETTE")
    },
    [addLogEntry],
  )

  // Initialize with a log entry
  useEffect(() => {
    addLogEntry("DIETER v1.0 initialized", "INIT")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // F1 key for help
      if (e.key === "F1") {
        e.preventDefault()
        setShowHelpPage(true)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <div className="min-h-screen bg-[#f0f0f0] text-[#333333] font-['Tahoma',sans-serif] text-[13px]">
      <header className="border-b border-[#999999] bg-[#d8d8d8] sticky top-0 z-10">
        <div className="max-w-[1024px] mx-auto px-2 py-1 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-[#cc0000]" />
            <h1 className="text-[16px] font-bold uppercase tracking-[1px]">DIETER v1.0</h1>
            <span className="text-[11px] bg-[#ffcc00] px-1 border border-[#999999]">BETA</span>
          </div>
          <div className="text-[11px] text-[#666666] uppercase tracking-[1px]">Advanced Image Dithering Tool</div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-[1024px] mx-auto flex border-t border-[#999999]">
          <button
            className={`px-3 py-1 text-[12px] uppercase border-r border-[#999999] ${activeTab === "main" ? "bg-[#e8e8e8] font-bold" : "bg-[#d0d0d0]"}`}
            onClick={() => setActiveTab("main")}
          >
            Main Editor
          </button>
          <button
            className={`px-3 py-1 text-[12px] uppercase border-r border-[#999999] ${activeTab === "batch" ? "bg-[#e8e8e8] font-bold" : "bg-[#d0d0d0]"}`}
            onClick={() => setActiveTab("batch")}
          >
            Batch Processing
          </button>
          <button
            className={`px-3 py-1 text-[12px] uppercase border-r border-[#999999] ${activeTab === "palette" ? "bg-[#e8e8e8] font-bold" : "bg-[#d0d0d0]"}`}
            onClick={() => setActiveTab("palette")}
          >
            Palette Editor
          </button>
          <button
            className={`px-3 py-1 text-[12px] uppercase border-r border-[#999999] ${activeTab === "log" ? "bg-[#e8e8e8] font-bold" : "bg-[#d0d0d0]"}`}
            onClick={() => setActiveTab("log")}
          >
            Processing Log
          </button>
        </div>
      </header>

      <main className="max-w-[1024px] mx-auto px-2 py-2">
        {activeTab === "main" && (
          <>
            {!originalImage ? (
              <ImageUploader onImageUpload={handleImageUpload} />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-2">
                {/* Left Panel - Controls */}
                <div className="lg:col-span-4 space-y-2">
                  <div className="border border-[#999999] bg-[#e8e8e8]">
                    <div className="bg-[#d0d0d0] border-b border-[#999999] p-1">
                      <div className="text-[12px] uppercase font-bold tracking-[1px]">Pre-Dithering Adjustments</div>
                    </div>
                    <div className="p-2 space-y-3">
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <label htmlFor="brightness" className="text-[11px] uppercase font-bold">
                            Brightness
                          </label>
                          <span className="text-[11px] font-bold">{adjustments.brightness}%</span>
                        </div>
                        <div className="win7-slider-container">
                          <div className="win7-slider-track"></div>
                          <input
                            type="range"
                            id="brightness"
                            min={0}
                            max={200}
                            step={1}
                            value={adjustments.brightness}
                            onChange={(e) => handleAdjustmentChange("brightness", Number(e.target.value))}
                            className="win7-slider"
                          />
                          <div className="win7-slider-ticks">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <div key={i} className="win7-slider-tick"></div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <label htmlFor="contrast" className="text-[11px] uppercase font-bold">
                            Contrast
                          </label>
                          <span className="text-[11px] font-bold">{adjustments.contrast}%</span>
                        </div>
                        <div className="win7-slider-container">
                          <div className="win7-slider-track"></div>
                          <input
                            type="range"
                            id="contrast"
                            min={0}
                            max={200}
                            step={1}
                            value={adjustments.contrast}
                            onChange={(e) => handleAdjustmentChange("contrast", Number(e.target.value))}
                            className="win7-slider"
                          />
                          <div className="win7-slider-ticks">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <div key={i} className="win7-slider-tick"></div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <label htmlFor="saturation" className="text-[11px] uppercase font-bold">
                            Saturation
                          </label>
                          <span className="text-[11px] font-bold">{adjustments.saturation}%</span>
                        </div>
                        <div className="win7-slider-container">
                          <div className="win7-slider-track"></div>
                          <input
                            type="range"
                            id="saturation"
                            min={0}
                            max={200}
                            step={1}
                            value={adjustments.saturation}
                            onChange={(e) => handleAdjustmentChange("saturation", Number(e.target.value))}
                            className="win7-slider"
                          />
                          <div className="win7-slider-ticks">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <div key={i} className="win7-slider-tick"></div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <label htmlFor="blur" className="text-[11px] uppercase font-bold">
                            Blur/Sharpen
                          </label>
                          <span className="text-[11px] font-bold">
                            {adjustments.blur < 0
                              ? `Sharpen ${Math.abs(adjustments.blur)}`
                              : adjustments.blur > 0
                                ? `Blur ${adjustments.blur}`
                                : "Normal"}
                          </span>
                        </div>
                        <div className="win7-slider-container">
                          <div className="win7-slider-track"></div>
                          <input
                            type="range"
                            id="blur"
                            min={-10}
                            max={10}
                            step={0.5}
                            value={adjustments.blur}
                            onChange={(e) => handleAdjustmentChange("blur", Number(e.target.value))}
                            className="win7-slider"
                          />
                          <div className="win7-slider-ticks">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <div key={i} className="win7-slider-tick"></div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <label htmlFor="posterize" className="text-[11px] uppercase font-bold">
                            Posterize
                          </label>
                          <span className="text-[11px] font-bold">
                            {adjustments.posterize === 0 ? "Off" : `${adjustments.posterize} levels`}
                          </span>
                        </div>
                        <div className="win7-slider-container">
                          <div className="win7-slider-track"></div>
                          <input
                            type="range"
                            id="posterize"
                            min={0}
                            max={8}
                            step={1}
                            value={adjustments.posterize}
                            onChange={(e) => handleAdjustmentChange("posterize", Number(e.target.value))}
                            className="win7-slider"
                          />
                          <div className="win7-slider-ticks">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <div key={i} className="win7-slider-tick"></div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <hr className="border-t border-[#999999] my-2" />

                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center justify-between border border-[#999999] p-1 bg-[#d8d8d8]">
                          <label htmlFor="grayscale" className="text-[11px] uppercase font-bold">
                            Grayscale
                          </label>
                          <label className="win7-toggle">
                            <input
                              type="checkbox"
                              id="grayscale"
                              checked={adjustments.grayscale}
                              onChange={(e) => handleAdjustmentChange("grayscale", e.target.checked)}
                            />
                            <span className="win7-toggle-slider"></span>
                          </label>
                        </div>

                        <div className="flex items-center justify-between border border-[#999999] p-1 bg-[#d8d8d8]">
                          <label htmlFor="invert" className="text-[11px] uppercase font-bold">
                            Invert
                          </label>
                          <label className="win7-toggle">
                            <input
                              type="checkbox"
                              id="invert"
                              checked={adjustments.invert}
                              onChange={(e) => handleAdjustmentChange("invert", e.target.checked)}
                            />
                            <span className="win7-toggle-slider"></span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border border-[#999999] bg-[#e8e8e8]">
                    <div className="bg-[#d0d0d0] border-b border-[#999999] p-1">
                      <div className="text-[12px] uppercase font-bold tracking-[1px]">Dithering Options</div>
                    </div>
                    <div className="p-2 space-y-3">
                      <div className="space-y-1">
                        <label htmlFor="algorithm" className="text-[11px] uppercase font-bold">
                          Algorithm
                        </label>
                        <Select
                          value={ditheringOptions.algorithm}
                          onValueChange={(value) => handleDitheringOptionChange("algorithm", value)}
                        >
                          <SelectTrigger
                            id="algorithm"
                            className="h-[22px] rounded-none border-[#999999] bg-[#f0f0f0] text-[11px]"
                          >
                            <SelectValue placeholder="Select algorithm" />
                          </SelectTrigger>
                          <SelectContent className="rounded-none border-[#999999]">
                            <SelectItem value="floydSteinberg" className="text-[11px]">
                              Floyd-Steinberg
                            </SelectItem>
                            <SelectItem value="atkinson" className="text-[11px]">
                              Atkinson
                            </SelectItem>
                            <SelectItem value="jarvis" className="text-[11px]">
                              Jarvis-Judice-Ninke
                            </SelectItem>
                            <SelectItem value="stucki" className="text-[11px]">
                              Stucki
                            </SelectItem>
                            <SelectItem value="burkes" className="text-[11px]">
                              Burkes
                            </SelectItem>
                            <SelectItem value="sierra" className="text-[11px]">
                              Sierra
                            </SelectItem>
                            <SelectItem value="sierra2" className="text-[11px]">
                              Sierra-2
                            </SelectItem>
                            <SelectItem value="sierraLite" className="text-[11px]">
                              Sierra-Lite
                            </SelectItem>
                            <SelectItem value="bayer2x2" className="text-[11px]">
                              Bayer 2x2
                            </SelectItem>
                            <SelectItem value="bayer4x4" className="text-[11px]">
                              Bayer 4x4
                            </SelectItem>
                            <SelectItem value="bayer8x8" className="text-[11px]">
                              Bayer 8x8
                            </SelectItem>
                            <SelectItem value="clusteredDot" className="text-[11px]">
                              Clustered Dot
                            </SelectItem>
                            <SelectItem value="halftone" className="text-[11px]">
                              Halftone
                            </SelectItem>
                            <SelectItem value="random" className="text-[11px]">
                              Random
                            </SelectItem>
                            <SelectItem value="threshold" className="text-[11px]">
                              Simple Threshold
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1">
                        <label htmlFor="palette" className="text-[11px] uppercase font-bold">
                          Color Palette
                        </label>
                        <Select
                          value={ditheringOptions.palette}
                          onValueChange={(value) => handleDitheringOptionChange("palette", value)}
                        >
                          <SelectTrigger
                            id="palette"
                            className="h-[22px] rounded-none border-[#999999] bg-[#f0f0f0] text-[11px]"
                          >
                            <SelectValue placeholder="Select palette" />
                          </SelectTrigger>
                          <SelectContent className="rounded-none border-[#999999]">
                            <SelectItem value="bw" className="text-[11px]">
                              Black & White
                            </SelectItem>
                            <SelectItem value="grayscale4" className="text-[11px]">
                              Grayscale (4 levels)
                            </SelectItem>
                            <SelectItem value="grayscale8" className="text-[11px]">
                              Grayscale (8 levels)
                            </SelectItem>
                            <SelectItem value="gameboy" className="text-[11px]">
                              Game Boy
                            </SelectItem>
                            <SelectItem value="cga" className="text-[11px]">
                              CGA
                            </SelectItem>
                            <SelectItem value="ega" className="text-[11px]">
                              EGA (16 colors)
                            </SelectItem>
                            <SelectItem value="c64" className="text-[11px]">
                              Commodore 64
                            </SelectItem>
                            <SelectItem value="apple2" className="text-[11px]">
                              Apple II
                            </SelectItem>
                            <SelectItem value="zxspectrum" className="text-[11px]">
                              ZX Spectrum
                            </SelectItem>
                            {/* Custom palettes */}
                            {Object.keys(customPalettes).map((name) => (
                              <SelectItem key={name} value={`custom_${name}`} className="text-[11px]">
                                Custom: {name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1 mt-3">
                        <label htmlFor="colorQuantization" className="text-[11px] uppercase font-bold">
                          Color Quantization
                        </label>
                        <Select
                          value={ditheringOptions.colorQuantization || "none"}
                          onValueChange={(value) => handleDitheringOptionChange("colorQuantization", value)}
                        >
                          <SelectTrigger
                            id="colorQuantization"
                            className="h-[22px] rounded-none border-[#999999] bg-[#f0f0f0] text-[11px]"
                          >
                            <SelectValue placeholder="Select quantization method" />
                          </SelectTrigger>
                          <SelectContent className="rounded-none border-[#999999]">
                            <SelectItem value="none" className="text-[11px]">
                              None (Use Palette As Is)
                            </SelectItem>
                            <SelectItem value="medianCut" className="text-[11px]">
                              Median Cut
                            </SelectItem>
                            <SelectItem value="kMeans" className="text-[11px]">
                              K-Means Clustering
                            </SelectItem>
                            <SelectItem value="octree" className="text-[11px]">
                              Octree
                            </SelectItem>
                            <SelectItem value="neuQuant" className="text-[11px]">
                              NeuQuant (Neural Network)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1 mt-2">
                        <div className="flex justify-between">
                          <label htmlFor="colorCount" className="text-[11px] uppercase font-bold">
                            Color Count
                          </label>
                          <span className="text-[11px] font-bold">{ditheringOptions.colorCount || 8} colors</span>
                        </div>
                        <div className="win7-slider-container">
                          <div className="win7-slider-track"></div>
                          <input
                            type="range"
                            id="colorCount"
                            min={2}
                            max={256}
                            step={1}
                            value={ditheringOptions.colorCount || 8}
                            onChange={(e) => handleDitheringOptionChange("colorCount", Number(e.target.value))}
                            className="win7-slider"
                            disabled={
                              ditheringOptions.colorQuantization === "none" || !ditheringOptions.colorQuantization
                            }
                          />
                          <div className="win7-slider-ticks">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <div key={i} className="win7-slider-tick"></div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <label htmlFor="threshold" className="text-[11px] uppercase font-bold">
                            Threshold
                          </label>
                          <span className="text-[11px] font-bold">{ditheringOptions.threshold}</span>
                        </div>
                        <div className="win7-slider-container">
                          <div className="win7-slider-track"></div>
                          <input
                            type="range"
                            id="threshold"
                            min={0}
                            max={255}
                            step={1}
                            value={ditheringOptions.threshold}
                            onChange={(e) => handleDitheringOptionChange("threshold", Number(e.target.value))}
                            className="win7-slider"
                          />
                          <div className="win7-slider-ticks">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <div key={i} className="win7-slider-tick"></div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-1">
                            <label htmlFor="diffusionStrength" className="text-[11px] uppercase font-bold">
                              Error Diffusion
                            </label>
                            <div className="relative group">
                              <Info className="h-3 w-3 text-[#666666]" />
                              <div className="absolute hidden group-hover:block bg-[#ffffcc] border border-[#999999] p-1 text-[10px] w-[150px] z-10">
                                Controls how strongly errors are diffused to neighboring pixels
                              </div>
                            </div>
                          </div>
                          <span className="text-[11px] font-bold">
                            {ditheringOptions.diffusionStrength.toFixed(1)}x
                          </span>
                        </div>
                        <div className="win7-slider-container">
                          <div className="win7-slider-track"></div>
                          <input
                            type="range"
                            id="diffusionStrength"
                            min={0}
                            max={2}
                            step={0.1}
                            value={ditheringOptions.diffusionStrength}
                            onChange={(e) => handleDitheringOptionChange("diffusionStrength", Number(e.target.value))}
                            className="win7-slider"
                          />
                          <div className="win7-slider-ticks">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <div key={i} className="win7-slider-tick"></div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-1">
                            <label htmlFor="ditherScale" className="text-[11px] uppercase font-bold">
                              Dither Scale
                            </label>
                            <div className="relative group">
                              <Info className="h-3 w-3 text-[#666666]" />
                              <div className="absolute hidden group-hover:block bg-[#ffffcc] border border-[#999999] p-1 text-[10px] w-[150px] z-10">
                                Controls the scale of the dithering pattern relative to the image
                              </div>
                            </div>
                          </div>
                          <span className="text-[11px] font-bold">{ditheringOptions.ditherScale.toFixed(1)}x</span>
                        </div>
                        <div className="win7-slider-container">
                          <div className="win7-slider-track"></div>
                          <input
                            type="range"
                            id="ditherScale"
                            min={0.5}
                            max={4}
                            step={0.1}
                            value={ditheringOptions.ditherScale}
                            onChange={(e) => handleDitheringOptionChange("ditherScale", Number(e.target.value))}
                            className="win7-slider"
                          />
                          <div className="win7-slider-ticks">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <div key={i} className="win7-slider-tick"></div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <hr className="border-t border-[#999999] my-2" />

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          className="px-2 py-1 text-[11px] uppercase font-bold border border-[#999999] bg-[#d8d8d8] hover:bg-[#e8e8e8]"
                          onClick={() => {
                            setOriginalImage(null)
                            addLogEntry("Reset image", "ACTION")
                          }}
                        >
                          <Upload className="h-3 w-3 inline-block mr-1" />
                          New Image
                        </button>

                        <button
                          id="download-button"
                          className="px-2 py-1 text-[11px] uppercase font-bold border border-[#999999] bg-[#3366cc] text-white hover:bg-[#4477dd]"
                          disabled={isProcessing}
                        >
                          <Download className="h-3 w-3 inline-block mr-1" />
                          Download
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          className="px-2 py-1 text-[11px] uppercase font-bold border border-[#999999] bg-[#d8d8d8] hover:bg-[#e8e8e8]"
                          onClick={() => setShowHistogram(!showHistogram)}
                        >
                          {showHistogram ? "Hide Histogram" : "Show Histogram"}
                        </button>

                        <button
                          className="px-2 py-1 text-[11px] uppercase font-bold border border-[#999999] bg-[#ffcc33] hover:bg-[#ffdd44]"
                          onClick={addToBatch}
                        >
                          <Plus className="h-3 w-3 inline-block mr-1" />
                          Add to Batch
                        </button>
                      </div>

                      {isProcessing && (
                        <div className="border border-[#999999] bg-[#ffcc33] p-1 text-center">
                          <span className="text-[11px] uppercase font-bold animate-pulse">EXECUTING...</span>
                        </div>
                      )}

                      <div className="border border-[#999999] p-1 text-[11px] bg-[#f0f0f0]">
                        <div className="flex justify-between">
                          <span className="uppercase font-bold">Image Size:</span>
                          <span>
                            {originalImage?.width || 0} x {originalImage?.height || 0}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="uppercase font-bold">Status:</span>
                          <span>{isProcessing ? "Processing" : "Ready"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Panel - Image Previews */}
                <div className="lg:col-span-8">
                  <div className="border border-[#999999] bg-[#e8e8e8]">
                    <div className="bg-[#d0d0d0] border-b border-[#999999] p-1">
                      <div className="text-[12px] uppercase font-bold tracking-[1px]">Image Preview</div>
                    </div>
                    <div className="p-2">
                      <Tabs defaultValue="sideBySide" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 mb-2 h-[22px] rounded-none bg-[#d0d0d0] p-0">
                          <TabsTrigger
                            value="sideBySide"
                            className="rounded-none text-[11px] uppercase font-bold data-[state=active]:bg-[#3366cc] data-[state=active]:text-white"
                          >
                            Side by Side
                          </TabsTrigger>
                          <TabsTrigger
                            value="original"
                            className="rounded-none text-[11px] uppercase font-bold data-[state=active]:bg-[#3366cc] data-[state=active]:text-white"
                          >
                            Original
                          </TabsTrigger>
                          <TabsTrigger
                            value="dithered"
                            className="rounded-none text-[11px] uppercase font-bold data-[state=active]:bg-[#3366cc] data-[state=active]:text-white"
                          >
                            Dithered
                          </TabsTrigger>
                        </TabsList>

                        {showHistogram && originalImage && (
                          <div className="mb-2 border border-[#999999] p-1 bg-[#f0f0f0]">
                            <Histogram image={originalImage} />
                          </div>
                        )}

                        <TabsContent value="sideBySide" className="mt-0">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div className="border border-[#999999] p-1 bg-[#f0f0f0]">
                              <div className="text-[11px] font-bold uppercase mb-1 text-center bg-[#d0d0d0] border border-[#999999] py-1">
                                Original
                              </div>
                              <div className="overflow-auto max-h-[60vh] flex items-center justify-center">
                                {originalImage && (
                                  <img
                                    src={originalImage.src || "/placeholder.svg"}
                                    alt="Original"
                                    className="max-w-full object-contain"
                                  />
                                )}
                              </div>
                            </div>
                            <div className="border border-[#999999] p-1 bg-[#f0f0f0]">
                              <div className="text-[11px] font-bold uppercase mb-1 text-center bg-[#d0d0d0] border border-[#999999] py-1">
                                Dithered
                              </div>
                              <div className="overflow-auto max-h-[60vh] flex items-center justify-center">
                                {originalImage && (
                                  <DitheringCanvas
                                    originalImage={originalImage}
                                    adjustments={adjustments}
                                    ditheringOptions={ditheringOptions}
                                    onProcessingChange={setIsProcessing}
                                    onLogEntry={addLogEntry}
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                        <TabsContent value="original" className="mt-0">
                          <div className="border border-[#999999] p-1 bg-[#f0f0f0]">
                            <div className="overflow-auto max-h-[70vh] flex items-center justify-center">
                              {originalImage && (
                                <img
                                  src={originalImage.src || "/placeholder.svg"}
                                  alt="Original"
                                  className="max-w-full object-contain"
                                />
                              )}
                            </div>
                          </div>
                        </TabsContent>
                        <TabsContent value="dithered" className="mt-0">
                          <div className="border border-[#999999] p-1 bg-[#f0f0f0]">
                            <div className="overflow-auto max-h-[70vh] flex items-center justify-center">
                              {originalImage && (
                                <DitheringCanvas
                                  originalImage={originalImage}
                                  adjustments={adjustments}
                                  ditheringOptions={ditheringOptions}
                                  onProcessingChange={setIsProcessing}
                                  onLogEntry={addLogEntry}
                                  fullSize
                                />
                              )}
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === "batch" && (
          <BatchProcessing
            batchImages={batchImages}
            onRemoveImage={removeFromBatch}
            onProcessBatch={processBatch}
            onLogEntry={addLogEntry}
          />
        )}

        {activeTab === "palette" && (
          <PaletteEditor onSavePalette={saveCustomPalette} existingPalettes={customPalettes} onLogEntry={addLogEntry} />
        )}

        {activeTab === "log" && <ProcessingLog entries={logEntries} />}
      </main>

      <footer className="border-t border-[#999999] mt-2 py-1 text-center text-[11px] bg-[#d8d8d8]">
        <div className="max-w-[1024px] mx-auto">
          DIETER v1.0 | Advanced Image Dithering Tool | © {new Date().getFullYear()} |
          <span className="text-[#3366cc] ml-1 cursor-pointer hover:underline" onClick={() => setShowHelpPage(true)}>
            Help
          </span>{" "}
          |
          <span className="text-[#3366cc] ml-1 cursor-pointer hover:underline" onClick={() => setShowAboutDialog(true)}>
            About
          </span>
        </div>
      </footer>

      {/* About Dialog */}
      <AboutDialog isOpen={showAboutDialog} onClose={() => setShowAboutDialog(false)} />

      {/* Help Page */}
      <HelpPage isOpen={showHelpPage} onClose={() => setShowHelpPage(false)} />
    </div>
  )
}
