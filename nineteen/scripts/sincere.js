const container = document.getElementById("sincere-vis");
const width = 400;
const height = 400;

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

// Moon
const moonGeometry = new THREE.CircleGeometry(40, 64);
const moonMaterial = new THREE.MeshBasicMaterial({ color: 0xeeeeee, transparent: true, opacity: 0.85 });
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
moon.position.set(0, height / 4, 0);
scene.add(moon);

// Particle "waves"
const waveCount = 8;
const particlesPerWave = 120;
const totalParticles = waveCount * particlesPerWave;

const positions = new Float32Array(totalParticles * 3);
const velocities = new Float32Array(totalParticles * 2); // x and y drift
const yBases = [];

for (let i = 0; i < waveCount; i++) {
  const yBase = -height / 4 + i * 15;
  yBases.push(yBase);

  for (let j = 0; j < particlesPerWave; j++) {
    const idx = (i * particlesPerWave + j) * 3;
    const x = -width / 2 + (j / (particlesPerWave - 1)) * width;
    positions[idx] = x;
    positions[idx + 1] = yBase;
    positions[idx + 2] = 0;

    // Random small drift speeds
    velocities[(i * particlesPerWave + j) * 2] = (Math.random() - 0.5) * 0.2;
    velocities[(i * particlesPerWave + j) * 2 + 1] = (Math.random() - 0.5) * 0.2;
  }
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const material = new THREE.PointsMaterial({
  color: 0x0d1b4c,
  size: 1.8,
  transparent: true,
  opacity: 0.6
});

const points = new THREE.Points(geometry, material);
scene.add(points);

// Animation
function animate() {
  requestAnimationFrame(animate);
  const pos = geometry.attributes.position.array;

  for (let i = 0; i < totalParticles; i++) {
    const baseLine = Math.floor(i / particlesPerWave);
    const yBase = yBases[baseLine];

    // Random walk with sinusoidal bias
    pos[i * 3] += velocities[i * 2] * (0.5 + Math.sin(Date.now() * 0.001 + i) * 0.5);
    pos[i * 3 + 1] = yBase + Math.sin(pos[i * 3] * 0.02 + Date.now() * 0.001 * (0.8 + baseLine * 0.1)) * 8
      + (Math.random() - 0.5) * 0.5;

    // Wrap horizontally
    if (pos[i * 3] < -width / 2) pos[i * 3] = width / 2;
    if (pos[i * 3] > width / 2) pos[i * 3] = -width / 2;
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