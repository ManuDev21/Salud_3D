import { useMemo } from 'react'
import * as THREE from 'three'
import type { OrganShape } from '@/types'

interface Props {
  shape: OrganShape
  color: string
  emissive: number
  opacity: number
}

/** Procedural, anatomically-inspired geometry for each organ type. */
export function OrganGeometry({ shape, color, emissive, opacity }: Props) {
  const c = useMemo(() => new THREE.Color(color), [color])

  const mat = (over?: Partial<{ color: THREE.Color | string; rough: number; metal: number; em: number }>) => (
    <meshStandardMaterial
      color={over?.color ?? c}
      emissive={over?.color ?? c}
      emissiveIntensity={over?.em ?? emissive}
      roughness={over?.rough ?? 0.45}
      metalness={over?.metal ?? 0.05}
      transparent
      opacity={opacity}
    />
  )

  switch (shape) {
    case 'brain':
      return (
        <group>
          {/* Two hemispheres */}
          <mesh position={[-0.34, 0.1, 0]} scale={[0.85, 0.95, 1]}>
            <icosahedronGeometry args={[0.62, 3]} />
            {mat()}
          </mesh>
          <mesh position={[0.34, 0.1, 0]} scale={[0.85, 0.95, 1]}>
            <icosahedronGeometry args={[0.62, 3]} />
            {mat()}
          </mesh>
          {/* Cerebellum */}
          <mesh position={[0, -0.5, -0.35]} scale={[1, 0.6, 0.8]}>
            <icosahedronGeometry args={[0.34, 2]} />
            {mat({ rough: 0.6 })}
          </mesh>
          {/* Brain stem */}
          <mesh position={[0, -0.7, -0.15]}>
            <cylinderGeometry args={[0.08, 0.1, 0.4, 12]} />
            {mat()}
          </mesh>
        </group>
      )

    case 'heart':
      return (
        <group rotation={[0, 0, Math.PI]}>
          <mesh position={[0, 0.1, 0]}>
            <sphereGeometry args={[0.62, 32, 32]} />
            {mat({ rough: 0.35 })}
          </mesh>
          {/* Atria bumps */}
          <mesh position={[-0.32, -0.34, 0]}>
            <sphereGeometry args={[0.34, 24, 24]} />
            {mat({ rough: 0.35 })}
          </mesh>
          <mesh position={[0.32, -0.34, 0]}>
            <sphereGeometry args={[0.34, 24, 24]} />
            {mat({ rough: 0.35 })}
          </mesh>
          {/* Apex */}
          <mesh position={[0, 0.68, 0]}>
            <coneGeometry args={[0.42, 0.55, 24]} />
            {mat({ rough: 0.35 })}
          </mesh>
          {/* Great vessels */}
          <mesh position={[-0.12, -0.7, 0.05]} rotation={[0.2, 0, 0.15]}>
            <cylinderGeometry args={[0.1, 0.12, 0.4, 12]} />
            {mat({ color: '#ff8a9c' })}
          </mesh>
        </group>
      )

    case 'lungs':
      return (
        <group>
          {[-1, 1].map((s) => (
            <mesh key={s} position={[s * 0.42, 0, 0]} scale={[0.62, 1, 0.55]} rotation={[0, 0, s * 0.12]}>
              <sphereGeometry args={[0.62, 24, 32]} />
              {mat({ rough: 0.6 })}
            </mesh>
          ))}
          {/* Trachea */}
          <mesh position={[0, 0.62, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.5, 12]} />
            {mat({ color: '#bfe3ff' })}
          </mesh>
          {/* Bronchi */}
          {[-1, 1].map((s) => (
            <mesh key={s} position={[s * 0.18, 0.34, 0]} rotation={[0, 0, s * 0.7]}>
              <cylinderGeometry args={[0.05, 0.05, 0.3, 10]} />
              {mat({ color: '#bfe3ff' })}
            </mesh>
          ))}
        </group>
      )

    case 'kidney':
      return (
        <group>
          {[-1, 1].map((s) => (
            <group key={s} position={[s * 0.4, 0, 0]} rotation={[0, 0, s * 0.15]}>
              <mesh scale={[0.55, 0.9, 0.5]}>
                <sphereGeometry args={[0.55, 24, 24]} />
                {mat({ rough: 0.4 })}
              </mesh>
              {/* Hilum notch filler to suggest bean shape */}
              <mesh position={[-s * 0.24, 0, 0]} scale={[0.35, 0.55, 0.4]}>
                <sphereGeometry args={[0.4, 20, 20]} />
                {mat({ rough: 0.4 })}
              </mesh>
            </group>
          ))}
        </group>
      )

    case 'tube':
      return <TubeShape mat={mat} />

    case 'longbone':
      return (
        <group rotation={[0, 0, 0.08]}>
          <mesh>
            <cylinderGeometry args={[0.16, 0.16, 1.5, 20]} />
            {mat({ color: '#f3eddd', rough: 0.6, metal: 0 })}
          </mesh>
          {[-1, 1].map((s) => (
            <group key={s} position={[0, s * 0.82, 0]}>
              <mesh position={[-0.14, 0, 0]}>
                <sphereGeometry args={[0.22, 20, 20]} />
                {mat({ color: '#f3eddd', rough: 0.6 })}
              </mesh>
              <mesh position={[0.14, 0, 0]}>
                <sphereGeometry args={[0.22, 20, 20]} />
                {mat({ color: '#f3eddd', rough: 0.6 })}
              </mesh>
            </group>
          ))}
        </group>
      )

    case 'spine':
      return (
        <group>
          {Array.from({ length: 9 }).map((_, i) => {
            const y = 0.85 - i * 0.2
            return (
              <group key={i} position={[0, y, 0]}>
                <mesh>
                  <cylinderGeometry args={[0.16, 0.16, 0.11, 16]} />
                  {mat({ color: '#efe9dc', rough: 0.6 })}
                </mesh>
                <mesh position={[0, 0, -0.16]}>
                  <boxGeometry args={[0.1, 0.1, 0.14]} />
                  {mat({ color: '#efe9dc', rough: 0.6 })}
                </mesh>
              </group>
            )
          })}
        </group>
      )

    case 'gland':
      // Butterfly / bilobed gland
      return (
        <group>
          {[-1, 1].map((s) => (
            <mesh key={s} position={[s * 0.28, 0, 0]} scale={[0.5, 0.8, 0.5]}>
              <sphereGeometry args={[0.5, 20, 20]} />
              {mat({ rough: 0.4 })}
            </mesh>
          ))}
          <mesh scale={[0.4, 0.3, 0.4]}>
            <sphereGeometry args={[0.5, 16, 16]} />
            {mat({ rough: 0.4 })}
          </mesh>
        </group>
      )

    case 'eye':
      return (
        <group>
          <mesh>
            <sphereGeometry args={[0.6, 32, 32]} />
            {mat({ color: '#f5f8ff', em: 0.15, rough: 0.2 })}
          </mesh>
          <mesh position={[0, 0, 0.5]}>
            <circleGeometry args={[0.28, 32]} />
            {mat({ color: color })}
          </mesh>
          <mesh position={[0, 0, 0.54]}>
            <circleGeometry args={[0.13, 24]} />
            <meshStandardMaterial color="#0a0a12" transparent opacity={opacity} />
          </mesh>
        </group>
      )

    case 'node':
      return (
        <group>
          {[
            [0, 0, 0],
            [0.36, 0.1, 0.1],
            [-0.32, -0.12, 0.05],
            [0.1, -0.34, -0.12],
            [-0.14, 0.32, -0.1],
          ].map((p, i) => (
            <mesh key={i} position={p as [number, number, number]}>
              <sphereGeometry args={[0.22, 18, 18]} />
              {mat({ rough: 0.45 })}
            </mesh>
          ))}
        </group>
      )

    case 'muscle':
      return (
        <group rotation={[0, 0, 0.15]}>
          <mesh scale={[0.5, 1, 0.5]}>
            <sphereGeometry args={[0.6, 24, 32]} />
            {mat({ rough: 0.5 })}
          </mesh>
          {/* Tendons */}
          {[-1, 1].map((s) => (
            <mesh key={s} position={[0, s * 0.62, 0]}>
              <cylinderGeometry args={[0.08, 0.12, 0.4, 12]} />
              {mat({ color: '#f2d9c0', em: 0.1 })}
            </mesh>
          ))}
        </group>
      )

    case 'joint':
      return (
        <group>
          <mesh position={[0, 0.42, 0]}>
            <sphereGeometry args={[0.34, 20, 20]} />
            {mat({ color: '#eef1f4', rough: 0.6 })}
          </mesh>
          <mesh position={[0, 0.16, 0]}>
            <cylinderGeometry args={[0.2, 0.24, 0.3, 20]} />
            {mat({ color: '#dfe6ec', em: 0.2, rough: 0.3 })}
          </mesh>
          <mesh position={[0, -0.34, 0]}>
            <cylinderGeometry args={[0.22, 0.2, 0.6, 20]} />
            {mat({ color: '#eef1f4', rough: 0.6 })}
          </mesh>
        </group>
      )

    case 'skin':
      return (
        <mesh>
          <sphereGeometry args={[0.7, 32, 32]} />
          <meshPhysicalMaterial
            color={color}
            transparent
            opacity={Math.min(opacity, 0.35)}
            roughness={0.7}
            transmission={0.3}
            emissive={color}
            emissiveIntensity={emissive * 0.3}
          />
        </mesh>
      )

    case 'blob':
    default:
      return (
        <mesh scale={[1, 0.85, 0.92]}>
          <icosahedronGeometry args={[0.7, 4]} />
          {mat()}
        </mesh>
      )
  }
}

/** A winding organic tube used for intestine, vessels and airways. */
function TubeShape({ mat }: { mat: (o?: any) => JSX.Element }) {
  const geo = useMemo(() => {
    const pts: THREE.Vector3[] = []
    const turns = 14
    for (let i = 0; i <= turns; i++) {
      const a = (i / turns) * Math.PI * 2 * 2.2
      const r = 0.42 - i * 0.008
      pts.push(new THREE.Vector3(Math.cos(a) * r, i * 0.02 - 0.14, Math.sin(a) * r * 0.7))
    }
    const curve = new THREE.CatmullRomCurve3(pts)
    return new THREE.TubeGeometry(curve, 120, 0.13, 12, false)
  }, [])

  return (
    <mesh geometry={geo}>
      {mat({ rough: 0.5 })}
    </mesh>
  )
}
