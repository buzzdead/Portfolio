import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { Suspense, useEffect, useRef } from 'react'
import Loader from './Loader'
import * as THREE from 'three';
import { OrbitControls, Stars, useGLTF } from '@react-three/drei'
const image = require('../../../public/images/space.jpg')

const Sun = () => {
    const { scene } = useGLTF('/suncomp.glb');
    scene.scale.set(0.1, 0.1, 0.1)
    return (
        <mesh>
        <primitive object={scene} />
        </mesh>
    );
}

const Mercury = () => {
  const { scene } = useGLTF('/mercurycomp.glb');
  const mercuryRef = useRef();

  // Rotate Mercury around the Sun
  useFrame(() => {
      if (mercuryRef.current) {
          mercuryRef.current.rotation.y += 0.0036; // Adjust the speed of rotation as needed
      }
  });

  scene.scale.set(0.2, 0.2, 0.2)
  scene.position.set(4, 0, 0)
  return (
      <mesh ref={mercuryRef}>
          <primitive object={scene} />
      </mesh>
  );
}
const Venus = () => {
    const { scene } = useGLTF('/venuscomp.glb');
    const venusRef = useRef()
    useFrame(() => {
      if (venusRef.current) {
          venusRef.current.rotation.y += 0.0025; // Adjust the speed of rotation as needed
      }
  });
    scene.scale.set(0.2, 0.2, 0.2)
    scene.position.set(10, 0, 0)
    return (
        <mesh ref={venusRef}>
        <primitive object={scene} />
        </mesh>
    );
}

// 0036, 0025 0001

const Earth = () => {
  const { scene } = useGLTF('/comp.glb');
  const earthRef = useRef()
  useFrame(() => {
    if (earthRef.current) {
        earthRef.current.rotation.y += 0.001; // Adjust the speed of rotation as needed
    }
});

  scene.scale.set(0.002, 0.002, 0.002)
  scene.position.set(14, 0, 0)
  return (
      <mesh ref={earthRef}>
      <primitive object={scene} />
      </mesh>
  );
}

const Space = () => {
  return (
    <Canvas
      className={`w-full h-full bg-transparent absolute`}
      style={{}}
      camera={{ fov: 20, position: [0, 0, 50], near: 0.1, far: 1000 }}
    >
      <Suspense fallback={<Loader />}>
        <ambientLight intensity={1} />
        <Stars radius={350} depth={30} count={200000} factor={7} saturation={1} fade={true}/>
        <Sun />
        <Mercury />
        <Venus />
        <Earth />
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          zoomSpeed={0.6}
          panSpeed={0.5}
          rotateSpeed={0.4}
        /> 
        <directionalLight position={[1, 1, 2]} intensity={2} />
      </Suspense>
    </Canvas>
  )
}

export default Space
