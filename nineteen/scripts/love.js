const container = document.getElementById("love-vis");
const width = container.clientWidth;
const height = container.clientHeight;

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(
  width / -2, width / 2,
  height / 2, height / -2,
  0.1, 1000
);
camera.position.z = 10;

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(width, height);
renderer.setClearColor(0x000000, 0);
container.appendChild(renderer.domElement);

// Particle field parameters
const particleCount = 18000;
const positions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);
const speeds = new Float32Array(particleCount);
const sides = new Int8Array(particleCount);
const drifts = new Float32Array(particleCount);

const centerX = 0;
const centerY = 0;

for (let i = 0; i < particleCount; i++) {
  const side = Math.random() < 0.5 ? -1 : 1;
  sides[i] = side;
  const y = (Math.random() - 0.5) * height;
  positions[i * 3 + 0] = side * (60 + Math.sin(y * 0.01) * 60 + Math.sin(y * 0.03) * 20);
  positions[i * 3 + 1] = y;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 100;

  drifts[i] = Math.random() * Math.PI * 2;
  speeds[i] = 0.1 + Math.random() * 0.3;

  // Deep rich blue and pink distribution
  if (Math.random() < 0.5) {
    colors[i * 3 + 0] = 0.05;
    colors[i * 3 + 1] = 0.1;
    colors[i * 3 + 2] = 0.3 + Math.random() * 0.2;
  } else {
    colors[i * 3 + 0] = 0.5 + Math.random() * 0.3;
    colors[i * 3 + 1] = 0.1 + Math.random() * 0.1;
    colors[i * 3 + 2] = 0.2 + Math.random() * 0.2;
  }
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const material = new THREE.PointsMaterial({
  vertexColors: true,
  size: 0.7,
  transparent: true,
  opacity: 0.5,
  depthWrite: false
});

const points = new THREE.Points(geometry, material);
scene.add(points);

// Animation loop
let time = 0;
function animate() {
  requestAnimationFrame(animate);
  time += 0.008;

  const pos = geometry.attributes.position.array;
  for (let i = 0; i < particleCount; i++) {
    const y = pos[i * 3 + 1];
    const currentPhase = y * 0.01 + time * 0.1;

    const waveAmount = Math.sin(currentPhase) * 60 + Math.sin(currentPhase * 3) * 20;
    const wallThickness = 30 + Math.sin(currentPhase * 2) * 15;

    const targetX = sides[i] * (60 + waveAmount);
    const offset = Math.sin(drifts[i] + time) * wallThickness * 0.5;
    pos[i * 3 + 0] = pos[i * 3 + 0] * 0.95 + (targetX + offset) * 0.05;

    pos[i * 3 + 1] += speeds[i];
    pos[i * 3 + 2] += Math.sin(time * 0.5 + drifts[i]) * 0.3;

    // Reset at bottom
    if (pos[i * 3 + 1] > height / 2 + 20) {
      pos[i * 3 + 1] = -height / 2 - 20;
      drifts[i] = Math.random() * Math.PI * 2;
    }
  }
  geometry.attributes.position.needsUpdate = true;
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  const width = container.clientWidth;
  const height = container.clientHeight;
  camera.left = width / -2;
  camera.right = width / 2;
  camera.top = height / 2;
  camera.bottom = height / -2;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
});