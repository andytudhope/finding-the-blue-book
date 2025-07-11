const width = 400;
const height = 400;

const svg = d3.select("#fluid-vis")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .style("background", "#faf0cf"); 

// Add circular "telescope" mask
svg.append("circle")
  .attr("cx", width / 2)
  .attr("cy", height / 2)
  .attr("r", width / 2)
  .attr("fill", "black");

const rippleGroup = svg.append("g")
  .attr("clip-path", "url(#clip)");

svg.append("clipPath")
  .attr("id", "clip")
  .append("circle")
  .attr("cx", width / 2)
  .attr("cy", height / 2)
  .attr("r", width / 2);

let ripples = [];
let lastSpawn = Date.now();

function spawnRipple() {
  ripples.push({
    x: width / 2 + (Math.random() - 0.5) * width * 0.8,
    y: height / 2 + (Math.random() - 0.5) * height * 0.8,
    r: 0
  });
}

function animate() {
  const now = Date.now();

  if (now - lastSpawn > 800 + Math.random() * 1200) {
    spawnRipple();
    lastSpawn = now;
  }

  ripples.forEach(r => r.r += 1.5);
  ripples = ripples.filter(r => r.r < 100);

  const circles = rippleGroup.selectAll("circle").data(ripples, d => d);

  circles.join("circle")
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
    .attr("r", d => d.r)
    .attr("fill", "none")
    .attr("stroke", d => {
      const fade = 1 - d.r / 100;
      const gray = Math.floor(255 * fade);
      return `rgb(${gray},${gray},${gray})`;
    })
    .attr("stroke-width", 2)
    .attr("stroke-opacity", d => 1 - d.r / 100);

  requestAnimationFrame(animate);
}

animate();
