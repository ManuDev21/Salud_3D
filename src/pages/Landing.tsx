import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  Sparkles,
  MousePointerClick,
  Boxes,
  Gamepad2,
  GraduationCap,
  Accessibility,
  HeartPulse,
  ArrowRight,
  Brain,
  Layers,
} from 'lucide-react'
import { ParticleField } from '@/components/background/ParticleField'
import { GlassCard } from '@/components/ui/GlassCard'
import { PageTransition } from '@/components/layout/PageTransition'
import { SYSTEMS } from '@/data/systems'
import { sfx } from '@/lib/sound'

const features = [
  { icon: Boxes, title: 'Exploración 3D', desc: 'Rota, acerca y desmonta el cuerpo humano en tiempo real.' },
  { icon: Layers, title: '15 Sistemas', desc: 'Óseo, muscular, nervioso, circulatorio y muchos más.' },
  { icon: GraduationCap, title: '3 Niveles', desc: 'Modo Infantil, Estudiante y Profesional.' },
  { icon: Gamepad2, title: 'Mini-juegos', desc: 'Aprende jugando con retos, quizzes y rompecabezas.' },
  { icon: Accessibility, title: 'Accesible', desc: 'Modo oscuro, alto contraste y escalado de texto.' },
  { icon: HeartPulse, title: 'Animaciones vivas', desc: 'Latidos, respiración y flujo sanguíneo animados.' },
]

const steps = [
  { n: '01', icon: MousePointerClick, title: 'Elige tu modelo', desc: 'Selecciona el cuerpo masculino o femenino.' },
  { n: '02', icon: Boxes, title: 'Explora los sistemas', desc: 'Activa capas y separa las estructuras anatómicas.' },
  { n: '03', icon: Brain, title: 'Descubre cada órgano', desc: 'Toca un órgano para abrir su ficha interactiva.' },
  { n: '04', icon: Gamepad2, title: 'Juega y progresa', desc: 'Gana XP, insignias y sube de nivel aprendiendo.' },
]

export default function Landing() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 220])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.15])

  return (
    <PageTransition>
      {/* HERO */}
      <section ref={ref} className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <div className="aurora-bg absolute inset-0" />
        <div className="absolute inset-0 opacity-70">
          <ParticleField density={90} />
        </div>

        {/* Floating orbs */}
        <motion.div
          className="absolute left-[12%] top-[24%] h-40 w-40 rounded-full bg-aurora-cyan/20 blur-3xl"
          animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute right-[14%] bottom-[22%] h-52 w-52 rounded-full bg-aurora-violet/20 blur-3xl"
          animate={{ y: [0, 30, 0], x: [0, -20, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
        />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
          className="relative z-10 mx-auto max-w-4xl px-6 text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm text-white/80 backdrop-blur-md"
          >
            <Sparkles size={15} className="text-bio-300" />
            Anatomía humana como nunca la habías visto
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-7xl"
          >
            Explora el <span className="text-gradient">cuerpo humano</span>
            <br /> en 3D interactivo
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-white/70"
          >
            Una plataforma educativa de nueva generación. Desmonta, reconstruye y comprende cada
            estructura anatómica con animaciones cinematográficas y gamificación.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Link to="/elegir" className="btn-primary text-base" onClick={() => sfx.select()}>
              Comenzar exploración <ArrowRight size={18} />
            </Link>
            <Link to="/juegos" className="btn-ghost text-base" onClick={() => sfx.click()}>
              <Gamepad2 size={18} /> Ver mini-juegos
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-14 flex items-center justify-center gap-8 text-center"
          >
            {[
              { k: '15', v: 'Sistemas' },
              { k: '3', v: 'Niveles' },
              { k: '∞', v: 'Curiosidad' },
            ].map((s) => (
              <div key={s.v}>
                <div className="text-3xl font-extrabold text-gradient">{s.k}</div>
                <div className="text-xs uppercase tracking-widest text-white/50">{s.v}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        >
          <div className="flex h-10 w-6 justify-center rounded-full border-2 border-white/30 pt-2">
            <div className="h-2 w-1 rounded-full bg-white/60" />
          </div>
        </motion.div>
      </section>

      {/* FEATURES */}
      <section className="relative mx-auto max-w-6xl px-6 py-24">
        <SectionTitle
          badge="Características"
          title="Diseñada para enamorar y enseñar"
          subtitle="Cada detalle está pensado para que el aprendizaje sea inmersivo, intuitivo y memorable."
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => {
            const Icon = f.icon
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ delay: i * 0.06 }}
              >
                <GlassCard hover className="h-full p-6">
                  <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-bio-500/30 to-aurora-cyan/20 text-bio-300">
                    <Icon size={22} />
                  </div>
                  <h3 className="text-lg font-bold">{f.title}</h3>
                  <p className="mt-1.5 text-sm text-white/60">{f.desc}</p>
                </GlassCard>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* SYSTEMS MARQUEE */}
      <section className="relative overflow-hidden py-10">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-[#04070d] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-[#04070d] to-transparent" />
        <motion.div
          className="flex gap-4"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
        >
          {[...SYSTEMS, ...SYSTEMS].map((s, i) => (
            <div
              key={`${s.id}-${i}`}
              className="glass flex shrink-0 items-center gap-2 rounded-2xl px-5 py-3"
              style={{ boxShadow: `0 0 24px ${s.glow}22` }}
            >
              <span className="h-3 w-3 rounded-full" style={{ background: s.color }} />
              <span className="whitespace-nowrap text-sm font-semibold">{s.name}</span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative mx-auto max-w-6xl px-6 py-24">
        <SectionTitle
          badge="Cómo funciona"
          title="Aprender en 4 simples pasos"
          subtitle="De la curiosidad al conocimiento, con una experiencia que se siente como un videojuego."
        />
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => {
            const Icon = s.icon
            return (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <GlassCard hover className="relative h-full overflow-hidden p-6">
                  <span className="absolute -right-2 -top-4 text-7xl font-black text-white/5">{s.n}</span>
                  <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-bio-300">
                    <Icon size={22} />
                  </div>
                  <h3 className="text-lg font-bold">{s.title}</h3>
                  <p className="mt-1.5 text-sm text-white/60">{s.desc}</p>
                </GlassCard>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="relative mx-auto max-w-5xl px-6 pb-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-bio-500/15 via-aurora-cyan/10 to-aurora-violet/15 p-12 text-center backdrop-blur-2xl"
        >
          <div className="absolute inset-0 opacity-40">
            <ParticleField density={40} color="rgba(168,85,247,0.6)" linkColor="rgba(168,85,247," />
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl font-extrabold sm:text-5xl">
              ¿Listo para <span className="text-gradient">descubrir</span> tu cuerpo?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/70">
              Comienza gratis. Explora, juega y conviértete en un experto de la anatomía humana.
            </p>
            <Link to="/elegir" className="btn-primary mt-8 text-base" onClick={() => sfx.select()}>
              Iniciar ahora <ArrowRight size={18} />
            </Link>
          </div>
        </motion.div>
        <footer className="mt-16 text-center text-sm text-white/40">
          BioVerse · Plataforma educativa de anatomía en 3D · Hecho con React, Three.js y mucha curiosidad.
        </footer>
      </section>
    </PageTransition>
  )
}

function SectionTitle({ badge, title, subtitle }: { badge: string; title: string; subtitle: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mx-auto max-w-2xl text-center"
    >
      <span className="inline-block rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-bio-300">
        {badge}
      </span>
      <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h2>
      <p className="mt-3 text-white/60">{subtitle}</p>
    </motion.div>
  )
}
