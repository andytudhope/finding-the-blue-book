// Deathless — clouds drift close to the sun and their white edges catch and
// hold the light. Be like water, my heart: a passing cloud never dies.
(function () {
  const container = document.getElementById("10-deathless-vis");
  if (!container) return;

  const INK = "#3b2a5e", GOLD = "#9c6f12", GOLD_LT = "#caa03f";
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
  }
  resize();
  window.addEventListener("resize", resize);

  // the sun — held high and to the right, still; the clouds drift past it
  const sun = { x: 0, y: 0 };
  function place() { sun.x = W * 0.7; sun.y = H * 0.3; }

  // clouds — drifting wavy strands; when they leave one side they return on
  // the other, never dying.
  const clouds = [];
  const NC = 16;
  for (let i = 0; i < NC; i++) {
    clouds.push({
      x: Math.random(), y: Math.random(),
      len: 0.18 + Math.random() * 0.22,
      amp: 6 + Math.random() * 14,
      freq: 1 + Math.random() * 2,
      speed: 0.0006 + Math.random() * 0.0009,
      phase: Math.random() * Math.PI * 2,
    });
  }

  let time = 0;
  function frame() {
    place();
    ctx.clearRect(0, 0, W, H);
    time += 1;

    // the sun's soft glow
    const g = ctx.createRadialGradient(sun.x, sun.y, 2, sun.x, sun.y, W * 0.4);
    g.addColorStop(0, "rgba(202,160,63,0.5)");
    g.addColorStop(1, "rgba(202,160,63,0)");
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(sun.x, sun.y, W * 0.4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(sun.x, sun.y, 7, 0, Math.PI * 2);
    ctx.fillStyle = GOLD_LT; ctx.globalAlpha = 0.85; ctx.fill();
    ctx.globalAlpha = 1;

    clouds.forEach((c) => {
      c.x += c.speed;
      if (c.x > 1.2) c.x = -0.2;          // never dies — returns
      c.y += Math.sin(time * 0.002 + c.phase) * 0.0003;

      const x0 = c.x * W, y0 = c.y * H, L = c.len * W;
      // build the strand as a flowing, watery line
      const pts = [];
      for (let s = 0; s <= 1; s += 0.05) {
        const x = x0 + s * L;
        const y = y0 + Math.sin(s * Math.PI * c.freq + time * 0.01 + c.phase) * c.amp;
        pts.push({ x, y, s });
      }
      // draw segment by segment, brightening near the sun (catching light)
      ctx.lineCap = "round";
      for (let i = 0; i < pts.length - 1; i++) {
        const p = pts[i], q = pts[i + 1];
        const mx = (p.x + q.x) / 2, my = (p.y + q.y) / 2;
        const dist = Math.hypot(mx - sun.x, my - sun.y);
        const lit = Math.max(0, 1 - dist / (W * 0.32));
        // wisps fade at the strand's ends
        const envelope = Math.sin(p.s * Math.PI);
        ctx.beginPath();
        ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
        if (lit > 0.05) {
          ctx.strokeStyle = GOLD_LT;
          ctx.globalAlpha = envelope * (0.2 + lit * 0.7);
          ctx.lineWidth = 1 + lit * 2.2;
        } else {
          ctx.strokeStyle = INK;
          ctx.globalAlpha = envelope * 0.22;
          ctx.lineWidth = 1.2;
        }
        ctx.stroke();
      }
    });
    ctx.globalAlpha = 1;

    requestAnimationFrame(frame);
  }
  frame();
})();
