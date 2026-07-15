import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Puzzle, Timer, X, Lock, Sparkles, ChevronRight } from 'lucide-react'
import { PageTransition } from '@/components/layout/PageTransition'
import { GlassCard } from '@/components/ui/GlassCard'
import { ParticleField } from '@/components/background/ParticleField'
import { QuizGame } from '@/components/games/QuizGame'
import { MatchGame } from '@/components/games/MatchGame'
import { sfx } from '@/lib/sound'

type GameId = 'quiz' | 'match'

interface GameDef {
  id: GameId | string
  title: string
  desc: string
  icon: typeof Brain
  color: string
  playable: boolean
}

const games: GameDef[] = [
  { id: 'quiz', title: 'Quiz Anatómico', desc: 'Relaciona funciones con su órgano correcto.', icon: Brain, color: '#38d795', playable: true },
  { id: 'match', title: 'Empareja Órganos', desc: 'Une cada órgano con su función principal.', icon: Puzzle, color: '#22d3ee', playable: true },
  { id: 'clock', title: 'Contrarreloj', desc: 'Identifica estructuras antes de que acabe el tiempo.', icon: Timer, color: '#f59e0b', playable: false },
  { id: 'puzzle', title: 'Rompecabezas 3D', desc: 'Reconstruye el cuerpo pieza por pieza.', icon: Sparkles, color: '#a855f7', playable: false },
]

export default function Games() {
  const [active, setActive] = useState<GameId | null>(null)

  return (
    <PageTransition className="relative min-h-screen px-4 pb-20 pt-24 sm:px-6 sm:pt-28">
      <div className="aurora-bg absolute inset-0 -z-10" />
      <div className="absolute inset-0 -z-10 opacity-30">
        <ParticleField density={50} color="rgba(168,85,247,0.6)" linkColor="rgba(168,85,247," />
      </div>

      <div className="mx-auto max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
          <span className="inline-block rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-bio-300">
            Aprende jugando
          </span>
          <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl md:text-5xl">
            Mini<span className="text-gradient">-juegos</span>
          </h1>
          <p className="mt-3 text-white/60">Pon a prueba tus conocimientos y gana experiencia (XP).</p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
          {games.map((g, i) => {
            const Icon = g.icon
            return (
              <motion.div
                key={g.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <GlassCard
                  hover={g.playable}
                  glow={g.playable ? g.color : undefined}
                  className="relative h-full overflow-hidden p-5 sm:p-6"
                  onClick={
                    g.playable
                      ? () => {
                          sfx.select()
                          setActive(g.id as GameId)
                        }
                      : undefined
                  }
                >
                  {!g.playable && (
                    <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white/60">
                      <Lock size={12} /> Pronto
                    </div>
                  )}
                  <div
                    className="mb-4 grid h-14 w-14 place-items-center rounded-2xl text-black"
                    style={{ background: `linear-gradient(135deg, ${g.color}, ${g.color}aa)` }}
                  >
                    <Icon size={26} />
                  </div>
                  <h3 className="text-xl font-bold">{g.title}</h3>
                  <p className="mt-1.5 text-sm text-white/60">{g.desc}</p>
                  {g.playable && (
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-bio-300">
                      Jugar ahora <ChevronRight size={16} />
                    </span>
                  )}
                </GlassCard>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Game modal */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm"
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-strong relative w-full max-w-lg rounded-3xl p-5 sm:p-6"
            >
              <button
                type="button"
                aria-label="Cerrar juego"
                onClick={() => {
                  sfx.click()
                  setActive(null)
                }}
                className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white/70 hover:bg-white/20"
              >
                <X size={18} />
              </button>
              <h2 className="mb-4 text-xl font-bold">
                {games.find((g) => g.id === active)?.title}
              </h2>
              {active === 'quiz' && <QuizGame onExit={() => setActive(null)} />}
              {active === 'match' && <MatchGame onExit={() => setActive(null)} />}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  )
}
