import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import PlanetCard from './PlanetCard';
import gsap from 'gsap';
import { planetData } from './cardsData';


const ThreeScene = () => {
  const mountRef = useRef(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [camera, setCamera] = useState(null);
  const [scene, setScene] = useState(null);
  const [selectedPlanet, setSelectedPlanet] = useState(null);

  // Refs for Three.js objects
  const cameraRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);

  // Reset View
  const resetView = () => {
    setIsZoomed(false);
    setSelectedCard(null);
    const defaultPosition = { x: 0, y: 10, z: 30 };
    gsap.to(cameraRef.current.position, {
      duration: 1.5,
      ...defaultPosition,
      onUpdate: () => cameraRef.current.lookAt(new THREE.Vector3(0, 0, 0)),
    });
  };

  // Zoom to Planet
  const zoomToPlanet = (planet) => {
    const camera = cameraRef.current;
    if (!camera) return;

    gsap.to(camera.position, {
      duration: 1.5,
      x: planet.position.x + 5,
      y: planet.position.y + 2,
      z: planet.position.z + 8,
      onUpdate: () => {
        camera.lookAt(planet.position);
      },
      onComplete: () => {
        setIsZoomed(true);
      },
    });
  };

  useEffect(() => {
    if (!mountRef.current) return;

    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    const planets = {};

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    cameraRef.current = camera;
    sceneRef.current = scene;
    rendererRef.current = renderer;


    // Create the Sun
    const createSun = () => {
      const sunGeometry = new THREE.SphereGeometry(2, 64, 64);
      const sunMaterial = new THREE.MeshStandardMaterial({
        emissive: 0xffa500,
        emissiveIntensity: 2,
        color: 0xffd700,
      });
      const sun = new THREE.Mesh(sunGeometry, sunMaterial);
      sun.position.set(0, 0, 0);
      scene.add(sun);

      const sunLight = new THREE.PointLight(0xffd700, 3, 75);
      sunLight.position.set(0, 0, 0);
      scene.add(sunLight);
    };

    // Background Stars
    const textureLoader = new THREE.TextureLoader();
    const starsTexture = textureLoader.load('./images/stars.jpg', () => {
    scene.background = starsTexture;
    });

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
        map: textureLoader.load(texturePath),
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
      createSun();
      planets.mercury = createPlanet('./images/mercury_texture.jpg', [3, 0, 0]);
      planets.venus = createPlanet('./images/venus_texture.jpg', [4, 0, 0]);
      planets.earth = createPlanet('./images/earth_texture.jpg', [5, 0, 0]);
      planets.mars = createPlanet('./images/mars_texture.jpg', [7, 0, 0]);
      planets.jupiter = createPlanet('./images/jupiter_texture.jpg', [10, 0, 0]);
      planets.saturn = createPlanetWithRings('./images/saturn_texture.jpg', './images/saturn_ring_texture.png', [13, 0, 0]);
      planets.uranus = createPlanet('./images/uranus_texture.jpg', [15, 0, 0]);
      planets.neptune = createPlanet('./images/neptune_texture.jpg', [18, 0, 0]);
    };

    addLighting();
    loadPlanets();

    const controls = new OrbitControls(camera, renderer.domElement);
    camera.position.set(0, 10, 30);
    controls.update();

    // Raycaster Click Event
    const onMouseClick = (event) => {
      if (!camera || !scene) return;
    
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(Object.values(planets));
    
      if (intersects.length > 0) {
        const clickedPlanet = intersects[0].object;
        const planetName = Object.keys(planets).find((name) => planets[name] === clickedPlanet);
    
        if (planetName) {
          setSelectedCard(planetData[planetName]); // Use imported planetData here
          setIsZoomed(true);
          zoomToPlanet(clickedPlanet);
        }
      }
    };

    window.addEventListener('click', onMouseClick);

    // Animation Loop
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);

      Object.values(planets).forEach((planet) => {
        planet.rotation.y += 0.01; // Spin planets
      });

      time += 0.01;
      planets.mercury.position.set(3 * Math.cos(time * 1.8), 0, 3 * Math.sin(time * 1.8));
      planets.venus.position.set(4 * Math.cos(time * 1.5), 0, 4 * Math.sin(time * 1.5));
      planets.earth.position.set(5 * Math.cos(time), 0, 5 * Math.sin(time));
      planets.mars.position.set(7 * Math.cos(time * 0.8), 0, 7 * Math.sin(time * 0.8));
      planets.jupiter.position.set(10 * Math.cos(time * 0.5), 0, 10 * Math.sin(time * 0.5));
      planets.saturn.position.set(13 * Math.cos(time * 0.4), 0, 13 * Math.sin(time * 0.4));
      planets.uranus.position.set(15 * Math.cos(time * 0.3), 0, 15 * Math.sin(time * 0.3));
      planets.neptune.position.set(18 * Math.cos(time * 0.2), 0, 18 * Math.sin(time * 0.2));

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('click', onMouseClick);
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div ref={mountRef} style={{ width: '100%', height: '100vh', position: 'relative' }}>
      {/* The 3D Scene */}
      {isZoomed && selectedCard && (
        <PlanetCard
          title={selectedCard.title}
          description={selectedCard.description}
          links={selectedCard.links}
          onClose={resetView}
        />
      )}
    </div>
  );
};

export default ThreeScene;