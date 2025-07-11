const width = 400;
const height = 400;
const centerX = width / 2;
const centerY = height / 2;
const numRings = 12;
const baseRadius = 50;
const ctx = d3.select("#abode-vis")
  .append("canvas")
  .attr("width", width)
  .attr("height", height)
  .node()
  .getContext("2d");

// Rich dark blues
const blues = [
  '#1b2b4f', '#1a2d57', '#192e5f', '#1c3167',
  '#1d346f', '#1f3877', '#203b7f', '#223f87',
  '#24428f', '#264697', '#273e85', '#253b79'
];

// Define gap angles
const gapCenterAngle = -Math.PI / 4;
const gapWidths = Array.from({length: numRings}, () => 0.3 + Math.random() * 0.4);

// Store ring configurations
const rings = [];
for (let i = 0; i < numRings; i++) {
  rings.push({
    radius: baseRadius + i * 6,
    gapWidth: gapWidths[i],
    color: blues[i % blues.length]
  });
}

// Jitter phase
let time = 0;

// Draw function
function animate() {
  ctx.clearRect(0, 0, width, height);
  ctx.lineWidth = 1.2;
  ctx.lineCap = 'round';

  rings.forEach((ring, idx) => {
    ctx.beginPath();
    ctx.strokeStyle = ring.color;
    ctx.globalAlpha = 0.7;

    const segments = 200;
    const jitterAmp = 1.2;
    const freq = 8;

    for (let s = 0; s <= segments; s++) {
      let angle = (s / segments) * 2 * Math.PI;

      // Skip gap region
      let delta = Math.abs((angle - gapCenterAngle + Math.PI * 2) % (Math.PI * 2) - Math.PI * 2);
      if (delta < ring.gapWidth) continue;

      // Organic radius with high-frequency noise
      let jitter = jitterAmp * Math.sin(freq * angle + time + idx);
      let r = ring.radius + jitter;

      let x = centerX + r * Math.cos(angle);
      let y = centerY + r * Math.sin(angle);

      if (s === 0 || delta < ring.gapWidth) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
  });

  ctx.globalAlpha = 1.0;
  time += 0.04;
  requestAnimationFrame(animate);
}

animate();