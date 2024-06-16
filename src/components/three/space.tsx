import { Canvas, useThree } from '@react-three/fiber'
import { MutableRefObject, Suspense, useEffect, useRef } from 'react'
import Loader from './Loader'
import { CameraControls, Center, OrbitControls, Stars, useAnimations, useGLTF } from '@react-three/drei'
import { Group, LoopRepeat, Mesh, Object3DEventMap, Vector3 } from 'three'
import CelestialObject from './solarsystem/celestialobject'
import { planets, useSolarSystem } from './solarsystemprovider'
import Rocket from './solarsystem/rocket'

const Sun = () => {
  const { scene, animations } = useGLTF('/sun.glb')
  const planetRef = useRef<Mesh>(null)
  const { actions, names } = useAnimations(animations, planetRef)
  useEffect(() => {
    names.forEach(name => {
      const a = actions[name]
      if (a) {
        a.setEffectiveTimeScale(0.3)
        a.setLoop(LoopRepeat, Infinity).play()
      }
    })
  }, [actions, names])
  scene.scale.set(0.1, 0.1, 0.1)
  return (
    <mesh ref={planetRef}>
      <primitive object={scene} />
    </mesh>
  )
}

export type Scene = Group<Object3DEventMap>

interface PlanetShifterProps {
  planetName: string
  celestialObjectRefs: MutableRefObject<any[]>
}

export const getPositionOfPlanet = (
  planetName: string,
  celestialObjectRefs: MutableRefObject<any[]>
) => {
  const planetIndex = planets.findIndex(planet => planet.name === planetName)
  if (planetIndex === -1) {
    console.error(`Planet with name ${planetName} not found.`)
    return new Vector3(0, 0, 0)
  }
  const planetRef = celestialObjectRefs?.current[planetIndex]
  if (!planetRef) {
    console.error(`Ref for planet ${planetName} not found.`)
    return new Vector3(0, 0, 0)
  }

  const planetPosition = planetRef

  if (planetPosition) {
    if (planetPosition.children[0].matrixWorld.elements) {
      const mWorld =
        planetPosition.children[0]?.children[0]?.children[0]?.matrixWorld
          .elements
      const x = mWorld
        ? mWorld[12]
        : planetPosition.children[0].matrixWorld.elements[12]
      const z = mWorld
        ? mWorld[14]
        : planetPosition.children[0].matrixWorld.elements[14]
      return new Vector3(x, 0, z)
    }
  }

  return new Vector3(0, 0, 0)
}

export const getRefOfPlanet = (
  planetName: string,
  celestialObjectRefs: MutableRefObject<any[]>
) => {
  const planetIndex = planets.findIndex(planet => planet.name === planetName)
  const planetRef = celestialObjectRefs?.current[planetIndex]
  return planetRef
}

export const getGeometryOfPlanet = (
  planetRef: any
) => {
  const geometry = planetRef?.children[0]?.children[0]?.geometry
  const geometry2 = planetRef?.children[0]?.children[0]?.children[0]?.geometry
  const geometry3 = planetRef?.children[0]?.children[0]?.children[0]?.children[0]?.geometry
  const geo = geometry || geometry2 || geometry3
  return geo
}

const PlanetShifter = ({
  planetName,
  celestialObjectRefs
}: PlanetShifterProps) => {
  const { camera } = useThree()

  useEffect(() => {
    if (planetName !== '') {
      const position = getPositionOfPlanet(planetName, celestialObjectRefs)
      camera.position.x = position.x
      camera.position.z = position.z
      camera.position.y = 0
    }
  }, [planetName])
  return null
}

const Space = () => {
  const celestialObjectRefs = useRef<any[]>([])
  const { state } = useSolarSystem()

  return (
    <Canvas
      className={`w-full h-full bg-transparent absolute`}
      camera={{ fov: 20, position: [0, 5, 50], near: 0.1, far: 1000 }}
    >
      <PlanetShifter
        planetName={state.planetName}
        celestialObjectRefs={celestialObjectRefs}
      />
      <Suspense fallback={<Loader />}>
        <ambientLight intensity={1} />
        <Stars
          radius={360}
          depth={30}
          count={200000}
          factor={7}
          saturation={1}
          fade={true}
        />
        <Sun />
        <Rocket
          destination={state.liftOff ? state.destinationName : ''}
          planetName={state.planetName === '' ? 'Earth' : state.planetName}
          rotationSpeed={state.rotationSpeed}
          celestialObjectRefs={celestialObjectRefs}
        />
        {planets.map((planet, index) => (
          <CelestialObject
            key={index}
            planet={planet}
            showDescription={state.descriptionEnabled}
            rotationSpeed={state.paused ? 0 : state.rotationSpeed}
            ref={ref => (celestialObjectRefs.current[index] = ref)}
            grid={state.gridEnabled}
          />
        ))}
        <CameraControls />
        <directionalLight position={[1, 1, 2]} intensity={2} />
      </Suspense>
    </Canvas>
  )
}

export default Space
