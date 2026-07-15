import { motion } from 'framer-motion'
import { X, Activity, Sparkles, AlertTriangle, HeartHandshake, Boxes, Eye, Layers } from 'lucide-react'
import type { AnatomySystem, OrganInfo } from '@/types'
import { sfx } from '@/lib/sound'

interface Props {
  system: AnatomySystem
  organs: OrganInfo[]
  onClose: () => void
  onSelectOrgan: (id: string) => void
  onIsolateSystem: () => void
}

/** Full dedicated view for a single anatomical system with all its details. */
export function SystemDetailPanel({ system, organs, onClose, onSelectOrgan, onIsolateSystem }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.94, y: 24 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.94, y: 24 }}
        transition={{ type: 'spring', stiffness: 260, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-strong relative flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl"
      >
        {/* Header */}
        <div className="relative shrink-0 overflow-hidden p-6" style={{ background: `${system.color}1f` }}>
          <div
            className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-40 blur-3xl"
            style={{ background: system.color }}
          />
          <button
            type="button"
            aria-label="Cerrar"
            onClick={() => {
              sfx.click()
              onClose()
            }}
            className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white/80 hover:bg-white/20"
          >
            <X size={18} />
          </button>
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-white"
            style={{ background: `${system.color}30` }}
          >
            <span className="h-2 w-2 rounded-full" style={{ background: system.color }} />
            Sistema
          </span>
          <h2 className="mt-3 text-3xl font-extrabold">{system.name}</h2>
          <p className="mt-2 max-w-xl text-sm text-white/75">{system.longDescription}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                sfx.select()
                onIsolateSystem()
                onClose()
              }}
              className="btn-primary px-4 py-2 text-sm"
            >
              <Eye size={15} /> Ver solo este sistema
            </button>
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold">
              <Layers size={14} /> {system.organCount} estructuras principales
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          <Section icon={Activity} title="¿Para qué sirve?">
            <ul className="grid gap-2 sm:grid-cols-2">
              {system.functions.map((f) => (
                <li key={f} className="flex items-start gap-2 rounded-xl bg-white/5 p-3 text-sm text-white/80">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: system.color }} />
                  {f}
                </li>
              ))}
            </ul>
          </Section>

          {organs.length > 0 && (
            <Section icon={Boxes} title={`Órganos y estructuras (${organs.length})`}>
              <div className="grid gap-2 sm:grid-cols-2">
                {organs.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => {
                      sfx.select()
                      onSelectOrgan(o.id)
                    }}
                    onMouseEnter={() => sfx.hover()}
                    className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 text-left transition-all hover:bg-white/10"
                  >
                    <span
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-sm font-bold"
                      style={{ background: `${o.color}30`, color: o.color }}
                    >
                      {o.name.charAt(0)}
                    </span>
                    <span>
                      <span className="block text-sm font-semibold">{o.name}</span>
                      <span className="block text-xs italic text-white/50">{o.scientificName}</span>
                    </span>
                  </button>
                ))}
              </div>
            </Section>
          )}

          <Section icon={Sparkles} title="¿Sabías que...?">
            <p className="rounded-xl border border-bio-400/20 bg-bio-500/10 p-3 text-sm text-white/85">
              {system.funFact}
            </p>
          </Section>

          <div className="grid gap-6 sm:grid-cols-2">
            <Section icon={AlertTriangle} title="Enfermedades comunes">
              <List items={system.commonDiseases} color="#ff6b5e" />
            </Section>
            <Section icon={HeartHandshake} title="Cómo cuidarlo">
              <List items={system.care} color="#38d795" />
            </Section>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function Section({ icon: Icon, title, children }: { icon: typeof Activity; title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-2.5 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-white/80">
        <Icon size={16} className="text-bio-300" />
        {title}
      </h3>
      {children}
    </div>
  )
}

function List({ items, color }: { items: string[]; color: string }) {
  return (
    <ul className="space-y-2">
      {items.map((it) => (
        <li key={it} className="flex items-start gap-2 text-sm text-white/75">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: color }} />
          {it}
        </li>
      ))}
    </ul>
  )
}
