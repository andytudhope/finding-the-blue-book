const width = 400;
const height = 400;

const svg = d3.select("#home-vis")
  .append("svg")
  .attr("width", width)
  .attr("height", height)

const centerX = width / 2;
const centerY = height / 2;
const path = svg.append("path")
  .attr("fill", "black")
  .attr("opacity", 0.9);

// Helper: generate shape path for given openness
function generatePath(openness) {
  const maxSpread = openness * (width / 2 - 20);
  const controlSpread = maxSpread * 0.6;

  const top = 50;
  const bottom = height - 50;

  return `
    M${centerX},${top}
    C${centerX - controlSpread},${centerY} ${centerX - controlSpread},${centerY} ${centerX},${bottom}
    C${centerX + controlSpread},${centerY} ${centerX + controlSpread},${centerY} ${centerX},${top}
    Z
  `;
}

// Initial state: closed line
let currentOpenness = 0.0;
path.attr("d", generatePath(currentOpenness));

function animate() {
  // Random target openness each time
  const targetOpenness = 0.05 + Math.random() * 0.95;
  const duration = 2000 + Math.random() * 2000;

  path.transition()
    .duration(duration)
    .attrTween("d", () => {
      const i = d3.interpolate(currentOpenness, targetOpenness);
      return t => generatePath(i(t));
    })
    .on("end", () => {
      currentOpenness = targetOpenness;
      animate();
    });
}

animate();
