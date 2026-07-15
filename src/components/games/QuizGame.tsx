import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, Trophy, RefreshCw } from 'lucide-react'
import { ORGANS } from '@/data/organs'
import { useAppStore } from '@/store/useAppStore'
import { sfx } from '@/lib/sound'

interface Question {
  prompt: string
  correct: string
  options: string[]
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

function buildQuestions(): Question[] {
  const pool = shuffle(ORGANS).slice(0, 6)
  return pool.map((organ) => {
    const distractors = shuffle(ORGANS.filter((o) => o.id !== organ.id))
      .slice(0, 3)
      .map((o) => o.name)
    return {
      prompt: `¿Qué órgano tiene esta función: "${organ.primaryFunction}"?`,
      correct: organ.name,
      options: shuffle([organ.name, ...distractors]),
    }
  })
}

export function QuizGame({ onExit }: { onExit: () => void }) {
  const [questions] = useState<Question[]>(buildQuestions)
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const registerCorrect = useAppStore((s) => s.registerCorrectAnswer)
  const registerGameWon = useAppStore((s) => s.registerGameWon)

  const q = questions[index]
  const total = questions.length

  const answer = (opt: string) => {
    if (selected) return
    setSelected(opt)
    const correct = opt === q.correct
    if (correct) {
      sfx.success()
      setScore((s) => s + 1)
      registerCorrect()
    } else {
      sfx.error()
    }
    setTimeout(() => {
      if (index + 1 >= total) {
        setDone(true)
        if (score + (correct ? 1 : 0) >= Math.ceil(total * 0.6)) registerGameWon()
      } else {
        setIndex((i) => i + 1)
        setSelected(null)
      }
    }, 900)
  }

  const restart = () => {
    onExit()
  }

  if (done) {
    const passed = score >= Math.ceil(total * 0.6)
    return (
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className={`grid h-24 w-24 place-items-center rounded-full ${passed ? 'bg-bio-500/20 text-bio-300' : 'bg-white/10 text-white/60'}`}
        >
          <Trophy size={44} />
        </motion.div>
        <h3 className="text-2xl font-extrabold">{passed ? '¡Excelente!' : '¡Sigue practicando!'}</h3>
        <p className="text-white/60">
          Acertaste <span className="font-bold text-bio-300">{score}</span> de {total} preguntas.
        </p>
        <button type="button" onClick={restart} className="btn-primary mt-2">
          <RefreshCw size={16} /> Jugar de nuevo
        </button>
      </div>
    )
  }

  return (
    <div className="py-2">
      <div className="mb-4 flex items-center justify-between text-sm text-white/60">
        <span>
          Pregunta {index + 1} / {total}
        </span>
        <span className="font-semibold text-bio-300">Puntos: {score}</span>
      </div>
      <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-bio-400 to-aurora-cyan"
          animate={{ width: `${(index / total) * 100}%` }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
        >
          <h3 className="mb-5 text-lg font-bold leading-snug">{q.prompt}</h3>
          <div className="grid gap-2.5">
            {q.options.map((opt) => {
              const isCorrect = opt === q.correct
              const isSel = selected === opt
              let cls = 'border-white/10 bg-white/5 hover:bg-white/10'
              if (selected) {
                if (isCorrect) cls = 'border-bio-400/50 bg-bio-500/20'
                else if (isSel) cls = 'border-red-400/50 bg-red-500/20'
                else cls = 'border-white/5 bg-white/5 opacity-50'
              }
              return (
                <button
                  key={opt}
                  type="button"
                  disabled={!!selected}
                  onMouseEnter={() => !selected && sfx.hover()}
                  onClick={() => answer(opt)}
                  className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left font-medium transition-all ${cls}`}
                >
                  {opt}
                  {selected && isCorrect && <Check size={18} className="text-bio-300" />}
                  {selected && isSel && !isCorrect && <X size={18} className="text-red-400" />}
                </button>
              )
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
