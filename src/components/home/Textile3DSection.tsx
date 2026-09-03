"use client";

import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Environment, Float, OrbitControls } from "@react-three/drei";
import { motion, useScroll, useTransform } from "framer-motion";
import * as THREE from "three";

function FloatingTextile() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
      meshRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} scale={[1.5, 1.5, 1.5]}>
        {/* A large plane with many segments to bend like cloth */}
        <planeGeometry args={[5, 3, 64, 64]} />
        <MeshDistortMaterial
          color="#5E1914" // Deep maroon
          envMapIntensity={1}
          clearcoat={0.8}
          clearcoatRoughness={0.2}
          metalness={0.4}
          roughness={0.6}
          distort={0.4} // Intensity of the wave/distortion
          speed={2} // Speed of the wave
          side={THREE.DoubleSide}
        />
      </mesh>
    </Float>
  );
}

export default function Textile3DSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const yText = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);
  
  return (
    <section 
      ref={containerRef}
      className="relative h-screen bg-cream overflow-hidden flex items-center"
    >
      {/* 3D Canvas Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} color="#C5A059" />
          <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#ffffff" />
          <Suspense fallback={null}>
            <FloatingTextile />
            <Environment preset="city" />
          </Suspense>
        </Canvas>
      </div>

      {/* Floating Labels / Overlay UI */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="absolute top-1/4 left-10 md:left-24 font-sans text-xs tracking-[0.2em] text-maroon/80 border-b border-maroon/20 pb-1">
          PURE COTTON
        </div>
        <div className="absolute top-1/3 right-10 md:right-24 font-sans text-xs tracking-[0.2em] text-maroon/80 border-b border-maroon/20 pb-1">
          HANDWOVEN
        </div>
        <div className="absolute bottom-1/3 left-10 md:left-32 font-sans text-xs tracking-[0.2em] text-maroon/80 border-b border-maroon/20 pb-1">
          MANGALAGIRI
        </div>
        <div className="absolute bottom-1/4 right-10 md:right-32 font-sans text-xs tracking-[0.2em] text-maroon/80 border-b border-maroon/20 pb-1">
          CRAFTED BY WEAVERS
        </div>
      </div>

      {/* Main Text Content */}
      <motion.div 
        style={{ y: yText }}
        className="relative z-20 w-full text-center pointer-events-none"
      >
        <h2 className="font-serif text-5xl md:text-7xl lg:text-8xl text-cream font-bold tracking-tight drop-shadow-2xl mix-blend-difference">
          Feel the Weave.
        </h2>
      </motion.div>
    </section>
  );
}
