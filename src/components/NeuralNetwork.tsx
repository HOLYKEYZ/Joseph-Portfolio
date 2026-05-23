'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function NeuralNetwork() {
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.z = 22;

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);

    // --- Neural Network Particles ---
    const particleCount = 96;
    const positions = new Float32Array(particleCount * 3);
    const basePositions: THREE.Vector3[] = [];

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 5 + Math.random() * 3.5;
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      basePositions.push(new THREE.Vector3(x, y, z));
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xfbbf24,
      size: 0.2,
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // --- Connection Lines ---
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x3a3525,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const connectionPairs: [number, number][] = [];
    for (let i = 0; i < particleCount; i++) {
      let connections = 0;
      for (let j = i + 1; j < particleCount; j++) {
        const dx = positions[i * 3] - positions[j * 3];
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < 5.2 && connections < 2) {
          connectionPairs.push([i, j]);
          connections++;
        }
      }
    }

    const linePositions = new Float32Array(connectionPairs.length * 6);
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const lineSegments = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lineSegments);

    // --- Ambient Glow Core ---
    const glowGeo = new THREE.SphereGeometry(7, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0xfbbf24,
      transparent: true,
      opacity: 0.015,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const glowSphere = new THREE.Mesh(glowGeo, glowMat);
    scene.add(glowSphere);

    // Animation
    let time = 0;
    function animate() {
      frameRef.current = requestAnimationFrame(animate);
      time += 0.012;

      // Animate particles
      const arr = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const base = basePositions[i];
        arr[i * 3] = base.x + Math.sin(time * 0.5 + i * 1.3) * 0.3;
        arr[i * 3 + 1] = base.y + Math.cos(time * 0.4 + i * 0.9) * 0.3;
        arr[i * 3 + 2] = base.z + Math.sin(time * 0.3 + i * 0.5) * 0.3;
      }
      particleGeo.attributes.position.needsUpdate = true;

      for (let i = 0; i < connectionPairs.length; i++) {
        const [a, b] = connectionPairs[i];
        linePositions[i * 6] = arr[a * 3];
        linePositions[i * 6 + 1] = arr[a * 3 + 1];
        linePositions[i * 6 + 2] = arr[a * 3 + 2];
        linePositions[i * 6 + 3] = arr[b * 3];
        linePositions[i * 6 + 4] = arr[b * 3 + 1];
        linePositions[i * 6 + 5] = arr[b * 3 + 2];
      }
      lineGeo.attributes.position.needsUpdate = true;

      particles.rotation.y = time * 0.15;
      particles.rotation.x = Math.sin(time * 0.12) * 0.12;
      lineSegments.rotation.copy(particles.rotation);
      glowSphere.rotation.y = time * 0.08;
      glowSphere.rotation.x = Math.sin(time * 0.1) * 0.1;

      renderer.render(scene, camera);
    }

    animate();

    function onResize() {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(frameRef.current);

      scene.remove(lineSegments);
      scene.remove(particles);
      scene.remove(glowSphere);
      particleGeo.dispose();
      lineGeo.dispose();
      particleMat.dispose();
      lineMat.dispose();
      glowGeo.dispose();
      glowMat.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-[340px] md:h-[480px]"
      style={{ pointerEvents: 'none' }}
    />
  );
}
