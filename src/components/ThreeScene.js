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
  const textureLoader = new THREE.TextureLoader();
  
  // Refs for Three.js objects
  const cameraRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const planetsRef = useRef({});
  const sunRef = useRef(null);

  // Reset View
  const resetView = () => {
    setIsZoomed(false);
    setSelectedCard(null);
    const defaultPosition = { x: 0, y: 10, z: 30 };
    gsap.to(cameraRef.current.position, {
      duration: 1.5,
      ...defaultPosition,
      onUpdate: () => cameraRef.current.lookAt(new THREE.Vector3(0, 0, 0)),
      ease: "power2.inOut"
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
      ease: "power2.inOut"
    });
  };

  useEffect(() => {
    if (!mountRef.current) return;

    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    const planets = {};
    planetsRef.current = planets;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 10, 30);
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000);
    mountRef.current.appendChild(renderer.domElement);

    // Store refs
    cameraRef.current = camera;
    sceneRef.current = scene;
    rendererRef.current = renderer;

    // Create realistic space background
    const createSpaceBackground = () => {
      const geometry = new THREE.SphereGeometry(500, 60, 40);
      geometry.scale(-1, 1, 1); // Invert the sphere so we can see it from inside
      
      const material = new THREE.ShaderMaterial({
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
            vec3 color = vec3(0.0);
            
            // Create a subtle nebula effect
            float noise = sin(vUv.x * 20.0 + time * 0.1) * cos(vUv.y * 20.0 + time * 0.1);
            color += vec3(0.02, 0.01, 0.03) * noise;
            
            // Add some distant stars
            float stars = pow(sin(vUv.x * 1000.0) * sin(vUv.y * 1000.0), 20.0);
            color += vec3(0.1) * stars;
            
            gl_FragColor = vec4(color, 1.0);
          }
        `,
        side: THREE.BackSide
      });

      const background = new THREE.Mesh(geometry, material);
      scene.add(background);
      return background;
    };

    // Enhanced Sun with realistic glow
    const createSun = () => {
      // Sun core
      const sunGeometry = new THREE.SphereGeometry(2, 64, 64);
      const sunMaterial = new THREE.MeshBasicMaterial({
        color: 0xffff00,
        transparent: true,
        opacity: 0.9
      });
      const sun = new THREE.Mesh(sunGeometry, sunMaterial);
      sun.position.set(0, 0, 0);

      // Sun glow
      const glowGeometry = new THREE.SphereGeometry(2.2, 64, 64);
      const glowMaterial = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 }
        },
        vertexShader: `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float time;
          varying vec3 vNormal;
          
          void main() {
            float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
            vec3 glowColor = vec3(1.0, 0.6, 0.2);
            gl_FragColor = vec4(glowColor, intensity * 0.5);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide
      });

      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      sun.add(glow);

      // Sun light
      const sunLight = new THREE.PointLight(0xffff00, 2, 100);
      sunLight.position.set(0, 0, 0);
      scene.add(sunLight);

      // Add lens flare
      const textureFlare0 = textureLoader.load('/images/lensflare0.png');
      const textureFlare1 = textureLoader.load('/images/lensflare1.png');
      const textureFlare2 = textureLoader.load('/images/lensflare2.png');

      const lensflare = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: textureFlare0,
          color: 0xffff00,
          transparent: true,
          blending: THREE.AdditiveBlending
        })
      );
      lensflare.scale.set(2, 2, 1);
      sun.add(lensflare);

      scene.add(sun);
      sunRef.current = sun;
      return sun;
    };

    // Enhanced Planet Creation with proper rotation
    const createPlanet = (texturePath, position, size = 1, rotationSpeed = 0.01) => {
      const geometry = new THREE.SphereGeometry(size, 64, 64);
      const material = new THREE.MeshStandardMaterial({
        map: textureLoader.load(texturePath),
        roughness: 0.8,
        metalness: 0.2
      });
      const planet = new THREE.Mesh(geometry, material);
      planet.position.set(...position);
      
      // Create a group to handle both rotation and orbit
      const planetGroup = new THREE.Group();
      planetGroup.add(planet);
      planetGroup.position.set(...position);
      
      // Store rotation speed in userData
      planetGroup.userData = {
        rotationSpeed,
        orbitSpeed: 0.2 / Math.sqrt(position[0]),
        initialPosition: [...position]
      };
      
      scene.add(planetGroup);
      return planetGroup;
    };

    // Planet with Rings
    const createPlanetWithRings = (planetTexture, ringTexture, position, ringSize = 1.5, ringRotationSpeed = 0.004) => {
      const planetGroup = createPlanet(planetTexture, position, 1, 0.01);
      const planet = planetGroup.children[0];
      
      const ringGeometry = new THREE.RingGeometry(ringSize, 2.5, 64);
      const ringMaterial = new THREE.MeshBasicMaterial({
        map: textureLoader.load(ringTexture),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = Math.PI / 2;
      ring.rotation.y = Math.PI / 4;
      ring.userData.rotationSpeed = ringRotationSpeed;
      planet.add(ring);
      
      return planetGroup;
    };

    // Load Planets with improved parameters
    const loadPlanets = () => {
      const sun = createSun();
      planets.mercury = createPlanet('/images/mercury_texture.jpg', [3, 0, 0], 0.8, 0.02);
      planets.venus = createPlanet('/images/venus_texture.jpg', [4, 0, 0], 0.9, 0.015);
      planets.earth = createPlanet('/images/earth_texture.jpg', [5, 0, 0], 1, 0.01);
      planets.mars = createPlanet('/images/mars_texture.jpg', [7, 0, 0], 0.9, 0.008);
      planets.jupiter = createPlanet('/images/jupiter_texture.jpg', [10, 0, 0], 1.5, 0.005);
      planets.saturn = createPlanetWithRings('/images/saturn_texture.jpg', '/images/saturn_ring_texture.png', [13, 0, 0], 1.3, 0.004);
      planets.uranus = createPlanet('/images/uranus_texture.jpg', [15, 0, 0], 1.1, 0.003);
      planets.neptune = createPlanet('/images/neptune_texture.jpg', [18, 0, 0], 1.1, 0.002);
    };

    // Add lighting
    const addLighting = () => {
      const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(5, 5, 5);
      scene.add(directionalLight);
    };

    const spaceBackground = createSpaceBackground();
    addLighting();
    loadPlanets();

    // Enhanced controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 5;
    controls.maxDistance = 50;
    controls.maxPolarAngle = Math.PI / 2;
    controls.update();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Raycaster Click Event
    const onMouseClick = (event) => {
      if (!camera || !scene) return;
    
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(
        Object.values(planets).map(planet => planet.children[0])
      );
    
      if (intersects.length > 0) {
        const clickedPlanet = intersects[0].object.parent;
        const planetName = Object.keys(planets).find((name) => planets[name] === clickedPlanet);
    
        if (planetName) {
          setSelectedCard(planetData[planetName]);
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

      // Update space background
      if (spaceBackground) {
        spaceBackground.material.uniforms.time.value = time;
      }

      // Update sun
      if (sunRef.current) {
        sunRef.current.rotation.y += 0.001;
        if (sunRef.current.children[0]) {
          sunRef.current.children[0].material.uniforms.time.value = time;
        }
      }

      // Update planet rotations and orbits
      Object.values(planets).forEach((planetGroup) => {
        const planet = planetGroup.children[0];
        const { rotationSpeed, orbitSpeed, initialPosition } = planetGroup.userData;
        
        // Planet rotation
        planet.rotation.y += rotationSpeed;
        
        // Orbit movement
        const angle = time * orbitSpeed;
        planetGroup.position.x = initialPosition[0] * Math.cos(angle);
        planetGroup.position.z = initialPosition[0] * Math.sin(angle);
        
        // Update ring rotation if it exists
        if (planet.children[0] && planet.children[0].userData.rotationSpeed) {
          planet.children[0].rotation.z += planet.children[0].userData.rotationSpeed;
        }
      });

      time += 0.01;
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('click', onMouseClick);
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
      
      // Cleanup geometries and materials
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
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