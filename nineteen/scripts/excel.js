const container = document.getElementById("excel-vis");
const width = container.clientWidth;
const height = container.clientHeight;

const scene = new THREE.Scene();
scene.background = null;  // transparent background

const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
camera.position.set(0, 0, 10);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(width, height);
container.appendChild(renderer.domElement);

// Wireframe sphere (stationary)
const sphereGeometry = new THREE.SphereGeometry(1.05, 32, 32); 
const sphereMaterial = new THREE.MeshBasicMaterial({
  color: 0x000000,
  wireframe: true,
  transparent: true,
  opacity: 0.5
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.y = -2.5;
scene.add(sphere);

// Choppy single horizontal field
const fieldSize = 8;
const resolution = 60;
const step = fieldSize / resolution;

const group = new THREE.Group();
scene.add(group);

const material = new THREE.LineBasicMaterial({
  color: 0x000000,
  transparent: true,
  opacity: 0.5
});

function createField(time) {
  const lines = new THREE.Group();

  for (let i = 0; i <= resolution; i++) {
    const geom = new THREE.BufferGeometry();
    const points = [];
    const x = (i * step) - (fieldSize / 2);

    for (let j = 0; j <= resolution; j++) {
      const z = (j * step) - (fieldSize / 2);
      const y = (
        Math.sin((x + time * 3) * 2.5) +
        Math.cos((z - time * 3) * 2.5) +
        Math.sin((x + z + time * 5) * 3.5)
      ) * 0.3;
      points.push(new THREE.Vector3(x, y, z));
    }
    geom.setFromPoints(points);
    const line = new THREE.Line(geom, material);
    lines.add(line);
  }

  for (let j = 0; j <= resolution; j++) {
    const geom = new THREE.BufferGeometry();
    const points = [];
    const z = (j * step) - (fieldSize / 2);

    for (let i = 0; i <= resolution; i++) {
      const x = (i * step) - (fieldSize / 2);
      const y = (
        Math.sin((x + time * 3) * 2.5) +
        Math.cos((z - time * 3) * 2.5) +
        Math.sin((x + z + time * 5) * 3.5)
      ) * 0.3;
      points.push(new THREE.Vector3(x, y, z));
    }
    geom.setFromPoints(points);
    const line = new THREE.Line(geom, material);
    lines.add(line);
  }

  return lines;
}

let time = 0;
function animate() {
  requestAnimationFrame(animate);
  time += 0.02;

  while (group.children.length) {
    group.remove(group.children[0]);
  }

  const newField = createField(time);
  group.add(newField);

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