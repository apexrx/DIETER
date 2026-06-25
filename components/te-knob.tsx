"use client"

import { useRef, useCallback, useState } from "react"

interface TEKnobProps {
  value: number
  min: number
  max: number
  step?: number
  label: string
  onChange: (value: number) => void
  size?: number
}

export default function TEKnob({ value, min, max, step = 1, label, onChange, size = 52 }: TEKnobProps) {
  const knobRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const lastY = useRef(0)
  const currentValue = useRef(value)
  const [isDragging, setIsDragging] = useState(false)
  currentValue.current = value

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    dragging.current = true
    setIsDragging(true)
    lastY.current = e.clientY
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return
      const delta = lastY.current - e.clientY
      lastY.current = e.clientY
      let newVal = currentValue.current + delta * step
      newVal = Math.max(min, Math.min(max, newVal))
      newVal = step >= 1 ? Math.round(newVal) : Math.round(newVal / step) * step
      onChange(newVal)
    }
    const handleMouseUp = () => {
      dragging.current = false
      setIsDragging(false)
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }, [min, max, step, onChange])

  const cx = size / 2
  const cy = size / 2
  const baseR = size / 2 - 1
  const bodyR = size / 2 - 3
  const tickR = size / 2 - 4
  const angle = ((value - min) / (max - min)) * 270 - 225
  const rad = (angle * Math.PI) / 180
  const dotR = 3
  const dotX = cx + (bodyR - dotR - 3) * Math.cos(rad)
  const dotY = cy + (bodyR - dotR - 3) * Math.sin(rad)

  return (
    <div className="te-knob-wrap">
      <div ref={knobRef} onMouseDown={handleMouseDown} style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className={`te-knob-svg ${isDragging ? "dragging" : ""}`}
        >
          <defs>
            <radialGradient id={`body-${label.replace(/\s/g, "")}`} cx="35%" cy="30%">
              <stop offset="0%" stopColor="#3a3530" />
              <stop offset="100%" stopColor="#1a1815" />
            </radialGradient>
          </defs>

          {/* Layer 1: recessed mounting hole */}
          <circle cx={cx} cy={cy} r={baseR} fill="#0d0c0b" />

          {/* Layer 2: raised body */}
          <circle
            cx={cx}
            cy={cy}
            r={bodyR}
            fill={`url(#body-${label.replace(/\s/g, "")})`}
          />
          {/* Inset top highlight */}
          <path
            d={`M ${cx - bodyR + 1.5} ${cy} A ${bodyR - 1.5} ${bodyR - 1.5} 0 0 1 ${cx + bodyR - 1.5} ${cy}`}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
            fill="none"
          />

          {/* Layer 3: grip ring ticks */}
          <circle
            cx={cx}
            cy={cy}
            r={tickR}
            fill="none"
            stroke="#2a2825"
            strokeWidth="2"
            strokeDasharray="2 3"
          />

          {/* Layer 4: indicator dot */}
          <circle cx={dotX} cy={dotY} r={dotR} fill="var(--accent)" className="knob-dot" />

          {/* Layer 5: shine */}
          <ellipse
            cx={cx - bodyR * 0.3}
            cy={cy - bodyR * 0.3}
            rx={bodyR * 0.35}
            ry={bodyR * 0.18}
            fill="white"
            opacity="0.15"
            transform={`rotate(-30, ${cx - bodyR * 0.3}, ${cy - bodyR * 0.3})`}
          />
        </svg>
      </div>
      <span className="te-knob-lcd">{value}</span>
      <span className="te-knob-label">{label}</span>
    </div>
  )
}
