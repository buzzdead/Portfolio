import { useEffect, useState } from 'react'
import { useThreeScene } from '../../components/three/threeprovider'
import Space from '../../components/three/space'
import FullPage from '../../components/layout/fullpage'
import { Box, Button, Flex } from '@chakra-ui/react'

const Solarsystem = () => {
  const threeState = useThreeScene()
  const [rotationSpeed, setRotationSpeed] = useState(0.0036)
  const [paused, setPaused] = useState(false)
  const [planetName, setPlanetName] = useState("")
  const increaseSpeed = () => {
    setRotationSpeed(rotationSpeed + 0.005)
  }

  const decreaseSpeed = () => {
    setRotationSpeed(Math.max(rotationSpeed - 0.005, 0.001))
  }
  const togglePause = () => {
    setPaused(!paused)
  }
  const toggleEarth = () => {
    planetName === "" ? setPlanetName("Earth") : setPlanetName("")
  }
  useEffect(() => {
    threeState.setState({ ...threeState.state, mode: 'Solar' })
  }, [])
  return (
    <FullPage>
        <Flex justify={'center'} alignItems={'center'} columnGap={5}>
      <Button
        onClick={decreaseSpeed}
      >
        Decrease Speed
      </Button>
      <Button onClick={togglePause}>
        {paused ? "Play" : 'Pause'}
      </Button>
      <Button
        onClick={increaseSpeed}
      >
        Increase Speed
      </Button>
     
      </Flex>
      <Space rotationSpeed={rotationSpeed} paused={paused} planetName={planetName}/>
    </FullPage>
  )
}

export default Solarsystem
