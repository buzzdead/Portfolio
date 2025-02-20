import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Color } from "three";

const HolographicMaterial = () => {
  const ref = useRef<THREE.ShaderMaterial>(null!);

  // Define uniforms outside JSX
  const uniforms = useRef({
    time: { value: 0 },
    color: { value: new Color("cyan") }
  }).current;

  useFrame(({ clock }) => {
    if (ref.current) {
      uniforms.time.value = clock.getElapsedTime();
    }
  });

  return (
    <shaderMaterial
      ref={ref}
      uniforms={uniforms}
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
          float alpha = sin(vUv.x * 5.0 + time * 1.5) * 0.5 + 0.5;
          gl_FragColor = vec4(color, alpha * 0.35);
        }
      `}
      transparent
    />
  );
};

export default HolographicMaterial;
