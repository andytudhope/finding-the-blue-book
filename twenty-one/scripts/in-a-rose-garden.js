// In A Rose Garden — a rose pulled from a bag of tasbih, placed on the fire:
// the scent of timelessness, just in time, returned via the heat of devotion.
(function () {
  const container = document.getElementById("3-in-a-rose-garden-vis");
  if (!container) return;

  const INK = "#3b2a5e", GOLD = "#9c6f12", GOLD_LT = "#caa03f", ROSE = "#a8406b";
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

  // heat — driven up by the pointer (the fire), drifting back to rest
  let heat = 0, targetHeat = 0;
  function track(e) {
    const r = canvas.getBoundingClientRect();
    const t = e.touches ? e.touches[0] : e;
    const dx = (t.clientX - r.left) - C, dy = (t.clientY - r.top) - C;
    const d = Math.hypot(dx, dy);
    targetHeat = Math.max(0, 1 - d / (C * 1.1));
  }
  canvas.addEventListener("mousemove", track);
  canvas.addEventListener("mouseleave", () => (targetHeat = 0));
  canvas.addEventListener("touchmove", track, { passive: true });

  function lerpColor(c1, c2, t) {
    const a = parseInt(c1.slice(1), 16), b = parseInt(c2.slice(1), 16);
    const ar = a >> 16, ag = (a >> 8) & 255, ab = a & 255;
    const br = b >> 16, bg = (b >> 8) & 255, bb = b & 255;
    const r = Math.round(ar + (br - ar) * t);
    const g = Math.round(ag + (bg - ag) * t);
    const bl = Math.round(ab + (bb - ab) * t);
    return `rgb(${r},${g},${bl})`;
  }

  const PETALS = 8;
  let time = 0;
  function frame() {
    ctx.clearRect(0, 0, W, H);
    time += 0.008;
    heat += (targetHeat - heat) * 0.06;

    const bloom = 0.5 + 0.5 * Math.sin(time * 0.7);     // breathing bloom
    const baseR = C * (0.32 + bloom * 0.12);
    const rot = time * 0.2;

    // tasbih — a string of prayer beads spiralling outward, the rose's source
    const beads = 70;
    for (let i = 0; i < beads; i++) {
      const f = i / beads;
      const ang = f * Math.PI * 9 + rot * 0.5;
      const rr = C * 0.16 + f * C * 0.74;
      const x = C + Math.cos(ang) * rr;
      const y = C + Math.sin(ang) * rr;
      const sz = 1 + (1 - f) * 1.8;
      ctx.beginPath();
      ctx.arc(x, y, sz, 0, Math.PI * 2);
      ctx.fillStyle = GOLD; ctx.globalAlpha = 0.18 + (1 - f) * 0.2;
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // the rose — layered rhodonea petals, gestural, rotating
    const petalColor = lerpColor(ROSE, GOLD_LT, heat);
    for (let layer = 0; layer < 3; layer++) {
      const lr = baseR * (1 - layer * 0.26);
      ctx.beginPath();
      for (let a = 0; a <= Math.PI * 2 + 0.05; a += 0.02) {
        const k = PETALS / 2;
        const petal = Math.abs(Math.cos(k * (a)));
        const wob = Math.sin(a * 6 + time * 2) * (0.04 + heat * 0.05);
        const r = lr * (0.55 + petal * (0.45 + wob));
        const x = C + Math.cos(a + rot + layer * 0.2) * r;
        const y = C + Math.sin(a + rot + layer * 0.2) * r;
        if (a === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = layer === 0 ? petalColor : INK;
      ctx.globalAlpha = layer === 0 ? 0.8 : 0.35 - layer * 0.08;
      ctx.lineWidth = layer === 0 ? 1.6 : 1;
      ctx.lineJoin = "round";
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // the fire's bloom of light at the heart, brightening with heat
    const g = ctx.createRadialGradient(C, C, 2, C, C, baseR * (0.9 + heat));
    g.addColorStop(0, `rgba(202,160,63,${0.25 + heat * 0.5})`);
    g.addColorStop(1, "rgba(202,160,63,0)");
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(C, C, baseR * 1.2, 0, Math.PI * 2); ctx.fill();

    // rising heat shimmer — a few graceful ascending wisps when on the fire
    if (heat > 0.05) {
      for (let i = 0; i < 5; i++) {
        const phase = time * 1.5 + i * 1.3;
        ctx.beginPath();
        for (let s = 0; s <= 1; s += 0.1) {
          const x = C + Math.sin(phase + s * 4) * (8 + i * 3) * heat;
          const y = C - s * baseR * 1.6 * heat - baseR * 0.2;
          if (s === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = GOLD_LT; ctx.globalAlpha = heat * 0.4;
        ctx.lineWidth = 1; ctx.lineCap = "round"; ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    requestAnimationFrame(frame);
  }
  frame();
})();
