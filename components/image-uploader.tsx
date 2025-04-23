"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Upload, ImageIcon } from "lucide-react"

interface ImageUploaderProps {
  onImageUpload: (image: HTMLImageElement) => void
}

export default function ImageUploader({ onImageUpload }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }, [])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }, [])

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.match("image.*")) {
        alert("Please select an image file (JPG, PNG, GIF, WEBP)")
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target && typeof e.target.result === "string") {
          const img = new Image()
          img.onload = () => {
            onImageUpload(img)
          }
          img.src = e.target.result
        }
      }
      reader.readAsDataURL(file)
    },
    [onImageUpload],
  )

  const handleButtonClick = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }, [])

  return (
    <div className="w-full max-w-3xl mx-auto border border-[#999999] bg-[#e8e8e8]">
      <div className="bg-[#d0d0d0] border-b border-[#999999] p-1">
        <div className="text-[12px] uppercase font-bold tracking-[1px]">Upload Image</div>
      </div>
      <div className="p-4">
        <div
          className={`border-2 border-dashed p-8 text-center ${
            isDragging ? "border-[#3366cc] bg-[#e8f0ff]" : "border-[#999999]"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="border border-[#999999] p-4 bg-[#d0d0d0]">
              <ImageIcon className="h-10 w-10 text-[#333333]" />
            </div>
            <div className="space-y-2">
              <h3 className="text-[14px] font-bold uppercase tracking-[1px]">Upload an image to dither</h3>
              <p className="text-[11px] text-[#666666] max-w-md mx-auto">
                Drag and drop an image file (JPG, PNG, GIF, WEBP), or click the button below to select a file
              </p>
            </div>
            <button
              onClick={handleButtonClick}
              className="px-4 py-2 text-[11px] uppercase font-bold tracking-[1px] border border-[#999999] bg-[#3366cc] text-white hover:bg-[#4477dd]"
            >
              <Upload className="h-4 w-4 inline-block mr-2" />
              SELECT IMAGE
            </button>
            <input type="file" ref={fileInputRef} onChange={handleFileInput} accept="image/*" className="hidden" />

            <div className="w-full border border-[#999999] p-2 text-[11px] bg-[#f0f0f0]">
              <div className="uppercase font-bold mb-1">Supported formats:</div>
              <table className="w-full border-collapse">
                <tbody>
                  <tr>
                    <td className="border border-[#999999] p-1 text-center bg-[#d8d8d8]">JPG</td>
                    <td className="border border-[#999999] p-1 text-center bg-[#d8d8d8]">PNG</td>
                    <td className="border border-[#999999] p-1 text-center bg-[#d8d8d8]">GIF</td>
                    <td className="border border-[#999999] p-1 text-center bg-[#d8d8d8]">WEBP</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
