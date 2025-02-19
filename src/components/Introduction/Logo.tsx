import { useGLTF } from '@react-three/drei'

const LogoModel = () => {
  const { scene } = useGLTF('/logo.glb')
  return <primitive object={scene} />
}