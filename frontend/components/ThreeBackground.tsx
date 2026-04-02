'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function ThreeBackground() {
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, host.clientWidth / host.clientHeight, 0.1, 1000);
    camera.position.z = 32;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    host.appendChild(renderer.domElement);

    const count = 1800;
    const positions = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) {
      positions[index * 3] = (Math.random() - 0.5) * 100;
      positions[index * 3 + 1] = (Math.random() - 0.5) * 60;
      positions[index * 3 + 2] = (Math.random() - 0.5) * 40;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({ color: 0x7dd3fc, size: 0.055, transparent: true, opacity: 0.52 });
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const gridGeometry = new THREE.PlaneGeometry(120, 72, 24, 14);
    const gridMaterial = new THREE.MeshBasicMaterial({ color: 0x0f172a, wireframe: true, transparent: true, opacity: 0.18 });
    const grid = new THREE.Mesh(gridGeometry, gridMaterial);
    grid.position.z = -12;
    grid.rotation.x = -0.4;
    scene.add(grid);

    const glowGeometry = new THREE.SphereGeometry(4.8, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({ color: 0x4fd1c5, transparent: true, opacity: 0.08 });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.position.set(-10, 5, -4);
    scene.add(glow);

    let frame = 0;
    const animate = () => {
      frame += 0.0025;
      points.rotation.y = frame * 0.22;
      points.rotation.x = Math.sin(frame * 0.5) * 0.05;
      grid.rotation.z = Math.sin(frame * 0.2) * 0.03;
      glow.position.x = -10 + Math.sin(frame * 0.8) * 1.8;
      glow.position.y = 5 + Math.cos(frame * 0.6) * 1.2;
      renderer.render(scene, camera);
      requestId = globalThis.requestAnimationFrame(animate);
    };

    let requestId = globalThis.requestAnimationFrame(animate);

    const handleResize = () => {
      camera.aspect = host.clientWidth / host.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(host.clientWidth, host.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      globalThis.cancelAnimationFrame(requestId);
      geometry.dispose();
      material.dispose();
      gridGeometry.dispose();
      gridMaterial.dispose();
      glowGeometry.dispose();
      glowMaterial.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={hostRef} className="absolute inset-0 -z-10 opacity-80" />;
}
