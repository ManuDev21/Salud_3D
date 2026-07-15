import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Info,
  Activity,
  AlertTriangle,
  ShieldCheck,
  Sparkles,
  BookOpen,
  MapPin,
  Ruler,
  Weight,
  Link2,
  Microscope,
  Lightbulb,
  Star,
} from 'lucide-react'
import type { OrganInfo, LearningLevel } from '@/types'
import { getSystem } from '@/data/systems'
import { useAppStore } from '@/store/useAppStore'
import { sfx } from '@/lib/sound'

const tabs = [
  { id: 'about', label: 'Descripción', icon: Info },
  { id: 'function', label: 'Función', icon: Activity },
  { id: 'health', label: 'Salud', icon: ShieldCheck },
  { id: 'fun', label: 'Curiosidades', icon: Sparkles },
] as const

type TabId = (typeof tabs)[number]['id']

export function OrganPanel({ organ, onClose }: { organ: OrganInfo; onClose: () => void }) {
  const [tab, setTab] = useState<TabId>('about')
  const level = useAppStore((s) => s.learningLevel)
  const system = getSystem(organ.system)

  return (
    <motion.aside
      initial={{ x: '110%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '110%', opacity: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 30 }}
      className="glass-strong pointer-events-auto fixed right-0 top-0 z-40 flex h-full w-full max-w-md flex-col overflow-hidden rounded-l-3xl md:m-3 md:h-[calc(100%-1.5rem)] md:rounded-3xl"
    >
      {/* Header */}
      <div className="relative shrink-0 overflow-hidden p-6" style={{ background: `${organ.color}18` }}>
        <div
          className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-40 blur-2xl"
          style={{ background: organ.color }}
        />
        <button
          type="button"
          aria-label="Cerrar"
          onClick={() => {
            sfx.click()
            onClose()
          }}
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-white/20"
        >
          <X size={18} />
        </button>
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
          style={{ background: `${organ.color}30`, color: '#fff' }}
        >
          <span className="h-2 w-2 rounded-full" style={{ background: organ.color }} />
          {system?.name}
        </span>
        <h2 className="mt-3 text-3xl font-extrabold">{organ.name}</h2>
        <p className="italic text-white/60">{organ.scientificName}</p>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <Stat icon={MapPin} label="Ubicación" value={organ.location} />
          <Stat icon={Ruler} label="Tamaño" value={organ.size} />
          <Stat icon={Weight} label="Peso" value={organ.weight} />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex shrink-0 gap-1 border-b border-white/10 px-3 py-2">
        {tabs.map((t) => {
          const Icon = t.icon
          const active = tab === t.id
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                sfx.hover()
                setTab(t.id)
              }}
              className={`flex flex-1 flex-col items-center gap-1 rounded-xl px-2 py-2 text-[11px] font-semibold transition-colors ${
                active ? 'bg-white/15 text-white' : 'text-white/50 hover:bg-white/10'
              }`}
            >
              <Icon size={16} />
              {t.label}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="space-y-5"
          >
            {tab === 'about' && <AboutTab organ={organ} level={level} />}
            {tab === 'function' && <FunctionTab organ={organ} />}
            {tab === 'health' && <HealthTab organ={organ} />}
            {tab === 'fun' && <FunTab organ={organ} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.aside>
  )
}

function Stat({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/5 p-2.5">
      <Icon size={14} className="mb-1 text-white/50" />
      <div className="text-[10px] uppercase tracking-wide text-white/40">{label}</div>
      <div className="text-xs font-semibold leading-tight">{value}</div>
    </div>
  )
}

function levelText(t: { kids: string; student: string; pro: string }, level: LearningLevel) {
  return t[level]
}

function AboutTab({ organ, level }: { organ: OrganInfo; level: LearningLevel }) {
  return (
    <>
      <Block title="¿Qué es?">
        <p className="text-white/75">{levelText(organ.whatIsIt, level)}</p>
      </Block>
      <Block title="¿Cómo funciona?">
        <p className="text-white/75">{levelText(organ.howItWorks, level)}</p>
      </Block>
      <Block title="Órganos relacionados" icon={Link2}>
        <div className="flex flex-wrap gap-2">
          {organ.relatedOrgans.map((r) => (
            <span key={r} className="rounded-full bg-white/10 px-3 py-1 text-xs">
              {r}
            </span>
          ))}
        </div>
      </Block>
    </>
  )
}

function FunctionTab({ organ }: { organ: OrganInfo }) {
  return (
    <>
      <Block title="Función principal">
        <p className="rounded-xl border border-bio-400/20 bg-bio-500/10 p-3 text-white/85">
          {organ.primaryFunction}
        </p>
      </Block>
      <Block title="Funciones secundarias">
        <List items={organ.secondaryFunctions} color="#38d795" />
      </Block>
    </>
  )
}

function HealthTab({ organ }: { organ: OrganInfo }) {
  return (
    <>
      <Block title="Enfermedades comunes" icon={AlertTriangle}>
        <List items={organ.diseases} color="#ff6b5e" />
      </Block>
      <Block title="Prevención" icon={ShieldCheck}>
        <List items={organ.prevention} color="#38d795" />
      </Block>
      <Block title="Recomendaciones">
        <List items={organ.recommendations} color="#22d3ee" />
      </Block>
    </>
  )
}

function FunTab({ organ }: { organ: OrganInfo }) {
  const funIcons = [Sparkles, Microscope, Lightbulb, Star]
  return (
    <>
      <Block title="Datos curiosos" icon={Sparkles}>
        <div className="space-y-2">
          {organ.curiosities.map((c, i) => {
            const Icon = funIcons[i % funIcons.length]
            return (
              <div key={i} className="flex items-start gap-3 rounded-xl bg-white/5 p-3">
                <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-bio-500/20 text-bio-300">
                  <Icon size={16} />
                </span>
                <p className="text-sm text-white/75">{c}</p>
              </div>
            )
          })}
        </div>
      </Block>
      <Block title="Bibliografía" icon={BookOpen}>
        <ul className="space-y-1 text-xs text-white/50">
          {organ.references.map((r) => (
            <li key={r}>· {r}</li>
          ))}
        </ul>
      </Block>
    </>
  )
}

function Block({ title, icon: Icon, children }: { title: string; icon?: typeof Info; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-white/80">
        {Icon && <Icon size={15} className="text-bio-300" />}
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
