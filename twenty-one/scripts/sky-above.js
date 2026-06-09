// Sky Above — the sky becomes the land of a million folds and hidden contours,
// coloured by sun and dust, traversed and then burned up into endless space.
(function () {
  const container = document.getElementById("3-sky-above-vis");
  if (!container) return;

  const INK = "#3b2a5e", GOLD = "#9c6f12";
  const DPR = Math.min(2, window.devicePixelRatio || 1);

  const canvas = document.createElement("canvas");
  container.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  let W, H, res = 5, cols, rows, field;

  function resize() {
    const size = Math.min(400, container.clientWidth || 400);
    W = size; H = size;
    canvas.width = W * DPR; canvas.height = H * DPR;
    canvas.style.width = W + "px"; canvas.style.height = H + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    cols = Math.floor(W / res) + 1; rows = Math.floor(H / res) + 1;
    field = new Array(rows).fill(0).map(() => new Array(cols).fill(0));
  }
  resize();
  window.addEventListener("resize", resize);

  // wind — the pointer pushes the folds; the field drifts back to a gentle flow
  const wind = { x: 0, y: 0, tx: 0.18, ty: 0.05 };
  function track(e) {
    const r = canvas.getBoundingClientRect();
    const t = e.touches ? e.touches[0] : e;
    wind.tx = ((t.clientX - r.left) / W - 0.5) * 1.2;
    wind.ty = ((t.clientY - r.top) / H - 0.5) * 1.2;
  }
  canvas.addEventListener("mousemove", track);
  canvas.addEventListener("mouseleave", () => { wind.tx = 0.18; wind.ty = 0.05; });
  canvas.addEventListener("touchmove", track, { passive: true });

  let ox = 0, oy = 0, time = 0;

  function fold(x, y, t) {
    return (
      Math.sin(x * 0.9 + t) +
      Math.sin(y * 1.3 - t * 0.7) +
      Math.sin((x + y) * 0.6 + t * 0.4) +
      Math.sin(Math.hypot(x - 3, y - 2) * 1.1 - t)
    ) / 4;
  }

  function lerp(a, b, va, vb, level) {
    const t = (level - va) / (vb - va);
    return a + (b - a) * t;
  }

  const LEVELS = [-0.55, -0.3, -0.05, 0.2, 0.45, 0.7];

  function frame() {
    ctx.clearRect(0, 0, W, H);
    time += 0.006;
    wind.x += (wind.tx - wind.x) * 0.04;
    wind.y += (wind.ty - wind.y) * 0.04;
    ox += wind.x * 0.05; oy += wind.y * 0.05;

    for (let i = 0; i < rows; i++)
      for (let j = 0; j < cols; j++)
        field[i][j] = fold(j * res * 0.02 + ox, i * res * 0.02 + oy, time);

    LEVELS.forEach((level, li) => {
      // higher folds catch the sun (gold); lower ones stay in shadow (ink)
      const lightT = li / (LEVELS.length - 1);
      const r = Math.round(59 + (156 - 59) * lightT);
      const g = Math.round(42 + (111 - 42) * lightT);
      const b = Math.round(94 + (18 - 94) * lightT);
      ctx.strokeStyle = `rgb(${r},${g},${b})`;
      ctx.globalAlpha = 0.28 + lightT * 0.35;
      ctx.lineWidth = 1;
      ctx.lineCap = "round";
      ctx.beginPath();
      for (let i = 0; i < rows - 1; i++) {
        for (let j = 0; j < cols - 1; j++) {
          const x = j * res, y = i * res;
          const tl = field[i][j], tr = field[i][j + 1];
          const br = field[i + 1][j + 1], bl = field[i + 1][j];
          const c = (tl > level ? 8 : 0) + (tr > level ? 4 : 0) +
                    (br > level ? 2 : 0) + (bl > level ? 1 : 0);
          const T = { x: x + lerp(0, res, tl, tr, level), y: y };
          const B = { x: x + lerp(0, res, bl, br, level), y: y + res };
          const L = { x: x, y: y + lerp(0, res, tl, bl, level) };
          const Rt = { x: x + res, y: y + lerp(0, res, tr, br, level) };
          const seg = (p, q) => { ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); };
          switch (c) {
            case 1: case 14: seg(L, B); break;
            case 2: case 13: seg(B, Rt); break;
            case 3: case 12: seg(L, Rt); break;
            case 4: case 11: seg(T, Rt); break;
            case 5: seg(L, T); seg(B, Rt); break;
            case 6: case 9: seg(T, B); break;
            case 7: case 8: seg(L, T); break;
            case 10: seg(L, B); seg(T, Rt); break;
          }
        }
      }
      ctx.stroke();
    });
    ctx.globalAlpha = 1;

    requestAnimationFrame(frame);
  }
  frame();
})();
