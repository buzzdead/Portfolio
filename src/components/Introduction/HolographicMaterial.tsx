import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Color } from "three";

const HolographicMaterial = () => {
  const ref = useRef<THREE.ShaderMaterial>(null!);

  const uniforms = useRef({
    time: { value: 0 },
    color: { value: new Color("#6a246e") },
    pulseSpeed: { value: 0.5 },
    noiseScale: { value: 10.0 }
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
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          vUv = uv;
          vNormal = normal;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `}
      fragmentShader={`
        uniform float time;
        uniform vec3 color;
        uniform float pulseSpeed;
        uniform float noiseScale;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;

        float rand(vec2 n) { 
          return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 45558.5453);
        }
        
        void main() {
          // Create pulsing effect
          float pulse = sin(time * pulseSpeed) * 0.75 + 0.75;
          
          // Create moving waves
          float waves = sin(vPosition.x * noiseScale + time) * 
                       sin(vPosition.y * noiseScale + time) * 
                       sin(vPosition.z * noiseScale + time);
          
          // Edge glow effect
          float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 1.0);
          
          // Combine effects
          float pattern = waves * 0.25 + 0.25;
          pattern = pattern * pulse;
          
          // Final color
          vec3 glowColor = color + fresnel * 0.5;
          float alpha = (pattern * 0.6 + fresnel * 1.4) * 0.7;
          
          // Add some sparkle
          float sparkle = rand(vUv + time * 0.5) * fresnel;
          glowColor += sparkle * 0.35;
          
          gl_FragColor = vec4(glowColor, alpha);
        }
      `}
      transparent
    />
  );
};

export default HolographicMaterial;