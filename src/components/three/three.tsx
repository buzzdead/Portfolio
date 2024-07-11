import { Canvas } from '@react-three/fiber'
import { forwardRef, Suspense } from 'react'
import Loader from './Loader'
import { Dragon } from './dragon'
import { useThreeScene } from './threeprovider'
import { Umbrella } from '../weather'

interface Props {
  pageRef: string
  isStormy: boolean
  umbrellaRef: any
}

const ThreeScene = (({ isStormy, pageRef, umbrellaRef }: Props) => {

  const threeScene = useThreeScene()
  if(threeScene.state.mode === 'Solar') return null
  return (
    <Canvas
    gl={{
      powerPreference: "high-performance",
      
    }}
      style={{ height: '200px', width: '100%' }}
      camera={{ fov: 20, position: [0, 0, 5], near: 0.1, far: 1000 }}
    >
     
        <directionalLight position={[1, 1, 2]} intensity={2} />
        
        <Dragon isStormy={isStormy} umbrellaRef={umbrellaRef} pageRef={pageRef} />
        
    </Canvas>
  )
})

export default ThreeScene
