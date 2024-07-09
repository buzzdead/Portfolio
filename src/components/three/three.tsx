import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import Loader from './Loader'
import { Dragon } from './dragon'
import { useThreeScene } from './threeprovider'

interface Props {
  pageRef: string
}

const ThreeScene = ({pageRef}: Props) => {

  const threeScene = useThreeScene()
  if(threeScene.state.mode === 'Solar') return null
  return (
    <Canvas
    gl={{
      powerPreference: "high-performance",
      
    }}
      style={{ height: '150px' }}
      camera={{ fov: 20, position: [0, 0, 5], near: 0.1, far: 1000 }}
    >
     
        <directionalLight position={[1, 1, 2]} intensity={2} />
        <Dragon pageRef={pageRef} />
      
    </Canvas>
  )
}

export default ThreeScene
