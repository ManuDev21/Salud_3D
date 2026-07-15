import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  glow?: string
  onClick?: () => void
}

export function GlassCard({ children, className = '', hover = false, glow, onClick }: GlassCardProps) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={hover ? { y: -6, scale: 1.015 } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className={`glass rounded-3xl shadow-glass ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={glow ? { boxShadow: `0 0 40px ${glow}22, 0 8px 32px rgba(0,0,0,0.25)` } : undefined}
    >
      {children}
    </motion.div>
  )
}
