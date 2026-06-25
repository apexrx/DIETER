"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Download, Upload, Plus, Save, Undo2, Redo2 } from "lucide-react"
import TEKnob from "@/components/te-knob"
import ImageUploader from "@/components/image-uploader"
import DitheringCanvas from "@/components/dithering-canvas"
import BatchProcessing from "@/components/batch-processing"
import PaletteEditor from "@/components/palette-editor"
import Histogram from "@/components/histogram"
import ProcessingLog from "@/components/processing-log"
import AboutDialog from "@/components/about-dialog"
import HelpPage from "@/components/help-page"
import type { ImageAdjustments, DitheringOptions, LogEntry, BatchImage, RGB } from "@/lib/types"
import { palettes } from "@/lib/palettes"

const supportedFormats = ["image/jpeg", "image/png", "image/gif", "image/webp"]

export default function DieterApp() {
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeTab, setActiveTab] = useState("editor")
  const [showHistogram, setShowHistogram] = useState(false)
  const [logEntries, setLogEntries] = useState<LogEntry[]>([])
  const [batchImages, setBatchImages] = useState<BatchImage[]>([])
  const [customPalettes, setCustomPalettes] = useState<Record<string, RGB[]>>({})
  const [activePalette, setActivePalette] = useState<RGB[]>([])
  const [showAboutDialog, setShowAboutDialog] = useState(false)
  const [showHelpPage, setShowHelpPage] = useState(false)
  const [addedToBatch, setAddedToBatch] = useState(false)
  const [presets, setPresets] = useState<Record<string, {adjustments: ImageAdjustments; ditheringOptions: DitheringOptions}>>({})

  // Load presets from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("dieter-presets")
      if (saved) setPresets(JSON.parse(saved))
    } catch { /* ignore corrupt data */ }
  }, [])

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

  // Undo/redo stacks
  const undoStackRef = useRef<ImageAdjustments[]>([])
  const redoStackRef = useRef<ImageAdjustments[]>([])

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
      ...prev.slice(-99),
      { timestamp, type, message },
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
      setAdjustments((prev) => {
        undoStackRef.current.push(prev)
        if (undoStackRef.current.length > 50) undoStackRef.current.shift()
        redoStackRef.current = []
        return { ...prev, [key]: value }
      })
      addLogEntry(`Adjustment changed: ${key} = ${value}`, "ADJUST")
    },
    [addLogEntry],
  )

  const handleUndo = useCallback(() => {
    const prev = undoStackRef.current.pop()
    if (!prev) return
    setAdjustments((current) => {
      redoStackRef.current.push(current)
      return prev
    })
    addLogEntry("Undo adjustment", "ACTION")
  }, [addLogEntry])

  const handleRedo = useCallback(() => {
    const next = redoStackRef.current.pop()
    if (!next) return
    setAdjustments((current) => {
      undoStackRef.current.push(current)
      return next
    })
    addLogEntry("Redo adjustment", "ACTION")
  }, [addLogEntry])

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
    setAddedToBatch(true)
    addLogEntry(`Added image to batch queue: ${originalImage.width}x${originalImage.height}px`, "BATCH")
  }, [originalImage, adjustments, ditheringOptions, addLogEntry])

  useEffect(() => {
    if (!addedToBatch) return
    const t = setTimeout(() => setAddedToBatch(false), 1200)
    return () => clearTimeout(t)
  }, [addedToBatch])

  // Preset save/load handlers
  const handleSavePreset = useCallback(() => {
    const name = prompt("Preset name:")
    if (!name?.trim()) return
    const newPresets = { ...presets, [name.trim()]: { adjustments, ditheringOptions } }
    setPresets(newPresets)
    localStorage.setItem("dieter-presets", JSON.stringify(newPresets))
    addLogEntry(`Preset saved: "${name.trim()}"`, "CONFIG")
  }, [presets, adjustments, ditheringOptions, addLogEntry])

  const handleLoadPreset = useCallback((name: string) => {
    const preset = presets[name]
    if (!preset) return
    setAdjustments(preset.adjustments)
    setDitheringOptions(preset.ditheringOptions)
    addLogEntry(`Preset loaded: "${name}"`, "CONFIG")
  }, [presets, addLogEntry])

  const handleDeletePreset = useCallback((name: string) => {
    const newPresets = { ...presets }
    delete newPresets[name]
    setPresets(newPresets)
    localStorage.setItem("dieter-presets", JSON.stringify(newPresets))
    addLogEntry(`Preset deleted: "${name}"`, "CONFIG")
  }, [presets, addLogEntry])

  // Remove image from batch
  const removeFromBatch = useCallback(
    (id: string) => {
      setBatchImages((prev) => prev.filter((img) => img.id !== id))
      addLogEntry(`Removed image from batch queue: ID ${id}`, "BATCH")
    },
    [addLogEntry],
  )

  // Download handler
  const handleDownload = useCallback(() => {
    const canvas = document.getElementById("dieter-canvas") as HTMLCanvasElement
    if (canvas) {
      const link = document.createElement("a")
      link.download = "dithered-image.png"
      link.href = canvas.toDataURL("image/png")
      link.click()
      addLogEntry("Image downloaded", "ACTION")
    }
  }, [addLogEntry])

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
    addLogEntry("DIETER v2.0 initialized", "INIT")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Viewport scale for canonical 1280×720
  useEffect(() => {
    const scale = () => {
      const sx = window.innerWidth / 1280
      const sy = window.innerHeight / 720
      const r = Math.min(sx, sy)
      const el = document.getElementById("app-root")
      if (el) {
        el.style.transform = `scale(${r})`
        el.style.transformOrigin = "center center"
      }
    }
    scale()
    window.addEventListener("resize", scale)
    return () => window.removeEventListener("resize", scale)
  }, [])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F1") {
        e.preventDefault()
        setShowHelpPage(true)
        return
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault()
        handleDownload()
        return
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault()
        handleUndo()
        return
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && e.shiftKey) {
        e.preventDefault()
        handleRedo()
        return
      }
    }

    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items
      if (!items) return
      for (const item of items) {
        if (item.type.startsWith("image/") && supportedFormats.includes(item.type)) {
          const file = item.getAsFile()
          if (file) {
            const reader = new FileReader()
            reader.onload = (ev) => {
              if (ev.target && typeof ev.target.result === "string") {
                const img = new Image()
                img.onload = () => handleImageUpload(img)
                img.src = ev.target.result
              }
            }
            reader.readAsDataURL(file)
          }
          break
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("paste", handlePaste)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("paste", handlePaste)
    }
  }, [handleDownload, handleImageUpload, handleUndo, handleRedo, addLogEntry])

  const [canvasView, setCanvasView] = useState<"sideBySide" | "original" | "dithered">("sideBySide")
  const [logOpen, setLogOpen] = useState(false)
  const statusLED = isProcessing ? "amber" : "green"

  const algoShort: Record<string, string> = {
    floydSteinberg: "FLYD",
    atkinson: "ATKN",
    jarvis: "JRVS",
    stucki: "STKI",
    burkes: "BURK",
    sierra: "SIER",
    sierra2: "SI2",
    sierraLite: "SLLT",
    bayer2x2: "BAY2",
    bayer4x4: "BAY4",
    bayer8x8: "BAY8",
    clusteredDot: "CLST",
    halftone: "HLFT",
    random: "RAND",
    threshold: "THRS",
  }
  const allAlgos = Object.keys(algoShort)

  return (
    <div id="app-root" className="te-shell text-mono text-[13px]">
      {/* Top Bar */}
      <header className="te-topbar">
        <span className="w-2.5 h-2.5 bg-accent shrink-0" />
        <span className="text-[10px] uppercase tracking-[0.1em] font-medium text-muted">TE-DITHER</span>
        <span className="w-px h-4 bg-border-dark" />
        {(["editor", "batch", "log"] as const).map((tab) => (
          <button
            key={tab}
            className={`te-tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "editor" ? "Editor" : tab === "batch" ? "Batch" : "Log"}
          </button>
        ))}
        <span className="ml-auto flex items-center gap-1.5">
          <span className={`te-led on ${statusLED}`} title={statusLED} />
          <span className="te-led off" />
          <span className="te-led off" />
        </span>
      </header>

      {/* Main Area */}
      <div className="flex-1 flex overflow-hidden">
        {activeTab === "editor" && !originalImage ? (
          <div className="flex-1 flex items-center justify-center p-4">
            <ImageUploader onImageUpload={handleImageUpload} />
          </div>
        ) : activeTab === "editor" ? (
          <>
            {/* Controls Panel */}
            <aside className="w-[320px] shrink-0 relative p-2 pt-3 te-faceplate">
              {/* Algorithm grid — 5 rows × 3 cols */}
              <div className="te-divider"><span>DITHER</span></div>
              <div className="grid grid-cols-3 gap-px mb-1">
                {allAlgos.map((a) => (
                  <button
                    key={a}
                    className={`te-segment ${ditheringOptions.algorithm === a ? "active" : ""}`}
                    onClick={() => handleDitheringOptionChange("algorithm", a)}
                  >
                    {algoShort[a]}
                  </button>
                ))}
              </div>

              {/* Knobs — 2×3 grid */}
              <div className="grid grid-cols-3 justify-items-center gap-px mb-2">
                <TEKnob value={ditheringOptions.threshold} min={0} max={255} step={1} label="THR" onChange={(v) => handleDitheringOptionChange("threshold", v)} size={48} />
                <TEKnob value={adjustments.contrast} min={0} max={200} step={1} label="CONT" onChange={(v) => handleAdjustmentChange("contrast", v)} size={48} />
                <TEKnob value={adjustments.brightness} min={0} max={200} step={1} label="BRIT" onChange={(v) => handleAdjustmentChange("brightness", v)} size={48} />
                <TEKnob value={Math.round(ditheringOptions.diffusionStrength * 50)} min={0} max={100} step={1} label="DFUS" onChange={(v) => handleDitheringOptionChange("diffusionStrength", v / 50)} size={48} />
                <TEKnob value={Math.round(ditheringOptions.ditherScale * 25)} min={12} max={100} step={1} label="SCAL" onChange={(v) => handleDitheringOptionChange("ditherScale", v / 25)} size={48} />
                <TEKnob value={Math.round(adjustments.saturation / 2)} min={0} max={100} step={1} label="SAT" onChange={(v) => handleAdjustmentChange("saturation", v * 2)} size={48} />
              </div>

              {/* Toggles row */}
              <div className="te-divider mt-4"><span>TOGGLES</span></div>
              <div className="flex gap-px mb-3">
                <button className={`te-segment flex-1 ${adjustments.grayscale ? "active" : ""}`} onClick={() => handleAdjustmentChange("grayscale", true)}>GRAY</button>
                <button className={`te-segment flex-1 ${!adjustments.grayscale ? "active" : ""}`} onClick={() => handleAdjustmentChange("grayscale", false)}>CLR</button>
                <button className={`te-segment flex-1 ${adjustments.invert ? "active" : ""}`} onClick={() => handleAdjustmentChange("invert", true)}>INV</button>
                <button className={`te-segment flex-1 ${!adjustments.invert ? "active" : ""}`} onClick={() => handleAdjustmentChange("invert", false)}>NRM</button>
              </div>

              {/* Sliders — vertical stack */}
              <div className="mb-2">
                <div className="flex items-center justify-between mb-px">
                  <span className="text-[8px] uppercase tracking-[0.1em] text-muted">SHARPNESS</span>
                  <span className="text-[8px] text-muted">{adjustments.blur.toFixed(1)}</span>
                </div>
                <input type="range" min={-10} max={10} step={0.5} value={adjustments.blur} onChange={(e) => handleAdjustmentChange("blur", Number(e.target.value))} className="te-slider w-full" />
              </div>
              <div className="mb-2">
                <div className="flex items-center justify-between mb-px">
                  <span className="text-[8px] uppercase tracking-[0.1em] text-muted">POSTERIZE</span>
                  <span className="text-[8px] text-muted">{adjustments.posterize}</span>
                </div>
                <input type="range" min={0} max={8} step={1} value={adjustments.posterize} onChange={(e) => handleAdjustmentChange("posterize", Number(e.target.value))} className="te-slider w-full" />
              </div>
              <div className="mb-2">
                <div className="flex items-center justify-between mb-px">
                  <span className="text-[8px] uppercase tracking-[0.1em] text-muted">QUANTIZE</span>
                  <span className="text-[8px] text-muted">{ditheringOptions.colorCount || 8}</span>
                </div>
                <div className="flex items-center gap-px">
                  <select className="flex-1 min-w-0" value={ditheringOptions.colorQuantization || "none"} onChange={(e) => handleDitheringOptionChange("colorQuantization", e.target.value)}>
                    <option value="none">—</option>
                    <option value="medianCut">MED</option>
                    <option value="kMeans">KM</option>
                    <option value="octree">OCT</option>
                    <option value="neuQuant">NEU</option>
                  </select>
                  <input type="range" min={2} max={256} step={1} value={ditheringOptions.colorCount || 8} onChange={(e) => handleDitheringOptionChange("colorCount", Number(e.target.value))} className="te-slider flex-1" disabled={ditheringOptions.colorQuantization === "none" || !ditheringOptions.colorQuantization} />
                </div>
              </div>

              {/* Palette */}
              <div className="mb-3">
                <span className="text-[8px] uppercase tracking-[0.1em] text-muted block mb-px">PALETTE</span>
                <select className="w-full" value={ditheringOptions.palette} onChange={(e) => handleDitheringOptionChange("palette", e.target.value)}>
                  <option value="bw">B&W</option>
                  <option value="grayscale4">GRAY4</option>
                  <option value="grayscale8">GRAY8</option>
                  <option value="gameboy">GBOY</option>
                  <option value="cga">CGA</option>
                  <option value="ega">EGA</option>
                  <option value="c64">C64</option>
                  <option value="apple2">AII</option>
                  <option value="zxspectrum">ZX</option>
                  {Object.keys(customPalettes).map((n) => (<option key={n} value={`custom_${n}`}>C:{n}</option>))}
                </select>
              </div>

              {/* Actions */}
              <button className="te-btn accent w-full mt-4" onClick={addToBatch}>
                {addedToBatch ? "✓ QUEUED" : "ADD TO BATCH ›"}
              </button>
              <div className="flex gap-px mt-2">
                <button className="te-btn flex-1" onClick={() => { setOriginalImage(null); addLogEntry("Reset image", "ACTION") }}>NEW</button>
                <button className="te-btn flex-1" onClick={handleDownload} disabled={!originalImage}>DL</button>
                <button className="te-btn flex-1" onClick={handleSavePreset}>SAVE</button>
                <button className="te-btn flex-1" onClick={handleUndo} disabled={undoStackRef.current.length === 0}>UNDO</button>
                <button className="te-btn flex-1" onClick={handleRedo} disabled={redoStackRef.current.length === 0}>REDO</button>
              </div>
              {Object.keys(presets).length > 0 && (
                <select className="w-full mt-px" defaultValue="" onChange={(e) => { if (e.target.value) handleLoadPreset(e.target.value); e.target.value = "" }} onDoubleClick={(e) => { const v = (e.target as HTMLSelectElement).value; if (v && confirm(`Delete preset "${v}"?`)) handleDeletePreset(v); (e.target as HTMLSelectElement).value = "" }}>
                  <option value="" disabled>LOAD (dbl del)</option>
                  {Object.keys(presets).map((n) => (<option key={n} value={n}>{n}</option>))}
                </select>
              )}

              {/* Status */}
              <div className="flex justify-between text-[8px] mt-1 pt-1 border-t border-border-dark">
                <div className="flex gap-2">
                  <span className="text-muted">W:{originalImage?.width || 0}</span>
                  <span className="text-muted">H:{originalImage?.height || 0}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-muted">{adjustments.grayscale ? "GRAY" : "RGB"}</span>
                  <span className={isProcessing ? "text-accent" : "text-muted"}>{isProcessing ? "PROC" : "RDY"}</span>
                </div>
              </div>
            </aside>

            {/* Canvas */}
            <main className="flex-1 flex flex-col min-w-0">
              <div className="flex-1 flex flex-col">
                <div className="flex flex-1 min-h-0">
                  {(canvasView === "original" || canvasView === "sideBySide") && (
                    <div className="flex-1 flex flex-col min-w-0 border-r border-border">
                      <div className="text-[8px] uppercase tracking-[0.1em] text-muted px-2 py-0.5 border-b border-border bg-surface">INPUT</div>
                      <div className="flex-1 flex items-center justify-center overflow-hidden bg-[#111] min-h-0">
                        <img src={originalImage?.src || "/placeholder.svg"} alt="Original" className="max-w-full max-h-full object-contain" />
                      </div>
                    </div>
                  )}
                  {(canvasView === "dithered" || canvasView === "sideBySide") && (
                    <div className="flex-1 flex flex-col min-w-0">
                      <div className="text-[8px] uppercase tracking-[0.1em] text-muted px-2 py-0.5 border-b border-border bg-surface">OUTPUT</div>
                      <div className="flex-1 flex items-center justify-center overflow-hidden bg-[#111] min-h-0">
                        <DitheringCanvas
                          originalImage={originalImage!}
                          adjustments={adjustments}
                          ditheringOptions={ditheringOptions}
                          onProcessingChange={setIsProcessing}
                          onLogEntry={addLogEntry}
                          customPalettes={customPalettes}
                          fullSize={canvasView === "dithered"}
                        />
                      </div>
                    </div>
                  )}
                </div>
                {/* Canvas info bar */}
                <div className="h-6 border-t border-border flex items-center px-2 gap-3 text-[9px] text-muted shrink-0 bg-surface">
                  <span>W:{originalImage?.width || 0}</span>
                  <span>H:{originalImage?.height || 0}</span>
                  <span>MD:{adjustments.grayscale ? "GRAY" : "RGB"}</span>
                  <div className="ml-auto flex gap-1">
                    <button onClick={() => setCanvasView("sideBySide")} className={`px-1 text-[8px] uppercase ${canvasView === "sideBySide" ? "text-accent" : "text-muted hover:text-text"}`}>SPLIT</button>
                    <button onClick={() => setCanvasView("original")} className={`px-1 text-[8px] uppercase ${canvasView === "original" ? "text-accent" : "text-muted hover:text-text"}`}>IN</button>
                    <button onClick={() => setCanvasView("dithered")} className={`px-1 text-[8px] uppercase ${canvasView === "dithered" ? "text-accent" : "text-muted hover:text-text"}`}>OUT</button>
                  </div>
                </div>
              </div>
            </main>

            {/* Info Panel */}
            <aside className="w-[220px] shrink-0 p-2 pt-3 te-faceplate relative flex flex-col justify-between">
              <div>
                <div className="te-divider"><span>SCOPE</span></div>
                <div className="te-scope-bg p-0.5">
                  {originalImage && <Histogram image={originalImage} />}
                </div>
              </div>

              <div>
                <div className="te-divider"><span>STATS</span></div>
                <div className="text-[9px] space-y-0.5">
                  <div className="flex justify-between"><span className="text-muted">MIN</span><span>0</span></div>
                  <div className="flex justify-between"><span className="text-muted">MAX</span><span>255</span></div>
                  <div className="flex justify-between"><span className="text-muted">MEAN</span><span>128</span></div>
                </div>
              </div>

              <div>
                <div className="te-divider"><span>SYSTEM</span></div>
                <div className="flex items-center gap-2">
                  <span className="te-led on green" />
                  <span className="text-[8px] uppercase tracking-[0.1em] text-muted">READY</span>
                  <span className={`te-led ${isProcessing ? "on amber" : "off"} ml-2`} />
                  <span className="text-[8px] uppercase tracking-[0.1em] text-muted">PROC</span>
                  <span className="te-led off ml-2" />
                  <span className="text-[8px] uppercase tracking-[0.1em] text-muted">ERR</span>
                </div>
              </div>

              <div>
                <div className="te-divider"><span>PALETTE</span></div>
                <div className="grid grid-cols-8 gap-px">
                  {(() => {
                    const key = ditheringOptions.palette
                    const colors = key.startsWith("custom_")
                      ? (customPalettes[key.slice(7)] || [])
                      : (palettes[key]?.colors || [])
                    return colors.slice(0, 16).map((c, i) => (
                      <div key={i} className="te-swatch" style={{background:`rgb(${c.r},${c.g},${c.b})`}} />
                    ))
                  })()}
                </div>
              </div>

              <div className="pt-1 text-[8px] text-muted text-center border-t border-border-dark">
                <button className="hover:text-text" onClick={() => setShowAboutDialog(true)}>ABOUT</button>
                <span className="mx-1">|</span>
                <button className="hover:text-text" onClick={() => setShowHelpPage(true)}>HELP</button>
                <span className="mx-1">|</span>
                <button className="hover:text-text" onClick={() => setActiveTab("batch")}>BATCH</button>
                <span className="mx-1">|</span>
                <button className="hover:text-text" onClick={() => setActiveTab("palette")}>PAL</button>
              </div>
            </aside>
          </>
        ) : activeTab === "batch" ? (
          <div className="flex-1 p-2 te-tab-content">
            <BatchProcessing
              batchImages={batchImages}
              onRemoveImage={removeFromBatch}
              onProcessBatch={processBatch}
              onLogEntry={addLogEntry}
            />
          </div>
        ) : activeTab === "palette" ? (
          <div className="flex-1 p-2 te-tab-content">
            <PaletteEditor onSavePalette={saveCustomPalette} existingPalettes={customPalettes} onLogEntry={addLogEntry} />
          </div>
        ) : activeTab === "log" ? (
          <div className="flex-1 p-2 te-tab-content">
            <ProcessingLog entries={logEntries} />
          </div>
        ) : null}
      </div>

      {/* Batch Strip — 56px fixed */}
      {batchImages.length > 0 && (
        <div className="h-[56px] shrink-0 border-t border-border-dark flex items-center px-2 gap-1 batch-strip te-faceplate">
          {batchImages.map((img, i) => (
            <div
              key={img.id}
              className={`batch-thumb w-[72px] h-[44px] shrink-0 relative cursor-pointer ${img.status === "processing" ? "border-accent" : "border-border"} te-btn`}
              style={{ padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <span className="absolute top-0 left-0 text-[7px] text-accent px-0.5 z-10">{i + 1}</span>
              <img src={img.image.src || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
              {img.status === "processing" && <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent" />}
            </div>
          ))}
        </div>
      )}

      {/* Log Bar — 24px always visible */}
      <div className="shrink-0 cursor-pointer border-t border-border-dark" onClick={() => setLogOpen(!logOpen)}>
        <div className="h-6 te-screen flex items-center px-2 gap-2 text-[9px]">
          {logEntries.length > 0 ? (
            <>
              <span className="timestamp">{logEntries[logEntries.length - 1].timestamp}</span>
              <span className="text-muted">›</span>
              <span className="flex-1 truncate">{logEntries[logEntries.length - 1].message}</span>
            </>
          ) : (
            <span className="text-muted">—</span>
          )}
          <span className="ml-auto flex items-center gap-1.5">
            <span className={`te-led on ${statusLED}`} />
            <span className="text-[8px] uppercase tracking-[0.1em]">{statusLED === "green" ? "RDY" : "PROC"}</span>
          </span>
        </div>
        {logOpen && (
          <div className="te-screen max-h-[100px] overflow-y-auto text-[9px] p-1.5 border-t border-border-dark">
            {logEntries.map((e, i) => (
              <div key={i} className="flex gap-1.5">
                <span className="timestamp shrink-0">{e.timestamp}</span>
                <span className="text-muted shrink-0">›</span>
                <span className={e.type === "ERROR" ? "log-error" : ""}>{e.message}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dialogs */}
      <AboutDialog isOpen={showAboutDialog} onClose={() => setShowAboutDialog(false)} />
      <HelpPage isOpen={showHelpPage} onClose={() => setShowHelpPage(false)} />
    </div>
  )
}
