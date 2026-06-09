// Community Around — every atom a mirror of the Giver, the one story told over
// and over: a single community of nested, mirroring rosettes turning as one.
(function () {
  const container = document.getElementById("5-community-around-vis");
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

  // the pointer turns the community
  let userRot = 0, targetRot = 0;
  function track(e) {
    const r = canvas.getBoundingClientRect();
    const t = e.touches ? e.touches[0] : e;
    targetRot = Math.atan2((t.clientY - r.top) - C, (t.clientX - r.left) - C);
  }
  canvas.addEventListener("mousemove", track);
  canvas.addEventListener("touchmove", track, { passive: true });

  // a girih star rosette, drawn gesturally; recurses into a smaller mirror
  function rosette(x, y, r, points, rot, depth, color, alpha) {
    if (r < 4 || depth < 0) return;
    const inner = r * 0.42;
    ctx.beginPath();
    for (let i = 0; i <= points * 2; i++) {
      const a = rot + (i / (points * 2)) * Math.PI * 2;
      const rad = i % 2 ? inner : r;
      const px = x + Math.cos(a) * rad;
      const py = y + Math.sin(a) * rad;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.strokeStyle = color; ctx.globalAlpha = alpha; ctx.lineWidth = 1.1;
    ctx.lineJoin = "round"; ctx.stroke();

    // interlacing ring
    ctx.beginPath();
    ctx.arc(x, y, r * 0.72, 0, Math.PI * 2);
    ctx.globalAlpha = alpha * 0.5; ctx.stroke();
    ctx.globalAlpha = 1;

    // the whole reflected in the part — a smaller mirror, counter-turning
    rosette(x, y, r * 0.42, points, -rot * 1.3, depth - 1,
            color === INK ? GOLD : INK, Math.min(1, alpha + 0.05));
  }

  let time = 0;
  function frame() {
    ctx.clearRect(0, 0, W, H);
    time += 0.004;
    userRot += (targetRot - userRot) * 0.05;
    const baseRot = time * 0.3 + userRot;

    // the surrounding community — a ring of mirroring souls
    const N = 6;
    const ringR = C * 0.6;
    for (let i = 0; i < N; i++) {
      const a = (i / N) * Math.PI * 2 + baseRot;
      const x = C + Math.cos(a) * ringR;
      const y = C + Math.sin(a) * ringR;
      // each kneels toward the centre, mirroring its turn
      rosette(x, y, C * 0.2, 6, -baseRot * 1.5 + a, 2, GOLD, 0.55);
    }

    // faint threads gathering each soul to the centre
    for (let i = 0; i < N; i++) {
      const a = (i / N) * Math.PI * 2 + baseRot;
      ctx.beginPath();
      ctx.moveTo(C, C);
      ctx.lineTo(C + Math.cos(a) * ringR, C + Math.sin(a) * ringR);
      ctx.strokeStyle = GOLD_LT; ctx.globalAlpha = 0.12; ctx.lineWidth = 1;
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // the Giver at the centre — the deepest, brightest rosette
    rosette(C, C, C * 0.3, 6, baseRot * 1.4, 3, INK, 0.7);

    requestAnimationFrame(frame);
  }
  frame();
})();
