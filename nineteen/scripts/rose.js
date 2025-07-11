// Assume you have <div id="rose-vis"></div> in your HTML

const width = 400;
const height = 400;
const centerX = width / 2;
const centerY = height / 2;
const outerRadius = 220;

const svg = d3.select("#rose-vis")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .style("background", "none");

const allElements = [];
let animationTime = 0;

// Base color scales
const gold = d3.rgb("#996e10");
const pink = d3.rgb("rgb(249, 198, 206)");

// Dynamic color scale
function getColorScale(factor) {
  return d3.scaleLinear()
    .domain([0, outerRadius])
    .range([
      gold.brighter(factor),
      pink.darker(factor * 0.5)
    ]);
}

// Parameters
const numCircles = 40;
const numRays = 32;
const numPetalLayers = 10;
const petalsPerLayer = 20;

// Create group for all content
const contentGroup = svg.append("g")
  .attr("transform", `translate(${centerX},${centerY})`);

// Store radii for pulsing
const baseRadii = [];

// Draw concentric circles
function drawCircles(colorScale) {
  for (let i = 1; i <= numCircles; i++) {
    const r = (i / numCircles) * outerRadius;
    baseRadii.push(r);
    const circle = contentGroup.append("circle")
      .attr("r", r)
      .attr("fill", "none")
      .attr("stroke", colorScale(r))
      .attr("stroke-width", 0.5 + (i < numCircles * 0.4 ? 0.8 : 0.3))
      .attr("opacity", 0.5 + 0.5 * (1 - i / numCircles));
    allElements.push({ el: circle, radius: r, type: 'circle' });
  }
}

// Draw radiating star lines
function drawStarLines(colorScale) {
  for (let i = 0; i < numRays; i++) {
    const angle = (i / numRays) * 2 * Math.PI;
    const x2 = Math.cos(angle) * outerRadius;
    const y2 = Math.sin(angle) * outerRadius;
    const line = contentGroup.append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", x2)
      .attr("y2", y2)
      .attr("stroke", colorScale(0))
      .attr("stroke-width", 0.8)
      .attr("opacity", 0.5);
    allElements.push({ el: line, radius: 0, type: 'line', angle });
  }
}

// Draw petals
function drawPetals(colorScale) {
  for (let layer = 1; layer <= numPetalLayers; layer++) {
    const rInner = (layer - 1) / numPetalLayers * outerRadius;
    const rOuter = layer / numPetalLayers * outerRadius;
    const petals = petalsPerLayer + Math.floor(Math.random() * 5 - 2);

    for (let p = 0; p < petals; p++) {
      const angle = (p / petals) * 2 * Math.PI + (Math.random() - 0.5) * 0.1;
      const arc = d3.arc()
        .innerRadius(rInner)
        .outerRadius(rOuter)
        .startAngle(angle - 0.03)
        .endAngle(angle + 0.03);

      const path = contentGroup.append("path")
        .attr("d", arc())
        .attr("fill", "none")
        .attr("stroke", colorScale((rInner + rOuter) / 2))
        .attr("stroke-width", 0.5)
        .attr("opacity", 0.6);

      allElements.push({ el: path, rInner, rOuter, angle });
    }
  }
}

// Draw center star
function drawCenterStar() {
  for (let i = 0; i < 24; i++) {
    const angle = (i / 24) * 2 * Math.PI;
    const length = 20 + 10 * Math.sin(i * 0.5);
    const line = contentGroup.append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", Math.cos(angle) * length)
      .attr("y2", Math.sin(angle) * length)
      .attr("stroke", "#996e10")
      .attr("stroke-width", 1)
      .attr("opacity", 0.8);
    allElements.push({ el: line, radius: 0, type: 'line', angle });
  }
}

// Initial draw
let colorFactor = 0;
drawCircles(getColorScale(colorFactor));
drawStarLines(getColorScale(colorFactor));
drawPetals(getColorScale(colorFactor));
drawCenterStar();

// Animation loop
function animate() {
  animationTime += 0.01;

  // Color breathing
  colorFactor = 0.2 + 0.1 * Math.sin(animationTime * 0.5);
  const dynamicColorScale = getColorScale(colorFactor);

  // Radius pulsing factor
  const pulseFactor = 1 + 0.02 * Math.sin(animationTime * 1.2);

  allElements.forEach((d, i) => {
    if (d.type === 'circle') {
      const newR = baseRadii[i] * pulseFactor;
      d.el
        .attr("r", newR)
        .attr("stroke", dynamicColorScale(newR));
    } else if (d.type === 'line') {
      const newX = Math.cos(d.angle) * outerRadius * pulseFactor;
      const newY = Math.sin(d.angle) * outerRadius * pulseFactor;
      d.el
        .attr("x2", newX)
        .attr("y2", newY)
        .attr("stroke", dynamicColorScale(0));
    } else {
      // For petals
      const rInner = d.rInner * pulseFactor;
      const rOuter = d.rOuter * pulseFactor;
      const arc = d3.arc()
        .innerRadius(rInner)
        .outerRadius(rOuter)
        .startAngle(d.angle - 0.03)
        .endAngle(d.angle + 0.03);

      d.el
        .attr("d", arc())
        .attr("stroke", dynamicColorScale((rInner + rOuter) / 2));
    }
  });

  requestAnimationFrame(animate);
}

animate();
