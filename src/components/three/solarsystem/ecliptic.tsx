import { ReactThreeFiber } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import THREE, { BufferGeometry, Color, Vector3 } from 'three'

const t = {
  line: 'line' as any as (
    _: ReactThreeFiber.Object3DNode<THREE.Line, typeof THREE.Line>
  ) => JSX.Element
}

function Ecliptic({ xRadius = 1, zRadius = 1 }) {
  const orbitRef = useRef()
  const lineGeometry = new BufferGeometry()
  const fromColor = new Color(0xffffff) // Black color
  const toColor = new Color(0xffffff) // White color

  const animateColors = () => {
    const colors = []

    for (let j = 0; j < 64; j++) {
      const percent = j / 63
      const color = fromColor.clone().lerp(toColor, percent)
      colors.push(color.r, color.g, color.b)
    }

    lineGeometry.setAttribute(
      'color',
      new THREE.Float32BufferAttribute(colors, 3)
    )
  }

  useEffect(() => {
    const animationId = requestAnimationFrame(animateColors)
    return () => cancelAnimationFrame(animationId)
  }, [])

  const points = []
  for (let index = 0; index < 64; index++) {
    const angle = (index / 63) * 2 * Math.PI
    const x = xRadius * Math.cos(angle)
    const z = zRadius * Math.sin(angle)
    points.push(new Vector3(x, 0, z))
  }

  points.push(points[0])

  lineGeometry.setFromPoints(points)

  return (
    <t.line geometry={lineGeometry}>
      {/* <lineBasicMaterial
          ref={orbitRef}
          attach="material"
          vertexColors={THREE.VertexColors}
          linewidth={10}
        /> */}
      <lineBasicMaterial attach="material" color="#393e46" linewidth={10} />
    </t.line>
  )
}

export default Ecliptic
