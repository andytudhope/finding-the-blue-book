const width = 400;
const height = 400;
const resolution = 2;

const green = "#003300";
const purple = "#800080";
const pink = "#ff69b4";

const canvas = d3.select("#garden-vis")
  .append("canvas")
  .attr("width", width)
  .attr("height", height)
  .node();

const ctx = canvas.getContext("2d");

// Wave sources
const gridSize = 4;
const sources = [];
for (let i = 0; i < gridSize; i++) {
  for (let j = 0; j < gridSize; j++) {
    sources.push({
      x: width * (i + 0.5) / gridSize,
      y: height * (j + 0.5) / gridSize,
      wavelength: 15 + Math.random() * 10,
      phase: Math.random() * Math.PI * 2
    });
  }
}

let time = 0;

// Assign random color pattern for contour levels
const contourColors = [-0.6, -0.3, 0, 0.3, 0.6].map(level => {
  if (Math.random() < 0.75) return green;   // 75% green dominant
  return Math.random() < 0.5 ? purple : pink;  // 25% split purple/pink
});

function animate() {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "rgba(0,0,0,0)";
  ctx.fillRect(0, 0, width, height);

  const rows = Math.floor(height / resolution);
  const cols = Math.floor(width / resolution);
  const field = new Array(rows).fill(0).map(() => new Array(cols).fill(0));

  // Compute field amplitudes
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const x = j * resolution;
      const y = i * resolution;
      let amplitude = 0;
      sources.forEach(source => {
        const dx = x - source.x;
        const dy = y - source.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        amplitude += Math.sin((distance / source.wavelength - time) * 2 * Math.PI + source.phase);
      });
      field[i][j] = amplitude / sources.length;
    }
  }

  // Draw marching squares contours in green
  [-0.6, -0.3, 0, 0.3, 0.6].forEach(level => {
    ctx.beginPath();
    ctx.strokeStyle = green;
    ctx.lineWidth = 0.5;

    for (let i = 0; i < rows - 1; i++) {
      for (let j = 0; j < cols - 1; j++) {
        const x = j * resolution;
        const y = i * resolution;

        const case4 = 
          (field[i][j] > level ? 8 : 0) +
          (field[i][j + 1] > level ? 4 : 0) +
          (field[i + 1][j + 1] > level ? 2 : 0) +
          (field[i + 1][j] > level ? 1 : 0);

        switch (case4) {
          case 1: case 14:
            ctx.moveTo(x, y + resolution / 2);
            ctx.lineTo(x + resolution / 2, y + resolution);
            break;
          case 2: case 13:
            ctx.moveTo(x + resolution / 2, y + resolution);
            ctx.lineTo(x + resolution, y + resolution / 2);
            break;
          case 3: case 12:
            ctx.moveTo(x, y + resolution / 2);
            ctx.lineTo(x + resolution, y + resolution / 2);
            break;
          case 4: case 11:
            ctx.moveTo(x + resolution, y + resolution / 2);
            ctx.lineTo(x + resolution / 2, y);
            break;
          case 5: case 10:
            ctx.moveTo(x, y + resolution / 2);
            ctx.lineTo(x + resolution / 2, y);
            ctx.moveTo(x + resolution, y + resolution / 2);
            ctx.lineTo(x + resolution / 2, y + resolution);
            break;
          case 6: case 9:
            ctx.moveTo(x + resolution / 2, y);
            ctx.lineTo(x + resolution / 2, y + resolution);
            break;
          case 7: case 8:
            ctx.moveTo(x, y + resolution / 2);
            ctx.lineTo(x + resolution / 2, y);
            break;
        }
      }
    }
    ctx.stroke();
  });

  // Overlay pink and purple circles for pockets
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const x = j * resolution;
      const y = i * resolution;
      const val = field[i][j];

      // Determine circle properties based on amplitude
      if (val > 0.5 && val < 0.8) {
        const size = 2 + 4 * (val - 0.5);
        ctx.beginPath();
        ctx.fillStyle = pink;
        ctx.globalAlpha = 0.5 * (0.8 - val) / 0.3;
        ctx.arc(x, y, size, 0, 2 * Math.PI);
        ctx.fill();
      } else if (val < -0.5 && val > -0.8) {
        const size = 2 + 4 * (-val - 0.5);
        ctx.beginPath();
        ctx.fillStyle = purple;
        ctx.globalAlpha = 0.5 * (0.8 + val) / 0.3;
        ctx.arc(x, y, size, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  }

  ctx.globalAlpha = 1.0;
  time += 0.003;
  requestAnimationFrame(animate);
}

animate();