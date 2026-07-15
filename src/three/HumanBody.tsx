import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { Gender } from '@/types'

interface HumanBodyProps {
  gender: Gender
  opacity: number
  theme?: 'dark' | 'light'
}

/** Semi-transparent procedural human silhouette used as spatial reference. */
export function HumanBody({ gender, opacity, theme = 'dark' }: HumanBodyProps) {
  const group = useRef<THREE.Group>(null)
  const female = gender === 'female'
  const skinColor = female ? '#ff9ecb' : theme === 'dark' ? '#7fb8ff' : '#9cc4ff'
  const emissiveColor = female ? '#ff5fa2' : '#3d8bff'

  useFrame((state) => {
    if (!group.current) return
    // Subtle breathing motion
    const b = 1 + Math.sin(state.clock.elapsedTime * 1.2) * 0.01
    group.current.scale.set(b, 1, b)
  })

  const mat = (
    <meshPhysicalMaterial
      color={skinColor}
      transparent
      opacity={opacity}
      roughness={0.1}
      transmission={0.6}
      thickness={0.5}
      clearcoat={1}
      clearcoatRoughness={0.2}
      emissive={emissiveColor}
      emissiveIntensity={0.06}
      depthWrite={false}
    />
  )

  const shoulderW = female ? 0.42 : 0.5
  const hipW = female ? 0.46 : 0.4

  return (
    <group ref={group}>
      {/* Head */}
      <mesh position={[0, 1.72, 0]}>
        <sphereGeometry args={[0.24, 32, 32]} />
        {mat}
      </mesh>
      {/* Neck */}
      <mesh position={[0, 1.48, 0]}>
        <cylinderGeometry args={[0.09, 0.11, 0.18, 24]} />
        {mat}
      </mesh>
      {/* Torso (chest) */}
      <mesh position={[0, 1.05, 0]}>
        <cylinderGeometry args={[0.28, shoulderW * 0.6, 0.55, 32]} />
        {mat}
      </mesh>
      {/* Abdomen */}
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[hipW * 0.55, 0.26, 0.5, 32]} />
        {mat}
      </mesh>
      {/* Hips */}
      <mesh position={[0, 0.22, 0]}>
        <sphereGeometry args={[hipW * 0.62, 32, 24]} />
        {mat}
      </mesh>
      {/* Shoulders */}
      <mesh position={[-shoulderW, 1.28, 0]}>
        <sphereGeometry args={[0.11, 20, 20]} />
        {mat}
      </mesh>
      <mesh position={[shoulderW, 1.28, 0]}>
        <sphereGeometry args={[0.11, 20, 20]} />
        {mat}
      </mesh>
      {/* Arms */}
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh position={[s * (shoulderW + 0.04), 0.95, 0]} rotation={[0, 0, s * 0.12]}>
            <capsuleGeometry args={[0.075, 0.62, 8, 16]} />
            {mat}
          </mesh>
          <mesh position={[s * (shoulderW + 0.14), 0.4, 0]} rotation={[0, 0, s * 0.16]}>
            <capsuleGeometry args={[0.06, 0.55, 8, 16]} />
            {mat}
          </mesh>
        </group>
      ))}
      {/* Legs */}
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh position={[s * 0.16, -0.32, 0]}>
            <capsuleGeometry args={[0.11, 0.7, 8, 16]} />
            {mat}
          </mesh>
          <mesh position={[s * 0.16, -1.15, 0]}>
            <capsuleGeometry args={[0.085, 0.7, 8, 16]} />
            {mat}
          </mesh>
        </group>
      ))}
    </group>
  )
}
