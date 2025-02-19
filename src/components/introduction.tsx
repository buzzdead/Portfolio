import { Canvas, useFrame } from '@react-three/fiber'
import { ScrollControls, Scroll, useScroll, Environment, useCursor } from '@react-three/drei'
import { motion } from 'framer-motion'
import { useRef, useState, forwardRef } from 'react'
import { ArrowDown } from 'lucide-react'
import { EffectComposer, Bloom, DepthOfField, GodRays, ChromaticAberration } from "@react-three/postprocessing"
import * as THREE from 'three'
import { BlendFunction, KernelSize, Resizer, Resolution } from 'postprocessing'
import HolographicMaterial from './Introduction/HolographicMaterial'

const Introduction = () => {
  const sunRef = useRef<THREE.Mesh>(null)
  const [hasSun, setHasSun] = useState(false)

  return (
    <Canvas 
      style={{ height: '100vh', width: '100vw' }} 
      camera={{ position: [0, 0, 5] }}
       
    
    >
    <color attach="background" args={["#170400"]} />

      {/* Ambient Environment */}
      <Environment preset="warehouse" />

      {/* Soft Lighting */}

      {/* Sun */}
      <Sun sunRef={sunRef} setHasSun={() => setHasSun(true)} hasSun={hasSun} />

      {/* Scrolling System */}
      <ScrollControls pages={3} damping={0.2}>
        <Scroll>
          <SceneContent />

        </Scroll>
        <Scroll html>
          <TextOverlay />
        </Scroll>
      </ScrollControls>

      {/* Post Processing Effects */}
      <EffectComposer multisampling={0}>
        { //@ts-ignore
 <ChromaticAberration
 modulationOffset={0}
 offset={new THREE.Vector2(0.2, 0.0002)}
/>
        }
        
        <>{hasSun &&    <GodRays
            sun={sunRef.current}
            blendFunction={BlendFunction.SCREEN}
            samples={15}
            density={0.92}
            decay={0.96}
            weight={1}
            exposure={0.1}
            clampMax={1}
            width={Resolution.AUTO_SIZE}
            height={Resolution.AUTO_SIZE}
            kernelSize={KernelSize.MEDIUM}
            blur={true}
          />}</>
      </EffectComposer>
    </Canvas>
  )
}

/* Sun Component */
interface PP { hasSun: boolean, setHasSun: () => void }
const Sun = ({ sunRef, hasSun, setHasSun }: PP & { sunRef: React.RefObject<THREE.Mesh> }) => {
  useFrame(({ clock }) => {
    if (sunRef.current) {
      if(!hasSun) setHasSun()
      sunRef.current.position.x = Math.sin(clock.getElapsedTime() / 2) * -6
      sunRef.current.position.y = Math.cos(clock.getElapsedTime() / 2) * -6
    }
  })

  return (
    <mesh ref={sunRef} position={[0, 0, -15]}>
      <sphereGeometry args={[1, 36, 36]} />
      <meshBasicMaterial color={"#1B03A3"} />
    </mesh>
  )
}

/* 3D Scene Elements */
const SceneContent = () => {
  const scroll = useScroll()
  const sphereRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (sphereRef.current) {
      sphereRef.current.rotation.x = scroll.offset * Math.PI * 2
    }
  })

  return <Sphere sphereRef={sphereRef} />
}

const Sphere = ({ sphereRef }: { sphereRef: React.RefObject<THREE.Mesh> }) => {
  const [hovered, setHovered] = useState(false)
  useCursor(hovered)

  return (
    <mesh
      ref={sphereRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry />
      <meshPhysicalMaterial
       color={"red"}
        roughness={.50}
        metalness={1}
        clearcoat={1}
        
      />
    </mesh>
  )
}

/* Text Overlay */
const TextOverlay = () => {
  return (
    <div 
      style={{ 
        position: 'absolute', 
        top: -15, 
        left: '50%', 
        color: '#fff', 
        textAlign: 'center', 
        width: '100vw'
      }}
    >
      <motion.h1 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 1 }} 
        style={{ fontSize: '4rem', marginTop: '20vh', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
      >
       Velkommen
      </motion.h1>

      <motion.p 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 1, duration: 1 }} 
        style={{ fontSize: '1.5rem', marginTop: '10vh', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
      >
       <ArrowDown size={64} style={{ position: 'absolute', top: '30vh', color: '#fff', textAlign: 'center', width: '100vw'}} />
      </motion.p>
    </div>
  )
}

export default Introduction
