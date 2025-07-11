const width = 400;
const height = 400;
const numParticles = 200;
const centerX = width / 2;
const centerY = height / 2;

const svg = d3.select("#gather-vis")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

// Particles with fixed *spiral* coordinates
const particles = d3.range(numParticles).map((d, i) => {
  const baseAngle = i * 0.2 + Math.random() * 0.2;
  const baseRadius = 30 + i * 0.7 + Math.random() * 10;
  return {
    baseAngle,
    baseRadius,
    angle: baseAngle,
    radius: baseRadius,
    x: centerX + baseRadius * Math.cos(baseAngle),
    y: centerY + baseRadius * Math.sin(baseAngle)
  };
});

const lines = svg.selectAll("line")
  .data(d3.cross(d3.range(numParticles), d3.range(numParticles))
    .filter(([i, j]) => i < j))
  .enter()
  .append("line")
  .attr("stroke", "black")
  .attr("stroke-opacity", 0.05)
  .attr("stroke-width", 0.5);

const circles = svg.selectAll("circle")
  .data(particles)
  .enter()
  .append("circle")
  .attr("r", 1.5)
  .attr("fill", "black")
  .attr("opacity", 0.7);

let time = 0;
d3.timer(() => {
  time += 0.003;

  // Heartbeat scaling factor (smooth, rhythmic)
  const heartbeat = 1 + 0.2 * Math.sin(time * 2 * Math.PI * 0.5);

  particles.forEach(p => {
    // Maintain spiral structure but scale radius
    p.angle = p.baseAngle + time * 0.2;
    p.radius = p.baseRadius * heartbeat;
    p.x = centerX + p.radius * Math.cos(p.angle);
    p.y = centerY + p.radius * Math.sin(p.angle);
  });

  lines
    .attr("x1", d => particles[d[0]].x)
    .attr("y1", d => particles[d[0]].y)
    .attr("x2", d => particles[d[1]].x)
    .attr("y2", d => particles[d[1]].y)
    .attr("stroke-opacity", d => {
      const dx = particles[d[0]].x - particles[d[1]].x;
      const dy = particles[d[0]].y - particles[d[1]].y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      return dist < 30 ? 0.05 : 0;
    });

  circles
    .attr("cx", d => d.x)
    .attr("cy", d => d.y);
});
