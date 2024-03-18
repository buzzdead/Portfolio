import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { MutableRefObject, Suspense, forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import Loader from './Loader'
import { OrbitControls, Stars, useAnimations, useGLTF } from '@react-three/drei'
import { LoopRepeat, Mesh } from 'three'
import { useThreeScene } from './threeprovider'

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

const CelestialObject = forwardRef(({ planet, rotationSpeed }: CelestialObjectProps, forwardedRef) => {
  const { scene, animations } = useGLTF('/' + planet.name.toLowerCase() + '.glb')
  
  const planetRef = useRef<Mesh>(null)
  if(planetRef.current !== null) planetRef.current.name = planet.name
  useImperativeHandle(forwardedRef, () => planetRef.current);
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
})

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

interface PlanetShifterProps {
  planetName: string
  celestialObjectRefs: MutableRefObject<any[]>
  children: React.ReactNode
}

const PlanetShifter = ({planetName, celestialObjectRefs, children}: PlanetShifterProps) => {
  const {camera} = useThree()
  const getPositionOfPlanet = (planetName: string) => {
    // Find the index of the planet with the given name
    const planetIndex = planets.findIndex((planet) => planet.name === planetName);
    if (planetIndex === -1) {
      // Planet not found
      console.error(`Planet with name ${planetName} not found.`);
      return null;
    }
  
    // Get the ref of the planet
    const planetRef = celestialObjectRefs.current[planetIndex];
  
    // Check if the ref is valid
    if (!planetRef) {
      console.error(`Ref for planet ${planetName} not found.`);
      return null;
    }
  
    // Get the position of the planet
    const planetPosition = planetRef.rotation;

    if (planetPosition) {
      const planetP = planets.find(e => e.name === planetName)
      // Set camera position to look at the planet
      camera.position.set(planetPosition.x, planetPosition.y, planetPosition.z);
    }
    
    // Return the position
    return planetPosition;
  };
  
  useEffect(() => {
    console.log(getPositionOfPlanet(planetName))
  }, [planetName])
  return children
}

interface SpaceProps {
  rotationSpeed: number
  paused: boolean
  planetName: string
}

const Space = ({rotationSpeed, paused, planetName}: SpaceProps) => {

const celestialObjectRefs = useRef<any[]>([]);

  return (
    <Canvas
      className={`w-full h-full bg-transparent absolute`}
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
        <PlanetShifter celestialObjectRefs={celestialObjectRefs} planetName={planetName}>
        {planets.map((planet, index) => (
          <CelestialObject key={index} planet={planet} rotationSpeed={paused ? 0 : rotationSpeed} ref={(ref) => (celestialObjectRefs.current[index] = ref)} />
        ))}
        </PlanetShifter>
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
