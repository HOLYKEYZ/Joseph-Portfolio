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
    const particleCount = 100;
    const positions = new Float32Array(particleCount * 3);
    const basePositions: THREE.Vector3[] = [];

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 3.5 + Math.random() * 3;
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
      size: 0.14,
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
          if (dist < 3.8 && connections < 2) {
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
    const glowGeo = new THREE.SphereGeometry(5, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0xfbbf24,
      transparent: true,
      opacity: 0.018,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const glowSphere = new THREE.Mesh(glowGeo, glowMat);
    scene.add(glowSphere);

    // --- Cute Bot Character ---
    const botGroup = new THREE.Group();

    // Head
    const headGeo = new THREE.SphereGeometry(0.55, 32, 32);
    const headMat = new THREE.MeshBasicMaterial({ color: 0xe8e8e8 });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 0.35;
    botGroup.add(head);

    // Antenna
    const antStemGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.4, 8);
    const antMat = new THREE.MeshBasicMaterial({ color: 0xc0c0c0 });
    const antStem = new THREE.Mesh(antStemGeo, antMat);
    antStem.position.y = 0.95;
    botGroup.add(antStem);

    const antBallGeo = new THREE.SphereGeometry(0.1, 16, 16);
    const antBallMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });
    const antBall = new THREE.Mesh(antBallGeo, antBallMat);
    antBall.position.y = 1.2;
    botGroup.add(antBall);

    // Eyes
    const eyeGeo = new THREE.SphereGeometry(0.1, 16, 16);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x1a1a1a });
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.18, 0.45, 0.42);
    botGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.18, 0.45, 0.42);
    botGroup.add(rightEye);

    // Eye glow
    const glowEyeGeo = new THREE.SphereGeometry(0.05, 8, 8);
    const glowEyeMat = new THREE.MeshBasicMaterial({
      color: 0xfbbf24,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const leftGlow = new THREE.Mesh(glowEyeGeo, glowEyeMat);
    leftGlow.position.set(-0.18, 0.45, 0.48);
    botGroup.add(leftGlow);

    const rightGlow = new THREE.Mesh(glowEyeGeo, glowEyeMat);
    rightGlow.position.set(0.18, 0.45, 0.48);
    botGroup.add(rightGlow);

    // Body
    const bodyGeo = new THREE.CylinderGeometry(0.35, 0.45, 0.5, 16);
    const bodyMat = new THREE.MeshBasicMaterial({ color: 0xd4d4d4 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = -0.25;
    botGroup.add(body);

    // Chest panel
    const panelGeo = new THREE.BoxGeometry(0.3, 0.15, 0.05);
    const panelMat = new THREE.MeshBasicMaterial({ color: 0x2a2a2a });
    const panel = new THREE.Mesh(panelGeo, panelMat);
    panel.position.set(0, -0.2, 0.4);
    botGroup.add(panel);

    const ledGeo = new THREE.SphereGeometry(0.04, 8, 8);
    const ledMat = new THREE.MeshBasicMaterial({
      color: 0xfbbf24,
      blending: THREE.AdditiveBlending,
    });
    const led = new THREE.Mesh(ledGeo, ledMat);
    led.position.set(0, -0.2, 0.44);
    botGroup.add(led);

    // Arms
    const armGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.35, 8);
    const armMat = new THREE.MeshBasicMaterial({ color: 0xc0c0c0 });

    const leftArm = new THREE.Mesh(armGeo, armMat);
    leftArm.position.set(-0.55, -0.15, 0);
    leftArm.rotation.z = 0.4;
    botGroup.add(leftArm);

    const rightArm = new THREE.Mesh(armGeo, armMat);
    rightArm.position.set(0.55, -0.15, 0);
    rightArm.rotation.z = -0.4;
    botGroup.add(rightArm);

    // Hands
    const handGeo = new THREE.SphereGeometry(0.1, 8, 8);
    const handMat = new THREE.MeshBasicMaterial({ color: 0xe8e8e8 });

    const leftHand = new THREE.Mesh(handGeo, handMat);
    leftHand.position.set(-0.7, -0.3, 0);
    botGroup.add(leftHand);

    const rightHand = new THREE.Mesh(handGeo, handMat);
    rightHand.position.set(0.7, -0.3, 0);
    botGroup.add(rightHand);

    // Legs
    const legGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.3, 8);
    const legMat = new THREE.MeshBasicMaterial({ color: 0xc0c0c0 });

    const leftLeg = new THREE.Mesh(legGeo, legMat);
    leftLeg.position.set(-0.2, -0.65, 0);
    botGroup.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, legMat);
    rightLeg.position.set(0.2, -0.65, 0);
    botGroup.add(rightLeg);

    // Feet
    const footGeo = new THREE.SphereGeometry(0.12, 8, 8);
    const footMat = new THREE.MeshBasicMaterial({ color: 0xe8e8e8 });

    const leftFoot = new THREE.Mesh(footGeo, footMat);
    leftFoot.position.set(-0.2, -0.82, 0.05);
    botGroup.add(leftFoot);

    const rightFoot = new THREE.Mesh(footGeo, footMat);
    rightFoot.position.set(0.2, -0.82, 0.05);
    botGroup.add(rightFoot);

    // Bot hover glow
    const botGlowGeo = new THREE.SphereGeometry(1.2, 16, 16);
    const botGlowMat = new THREE.MeshBasicMaterial({
      color: 0xfbbf24,
      transparent: true,
      opacity: 0.06,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const botGlow = new THREE.Mesh(botGlowGeo, botGlowMat);
    botGroup.add(botGlow);

    scene.add(botGroup);

    // Bot state
    const botTarget = new THREE.Vector3(0, 0, 0);
    const botPos = new THREE.Vector3(0, 0, 0);
    const botVelocity = new THREE.Vector3(0, 0, 0);
    const botRadius = 5.5;

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

      // --- Bot cursor follow (constrained to sphere) ---
      // Map mouse to a 3D target inside the sphere
      const mx = targetMouseRef.current.x * 4.5;
      const my = -targetMouseRef.current.y * 4.5;
      const mz = Math.sin(time * 0.5) * 1.5;

      botTarget.set(mx, my, mz);
      const distToCenter = botTarget.length();
      if (distToCenter > botRadius) {
        botTarget.normalize().multiplyScalar(botRadius);
      }

      // Smooth follow with spring-like damping
      const delta = new THREE.Vector3().subVectors(botTarget, botPos);
      botVelocity.add(delta.multiplyScalar(0.015));
      botVelocity.multiplyScalar(0.92);
      botPos.add(botVelocity);

      // Re-constrain after movement
      if (botPos.length() > botRadius) {
        botPos.normalize().multiplyScalar(botRadius);
      }

      botGroup.position.copy(botPos);
      botGroup.rotation.y = Math.atan2(botVelocity.x, botVelocity.z) * 0.3;
      botGroup.rotation.z = Math.sin(time * 2) * 0.05;

      // Hover bob
      botGroup.position.y += Math.sin(time * 3) * 0.08;

      // Antenna pulse
      antBall.scale.setScalar(1 + Math.sin(time * 5) * 0.2);
      led.scale.setScalar(1 + Math.sin(time * 4) * 0.3);

      // Bot glow pulse
      botGlowMat.opacity = 0.04 + Math.sin(time * 2) * 0.02;

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
      scene.remove(botGroup);
      particleGeo.dispose();
      particleMat.dispose();
      lineMat.dispose();
      glowGeo.dispose();
      glowMat.dispose();
      headGeo.dispose(); headMat.dispose();
      antStemGeo.dispose(); antMat.dispose();
      antBallGeo.dispose(); antBallMat.dispose();
      eyeGeo.dispose(); eyeMat.dispose();
      glowEyeGeo.dispose(); glowEyeMat.dispose();
      bodyGeo.dispose(); bodyMat.dispose();
      panelGeo.dispose(); panelMat.dispose();
      ledGeo.dispose(); ledMat.dispose();
      armGeo.dispose(); armMat.dispose();
      handGeo.dispose(); handMat.dispose();
      legGeo.dispose(); legMat.dispose();
      footGeo.dispose(); footMat.dispose();
      botGlowGeo.dispose(); botGlowMat.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-[320px] md:h-[420px]"
      style={{ cursor: 'crosshair' }}
    />
  );
}
