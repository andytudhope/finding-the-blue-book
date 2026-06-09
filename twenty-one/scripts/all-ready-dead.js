// All Ready Dead — like a thunderclap on a clear blue day it rumbles through:
// I am already dead. An infinite well; dear friends beg me to drink.
(function () {
  const container = document.getElementById("6-all-ready-dead-vis");
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

  // expanding rings — ripples in the well
  const claps = [];
  function strike(strength) {
    claps.push({ r: 0, life: 1, strength });
    if (claps.length > 14) claps.shift();
  }
  function pointerStrike(e) {
    e.preventDefault();
    strike(1.4);
  }
  canvas.addEventListener("mousedown", pointerStrike);
  canvas.addEventListener("touchstart", pointerStrike, { passive: false });
  // a hover sends a gentle tremor through the surface
  let lastHover = 0;
  canvas.addEventListener("mousemove", () => {
    const now = performance.now();
    if (now - lastHover > 700) { strike(0.5); lastHover = now; }
  });

  let time = 0, nextClap = 180;
  function frame() {
    ctx.clearRect(0, 0, W, H);
    time += 1;

    // the thunderclap on a clear day — arrives unbidden, now and then
    if (time > nextClap) { strike(1.2); nextClap = time + 260 + Math.random() * 260; }

    // gold light waiting at the bottom of the well — the source to drink
    const glow = ctx.createRadialGradient(C, C, 2, C, C, C * 0.5);
    glow.addColorStop(0, "rgba(202,160,63,0.55)");
    glow.addColorStop(0.5, "rgba(156,111,18,0.18)");
    glow.addColorStop(1, "rgba(156,111,18,0)");
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(C, C, C * 0.5, 0, Math.PI * 2); ctx.fill();

    // the still surface — faint standing rings receding into infinite depth
    for (let i = 1; i <= 9; i++) {
      const r = (C * 0.95) * Math.pow(i / 9, 1.6);
      ctx.beginPath();
      ctx.arc(C, C, r, 0, Math.PI * 2);
      ctx.strokeStyle = INK; ctx.globalAlpha = 0.08; ctx.lineWidth = 1;
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // expanding ripples from each clap
    for (let i = claps.length - 1; i >= 0; i--) {
      const c = claps[i];
      c.r += 1.6 * c.strength;
      c.life -= 0.006;
      if (c.life <= 0 || c.r > C * 1.3) { claps.splice(i, 1); continue; }
      const fade = c.life * Math.max(0, 1 - c.r / (C * 1.2));
      // a small train of rings, like a struck bell
      for (let k = 0; k < 3; k++) {
        const rr = c.r - k * 12;
        if (rr <= 0) continue;
        ctx.beginPath();
        ctx.arc(C, C, rr, 0, Math.PI * 2);
        ctx.strokeStyle = k === 0 ? GOLD_LT : GOLD;
        ctx.globalAlpha = fade * (0.7 - k * 0.2) * c.strength;
        ctx.lineWidth = (k === 0 ? 1.8 : 1) * c.strength;
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;

    // the still point at the centre — already, always here
    ctx.beginPath();
    ctx.arc(C, C, 3 + Math.sin(time * 0.04) * 1, 0, Math.PI * 2);
    ctx.fillStyle = GOLD_LT; ctx.fill();

    requestAnimationFrame(frame);
  }
  frame();
})();
