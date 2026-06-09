// Ground Below — small blue flowers blooming everywhere in the cut grass,
// the wind soft here; I am never alone. Eternal life, tiled across the field.
(function () {
  const container = document.getElementById("4-ground-below-vis");
  if (!container) return;

  const INK = "#3b2a5e", GOLD = "#9c6f12", BLUE = "#3a4a8c", BLUE_LT = "#6477c4";
  const DPR = Math.min(2, window.devicePixelRatio || 1);

  const canvas = document.createElement("canvas");
  container.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  let W, H, flowers = [];

  function build() {
    const size = Math.min(400, container.clientWidth || 400);
    W = size; H = size;
    canvas.width = W * DPR; canvas.height = H * DPR;
    canvas.style.width = W + "px"; canvas.style.height = H + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    // a triangular (Islamic) lattice — flowers everywhere
    flowers = [];
    const gap = size / 6;
    let row = 0;
    for (let y = gap * 0.5; y < H + gap; y += gap * 0.86, row++) {
      for (let x = (row % 2 ? gap : gap * 0.5); x < W + gap; x += gap) {
        flowers.push({
          x, y,
          petals: 5 + ((Math.random() * 3) | 0),
          r: gap * (0.22 + Math.random() * 0.12),
          phase: Math.random() * Math.PI * 2,
          spin: (Math.random() - 0.5) * 0.4,
        });
      }
    }
  }
  build();
  window.addEventListener("resize", build);

  const wind = { x: 0, tx: 0 };
  function track(e) {
    const r = canvas.getBoundingClientRect();
    const t = e.touches ? e.touches[0] : e;
    wind.tx = ((t.clientX - r.left) / W - 0.5) * 2;
  }
  canvas.addEventListener("mousemove", track);
  canvas.addEventListener("mouseleave", () => (wind.tx = 0));
  canvas.addEventListener("touchmove", track, { passive: true });

  let time = 0;
  function frame() {
    ctx.clearRect(0, 0, W, H);
    time += 0.012;
    wind.x += (wind.tx - wind.x) * 0.05;
    const sway = (wind.x === 0 ? Math.sin(time) * 0.25 : wind.x);

    flowers.forEach((f) => {
      // continuous blooming wave travelling across the field
      const bloom = 0.5 + 0.5 * Math.sin(time * 0.9 + f.phase + f.x * 0.01);
      const lean = sway * (0.18 + bloom * 0.12);
      const cx = f.x + lean * f.r * 2;
      const cy = f.y;
      const rot = time * f.spin + f.phase;

      // stem, bending in the wind
      ctx.beginPath();
      ctx.moveTo(f.x, f.y + f.r * 1.4);
      ctx.quadraticCurveTo(f.x + lean * f.r, f.y + f.r * 0.4, cx, cy);
      ctx.strokeStyle = INK; ctx.globalAlpha = 0.18; ctx.lineWidth = 1;
      ctx.stroke();

      // petals — a small rosette, blooming open
      const open = 0.25 + bloom * 0.75;
      for (let p = 0; p < f.petals; p++) {
        const a = rot + (p / f.petals) * Math.PI * 2;
        const px = cx + Math.cos(a) * f.r * open;
        const py = cy + Math.sin(a) * f.r * open;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.quadraticCurveTo(
          cx + Math.cos(a + 0.4) * f.r * 0.6 * open,
          cy + Math.sin(a + 0.4) * f.r * 0.6 * open,
          px, py
        );
        ctx.quadraticCurveTo(
          cx + Math.cos(a - 0.4) * f.r * 0.6 * open,
          cy + Math.sin(a - 0.4) * f.r * 0.6 * open,
          cx, cy
        );
        ctx.strokeStyle = bloom > 0.6 ? BLUE_LT : BLUE;
        ctx.globalAlpha = 0.3 + bloom * 0.4; ctx.lineWidth = 1;
        ctx.lineJoin = "round"; ctx.stroke();
      }
      // golden heart
      ctx.beginPath();
      ctx.arc(cx, cy, 1.2 + bloom * 1.6, 0, Math.PI * 2);
      ctx.fillStyle = GOLD; ctx.globalAlpha = 0.4 + bloom * 0.5; ctx.fill();
    });
    ctx.globalAlpha = 1;

    requestAnimationFrame(frame);
  }
  frame();
})();
