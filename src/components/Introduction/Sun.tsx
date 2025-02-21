import { useFrame } from '@react-three/fiber'
import { useCursor } from '@react-three/drei'
import { useRef, useState } from 'react'
import * as THREE from 'three'

interface PP {
  hasSun: boolean
  setHasSun: () => void
}

interface SunShaderProps extends PP {
  sunRef: React.RefObject<THREE.Mesh>
  baseColor?: string // Add color prop
  glowColor?: string // Add glow color prop
}

const Sun = ({
  sunRef,
  hasSun,
  setHasSun,
  baseColor = '#301934',
  glowColor = '#301934'
}: SunShaderProps) => {
  const shaderRef = useRef<THREE.ShaderMaterial>(null)
  const hovering = useRef(false) // Add hover state

  useCursor(hovering.current) // Optional: Changes cursor on hover

  const baseColorVec = new THREE.Color(baseColor)
  const glowColorVec = new THREE.Color(glowColor)

  const uniforms = useRef({
    uTime: { value: 0 },
    uBaseColor: {
      value: new THREE.Vector3(baseColorVec.r, baseColorVec.g, baseColorVec.b)
    },
    uGlowColor: {
      value: new THREE.Vector3(glowColorVec.r, glowColorVec.g, glowColorVec.b)
    },
    uFlareIntensity: { value: 0.0 } // New uniform for flare control
  }).current

  const vertexShader = `
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    
    void main() {
      vUv = uv;
      vPosition = position;
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `

  const fragmentShader = `
    uniform float uTime;
    uniform vec3 uBaseColor;
    uniform vec3 uGlowColor;
    uniform float uFlareIntensity; // New uniform for flare effect
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;

    // Simplex noise functions (unchanged, keeping it concise here)
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

    float snoise(vec3 v) {
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      i = mod289(i);
      vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
      float n_ = 0.142857142857;
      vec3 ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }

    void main() {
      float scale1 = 5.5;
      float scale2 = 7.0;
      float scale3 = 7.5;
      float timeScale1 = uTime * 0.5;
      float timeScale2 = uTime * 0.25;
      float timeScale3 = uTime * 0.1;

      float n1 = snoise(vec3(vPosition.xy * scale1 + timeScale1, timeScale1));
      float n2 = snoise(vec3(vPosition.yz * scale2 + timeScale2, timeScale2));
      float n3 = snoise(vec3(vPosition.xz * scale3 + timeScale3, timeScale3));
      float combinedNoise = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;

      vec3 hotColor = uBaseColor * 1.4;
      vec3 coolColor = uBaseColor * 0.6;
      vec3 plasmaColor = mix(coolColor, hotColor, combinedNoise);

      float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
      fresnel = smoothstep(0.0, 1.0, fresnel);

      float coreGlow = 1.0 - length(vUv - 0.5) * 1.8;
      coreGlow = max(0.0, coreGlow);
      coreGlow = pow(coreGlow, 1.5);

      float flareNoise = snoise(vec3(vPosition.x * 15.0 + uTime * 3.0, vPosition.y * 3.0, uTime));
      float flare = max(0.0, flareNoise) * uFlareIntensity * fresnel * 1.5; // Amplify for visibility
      vec3 flareColor = uGlowColor * (2.0 + flare * 4.0); // Brighter flare

      vec3 finalColor = plasmaColor;
      finalColor += uGlowColor * fresnel * 0.4;
      finalColor += uGlowColor * coreGlow * 0.6;
      finalColor += flareColor * flare; // Add flare to final color

      float pulse = sin(uTime * 0.5) * 0.1 + 1.9;
      finalColor *= pulse;

      float alpha = smoothstep(0.0, 0.2, coreGlow + fresnel * 0.3 + flare * 1.5); // Increase alpha with flare

      gl_FragColor = vec4(finalColor, alpha);
    }
  `

  useFrame(({ clock }) => {
    if (sunRef.current && shaderRef.current) {
      // Ensure both refs are valid
      if (!hasSun) setHasSun()
      const t = clock.getElapsedTime() / 2
      sunRef.current.position.x = Math.sin(t) * -6 + Math.sin(t * 2) * 0.5 // Add wobble
      sunRef.current.position.y = Math.cos(t) * -6 + Math.cos(t * 1.5) * 0.3

      uniforms.uTime.value = clock.getElapsedTime()
      uniforms.uFlareIntensity.value = THREE.MathUtils.lerp(
        shaderRef.current.uniforms.uFlareIntensity.value,
        hovering.current ? 1.0 : 0.0,
        0.1
      )
    }
  })

  return (
    <mesh
      ref={sunRef}
      position={[0, 0, -15]}
      onPointerOver={() => (hovering.current = true)} // Detect hover start
      onPointerOut={() => (hovering.current = false)} // Detect hover end
    >
      <sphereGeometry args={[1, 128, 128]} />
      <shaderMaterial
        ref={shaderRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
        toneMapped={false}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  )
}

export default Sun
