import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, UserRound, ArrowRight } from 'lucide-react'
import { ParticleField } from '@/components/background/ParticleField'
import { PageTransition } from '@/components/layout/PageTransition'
import { useAppStore } from '@/store/useAppStore'
import { sfx } from '@/lib/sound'
import type { Gender } from '@/types'

const options: { id: Gender; label: string; icon: typeof User; from: string; to: string; glow: string }[] = [
  { id: 'male', label: 'Hombre', icon: User, from: 'from-aurora-cyan/25', to: 'to-blue-500/10', glow: '#22d3ee' },
  { id: 'female', label: 'Mujer', icon: UserRound, from: 'from-aurora-pink/25', to: 'to-aurora-violet/10', glow: '#ec4899' },
]

export default function GenderSelect() {
  const navigate = useNavigate()
  const setGender = useAppStore((s) => s.setGender)

  const choose = (g: Gender) => {
    sfx.select()
    setGender(g)
    setTimeout(() => navigate('/explorar'), 350)
  }

  return (
    <PageTransition className="relative grid min-h-screen place-items-center overflow-hidden px-4 pt-20 sm:px-6">
      <div className="aurora-bg absolute inset-0" />
      <div className="absolute inset-0 opacity-50">
        <ParticleField density={60} />
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
            Elige tu <span className="text-gradient">modelo 3D</span>
          </h1>
          <p className="mt-3 text-white/60">Podrás cambiarlo en cualquier momento durante la exploración.</p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
          {options.map((o, i) => {
            const Icon = o.icon
            return (
              <motion.button
                key={o.id}
                type="button"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.12 }}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => choose(o.id)}
                onMouseEnter={() => sfx.hover()}
                className={`group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-gradient-to-br ${o.from} ${o.to} p-8 text-left backdrop-blur-xl sm:rounded-[2rem] sm:p-10`}
                style={{ boxShadow: `0 0 50px ${o.glow}22` }}
              >
                <div
                  className="mb-5 grid h-20 w-20 place-items-center rounded-3xl text-white transition-transform duration-500 group-hover:scale-110 sm:mb-6 sm:h-24 sm:w-24"
                  style={{ background: `${o.glow}22`, boxShadow: `0 0 40px ${o.glow}44` }}
                >
                  <Icon size={44} strokeWidth={1.6} />
                </div>
                <h2 className="text-3xl font-extrabold">{o.label}</h2>
                <p className="mt-2 text-white/60">Modelo anatómico detallado con todos los sistemas.</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white transition-transform group-hover:translate-x-1">
                  Explorar <ArrowRight size={16} />
                </span>
                <div
                  className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-30 blur-2xl transition-opacity group-hover:opacity-60"
                  style={{ background: o.glow }}
                />
              </motion.button>
            )
          })}
        </div>
      </div>
    </PageTransition>
  )
}
