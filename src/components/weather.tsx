import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Cloud, OrthographicCamera, useAnimations, useGLTF } from '@react-three/drei'
import { forwardRef, useEffect, useMemo, useRef, useState } from 'react'
import { useColorMode } from '@chakra-ui/react'
import * as THREE from 'three'
import { LightningStorm } from 'three-stdlib'
import ThreeScene2 from '../components/three/three'
import { Dragon } from './three/dragon'

interface RainProps {
    cloudRef: any
    darkMode: boolean
    umbrellaMesh: THREE.Mesh | null
    resetRain: boolean
}

const Rain = ({ cloudRef, darkMode, umbrellaMesh, resetRain }: RainProps) => {
  const rainRef = useRef<any>()
  const count = 1500
  const [it, resetIt] = useState(false)
  const timer = useRef(false)

  const rainGeometry = useMemo(() => {
      const geometry = new THREE.BufferGeometry()
      const positions = []
      const velocities = []

      for (let i = 0; i < count; i++) {
          positions.push(
              (Math.random() - 0.5) * 2, // x
              Math.random() * 100,       // y
              (Math.random() - 0.5) * 2  // z
          )
          velocities.push(0, -0.1, 0) // y-velocity
      }

      geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
      geometry.setAttribute('velocity', new THREE.Float32BufferAttribute(velocities, 3))
      return geometry
  }, [count, resetRain, it])

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

          // Calculate umbrella bounding box
          
          const umbrellaBox = umbrellaMesh ? new THREE.Box3().setFromObject(umbrellaMesh) : null;
          if(umbrellaBox)
          {
            umbrellaBox.max.x -= 0.3
          umbrellaBox.min.x += 0.3
          }
          for (let i = 0; i < count * 3; i += 3) {
            


              // Check if the raindrop is within the umbrella bounding box
              const localPosition = new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2])
              const worldPosition = rainRef.current.localToWorld(localPosition)
            
              worldPosition.z -= 9
              
              // Check if the raindrop is within the umbrella bounding box
              if (umbrellaBox && (umbrellaBox.containsPoint(worldPosition))) {
                if(positions[i + 1] < 98.5) positions[i + 1] = 0
                  positions[i + 1] += -0.001 // Position it at the top of the umbrella
                  const left = Math.random() > 0.5
                  positions[i] += left ? 0.05 : -0.05

                  if(!timer.current) { timer.current = true; setTimeout(() => {timer.current = false; resetIt(!it)}, 7500 ) }
              }
              else positions[i + 1] += velocities[i + 1]
              

              if (positions[i + 1] < timer.current ? 10 : 0) {
                  positions[i + 1] = 99.5
                  positions[i] = (Math.random() - 0.5) * 2
                  positions[i + 2] = (Math.random() - 0.5) * 2
              }
          }

          rainRef.current.geometry.attributes.position.needsUpdate = true
          rainRef.current.geometry.attributes.velocity.needsUpdate = true
      }
  })

  return (
      <mesh scale={5}>
          <points ref={rainRef} geometry={rainGeometry} material={rainMaterial} position={new THREE.Vector3(0, -100, 0)} />
      </mesh>
  )
}

export default Rain


interface CloudProps {
  isStormy: boolean
  umbrellaMesh: THREE.Mesh | null
}

export const TransitionCloud = ({isStormy = false, umbrellaMesh}: CloudProps) => {
  const lightModeColor = new THREE.Color("#b2cbf2")
  const darkModeColor = new THREE.Color("grey")
  const [opacitySet, setOpacitySet] = useState(0.0)
  const [reset, setReset] = useState(false)
  const [reset2, setReset2] = useState(false)
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
    if(opacitySet < 1) setOpacitySet(opacitySet + 0.1)
    if(cloudRef.current.position.x > resetPosition) {cloudRef.current.position.x = -resetPosition; setReset(!reset)}
    if(cloudRef2.current.position.x > resetPosition) {cloudRef2.current.position.x = -resetPosition; setReset2(!reset2)}
  })
  const cloud = useMemo(() => {
    return <Cloud
    ref={cloudRef}
    opacity={opacitySet}
    fade={10}
    speed={1.5}
    color={colorMode === "dark" ? darkModeColor : lightModeColor}
    position={[-8.95,4.5, 0]}
    segments={75}
    scale={0.105}

    volume={9}
    renderOrder={9999}
  >
      {isStormy && <LightningS cloudRef={cloudRef} colorMode={colorMode}/>}
      {isStormy && <Rain resetRain={reset} umbrellaMesh={umbrellaMesh} darkMode={colorMode === "dark"} cloudRef={cloudRef}/>}
  </Cloud>
  }, [colorMode, isStormy, opacitySet, reset])

  const cloud2 = useMemo(() => {
    return <Cloud
    ref={cloudRef2}
    opacity={viewport.width > 18 ? opacitySet : 0}
    fade={10}
    speed={1.5}
    color={colorMode === "dark" ? darkModeColor : lightModeColor}
    position={[8.95, 4.5, 0]}
    segments={75}
    scale={0.105}
    volume={9}
    renderOrder={9999}
  >
       {isStormy && viewport.width > 18 && <LightningS cloudRef={cloudRef2} colorMode={colorMode}/>}
       {isStormy && viewport.width > 18 && <Rain resetRain={reset2} umbrellaMesh={umbrellaMesh} darkMode={colorMode === "dark"} cloudRef={cloudRef2}/>}
  </Cloud>
  }, [colorMode, isStormy, opacitySet, reset2])

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
      color2: { value: new THREE.Color(colorMode === "dark" ? 'orange' : '#f2d2a2') }  // End color
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
  pageRef: any
 } 

export const Weather = ({isStormy = false, pageRef}: StormProps) => {
  const umbrellaRef = useRef<THREE.Mesh>(null)
    const cloud = useMemo(() => {
        return <TransitionCloud umbrellaMesh={umbrellaRef.current} isStormy={isStormy} />
    }, [isStormy])

  return (
    <div>
      <div style={{position: 'fixed', top: 0, left: 0, zIndex: 0, width: '100%', opacity: 1111}}>
      <Canvas
    gl={{
      powerPreference: "high-performance",
    }}
      style={{ height: '500px',}}
    >
      <OrthographicCamera makeDefault position={[0, 0, 10]} zoom={50} />
      <directionalLight position={[1, 1, 2]} intensity={1.25} />
      <ambientLight intensity={.251} />
      {//<Umbrella ref={umbrellaRef} isStormy={isStormy} />
      }
      <group position={[0, 2.75, 0]} scale={0.5}>
      <Dragon isStormy={isStormy} umbrellaRef={umbrellaRef} pageRef={pageRef} />
      </group>
{cloud}
        
      
    </Canvas>
    </div>    
    </div>
  )
}

interface UmbrellaProps {
  isStormy: boolean
}
export const Umbrella = forwardRef<THREE.Mesh, UmbrellaProps>(({ isStormy }, ref) => {
  const { scene, animations } = useGLTF('./umbrella2.glb')
  const [done, setDone] = useState(false)
  const open = useRef(false)
  const closedRef = useRef(false)
  const brellaOpened = useRef(false)
 
  const { actions } = useAnimations(animations, ref as any)

  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (!done && child.material) {
     
            // Increase the material's emissive property to make it brighter
           
            // Make sure the material responds to light
          

            child.material.color.multiplyScalar(11.5)

            child.material.needsUpdate = true;
            console.log(child.material)
            setDone(true)
          }

        }
      })
    }
  }, [scene])

  useFrame(() => {
    if(!brellaOpened.current) {
      handleStorm()
      brellaOpened.current = true
    }
    if(isStormy && !open.current) {
      if(ref && 'current' in ref && ref.current) {  
        ref.current.scale.multiplyScalar(1.045)
        if(ref.current.scale.x >= 5) {
          open.current = true
          
          setTimeout(() => handleStorm(), 1)
          
        }
      }
    }
    else if (!isStormy && open.current) {
      if(!closedRef.current) {
        closedRef.current = true
        handleStorm()
      }
      if(ref && 'current' in ref && ref.current) {
        ref.current.scale.multiplyScalar(0.97)
        if(ref.current.scale.x <= 1) {
          open.current = false
          closedRef.current = false
        }
      }
    }
    if(ref && 'current' in ref && ref.current) {
      const box1 = new THREE.Box3().setFromObject(ref.current)
    }
  })

  const handleStorm = () => {
    const stopAction = isStormy ? actions["Close"] : actions["Open"]
    stopAction?.stop()
    const action = isStormy ? actions["Open"] : actions["Close"]
    if(!action) return
    action.weight = 1;
    action.timeScale = 17.5
    action.setLoop(2200 as THREE.AnimationActionLoopStyles, 1);
    action.clampWhenFinished = true;
    action.zeroSlopeAtStart = true
    action.zeroSlopeAtEnd
    action.play();
    
  }

  return (
      <primitive ref={ref} scale={1} position={[0.5, 2.85, 2.5]}  object={scene} />
  )
})


Umbrella.displayName = 'Umbrella'
