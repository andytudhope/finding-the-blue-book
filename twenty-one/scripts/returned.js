// Returned — You take my breath away, You give it back. Hold this breath as
// long as possible; when it bursts out, joy returns, a breathless note of love.
(function () {
  const container = document.getElementById("7-returned-vis");
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

  let holding = false, held = 0;
  const waves = [];
  function release() {
    if (!holding) return;
    holding = false;
    // the longer the breath is held, the greater the burst of joy
    waves.push({ r: breath * C * 0.5, life: 1, power: 1 + held * 0.02 });
    held = 0;
  }
  canvas.addEventListener("mousedown", (e) => { e.preventDefault(); holding = true; });
  canvas.addEventListener("touchstart", (e) => { e.preventDefault(); holding = true; }, { passive: false });
  window.addEventListener("mouseup", release);
  window.addEventListener("touchend", release);

  let breath = 0.4, dir = 1, time = 0, sinceBurst = 0;
  function frame() {
    ctx.clearRect(0, 0, W, H);
    time += 0.02;

    if (holding) {
      held++;
      breath += (0.92 - breath) * 0.02; // drawn nearly full, then held
    } else {
      sinceBurst++;
      // gentle autonomous breathing: inhale, then burst out into song
      breath += dir * 0.006;
      if (breath > 0.92) { dir = -1; }
      if (breath < 0.35 && dir < 0) {
        dir = 1;
        if (sinceBurst > 40) {
          waves.push({ r: C * 0.18, life: 1, power: 1 });
          sinceBurst = 0;
        }
      }
    }
    breath = Math.max(0.32, Math.min(0.95, breath));

    const R = C * (0.18 + breath * 0.34);
    const tension = holding ? Math.min(1, held / 120) : 0;

    // outgoing song-waves — joy radiating, a breathless note
    for (let i = waves.length - 1; i >= 0; i--) {
      const w = waves[i];
      w.r += 2.2 * w.power; w.life -= 0.012;
      if (w.life <= 0) { waves.splice(i, 1); continue; }
      ctx.beginPath();
      for (let a = 0; a <= Math.PI * 2 + 0.05; a += 0.08) {
        const note = Math.sin(a * 6 + time * 2) * 4 * w.life;
        const rr = w.r + note;
        const x = C + Math.cos(a) * rr, y = C + Math.sin(a) * rr;
        if (a === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = GOLD; ctx.globalAlpha = w.life * 0.6;
      ctx.lineWidth = 1 + w.life; ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // the breathing centre — a luminous lung, fuller and warmer when held
    const g = ctx.createRadialGradient(C, C, 2, C, C, R);
    g.addColorStop(0, `rgba(202,160,63,${0.45 + tension * 0.4})`);
    g.addColorStop(1, "rgba(59,42,94,0)");
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(C, C, R, 0, Math.PI * 2); ctx.fill();

    // the encircling breath — a gestural ring that swells and contracts
    for (let layer = 0; layer < 2; layer++) {
      ctx.beginPath();
      for (let a = 0; a <= Math.PI * 2 + 0.05; a += 0.06) {
        const wob = Math.sin(a * 3 + time + layer) * (2 + tension * 4);
        const rr = R * (1 + layer * 0.12) + wob;
        const x = C + Math.cos(a) * rr, y = C + Math.sin(a) * rr;
        if (a === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = layer === 0 ? GOLD_LT : INK;
      ctx.globalAlpha = layer === 0 ? 0.7 : 0.3;
      ctx.lineWidth = layer === 0 ? 1.6 : 1; ctx.stroke();
    }
    ctx.globalAlpha = 1;

    requestAnimationFrame(frame);
  }
  frame();
})();
