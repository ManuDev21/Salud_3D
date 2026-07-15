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
      initial={{ y: '100%', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: '100%', opacity: 0 }}
      transition={{ type: 'spring', stiffness: 280, damping: 32 }}
      className="glass-strong pointer-events-auto fixed inset-x-0 bottom-0 z-[60] flex h-[88vh] w-full flex-col overflow-hidden rounded-t-3xl md:inset-auto md:right-0 md:top-0 md:h-full md:max-w-md md:rounded-l-3xl md:rounded-t-none md:m-3 md:h-[calc(100%-1.5rem)] md:rounded-3xl"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {/* Mobile drag handle */}
      <div className="flex shrink-0 justify-center pt-2 md:hidden">
        <div className="h-1.5 w-12 rounded-full bg-white/25" />
      </div>

      {/* Header */}
      <div className="relative shrink-0 overflow-hidden p-5 pt-3 md:p-6 md:pt-6" style={{ background: `${organ.color}18` }}>
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
          className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-white/15 text-white/90 transition-colors hover:bg-white/25 active:scale-95 md:right-4 md:top-4 md:h-9 md:w-9"
        >
          <X size={20} />
        </button>
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
          style={{ background: `${organ.color}30`, color: '#fff' }}
        >
          <span className="h-2 w-2 rounded-full" style={{ background: organ.color }} />
          {system?.name}
        </span>
        <h2 className="mt-2 text-2xl font-extrabold md:mt-3 md:text-3xl">{organ.name}</h2>
        <p className="italic text-white/60">{organ.scientificName}</p>

        <div className="mt-3 grid grid-cols-3 gap-1.5 md:mt-4 md:gap-2">
          <Stat icon={MapPin} label="Ubicación" value={organ.location} />
          <Stat icon={Ruler} label="Tamaño" value={organ.size} />
          <Stat icon={Weight} label="Peso" value={organ.weight} />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex shrink-0 gap-1 border-b border-white/10 px-2 py-2 md:px-3">
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
              className={`flex flex-1 flex-col items-center gap-1 rounded-xl px-1 py-2 text-[10px] font-semibold transition-colors md:px-2 md:text-[11px] ${
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
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
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
    <div className="rounded-xl bg-white/5 p-2 md:p-2.5">
      <Icon size={13} className="mb-1 text-white/50 md:size-3.5" />
      <div className="text-[9px] uppercase tracking-wide text-white/40 md:text-[10px]">{label}</div>
      <div className="text-[11px] font-semibold leading-tight md:text-xs">{value}</div>
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
