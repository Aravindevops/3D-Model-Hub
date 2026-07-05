"use client";

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, useGLTF } from '@react-three/drei';

interface ModelProps {
  url: string;
}

function Model({ url }: ModelProps) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

export default function ModelViewer({ url }: { url: string }) {
  if (!url) {
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
        <p style={{ color: 'var(--text-tertiary)' }}>No model selected</p>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden', backgroundColor: 'var(--bg-secondary)' }}>
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 150], fov: 50 }}>
        <Suspense fallback={null}>
          <Stage preset="rembrandt" intensity={1} environment="city">
            <Model url={url} />
          </Stage>
        </Suspense>
        <OrbitControls autoRotate autoRotateSpeed={1} makeDefault />
      </Canvas>

      {/* Overlay loading state could be added here */}
      <div style={{ position: 'absolute', bottom: '10px', right: '10px', fontSize: '0.75rem', color: 'var(--text-tertiary)', pointerEvents: 'none' }}>
        Interactive 3D Viewer
      </div>
    </div>
  );
}

// Preload is typically used for specific known assets, 
// but since URLs are dynamic, we handle loading via Suspense.
