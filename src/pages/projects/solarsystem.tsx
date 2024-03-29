import { useEffect, useRef } from 'react'
import { useThreeScene } from '../../components/three/threeprovider'
import Space from '../../components/three/space'
import FullPage from '../../components/layout/fullpage'
import { Button, Flex, Select } from '@chakra-ui/react'
import { planets, useSolarSystem } from '../../components/three/solarsystemprovider'

const Solarsystem = () => {
  const threeState = useThreeScene()
  const selectRef = useRef<string>('select')
  const { state, setState } = useSolarSystem()

  const increaseSpeed = () => {
    setState({...state, rotationSpeed: state.rotationSpeed += 0.005})
  }

  const decreaseSpeed = () => {
    setState({...state, rotationSpeed: Math.max(state.rotationSpeed - 0.005, 0.001)})
  }
  const togglePause = () => {
    setState({...state, paused: !state.paused})
  }
  const toggleTrackPlanet = () => {
    setState({...state, planetName: selectRef.current, paused: true})
  }
  const toggleGrid = () => {
    setState({...state, gridEnabled: !state.gridEnabled})
  }
  const toggleDescription = () => {
    setState({...state, descriptionEnabled: !state.descriptionEnabled})
  }
  useEffect(() => {
    threeState.setState({ ...threeState.state, mode: 'Solar' })
  }, [])
  return (
    <FullPage>
      <Flex
        justify={'center'}
        alignItems={'center'}
        columnGap={5}
        mt={1}
        bgColor={'blackAlpha.50'}
      >
        <Button onClick={decreaseSpeed}>Decrease Speed</Button>
        <Button onClick={togglePause}>{state.paused ? 'Play' : 'Pause'}</Button>
        <Button onClick={increaseSpeed}>Increase Speed</Button>
        <Select onChange={(value) => selectRef.current = value.target.value} placeholder="Select planet" width={'42'}>
          {planets.map((planet, id) => <option key={id} value={planet.name}>{planet.name}</option>)}
        </Select>
        <Button onClick={toggleTrackPlanet}>Travel</Button>
        <Button onClick={toggleGrid}>{state.gridEnabled ? "No Grid" : "Grid"}</Button>
        <Button onClick={() => setState({...state, liftOff: true})}>Lift off</Button>
      </Flex>
 
      <Space />
  
    </FullPage>
  )
}

export default Solarsystem
