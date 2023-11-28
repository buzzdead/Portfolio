import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect, useRef, useState } from 'react'
import Loader from './Loader'
import { Dragon } from './dragon'

const ThreeScene = () => {

  return (
    <Canvas
      className={`w-full bg-transparent absolute`}
      style={{ height: '150px' }}
      camera={{ fov: 20, position: [0, 0, 5], near: 0.1, far: 1000 }}
    >
      <Suspense fallback={<Loader />}>
        <directionalLight position={[1, 1, 2]} intensity={2} />
        <Dragon />
      </Suspense>
    </Canvas>
  )
}

export default ThreeScene
