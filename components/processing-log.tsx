"use client"

import { useRef, useEffect } from "react"
import { Save } from "lucide-react"
import type { LogEntry } from "@/lib/types"

interface ProcessingLogProps {
  entries: LogEntry[]
}

export default function ProcessingLog({ entries }: ProcessingLogProps) {
  const logRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new entries are added
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight
    }
  }, [entries])

  const saveLog = () => {
    const logText = entries.map((entry) => `[${entry.timestamp}] [${entry.type}] ${entry.message}`).join("\n")

    const blob = new Blob([logText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `dieter_log_${new Date().toISOString().replace(/:/g, "-")}.txt`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-2">
      <div className="border border-[#999999] bg-[#e8e8e8]">
        <div className="bg-[#d0d0d0] border-b border-[#999999] p-1 flex justify-between items-center">
          <div className="text-[12px] uppercase font-bold tracking-[1px]">Processing Log</div>
          <button
            className="px-2 py-1 text-[11px] uppercase font-bold border border-[#999999] bg-[#d8d8d8] hover:bg-[#e8e8e8]"
            onClick={saveLog}
          >
            <Save className="h-3 w-3 inline-block mr-1" />
            Save Log
          </button>
        </div>
        <div className="p-2">
          <div
            ref={logRef}
            className="border border-[#999999] bg-[#000000] text-[#00ff00] font-mono text-[11px] p-1 h-[500px] overflow-y-auto"
          >
            {entries.length === 0 ? (
              <div className="p-2">No log entries yet</div>
            ) : (
              entries.map((entry, index) => (
                <div key={index} className="whitespace-nowrap">
                  <span className="text-[#cccccc]">[{entry.timestamp}]</span>{" "}
                  <span
                    className={
                      entry.type === "ERROR"
                        ? "text-[#ff0000]"
                        : entry.type === "INIT"
                          ? "text-[#ffffff]"
                          : entry.type === "BATCH"
                            ? "text-[#ffcc00]"
                            : entry.type === "PALETTE"
                              ? "text-[#00ccff]"
                              : "text-[#00ff00]"
                    }
                  >
                    [{entry.type}]
                  </span>{" "}
                  <span>{entry.message}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
