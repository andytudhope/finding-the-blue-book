const container = document.getElementById("rainbow-vis");
const width = container.clientWidth;
const height = container.clientHeight;

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
camera.position.set(0, 0, 60);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(width, height);
renderer.setClearColor(0x000000, 0); 
container.appendChild(renderer.domElement);

// Particle system: true double helix rainbow bridge
const particleCountPerStrand = 4000;
const helixTurns = 4;
const helixHeight = 100;
const helixRadius = 10;

const totalParticles = particleCountPerStrand * 2;
const positions = new Float32Array(totalParticles * 3);
const colors = new Float32Array(totalParticles * 3);

function rainbowColor(t) {
  const c = new THREE.Color();
  c.setHSL(t, 0.9, 0.5);
  return c;
}

for (let i = 0; i < totalParticles; i++) {
  const strandIndex = i < particleCountPerStrand ? 0 : 1;
  const strandOffset = strandIndex * Math.PI;
  const localIndex = i % particleCountPerStrand;
  const progress = localIndex / particleCountPerStrand;

  const angle = progress * helixTurns * Math.PI * 2 + strandOffset;
  const y = (progress - 0.5) * helixHeight;

  positions[i * 3] = Math.cos(angle) * helixRadius;
  positions[i * 3 + 1] = y;
  positions[i * 3 + 2] = Math.sin(angle) * helixRadius;

  const rainbow = rainbowColor(progress);
  colors[i * 3] = rainbow.r;
  colors[i * 3 + 1] = rainbow.g;
  colors[i * 3 + 2] = rainbow.b;
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const material = new THREE.PointsMaterial({
  size: 0.8,
  vertexColors: true,
  transparent: true,
  opacity: 0.9
});

const particles = new THREE.Points(geometry, material);
scene.add(particles);

// Animate up/down flow
let time = 0;
function animate() {
  requestAnimationFrame(animate);
  time += 0.01;

  const pos = geometry.attributes.position.array;
  for (let i = 0; i < totalParticles; i++) {
    let y = pos[i * 3 + 1];
    y += Math.sin(time * 0.5 + i * 0.0005) * 0.2;
    if (y > helixHeight / 2) y = -helixHeight / 2;
    if (y < -helixHeight / 2) y = helixHeight / 2;
    pos[i * 3 + 1] = y;

    const strandIndex = i < particleCountPerStrand ? 0 : 1;
    const strandOffset = strandIndex * Math.PI;
    const progress = (y + helixHeight / 2) / helixHeight;
    const angle = progress * helixTurns * Math.PI * 2 + strandOffset + time * 0.05;

    pos[i * 3] = Math.cos(angle) * helixRadius;
    pos[i * 3 + 2] = Math.sin(angle) * helixRadius;
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