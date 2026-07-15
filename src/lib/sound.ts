import { useAppStore } from '@/store/useAppStore'

let ctx: AudioContext | null = null

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const AC = window.AudioContext || (window as any).webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  }
  return ctx
}

type Tone = { freq: number; duration: number; type?: OscillatorType; gain?: number; delay?: number }

function playTones(tones: Tone[]) {
  const audio = getCtx()
  if (!audio) return
  if (audio.state === 'suspended') audio.resume()
  const now = audio.currentTime
  for (const t of tones) {
    const osc = audio.createOscillator()
    const gain = audio.createGain()
    const start = now + (t.delay ?? 0)
    osc.type = t.type ?? 'sine'
    osc.frequency.value = t.freq
    gain.gain.setValueAtTime(0, start)
    gain.gain.linearRampToValueAtTime(t.gain ?? 0.08, start + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.0001, start + t.duration)
    osc.connect(gain)
    gain.connect(audio.destination)
    osc.start(start)
    osc.stop(start + t.duration + 0.02)
  }
}

const enabled = () => useAppStore.getState().soundEnabled

export const sfx = {
  hover: () => enabled() && playTones([{ freq: 880, duration: 0.08, type: 'sine', gain: 0.03 }]),
  click: () => enabled() && playTones([{ freq: 520, duration: 0.1, type: 'triangle', gain: 0.06 }]),
  select: () =>
    enabled() &&
    playTones([
      { freq: 523, duration: 0.12, type: 'sine' },
      { freq: 784, duration: 0.16, type: 'sine', delay: 0.08 },
    ]),
  success: () =>
    enabled() &&
    playTones([
      { freq: 523, duration: 0.12 },
      { freq: 659, duration: 0.12, delay: 0.1 },
      { freq: 988, duration: 0.22, delay: 0.2 },
    ]),
  error: () => enabled() && playTones([{ freq: 200, duration: 0.25, type: 'sawtooth', gain: 0.05 }]),
  heartbeat: () =>
    enabled() &&
    playTones([
      { freq: 60, duration: 0.15, type: 'sine', gain: 0.12 },
      { freq: 50, duration: 0.2, type: 'sine', gain: 0.1, delay: 0.18 },
    ]),
}
