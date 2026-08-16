import { useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HologramRobot } from './HologramRobot';

gsap.registerPlugin(ScrollTrigger);

const CameraController = () => {
  const { camera } = useThree();
  
  useEffect(() => {
    // Scroll animation for camera
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
      }
    });

    // We can add camera animations here later as sections are added
    // For now, let's just make it slightly move down and rotate
    tl.to(camera.position, { y: -5, z: 10, ease: 'none' }, 0);
    tl.to(camera.rotation, { x: 0.2, ease: 'none' }, 0);

    return () => {
      tl.kill();
    };
  }, [camera]);

  // Mouse Parallax effect
  useFrame((state) => {
    // Mild parallax
    const targetX = (state.pointer.x * 0.5);
    const targetY = (state.pointer.y * 0.5);
    
    camera.position.x += (targetX - camera.position.x) * 0.05;
    // Don't fully overwrite y and z as they are controlled by GSAP,
    // just add a small offset or manage a separate group.
    // For simplicity, we just slightly adjust x and y.
    camera.position.y += (targetY - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);
  });

  return null;
};

const SceneContent = () => {
  return (
    <>
      <CameraController />
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#a855f7" />
      
      {/* Background Stars */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      {/* Holographic AI Tutor Robot on the right */}
      <group position={[4, 0, -2]} scale={[1.5, 1.5, 1.5]}>
        <HologramRobot />
      </group>

      <EffectComposer>
        <Bloom luminanceThreshold={0.2} mipmapBlur intensity={1.5} />
      </EffectComposer>
    </>
  );
};

export const GlobalScene = () => {
  return (
    <div className="fixed inset-0 w-full h-full -z-10 bg-[#050505]">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
      >
        <SceneContent />
      </Canvas>
    </div>
  );
};
