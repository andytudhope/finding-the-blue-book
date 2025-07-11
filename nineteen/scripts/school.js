const width = 400;
const height = 400;
const centerX = width / 2;
const centerY = height / 2;
const numFieldLines = 16;
const numDotsPerLine = 5;

const svg = d3.select("#school-vis")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

//  Generate field lines (curved paths converging on center with empty space)
function generateFieldLine(angleOffset) {
  const points = [];
  const segments = 30;
  const minRadius = 30; // central gap
  const maxRadius = Math.min(width, height) * 0.45;

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const radius = minRadius + (maxRadius - minRadius) * t;
    const angle = angleOffset + 0.4 * Math.sin(t * Math.PI);
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    points.push([x, y]);
  }
  return points;
}

// Create all field lines
const fieldLines = d3.range(numFieldLines).map(i => {
  const baseAngle = (i / numFieldLines) * 2 * Math.PI;
  return generateFieldLine(baseAngle);
});

// Draw field lines
svg.selectAll("path.field")
  .data(fieldLines)
  .enter()
  .append("path")
  .attr("d", d => d3.line().curve(d3.curveBasis)(d))
  .attr("fill", "none")
  .attr("stroke", "black")
  .attr("stroke-opacity", 0.2)
  .attr("stroke-width", 0.5);

// Dots starting at edge moving *inward* to center
const dots = [];
fieldLines.forEach((line, i) => {
  for (let j = 0; j < numDotsPerLine; j++) {
    dots.push({
      lineIndex: i,
      pos: Math.random() // starts anywhere on the line
    });
  }
});

const dotSel = svg.selectAll("circle.dot")
  .data(dots)
  .enter()
  .append("circle")
  .attr("r", 1.5)
  .attr("fill", "black")
  .attr("opacity", 0.8);

// Animation
d3.timer(() => {
  dots.forEach(d => {
    d.pos -= 0.001;  // move inward
    if (d.pos < 0) d.pos = 1;  // reset to edge
  });

  dotSel
    .attr("cx", d => {
      const line = fieldLines[d.lineIndex];
      const idx = Math.floor(d.pos * (line.length - 1));
      return line[idx][0];
    })
    .attr("cy", d => {
      const line = fieldLines[d.lineIndex];
      const idx = Math.floor(d.pos * (line.length - 1));
      return line[idx][1];
    })
    .attr("opacity", d => Math.min(1, d.pos * 2));  // fade out at center
});