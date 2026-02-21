"use client"

import { useRef, useEffect } from "react"
import { Terminal, Send, ChevronRight } from "lucide-react"
import Image from "next/image"

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

interface ChatTerminalProps {
  chatHistory: ChatMessage[]
  input: string
  onInputChange: (value: string) => void
  onSend: (e: React.FormEvent) => void
  identity: string
  isCritical: boolean
}

export function ChatTerminal({
  chatHistory,
  input,
  onInputChange,
  onSend,
  identity,
  isCritical,
}: ChatTerminalProps) {
  const chatEndRef = useRef<HTMLDivElement>(null)
  const accent = isCritical ? "#e84040" : "#38b6e8"
  const panelClass = isCritical ? "hud-panel-critical" : "hud-panel"

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatHistory])

  return (
    <div className={`${panelClass} rounded-xl overflow-hidden transition-all duration-700`}>
      {/* Terminal header */}
      <div
        className="flex items-center gap-2 px-4 py-2.5 font-mono text-[10px] tracking-[0.2em]"
        style={{
          color: accent,
          borderBottom: `1px solid ${accent}15`,
          backgroundColor: "rgba(5, 8, 16, 0.5)",
        }}
      >
        <Terminal size={12} />
        <span>PSYCH-LINK TERMINAL</span>
        <div className="ml-auto flex items-center gap-3">
          <span className="text-[8px] tracking-wider" style={{ color: "#5a7098" }}>
            SESSION ACTIVE
          </span>
          <div className="flex items-center gap-1.5">
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: accent, boxShadow: `0 0 6px ${accent}60` }}
            />
            <span style={{ color: "#5a7098" }} className="text-[9px]">LIVE</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        className="overflow-y-auto px-4 py-4 flex flex-col gap-3"
        style={{ maxHeight: "400px", minHeight: "300px" }}
      >
        {chatHistory.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="relative w-12 h-12 rounded-full overflow-hidden" style={{ border: `1px solid ${accent}30` }}>
              <Image
                src="/images/robot-peek.jpg"
                alt="ARES AI"
                width={48}
                height={48}
                className="w-full h-full object-cover opacity-60"
              />
            </div>
            <div className="text-center">
              <p className="text-[10px] font-mono tracking-[0.2em] mb-2" style={{ color: "#5a7098" }}>
                PSYCH-LINK READY
              </p>
              <div className="flex items-center justify-center gap-1">
                {[0, 0.15, 0.3].map((delay, i) => (
                  <span
                    key={i}
                    className="inline-block w-1 h-1 rounded-full animate-pulse"
                    style={{ backgroundColor: accent, animationDelay: `${delay}s` }}
                  />
                ))}
              </div>
            </div>
            <p className="text-[9px] font-mono tracking-wider" style={{ color: "#5a709860" }}>
              Awaiting biometric data stream...
            </p>
          </div>
        )}

        {chatHistory.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} gap-2`}
          >
            {/* Robot avatar for assistant */}
            {m.role === "assistant" && (
              <div className="flex-shrink-0 self-end">
                <div
                  className="w-7 h-7 rounded-full overflow-hidden"
                  style={{ border: `1px solid ${accent}40` }}
                >
                  <Image
                    src="/images/robot-peek.jpg"
                    alt="ARES_AI"
                    width={28}
                    height={28}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            <div
              className="max-w-[75%] rounded-lg px-4 py-3 transition-all duration-500"
              style={
                m.role === "user"
                  ? {
                      backgroundColor: `${accent}08`,
                      border: `1px solid ${accent}15`,
                      color: "#e0e8f5",
                    }
                  : {
                      backgroundColor: isCritical ? "rgba(232, 64, 64, 0.05)" : "rgba(30, 144, 200, 0.05)",
                      border: `1px solid ${isCritical ? "rgba(232, 64, 64, 0.12)" : "rgba(30, 144, 200, 0.1)"}`,
                      color: "#e0e8f5",
                    }
              }
            >
              <span
                className="block text-[8px] font-mono tracking-[0.25em] mb-1.5"
                style={{
                  color: m.role === "user" ? `${accent}90` : isCritical ? "#e8404090" : "#1e90c890",
                }}
              >
                {m.role === "user"
                  ? identity !== "STANDBY" ? identity : "CREW_MEMBER"
                  : "ARES_AI"}
              </span>
              <p className="text-[13px] leading-relaxed font-light">{m.content}</p>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={onSend}
        className="flex items-center gap-3 px-4 py-3"
        style={{
          borderTop: `1px solid ${accent}10`,
          backgroundColor: "rgba(5, 8, 16, 0.4)",
        }}
      >
        <ChevronRight size={14} style={{ color: `${accent}50` }} className="flex-shrink-0" />
        <input
          className="flex-1 bg-transparent px-2 py-2 text-sm font-mono rounded-md focus:outline-none transition-all placeholder:tracking-wider"
          style={{
            color: "#e0e8f5",
            caretColor: accent,
          }}
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Enter mission report..."
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="group p-2 rounded-md transition-all duration-300 disabled:opacity-20 hover:scale-105"
          style={{
            backgroundColor: `${accent}10`,
            color: accent,
            border: `1px solid ${accent}20`,
          }}
          aria-label="Send message"
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  )
}
