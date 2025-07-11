const width = 600;
const height = 400;

const svg = d3.select("#heaven-vis")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .style("background", "none");

const numLines = 20;
const lines = [];
const spatialFrequencies = [];
const baseAmplitudes = [];
const modulationFrequencies = [];
const colors = [];

// Initialize lines with individual properties
for (let i = 0; i < numLines; i++) {
  lines.push(svg.append("path")
    .attr("fill", "none")
    .attr("stroke-width", 1.2)
    .attr("opacity", 0.85));

  // Random spatial frequency (nodes) per line
  spatialFrequencies.push(0.8 + Math.random() * 1.2);

  // Random base amplitude
  baseAmplitudes.push(10 + Math.random() * 20);

  // Random modulation frequency for vibration speed
  modulationFrequencies.push(0.5 + Math.random() * 1.5);

  // Alternate color between deep blue and gold
  colors.push(i % 2 === 0 ? "#0d1b4c" : "#996e10");
}

function updateLines(time) {
  lines.forEach((line, i) => {
    const yBase = (i + 0.5) * (height / numLines);
    const k = spatialFrequencies[i];
    const baseAmp = baseAmplitudes[i];
    const modFreq = modulationFrequencies[i];

    const points = [];
    const modAmplitude = baseAmp * Math.sin(time * 0.002 * modFreq);

    for (let x = 0; x <= width; x += 5) {
      const yOffset = Math.sin((x / 50) * k) * modAmplitude;
      points.push([x, yBase + yOffset]);
    }

    const lineGen = d3.line()
      .curve(d3.curveBasis);
    line
      .attr("d", lineGen(points))
      .attr("stroke", colors[i]);
  });
}

let time = 0;
function animate() {
  time += 1;
  updateLines(time);
  requestAnimationFrame(animate);
}
animate();