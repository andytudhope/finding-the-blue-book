const container = document.getElementById("grace-vis");
const width = 400;
const height = 400;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
camera.position.set(0, 0, 6);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(width, height);
renderer.setClearColor(0x000000, 0);
container.appendChild(renderer.domElement);

const purpleMaterial = new THREE.LineBasicMaterial({ color: 0x800080, transparent: true, opacity: 0.4 });
const goldMaterial = new THREE.LineBasicMaterial({ color: 0xB8860B, transparent: true, opacity: 0.4 });

const mainGroup = new THREE.Group();
scene.add(mainGroup);

// Parameters
const resolution = 32;
const size = 6;

// Create wave sources
function createWaveSources(time, scale, count = 5) {
  const sources = [];
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * 2 * Math.PI;
    const radius = scale * (1 + 0.2 * Math.sin(angle * 3));
    sources.push({
      x: Math.cos(angle) * radius,
      z: Math.sin(angle) * radius,
      frequency: 2 + Math.sin(angle * 2),
      amplitude: 0.3 + 0.1 * Math.cos(angle),
      phase: time * 3 + angle
    });
  }
  // Central source
  sources.push({
    x: 0,
    z: 0,
    frequency: 3,
    amplitude: 0.4,
    phase: time * 4
  });
  return sources;
}

// Create interference field geometry
function createInterferenceField(material, sources, size, resolution, time) {
  const step = size / resolution;
  const heightMap = [];

  for (let i = 0; i <= resolution; i++) {
    heightMap[i] = [];
    const x = (i * step) - (size / 2);
    for (let j = 0; j <= resolution; j++) {
      const z = (j * step) - (size / 2);
      let height = 0;
      sources.forEach(s => {
        const dx = x - s.x;
        const dz = z - s.z;
        const distance = Math.sqrt(dx * dx + dz * dz);
        height += Math.sin(distance * s.frequency - time * 5 + s.phase) *
                  s.amplitude * Math.exp(-distance * 0.3);
      });
      heightMap[i][j] = height;
    }
  }

  const group = new THREE.Group();

  for (let i = 0; i <= resolution; i++) {
    const geometry = new THREE.BufferGeometry();
    const points = [];
    for (let j = 0; j <= resolution; j++) {
      const x = (i * step) - (size / 2);
      const z = (j * step) - (size / 2);
      points.push(new THREE.Vector3(x, heightMap[i][j], z));
    }
    geometry.setFromPoints(points);
    group.add(new THREE.Line(geometry, material));
  }

  for (let j = 0; j <= resolution; j++) {
    const geometry = new THREE.BufferGeometry();
    const points = [];
    for (let i = 0; i <= resolution; i++) {
      const x = (i * step) - (size / 2);
      const z = (j * step) - (size / 2);
      points.push(new THREE.Vector3(x, heightMap[i][j], z));
    }
    geometry.setFromPoints(points);
    group.add(new THREE.Line(geometry, material));
  }

  return group;
}

let time = 0;
function animate() {
  requestAnimationFrame(animate);
  time += 0.0013;

  // Clear
  mainGroup.clear();

  // Purple horizontal field
  const purpleSources = createWaveSources(time, 2.5);
  const purpleField = createInterferenceField(purpleMaterial, purpleSources, size, resolution, time);
  mainGroup.add(purpleField);

  // Gold vertical, tilted field
  const goldSources = createWaveSources(time + 0.5, 2.0);
  const goldField = createInterferenceField(goldMaterial, goldSources, size, resolution, time + 0.5);
  goldField.rotation.set(THREE.MathUtils.degToRad(20), 0, 0);
  mainGroup.add(goldField);

  // Slight rotation for interaction
  mainGroup.rotation.y = Math.sin(time * 0.3) * 0.2;
  mainGroup.rotation.x = Math.cos(time * 0.2) * 0.1;

  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  const width = container.clientWidth;
  const height = container.clientHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});