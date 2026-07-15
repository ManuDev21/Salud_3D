import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Bomb, RotateCcw, Layers, Baby, GraduationCap, Stethoscope, ChevronRight, Info } from 'lucide-react'
import { AnatomyScene } from '@/three/AnatomyScene'
import { OrganPanel } from '@/components/explorer/OrganPanel'
import { SystemDetailPanel } from '@/components/explorer/SystemDetailPanel'
import { PageTransition } from '@/components/layout/PageTransition'
import { SYSTEMS, getSystem } from '@/data/systems'
import { getOrgan, getOrgansBySystem } from '@/data/organs'
import { useAppStore } from '@/store/useAppStore'
import { sfx } from '@/lib/sound'
import type { LearningLevel, SystemId } from '@/types'

const levels: { id: LearningLevel; label: string; icon: typeof Baby }[] = [
  { id: 'kids', label: 'Infantil', icon: Baby },
  { id: 'student', label: 'Estudiante', icon: GraduationCap },
  { id: 'pro', label: 'Profesional', icon: Stethoscope },
]

export default function Explorer() {
  const navigate = useNavigate()
  const [hovered, setHovered] = useState<string | null>(null)
  const [panelOpen, setPanelOpen] = useState(true)
  const [detailSystem, setDetailSystem] = useState<SystemId | null>(null)

  const gender = useAppStore((s) => s.gender)
  const activeSystems = useAppStore((s) => s.activeSystems)
  const toggleSystem = useAppStore((s) => s.toggleSystem)
  const selectedOrgan = useAppStore((s) => s.selectedOrgan)
  const selectOrgan = useAppStore((s) => s.selectOrgan)
  const explode = useAppStore((s) => s.explodeAmount)
  const setExplode = useAppStore((s) => s.setExplode)
  const transparent = useAppStore((s) => s.transparent)
  const toggleTransparent = useAppStore((s) => s.toggleTransparent)
  const learningLevel = useAppStore((s) => s.learningLevel)
  const setLearningLevel = useAppStore((s) => s.setLearningLevel)
  const setActiveSystems = useAppStore((s) => s.setActiveSystems)

  if (!gender) {
    navigate('/elegir')
    return null
  }

  const organ = selectedOrgan ? getOrgan(selectedOrgan) : null
  const systemDetail = detailSystem ? getSystem(detailSystem) : null

  return (
    <PageTransition className="relative h-screen w-full overflow-hidden">
      {/* 3D canvas fills the screen */}
      <div className="absolute inset-0">
        <AnatomyScene gender={gender} onHover={setHovered} />
      </div>

      {/* Hover hint */}
      <AnimatePresence>
        {hovered && !organ && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute bottom-24 left-1/2 z-20 -translate-x-1/2 rounded-full border border-white/15 bg-black/60 px-4 py-2 text-sm backdrop-blur-md"
          >
            Clic para explorar · <span className="font-semibold text-bio-300">{getOrgan(hovered)?.name}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Systems side panel */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-30 flex items-center pl-3 pt-16">
        <motion.div
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: panelOpen ? 0 : -230, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 220, damping: 26 }}
          className="pointer-events-auto relative"
        >
          <div className="glass-strong w-64 rounded-2xl p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-white/70">
              <Layers size={16} className="text-bio-300" /> Sistemas
            </div>
            <div className="flex max-h-[52vh] flex-col gap-1.5 overflow-y-auto pr-1">
              {SYSTEMS.map((s) => {
                const active = activeSystems.includes(s.id)
                return (
                  <div
                    key={s.id}
                    className={`group flex items-center gap-1 rounded-xl pr-1 transition-all ${
                      active ? 'bg-white/15 font-semibold' : 'text-white/60 hover:bg-white/8'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        sfx.click()
                        toggleSystem(s.id)
                      }}
                      onMouseEnter={() => sfx.hover()}
                      className="flex flex-1 items-center gap-3 rounded-xl px-3 py-2 text-left text-sm"
                    >
                      <span
                        className="h-3 w-3 shrink-0 rounded-full transition-all"
                        style={{
                          background: s.color,
                          boxShadow: active ? `0 0 10px ${s.glow}` : 'none',
                          opacity: active ? 1 : 0.4,
                        }}
                      />
                      {s.shortName}
                    </button>
                    <button
                      type="button"
                      aria-label={`Detalles de ${s.name}`}
                      onClick={() => {
                        sfx.select()
                        setDetailSystem(s.id)
                      }}
                      className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-white/40 opacity-0 transition-all hover:bg-white/15 hover:text-white group-hover:opacity-100"
                    >
                      <Info size={14} />
                    </button>
                  </div>
                )
              })}
            </div>
            <button
              type="button"
              onClick={() => {
                sfx.click()
                setActiveSystems([])
              }}
              className="mt-3 w-full rounded-xl bg-white/5 px-3 py-2 text-xs text-white/60 hover:bg-white/10"
            >
              Ocultar todos
            </button>
          </div>

          <button
            type="button"
            aria-label={panelOpen ? 'Ocultar panel' : 'Mostrar panel'}
            onClick={() => {
              sfx.click()
              setPanelOpen((v) => !v)
            }}
            className="absolute -right-3 top-4 grid h-8 w-8 place-items-center rounded-full bg-bio-500 text-black shadow-glow"
          >
            <motion.div animate={{ rotate: panelOpen ? 180 : 0 }}>
              <ChevronRight size={16} />
            </motion.div>
          </button>
        </motion.div>
      </div>

      {/* Bottom controls */}
      <div className="absolute inset-x-0 bottom-0 z-30 flex justify-center px-4 pb-4">
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 24 }}
          className="glass-strong flex flex-wrap items-center gap-3 rounded-2xl px-4 py-3"
        >
          {/* Learning level segmented control */}
          <div className="flex items-center gap-1 rounded-xl bg-white/5 p-1">
            {levels.map((l) => {
              const Icon = l.icon
              const active = learningLevel === l.id
              return (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => {
                    sfx.click()
                    setLearningLevel(l.id)
                  }}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                    active ? 'bg-bio-500 text-black' : 'text-white/60 hover:text-white'
                  }`}
                >
                  <Icon size={14} /> <span className="hidden sm:block">{l.label}</span>
                </button>
              )
            })}
          </div>

          <div className="h-8 w-px bg-white/10" />

          {/* Explode slider */}
          <div className="flex items-center gap-2">
            <Bomb size={16} className="text-white/60" />
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={explode}
              onChange={(e) => setExplode(parseFloat(e.target.value))}
              aria-label="Explosión anatómica"
              className="h-1.5 w-28 cursor-pointer appearance-none rounded-full bg-white/20 accent-bio-400"
            />
          </div>

          {/* Transparent toggle */}
          <button
            type="button"
            onClick={() => {
              sfx.click()
              toggleTransparent()
            }}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
              transparent ? 'bg-aurora-cyan/25 text-aurora-cyan' : 'bg-white/5 text-white/60 hover:text-white'
            }`}
          >
            {transparent ? <Eye size={15} /> : <EyeOff size={15} />}
            <span className="hidden sm:block">Rayos X</span>
          </button>

          {/* Reset */}
          <button
            type="button"
            aria-label="Reiniciar vista"
            onClick={() => {
              sfx.click()
              setExplode(0)
              selectOrgan(null)
            }}
            className="grid h-9 w-9 place-items-center rounded-xl bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
          >
            <RotateCcw size={16} />
          </button>
        </motion.div>
      </div>

      {/* Organ detail panel */}
      <AnimatePresence>
        {organ && <OrganPanel organ={organ} onClose={() => selectOrgan(null)} />}
      </AnimatePresence>

      {/* System detail panel */}
      <AnimatePresence>
        {systemDetail && (
          <SystemDetailPanel
            system={systemDetail}
            organs={getOrgansBySystem(systemDetail.id)}
            onClose={() => setDetailSystem(null)}
            onSelectOrgan={(id) => {
              selectOrgan(id)
              setDetailSystem(null)
            }}
            onIsolateSystem={() => {
              setActiveSystems([systemDetail.id])
            }}
          />
        )}
      </AnimatePresence>
    </PageTransition>
  )
}
