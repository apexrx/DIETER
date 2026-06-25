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
    <div className="space-y-3">
      <div className="uppercase font-bold text-[11px] tracking-[1px] border-b border-border pb-1">Custom Palette Editor</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div>
            <label className="text-[11px] uppercase font-bold block mb-1">Palette Name</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={paletteName}
                onChange={(e) => setPaletteName(e.target.value)}
                className="border border-border p-1 text-[11px] w-full bg-transparent"
                placeholder="Enter palette name"
              />
              <button
                className="px-2 py-1 text-[11px] uppercase font-bold bg-accent text-white hover:bg-accent-dim"
                onClick={handleSave}
              >
                <Save className="h-3 w-3 inline-block mr-1" />
                Save
              </button>
            </div>
          </div>

          <div>
            <label className="text-[11px] uppercase font-bold block mb-1">Load Existing Palette</label>
            <select
              value={selectedPalette}
              onChange={(e) => setSelectedPalette(e.target.value)}
              className="border border-border p-1 text-[11px] w-full bg-transparent"
            >
              <option value="">-- Select a palette --</option>
              {Object.keys(existingPalettes).map((name) => (
                <option key={name} value={name}>
                  {name} ({existingPalettes[name].length} colors)
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[11px] uppercase font-bold">Colors ({colors.length})</label>
              <button
                className="px-2 py-1 text-[10px] uppercase font-bold bg-transparent hover:bg-surface"
                onClick={addColor}
              >
                <Plus className="h-3 w-3 inline-block mr-1" />
                Add Color
              </button>
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              <table className="w-full text-[11px] border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="p-1 text-left uppercase font-bold">#</th>
                    <th className="p-1 text-left uppercase font-bold">Color</th>
                    <th className="p-1 text-left uppercase font-bold">RGB</th>
                    <th className="p-1 text-left uppercase font-bold">Hex</th>
                    <th className="p-1 text-left uppercase font-bold">Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {colors.map((color, index) => (
                    <tr key={index} className="border-b border-border">
                      <td className="p-1">{index + 1}</td>
                      <td className="p-1">
                        <div
                          className="w-[20px] h-[20px]"
                          style={{ backgroundColor: rgbToHex(color) }}
                        ></div>
                      </td>
                      <td className="p-1">
                        <div className="grid grid-cols-3 gap-1">
                          <input
                            type="number"
                            min="0"
                            max="255"
                            value={color.r}
                            onChange={(e) => handleColorChange(index, "r", Number.parseInt(e.target.value) || 0)}
                            className="border border-border p-1 text-[10px] w-full bg-transparent"
                          />
                          <input
                            type="number"
                            min="0"
                            max="255"
                            value={color.g}
                            onChange={(e) => handleColorChange(index, "g", Number.parseInt(e.target.value) || 0)}
                            className="border border-border p-1 text-[10px] w-full bg-transparent"
                          />
                          <input
                            type="number"
                            min="0"
                            max="255"
                            value={color.b}
                            onChange={(e) => handleColorChange(index, "b", Number.parseInt(e.target.value) || 0)}
                            className="border border-border p-1 text-[10px] w-full bg-transparent"
                          />
                        </div>
                      </td>
                      <td className="p-1">
                        <input
                          type="text"
                          value={rgbToHex(color)}
                          onChange={(e) => handleHexChange(index, e.target.value)}
                          className="border border-border p-1 text-[10px] w-full font-mono bg-transparent"
                        />
                      </td>
                      <td className="p-1">
                        <button
                          className="px-1 text-[10px] uppercase bg-transparent text-accent hover:bg-accent hover:text-white"
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

        <div className="space-y-3">
          <div>
            <label className="text-[11px] uppercase font-bold block mb-1">Palette Preview</label>
            <div className="h-[200px] overflow-y-auto">
              <div className="grid grid-cols-8 gap-1">
                {colors.map((color, index) => (
                  <div
                    key={index}
                    className="aspect-square"
                    style={{ backgroundColor: rgbToHex(color) }}
                    title={`Color ${index + 1}: ${rgbToHex(color)}`}
                  ></div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="text-[11px] uppercase font-bold block mb-1">Gradient Preview</label>
            <div className="h-[50px]">
              <div
                className="w-full h-full"
                style={{
                  background: `linear-gradient(to right, ${colors.map((c) => rgbToHex(c)).join(", ")})`,
                }}
              ></div>
            </div>
          </div>

          <div>
            <label className="text-[11px] uppercase font-bold block mb-1">Existing Palettes</label>
            <div className="max-h-[200px] overflow-y-auto">
              {Object.keys(existingPalettes).length === 0 ? (
                <div className="text-center p-2 text-[11px] text-muted">No custom palettes saved yet</div>
              ) : (
                <table className="w-full text-[11px] border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="p-1 text-left uppercase font-bold">Name</th>
                      <th className="p-1 text-left uppercase font-bold">Colors</th>
                      <th className="p-1 text-left uppercase font-bold">Preview</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(existingPalettes).map(([name, paletteColors]) => (
                      <tr key={name} className="border-b border-border">
                        <td className="p-1">{name}</td>
                        <td className="p-1">{paletteColors.length}</td>
                        <td className="p-1">
                          <div className="flex gap-1">
                            {paletteColors.slice(0, 8).map((color, i) => (
                              <div
                                key={i}
                                className="w-[12px] h-[12px]"
                                style={{ backgroundColor: rgbToHex(color) }}
                              ></div>
                            ))}
                            {paletteColors.length > 8 && (
                              <span className="text-[10px] text-muted">+{paletteColors.length - 8}</span>
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
  )
}
