import { Canvas, useFrame } from '@react-three/fiber'
import { ScrollControls, Scroll, useScroll, Environment, useCursor, useGLTF, AdaptiveDpr, AdaptiveEvents, Clouds, Stars, Sparkles } from '@react-three/drei'
import { motion } from 'framer-motion'
import { useRef, useState, useEffect, Suspense } from 'react'
import { ArrowDown } from 'lucide-react'
import { EffectComposer, GodRays, Bloom } from "@react-three/postprocessing"
import * as THREE from 'three'
import { BlendFunction, KernelSize, Resolution } from 'postprocessing'
import SkipButton from './Introduction/SkipButon'
import HolographicMaterial from './Introduction/HolographicMaterial'

const Background = () => {
  const shaderRef = useRef<THREE.ShaderMaterial>(null);
  const scroll = useScroll();

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float uTime;
    uniform float uScroll;
    varying vec2 vUv;

    void main() {
      // Simple vertical gradient from dark to light
      vec3 colorBottom = vec3(0.09, 0.02, 0.0); // Dark reddish-brown (#170400)
      vec3 colorTop = vec3(0.2, 0.1, 0.05);     // Lighter warm tone
      vec3 gradient = mix(colorBottom, colorTop, vUv.y);

      // Optional: Add subtle time-based noise or scroll influence
      float noise = sin(vUv.x * 10.0 + uTime * 0.5) * cos(vUv.y * 5.0 + uTime * 0.3) * 0.05;
      gradient += noise;

      // Optional: Shift gradient based on scroll
      gradient = mix(gradient, vec3(0.3, 0.15, 0.1), uScroll * 0.2);

      gl_FragColor = vec4(gradient, 1.0);
    }
  `;

  useFrame(({ clock }) => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = clock.getElapsedTime();
      shaderRef.current.uniforms.uScroll.value = scroll.offset; // Scroll from 0 to 1 over pages
    }
  });

  return (
    <mesh position={[0, 0, -20]}> {/* Position behind other elements */}
      <planeGeometry args={[100, 100]} /> {/* Large enough to fill viewport */}
      <shaderMaterial
        ref={shaderRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uScroll: { value: 0 },
        }}
      />
    </mesh>
  );
};


const Introduction = () => {
  const sunRef = useRef<THREE.Mesh>(null)
  const [hasSun, setHasSun] = useState(false)
  const [bloomObjects, setBloomObjects] = useState<THREE.Mesh>()
 

  return (
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


<AdaptiveDpr pixelated />
<AdaptiveEvents />
<SkipButton />
    <color attach="background" args={["#170400"]} />
      {/* Ambient Environment */}
      <Environment preset="night" />
      <ambientLight intensity={1.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <hemisphereLight intensity={1}/>
      {/* Soft Lighting */}

      {/* Sun */}
      <Suspense>
      <Sun sunRef={sunRef} setHasSun={() => setHasSun(true)} hasSun={hasSun} />
      </Suspense>
      {/* Scrolling System */}
      <ScrollControls pages={3} damping={0.2}>
        <Scroll >
          <SceneContent hasBloom={bloomObjects !== null} setBloomObject={setBloomObjects} />
 
        </Scroll>
        <Scroll html>
          <TextOverlay />
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
  )
}

/* Sun Component */
interface PP { hasSun: boolean, setHasSun: () => void }

interface SunShaderProps extends PP {
  sunRef: React.RefObject<THREE.Mesh>;
  baseColor?: string; // Add color prop
  glowColor?: string; // Add glow color prop
}

const Sun = ({ sunRef, hasSun, setHasSun, baseColor = "#301934", glowColor = "#301934" }: SunShaderProps) => {
  const shaderRef = useRef<THREE.ShaderMaterial>(null)
  
  // Convert hex colors to vec3
  const baseColorVec = new THREE.Color(baseColor)
  const glowColorVec = new THREE.Color(glowColor)

  const vertexShader = `
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    
    void main() {
      vUv = uv;
      vPosition = position;
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `

  const fragmentShader = `
  uniform float uTime;
  uniform vec3 uBaseColor;
  uniform vec3 uGlowColor;
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;

  // Simplex noise functions
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    // First corner
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    // Other corners
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    // Permutations
    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    // Gradients: 7x7 points over a square, mapped onto an octahedron.
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    // Normalise gradients
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    // Mix final noise value
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    // Create more dynamic plasma layers
  float scale1 = 5.5;
    float scale2 = 7.0;
    float scale3 = 7.5;
    
    float timeScale1 = uTime * 0.5;
    float timeScale2 = uTime * 0.25;
    float timeScale3 = uTime * 0.1;

    // Create layered noise with different frequencies
    float n1 = snoise(vec3(vPosition.xy * scale1 + timeScale1, timeScale1));
    float n2 = snoise(vec3(vPosition.yz * scale2 + timeScale2, timeScale2));
    float n3 = snoise(vec3(vPosition.xz * scale3 + timeScale3, timeScale3));
    
    // Weighted combination of noise layers
    float combinedNoise = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;
    
    // Create more dynamic color variation
    vec3 hotColor = uBaseColor * 1.4;
    vec3 coolColor = uBaseColor * 0.6;
    vec3 plasmaColor = mix(coolColor, hotColor, combinedNoise);
    
    // Improved edge glow with distance falloff
    float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
    fresnel = smoothstep(0.0, 1.0, fresnel);
    
    // Create core glow
    float coreGlow = 1.0 - length(vUv - 0.5) * 1.8;
    coreGlow = max(0.0, coreGlow);
    coreGlow = pow(coreGlow, 1.5);

    // Combine plasma and glow effects
    vec3 finalColor = plasmaColor;
    finalColor += uGlowColor * fresnel * 0.4;
    finalColor += uGlowColor * coreGlow * 0.6;
    
    // Add subtle pulsing that affects both plasma and glow
    float pulse = sin(uTime * 0.5) * 0.1 + 1.9;
    finalColor *= pulse;
    
    // Smooth alpha for better blending
    float alpha = smoothstep(0.0, 0.2, coreGlow + fresnel * 0.3);
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`

  useFrame(({ clock }) => {
    if (sunRef.current) {
      if(!hasSun) setHasSun()
        const t = clock.getElapsedTime() / 2;
      sunRef.current.position.x = Math.sin(t) * -6 + Math.sin(t * 2) * 0.5; // Add wobble
      sunRef.current.position.y = Math.cos(t) * -6 + Math.cos(t * 1.5) * 0.3;
      if (shaderRef.current) {
        shaderRef.current.uniforms.uTime.value = clock.getElapsedTime() / 200;
      }
    }
  })

  return (
    <mesh ref={sunRef} position={[0, 0, -15]}>
    <sphereGeometry args={[1, 128, 128]} />
    <shaderMaterial
      ref={shaderRef}
      vertexShader={vertexShader}
      fragmentShader={fragmentShader}
      uniforms={{
        uTime: { value: 0 },
        uBaseColor: { value: new THREE.Vector3(baseColorVec.r, baseColorVec.g, baseColorVec.b) },
        uGlowColor: { value: new THREE.Vector3(glowColorVec.r, glowColorVec.g, glowColorVec.b) }
      }}
      transparent={true}
      toneMapped={false}
      blending={THREE.AdditiveBlending}
      depthWrite={false}
    />
  </mesh>
  )
}

/* 3D Scene Elements */
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
const TextOverlay = () => {
  return (
    <div 
      style={{ 
        position: 'absolute', 
        top: -30, 
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
        style={{color: 'green', fontSize: '4rem', marginTop: '20vh', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
      >
       Velkommen
      </motion.h1>
      <div style={{ position: 'absolute',top: '22.5vh' }}>
      <motion.p 
        initial={{ y: 10 }} 
        animate={{  y: [-10, 10, -10] }}  
        transition={{ repeat: Infinity, duration: 1.5 }}
        style={{ fontSize: '1.5rem', marginTop: '10vh', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
      >
       <ArrowDown size={64} style={{ position: 'absolute', color: 'teal', textAlign: 'center', width: '100vw'}} />
      </motion.p>
      </div>
    </div>
  )
}

const MyLogo = () => {
  const { scene } = useGLTF('./models/snake-v-logo.glb')
  scene.position.set(0.05, 0, 0)
  scene.rotation.set(0, 3, 0)
  scene.scale.set(.75, .75, .75)
  scene.traverse(child => {
    if (child instanceof THREE.Mesh) {
    
    }
  })
  return <primitive object={scene} />
}

export default Introduction
