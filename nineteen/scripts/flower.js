const width = 400;
const height = 400;
const numPetals = 10;

const svg = d3.select("#flower-vis")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

// Generate smoother, more rounded petal shapes
function createPetalShape() {
  const points = [];
  const petalWidth = 8 + Math.random() * 8;
  const petalLength = 20 + Math.random() * 20;
  const control = petalLength * 0.5;

  // Bezier-like approximation with more midpoints
  points.push([0, 0]);
  points.push([petalWidth * 0.5, -control * 0.3]);
  points.push([petalWidth * 0.4, -control * 0.7]);
  points.push([0, -petalLength]);
  points.push([-petalWidth * 0.4, -control * 0.7]);
  points.push([-petalWidth * 0.5, -control * 0.3]);
  points.push([0, 0]);

  return points;
}

// Each petal has shape, position, velocity
const petals = d3.range(numPetals).map(() => ({
  shape: createPetalShape(),
  x: -50 - Math.random() * 200,
  y: Math.random() * height,
  speedX: 0.4 + Math.random() * 0.3,
  speedY: -0.05 + Math.random() * 0.1,
  rotation: Math.random() * 2 * Math.PI,
  rotationSpeed: -0.005 + Math.random() * 0.01
}));

const paths = svg.selectAll("path")
  .data(petals)
  .enter()
  .append("path")
  .attr("fill", "none")
  .attr("stroke", "black")
  .attr("stroke-width", 0.5)
  .attr("stroke-opacity", 0.6);

d3.timer(() => {
  petals.forEach(p => {
    p.x += p.speedX;
    p.y += p.speedY;
    p.rotation += p.rotationSpeed;

    if (p.x > width + 50) {
      p.x = -50;
      p.y = Math.random() * height;
      p.shape = createPetalShape();
    }
  });

  paths
    .attr("d", d => {
      const rotated = d.shape.map(([x, y]) => {
        const cos = Math.cos(d.rotation);
        const sin = Math.sin(d.rotation);
        return [
          x * cos - y * sin + d.x,
          x * sin + y * cos + d.y
        ];
      });
      return d3.line().curve(d3.curveBasisClosed)(rotated);
    });
});