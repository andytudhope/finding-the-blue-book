// Our Natural State — a river without end, which no language can contain.
// Long, slow strands flow past both sides of a single rock and gather, after
// it, into swirling Van Gogh galaxies — turbulent yet wholly at peace, a river
// in no hurry, for it knows its only destination is the ocean.
(function () {
  const container = document.getElementById("9-our-natural-state-vis");
  if (!container) return;

  const INK = "#3b2a5e", GOLD = "#9c6f12", GOLD_LT = "#caa03f";
  const DPR = Math.min(2, window.devicePixelRatio || 1);

  const canvas = document.createElement("canvas");
  container.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  let W, H, rock, wake, COUNT;

  function resize() {
    const size = Math.min(400, container.clientWidth || 400);
    W = size; H = size;
    canvas.width = W * DPR; canvas.height = H * DPR;
    canvas.style.width = W + "px"; canvas.style.height = H + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    rock = { x: W * 0.40, y: H * 0.50, a: size * 0.075 };

    // persistent whirlpools in the wake — like the fixed swirls of Starry
    // Night: alternating, slowly breathing, never shed and never gone
    wake = [];
    const n = 5;
    for (let i = 0; i < n; i++) {
      const side = i % 2 ? 1 : -1;
      wake.push({
        x: rock.x + rock.a * (2.4 + i * 1.7),
        y: rock.y + side * rock.a * (0.9 + i * 0.18),
        k: side * rock.a * U * (4.6 - i * 0.4),
        core: rock.a * rock.a * (0.7 + i * 0.12),
        sp: 0.3 + i * 0.07,
        ph: i * 1.7,
        osc: rock.a * 0.5,
      });
    }
  }

  const U = 1; // the river's quiet current

  resize();
  window.addEventListener("resize", resize);

  // a finger dipped in the river — opens a slow whirlpool where it touches
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

  let time = 0;

  function velocity(x, y) {
    // a gentle current drifting toward the lower-right, where the ocean waits
    let u = U, v = U * 0.14;
    // a soft, all-over undulation so the whole river breathes as it moves
    u += Math.sin(y * 0.017 - time * 0.4) * 0.12 * U;
    v += Math.sin(x * 0.015 + time * 0.5) * 0.12 * U;

    // smooth flow around the rock — parting to either side
    const dx = x - rock.x, dy = y - rock.y;
    const r2 = dx * dx + dy * dy;
    const a2 = rock.a * rock.a;
    if (r2 > a2) {
      const r4 = r2 * r2;
      u += U * (-a2 * (dx * dx - dy * dy) / r4);
      v += U * (-a2 * 2 * dx * dy / r4);
    }

    // the wake's wheeling galaxies
    for (let i = 0; i < wake.length; i++) {
      const w = wake[i];
      const wy = w.y + Math.sin(time * w.sp + w.ph) * w.osc;
      const ex = x - w.x, ey = y - wy;
      const rr = ex * ex + ey * ey + w.core;
      const k = w.k * (0.85 + 0.15 * Math.sin(time * w.sp * 1.3 + w.ph));
      u += -k * ey / rr;
      v += k * ex / rr;
    }

    if (pointer.active) {
      const px = x - pointer.x, py = y - pointer.y;
      const pr = px * px + py * py + 240;
      const pk = rock.a * 14;
      u += -pk * py / pr;
      v += pk * px / pr;
    }
    return { u, v };
  }

  // strands of water — each a particle carrying a long, continuous trail
  const TRAIL = 150, SPEED = 0.62;
  const strands = [];
  function spawn(s, scatter) {
    s.x = scatter ? Math.random() * W : -Math.random() * 30;
    s.y = scatter ? Math.random() * H : 0.06 * H + Math.random() * 0.88 * H;
    s.trail = [{ x: s.x, y: s.y }];
    s.life = scatter ? Math.random() * 400 : 0;
    s.lifeMax = 520 + Math.random() * 520;
    s.gold = Math.random() < 0.08;
    s.w = 0.8 + Math.random() * 0.6;
  }
  function init() {
    strands.length = 0;
    COUNT = Math.max(70, Math.round(W * 0.34));
    for (let i = 0; i < COUNT; i++) { const s = {}; spawn(s, true); strands.push(s); }
  }
  init();

  function advance(s) {
    // two gentle sub-steps for smoothness through the swirls
    for (let k = 0; k < 2; k++) {
      const vel = velocity(s.x, s.y);
      const sp = Math.hypot(vel.u, vel.v) || 1;
      s.x += (vel.u / sp) * SPEED;
      s.y += (vel.v / sp) * SPEED;
      // slide gracefully around the stone rather than entering it
      const dx = s.x - rock.x, dy = s.y - rock.y;
      const d = Math.hypot(dx, dy), pad = rock.a + 1.5;
      if (d < pad) { s.x = rock.x + (dx / d) * pad; s.y = rock.y + (dy / d) * pad; }
    }
    s.trail.push({ x: s.x, y: s.y });
    if (s.trail.length > TRAIL) s.trail.shift();
    s.life++;
    const out = s.x > W + 30 || s.y > H + 30 || s.y < -30 || s.x < -50;
    if (out || s.life > s.lifeMax) spawn(s, false);
  }

  function drawStrand(s, alpha) {
    const t = s.trail;
    if (t.length < 2) return;
    ctx.beginPath();
    ctx.moveTo(t[0].x, t[0].y);
    for (let i = 1; i < t.length - 1; i++) {
      const mx = (t[i].x + t[i + 1].x) / 2, my = (t[i].y + t[i + 1].y) / 2;
      ctx.quadraticCurveTo(t[i].x, t[i].y, mx, my);
    }
    ctx.strokeStyle = s.gold ? GOLD : INK;
    ctx.globalAlpha = alpha * (s.gold ? 0.55 : 0.22);
    ctx.lineWidth = s.w * (s.gold ? 1.5 : 1);
    ctx.stroke();
  }

  function frame() {
    ctx.clearRect(0, 0, W, H);
    time += 0.01;
    ctx.lineCap = "round"; ctx.lineJoin = "round";

    strands.forEach((s) => {
      advance(s);
      // fade in as it is born, fade out as it returns — recycling unseen
      const fadeIn = Math.min(1, s.life / 40);
      const fadeOut = Math.min(1, (s.lifeMax - s.life) / 60);
      drawStrand(s, Math.max(0, Math.min(fadeIn, fadeOut)));
    });
    ctx.globalAlpha = 1;

    // the rock — a single still stone the river cannot help but honour
    ctx.beginPath();
    for (let a = 0; a <= Math.PI * 2 + 0.05; a += 0.3) {
      const wob = 1 + Math.sin(a * 3 + 1.4) * 0.12 + Math.sin(a * 5) * 0.06;
      const x = rock.x + Math.cos(a) * rock.a * wob;
      const y = rock.y + Math.sin(a) * rock.a * wob;
      if (a === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = INK; ctx.globalAlpha = 0.9; ctx.fill();
    ctx.strokeStyle = GOLD_LT; ctx.globalAlpha = 0.5; ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.globalAlpha = 1;

    requestAnimationFrame(frame);
  }
  frame();
})();
