import { motion } from 'framer-motion'
import {
  Trophy,
  Sparkles,
  Compass,
  Award,
  Layers,
  GraduationCap,
  Star,
  Target,
  RotateCcw,
  Lock,
} from 'lucide-react'
import { PageTransition } from '@/components/layout/PageTransition'
import { GlassCard } from '@/components/ui/GlassCard'
import { ParticleField } from '@/components/background/ParticleField'
import { ACHIEVEMENTS, getLevelFromXp, getLevelProgress, LEVEL_XP } from '@/data/achievements'
import { ORGANS } from '@/data/organs'
import { useAppStore } from '@/store/useAppStore'
import { sfx } from '@/lib/sound'

const iconMap: Record<string, typeof Trophy> = {
  Sparkles,
  Compass,
  Award,
  Layers,
  Trophy,
  GraduationCap,
}

export default function Progress() {
  const xp = useAppStore((s) => s.xp)
  const exploredOrgans = useAppStore((s) => s.exploredOrgans)
  const unlocked = useAppStore((s) => s.unlockedAchievements)
  const gamesWon = useAppStore((s) => s.gamesWon)
  const correctAnswers = useAppStore((s) => s.correctAnswers)
  const resetProgress = useAppStore((s) => s.resetProgress)

  const level = getLevelFromXp(xp)
  const progress = getLevelProgress(xp)
  const xpInLevel = xp % LEVEL_XP

  const stats = [
    { icon: Star, label: 'XP Total', value: xp, color: '#f5d547' },
    { icon: Compass, label: 'Órganos explorados', value: `${exploredOrgans.length}/${ORGANS.length}`, color: '#38d795' },
    { icon: Target, label: 'Respuestas correctas', value: correctAnswers, color: '#22d3ee' },
    { icon: Trophy, label: 'Juegos ganados', value: gamesWon, color: '#a855f7' },
  ]

  return (
    <PageTransition className="relative min-h-screen px-6 pb-20 pt-28">
      <div className="aurora-bg absolute inset-0 -z-10" />
      <div className="absolute inset-0 -z-10 opacity-30">
        <ParticleField density={45} />
      </div>

      <div className="mx-auto max-w-5xl">
        {/* Level card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <GlassCard className="relative overflow-hidden p-8">
            <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-bio-500/20 blur-3xl" />
            <div className="relative flex flex-col items-center gap-6 sm:flex-row sm:items-center">
              <div className="relative grid h-28 w-28 shrink-0 place-items-center">
                <svg className="absolute inset-0 h-full w-full -rotate-90">
                  <circle cx="56" cy="56" r="50" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                  <motion.circle
                    cx="56"
                    cy="56"
                    r="50"
                    fill="none"
                    stroke="url(#grad)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 50}
                    initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 50 * (1 - progress) }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                  <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor="#38d795" />
                      <stop offset="1" stopColor="#22d3ee" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="text-center">
                  <div className="text-3xl font-extrabold text-gradient">{level}</div>
                  <div className="text-[10px] uppercase tracking-widest text-white/50">Nivel</div>
                </div>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-2xl font-extrabold">Tu progreso</h1>
                <p className="mt-1 text-white/60">
                  {xpInLevel} / {LEVEL_XP} XP para el nivel {level + 1}
                </p>
                <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-bio-400 to-aurora-cyan"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress * 100}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  sfx.click()
                  resetProgress()
                }}
                className="flex items-center gap-1.5 rounded-xl bg-white/5 px-3 py-2 text-xs text-white/50 hover:bg-white/10 hover:text-white"
              >
                <RotateCcw size={14} /> Reiniciar
              </button>
            </div>
          </GlassCard>
        </motion.div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s, i) => {
            const Icon = s.icon
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06 }}
              >
                <GlassCard className="p-5">
                  <Icon size={22} style={{ color: s.color }} />
                  <div className="mt-3 text-2xl font-extrabold">{s.value}</div>
                  <div className="text-xs text-white/50">{s.label}</div>
                </GlassCard>
              </motion.div>
            )
          })}
        </div>

        {/* Achievements */}
        <h2 className="mb-4 mt-10 flex items-center gap-2 text-xl font-bold">
          <Award size={20} className="text-bio-300" /> Insignias y logros
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ACHIEVEMENTS.map((a, i) => {
            const Icon = iconMap[a.icon] ?? Award
            const isUnlocked = unlocked.includes(a.id)
            return (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <GlassCard className={`flex items-center gap-4 p-4 ${isUnlocked ? '' : 'opacity-60'}`}>
                  <div
                    className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl ${
                      isUnlocked
                        ? 'bg-gradient-to-br from-bio-500 to-aurora-cyan text-black'
                        : 'bg-white/10 text-white/40'
                    }`}
                  >
                    {isUnlocked ? <Icon size={26} /> : <Lock size={22} />}
                  </div>
                  <div>
                    <div className="font-bold">{a.name}</div>
                    <div className="text-xs text-white/55">{a.description}</div>
                    <div className="mt-1 text-xs font-semibold text-bio-300">+{a.xp} XP</div>
                  </div>
                </GlassCard>
              </motion.div>
            )
          })}
        </div>
      </div>
    </PageTransition>
  )
}
