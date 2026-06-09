// Gathered — the atom of gold: alpha particles search through vast empty
// space for a dense centre they can never hit, bar a few strange deflections
// which hint at the inconceivable love gathered here.
(function () {
  const container = document.getElementById("1-gathered-vis");
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

  const pointer = { x: 0, y: 0, active: false };
  function track(e) {
    const r = canvas.getBoundingClientRect();
    const t = e.touches ? e.touches[0] : e;
    pointer.x = t.clientX - r.left; pointer.y = t.clientY - r.top;
    pointer.active = true;
  }
  canvas.addEventListener("mousemove", track);
  canvas.addEventListener("mouseleave", () => (pointer.active = false));
  canvas.addEventListener("touchmove", track, { passive: true });

  // gestural, slightly trembling ink line (Baskin hand)
  function inkLine(pts, color, w, alpha, wobble) {
    if (pts.length < 2) return;
    ctx.strokeStyle = color; ctx.lineWidth = w; ctx.lineCap = "round";
    ctx.lineJoin = "round"; ctx.globalAlpha = alpha;
    ctx.beginPath();
    for (let i = 0; i < pts.length; i++) {
      const j = wobble ? Math.sin(i * 1.7 + pts[i].x * 0.05) * wobble : 0;
      const k = wobble ? Math.cos(i * 1.3 + pts[i].y * 0.05) * wobble : 0;
      if (i === 0) ctx.moveTo(pts[i].x + j, pts[i].y + k);
      else ctx.lineTo(pts[i].x + j, pts[i].y + k);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // Alpha trajectories: traced lines under an inverse-square repulsion from
  // the golden nucleus (and from the pointer, a second centre of love).
  const TRAILS = 15;
  const trails = [];
  function spawn(tr) {
    const ang = Math.random() * Math.PI * 2;
    const r = C * 1.5;
    tr.x = C + Math.cos(ang) * r;
    tr.y = C + Math.sin(ang) * r;
    // aim across the field with a small, random impact parameter
    const aim = ang + Math.PI + (Math.random() - 0.5) * 0.5;
    const sp = 0.9 + Math.random() * 0.5;
    tr.vx = Math.cos(aim) * sp; tr.vy = Math.sin(aim) * sp;
    tr.pts = [];
    tr.gold = Math.random() < 0.4; // a few golden seekers
  }
  for (let i = 0; i < TRAILS; i++) { const tr = {}; spawn(tr); trails.push(tr); }

  function repel(tr, cx, cy, strength) {
    const dx = tr.x - cx, dy = tr.y - cy;
    const d2 = dx * dx + dy * dy + 60;
    const f = strength / d2;
    const d = Math.sqrt(d2);
    tr.vx += (dx / d) * f; tr.vy += (dy / d) * f;
  }

  let time = 0, pulse = 0;
  function frame() {
    ctx.clearRect(0, 0, W, H);
    time += 0.01;
    pulse = 0.5 + 0.5 * Math.sin(time * 1.3);

    // faint concentric "empty space" rings — the vast nothing
    for (let i = 1; i <= 5; i++) {
      ctx.beginPath();
      ctx.arc(C, C, (C / 5) * i * 1.05, 0, Math.PI * 2);
      ctx.strokeStyle = INK; ctx.globalAlpha = 0.05; ctx.lineWidth = 1;
      ctx.stroke(); ctx.globalAlpha = 1;
    }

    // trajectories
    trails.forEach((tr) => {
      for (let s = 0; s < 3; s++) {
        repel(tr, C, C, 110);
        if (pointer.active) repel(tr, pointer.x, pointer.y, 60);
        tr.x += tr.vx; tr.y += tr.vy;
        tr.pts.push({ x: tr.x, y: tr.y });
        if (tr.pts.length > 60) tr.pts.shift();
        const off = Math.hypot(tr.x - C, tr.y - C);
        if (off > C * 1.7) { spawn(tr); break; }
      }
      inkLine(tr.pts, tr.gold ? GOLD : INK, tr.gold ? 1.4 : 1,
              tr.gold ? 0.55 : 0.3, 0.6);
    });

    // golden nucleus — dense centre, an 8-fold girih rosette, pulsing
    const R = 26 + pulse * 6;
    ctx.save();
    ctx.translate(C, C); ctx.rotate(time * 0.15);
    for (let k = 0; k < 8; k++) {
      ctx.rotate(Math.PI / 4);
      const petal = [];
      for (let a = -1; a <= 1; a += 0.1)
        petal.push({ x: Math.sin(a) * R, y: -Math.cos(a * 0.5) * R });
      inkLine(petal, GOLD_LT, 1.3, 0.5 + pulse * 0.3, 0.4);
    }
    ctx.beginPath();
    ctx.arc(0, 0, 6 + pulse * 3, 0, Math.PI * 2);
    ctx.fillStyle = GOLD; ctx.globalAlpha = 0.85; ctx.fill();
    ctx.globalAlpha = 1;
    ctx.restore();

    requestAnimationFrame(frame);
  }
  frame();
})();
