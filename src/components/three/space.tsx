import { Canvas, ReactThreeFiber, useFrame, useThree } from '@react-three/fiber'
import { MutableRefObject, Suspense, forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import Loader from './Loader'
import { Center, OrbitControls, Stars, useAnimations, useGLTF } from '@react-three/drei'
import THREE, { BufferGeometry, Color, LoopRepeat, Mesh, Vector3 } from 'three'

type Planet = {
  name: string
  distanceFromSun: number
  daysAroundSun: number
  scale?: number
}

const t = {
  line: ('line' as any) as ((
    _: ReactThreeFiber.Object3DNode<THREE.Line, typeof THREE.Line>
  ) => JSX.Element),
};

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
  grid: boolean
}

const CelestialObject = forwardRef(({ planet, rotationSpeed, grid }: CelestialObjectProps, forwardedRef) => {
  const { scene, animations } = useGLTF('/' + planet.name.toLowerCase() + '.glb')
  
  const planetRef = useRef<Mesh>(null)
  const rotationRef = useRef<Mesh>(null)
  if(planetRef.current !== null) planetRef.current.name = planet.name
  useImperativeHandle(forwardedRef, () => planetRef.current);
  const { actions, names } = useAnimations(animations, planetRef);
  useFrame(() => {
    if (rotationRef.current) {
      const distanceFactor = 1 / planet.distanceFromSun; // Inverse distance factor
  
      // Adjust rotation speed based on distance from the Sun
      const adjustedRotationSpeed = rotationSpeed * distanceFactor;
  
      rotationRef.current.rotation.y += adjustedRotationSpeed;
    }
  });
  useEffect(() => {
    names.forEach((name) => {
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
    <>
    <mesh ref={rotationRef}>
      <Center disableX disableZ>
    <mesh ref={planetRef}>
      <primitive object={scene} />
    </mesh>
    </Center>
    </mesh>
    {grid && <Ecliptic xRadius={planet.distanceFromSun} zRadius={planet.distanceFromSun}/>}
    </>
  )
})

function Ecliptic({ xRadius = 1, zRadius = 1 }) {
  const orbitRef = useRef();
  const lineGeometry = new BufferGeometry();
  const fromColor = new Color(0xffffff); // Black color
  const toColor = new Color(0xffffff); // White color

  const animateColors = () => {
    const colors = [];

    for (let j = 0; j < 64; j++) {
      const percent = j / 63;
      const color = fromColor.clone().lerp(toColor, percent);
      colors.push(color.r, color.g, color.b);
    }

    lineGeometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(colors, 3)
    );
  };

  useEffect(() => {
    const animationId = requestAnimationFrame(animateColors);
    return () => cancelAnimationFrame(animationId);
  }, []);

  const points = [];
  for (let index = 0; index < 64; index++) {
    const angle = (index / 63) * 2 * Math.PI;
    const x = xRadius * Math.cos(angle);
    const z = zRadius * Math.sin(angle);
    points.push(new Vector3(x, 0, z));
  }

  points.push(points[0]);

  lineGeometry.setFromPoints(points);

  return (
    <t.line geometry={lineGeometry}>
      {/* <lineBasicMaterial
        ref={orbitRef}
        attach="material"
        vertexColors={THREE.VertexColors}
        linewidth={10}
      /> */}
      <lineBasicMaterial attach="material" color="#393e46" linewidth={10} />
    </t.line>
  );
}

const Sun = () => {
  const { scene, animations } = useGLTF('/sun.glb')
  const planetRef = useRef<Mesh>(null)
  const { actions, names } = useAnimations(animations, planetRef);
  useEffect(() => {
    names.forEach((name) => {
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
}

const PlanetShifter = ({planetName, celestialObjectRefs }: PlanetShifterProps) => {
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
    const planetPosition = planetRef;

    if (planetPosition) {
      const planetP = planets.find(e => e.name === planetName)
      const posX = planetP?.distanceFromSun
      const rotatedByDegree = planetPosition.rotation._y
      // Set camera position to look at the planet
      //camera.position.x = 1.5 + (planetP?.distanceFromSun || 2)
      //camera.position.y = 0
      if(planetPosition.children[0].matrixWorld.elements)
      {
        console.log(planetPosition.children[0].matrixWorld.elements)
        const x = planetPosition.children[0].matrixWorld.elements[12]
        const z = planetPosition.children[0].matrixWorld.elements[14]
        console.log(x,z)
        camera.position.x = x
        camera.position.z = z
        camera.position.y = 0
      }
      //camera.position.z = planetPosition.rotation._y * -(planetP?.distanceFromSun || 1) - 1
    }
    
    // Return the position
    return planetPosition;
  };
  
  useEffect(() => {
    getPositionOfPlanet(planetName)
  }, [planetName])
  return null
}

interface SpaceProps {
  rotationSpeed: number
  paused: boolean
  planetName: string
  grid: boolean
}

const Space = ({rotationSpeed, paused, planetName, grid}: SpaceProps) => {
const celestialObjectRefs = useRef<any[]>([]);

  return (
    <Canvas
      className={`w-full h-full bg-transparent absolute`}
      camera={{ fov: 20, position: [0, 5, 50], near: 0.1, far: 1000 }}
    >
      <PlanetShifter planetName={planetName} celestialObjectRefs={celestialObjectRefs} />
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
          <CelestialObject key={index} planet={planet} rotationSpeed={paused ? 0 : rotationSpeed} ref={(ref) => (celestialObjectRefs.current[index] = ref)} grid={grid} />
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
