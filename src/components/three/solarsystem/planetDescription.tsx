import { Planet } from './celestialobject'
import { Text } from '@react-three/drei'
import { Vector3 } from 'three'

interface Props {
  planet: Planet
  planetRef: any
}

const PlanetDescription = ({ planet, planetRef }: Props) => {
const getPositionOfPlanet = (planetRef: any) => {
    if(!planetRef) return
    if(!planetRef.current) return
    const planetPosition = planetRef?.current?.children[0]
    
    if(planetPosition)
    {  if (planetPosition.children[0].matrixWorld.elements) {
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
    }}
    return new Vector3(0,0,0)
    
    }
  const textField = (
    text1: string,
    text2: string | undefined,
    shiftY?: Vector3
  ) => {
    return (
      <group position={shiftY}>
        <Text fontSize={0.1} color={'white'}>
          {text1}:
        </Text>
        <Text position={[0.5, 0, 0]} color={'green'} fontSize={0.1}>
          {text2 || 'Unknown'}
        </Text>
      </group>
    )
  }
  return (
    <group position={getPositionOfPlanet(planetRef)} rotation={[0, 1.5, 0]}>
      {textField('Inhabitants', planet?.description?.populationType)}
      {textField(
        'Population',
        planet?.description?.population,
        new Vector3(0, -0.15, 0)
      )}
      {textField('Age', planet?.description?.age, new Vector3(0, -0.3, 0))}
      {textField(
        'Advancement',
        planet?.description?.technologicalAdvancement,
        new Vector3(0, -0.45, 0)
      )}
    </group>
  )
}

export default PlanetDescription