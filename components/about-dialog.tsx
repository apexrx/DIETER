"use client"

import { useState, useEffect } from "react"

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg/90" onClick={onClose}>
      <div className="w-[500px] border border-border bg-surface" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b border-border flex items-center gap-2">
          <span className="w-3 h-3 bg-accent shrink-0" />
          <span className="text-[11px] uppercase tracking-[0.12em] font-medium">TE-DITHER</span>
          <span className="text-[9px] text-muted ml-auto cursor-pointer" onClick={onClose}>✕</span>
        </div>
        <div className="p-4 space-y-3">
          <div className="flex justify-between text-[11px]">
            <span className="text-muted">VERSION</span>
            <span>0.2.0 (BETA)</span>
          </div>
          <div className="flex justify-between text-[11px]">
            <span className="text-muted">RELEASE</span>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
          <div className="text-[11px] leading-tight text-muted pt-2 border-t border-border">
            Advanced image dithering tool. Various algorithms and color quantization techniques. Provided as-is.
          </div>
        </div>
        <div className="p-3 border-t border-border text-center text-[9px] text-muted">
          &copy; {new Date().getFullYear()} TE-DITHER
        </div>
      </div>
    </div>
  )
}
