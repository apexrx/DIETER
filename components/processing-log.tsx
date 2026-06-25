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
      <div className="flex justify-between items-center border-b border-border pb-1">
        <div className="text-[11px] uppercase font-bold tracking-[1px]">Processing Log</div>
        <button
          className="px-2 py-1 text-[11px] uppercase font-bold bg-transparent hover:bg-surface"
          onClick={saveLog}
        >
          <Save className="h-3 w-3 inline-block mr-1" />
          Save Log
        </button>
      </div>
      <div>
        <div
          ref={logRef}
          className="te-screen text-[11px] p-1 h-[500px] overflow-y-auto"
        >
            {entries.length === 0 ? (
              <div className="p-2 text-muted">No log entries yet</div>
            ) : (
              entries.map((entry, index) => (
                <div key={index} className="whitespace-nowrap">
                  <span className="timestamp">[{entry.timestamp}]</span>{" "}
                  <span
                    className={
                      entry.type === "ERROR"
                        ? "text-accent"
                        : entry.type === "INIT"
                          ? "text-screen-text"
                          : entry.type === "BATCH" || entry.type === "PALETTE"
                            ? "text-muted"
                            : "text-screen-text"
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
  )
}
