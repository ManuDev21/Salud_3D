import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Gender, LearningLevel, SystemId } from '@/types'
import { ACHIEVEMENTS } from '@/data/achievements'

export type Theme = 'dark' | 'light'
export type TextScale = 'base' | 'lg' | 'xl'

interface AppState {
  // Preferences
  theme: Theme
  contrast: boolean
  textScale: TextScale
  soundEnabled: boolean
  learningLevel: LearningLevel

  // Experience
  gender: Gender | null
  activeSystems: SystemId[]
  selectedOrgan: string | null
  explodeAmount: number
  transparent: boolean

  // Gamification
  xp: number
  exploredOrgans: string[]
  unlockedAchievements: string[]
  correctAnswers: number
  gamesWon: number

  // Actions
  setTheme: (t: Theme) => void
  toggleTheme: () => void
  toggleContrast: () => void
  setTextScale: (s: TextScale) => void
  toggleSound: () => void
  setLearningLevel: (l: LearningLevel) => void

  setGender: (g: Gender) => void
  toggleSystem: (id: SystemId) => void
  setActiveSystems: (ids: SystemId[]) => void
  selectOrgan: (id: string | null) => void
  setExplode: (v: number) => void
  toggleTransparent: () => void

  addXp: (amount: number) => void
  exploreOrgan: (id: string) => void
  unlockAchievement: (id: string) => void
  registerCorrectAnswer: () => void
  registerGameWon: () => void
  resetProgress: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      contrast: false,
      textScale: 'base',
      soundEnabled: true,
      learningLevel: 'student',

      gender: null,
      activeSystems: ['circulatory'],
      selectedOrgan: null,
      explodeAmount: 0,
      transparent: false,

      xp: 0,
      exploredOrgans: [],
      unlockedAchievements: [],
      correctAnswers: 0,
      gamesWon: 0,

      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
      toggleContrast: () => set((s) => ({ contrast: !s.contrast })),
      setTextScale: (textScale) => set({ textScale }),
      toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
      setLearningLevel: (learningLevel) => set({ learningLevel }),

      setGender: (gender) => set({ gender }),
      toggleSystem: (id) =>
        set((s) => {
          const active = s.activeSystems.includes(id)
          const next = active ? s.activeSystems.filter((x) => x !== id) : [...s.activeSystems, id]
          return { activeSystems: next }
        }),
      setActiveSystems: (activeSystems) => set({ activeSystems }),
      selectOrgan: (selectedOrgan) => {
        if (selectedOrgan) get().exploreOrgan(selectedOrgan)
        set({ selectedOrgan })
      },
      setExplode: (explodeAmount) => set({ explodeAmount }),
      toggleTransparent: () => set((s) => ({ transparent: !s.transparent })),

      addXp: (amount) => set((s) => ({ xp: s.xp + amount })),

      exploreOrgan: (id) => {
        const s = get()
        if (s.exploredOrgans.includes(id)) return
        const explored = [...s.exploredOrgans, id]
        set({ exploredOrgans: explored, xp: s.xp + 25 })
        if (explored.length >= 1) get().unlockAchievement('first-organ')
        if (explored.length >= 5) get().unlockAchievement('explorer')
      },

      unlockAchievement: (id) => {
        const s = get()
        if (s.unlockedAchievements.includes(id)) return
        const ach = ACHIEVEMENTS.find((a) => a.id === id)
        set({
          unlockedAchievements: [...s.unlockedAchievements, id],
          xp: s.xp + (ach?.xp ?? 0),
        })
      },

      registerCorrectAnswer: () => {
        const s = get()
        const correctAnswers = s.correctAnswers + 1
        set({ correctAnswers, xp: s.xp + 20 })
        if (correctAnswers >= 10) get().unlockAchievement('quiz-pro')
      },

      registerGameWon: () => {
        const s = get()
        set({ gamesWon: s.gamesWon + 1, xp: s.xp + 100 })
        get().unlockAchievement('game-winner')
      },

      resetProgress: () =>
        set({
          xp: 0,
          exploredOrgans: [],
          unlockedAchievements: [],
          correctAnswers: 0,
          gamesWon: 0,
        }),
    }),
    {
      name: 'bioverse-store',
      partialize: (s) => ({
        theme: s.theme,
        contrast: s.contrast,
        textScale: s.textScale,
        soundEnabled: s.soundEnabled,
        learningLevel: s.learningLevel,
        gender: s.gender,
        xp: s.xp,
        exploredOrgans: s.exploredOrgans,
        unlockedAchievements: s.unlockedAchievements,
        correctAnswers: s.correctAnswers,
        gamesWon: s.gamesWon,
      }),
    },
  ),
)
