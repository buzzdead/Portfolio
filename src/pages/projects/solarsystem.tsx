import { useEffect, useRef, useState } from 'react'
import { useThreeScene } from '../../components/three/threeprovider'
import Space from '../../components/three/space'
import FullPage from '../../components/layout/fullpage'
import { Button, Flex, Select } from '@chakra-ui/react'
import { Planet } from '../../components/three/solarsystem/celestialobject'
import { SolarSystemProvider } from '../../components/three/solarsystemprovider'

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
    scale: 0.002,
    description: {
      population: "6 billion",
      populationType: "Human",
      technologicalAdvancement: "Type 1",
      age: "4.5 billion"
    }
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

const Solarsystem = () => {
  const threeState = useThreeScene()
  const [rotationSpeed, setRotationSpeed] = useState(0.0036)
  const [paused, setPaused] = useState(false)
  const [planetName, setPlanetName] = useState('')
  const [enableGrid, setEnableGrid] = useState(false)
  const [enableDescription, setEnableDescription] = useState(false)
  const [liftOff, setLiftOff] = useState(false)
  const selectRef = useRef<string>('select')
  const increaseSpeed = () => {
    setRotationSpeed(rotationSpeed + 0.005)
  }

  const decreaseSpeed = () => {
    setRotationSpeed(Math.max(rotationSpeed - 0.005, 0.001))
  }
  const togglePause = () => {
    setPaused(!paused)
  }
  const toggleTrackPlanet = () => {
    setPlanetName(selectRef.current)
    !paused && togglePause()
  }
  const toggleGrid = () => {
    setEnableGrid(!enableGrid)
  }
  const toggleDescription = () => {
    setEnableDescription(!enableDescription)
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
        <Button onClick={togglePause}>{paused ? 'Play' : 'Pause'}</Button>
        <Button onClick={increaseSpeed}>Increase Speed</Button>
        <Select onChange={(value) => selectRef.current = value.target.value} placeholder="Select planet" width={'42'}>
          {planets.map((planet, id) => <option key={id} value={planet.name}>{planet.name}</option>)}
        </Select>
        <Button onClick={toggleTrackPlanet}>Travel</Button>
        <Button onClick={toggleGrid}>{enableGrid ? "No Grid" : "Grid"}</Button>
        <Button onClick={() => setLiftOff(true)}>Lift off</Button>
      </Flex>
      <SolarSystemProvider>
      <Space
        rotationSpeed={rotationSpeed}
        paused={paused}
        planetName={planetName}
        grid={enableGrid}
        showDescription={enableDescription}
        lift={liftOff}
      />
      </SolarSystemProvider>
    </FullPage>
  )
}

export default Solarsystem
