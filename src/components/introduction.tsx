import { Canvas, useFrame } from '@react-three/fiber'
import {
  ScrollControls,
  Scroll,
  Environment,
  useGLTF,
  AdaptiveDpr,
  AdaptiveEvents,
  Stars,
  Sparkles,
  useAnimations,
  useScroll
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
const ScrollHandler = ({ scrollRef }: { scrollRef: React.MutableRefObject<number> }) => {
  const scroll = useScroll()
  
  useFrame(() => {
    scrollRef.current = scroll.offset
  })
  
  return null
}
const Introduction = ({ setIntroduced }: Props) => {
  const sunRef = useRef<THREE.Mesh>(new THREE.Mesh())
  const [hasSun, setHasSun] = useState(false)
  const scrollRef = useRef<number>(0)
  
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
            <ScrollHandler scrollRef={scrollRef} /> 
          </Scroll>
          <Scroll html>
            <TextOverlay setIntroduced={setIntroduced} />
          </Scroll>
        </ScrollControls>
        <>
        <MyLogo scrollRef={scrollRef} />
          <EffectComposer>
           
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
        <Sparkles scale={1.6} count={100} size={2} speed={.5} color={'yellow'} opacity={0.15}/>
        <Sphere />
      </group>
    </Suspense>
  )
}

const MyLogo = ({ scrollRef }: { scrollRef: React.RefObject<number> }) => {
  const { scene, animations } = useGLTF("./models/snakes.glb"); // Load model & animations
  const { actions, mixer } = useAnimations(animations, scene); // Hook for animations

  const hasPlayedAttach = useRef(false);
  const isPlayingAnimation = useRef(false);
  const actionRef = useRef<THREE.AnimationAction | null>(null);

  scene.position.set(0.15, 0, 0);
  scene.rotation.set(0, 3, 0);
  scene.scale.set(1.25, 1.25, 1.25);

  useEffect(() => {
    return () => {
      if (actionRef.current) actionRef.current.stop();
      mixer.stopAllAction(); // Stop animations on unmount
    };
  }, [mixer]);

  // Listen for animation completion
  useEffect(() => {
    const handleAnimationFinish = (e: { action: THREE.AnimationAction }) => {
      if (e.action === actions["Attach"]) {
        hasPlayedAttach.current = true;
        isPlayingAnimation.current = false;
      }
      if (e.action === actions["Detatch"]) {
        hasPlayedAttach.current = false;
        isPlayingAnimation.current = false;
      }
    };

    mixer.addEventListener("finished", handleAnimationFinish);

    return () => {
      mixer.removeEventListener("finished", handleAnimationFinish);
    };
  }, [actions, mixer]);

  useFrame(() => {
    if (!scrollRef.current || !actions["Attach"] || !actions["Detatch"]) return;

    // Play "Attach" animation when scrolling past 0.8
    if (scrollRef.current > 0.8 && !hasPlayedAttach.current && !isPlayingAnimation.current) {
      const attachAction = actions["Attach"];
      if(actionRef.current) actionRef.current.stop();
      actionRef.current = attachAction;
      attachAction.reset();
      attachAction.setLoop(THREE.LoopOnce, 1);
      attachAction.clampWhenFinished = true;
      attachAction.timeScale = 1.75; // Increase speed by 20%
      attachAction.play();

      isPlayingAnimation.current = true;
    }

    // Play "Detatch" animation when scrolling below 0.7 (only if "Attach" has finished)
    if (scrollRef.current < 0.7 && hasPlayedAttach.current && !isPlayingAnimation.current) {
      const detachAction = actions["Detatch"];
      if(actionRef.current) actionRef.current.stop();
      actionRef.current = detachAction;
      detachAction.reset();
      detachAction.setLoop(THREE.LoopOnce, 1);
      detachAction.clampWhenFinished = true;
      detachAction.timeScale = 1.75; // Increase speed by 20%
      detachAction.play();

      isPlayingAnimation.current = true;
    }
  });

  return <primitive object={scene} />;
};

export default Introduction
