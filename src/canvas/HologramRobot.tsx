import { useRef, useLayoutEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture, Float } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const LumaKeyShader = {
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float threshold;
    uniform float smoothing;
    varying vec2 vUv;

    void main() {
      vec4 texel = texture2D(tDiffuse, vUv);
      // Calculate brightness (luminance) of the pixel
      float luma = dot(texel.rgb, vec3(0.299, 0.587, 0.114));
      
      // Smoothly remove dark background pixels
      float alpha = smoothstep(threshold, threshold + smoothing, luma);
      
      gl_FragColor = vec4(texel.rgb, alpha);
    }
  `
};

export const HologramRobot = () => {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  
  const texture = useTexture('/robot.png');

  // We memoize the uniforms so they don't recreate every frame
  const uniforms = useMemo(() => ({
    tDiffuse: { value: texture },
    threshold: { value: 0.15 }, // Adjust this to clip more/less dark background
    smoothing: { value: 0.15 }  // Adjust for softer edges
  }), [texture]);

  useLayoutEffect(() => {
    if (!groupRef.current) return;
    
    gsap.to(groupRef.current.position, {
      x: -8,
      y: -2,
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
      }
    });
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.quaternion.copy(state.camera.quaternion);
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.5} floatingRange={[-0.5, 0.5]}>
        <mesh ref={meshRef} position={[0, 0, 0]}>
          <planeGeometry args={[4, 4]} />
          <shaderMaterial 
            uniforms={uniforms}
            vertexShader={LumaKeyShader.vertexShader}
            fragmentShader={LumaKeyShader.fragmentShader}
            transparent={true}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      </Float>
    </group>
  );
};

useTexture.preload('/robot.png');
