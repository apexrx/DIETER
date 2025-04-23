"use client"

import { useState, useEffect } from "react"
import { Save, Trash, Plus } from "lucide-react"
import type { RGB } from "@/lib/types"

interface PaletteEditorProps {
  onSavePalette: (name: string, colors: RGB[]) => void
  existingPalettes: Record<string, RGB[]>
  onLogEntry: (message: string, type?: string) => void
}

export default function PaletteEditor({ onSavePalette, existingPalettes, onLogEntry }: PaletteEditorProps) {
  const [paletteName, setPaletteName] = useState("")
  const [colors, setColors] = useState<RGB[]>([
    { r: 0, g: 0, b: 0 },
    { r: 255, g: 255, b: 255 },
  ])
  const [selectedPalette, setSelectedPalette] = useState<string>("")

  // Load existing palette when selected
  useEffect(() => {
    if (selectedPalette && existingPalettes[selectedPalette]) {
      setPaletteName(selectedPalette)
      setColors([...existingPalettes[selectedPalette]])
      onLogEntry(`Loaded palette: ${selectedPalette}`, "PALETTE")
    }
  }, [selectedPalette, existingPalettes, onLogEntry])

  const handleColorChange = (index: number, channel: keyof RGB, value: number) => {
    const newColors = [...colors]
    newColors[index][channel] = value
    setColors(newColors)
  }

  const addColor = () => {
    setColors([...colors, { r: 128, g: 128, b: 128 }])
  }

  const removeColor = (index: number) => {
    if (colors.length <= 1) return
    const newColors = [...colors]
    newColors.splice(index, 1)
    setColors(newColors)
  }

  const handleSave = () => {
    if (!paletteName.trim()) {
      alert("Please enter a palette name")
      return
    }

    onSavePalette(paletteName, colors)
    onLogEntry(`Saved palette: ${paletteName} with ${colors.length} colors`, "PALETTE")

    // Reset form if creating a new palette
    if (selectedPalette !== paletteName) {
      setPaletteName("")
      setColors([
        { r: 0, g: 0, b: 0 },
        { r: 255, g: 255, b: 255 },
      ])
      setSelectedPalette("")
    }
  }

  const rgbToHex = (color: RGB) => {
    return `#${color.r.toString(16).padStart(2, "0")}${color.g.toString(16).padStart(2, "0")}${color.b.toString(16).padStart(2, "0")}`
  }

  const hexToRgb = (hex: string): RGB => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: Number.parseInt(result[1], 16),
          g: Number.parseInt(result[2], 16),
          b: Number.parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 }
  }

  const handleHexChange = (index: number, hex: string) => {
    if (/^#[0-9A-F]{6}$/i.test(hex)) {
      const rgb = hexToRgb(hex)
      const newColors = [...colors]
      newColors[index] = rgb
      setColors(newColors)
    }
  }

  return (
    <div className="space-y-2">
      <div className="border border-[#999999] bg-[#e8e8e8]">
        <div className="bg-[#d0d0d0] border-b border-[#999999] p-1">
          <div className="text-[12px] uppercase font-bold tracking-[1px]">Custom Palette Editor</div>
        </div>
        <div className="p-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="mb-2">
                <label className="text-[11px] uppercase font-bold block mb-1">Palette Name</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={paletteName}
                    onChange={(e) => setPaletteName(e.target.value)}
                    className="border border-[#999999] p-1 text-[11px] w-full"
                    placeholder="Enter palette name"
                  />
                  <button
                    className="px-2 py-1 text-[11px] uppercase font-bold border border-[#999999] bg-[#3366cc] text-white hover:bg-[#4477dd]"
                    onClick={handleSave}
                  >
                    <Save className="h-3 w-3 inline-block mr-1" />
                    Save
                  </button>
                </div>
              </div>

              <div className="mb-2">
                <label className="text-[11px] uppercase font-bold block mb-1">Load Existing Palette</label>
                <select
                  value={selectedPalette}
                  onChange={(e) => setSelectedPalette(e.target.value)}
                  className="border border-[#999999] p-1 text-[11px] w-full bg-[#f0f0f0]"
                >
                  <option value="">-- Select a palette --</option>
                  {Object.keys(existingPalettes).map((name) => (
                    <option key={name} value={name}>
                      {name} ({existingPalettes[name].length} colors)
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-2">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[11px] uppercase font-bold">Colors ({colors.length})</label>
                  <button
                    className="px-2 py-1 text-[10px] uppercase font-bold border border-[#999999] bg-[#d8d8d8] hover:bg-[#e8e8e8]"
                    onClick={addColor}
                  >
                    <Plus className="h-3 w-3 inline-block mr-1" />
                    Add Color
                  </button>
                </div>

                <div className="border border-[#999999] bg-[#f0f0f0] p-1 max-h-[400px] overflow-y-auto">
                  <table className="w-full border-collapse text-[11px]">
                    <thead>
                      <tr className="bg-[#d0d0d0]">
                        <th className="border border-[#999999] p-1 text-left">#</th>
                        <th className="border border-[#999999] p-1 text-left">Color</th>
                        <th className="border border-[#999999] p-1 text-left">RGB</th>
                        <th className="border border-[#999999] p-1 text-left">Hex</th>
                        <th className="border border-[#999999] p-1 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {colors.map((color, index) => (
                        <tr key={index} className={index % 2 === 0 ? "bg-[#f0f0f0]" : "bg-[#e8e8e8]"}>
                          <td className="border border-[#999999] p-1">{index + 1}</td>
                          <td className="border border-[#999999] p-1">
                            <div
                              className="w-[20px] h-[20px] border border-[#999999]"
                              style={{ backgroundColor: rgbToHex(color) }}
                            ></div>
                          </td>
                          <td className="border border-[#999999] p-1">
                            <div className="grid grid-cols-3 gap-1">
                              <input
                                type="number"
                                min="0"
                                max="255"
                                value={color.r}
                                onChange={(e) => handleColorChange(index, "r", Number.parseInt(e.target.value) || 0)}
                                className="border border-[#999999] p-1 text-[10px] w-full"
                              />
                              <input
                                type="number"
                                min="0"
                                max="255"
                                value={color.g}
                                onChange={(e) => handleColorChange(index, "g", Number.parseInt(e.target.value) || 0)}
                                className="border border-[#999999] p-1 text-[10px] w-full"
                              />
                              <input
                                type="number"
                                min="0"
                                max="255"
                                value={color.b}
                                onChange={(e) => handleColorChange(index, "b", Number.parseInt(e.target.value) || 0)}
                                className="border border-[#999999] p-1 text-[10px] w-full"
                              />
                            </div>
                          </td>
                          <td className="border border-[#999999] p-1">
                            <input
                              type="text"
                              value={rgbToHex(color)}
                              onChange={(e) => handleHexChange(index, e.target.value)}
                              className="border border-[#999999] p-1 text-[10px] w-full font-mono"
                            />
                          </td>
                          <td className="border border-[#999999] p-1">
                            <button
                              className="px-1 text-[10px] uppercase border border-[#999999] bg-[#ffcccc] hover:bg-[#ffdddd]"
                              onClick={() => removeColor(index)}
                              disabled={colors.length <= 1}
                              title="Remove"
                            >
                              <Trash className="h-3 w-3" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div>
              <div className="mb-2">
                <label className="text-[11px] uppercase font-bold block mb-1">Palette Preview</label>
                <div className="border border-[#999999] bg-[#f0f0f0] p-2 h-[200px]">
                  <div className="grid grid-cols-8 gap-1">
                    {colors.map((color, index) => (
                      <div
                        key={index}
                        className="aspect-square border border-[#999999]"
                        style={{ backgroundColor: rgbToHex(color) }}
                        title={`Color ${index + 1}: ${rgbToHex(color)}`}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mb-2">
                <label className="text-[11px] uppercase font-bold block mb-1">Gradient Preview</label>
                <div className="border border-[#999999] bg-[#f0f0f0] p-2 h-[50px]">
                  <div
                    className="w-full h-full border border-[#999999]"
                    style={{
                      background: `linear-gradient(to right, ${colors.map((c) => rgbToHex(c)).join(", ")})`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="mb-2">
                <label className="text-[11px] uppercase font-bold block mb-1">Existing Palettes</label>
                <div className="border border-[#999999] bg-[#f0f0f0] p-1 max-h-[200px] overflow-y-auto">
                  {Object.keys(existingPalettes).length === 0 ? (
                    <div className="text-center p-2 text-[11px] text-[#666666]">No custom palettes saved yet</div>
                  ) : (
                    <table className="w-full border-collapse text-[11px]">
                      <thead>
                        <tr className="bg-[#d0d0d0]">
                          <th className="border border-[#999999] p-1 text-left">Name</th>
                          <th className="border border-[#999999] p-1 text-left">Colors</th>
                          <th className="border border-[#999999] p-1 text-left">Preview</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(existingPalettes).map(([name, paletteColors], index) => (
                          <tr key={name} className={index % 2 === 0 ? "bg-[#f0f0f0]" : "bg-[#e8e8e8]"}>
                            <td className="border border-[#999999] p-1">{name}</td>
                            <td className="border border-[#999999] p-1">{paletteColors.length}</td>
                            <td className="border border-[#999999] p-1">
                              <div className="flex gap-1">
                                {paletteColors.slice(0, 8).map((color, i) => (
                                  <div
                                    key={i}
                                    className="w-[12px] h-[12px] border border-[#999999]"
                                    style={{ backgroundColor: rgbToHex(color) }}
                                  ></div>
                                ))}
                                {paletteColors.length > 8 && (
                                  <div className="text-[10px] text-[#666666]">+{paletteColors.length - 8} more</div>
                                )}
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
          </div>
        </div>
      </div>
    </div>
  )
}
