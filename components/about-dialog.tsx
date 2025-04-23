"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

interface AboutDialogProps {
  isOpen: boolean
  onClose: () => void
}

export default function AboutDialog({ isOpen, onClose }: AboutDialogProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        className="relative w-[600px] max-h-[90vh] overflow-auto bg-[#f8f8f8] border-4 border-[#333333]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23cccccc' fillOpacity='0.1' fillRule='evenodd'/%3E%3C/svg%3E")`,
        }}
      >
        <div className="absolute top-2 right-2">
          <button onClick={onClose} className="bg-[#d8d8d8] border border-[#999999] p-1 hover:bg-[#e8e8e8]">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Certificate-like header */}
        <div className="bg-[#333333] text-white p-3 text-center border-b-2 border-[#999999]">
          <h1 className="text-[24px] font-bold tracking-[2px] uppercase font-serif">Dieter Corporation</h1>
          <div className="text-[12px] uppercase tracking-[1px] mt-1">Advanced Image Dithering Tool</div>
        </div>

        {/* Main certificate content */}
        <div className="p-6 border-b border-[#999999] bg-[#f0f0f0]">
          <div
            className="border-2 border-[#999999] p-4 bg-[#e8e8e8] mb-4"
            style={{
              backgroundImage: `repeating-linear-gradient(45deg, #e8e8e8, #e8e8e8 10px, #e0e0e0 10px, #e0e0e0 20px)`,
            }}
          >
            <div className="text-center font-serif">
              <p className="text-[14px] mb-2">This certifies that</p>
              <p className="text-[16px] font-bold mb-4">THE BEARER OF THIS CERTIFICATE</p>
              <p className="text-[14px] mb-2">is the rightful user of</p>
              <p className="text-[18px] font-bold mb-4">DIETER v1.0</p>
              <p className="text-[12px] italic">Advanced Image Dithering Tool</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="border border-[#999999] p-2 bg-white">
              <h3 className="text-[12px] uppercase font-bold mb-1">Version</h3>
              <p className="text-[14px] font-mono">1.0.0 (BETA)</p>
            </div>
            <div className="border border-[#999999] p-2 bg-white">
              <h3 className="text-[12px] uppercase font-bold mb-1">Release Date</h3>
              <p className="text-[14px] font-mono">{new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <div className="border border-[#999999] p-3 bg-white mb-4">
            <h3 className="text-[12px] uppercase font-bold mb-2">Description</h3>
            <p className="text-[12px] leading-tight mb-2">
              DIETER is an advanced image dithering tool designed for creating stylized, retro-inspired imagery through
              various dithering algorithms and color quantization techniques. It provides a comprehensive set of tools
              for manipulating images to achieve artistic effects reminiscent of early computer graphics.
            </p>
            <p className="text-[12px] leading-tight">
              This software is provided as-is, with no warranty expressed or implied. The creators of DIETER are not
              liable for any damages or losses resulting from the use of this software.
            </p>
          </div>
        </div>

        {/* Footer with signatures */}
        <div className="p-4 flex justify-between items-center border-t border-[#999999] bg-[#e0e0e0]">
          <div className="flex-1">
            <div className="text-[12px] italic mb-1">Dated</div>
            <div className="text-[14px] font-bold font-serif">{new Date().toDateString()}</div>
          </div>

          <div className="flex-1 flex justify-center">
            <div className="w-16 h-16 rounded-full bg-[#d0d0d0] border border-[#999999] flex items-center justify-center">
              <div className="text-[24px] font-bold text-[#666666]">D</div>
            </div>
          </div>

          <div className="flex-1 text-right">
            <div className="text-[12px] italic mb-1">Serial Number</div>
            <div className="text-[14px] font-mono font-bold">
              D-
              {Math.floor(Math.random() * 1000000)
                .toString()
                .padStart(6, "0")}
            </div>
          </div>
        </div>

        {/* Bottom decorative border */}
        <div className="h-4 bg-[#333333]"></div>
      </div>
    </div>
  )
}
