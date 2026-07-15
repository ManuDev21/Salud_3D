import type { Achievement } from '@/types'

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-organ', name: 'Primer Contacto', description: 'Explora tu primer órgano.', icon: 'Sparkles', xp: 50 },
  { id: 'explorer', name: 'Explorador', description: 'Explora 5 órganos distintos.', icon: 'Compass', xp: 150 },
  { id: 'anatomist', name: 'Anatomista', description: 'Explora todos los órganos.', icon: 'Award', xp: 500 },
  { id: 'systems-master', name: 'Maestro de Sistemas', description: 'Activa 5 sistemas diferentes.', icon: 'Layers', xp: 200 },
  { id: 'game-winner', name: 'Campeón', description: 'Gana tu primer mini-juego.', icon: 'Trophy', xp: 250 },
  { id: 'quiz-pro', name: 'Sabelotodo', description: 'Responde 10 preguntas correctas.', icon: 'GraduationCap', xp: 300 },
]

export const LEVEL_XP = 500 // XP needed per level

export const getLevelFromXp = (xp: number) => Math.floor(xp / LEVEL_XP) + 1
export const getLevelProgress = (xp: number) => (xp % LEVEL_XP) / LEVEL_XP
