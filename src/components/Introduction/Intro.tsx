import { Canvas } from '@react-three/fiber'
import { useRef } from 'react'
import {
  GodRays,
  ChromaticAberration,
  EffectComposer
} from '@react-three/postprocessing'
import Logo from '../Logo'
import Particles from './Particles'
import SkipButton from './SkipButon'
import Sphere from './Sphere'

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
      <Sphere />
       <Logo />
       <Particles />
       <SkipButton />
    </EffectComposer>
    </Canvas>
  )
}


export default Intro