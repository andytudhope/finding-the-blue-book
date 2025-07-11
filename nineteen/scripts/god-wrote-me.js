const container = document.getElementById("god-writing-vis");
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

// PARAMETERS
const NUM_LINES = 250;
const POINTS_PER_LINE = 80;
const SPEED = 0.5;
const LINE_ALPHA = 0.35;
const FIELD_SCALE = 0.008;
const TIME_SCALE = 0.00015;

// Simple noise-like function
function pseudoNoise(x, y, t) {
  return Math.sin(x * 7 + t * 3) * 0.5 + Math.sin(y * 8 + t * 4) * 0.5;
}

// Vector field: returns 2D direction vector
function vectorField(x, y, time) {
  const nx = x * FIELD_SCALE;
  const ny = y * FIELD_SCALE;
  const n = pseudoNoise(nx, ny, time * TIME_SCALE);

  const angle = n * Math.PI * 4 + Math.atan2(y, x);
  return {
    x: Math.cos(angle),
    y: Math.sin(angle)
  };
}

// Line class
class FieldLine {
  constructor() {
    this.reset();
    this.geometry = new THREE.BufferGeometry();
    this.positions = new Float32Array(POINTS_PER_LINE * 3);
    this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    this.material = new THREE.LineBasicMaterial({
      color: 0x222222,
      transparent: true,
      opacity: LINE_ALPHA,
      linewidth: 0.5
    });
    this.line = new THREE.Line(this.geometry, this.material);
    scene.add(this.line);
  }

  reset() {
    const angle = Math.random() * Math.PI * 2;
    const distance = 50 + Math.random() * 150;
    this.head = {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance
    };
    this.points = [];
    for (let i = 0; i < POINTS_PER_LINE; i++) {
      this.points.push({ x: this.head.x, y: this.head.y });
    }
    this.age = 0;
    this.lifespan = 400 + Math.random() * 600;
  }

  update(time) {
    this.age += 1;
    if (this.age >= this.lifespan) {
      this.reset();
    }

    const vec = vectorField(this.head.x, this.head.y, time);
    this.head.x += vec.x * SPEED;
    this.head.y += vec.y * SPEED;

    this.points.push({ x: this.head.x, y: this.head.y });
    if (this.points.length > POINTS_PER_LINE) {
      this.points.shift();
    }

    // If out of bounds, reset
    if (
      Math.abs(this.head.x) > width / 2 + 20 ||
      Math.abs(this.head.y) > height / 2 + 20
    ) {
      this.reset();
    }
  }

  draw() {
    for (let i = 0; i < this.points.length; i++) {
      this.positions[i * 3] = this.points[i].x;
      this.positions[i * 3 + 1] = this.points[i].y;
      this.positions[i * 3 + 2] = 0;
    }
    this.geometry.attributes.position.needsUpdate = true;
  }
}

// Create lines
const lines = [];
for (let i = 0; i < NUM_LINES; i++) {
  lines.push(new FieldLine());
}

// Animation loop
let time = 0;
function animate() {
  requestAnimationFrame(animate);
  time += 1;

  lines.forEach(line => {
    line.update(time);
    line.draw();
  });

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