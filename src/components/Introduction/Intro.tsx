import { Canvas, useFrame } from '@react-three/fiber'
import {
  ScrollControls,
  Scroll,
  useScroll,
  Stars,
  Environment,
  useCursor
} from '@react-three/drei'
import { motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { ArrowDown } from 'lucide-react'
import {
  GodRays,
  ChromaticAberration,
  EffectComposer
} from '@react-three/postprocessing'
import { Vector2 } from 'three'
import Logo from '../Logo'
import Particles from './Particles'
import SkipButton from './SkipButon'
import Sphere from './Sphere'

const GradientBackground = () => (
  <mesh scale={100}>
    <planeGeometry args={[1, 1, 32, 32]} />
    <meshBasicMaterial>
      <canvasTexture attach="map" args={[createGradientCanvas(1024, 1024)]} />
    </meshBasicMaterial>
  </mesh>
)

function createGradientCanvas(w: number, h: number) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!
  const gradient = ctx.createLinearGradient(0, 0, w, h)
  gradient.addColorStop(0, '#001144')
  gradient.addColorStop(1, '#220066')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, w, h)
  return canvas
}

const Intro = () => {
  const sphereRef = useRef<any>()
  return (
    <Canvas>
    <EffectComposer>
              <GodRays sun={sphereRef.current} blur={true} samples={30} />
      {
        //@ts-ignore

        <ChromaticAberration
          modulationOffset={1}
          offset={new Vector2(0.002, 0.002)}
        />
      }
      <Sphere />
       <Logo />
       <Particles />
       <SkipButton />
    </EffectComposer>
    </Canvas>
  )
}


export default Intro