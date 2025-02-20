import { Canvas, useFrame } from '@react-three/fiber'
import { ScrollControls, Scroll, useScroll, Environment, useCursor, useGLTF, AdaptiveDpr, AdaptiveEvents, Clouds, Stars, Sparkles } from '@react-three/drei'
import { motion } from 'framer-motion'
import { useRef, useState, useEffect, Suspense } from 'react'
import { ArrowDown } from 'lucide-react'
import { EffectComposer, GodRays, Bloom } from "@react-three/postprocessing"
import * as THREE from 'three'
import { BlendFunction, KernelSize, Resolution } from 'postprocessing'
import HolographicMaterial from './Introduction/HolographicMaterial'
import Sun from './Introduction/Sun'

const Background = () => {
  const shaderRef = useRef<THREE.ShaderMaterial>(null);

    const uniforms = useRef({
      uTime: { value: 0 },
    }).current;

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float uTime;
    varying vec2 vUv;

    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    void main() {
      vec2 uv = vUv;
      
      // Create base dark color
      vec3 baseColor = vec3(0.09, 0.02, 0.0); // Very dark reddish brown
      
      // Add subtle noise movement
      float noise = random(uv + uTime * 0.02) * 0.015;
      
      // Create subtle gradient
      float gradientY = smoothstep(0.0, 1.0, uv.y);
      float gradientX = smoothstep(0.0, 1.0, uv.x);
      
      // Combine effects
      vec3 color = baseColor;
      color += vec3(0.02, 0.01, 0.03) * gradientY; // Subtle vertical gradient
      color += vec3(0.01, 0.005, 0.02) * gradientX; // Subtle horizontal gradient
      color += noise;
      
      // Add very subtle pulsing
      float pulse = sin(uTime * 0.2) * 0.005;
      color += pulse;

      gl_FragColor = vec4(color, 1.0);
    }
  `;

  useFrame(({ clock }) => {
    if (shaderRef.current) {
      uniforms.uTime.value = clock.getElapsedTime() * 100;
    }
  });

  return (
    <mesh position={[0, 0, -1]}>
      <shaderMaterial
        ref={shaderRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
      />
    </mesh>
  );
};

interface Props {
  setIntroduced: () => void
}
const Introduction = ({setIntroduced}: Props) => {
  const sunRef = useRef<THREE.Mesh>(new THREE.Mesh())
  const [hasSun, setHasSun] = useState(false)
  const [bloomObjects, setBloomObjects] = useState<THREE.Mesh>()
 

  return (
    <>
    <div onClick={setIntroduced} style={{cursor: 'pointer', position: 'absolute', top: 15, zIndex: 18237, left: 15, fontSize: '24px'}}>Hopp over introduksjon</div>
    <Canvas
  style={{ height: '100vh', width: '100vw' }}
  camera={{
    position: [0, 0, 15], 
    fov: 45,     // Reduced from 80
    near: 0.1,   
    far: 100,
    frustumCulled: false
  }}
  gl={{
    alpha: false,
    antialias: true,
    logarithmicDepthBuffer: true,
    powerPreference: "high-performance",
  }}
> 


<Stars fade={true} count={1000} speed={2.5} factor={.75} radius={.2}/>

<AdaptiveDpr pixelated />
<AdaptiveEvents />

      {/* Ambient Environment */}
      <Environment preset="night" />
      <ambientLight intensity={1.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <hemisphereLight intensity={1}/>
      {/* Soft Lighting */}

      {/* Sun */}
      <Sun sunRef={sunRef} setHasSun={() => setHasSun(true)} hasSun={hasSun} />

      {/* Scrolling System */}
      <ScrollControls pages={3} damping={0.2}>
        <Scroll >
          <SceneContent hasBloom={bloomObjects !== null} setBloomObject={setBloomObjects} />
 
        </Scroll>
        <Scroll html>
          <TextOverlay setIntroduced={setIntroduced}/>
        </Scroll>
      </ScrollControls>

      {/* Post Processing Effects */} 
      <>
  {/* EffectComposer for the Sphere (Layer 0) */}
  <MyLogo />
  <EffectComposer>
  <Bloom
    intensity={.5} // Reduced from default
    luminanceThreshold={0.2} // Increased threshold
    luminanceSmoothing={0.9}
    mipmapBlur={true}
  />
  {/*   <ChromaticAberration
      blendFunction={BlendFunction.ADD}
      offset={new THREE.Vector2(0.2, 0)}
      modulationOffset={0.1}
      radialModulation={false}
    /> */}
    <>{hasSun && (
      <GodRays
        sun={sunRef.current}
        blendFunction={BlendFunction.SCREEN}
        samples={30}
        density={1}
        decay={0.9}
        weight={.71}
        exposure={.8}
        clampMax={1}
        width={Resolution.AUTO_SIZE}
        height={Resolution.AUTO_SIZE}
        kernelSize={KernelSize.SMALL}
        blur={true}
      />
  )}
  </>
  </EffectComposer>

  {/* EffectComposer for the Sun (Layer 1) */}
  
</>
    </Canvas>
    </>
  )
}

interface P1 {

setBloomObject: (b: THREE.Mesh) => void
hasBloom: boolean
}
const SceneContent = ({hasBloom, setBloomObject}: P1) => {
  const scroll = useScroll()
  const sphereRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (sphereRef.current) {
      //sphereRef.current.rotation.x = scroll.offset * Math.PI * 2
      
      // Compensate for perspective distortion
      const yPos = sphereRef.current.position.y
      const distanceScale = Math.abs(yPos) * 0.1 + 1
      sphereRef.current.scale.setScalar(1 / distanceScale)
    }
  })

  useEffect(() => {
    if(sphereRef.current) {console.log("hm"); setBloomObject(sphereRef.current)}
  }, [sphereRef])

  return <group> <Suspense fallback={null}>
  <Sparkles count={100} size={1} speed={0.5} color={"teal"} />
</Suspense>
<Sphere sphereRef={sphereRef} /></group>
}

// Update the Sphere component
const Sphere = ({ sphereRef }: { sphereRef: React.RefObject<THREE.Mesh> }) => {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  useEffect(() => {
    if (sphereRef.current) {
      const yPos = sphereRef.current.position.y;
    const distanceScale = THREE.MathUtils.lerp(1, 1.1, Math.abs(yPos) * 0.05);
    sphereRef.current.scale.setScalar(distanceScale);
    }
  }, []);

  return (
    <mesh
      ref={sphereRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[1, 64, 64]} />
      <HolographicMaterial /> {/* Use the shader here */}
    </mesh>
  );
};

/* Text Overlay */
const TextOverlay = ({setIntroduced}: Props) => {
  const scroll = useScroll();
  const [scrollPosition, setScrollPosition] = useState(0);

  useFrame(() => {
    setScrollPosition(scroll.offset);
  });

  return (
    <>
      {/* First page content */}
      <motion.div 
        style={{ 
          position: 'absolute', 
          top: -30, 
          left: '50%', 
          color: '#fff', 
          textAlign: 'center', 
          width: '100vw',
          opacity: 1 - scrollPosition * 2 // Fade out as we scroll
        }}
      >
        <motion.h1 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 1 }} 
          style={{
            color: 'green', 
            fontSize: '4rem', 
            marginTop: '20vh', 
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
          }}
        >
          Velkommen
        </motion.h1>
        <div style={{ position: 'absolute', top: '22.5vh' }}>
          <motion.p 
            initial={{ y: 10 }} 
            animate={{ y: [-10, 10, -10] }}  
            transition={{ repeat: Infinity, duration: 1.5 }}
            style={{ 
              fontSize: '1.5rem', 
              marginTop: '10vh', 
              textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
            }}
          >
            <ArrowDown size={64} style={{ 
              position: 'absolute', 
              color: 'teal', 
              textAlign: 'center', 
              width: '100vw'
            }} />
          </motion.p>
        </div>
      </motion.div>

      {/* Second page content */}
      <motion.div
        style={{
          position: 'absolute',
          top: '100vh', // Position it on the second page
          left: '50%',
          color: '#fff',
          textAlign: 'center',
          width: '100vw',
          opacity: Math.max(0, (scrollPosition) + 0.15 * 2) // Start fading in after first content fades out
        }}
      >
        <motion.h2
          style={{
            color: 'green',
            fontSize: '3.5rem',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
          }}
        >
          Mitt navn er Sigmund Volden
        </motion.h2>
      </motion.div>
      <motion.div
        style={{
          position: 'absolute',
          top: '175vh', // Position it on the second page
          left: '50%',
          color: '#fff',
          textAlign: 'center',
          width: '100vw',
          opacity: Math.max(0, (scrollPosition - 0.3) * 2) // Start fading in after first content fades out
        }}
      >
        <motion.h2
          style={{
            color: 'green',
            fontSize: '3.5rem',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
          }}
        >
          Jeg er en programerer som liker å utivkle nettsider og spill
        </motion.h2>
      </motion.div>
      <motion.div
        style={{
          position: 'absolute',
          top: '225vh', // Position it on the second page
          left: '50%',
          color: '#fff',
          textAlign: 'center',
          width: '100vw',
          opacity: Math.max(0, (scrollPosition - 0.6) * 2) // Start fading in after first content fades out
        }}
      >
        <motion.h2
        onClick={setIntroduced}
          style={{
            color: 'blue',
            cursor: 'pointer',
            textDecoration: 'underline',
            fontSize: '3.5rem',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
          }}
        >
          Klikk for å gå videre til nettsiden
        </motion.h2>
      </motion.div>
    </>
  );
};

const MyLogo = () => {
  const { scene } = useGLTF('./models/snake-v-logo.glb')
  scene.position.set(0.05, 0, 0)
  scene.rotation.set(0, 3, 0)
  scene.scale.set(.75, .75, .75)

  return <primitive object={scene} />
}

export default Introduction
