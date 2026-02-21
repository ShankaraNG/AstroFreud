"use client"

import { User, AlertTriangle, Activity, Zap, Shield } from "lucide-react"

interface StatsCardProps {
  identity: string
  mood: string
  score: number
  loading: boolean
  isCritical: boolean
  onScan: () => void
}

export function StatsCard({
  identity,
  mood,
  score,
  loading,
  isCritical,
  onScan,
}: StatsCardProps) {
  const accent = isCritical ? "#e84040" : "#38b6e8"
  const accentDim = isCritical ? "#e8404025" : "#38b6e825"
  const panelClass = isCritical ? "hud-panel-critical" : "hud-panel"

  const scorePercent = (score / 20) * 100
  const segments = 20

  return (
    <div className={`${panelClass} rounded-xl overflow-hidden transition-all duration-700`}>
      {/* Header */}
      <div
        className="flex items-center gap-2 px-4 py-2.5 font-mono text-[10px] tracking-[0.2em]"
        style={{
          color: accent,
          borderBottom: `1px solid ${accent}15`,
          backgroundColor: "rgba(5, 8, 16, 0.5)",
        }}
      >
        <Shield size={12} />
        <span>CREW ANALYSIS</span>
        {isCritical && (
          <AlertTriangle size={12} className="ml-auto animate-pulse" style={{ color: "#e84040" }} />
        )}
      </div>

      <div className="p-5 flex flex-col gap-5">
        {/* Identity block */}
        <div className="flex items-start gap-4">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: accentDim, border: `1px solid ${accent}20` }}
          >
            <User size={18} style={{ color: accent }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[9px] font-mono tracking-[0.25em] mb-1" style={{ color: "#5a7098" }}>
              IDENTIFIED PERSONNEL
            </p>
            <h2
              className="text-lg font-bold tracking-wide truncate transition-colors duration-500"
              style={{ color: accent }}
            >
              {identity}
            </h2>
          </div>
        </div>

        {/* Stress Index - segmented bar */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap size={12} style={{ color: accent }} />
              <p className="text-[9px] font-mono tracking-[0.25em]" style={{ color: "#5a7098" }}>
                STRESS INDEX
              </p>
            </div>
            <span className="text-xl font-bold font-mono tabular-nums" style={{ color: accent }}>
              {score}
              <span className="text-[10px] font-normal" style={{ color: "#5a7098" }}>{' / 20'}</span>
            </span>
          </div>

          {/* Segmented gauge */}
          <div className="flex gap-0.5">
            {Array.from({ length: segments }).map((_, i) => {
              const filled = i < Math.round(scorePercent / (100 / segments))
              return (
                <div
                  key={i}
                  className="h-2 flex-1 rounded-[1px] transition-all duration-500"
                  style={{
                    backgroundColor: filled ? accent : `${accent}10`,
                    boxShadow: filled ? `0 0 6px ${accent}40` : "none",
                  }}
                />
              )
            })}
          </div>

          {/* Sub labels */}
          <div className="flex justify-between mt-1.5">
            <span className="text-[8px] font-mono tracking-wider" style={{ color: "#5a709860" }}>NOMINAL</span>
            <span className="text-[8px] font-mono tracking-wider" style={{ color: "#5a709860" }}>CRITICAL</span>
          </div>
        </div>

        {/* Mood indicator */}
        <div
          className="flex items-center gap-3 px-3 py-3 rounded-lg"
          style={{ backgroundColor: `${accent}08`, border: `1px solid ${accent}12` }}
        >
          <div
            className="w-8 h-8 rounded-md flex items-center justify-center"
            style={{ backgroundColor: `${accent}15` }}
          >
            <Activity size={14} style={{ color: accent }} />
          </div>
          <div className="flex-1">
            <p className="text-[8px] font-mono tracking-[0.25em]" style={{ color: "#5a7098" }}>
              DETECTED AFFECT
            </p>
            <p className="text-sm font-bold tracking-[0.15em] font-mono" style={{ color: accent }}>
              {mood.toUpperCase()}
            </p>
          </div>
          <div
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: accent, boxShadow: `0 0 8px ${accent}60` }}
          />
        </div>

        {/* Scan button */}
        <button
          onClick={onScan}
          disabled={loading}
          className="group relative w-full py-3 rounded-lg font-mono text-[10px] tracking-[0.25em] transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 overflow-hidden"
          style={{
            backgroundColor: `${accent}10`,
            color: accent,
            border: `1px solid ${accent}25`,
          }}
        >
          {/* Hover glow */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: `radial-gradient(ellipse at center, ${accent}10 0%, transparent 70%)`,
            }}
          />
          <span className="relative z-10">
            {loading ? "CALIBRATING..." : "INITIATE BIOMETRIC SCAN"}
          </span>
        </button>
      </div>
    </div>
  )
}
