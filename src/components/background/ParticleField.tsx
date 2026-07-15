import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  r: number
}

interface ParticleFieldProps {
  density?: number
  className?: string
  color?: string
  linkColor?: string
}

/** Lightweight interactive particle network rendered on a 2D canvas. */
export function ParticleField({
  density = 70,
  className = '',
  color = 'rgba(56, 215, 149, 0.7)',
  linkColor = 'rgba(56, 215, 149, ',
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouse = useRef({ x: -9999, y: -9999 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let width = (canvas.width = canvas.offsetWidth)
    let height = (canvas.height = canvas.offsetHeight)
    let raf = 0

    const count = Math.min(density, Math.floor((width * height) / 14000))
    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 0.8,
    }))

    const onResize = () => {
      width = canvas.width = canvas.offsetWidth
      height = canvas.height = canvas.offsetHeight
    }
    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    const onLeave = () => (mouse.current = { x: -9999, y: -9999 })

    window.addEventListener('resize', onResize)
    canvas.addEventListener('mousemove', onMove)
    canvas.addEventListener('mouseleave', onLeave)

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > width) p.vx *= -1
        if (p.y < 0 || p.y > height) p.vy *= -1

        const dx = p.x - mouse.current.x
        const dy = p.y - mouse.current.y
        const dist = Math.hypot(dx, dy)
        if (dist < 140) {
          p.x += (dx / dist) * 0.6
          p.y += (dy / dist) * 0.6
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.fill()
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i]
          const b = particles[j]
          const d = Math.hypot(a.x - b.x, a.y - b.y)
          if (d < 120) {
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = `${linkColor}${(1 - d / 120) * 0.25})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        }
      }
      raf = requestAnimationFrame(draw)
    }

    if (reduce) {
      draw() // single static frame
    } else {
      draw()
    }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      canvas.removeEventListener('mousemove', onMove)
      canvas.removeEventListener('mouseleave', onLeave)
    }
  }, [density, color, linkColor])

  return <canvas ref={canvasRef} className={`h-full w-full ${className}`} aria-hidden="true" />
}
