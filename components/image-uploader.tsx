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

  const supportedFormats = ["image/jpeg", "image/png", "image/gif", "image/webp"]

  const handleFile = useCallback(
    (file: File) => {
      if (!supportedFormats.includes(file.type)) {
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
    <div className="w-full max-w-3xl mx-auto">
      <div
        className={`border-2 border-dashed p-8 text-center ${
          isDragging ? "border-accent bg-surface" : "border-border"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <div>
            <ImageIcon className="h-10 w-10 text-muted" />
          </div>
          <div className="space-y-2">
            <h3 className="text-[14px] font-bold uppercase">Upload an image to dither</h3>
            <p className="text-[11px] text-muted max-w-md mx-auto">
              Drag and drop an image file (JPG, PNG, GIF, WEBP), or click the button below to select a file
            </p>
          </div>
          <button
            onClick={handleButtonClick}
            className="px-4 py-2 text-[11px] uppercase font-bold bg-accent text-white hover:bg-accent-dim"
          >
            <Upload className="h-4 w-4 inline-block mr-2" />
            SELECT IMAGE
          </button>
          <input type="file" ref={fileInputRef} onChange={handleFileInput} accept="image/*" className="hidden" />

          <div className="text-[11px] text-muted">
            Supported formats: JPG &middot; PNG &middot; GIF &middot; WEBP
          </div>
        </div>
      </div>
    </div>
  )
}
