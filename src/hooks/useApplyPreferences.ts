import { useEffect } from 'react'
import { useAppStore } from '@/store/useAppStore'

/** Syncs user preferences (theme, contrast, text scale) with the <html> element. */
export function useApplyPreferences() {
  const theme = useAppStore((s) => s.theme)
  const contrast = useAppStore((s) => s.contrast)
  const textScale = useAppStore((s) => s.textScale)

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    root.style.colorScheme = theme
  }, [theme])

  useEffect(() => {
    document.documentElement.classList.toggle('contrast', contrast)
  }, [contrast])

  useEffect(() => {
    document.documentElement.dataset.textscale = textScale
  }, [textScale])
}
