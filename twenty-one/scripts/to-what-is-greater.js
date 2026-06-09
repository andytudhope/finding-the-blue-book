// To What Is Greater — familiarity seeping into all my hard places; the leaves
// already singing, afternoon light painting the shape of a passing breeze.
// A soft, diffuse canopy; the sun wanders with you, and the leaves answer.
(function () {
  const container = document.getElementById("8-to-what-is-greater-vis");
  if (!container) return;

  const INK = "#3b2a5e", GOLD = "#9c6f12", GOLD_LT = "#e3c066";
  const LEAF = "#5d6b3a", LEAF_LT = "#8a9450";
  const DPR = Math.min(2, window.devicePixelRatio || 1);

  const canvas = document.createElement("canvas");
  container.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  let W, H;

  function resize() {
    const size = Math.min(400, container.clientWidth || 400);
    W = size; H = size;
    canvas.width = W * DPR; canvas.height = H * DPR;
    canvas.style.width = W + "px"; canvas.style.height = H + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    build();
  }

  // the sun — wanders with the pointer across the whole canvas; when left
  // alone it drifts gently of its own accord, low in an afternoon sky.
  const sun = { x: 0, y: 0, tx: 0, ty: 0, idle: true };
  function track(e) {
    const r = canvas.getBoundingClientRect();
    const t = e.touches ? e.touches[0] : e;
    sun.tx = t.clientX - r.left; sun.ty = t.clientY - r.top; sun.idle = false;
  }
  canvas.addEventListener("mousemove", track);
  canvas.addEventListener("mouseleave", () => (sun.idle = true));
  canvas.addEventListener("touchmove", track, { passive: true });

  // a soft canopy of leaves, in gentle depth layers
  let leaves = [];
  function build() {
    leaves = [];
    const count = Math.round((W * H) / 1500);
    for (let i = 0; i < count; i++) {
      const depth = Math.random();            // 0 far/soft, 1 near/crisp
      leaves.push({
        x: Math.random() * W,
        y: Math.random() * H,
        len: (10 + Math.random() * 20) * (0.6 + depth * 0.8),
        wid: 0.42 + Math.random() * 0.22,
        ang: Math.random() * Math.PI * 2,
        sway: Math.random() * Math.PI * 2,
        swaySpeed: 0.4 + Math.random() * 0.6,
        depth,
      });
    }
    leaves.sort((a, b) => a.depth - b.depth); // far leaves drawn first
  }
  resize();
  window.addEventListener("resize", resize);

  function leafPath(x, y, len, wid, ang) {
    const tx = x + Math.cos(ang) * len, ty = y + Math.sin(ang) * len;
    const px = Math.cos(ang + Math.PI / 2), py = Math.sin(ang + Math.PI / 2);
    const w = len * wid;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + px * w + (tx - x) * 0.4, y + py * w + (ty - y) * 0.4, tx, ty);
    ctx.quadraticCurveTo(x - px * w + (tx - x) * 0.4, y - py * w + (ty - y) * 0.4, x, y);
    ctx.closePath();
    return { tx, ty };
  }

  let time = 0;
  function frame() {
    ctx.clearRect(0, 0, W, H);
    time += 0.01;

    if (sun.idle) {
      sun.tx = W * (0.5 + 0.42 * Math.sin(time * 0.13));
      sun.ty = H * (0.4 + 0.18 * Math.sin(time * 0.09 + 1));
    }
    sun.x += (sun.tx - sun.x) * 0.06;
    sun.y += (sun.ty - sun.y) * 0.06;

    // afternoon light — a broad, soft, pulsing wash
    const pulse = 0.85 + 0.15 * Math.sin(time * 1.4);
    const glow = ctx.createRadialGradient(sun.x, sun.y, 4, sun.x, sun.y, W * 0.75);
    glow.addColorStop(0, `rgba(227,192,102,${0.34 * pulse})`);
    glow.addColorStop(0.4, `rgba(202,160,63,${0.12 * pulse})`);
    glow.addColorStop(1, "rgba(202,160,63,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    const breeze = Math.sin(time * 0.7);

    leaves.forEach((lf) => {
      lf.sway += 0.01 * lf.swaySpeed;
      // a gentle breeze, and a soft lean of the surface toward the light
      const dx = sun.x - lf.x, dy = sun.y - lf.y;
      const toSun = Math.atan2(dy, dx);
      const dist = Math.hypot(dx, dy);
      const near = Math.max(0, 1 - dist / (W * 0.55));
      const swayAmt = Math.sin(lf.sway) * 0.12 + breeze * 0.06;
      // turn a little to face the light, more so when it is close
      let ang = lf.ang + swayAmt;
      let da = toSun - ang;
      da = Math.atan2(Math.sin(da), Math.cos(da));
      ang += da * 0.18 * near;

      const soft = 0.4 + lf.depth * 0.6;
      const { tx, ty } = leafPath(lf.x, lf.y, lf.len, lf.wid, ang);

      // base leaf — soft green, more translucent in the far, hazy layers
      ctx.fillStyle = lf.depth > 0.55 ? LEAF_LT : LEAF;
      ctx.globalAlpha = (0.12 + lf.depth * 0.22) * soft;
      ctx.fill();

      // light catching the surface — a warm, pulsing sheen near the sun
      if (near > 0.04) {
        const lit = near * pulse;
        ctx.fillStyle = GOLD_LT;
        ctx.globalAlpha = lit * 0.5 * soft;
        ctx.fill();
        // a small glint riding the leaf's surface
        if (lit > 0.35) {
          const gx = lf.x + (tx - lf.x) * 0.55;
          const gy = lf.y + (ty - lf.y) * 0.55;
          ctx.beginPath();
          ctx.arc(gx, gy, 0.8 + lit * 1.6, 0, Math.PI * 2);
          ctx.fillStyle = "#fff3d4";
          ctx.globalAlpha = (lit - 0.35) * 0.8;
          ctx.fill();
        }
      }

      // the midrib — a fine vein, the leaf's quiet structure
      ctx.beginPath();
      ctx.moveTo(lf.x, lf.y); ctx.lineTo(tx, ty);
      ctx.strokeStyle = near > 0.3 ? GOLD : INK;
      ctx.globalAlpha = (0.1 + near * 0.25) * soft;
      ctx.lineWidth = 0.7;
      ctx.stroke();
    });
    ctx.globalAlpha = 1;

    requestAnimationFrame(frame);
  }
  frame();
})();
