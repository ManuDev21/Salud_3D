import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Moon, Sun, Volume2, VolumeX, Contrast, Type, Gamepad2, Trophy, Home, Boxes } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { getLevelFromXp } from '@/data/achievements'
import { sfx } from '@/lib/sound'

const navItems = [
  { to: '/', label: 'Inicio', icon: Home },
  { to: '/explorar', label: 'Explorar', icon: Boxes },
  { to: '/juegos', label: 'Juegos', icon: Gamepad2 },
  { to: '/progreso', label: 'Progreso', icon: Trophy },
]

export function Navbar() {
  const location = useLocation()
  const {
    theme,
    toggleTheme,
    soundEnabled,
    toggleSound,
    contrast,
    toggleContrast,
    textScale,
    setTextScale,
    xp,
  } = useAppStore()

  const level = getLevelFromXp(xp)
  const cycleTextScale = () => setTextScale(textScale === 'base' ? 'lg' : textScale === 'lg' ? 'xl' : 'base')

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 24 }}
      className="fixed inset-x-0 top-0 z-50 px-4 pt-4"
    >
      <nav className="glass-strong mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-4 py-2.5">
        <Link to="/" className="flex items-center gap-2" onClick={() => sfx.click()}>
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-bio-400 to-aurora-cyan text-black">
            <span className="text-lg font-extrabold">B</span>
          </div>
          <span className="hidden text-lg font-bold tracking-tight sm:block">
            Bio<span className="text-gradient">Verse</span>
          </span>
        </Link>

        <ul className="flex items-center gap-1">
          {navItems.map((item) => {
            const active = location.pathname === item.to
            const Icon = item.icon
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={() => sfx.click()}
                  aria-current={active ? 'page' : undefined}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                    active ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon size={17} />
                  <span className="hidden md:block">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>

        <div className="flex items-center gap-1">
          <div className="mr-1 hidden items-center gap-1 rounded-xl bg-white/10 px-2.5 py-1.5 text-xs font-bold text-bio-300 sm:flex">
            <Trophy size={13} /> Nv {level}
          </div>
          <IconBtn label="Escala de texto" onClick={cycleTextScale} active={textScale !== 'base'}>
            <Type size={17} />
          </IconBtn>
          <IconBtn label="Alto contraste" onClick={toggleContrast} active={contrast}>
            <Contrast size={17} />
          </IconBtn>
          <IconBtn label={soundEnabled ? 'Silenciar' : 'Activar sonido'} onClick={toggleSound} active={soundEnabled}>
            {soundEnabled ? <Volume2 size={17} /> : <VolumeX size={17} />}
          </IconBtn>
          <IconBtn label="Cambiar tema" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </IconBtn>
        </div>
      </nav>
    </motion.header>
  )
}

function IconBtn({
  children,
  label,
  onClick,
  active,
}: {
  children: React.ReactNode
  label: string
  onClick: () => void
  active?: boolean
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={() => {
        sfx.click()
        onClick()
      }}
      className={`grid h-9 w-9 place-items-center rounded-xl transition-colors ${
        active ? 'bg-bio-500/25 text-bio-300' : 'text-white/70 hover:bg-white/10 hover:text-white'
      }`}
    >
      {children}
    </button>
  )
}
