import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home } from 'lucide-react'
import { PageTransition } from '@/components/layout/PageTransition'
import { ParticleField } from '@/components/background/ParticleField'
import { sfx } from '@/lib/sound'

export default function NotFound() {
  return (
    <PageTransition className="relative grid min-h-screen place-items-center overflow-hidden px-6">
      <div className="aurora-bg absolute inset-0" />
      <div className="absolute inset-0 opacity-40">
        <ParticleField density={50} />
      </div>
      <div className="relative z-10 text-center">
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-8xl font-black text-gradient"
        >
          404
        </motion.h1>
        <p className="mt-4 text-lg text-white/60">Esta estructura anatómica no existe.</p>
        <Link to="/" className="btn-primary mt-8" onClick={() => sfx.click()}>
          <Home size={18} /> Volver al inicio
        </Link>
      </div>
    </PageTransition>
  )
}
