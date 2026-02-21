"use client"

import { useEffect, useRef, useMemo } from "react"

type MoodState = "neutral" | "happy" | "angry" | "sad" 

interface AnimatedBackgroundProps {
  mood: MoodState
  score: number
}

interface Star {
  x: number
  y: number
  size: number
  speed: number
  opacity: number
  twinkleSpeed: number
  twinkleOffset: number
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  life: number
  maxLife: number
  color: string
}

function getMoodColors(mood: MoodState, score: number) {
  const isCritical = score >= 12

  if (isCritical || mood === "angry" || mood === "fear" || mood === "sad" ) {
    return {
      bg1: "#0a0404",
      bg2: "#120606",
      glow: "rgba(232, 64, 64, 0.06)",
      particleColors: ["rgba(232, 64, 64, 0.4)", "rgba(255, 96, 96, 0.3)", "rgba(200, 32, 32, 0.35)", "rgba(255, 68, 68, 0.3)"],
      starColor: "rgba(255, 140, 140, VAR)",
      nebulaColor: "rgba(200, 40, 40, 0.03)",
      lineColor: "rgba(232, 64, 64, 0.04)",
      gridColor: "rgba(232, 64, 64, 0.015)",
    }
  }

  if (mood === "happy" ) {
    return {
      bg1: "#040a0d",
      bg2: "#061018",
      glow: "rgba(56, 232, 180, 0.04)",
      particleColors: ["rgba(56, 232, 180, 0.3)", "rgba(79, 216, 255, 0.25)", "rgba(56, 182, 232, 0.3)", "rgba(128, 255, 221, 0.25)"],
      starColor: "rgba(120, 230, 200, VAR)",
      nebulaColor: "rgba(56, 182, 232, 0.03)",
      lineColor: "rgba(56, 232, 180, 0.04)",
      gridColor: "rgba(56, 232, 180, 0.015)",
    }
  }

  return {
    bg1: "#050810",
    bg2: "#080d18",
    glow: "rgba(56, 182, 232, 0.03)",
    particleColors: ["rgba(56, 182, 232, 0.25)", "rgba(30, 144, 200, 0.2)", "rgba(79, 216, 255, 0.2)", "rgba(90, 112, 152, 0.2)"],
    starColor: "rgba(180, 200, 230, VAR)",
    nebulaColor: "rgba(30, 144, 200, 0.02)",
    lineColor: "rgba(56, 182, 232, 0.03)",
    gridColor: "rgba(56, 182, 232, 0.01)",
  }
}

export function AnimatedBackground({ mood, score }: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const starsRef = useRef<Star[]>([])
  const particlesRef = useRef<Particle[]>([])
  const targetColorsRef = useRef(getMoodColors("neutral", 0))

  const starCount = 180

  useMemo(() => {
    const stars: Star[] = []
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random(),
        y: Math.random(),
        size: Math.random() * 1.8 + 0.3,
        speed: Math.random() * 0.00008 + 0.00002,
        opacity: Math.random() * 0.7 + 0.15,
        twinkleSpeed: Math.random() * 0.015 + 0.003,
        twinkleOffset: Math.random() * Math.PI * 2,
      })
    }
    starsRef.current = stars
  }, [])

  useEffect(() => {
    targetColorsRef.current = getMoodColors(mood, score)
  }, [mood, score])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    let frame = 0

    const spawnParticle = (colors: string[]) => {
      if (particlesRef.current.length > 25) return
      particlesRef.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        size: Math.random() * 80 + 40,
        life: 0,
        maxLife: Math.random() * 400 + 300,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }

    const animate = () => {
      frame++
      const w = canvas.width
      const h = canvas.height
      const colors = targetColorsRef.current

      // Deep space background
      const bg = ctx.createRadialGradient(w * 0.5, h * 0.4, 0, w * 0.5, h * 0.5, Math.max(w, h) * 0.8)
      bg.addColorStop(0, colors.bg2)
      bg.addColorStop(1, colors.bg1)
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, w, h)

      // Subtle grid overlay
      ctx.strokeStyle = colors.gridColor
      ctx.lineWidth = 0.5
      const gridSize = 60
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, h)
        ctx.stroke()
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(w, y)
        ctx.stroke()
      }

      // Nebula clouds - very soft
      for (let i = 0; i < 4; i++) {
        const nx = w * (0.15 + i * 0.22) + Math.sin(frame * 0.0006 + i * 1.5) * 100
        const ny = h * (0.2 + i * 0.18) + Math.cos(frame * 0.0008 + i * 1.2) * 80
        const radius = 250 + Math.sin(frame * 0.001 + i) * 50
        const nebGrad = ctx.createRadialGradient(nx, ny, 0, nx, ny, radius)
        nebGrad.addColorStop(0, colors.nebulaColor)
        nebGrad.addColorStop(0.5, colors.nebulaColor.replace(")", "").replace("rgba", "").trim() ? colors.nebulaColor : "transparent")
        nebGrad.addColorStop(1, "transparent")
        ctx.fillStyle = nebGrad
        ctx.fillRect(0, 0, w, h)
      }

      // Stars with precise rendering
      starsRef.current.forEach((star) => {
        const twinkle = Math.sin(frame * star.twinkleSpeed + star.twinkleOffset)
        const currentOpacity = star.opacity * (0.4 + twinkle * 0.6)
        const sx = star.x * w
        const sy = ((star.y + frame * star.speed) % 1) * h

        // Star core
        ctx.beginPath()
        ctx.arc(sx, sy, star.size, 0, Math.PI * 2)
        ctx.fillStyle = colors.starColor.replace("VAR", String(currentOpacity))
        ctx.fill()

        // Cross flare on bright stars
        if (star.size > 1.2 && currentOpacity > 0.5) {
          const flareLen = star.size * 6
          const flareAlpha = currentOpacity * 0.15
          ctx.strokeStyle = colors.starColor.replace("VAR", String(flareAlpha))
          ctx.lineWidth = 0.5
          ctx.beginPath()
          ctx.moveTo(sx - flareLen, sy)
          ctx.lineTo(sx + flareLen, sy)
          ctx.stroke()
          ctx.beginPath()
          ctx.moveTo(sx, sy - flareLen)
          ctx.lineTo(sx, sy + flareLen)
          ctx.stroke()
        }

        // Subtle glow halo
        if (star.size > 1) {
          const gRad = star.size * 5
          const glowGrad = ctx.createRadialGradient(sx, sy, 0, sx, sy, gRad)
          glowGrad.addColorStop(0, colors.starColor.replace("VAR", String(currentOpacity * 0.12)))
          glowGrad.addColorStop(1, "transparent")
          ctx.fillStyle = glowGrad
          ctx.fillRect(sx - gRad, sy - gRad, gRad * 2, gRad * 2)
        }
      })

      // Floating energy particles
      if (frame % 40 === 0) {
        spawnParticle(colors.particleColors)
      }

      particlesRef.current = particlesRef.current.filter((p) => {
        p.life++
        p.x += p.vx
        p.y += p.vy
        const lifeRatio = p.life / p.maxLife
        const alpha = lifeRatio < 0.15
          ? lifeRatio / 0.15
          : lifeRatio > 0.85
            ? (1 - lifeRatio) / 0.15
            : 1

        const pGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size)
        pGrad.addColorStop(0, p.color.replace(/[\d.]+\)$/, `${alpha * 0.06})`))
        pGrad.addColorStop(0.5, p.color.replace(/[\d.]+\)$/, `${alpha * 0.02})`))
        pGrad.addColorStop(1, "transparent")
        ctx.fillStyle = pGrad
        ctx.fillRect(p.x - p.size, p.y - p.size, p.size * 2, p.size * 2)
        return p.life < p.maxLife
      })

      // Horizontal scan line - very subtle
      const scanY = (frame * 0.3) % h
      ctx.fillStyle = colors.lineColor
      ctx.fillRect(0, scanY, w, 1)

      // Vignette overlay
      const vignette = ctx.createRadialGradient(w / 2, h / 2, w * 0.25, w / 2, h / 2, w * 0.8)
      vignette.addColorStop(0, "transparent")
      vignette.addColorStop(1, "rgba(5, 8, 16, 0.4)")
      ctx.fillStyle = vignette
      ctx.fillRect(0, 0, w, h)

      animRef.current = requestAnimationFrame(animate)
    }

    animRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  )
}
