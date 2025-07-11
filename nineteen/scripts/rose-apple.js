const width = 400;
const height = 400;

const svg = d3.select("#rose-apple-vis")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

// === Parameters ===
const trunkX = width / 2;
const trunkY = height - 20;
const branchLength = 80;
const branchAngleSpread = 60;
const levels = 6;        
const branchFactor = 3;  

// === Generate tree branches ===
function generateBranchPoints(x, y, angle, length, depth) {
  if (depth === 0) return [];
  const branches = [];
  for (let i = 0; i < branchFactor; i++) {
    const newAngle = angle - branchAngleSpread / 2 + i * (branchAngleSpread / (branchFactor - 1));
    const rad = newAngle * Math.PI / 180;
    const newX = x + length * Math.cos(rad);
    const newY = y - length * Math.sin(rad);
    branches.push({ x1: x, y1: y, x2: newX, y2: newY });
    branches.push(...generateBranchPoints(newX, newY, newAngle + (Math.random() - 0.5) * 5, length * 0.75, depth - 1));
  }
  return branches;
}

const allBranches = generateBranchPoints(trunkX, trunkY, 90, branchLength, levels);

// === Draw branches ===
svg.selectAll("line.branch")
  .data(allBranches)
  .enter()
  .append("line")
  .attr("class", "branch")
  .attr("x1", d => d.x1)
  .attr("y1", d => d.y1)
  .attr("x2", d => d.x2)
  .attr("y2", d => d.y2)
  .attr("stroke", "black")
  .attr("stroke-width", 1)
  .attr("stroke-opacity", 0.4);

// === Static blossoms in canopy ===
const canopyRadius = 160;
const canopyCenterX = width / 2;
const canopyCenterY = 280; 

// Distribute blossoms in a semi-circular arc (upper half only)
const canopyBlossoms = d3.range(120).map(() => {
  const angle = Math.PI * Math.random();  // 0 to PI
  const radius = 40 + Math.random() * (canopyRadius - 40);
  return {
    x: canopyCenterX + radius * Math.cos(angle),
    y: canopyCenterY - radius * Math.sin(angle) 
  };
});


svg.selectAll("circle.canopy")
  .data(canopyBlossoms)
  .enter()
  .append("circle")
  .attr("class", "canopy")
  .attr("r", 2.5)
  .attr("cx", d => d.x)
  .attr("cy", d => d.y)
  .attr("fill", "pink")
  .attr("opacity", 0.8);

// === Falling blossoms ===
const fallingCount = 30;
let falling = d3.range(fallingCount).map(() => ({
  x: canopyCenterX + (Math.random() - 0.5) * canopyRadius,
  y: canopyCenterY + (Math.random() - 0.5) * canopyRadius,
  speed: 0.4 + Math.random() * 0.4
}));

const carpet = [];

function draw() {
  svg.selectAll("circle.falling")
    .data(falling)
    .join("circle")
    .attr("class", "falling")
    .attr("r", 2.5)
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
    .attr("fill", "pink")
    .attr("opacity", 0.8);

  svg.selectAll("circle.carpet")
    .data(carpet)
    .join("circle")
    .attr("class", "carpet")
    .attr("r", 2.5)
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
    .attr("fill", "pink")
    .attr("opacity", 0.8);
}

function step() {
  falling.forEach(d => {
    d.y += d.speed;
    if (d.y > height - 10) {
      carpet.push({
        x: d.x + (Math.random() - 0.5) * 5,
        y: height - 10
      });
      d.x = canopyCenterX + (Math.random() - 0.5) * canopyRadius;
      d.y = canopyCenterY + (Math.random() - 0.5) * canopyRadius;
    }
  });
  draw();
  requestAnimationFrame(step);
}

draw();
requestAnimationFrame(step);
