'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function NeuralNetwork() {
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetMouseRef = useRef({ x: 0, y: 0 });

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
      antialias: true,
      alpha: true,
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);

    // --- Neural Network Particles ---
    const particleCount = 150;
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

    const lineGeometries: THREE.BufferGeometry[] = [];
    const lines: THREE.Line[] = [];

    function updateConnections() {
      lines.forEach((l) => scene.remove(l));
      lineGeometries.forEach((g) => g.dispose());
      lines.length = 0;
      lineGeometries.length = 0;

      const arr = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        let connections = 0;
        for (let j = i + 1; j < particleCount; j++) {
          const dx = arr[i * 3] - arr[j * 3];
          const dy = arr[i * 3 + 1] - arr[j * 3 + 1];
          const dz = arr[i * 3 + 2] - arr[j * 3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (dist < 5.2 && connections < 2) {
            const geo = new THREE.BufferGeometry().setFromPoints([
              new THREE.Vector3(arr[i * 3], arr[i * 3 + 1], arr[i * 3 + 2]),
              new THREE.Vector3(arr[j * 3], arr[j * 3 + 1], arr[j * 3 + 2]),
            ]);
            const line = new THREE.Line(geo, lineMat);
            scene.add(line);
            lineGeometries.push(geo);
            lines.push(line);
            connections++;
          }
        }
      }
    }

    updateConnections();

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

      // Update connections every 4 frames
      if (Math.floor(time * 100) % 4 === 0) {
        updateConnections();
      }

      // Rotate whole system slowly
      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.04;
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.04;

      particles.rotation.y = time * 0.15 + mouseRef.current.x * 0.4;
      particles.rotation.x = mouseRef.current.y * 0.25;
      glowSphere.rotation.y = time * 0.08;
      glowSphere.rotation.x = Math.sin(time * 0.1) * 0.1;

      renderer.render(scene, camera);
    }

    animate();

    // Mouse tracking
    function onMouseMove(e: MouseEvent) {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      targetMouseRef.current.x = ((e.clientX - cx) / (rect.width / 2));
      targetMouseRef.current.y = ((e.clientY - cy) / (rect.height / 2));
    }

    window.addEventListener('mousemove', onMouseMove);

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
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(frameRef.current);

      lines.forEach((l) => scene.remove(l));
      lineGeometries.forEach((g) => g.dispose());
      scene.remove(particles);
      scene.remove(glowSphere);
      particleGeo.dispose();
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
      style={{ cursor: 'crosshair' }}
    />
  );
}
