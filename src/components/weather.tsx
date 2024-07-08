import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Cloud, OrthographicCamera } from '@react-three/drei'
import { useMemo, useRef } from 'react'
import { useColorMode } from '@chakra-ui/react'
import * as THREE from 'three'
import { LightningStorm } from 'three-stdlib'

interface RainProps {
    cloudRef: any
    darkMode: boolean
}

const Rain = ({ cloudRef, darkMode }: RainProps) => {
    const rainRef = useRef<any>()
    const count = 1000
  
    const rainGeometry = useMemo(() => {
      const geometry = new THREE.BufferGeometry()
      const positions = []
      const velocities = []
  
      for (let i = 0; i < count; i++) {
        positions.push(
          (Math.random() - 0.5) * 2, // x
          Math.random() * 100,         // y
          (Math.random() - 0.5) * 2  // z
        )
        velocities.push(0,- 0.1, 0) // y-velocity
      }
  
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
      geometry.setAttribute('velocity', new THREE.Float32BufferAttribute(velocities, 3))
      return geometry
    }, [count])
  
    const rainMaterial = new THREE.PointsMaterial({
        color: 0xaaaaaa,
        size: 1.5,
        transparent: true,
        opacity: darkMode ? 0.5 : 1
    })
  
    useFrame(() => {
      if (rainRef.current) {
        const positions = rainRef.current.geometry.attributes.position.array
        const velocities = rainRef.current.geometry.attributes.velocity.array
  
        for (let i = 0; i < count * 3; i += 3) {
          positions[i + 1] += velocities[i + 1]
          if (positions[i + 1] < 0) {
            positions[i + 1] = 100
          }
        }
  
        rainRef.current.geometry.attributes.position.needsUpdate = true
      }
    })
  
    return (
      <mesh scale={5}><points ref={rainRef} geometry={rainGeometry} material={rainMaterial} position={new THREE.Vector3(0, -100, 0) ||  cloudRef?.current?.position || new THREE.Vector3(0,0,0)} /></mesh>
    )
  }
  
  export default Rain

interface CloudProps {
  isStormy: boolean
}

export const TransitionCloud = ({isStormy}: CloudProps) => {
  const lightModeColor = new THREE.Color("#b2cbf2")
  const darkModeColor = new THREE.Color("grey")

  const { colorMode } = useColorMode()
  const cloudRef = useRef<any>()
  const cloudRef2 = useRef<any>()
  const { viewport } = useThree()
  
  // Calculate the movement speed based on viewport width
  const movementSpeed = 0.0001 * viewport.width + (Math.max(Math.random(), 0.5) / 100)
  
  // Calculate the reset position based on viewport width
  const resetPosition = viewport.width / 2

  useFrame(() => {
    cloudRef.current.position.x += movementSpeed
    cloudRef2.current.position.x += movementSpeed
    
    if(cloudRef.current.position.x > resetPosition) cloudRef.current.position.x = -resetPosition
    if(cloudRef2.current.position.x > resetPosition) cloudRef2.current.position.x = -resetPosition
  })
  const cloud = useMemo(() => {
    return <Cloud
    ref={cloudRef}
    opacity={0.1}
    fade={10}
    speed={1.5}
    color={colorMode === "dark" ? darkModeColor : lightModeColor}
    position={[-8.95,4.5, 0]}
    segments={75}
    scale={0.11}
    volume={10}
  >
      {isStormy && <LightningS cloudRef={cloudRef} colorMode={colorMode}/>}
      {isStormy && <Rain darkMode={colorMode === "dark"} cloudRef={cloudRef}/>}
  </Cloud>
  }, [colorMode, isStormy])

  const cloud2 = useMemo(() => {
    return <Cloud
    ref={cloudRef2}
    opacity={viewport.width > 18 ? 0.1 : 0}
    fade={10}
    speed={1.5}
    color={colorMode === "dark" ? darkModeColor : lightModeColor}
    position={[8.95, 4.5, 0]}
    segments={75}
    scale={0.11}
    volume={10}
  >
       {isStormy && viewport.width > 18 && <LightningS cloudRef={cloudRef2} colorMode={colorMode}/>}
       {isStormy && viewport.width > 18 && <Rain darkMode={colorMode === "dark"} cloudRef={cloudRef2}/>}
  </Cloud>
  }, [colorMode, isStormy])

  return (
    <mesh>
   {cloud}
   {cloud2}

   </mesh>
  )
}

interface LightningSProps {
    cloudRef: any
    colorMode: any
}

  const LightningS = ({cloudRef, colorMode}: LightningSProps) => {
    const vertexShader = `
varying vec3 vPosition;
void main() {
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform float time;
uniform vec3 color1;
uniform vec3 color2;
varying vec3 vPosition;

void main() {
  float intensity = 1.0 - length(vPosition) / 10.0; // Adjust the divisor to control the spread
  vec3 color = mix(color1, color2, intensity);
  float newAlpha = 0.1 * time;
  gl_FragColor = vec4(color, newAlpha);
}
`;
const lightningMaterial = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      time: { value: 0 },
      color1: { value: new THREE.Color(colorMode === "dark" ? 'white' : '#f7d5d5') }, // Start color
      color2: { value: new THREE.Color(colorMode === "dark" ? '#f2eab8' : '#f2d2a2') }  // End color
    }
  });
    const lightningRef = useRef<any>()
    const lightning = useMemo(() => {
      const stormParams = {
        size: 10000,
        minHeight: 5800,
        maxHeight: 5000,
        maxSlope: 52.1,
        maxLightnings: 2,
        lightningMinPeriod: 3,
        lightningMaxPeriod: 7,
        lightningMinDuration: 0.1,
        lightningMaxDuration: 0.15,
        lightningParameters: {
          sourceOffset: new THREE.Vector3(0, 0, 0),
          destOffset: new THREE.Vector3(0, 0, 0),
          radius0: 0.2,
          radius1: 0.2,
          minRadius0: .02,
          maxIterations: 7,
          isEternal: true,
        },
        lightningMaterial,
        onRayPosition: (source: any, dest: any) => {
          // Set the source position to a specific area, e.g., within a small box area
          const cloudPosition = cloudRef.current.position
        source.set(0 + Math.random() * 2.5, cloudPosition.y, cloudPosition.z)
        dest.set(
          0,
          cloudPosition.y - (Math.random() * 20 + 10),
          cloudPosition.z + (Math.random() * 2 - 1) * 10
        )
         
        },
        onLightningDown: (lightning: any) => {
          // Handle the lightning down event if needed
          lightningMaterial.uniforms.time.value = 0;
        },
      }
      return new LightningStorm(stormParams)
    }, [colorMode])
  
    useFrame((state) => {
      if (lightning) {
        lightning.update(state.clock.getElapsedTime())
        lightningMaterial.uniforms.time.value += colorMode === "dark" ? 0.000001 : 1.25;
      }
    })
  
    return <mesh position={[0, -10, 0]} scale={1.5}><primitive ref={lightningRef} object={lightning} /></mesh>
  }

 interface StormProps {
  isStormy: boolean
 } 

export const Weather = ({isStormy}: StormProps) => {
    const cloud = useMemo(() => {
        return <TransitionCloud isStormy={isStormy} />
    }, [isStormy])

  return (
    <Canvas
      style={{ height: '500px', position: 'absolute', zIndex: -10 }}
      className={`w-full bg-transparent absolute`}
    >
      <OrthographicCamera makeDefault position={[0, 0, 10]} zoom={50} />
      <ambientLight intensity={2} />
      {cloud}
    </Canvas>
  )
}