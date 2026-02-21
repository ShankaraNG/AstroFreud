"use client"

import { AlertTriangle, Satellite, Signal } from "lucide-react"
import Image from "next/image"

interface HeaderProps {
  isCritical: boolean
  message: string
}

export function Header({ isCritical, message }: HeaderProps) {
  const accent = isCritical ? "#e84040" : "#38b6e8"

  return (
    <header className="relative pt-5 pb-4">
      {/* Top thin line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent}33, transparent)`,
        }}
      />

      <div className="flex items-center justify-between">
        {/* Logo + Title */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <Image
              src="/images/logo.png"
              alt="AstroBurrus Logo"
              width={40}
              height={40}
              className="rounded-lg"
            />
            {/* Orbital ring */}
            <div
              className="absolute -inset-1.5 rounded-lg pointer-events-none"
              style={{
                border: `1px solid ${accent}15`,
              }}
            />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-wide" style={{ color: "#e0e8f5" }}>
              <span className="hud-text-shimmer">AstroBurrus</span>
            </h1>
            <div className="flex items-center gap-2">
              <span
                className="inline-block w-1 h-1 rounded-full"
                style={{ backgroundColor: accent }}
              />
              <span
                className="text-[9px] font-mono tracking-[0.3em] uppercase"
                style={{ color: "#5a7098" }}
              >
                Command Hub v0.9
              </span>
            </div>
          </div>
        </div>

        {/* Center - Status */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md" style={{ backgroundColor: "rgba(10, 15, 30, 0.6)", border: "1px solid rgba(56, 182, 232, 0.08)" }}>
            <Signal size={10} style={{ color: "#5a7098" }} />
            <span className="text-[10px] font-mono tracking-wider" style={{ color: "#5a7098" }}>
              {message}
            </span>
          </div>
        </div>

        {/* Right - Status indicators */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md" style={{ backgroundColor: "rgba(10, 15, 30, 0.6)", border: "1px solid rgba(56, 182, 232, 0.08)" }}>
            <Satellite size={10} style={{ color: "#5a7098" }} />
            <span className="text-[9px] font-mono tracking-wider" style={{ color: "#5a7098" }}>UPLINK</span>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: "#40e870" }} />
          </div>

          {isCritical && (
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-md"
              style={{
                backgroundColor: "rgba(232, 64, 64, 0.08)",
                border: "1px solid rgba(232, 64, 64, 0.2)",
              }}
            >
              <AlertTriangle size={12} className="animate-pulse" style={{ color: "#e84040" }} />
              <span className="text-[9px] font-mono tracking-[0.2em]" style={{ color: "#e84040" }}>
                ALERT
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom separator */}
      <div
        className="mt-4 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent}20, ${accent}08, transparent)`,
        }}
      />
    </header>
  )
}
