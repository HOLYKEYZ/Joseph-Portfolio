'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function NeuralNetwork() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const frameRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetMouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.z = 18;
    cameraRef.current = camera;

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
    rendererRef.current = renderer;

    // Particle system
    const particleCount = 80;
    const positions = new Float32Array(particleCount * 3);
    const velocities: THREE.Vector3[] = [];

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 4 + Math.random() * 3;

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      velocities.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 0.003,
          (Math.random() - 0.5) * 0.003,
          (Math.random() - 0.5) * 0.003
        )
      );
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xfbbf24,
      size: 0.12,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Connection lines
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x2f2f35,
      transparent: true,
      opacity: 0.35,
    });

    const maxConnections = 3;
    const connectionDistance = 4.5;
    const lineGeometries: THREE.BufferGeometry[] = [];
    const lines: THREE.Line[] = [];

    function updateConnections() {
      // Remove old lines
      lines.forEach((line) => scene.remove(line));
      lineGeometries.forEach((g) => g.dispose());
      lines.length = 0;
      lineGeometries.length = 0;

      const posArray = geometry.attributes.position.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        let connections = 0;
        for (let j = i + 1; j < particleCount; j++) {
          const dx = posArray[i * 3] - posArray[j * 3];
          const dy = posArray[i * 3 + 1] - posArray[j * 3 + 1];
          const dz = posArray[i * 3 + 2] - posArray[j * 3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < connectionDistance && connections < maxConnections) {
            const lineGeo = new THREE.BufferGeometry().setFromPoints([
              new THREE.Vector3(posArray[i * 3], posArray[i * 3 + 1], posArray[i * 3 + 2]),
              new THREE.Vector3(posArray[j * 3], posArray[j * 3 + 1], posArray[j * 3 + 2]),
            ]);
            const line = new THREE.Line(lineGeo, lineMaterial);
            scene.add(line);
            lineGeometries.push(lineGeo);
            lines.push(line);
            connections++;
          }
        }
      }
    }

    updateConnections();

    // Ambient glow sphere
    const glowGeo = new THREE.SphereGeometry(6, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0xfbbf24,
      transparent: true,
      opacity: 0.02,
      side: THREE.BackSide,
    });
    const glowSphere = new THREE.Mesh(glowGeo, glowMat);
    scene.add(glowSphere);

    // Animation loop
    let time = 0;
    function animate() {
      frameRef.current = requestAnimationFrame(animate);
      time += 0.005;

      const posArray = geometry.attributes.position.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        posArray[i * 3] += velocities[i].x + Math.sin(time + i) * 0.002;
        posArray[i * 3 + 1] += velocities[i].y + Math.cos(time + i * 0.7) * 0.002;
        posArray[i * 3 + 2] += velocities[i].z + Math.sin(time + i * 0.3) * 0.002;

        // Soft boundary constraint
        const dist = Math.sqrt(
          posArray[i * 3] ** 2 +
          posArray[i * 3 + 1] ** 2 +
          posArray[i * 3 + 2] ** 2
        );
        if (dist > 8) {
          posArray[i * 3] *= 0.99;
          posArray[i * 3 + 1] *= 0.99;
          posArray[i * 3 + 2] *= 0.99;
        }
      }

      geometry.attributes.position.needsUpdate = true;

      // Update connections every few frames for performance
      if (Math.floor(time * 200) % 5 === 0) {
        updateConnections();
      }

      // Mouse parallax
      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.05;

      points.rotation.y = time * 0.3 + mouseRef.current.x * 0.5;
      points.rotation.x = mouseRef.current.y * 0.3;
      glowSphere.rotation.y = time * 0.1;

      renderer.render(scene, camera);
    }

    animate();

    // Mouse move handler
    function onMouseMove(e: MouseEvent) {
      targetMouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    }

    window.addEventListener('mousemove', onMouseMove);

    // Resize handler
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

      lines.forEach((line) => scene.remove(line));
      lineGeometries.forEach((g) => g.dispose());
      scene.remove(points);
      scene.remove(glowSphere);
      geometry.dispose();
      material.dispose();
      lineMaterial.dispose();
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
      className="w-full h-[320px] md:h-[400px] rounded-xl border border-border-subtle bg-card/50"
      style={{ cursor: 'grab' }}
    />
  );
}
