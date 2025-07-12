const container = document.getElementById("illuminate-vis");
const width = 400;
const height = 400;

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
camera.position.set(0, 0, 60);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(width, height);
container.appendChild(renderer.domElement);

// Particle system
const particleCount = 10000;
const strataLayers = 10;

const positions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount; i++) {
  const layer = Math.floor(Math.random() * strataLayers);
  const x = (Math.random() - 0.5) * 100;
  const strataPhase = x * 0.02 + layer * 0.4;

  const undulation =
      Math.sin(strataPhase) * 20 +
      Math.sin(strataPhase * 2 + layer * 0.8) * 10 +
      Math.sin(strataPhase * 4 + layer * 1.2) * 4;

  const side = Math.random() < 0.5 ? -1 : 1;
  const depth = layer * 15;
  const y = side * (20 + undulation + depth) + (Math.random() - 0.5) * 10;
  const z = (layer - strataLayers / 2) * 20 + (Math.random() - 0.5) * 10;

  positions[i * 3] = x;
  positions[i * 3 + 1] = y;
  positions[i * 3 + 2] = z;

  // Light blue and grey tones
  const base = 0.4 + Math.random() * 0.4;
  colors[i * 3] = base * 0.8;
  colors[i * 3 + 1] = base * 0.85 + 0.1 * Math.random();
  colors[i * 3 + 2] = base + 0.2 * Math.random();
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const material = new THREE.PointsMaterial({
  size: 0.7,
  vertexColors: true,
  transparent: true,
  opacity: 0.6
});

const particles = new THREE.Points(geometry, material);
scene.add(particles);

// Animation
let time = 0;
function animate() {
  requestAnimationFrame(animate);
  time += 0.005;

  const positions = geometry.attributes.position.array;
  for (let i = 0; i < particleCount; i++) {
    const x = positions[i * 3] + 0.05;
    const layer = Math.floor((positions[i * 3 + 2] + strataLayers * 10) / 20);
    const strataPhase = x * 0.02 + layer * 0.4 + time;

    const undulation =
        Math.sin(strataPhase) * 20 +
        Math.sin(strataPhase * 2 + layer * 0.8) * 10 +
        Math.sin(strataPhase * 4 + layer * 1.2) * 4;
    const side = positions[i * 3 + 1] > 0 ? 1 : -1;
    const depth = layer * 15;
    const targetY = side * (20 + undulation + depth);

    positions[i * 3 + 1] = positions[i * 3 + 1] * 0.96 + targetY * 0.04;
    positions[i * 3] = x > 50 ? -50 : x;
  }
  geometry.attributes.position.needsUpdate = true;

  renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
  const width = container.clientWidth;
  const height = container.clientHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
});