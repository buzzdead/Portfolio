import { Canvas } from '@react-three/fiber'
import {
  ScrollControls,
  Scroll,
  Environment,
  useGLTF,
  AdaptiveDpr,
  AdaptiveEvents,
  Stars,
  Sparkles,
  useAnimations
} from '@react-three/drei'
import { useRef, useState, Suspense, useEffect } from 'react'
import { EffectComposer, GodRays, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import { BlendFunction, KernelSize, Resolution } from 'postprocessing'
import Sun from './Introduction/Sun'
import TextOverlay from './Introduction/TextOverlay'
import Sphere from './Introduction/Sphere'

interface Props {
  setIntroduced: () => void
}
const Introduction = ({ setIntroduced }: Props) => {
  const sunRef = useRef<THREE.Mesh>(new THREE.Mesh())
  const [hasSun, setHasSun] = useState(false)

  return (
    <>
    <style>
      {`
        html, body {
          margin: 0;
          height: 100%;
          overflow: hidden;
        }
      `}
    </style>
    
    <div
      onClick={setIntroduced}
      style={{
        cursor: 'pointer',
        position: 'absolute',
        top: 15,
        zIndex: 18237,
        left: 15,
        fontSize: '24px'
      }}
    >
        Hopp over introduksjon
      </div>
      <Canvas
        style={{ height: '100vh', width: '100vw' }}
        camera={{
          position: [0, 0, 15],
          fov: 45, // Reduced from 80
          near: 0.1,
          far: 100,
          frustumCulled: false
        }}
        gl={{
          alpha: false,
          antialias: true,
          logarithmicDepthBuffer: true,
          powerPreference: 'high-performance'
        }}
      >
        <Stars
          fade={true}
          count={1000}
          speed={2.5}
          factor={0.75}
          radius={0.2}
        />

        <AdaptiveDpr  />
        <AdaptiveEvents />
        <Environment preset="night" />
        <ambientLight intensity={2} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <hemisphereLight intensity={1} />
        <Sun
          sunRef={sunRef}
          setHasSun={() => setHasSun(true)}
          hasSun={hasSun}
        />
        <ScrollControls pages={3} damping={0.2}>
          <Scroll>
            <SceneContent />
          </Scroll>
          <Scroll html>
            <TextOverlay setIntroduced={setIntroduced} />
          </Scroll>
        </ScrollControls>
        <>
          <MyLogo />
          <EffectComposer>
            <Bloom
              intensity={0.3}
              luminanceThreshold={0.5}
              luminanceSmoothing={0.9}
              mipmapBlur={true}
            />
            {/*   <ChromaticAberration
      blendFunction={BlendFunction.ADD}
      offset={new THREE.Vector2(0.2, 0)}
      modulationOffset={0.1}
      radialModulation={false}
    /> */}
            <>
              {hasSun && (
                <GodRays
                  sun={sunRef.current}
                  blendFunction={BlendFunction.SCREEN}
                  samples={25}
                  density={1}
                  decay={0.9}
                  weight={0.71}
                  exposure={0.8}
                  clampMax={1}
                  width={Resolution.AUTO_SIZE}
                  height={Resolution.AUTO_SIZE}
                  kernelSize={KernelSize.SMALL}
                  blur={true}
                />
              )}
            </>
          </EffectComposer>
        </>
      </Canvas>
    </>
  )
}

interface P1 {
  setBloomObject: (b: THREE.Mesh) => void
  hasBloom: boolean
}
const SceneContent = () => {
  const sphereRef = useRef<THREE.Mesh>(null)

  return (
    <Suspense fallback={null}>
      <group>
        <Sparkles count={100} size={1.25} speed={0.5} color={'teal'} />
        <Sphere sphereRef={sphereRef} />
      </group>
    </Suspense>
  )
}

const MyLogo = () => {
  const { scene, animations } = useGLTF('./models/snake.glb') // Load model & animations
  const { actions } = useAnimations(animations, scene) // Hook for animations
  const actionRef = useRef<any>(null)

  scene.position.set(0.05, 0, 0)
  scene.rotation.set(0, 3, 0)
  scene.scale.set(0.75, 0.75, 0.75)

  useEffect(() => {
    return () => {
      if (actionRef.current) actionRef.current.stop();
    };
  }, []);

  const handleHover = () => {
    if (actions["Turn"]) {
      if(actionRef?.current?.isPlaying) return
      actionRef.current = actions["Turn"]
      actionRef.current.setLoop(THREE.LoopOnce, 1) // Play once
      actionRef.current.time = 0 // Start from beginning
      actionRef.current.clampWhenFinished = true // Stop when reaching frame 40
      actionRef.current.play()
    }
  }

  const handleHoverExit = () => {
    if (actionRef.current) {
      if(actionRef?.current?.isPlaying) return
      actionRef.current.setLoop(THREE.LoopOnce, 1) // Play until end
      actionRef.current.clampWhenFinished = true
      actionRef.current.paused = false // Resume animation
    }
  }


 return (
    <primitive
      object={scene}
      onPointerOver={handleHover}
      onPointerOut={handleHoverExit}
    />
  )

}

export default Introduction
