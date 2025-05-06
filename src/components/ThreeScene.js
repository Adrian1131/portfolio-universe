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
  const textureLoader = new THREE.textureLoader();
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
    const particles = [];

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000);
    mountRef.current.appendChild(renderer.domElement);

    cameraRef.current = camera;
    sceneRef.current = scene;
    rendererRef.current = renderer;

    // Enhanced Starfield
    const addStarfield = () => {
      const starGeometry = new THREE.BufferGeometry();
      const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.1,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
      });

      const starVertices = [];
      const starColors = [];
      const starSizes = [];

      for (let i = 0; i < 20000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        starVertices.push(x, y, z);

        // Add some color variation
        const color = new THREE.Color();
        color.setHSL(Math.random() * 0.2 + 0.5, 0.8, Math.random() * 0.2 + 0.5);
        starColors.push(color.r, color.g, color.b);

        // Add size variation
        starSizes.push(Math.random() * 0.2 + 0.1);
      }

      starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
      starGeometry.setAttribute('color', new THREE.Float32BufferAttribute(starColors, 3));
      starGeometry.setAttribute('size', new THREE.Float32BufferAttribute(starSizes, 1));

      const stars = new THREE.Points(starGeometry, starMaterial);
      scene.add(stars);
      return stars;
    };

    // Add Nebula Effect
    const addNebula = () => {
      const nebulaGeometry = new THREE.PlaneGeometry(2000, 2000);
      const nebulaMaterial = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float time;
          uniform vec2 resolution;
          varying vec2 vUv;
          
          void main() {
            vec2 uv = vUv;
            vec3 color = vec3(0.0);
            
            // Create nebula effect
            float noise = sin(uv.x * 10.0 + time) * cos(uv.y * 10.0 + time);
            color += vec3(0.1, 0.0, 0.2) * noise;
            color += vec3(0.0, 0.1, 0.2) * (1.0 - noise);
            
            gl_FragColor = vec4(color, 0.1);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending
      });

      const nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
      nebula.position.z = -500;
      scene.add(nebula);
      return nebula;
    };

    // Enhanced Sun
    const createSun = () => {
      const sunGeometry = new THREE.SphereGeometry(2, 64, 64);
      const sunMaterial = new THREE.MeshStandardMaterial({
        emissive: 0xffa500,
        emissiveIntensity: 2,
        color: 0xffd700,
        roughness: 0.8,
        metalness: 0.2
      });
      const sun = new THREE.Mesh(sunGeometry, sunMaterial);
      sun.position.set(0, 0, 0);
      scene.add(sun);

      // Add sun glow
      const sunGlow = new THREE.Mesh(
        new THREE.SphereGeometry(2.2, 32, 32),
        new THREE.ShaderMaterial({
          uniforms: {
            time: { value: 0 }
          },
          vertexShader: `
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            uniform float time;
            varying vec2 vUv;
            void main() {
              float intensity = 0.5 + 0.5 * sin(time * 2.0);
              gl_FragColor = vec4(1.0, 0.5, 0.0, 0.2 * intensity);
            }
          `,
          transparent: true,
          blending: THREE.AdditiveBlending
        })
      );
      sun.add(sunGlow);

      const sunLight = new THREE.PointLight(0xffd700, 3, 75);
      sunLight.position.set(0, 0, 0);
      scene.add(sunLight);
      return sun;
    };

    // Enhanced Planet Creation
    const createPlanet = (texturePath, position, size = 1, rotationSpeed = 0.01) => {
      const geometry = new THREE.SphereGeometry(size, 64, 64);
      const material = new THREE.MeshStandardMaterial({
        map: textureLoader.load(texturePath),
        roughness: 0.8,
        metalness: 0.2
      });
      const planet = new THREE.Mesh(geometry, material);
      planet.position.set(...position);
      planet.userData.rotationSpeed = rotationSpeed;
      scene.add(planet);
      return planet;
    };

    // Planet with Rings
    const createPlanetWithRings = (planetTexture, ringTexture, position, ringSize = 1.5, ringRotationSpeed = 0.004) => {
      const planet = createPlanet(planetTexture, position, 1, 0.01);
      const ringGeometry = new THREE.RingGeometry(ringSize, 2.5, 64);
      const ringMaterial = new THREE.MeshBasicMaterial({
        map: textureLoader.load(ringTexture),
        side: THREE.DoubleSide,
        transparent: true,
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = Math.PI / 2;
      ring.rotation.y = Math.PI / 4;
      ring.userData.rotationSpeed = ringRotationSpeed;
      planet.add(ring);
      return planet;
    };

    // Load Planets with improved parameters
    const loadPlanets = () => {
      const sun = createSun();
      planets.mercury = createPlanet('./images/mercury_texture.jpg', [3, 0, 0], 0.8, 0.02);
      planets.venus = createPlanet('./images/venus_texture.jpg', [4, 0, 0], 0.9, 0.015);
      planets.earth = createPlanet('./images/earth_texture.jpg', [5, 0, 0], 1, 0.01);
      planets.mars = createPlanet('./images/mars_texture.jpg', [7, 0, 0], 0.9, 0.008);
      planets.jupiter = createPlanet('./images/jupiter_texture.jpg', [10, 0, 0], 1.5, 0.005);
      planets.saturn = createPlanetWithRings('./images/saturn_texture.jpg', './images/saturn_ring_texture.png', [13, 0, 0], 1.3, 0.004);
      planets.uranus = createPlanet('./images/uranus_texture.jpg', [15, 0, 0], 1.1, 0.003);
      planets.neptune = createPlanet('./images/neptune_texture.jpg', [18, 0, 0], 1.1, 0.002);
    };

    // Add ambient particles
    const addAmbientParticles = () => {
      const particleCount = 1000;
      const particleGeometry = new THREE.BufferGeometry();
      const particleMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.05,
        transparent: true,
        opacity: 0.5
      });

      const particlePositions = [];
      for (let i = 0; i < particleCount; i++) {
        particlePositions.push(
          (Math.random() - 0.5) * 100,
          (Math.random() - 0.5) * 100,
          (Math.random() - 0.5) * 100
        );
      }

      particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(particlePositions, 3));
      const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
      scene.add(particleSystem);
      return particleSystem;
    };

    const stars = addStarfield();
    const nebula = addNebula();
    const ambientParticles = addAmbientParticles();
    addLighting();
    loadPlanets();

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
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

    // Enhanced Animation Loop
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);

      // Update star twinkling
      if (stars) {
        const positions = stars.geometry.attributes.position.array;
        const sizes = stars.geometry.attributes.size.array;
        for (let i = 0; i < positions.length; i += 3) {
          sizes[i / 3] = 0.1 + Math.sin(time * 2 + i) * 0.05;
        }
        stars.geometry.attributes.size.needsUpdate = true;
      }

      // Update nebula
      if (nebula) {
        nebula.material.uniforms.time.value = time;
      }

      // Update planet rotations and orbits
      Object.values(planets).forEach((planet) => {
        // Individual planet rotation
        planet.rotation.y += planet.userData.rotationSpeed;
        
        // Update orbit position
        const orbitRadius = planet.position.x;
        const orbitSpeed = 0.2 / Math.sqrt(orbitRadius);
        const angle = time * orbitSpeed;
        
        planet.position.x = orbitRadius * Math.cos(angle);
        planet.position.z = orbitRadius * Math.sin(angle);
      });

      // Update ambient particles
      if (ambientParticles) {
        const positions = ambientParticles.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
          positions[i] += (Math.random() - 0.5) * 0.1;
          positions[i + 1] += (Math.random() - 0.5) * 0.1;
          positions[i + 2] += (Math.random() - 0.5) * 0.1;
        }
        ambientParticles.geometry.attributes.position.needsUpdate = true;
      }

      time += 0.01;
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