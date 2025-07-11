const width = 400;
const height = 400;
const centerX = width / 2;
const centerY = height / 2;
const goldColor = "#996e10";

// Create SVG
const svg = d3.select("#feather-vis")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .style("background", "none");

// Much larger feather shape
let baseFeatherOutline = [
  [0, -140],
  [22, -120],
  [30, -85],
  [28, -45],
  [16, -5],
  [0, 40],
  [-16, -5],
  [-28, -45],
  [-30, -85],
  [-22, -120],
  [0, -140]
];

// Line generator with smoothing
const line = d3.line()
  .curve(d3.curveCatmullRom.alpha(0.5));

// Group for rotating the feather by 40 degrees
const featherGroup = svg.append("g")
  .attr("transform", `translate(${centerX}, ${centerY}) rotate(40)`);

// Draw quill (extends only beyond feather at bottom)
featherGroup.append("line")
  .attr("x1", 0)
  .attr("y1", -140)
  .attr("x2", 0)
  .attr("y2", 60)
  .attr("stroke", goldColor)
  .attr("stroke-width", 2)
  .attr("opacity", 0.8);

// Draw feather body
const featherPath = featherGroup.append("path")
  .datum(baseFeatherOutline)
  .attr("d", line)
  .attr("fill", goldColor)
  .attr("fill-opacity", 0.25)
  .attr("stroke", goldColor)
  .attr("stroke-width", 1.2)
  .attr("stroke-opacity", 0.8);

// Breeze animation to make edges wave
function wave() {
  const time = Date.now() / 800;
  const wavedOutline = baseFeatherOutline.map(([x, y], i) => {
    const waveAmount = Math.sin(time + i * 0.5) * 2;
    return [x + waveAmount, y];
  });
  featherPath
    .datum(wavedOutline)
    .attr("d", line);
  requestAnimationFrame(wave);
}

wave();