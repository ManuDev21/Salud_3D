import { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import type { OrganInfo, OrganShape } from '@/types'
import { OrganGeometry } from './OrganGeometry'

interface OrganMeshProps {
  organ: OrganInfo
  selected: boolean
  focused: boolean
  transparent: boolean
  explode: number
  onSelect: (id: string) => void
  onHover: (id: string | null) => void
}

/** Renders a single interactive organ with an anatomically-inspired procedural shape. */
export function OrganMesh({ organ, selected, focused, transparent, explode, onSelect, onHover }: OrganMeshProps) {
  const group = useRef<THREE.Group>(null)
  const inner = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  const { position } = organ

  const dir = useMemo(() => {
    const v = new THREE.Vector3(position.x, 0, position.z)
    if (v.length() < 0.01) v.set(0.4, 0, 0.4)
    return v.normalize()
  }, [position.x, position.z])

  useFrame((state, delta) => {
    if (!group.current) return
    const t = state.clock.elapsedTime
    const ex = explode * 1.4
    const targetX = position.x + dir.x * ex
    const targetZ = position.z + dir.z * ex
    group.current.position.x += (targetX - group.current.position.x) * 0.08
    group.current.position.z += (targetZ - group.current.position.z) * 0.08
    group.current.position.y += (position.y - group.current.position.y) * 0.08

    // Idle motion: heartbeat, breathing, or gentle bob
    let pulse = 1 + Math.sin(t * 1.3 + position.y) * 0.015
    if (organ.shape === 'heart') pulse = 1 + Math.max(0, Math.sin(t * 5.5)) * 0.09
    if (organ.shape === 'lungs') pulse = 1 + Math.sin(t * 1.8) * 0.05
    const s = position.scale * pulse * (selected || focused ? 1.1 : hovered ? 1.05 : 1)
    group.current.scale.setScalar(s)

    // Slow spin when focused so the user can see all its details
    if (inner.current) {
      if (focused) inner.current.rotation.y += delta * 0.5
      else inner.current.rotation.y += (0 - (inner.current.rotation.y % (Math.PI * 2))) * 0.02
    }
  })

  const opacity = selected || focused ? 1 : transparent ? 0.4 : hovered ? 0.98 : 0.9
  const emissive = selected || focused ? 1.1 : hovered ? 0.7 : 0.32

  return (
    <group ref={group} position={[position.x, position.y, position.z]}>
      <group
        ref={inner}
        onClick={(e) => {
          e.stopPropagation()
          onSelect(organ.id)
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
          onHover(organ.id)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHovered(false)
          onHover(null)
          document.body.style.cursor = 'auto'
        }}
      >
        <OrganGeometry shape={organ.shape} color={organ.color} emissive={emissive} opacity={opacity} />
      </group>

      {(hovered || selected || focused) && (
        <Html center distanceFactor={6} position={[0, 1.5, 0]} zIndexRange={[20, 0]}>
          <div className="pointer-events-none select-none whitespace-nowrap rounded-full border border-white/20 bg-black/75 px-3 py-1 text-xs font-semibold text-white shadow-lg backdrop-blur-md">
            {organ.name}
          </div>
        </Html>
      )}
    </group>
  )
}

export type { OrganShape }
