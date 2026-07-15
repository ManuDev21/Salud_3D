import { useMemo } from 'react'
import * as THREE from 'three'

interface SkeletonProps {
  visible: boolean
  opacity: number
}

/** A simplified bone structure used for the X-ray / skeletal view. */
export function Skeleton({ visible, opacity }: SkeletonProps) {
  const boneMat = (extra?: number) => (
    <meshStandardMaterial
      color="#f2ecdd"
      emissive="#fff6e0"
      emissiveIntensity={extra ?? 0.25}
      roughness={0.7}
      metalness={0}
      transparent
      opacity={opacity}
    />
  )

  const ribs = useMemo(() => Array.from({ length: 6 }), [])

  if (!visible) return null

  return (
    <group>
      {/* Skull */}
      <mesh position={[0, 1.72, 0]} scale={[0.9, 1, 0.95]}>
        <sphereGeometry args={[0.22, 24, 24]} />
        {boneMat()}
      </mesh>
      {/* Jaw */}
      <mesh position={[0, 1.58, 0.06]}>
        <boxGeometry args={[0.22, 0.1, 0.18]} />
        {boneMat()}
      </mesh>

      {/* Spine */}
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh key={i} position={[0, 1.42 - i * 0.12, -0.05]}>
          <cylinderGeometry args={[0.055, 0.055, 0.07, 12]} />
          {boneMat()}
        </mesh>
      ))}

      {/* Rib cage */}
      {ribs.map((_, i) => {
        const y = 1.24 - i * 0.11
        const w = 0.34 - Math.abs(i - 2.5) * 0.02
        return [-1, 1].map((s) => (
          <mesh key={`${i}-${s}`} position={[s * w * 0.5, y, 0.02]} rotation={[0, 0, s * 0.4]}>
            <torusGeometry args={[w, 0.02, 8, 24, Math.PI * 0.9]} />
            {boneMat()}
          </mesh>
        ))
      })}

      {/* Sternum */}
      <mesh position={[0, 1.05, 0.16]}>
        <boxGeometry args={[0.07, 0.4, 0.03]} />
        {boneMat()}
      </mesh>

      {/* Pelvis */}
      <mesh position={[0, 0.2, 0]} scale={[1.1, 0.6, 0.7]}>
        <torusGeometry args={[0.24, 0.06, 10, 24]} />
        {boneMat()}
      </mesh>

      {/* Clavicles + shoulders */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.2, 1.32, 0.08]} rotation={[0, 0, s * 0.2]}>
          <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
          {boneMat()}
        </mesh>
      ))}

      {/* Arm bones */}
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh position={[s * 0.5, 0.95, 0]} rotation={[0, 0, s * 0.12]}>
            <cylinderGeometry args={[0.035, 0.035, 0.6, 10]} />
            {boneMat()}
          </mesh>
          <mesh position={[s * 0.6, 0.4, 0]} rotation={[0, 0, s * 0.16]}>
            <cylinderGeometry args={[0.028, 0.028, 0.55, 10]} />
            {boneMat()}
          </mesh>
        </group>
      ))}

      {/* Leg bones */}
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh position={[s * 0.16, -0.32, 0]}>
            <cylinderGeometry args={[0.05, 0.045, 0.72, 12]} />
            {boneMat()}
          </mesh>
          <mesh position={[s * 0.16, -1.15, 0]}>
            <cylinderGeometry args={[0.04, 0.035, 0.72, 12]} />
            {boneMat()}
          </mesh>
        </group>
      ))}
    </group>
  )
}
