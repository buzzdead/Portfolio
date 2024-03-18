import { Canvas, useFrame } from '@react-three/fiber'
import { Suspense, useEffect, useRef, useState } from 'react'
import Loader from './Loader'
import { OrbitControls, Stars, useAnimations, useGLTF } from '@react-three/drei'
import { LoopRepeat, Mesh } from 'three'
import { AnimationActionLoopStyles } from 'three'

type Planet = {
  name: string
  distanceFromSun: number
  daysAroundSun: number
  scale?: number
}

const planets: Planet[] = [
  {
    name: 'Mercury',
    distanceFromSun: 4,
    daysAroundSun: 88
  },
  {
    name: 'Venus',
    distanceFromSun: 7.2,
    daysAroundSun: 225
  },
  {
    name: 'Earth',
    distanceFromSun: 10,
    daysAroundSun: 365,
    scale: 0.002
  },
  {
    name: 'Mars',
    distanceFromSun: 15,
    daysAroundSun: 687
  },
  {
    name: 'Jupiter',
    distanceFromSun: 52,
    daysAroundSun: 4380,
    scale: 0.4
  },
  {
    name: 'Saturn',
    distanceFromSun: 95,
    daysAroundSun: 10767,
    scale: 0.0008
  },
  {
    name: 'Uranus',
    distanceFromSun: 192,
    daysAroundSun: 30660,
    scale: 0.4
  },
  {
    name: 'Neptune',
    distanceFromSun: 301,
    daysAroundSun: 60152
  }
]

interface CelestialObjectProps {
  planet: Planet
  rotationSpeed: number
}

const CelestialObject = ({planet, rotationSpeed}: CelestialObjectProps) => {
  const { scene, animations } = useGLTF('/' + planet.name.toLowerCase() + '.glb')
  
  const planetRef = useRef<Mesh>(null)
  const { actions, names } = useAnimations(animations, planetRef);
  useFrame(() => {
    if (planetRef.current) {
      const distanceFactor = 1 / planet.distanceFromSun; // Inverse distance factor
  
      // Adjust rotation speed based on distance from the Sun
      const adjustedRotationSpeed = rotationSpeed * distanceFactor;
  
      planetRef.current.rotation.y += adjustedRotationSpeed;
    }
  });
  useEffect(() => {
    names.forEach((name) => {
      console.log(name)
      const a = actions[name]
      if(a){
        a.setEffectiveTimeScale(0.3)
      a.setLoop(LoopRepeat, Infinity).play()
    }
    });
  }, [actions, names]);
  
  scene.scale.set(planet.scale || 0.2, planet.scale || 0.2, planet.scale || 0.2)
  scene.position.set(planet.distanceFromSun, 0, 0)
  return (
    <mesh ref={planetRef}>
      <primitive object={scene} />
    </mesh>
  )
}

const Sun = () => {
  const { scene, animations } = useGLTF('/sun.glb')
  const planetRef = useRef<Mesh>(null)
  const { actions, names } = useAnimations(animations, planetRef);
  useEffect(() => {
    names.forEach((name) => {
      console.log(name)
      const a = actions[name]
      if(a){
        a.setEffectiveTimeScale(0.3)
      a.setLoop(LoopRepeat, Infinity).play()
    }
    });
  }, [actions, names]);
  scene.scale.set(0.1, 0.1, 0.1)
  return (
    <mesh ref={planetRef}>
      <primitive object={scene} />
    </mesh>
  )
}

const Space = () => {
  const [rotationSpeed, setRotationSpeed] = useState(0.0036)
  const increaseSpeed = () => {
    setRotationSpeed(rotationSpeed + 0.001);
  };

  const decreaseSpeed = () => {
    setRotationSpeed(rotationSpeed - 0.001);
  };
  
  return (
    <Canvas
      className={`w-full h-full bg-transparent absolute`}
      style={{}}
      camera={{ fov: 20, position: [0, 0, 50], near: 0.1, far: 1000 }}
    >
      <Suspense fallback={<Loader />}>
        <ambientLight intensity={1} />
        <Stars
          radius={350}
          depth={30}
          count={200000}
          factor={7}
          saturation={1}
          fade={true}
        />
        <Sun />
        {planets.map((planet, index) => (
          <CelestialObject key={index} planet={planet} rotationSpeed={rotationSpeed} />
        ))}
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          zoomSpeed={0.6}
          panSpeed={0.5}
          rotateSpeed={0.4}
        />
        <directionalLight position={[1, 1, 2]} intensity={2} />
      </Suspense>
    </Canvas>
  )
}

export default Space
