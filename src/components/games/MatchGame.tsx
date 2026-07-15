import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Trophy, RefreshCw } from 'lucide-react'
import { ORGANS } from '@/data/organs'
import { useAppStore } from '@/store/useAppStore'
import { sfx } from '@/lib/sound'

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

export function MatchGame({ onExit }: { onExit: () => void }) {
  const pairs = useMemo(() => shuffle(ORGANS).slice(0, 5), [])
  const organs = useMemo(() => shuffle(pairs), [pairs])
  const functions = useMemo(() => shuffle(pairs), [pairs])

  const [selectedOrgan, setSelectedOrgan] = useState<string | null>(null)
  const [matched, setMatched] = useState<string[]>([])
  const [wrong, setWrong] = useState<string | null>(null)
  const registerGameWon = useAppStore((s) => s.registerGameWon)

  const done = matched.length === pairs.length

  const pickOrgan = (id: string) => {
    if (matched.includes(id)) return
    sfx.click()
    setSelectedOrgan(id)
  }

  const pickFunction = (id: string) => {
    if (!selectedOrgan || matched.includes(id)) return
    if (selectedOrgan === id) {
      sfx.success()
      const next = [...matched, id]
      setMatched(next)
      setSelectedOrgan(null)
      if (next.length === pairs.length) registerGameWon()
    } else {
      sfx.error()
      setWrong(id)
      setTimeout(() => setWrong(null), 500)
      setSelectedOrgan(null)
    }
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="grid h-24 w-24 place-items-center rounded-full bg-bio-500/20 text-bio-300"
        >
          <Trophy size={44} />
        </motion.div>
        <h3 className="text-2xl font-extrabold">¡Todo emparejado!</h3>
        <p className="text-white/60">Relacionaste correctamente los {pairs.length} órganos.</p>
        <button type="button" onClick={onExit} className="btn-primary mt-2">
          <RefreshCw size={16} /> Jugar de nuevo
        </button>
      </div>
    )
  }

  return (
    <div className="py-2">
      <p className="mb-4 text-center text-sm text-white/60">
        Toca un órgano y luego su función correspondiente.
      </p>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="text-xs font-bold uppercase tracking-wide text-white/40">Órganos</div>
          {organs.map((o) => {
            const isMatched = matched.includes(o.id)
            const isSel = selectedOrgan === o.id
            return (
              <button
                key={o.id}
                type="button"
                disabled={isMatched}
                onClick={() => pickOrgan(o.id)}
                className={`w-full rounded-xl border px-3 py-2.5 text-left text-sm font-semibold transition-all ${
                  isMatched
                    ? 'border-bio-400/40 bg-bio-500/15 text-bio-300'
                    : isSel
                      ? 'border-aurora-cyan bg-aurora-cyan/20'
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}
              >
                {o.name}
              </button>
            )
          })}
        </div>
        <div className="space-y-2">
          <div className="text-xs font-bold uppercase tracking-wide text-white/40">Funciones</div>
          {functions.map((f) => {
            const isMatched = matched.includes(f.id)
            const isWrong = wrong === f.id
            return (
              <button
                key={f.id}
                type="button"
                disabled={isMatched}
                onClick={() => pickFunction(f.id)}
                className={`w-full rounded-xl border px-3 py-2.5 text-left text-xs transition-all ${
                  isMatched
                    ? 'border-bio-400/40 bg-bio-500/15 text-bio-300'
                    : isWrong
                      ? 'border-red-400/50 bg-red-500/20'
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}
              >
                {f.primaryFunction}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
