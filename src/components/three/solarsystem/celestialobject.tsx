import { useFrame } from '@react-three/fiber'
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from 'react'
import { Center, useAnimations, useGLTF, Text } from '@react-three/drei'
import {
  AdditiveBlending,
  BackSide,
  Box3,
  Color,
  LoopRepeat,
  Mesh,
  ShaderMaterial,
  SphereGeometry,
  Vector3
} from 'three'
import Ecliptic from './ecliptic'
import ISS from './iss'
import PlanetDescription from './planetDescription'
import vertexShader from './shaders/vertex.glsl.js'
import fragmentShader from './shaders/fragment.glsl'

type TechnologicalAdvancement = 'Type 1' | 'Type 2' | 'Type 3'

type Description = {
  populationType: string
  population: string
  age: string
  technologicalAdvancement: TechnologicalAdvancement
}

type RocketPositionAdjustment = {
  xFactor: number
  radiusFactor: number
  zFactor: number
}

export type Planet = {
  name: string
  distanceFromSun: number
  daysAroundSun: number
  description?: Description
  scale?: number
  hasISS?: boolean
  rocketAdjustment: RocketPositionAdjustment
  atmosphere: {x?: number; y: number; z: number; color: Color }
}

interface Props {
  planet: Planet
  rotationSpeed: number
  grid: boolean
  showDescription: boolean
}

const CelestialObject = forwardRef(
  ({ planet, rotationSpeed, grid, showDescription }: Props, forwardedRef) => {
    const { scene, animations } = useGLTF(
      '/' + planet.name.toLowerCase() + '.glb'
    )

    const issRef = useRef<any>(null)
    const planetRef = useRef<Mesh>(null)
    const atmoSphereRef = useRef<Mesh>(null)
    if (planetRef.current !== null) planetRef.current.name = planet.name
    useImperativeHandle(forwardedRef, () => planetRef.current)
    const { actions, names } = useAnimations(animations, planetRef)
    useFrame(({ clock }) => {
      if (planetRef.current) {
        const distanceFactor = 1 / planet.distanceFromSun
        const adjustedRotationSpeed = rotationSpeed * distanceFactor
        if (issRef.current) {
        }
        planetRef.current.rotation.y += adjustedRotationSpeed
        if (atmoSphereRef.current)
          atmoSphereRef.current.rotation.y += adjustedRotationSpeed
      }
      if(planet.name === "Mars" || planet.name === "Venus") {
        if(scene) {
          
          scene.rotation.y += 0.005
        }
      }
    })
    const [atmoSphere, setAtmoSphere] = useState<Mesh>()
    useEffect(() => {
      names.forEach(name => {
        const a = actions[name]
        if (a) {
          a.setEffectiveTimeScale(0.3)
          a.setLoop(LoopRepeat, Infinity).play()
        }
      })
    }, [actions, names])


    const isScaleDownRadius = () => {
      if(planet.name === "Earth") return 0.25
      if(planet.name === "Jupiter") return 0.2
      if(planet.name === "Saturn") return 1.15
      else return 0.1
    }

    useEffect(() => {
      if (planetRef.current) {
        const boundingBox = new Box3().setFromObject(planetRef.current)
        const size = new Vector3()
        boundingBox.getSize(size)
        const sphereRadius = size.length() / 2
        const geometry2 = new SphereGeometry(sphereRadius - isScaleDownRadius(), 25, 25)
        const material2 = new ShaderMaterial({
          vertexShader,
          fragmentShader,
          blending: AdditiveBlending,
          side: BackSide, 
          uniforms: {
            planetColor: {value: planet.atmosphere.color}
          }
        })
        const mesh = new Mesh(geometry2, material2)
        mesh.position.set(planet.distanceFromSun + (planet.atmosphere.x || 0), planet.atmosphere.y || 0, planet.atmosphere.z || 0)
        setAtmoSphere(mesh)
      }
    }, [scene])

    scene.scale.set(
      planet.scale || 0.2,
      planet.scale || 0.2,
      planet.scale || 0.2
    )
    scene.position.set(
      planet.distanceFromSun,
      0,
      0
    ) 
    
    return (
      <>
        <Center disableX>
          <mesh ref={planetRef}>
            <primitive object={scene} />
            {atmoSphere && <primitive object={atmoSphere} />}
            {planet.hasISS && <ISS planetRef={planetRef} />}
          </mesh>
        </Center>
        {grid && (
          <Ecliptic
            xRadius={planet.distanceFromSun}
            zRadius={planet.distanceFromSun}
          />
        )}
        {showDescription && (
          <PlanetDescription planetRef={planetRef} planet={planet} />
        )}
      </>
    )
  }
)

export default CelestialObject
