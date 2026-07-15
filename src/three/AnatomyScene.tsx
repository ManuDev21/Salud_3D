import { Suspense, useRef } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import {
  OrbitControls,
  Environment,
  ContactShadows,
  Float,
  Sparkles,
  AdaptiveDpr,
  PerformanceMonitor,
} from '@react-three/drei'
import * as THREE from 'three'
import { HumanBody } from './HumanBody'
import { OrganMesh } from './OrganMesh'
import { Skeleton } from './Skeleton'
import { ORGANS } from '@/data/organs'
import { useAppStore } from '@/store/useAppStore'
import type { Gender } from '@/types'

interface AnatomySceneProps {
  gender: Gender
  onHover: (id: string | null) => void
}

const BODY_OFFSET = new THREE.Vector3(0, -0.2, 0)

/** Smoothly flies the camera to the selected organ so its details can be inspected. */
function CameraRig() {
  const selectedOrgan = useAppStore((s) => s.selectedOrgan)
  const { camera, controls } = useThree()
  const prev = useRef<string | null>(null)
  const returning = useRef(false)
  const desiredPos = useRef(new THREE.Vector3(0, 0.6, 4.2))
  const desiredTarget = useRef(new THREE.Vector3(0, 0.1, 0))

  useFrame(() => {
    const ctrl = controls as unknown as { target: THREE.Vector3; update: () => void } | null

    if (selectedOrgan !== prev.current) {
      prev.current = selectedOrgan
      const organ = ORGANS.find((o) => o.id === selectedOrgan)
      if (organ) {
        const target = new THREE.Vector3(organ.position.x, organ.position.y, organ.position.z).add(BODY_OFFSET)
        const outward = new THREE.Vector3(organ.position.x, 0, organ.position.z)
        if (outward.length() < 0.1) outward.set(0, 0, 1)
        outward.normalize()
        const dist = 0.9 + organ.position.scale * 2.6
        desiredTarget.current.copy(target)
        desiredPos.current
          .copy(target)
          .add(outward.multiplyScalar(dist))
          .add(new THREE.Vector3(0.3, 0.25, dist * 0.6))
        returning.current = false
      } else {
        desiredPos.current.set(0, 0.6, 4.2)
        desiredTarget.current.set(0, 0.1, 0)
        returning.current = true
      }
    }

    // Only drive the camera while focusing on an organ or returning home.
    if (selectedOrgan || returning.current) {
      camera.position.lerp(desiredPos.current, 0.06)
      if (ctrl) {
        ctrl.target.lerp(desiredTarget.current, 0.06)
        ctrl.update()
      }
      if (returning.current && camera.position.distanceTo(desiredPos.current) < 0.05) {
        returning.current = false
      }
    }
  })

  return null
}

export function AnatomyScene({ gender, onHover }: AnatomySceneProps) {
  const activeSystems = useAppStore((s) => s.activeSystems)
  const selectedOrgan = useAppStore((s) => s.selectedOrgan)
  const selectOrgan = useAppStore((s) => s.selectOrgan)
  const explode = useAppStore((s) => s.explodeAmount)
  const transparent = useAppStore((s) => s.transparent)
  const theme = useAppStore((s) => s.theme)

  const visibleOrgans = ORGANS.filter((o) => activeSystems.includes(o.system))
  const bg = theme === 'dark' ? '#04070d' : '#dbeafe'
  const bodyOpacity = transparent ? 0.05 : theme === 'dark' ? 0.14 : 0.2
  const skeletonVisible = transparent || activeSystems.includes('skeletal')

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0.6, 4.2], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onPointerMissed={() => selectOrgan(null)}
    >
      <color attach="background" args={[bg]} />
      <fog attach="fog" args={[bg, 6, 13]} />

      <ambientLight intensity={theme === 'dark' ? 0.4 : 0.8} />
      <directionalLight position={[4, 6, 4]} intensity={theme === 'dark' ? 1.2 : 1.6} castShadow />
      <pointLight position={[-4, 2, -3]} intensity={40} color="#22d3ee" />
      <pointLight position={[4, -2, 3]} intensity={30} color="#a855f7" />

      <PerformanceMonitor>
        <Suspense fallback={null}>
          <Float speed={1.1} rotationIntensity={0.12} floatIntensity={0.2}>
            <group position={[0, -0.2, 0]}>
              <HumanBody gender={gender} opacity={bodyOpacity} theme={theme} />
              <Skeleton visible={skeletonVisible} opacity={transparent ? 0.55 : 0.9} />
              {visibleOrgans.map((organ) => (
                <OrganMesh
                  key={organ.id}
                  organ={organ}
                  selected={selectedOrgan === organ.id}
                  focused={selectedOrgan === organ.id}
                  transparent={transparent}
                  explode={explode}
                  onSelect={selectOrgan}
                  onHover={onHover}
                />
              ))}
            </group>
          </Float>

          <Sparkles count={50} scale={[6, 8, 6]} size={2} speed={0.3} color="#38d795" opacity={theme === 'dark' ? 0.4 : 0.2} />
          <ContactShadows position={[0, -1.9, 0]} opacity={0.3} scale={8} blur={2.6} far={4} color="#000000" />
          <Environment preset={theme === 'dark' ? 'city' : 'apartment'} />
        </Suspense>
      </PerformanceMonitor>

      <AdaptiveDpr pixelated />
      <CameraRig />
      <OrbitControls
        makeDefault
        enablePan={false}
        minDistance={1.2}
        maxDistance={7}
        enableDamping
        dampingFactor={0.08}
        target={[0, 0.1, 0]}
      />
    </Canvas>
  )
}
