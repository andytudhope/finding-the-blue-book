const container = document.getElementById("pitch-vis");
const width = container.clientWidth;
const height = container.clientHeight;

const scene = new THREE.Scene();
scene.background = null;

const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
camera.position.set(0, 0, 60);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(width, height);
container.appendChild(renderer.domElement);

// Parameters
const particleCount = 3000;
const particlesGeometry = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
const progress = new Float32Array(particleCount);

const startX = [];
const startY = [];
const peakX = [];
const peakY = [];
const endX = [];
const endY = [];

const peakHeight = 15 + Math.random() * 5;
const peakOffset = (Math.random() - 0.5) * 5;

// Define peak position (mountain ridge center)
const peakPoint = new THREE.Vector2(peakOffset, peakHeight);

for (let i = 0; i < particleCount; i++) {
  // Randomize left or right base start
  const side = Math.random() < 0.5 ? -1 : 1;
  const baseSpread = 20 + Math.random() * 10;
  startX[i] = side * baseSpread;
  startY[i] = -20 + Math.random() * 5;

  peakX[i] = peakPoint.x + (Math.random() - 0.5) * 3;
  peakY[i] = peakPoint.y + (Math.random() - 0.5) * 3;

  endX[i] = (Math.random() - 0.5) * 30;
  endY[i] = -25 + Math.random() * 5;

  // Initial positions
  positions[i * 3] = startX[i];
  positions[i * 3 + 1] = startY[i];
  positions[i * 3 + 2] = (Math.random() - 0.5) * 5;

  progress[i] = Math.random();  // staggered start
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
particlesGeometry.setAttribute('aProgress', new THREE.BufferAttribute(progress, 1));

const material = new THREE.PointsMaterial({
  color: 0x333333,
  size: 0.7,
  transparent: true,
  opacity: 0.7
});

const points = new THREE.Points(particlesGeometry, material);
scene.add(points);

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  const pos = particlesGeometry.attributes.position.array;
  const prog = particlesGeometry.attributes.aProgress.array;

  for (let i = 0; i < particleCount; i++) {
    prog[i] += 0.001 + Math.random() * 0.0005;

    if (prog[i] > 1) {
      prog[i] = 0;
    }

    // Quadratic bezier path: start -> peak -> end
    const t = prog[i];
    const oneMinusT = 1 - t;

    const x =
      oneMinusT * oneMinusT * startX[i] +
      2 * oneMinusT * t * peakX[i] +
      t * t * endX[i];
    const y =
      oneMinusT * oneMinusT * startY[i] +
      2 * oneMinusT * t * peakY[i] +
      t * t * endY[i];

    pos[i * 3] = x;
    pos[i * 3 + 1] = y;
    // slight z jitter for depth
    pos[i * 3 + 2] += (Math.random() - 0.5) * 0.02;
  }

  particlesGeometry.attributes.position.needsUpdate = true;
  particlesGeometry.attributes.aProgress.needsUpdate = true;

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