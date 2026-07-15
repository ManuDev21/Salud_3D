import { Suspense, lazy } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
import { useApplyPreferences } from '@/hooks/useApplyPreferences'
import { Loader } from '@/components/ui/Loader'

const Landing = lazy(() => import('@/pages/Landing'))
const GenderSelect = lazy(() => import('@/pages/GenderSelect'))
const Explorer = lazy(() => import('@/pages/Explorer'))
const Games = lazy(() => import('@/pages/Games'))
const Progress = lazy(() => import('@/pages/Progress'))
const NotFound = lazy(() => import('@/pages/NotFound'))

export default function App() {
  useApplyPreferences()
  const location = useLocation()

  return (
    <div className="relative min-h-screen">
      <Navbar />
      <Suspense fallback={<Loader />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Landing />} />
            <Route path="/elegir" element={<GenderSelect />} />
            <Route path="/explorar" element={<Explorer />} />
            <Route path="/juegos" element={<Games />} />
            <Route path="/progreso" element={<Progress />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </div>
  )
}
