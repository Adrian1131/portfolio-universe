import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { planetCards } from './cardsData';
import PlanetCard from './PlanetCard';

const planetData = {
  mercury: { title: 'Mercury', description: 'More links or documents.', link: '/resume' },
  venus: { title: 'Venus', description: 'Visit my Projects.', link: '/projects' },
  earth: { title: 'Earth', description: 'About Me', link: '/portfolio' },
  mars: { title: 'Mars', description: 'Learn More About Me.', link: '/about' },
  jupiter: { title: 'Jupiter', description: 'View My GitHub.', link: 'https://github.com' },
  saturn: { title: 'Saturn', description: 'Contact Me.', link: '/contact' },
  uranus: { title: 'Uranus', description: 'Visit My LinkedIn.', link: '/blog' },
  neptune: { title: 'Neptune', description: 'View My Resume.', link: '/resume' },

};

const ThreeScene = () => {
  const mountRef = useRef(null);
  const [selectedCard, setSelectedCard] = React.useState(null); 

  useEffect(() => {
    if (!mountRef.current) return; // Prevent null errors during render

    // Raycaster and Mouse
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    // Create the Sun
  const createSun = () => {
  const sunGeometry = new THREE.SphereGeometry(2, 64, 64); // Larger size for the Sun
  const sunMaterial = new THREE.MeshStandardMaterial({
    emissive: 0xffa500, // Orange glow for the Sun
    emissiveIntensity: 2, // Glow intensity
    color: 0xffd700, // Yellow surface
  });
  const sun = new THREE.Mesh(sunGeometry, sunMaterial);
  sun.position.set(0, 0, 0); // Center of the scene
  scene.add(sun);

  // Add a light source to mimic sunlight
  const sunLight = new THREE.PointLight(0xffd700, 3, 75); // Bright yellow light
  sunLight.position.set(0, 0, 0);
  scene.add(sunLight);

  return sun;
};

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

        // Raycaster Event Listener for Clicks
        const onMouseClick = (event) => {
          mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
          mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
          raycaster.setFromCamera(mouse, camera);
          const intersects = raycaster.intersectObjects(Object.values(planets));
    
          if (intersects.length > 0) {
            const clickedPlanet = intersects[0].object;
            for (const [name, planet] of Object.entries(planets)) {
              if (planet === clickedPlanet) {
                setSelectedCard(planetData[name]);
                break;
              }
            }
          }
        };
    
        window.addEventListener('click', onMouseClick);

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
      const sun = createSun();
      return {
        sun, // Sun is a special case
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

        // Planets orbit around the Sun
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

  return (
    <div ref={mountRef} style={{ width: '100%', height: '100vh', position: 'relative' }}>
      {selectedCard && (
        <PlanetCard
          title={selectedCard.title}
          description={selectedCard.description}
          link={selectedCard.link}
          onClose={() => setSelectedCard(null)}
        />
      )}
    </div>
  );
};


export default ThreeScene;