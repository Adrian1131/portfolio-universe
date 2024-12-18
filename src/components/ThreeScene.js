import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const ThreeScene = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return; // Prevent null errors during render

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Background Stars
    const textureLoader = new THREE.TextureLoader();
    const starsTexture = textureLoader.load('./images/stars.jpg', () => {
      scene.background = starsTexture;
    }, undefined, () => console.error('Failed to load stars.jpg'));

    // Lighting
    const addLighting = () => {
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
      scene.add(ambientLight);

      const pointLight = new THREE.PointLight(0xffffff, 2, 100);
      pointLight.position.set(10, 10, 10);
      scene.add(pointLight);
    };

    // Create Planet
    const createPlanet = (texturePath, position, size = 1) => {
      const geometry = new THREE.SphereGeometry(size, 64, 64);
      const material = new THREE.MeshStandardMaterial({
        map: textureLoader.load(texturePath, undefined, undefined, () => console.error(`Failed to load ${texturePath}`)),
      });
      const planet = new THREE.Mesh(geometry, material);
      planet.position.set(...position);
      scene.add(planet);
      return planet;
    };

    // Planet with Rings
    const createPlanetWithRings = (planetTexture, ringTexture, position) => {
      const planet = createPlanet(planetTexture, position);
      const ringGeometry = new THREE.RingGeometry(1.5, 2.5, 64);
      const ringMaterial = new THREE.MeshBasicMaterial({
        map: textureLoader.load(ringTexture),
        side: THREE.DoubleSide,
        transparent: true,
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = Math.PI / 2;
      planet.add(ring);
      return planet;
    };

    // Load Planets
    const loadPlanets = () => {
      return {
        mercury: createPlanet('./images/mercury_texture.jpg', [3, 0, 0]),
        venus: createPlanet('./images/venus_texture.jpg', [4, 0, 0]),
        earth: createPlanet('./images/earth_texture.jpg', [5, 0, 0]),
        mars: createPlanet('./images/mars_texture.jpg', [7, 0, 0]),
        jupiter: createPlanet('./images/jupiter_texture.jpg', [10, 0, 0]),
        saturn: createPlanetWithRings('./images/saturn_texture.jpg', './images/saturn_ring_texture.png', [13, 0, 0]),
        uranus: createPlanet('./images/uranus_texture.jpg', [15, 0, 0]),
        neptune: createPlanet('./images/neptune_texture.jpg', [18, 0, 0]),
      };
    };

    // Initialize Scene
    addLighting();
    const planets = loadPlanets();

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    camera.position.set(0, 5, 30);
    controls.update();

    // Animation Loop
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      // Planet Orbits
      planets.mercury.position.x = 3 * Math.cos(time * 1.8);
      planets.mercury.position.z = 3 * Math.sin(time * 1.8);

      planets.venus.position.x = 4 * Math.cos(time * 1.5);
      planets.venus.position.z = 4 * Math.sin(time * 1.5);

      planets.earth.position.x = 5 * Math.cos(time);
      planets.earth.position.z = 5 * Math.sin(time);

      planets.mars.position.x = 7 * Math.cos(time * 0.8);
      planets.mars.position.z = 7 * Math.sin(time * 0.8);

      planets.jupiter.position.x = 10 * Math.cos(time * 0.5);
      planets.jupiter.position.z = 10 * Math.sin(time * 0.5);

      planets.saturn.position.x = 13 * Math.cos(time * 0.4);
      planets.saturn.position.z = 13 * Math.sin(time * 0.4);

      planets.uranus.position.x = 15 * Math.cos(time * 0.3);
      planets.uranus.position.z = 15 * Math.sin(time * 0.3);

      planets.neptune.position.x = 18 * Math.cos(time * 0.2);
      planets.neptune.position.z = 18 * Math.sin(time * 0.2);

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Resize Event Handler
    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onWindowResize);

    // Cleanup on Unmount
    return () => {
      window.removeEventListener('resize', onWindowResize);
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100%', height: '100vh' }} />;
};

export default ThreeScene;