import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Icosahedron, MeshDistortMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

export const KnowledgePlanet = () => {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  // Rotate elements continuously
  useFrame((_state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
    }
    if (coreRef.current) {
      coreRef.current.rotation.x -= delta * 0.05;
      coreRef.current.rotation.z += delta * 0.05;
    }
    if (wireframeRef.current) {
      wireframeRef.current.rotation.x += delta * 0.1;
      wireframeRef.current.rotation.y -= delta * 0.1;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1} floatingRange={[-0.2, 0.2]}>
      <group ref={groupRef}>
        {/* Core glowing sphere */}
        <Sphere ref={coreRef} args={[1.8, 64, 64]}>
          <MeshDistortMaterial
            color="#4f46e5"
            emissive="#3730a3"
            emissiveIntensity={1}
            distort={0.3}
            speed={2}
            roughness={0.2}
            metalness={0.8}
          />
        </Sphere>

        {/* Outer wireframe shell (neural network representation) */}
        <Icosahedron ref={wireframeRef} args={[2.2, 2]}>
          <meshBasicMaterial color="#a855f7" wireframe transparent opacity={0.3} />
        </Icosahedron>

        {/* Floating energy ring */}
        <mesh ref={ringRef} rotation={[Math.PI / 2.5, 0, 0]}>
          <torusGeometry args={[3, 0.02, 16, 100]} />
          <meshStandardMaterial color="#c084fc" emissive="#c084fc" emissiveIntensity={2} />
        </mesh>
        
        <mesh rotation={[Math.PI / 2.5, 0, 0]} scale={[1.2, 1.2, 1.2]}>
          <torusGeometry args={[3, 0.01, 16, 100]} />
          <meshStandardMaterial color="#818cf8" emissive="#818cf8" emissiveIntensity={1} transparent opacity={0.5} />
        </mesh>

        {/* Internal Light source to make it glow from within */}
        <pointLight color="#818cf8" intensity={5} distance={10} />
      </group>
    </Float>
  );
};
