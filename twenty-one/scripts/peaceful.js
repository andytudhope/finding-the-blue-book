// Peaceful — sal-lah-mim. All possibility, laid out in the timeless: endless
// circles, each overlaid on the other, infinite permutations of One pen.
(function () {
  const container = document.getElementById("11-peaceful-vis");
  if (!container) return;

  const INK = "#3b2a5e", GOLD = "#9c6f12", GOLD_LT = "#caa03f";
  const DPR = Math.min(2, window.devicePixelRatio || 1);

  const canvas = document.createElement("canvas");
  container.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  let W, H, C;

  function resize() {
    const size = Math.min(400, container.clientWidth || 400);
    W = size; H = size; C = size / 2;
    canvas.width = W * DPR; canvas.height = H * DPR;
    canvas.style.width = W + "px"; canvas.style.height = H + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  resize();
  window.addEventListener("resize", resize);

  // a seeded logogram — a circular sentence in the One pen's hand
  function makeLogogram(seed) {
    const rnd = (n) => {
      const v = Math.sin(seed * 99.7 + n * 12.9898) * 43758.5453;
      return v - Math.floor(v);
    };
    const blooms = [];
    const count = 5 + Math.floor(rnd(0) * 6);
    for (let i = 0; i < count; i++) {
      blooms.push({
        a: rnd(i + 1) * Math.PI * 2,
        spread: 0.15 + rnd(i + 50) * 0.5,
        out: 0.06 + rnd(i + 80) * 0.16,    // flourish reaching outward
        thick: 0.6 + rnd(i + 120) * 1.8,
      });
    }
    return { seed, blooms, rot: rnd(7) * Math.PI * 2,
             R: 0.5 + rnd(9) * 0.42, born: 0, life: 0 };
  }

  function drawLogogram(lg, alpha) {
    const R = C * 0.82 * lg.R;
    ctx.save();
    ctx.translate(C, C); ctx.rotate(lg.rot);
    // the main ring — gestural, breathing, of slightly uneven ink
    ctx.beginPath();
    for (let a = 0; a <= Math.PI * 2 + 0.05; a += 0.04) {
      const wob = Math.sin(a * 5 + lg.seed) * 1.4 + Math.sin(a * 11) * 0.8;
      const r = R + wob;
      const x = Math.cos(a) * r, y = Math.sin(a) * r;
      if (a === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = INK; ctx.globalAlpha = alpha * 0.75; ctx.lineWidth = 1.6;
    ctx.lineJoin = "round"; ctx.stroke();

    // the semagrams — ink flourishes blooming off the ring, each a meaning
    lg.blooms.forEach((b) => {
      ctx.beginPath();
      for (let s = -b.spread; s <= b.spread; s += 0.05) {
        const a = b.a + s;
        const reach = Math.cos((s / b.spread) * Math.PI / 2);
        const r = R + reach * R * b.out;
        ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      }
      ctx.strokeStyle = INK; ctx.globalAlpha = alpha * 0.6;
      ctx.lineWidth = b.thick; ctx.lineCap = "round"; ctx.stroke();
      // a small inward serif — the strange loop closing on itself
      const ix = Math.cos(b.a) * (R - R * b.out * 0.6);
      const iy = Math.sin(b.a) * (R - R * b.out * 0.6);
      ctx.beginPath();
      ctx.arc(ix, iy, b.thick * 0.8, 0, Math.PI * 2);
      ctx.fillStyle = GOLD; ctx.globalAlpha = alpha * 0.5; ctx.fill();
    });
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  // a stack of overlaid logograms — permutations fading through one another
  const stack = [];
  for (let i = 0; i < 4; i++) {
    const lg = makeLogogram(Math.random() * 1000);
    lg.life = 0.3 + i * 0.2; stack.push(lg);
  }
  function addLogogram() {
    const lg = makeLogogram(Math.random() * 1000);
    stack.push(lg);
    if (stack.length > 6) stack.shift();
  }
  canvas.addEventListener("mousedown", (e) => { e.preventDefault(); addLogogram(); });
  canvas.addEventListener("touchstart", (e) => { e.preventDefault(); addLogogram(); }, { passive: false });

  // the One pen — a golden nib resting at, or led by, the cursor
  const nib = { x: C, y: C, set: false };
  canvas.addEventListener("mousemove", (e) => {
    const r = canvas.getBoundingClientRect();
    nib.x = e.clientX - r.left; nib.y = e.clientY - r.top; nib.set = true;
  });
  canvas.addEventListener("mouseleave", () => (nib.set = false));

  let time = 0, sinceNew = 0;
  function frame() {
    ctx.clearRect(0, 0, W, H);
    time += 0.01; sinceNew++;

    // the timeless writes a new circle now and then, of its own accord
    if (sinceNew > 360) { addLogogram(); sinceNew = 0; }

    stack.forEach((lg, i) => {
      lg.life = Math.min(1, lg.life + 0.004);
      lg.rot += 0.0006 * (i % 2 ? 1 : -1);     // permutations slowly turning
      const breathe = 0.55 + 0.45 * Math.sin(time * 0.5 + i);
      drawLogogram(lg, lg.life * (0.4 + breathe * 0.5));
    });

    // the still gold heart — One, beneath all permutations
    ctx.beginPath();
    ctx.arc(C, C, 3.5 + Math.sin(time) * 1, 0, Math.PI * 2);
    ctx.fillStyle = GOLD_LT; ctx.globalAlpha = 0.9; ctx.fill();
    ctx.globalAlpha = 1;

    // the pen's nib and the fresh ink it draws toward
    if (nib.set) {
      const ang = Math.atan2(nib.y - C, nib.x - C);
      ctx.beginPath();
      ctx.arc(C, C, Math.hypot(nib.x - C, nib.y - C), ang - 0.5, ang + 0.5);
      ctx.strokeStyle = GOLD; ctx.globalAlpha = 0.4; ctx.lineWidth = 1.4;
      ctx.stroke(); ctx.globalAlpha = 1;
      ctx.beginPath(); ctx.arc(nib.x, nib.y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = GOLD_LT; ctx.fill();
    }

    requestAnimationFrame(frame);
  }
  frame();
})();
