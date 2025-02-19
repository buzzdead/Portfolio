import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
import { Color } from 'three'

const HolographicMaterial = () => {
    const ref = useRef<THREE.ShaderMaterial>(null!)
    useFrame(({ clock }) => {
      ref.current.uniforms.time.value = clock.getElapsedTime()
    })
    
    return (
      <shaderMaterial
        ref={ref}
        uniforms={{
          time: { value: 0 },
          color: { value: new Color('cyan') }
        }}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float time;
          uniform vec3 color;
          varying vec2 vUv;
          void main() {
            float alpha = sin(vUv.x * 10.0 + time * 2.0) * 0.5 + 0.5;
            gl_FragColor = vec4(color, alpha * 0.5);
          }
        `}
        transparent
      />
    )
  }

  export default HolographicMaterial