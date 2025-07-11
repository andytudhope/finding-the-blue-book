const container = document.getElementById("light-vis");
const width = container.clientWidth;
const height = container.clientHeight;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
camera.position.set(0, 0, 12);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(width, height);
container.appendChild(renderer.domElement);

// Parameters
const particleCount = 20000;
const positions = new Float32Array(particleCount * 3);
const velocities = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);

// Cone shape
const heightRange = 6;
const baseRadius = 0.05;
const maxRadius = 3;

// Color
const goldRGB = new THREE.Color("#996e10");

for (let i = 0; i < particleCount; i++) {
  const t = Math.random();
  const direction = Math.random() < 0.5 ? -1 : 1;
  const height = direction * t * heightRange / 2;
  const heightFactor = Math.abs(height) / (heightRange / 2);
  const radius = baseRadius + heightFactor * maxRadius;
  const angle = Math.random() * Math.PI * 2;

  positions[i * 3] = Math.cos(angle) * radius;
  positions[i * 3 + 1] = height;
  positions[i * 3 + 2] = Math.sin(angle) * radius;

  // Random radial swirl velocity and vertical drift
  const swirl = (Math.random() - 0.5) * 0.02;
  const upward = direction * (0.01 + Math.random() * 0.02);
  velocities[i * 3] = swirl;
  velocities[i * 3 + 1] = upward;
  velocities[i * 3 + 2] = swirl;

  // Color: black at center, gold at edge
  const mix = heightFactor;
  const r = 0.05 + mix * (goldRGB.r - 0.05);
  const g = 0.05 + mix * (goldRGB.g - 0.05);
  const b = 0.05 + mix * (goldRGB.b - 0.05);
  colors[i * 3] = r;
  colors[i * 3 + 1] = g;
  colors[i * 3 + 2] = b;
}

// Geometry and material
const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const material = new THREE.PointsMaterial({
  vertexColors: true,
  size: 0.08,
  transparent: true,
  opacity: 0.6
});

const points = new THREE.Points(geometry, material);
scene.add(points);

// Animation
function animate() {
  requestAnimationFrame(animate);
  const pos = geometry.attributes.position.array;

  for (let i = 0; i < particleCount; i++) {
    // Slight spiral swirl and vertical drift
    const x = pos[i * 3];
    const y = pos[i * 3 + 1];
    const z = pos[i * 3 + 2];

    const r = Math.sqrt(x * x + z * z) + 0.0001;
    const angle = Math.atan2(z, x) + velocities[i * 3];

    const newR = r * 1.0002;
    pos[i * 3] = Math.cos(angle) * newR;
    pos[i * 3 + 2] = Math.sin(angle) * newR;
    pos[i * 3 + 1] += velocities[i * 3 + 1];

    // Reset if outside cone
    const heightFactor = Math.abs(pos[i * 3 + 1]) / (heightRange / 2);
    const maxR = baseRadius + heightFactor * maxRadius;
    if (Math.abs(pos[i * 3 + 1]) > heightRange / 2 || Math.sqrt(pos[i * 3] * pos[i * 3] + pos[i * 3 + 2] * pos[i * 3 + 2]) > maxR) {
      const t = Math.random();
      const direction = Math.random() < 0.5 ? -1 : 1;
      const height = direction * t * heightRange / 2;
      const hFactor = Math.abs(height) / (heightRange / 2);
      const radius = baseRadius + hFactor * maxRadius;
      const ang = Math.random() * Math.PI * 2;

      pos[i * 3] = Math.cos(ang) * radius;
      pos[i * 3 + 1] = height;
      pos[i * 3 + 2] = Math.sin(ang) * radius;
    }
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