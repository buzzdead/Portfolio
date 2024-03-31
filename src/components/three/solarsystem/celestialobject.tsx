import { useFrame } from '@react-three/fiber'
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { Center, useAnimations, useGLTF, Text } from '@react-three/drei'
import { LoopRepeat, Mesh, Vector3 } from 'three'
import Ecliptic from './ecliptic'
import ISS from './iss'
import PlanetDescription from './planetDescription'

type TechnologicalAdvancement = "Type 1" | "Type 2" | "Type 3"

type Description = {
  populationType: string
  population: string
  age: string
  technologicalAdvancement: TechnologicalAdvancement
}

type RocketPositionAdjustment = { xFactor: number; radiusFactor: number; zFactor: number}

export type Planet = {
  name: string
  distanceFromSun: number
  daysAroundSun: number
  description?: Description
  scale?: number
  hasISS?: boolean
  rocketAdjustment: RocketPositionAdjustment
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
      }
    })
    useEffect(() => {
      names.forEach(name => {
        const a = actions[name]
        if (a) {
          a.setEffectiveTimeScale(0.3)
          a.setLoop(LoopRepeat, Infinity).play()
        }
      })
    }, [actions, names])

    scene.scale.set(
      planet.scale || 0.2,
      planet.scale || 0.2,
      planet.scale || 0.2
    )
    scene.position.set(planet.distanceFromSun, 0, 0)
    return (
      <>
        <Center disableX>
          <mesh ref={planetRef}>
            <primitive object={scene} />
           
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
          <PlanetDescription planetRef={planetRef} planet={planet}/>
        )}
      </>
    )
  }
)

export default CelestialObject
