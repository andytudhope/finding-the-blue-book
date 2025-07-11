const width = 400;
const height = 400;
const centerX = width / 2;
const centerY = height / 2;
const birdCount = 9;
const spacingX = 35;  // Increased to spread more horizontally
const spacingY = 35;  // Increased to spread more vertically
const darkBlue = "#1b2b4f";

// Create SVG
const svg = d3.select("#mercy-vis")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .style("background", "none");

// Birds in a V formation: leader at bottom center, wings spread upwards
const birds = [];
birds.push({ x: centerX, y: centerY + 80 }); // Leader lower
for (let i = 1; i <= (birdCount - 1) / 2; i++) {
  birds.push({ x: centerX - i * spacingX, y: centerY + 80 - i * spacingY });
  birds.push({ x: centerX + i * spacingX, y: centerY + 80 - i * spacingY });
}

// Function to generate an 'm'-like path for a bird with two wing humps
function birdPath(x, y, spread, curveAmount) {
  const wingSpan = spread;
  const curve = curveAmount;
  return `M ${x - wingSpan} ${y} 
          Q ${x - wingSpan * 0.5} ${y - curve} ${x} ${y} 
          Q ${x + wingSpan * 0.5} ${y - curve} ${x + wingSpan} ${y}`;
}

// Draw birds
const birdPaths = svg.selectAll("path")
  .data(birds)
  .enter()
  .append("path")
  .attr("d", d => birdPath(d.x, d.y, 22, 16))  // wider wings, deeper curve
  .attr("stroke", darkBlue)
  .attr("stroke-width", 1.8)
  .attr("fill", "none")
  .attr("opacity", 0.85);

// Animate flapping by modulating the curve amount
function animateFlap() {
  const time = Date.now() / 800;
  birdPaths.attr("d", d => {
    const flap = Math.sin(time + (d.x - centerX) * 0.05) * 3;
    return birdPath(d.x, d.y, 22, 16 + flap);
  });
  requestAnimationFrame(animateFlap);
}

animateFlap();