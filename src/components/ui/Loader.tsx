import { motion } from 'framer-motion'

export function Loader({ label = 'Cargando experiencia…' }: { label?: string }) {
  return (
    <div className="grid min-h-screen place-items-center bg-[#04070d]">
      <div className="flex flex-col items-center gap-6">
        <div className="relative h-20 w-20">
          <motion.span
            className="absolute inset-0 rounded-full border-2 border-bio-400/30"
            animate={{ scale: [1, 1.6], opacity: [0.8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
          />
          <motion.span
            className="absolute inset-0 rounded-full border-t-2 border-bio-400"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <div className="absolute inset-3 grid place-items-center rounded-full bg-gradient-to-br from-bio-400 to-aurora-cyan text-black">
            <span className="text-xl font-extrabold">B</span>
          </div>
        </div>
        <p className="text-sm text-white/60">{label}</p>
      </div>
    </div>
  )
}
