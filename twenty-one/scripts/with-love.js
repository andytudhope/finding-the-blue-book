// With Love — the great web arises: light rays travelling with no time and no
// space, each ray an attribute, emptiness formed, forming emptiness.
(function () {
  const container = document.getElementById("2-with-love-vis");
  if (!container) return;

  const INK = "#3b2a5e", GOLD = "#9c6f12", GOLD_LT = "#caa03f";
  const DPR = Math.min(2, window.devicePixelRatio || 1);

  const canvas = document.createElement("canvas");
  container.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  let W, H, C, R;

  function resize() {
    const size = Math.min(400, container.clientWidth || 400);
    W = size; H = size; C = size / 2; R = size * 0.42;
    canvas.width = W * DPR; canvas.height = H * DPR;
    canvas.style.width = W + "px"; canvas.style.height = H + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  resize();
  window.addEventListener("resize", resize);

  const pointer = { x: -1, y: -1, active: false };
  function track(e) {
    const r = canvas.getBoundingClientRect();
    const t = e.touches ? e.touches[0] : e;
    pointer.x = t.clientX - r.left; pointer.y = t.clientY - r.top;
    pointer.active = true;
  }
  canvas.addEventListener("mousemove", track);
  canvas.addEventListener("mouseleave", () => (pointer.active = false));
  canvas.addEventListener("touchmove", track, { passive: true });

  const N = 18; // attributes around the circle
  const nodes = [];
  for (let i = 0; i < N; i++) nodes.push({ a: (i / N) * Math.PI * 2 });

  // travelling flashes of light between source and destination
  const rays = [];
  function newRay() {
    const i = (Math.random() * N) | 0;
    let j = (Math.random() * N) | 0;
    if (j === i) j = (j + 1) % N;
    return { i, j, life: 0, dur: 30 + Math.random() * 40 };
  }
  for (let k = 0; k < 5; k++) rays.push(newRay());

  function pos(node, time) {
    let x = C + Math.cos(node.a) * R;
    let y = C + Math.sin(node.a) * R;
    // the web is warped by the pointer — emptiness forming
    if (pointer.active) {
      const dx = x - pointer.x, dy = y - pointer.y;
      const d = Math.hypot(dx, dy) + 1;
      const pull = Math.min(26, 1400 / d);
      x += (dx / d) * pull; y += (dy / d) * pull;
    }
    return { x, y };
  }

  let time = 0, step = 0;
  function frame() {
    ctx.clearRect(0, 0, W, H);
    time += 0.01; step = (step + 0.6) % N;

    const P = nodes.map((n) => pos(n, time));

    // the standing web: a star polygon (connect every k-th node) — girih
    const skip = 7;
    ctx.lineCap = "round";
    for (let i = 0; i < N; i++) {
      const a = P[i], b = P[(i + skip) % N];
      ctx.beginPath();
      ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = INK; ctx.globalAlpha = 0.16; ctx.lineWidth = 1;
      ctx.stroke();
    }
    // a second interlacing weave
    for (let i = 0; i < N; i++) {
      const a = P[i], b = P[(i + 5) % N];
      ctx.beginPath();
      ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = INK; ctx.globalAlpha = 0.1; ctx.lineWidth = 1;
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // travelling light: a bright gold chord that brightens then fades —
    // arriving with no duration between source and destination
    rays.forEach((ray, idx) => {
      ray.life++;
      const t = ray.life / ray.dur;
      if (t >= 1) { rays[idx] = newRay(); return; }
      const a = P[ray.i], b = P[ray.j];
      const glow = Math.sin(t * Math.PI);
      ctx.beginPath();
      ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = GOLD; ctx.globalAlpha = glow * 0.85;
      ctx.lineWidth = 1 + glow * 1.6;
      ctx.stroke();
    });
    ctx.globalAlpha = 1;

    // nodes — small still points of essence
    P.forEach((p, i) => {
      const breathe = 1.6 + Math.sin(time * 2 + i) * 0.6;
      ctx.beginPath();
      ctx.arc(p.x, p.y, breathe, 0, Math.PI * 2);
      ctx.fillStyle = GOLD_LT; ctx.globalAlpha = 0.8; ctx.fill();
    });
    ctx.globalAlpha = 1;

    requestAnimationFrame(frame);
  }
  frame();
})();
