import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, RotateCcw, Trophy } from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────
interface Inv { row: number; col: number; alive: boolean; type: number; flash: number; }
interface Blt { x: number; y: number; vy: number; vx: number; fp: boolean; active: boolean; }
interface Ptl { x: number; y: number; vx: number; vy: number; life: number; ml: number; r: number; c: string; g: number; }
interface Star { x: number; y: number; r: number; a: number; va: number; }
interface GS {
  phase: 'title' | 'playing' | 'paused' | 'dead' | 'gameover' | 'levelclear';
  phaseTimer: number;
  px: number;
  pShootCD: number;
  invs: Inv[];
  gx: number; gy: number;
  gdir: number; gspeed: number;
  bullets: Blt[];
  eShootTimer: number; eShootInt: number;
  bars: { hp: number; x: number; y: number; w: number; h: number }[];
  mys: { active: boolean; x: number; dir: number; pts: number; timer: number; interval: number };
  ptls: Ptl[];
  stars: Star[];
  score: number; lives: number; level: number; hi: number;
  anim: number; animTimer: number;
  keys: Set<string>;
}

// ── Constants ──────────────────────────────────────────────────────────
const N_COLS = 8, N_ROWS = 4;
const ROW_TYPE = [2, 1, 1, 0]; // top→bottom row types (2=elite, 0=basic)
const TYPE_PTS = [10, 20, 30];
const TYPE_COLORS = ['#4a0014', '#8b0022', '#dc143c'];
const TYPE_GLOW   = ['#200008', '#50000e', '#900020'];
const BAR_HP = 8;

// ── Particle factory ───────────────────────────────────────────────────
function burst(x: number, y: number, color: string, n: number): Ptl[] {
  return Array.from({ length: n }, () => {
    const a = Math.random() * Math.PI * 2;
    const spd = 40 + Math.random() * 200;
    return { x, y, vx: Math.cos(a) * spd, vy: Math.sin(a) * spd - Math.random() * 50, life: 0.4 + Math.random() * 0.5, ml: 0.4 + Math.random() * 0.5, r: 1.5 + Math.random() * 3, c: color, g: 150 + Math.random() * 120 };
  });
}

// ── Draw helpers ───────────────────────────────────────────────────────
function drawInvader(ctx: CanvasRenderingContext2D, cx: number, cy: number, iw: number, ih: number, type: number, anim: number, flash: number) {
  ctx.save();
  ctx.translate(cx, cy);
  const col = flash > 0 ? '#ffffff' : TYPE_COLORS[type];
  const glow = flash > 0 ? '#ffffff' : TYPE_GLOW[type];
  ctx.shadowColor = glow;
  ctx.shadowBlur = flash > 0 ? 24 : (type === 2 ? 14 : 6);
  ctx.fillStyle = col;
  const dx = anim ? iw * 0.06 : -iw * 0.06;

  if (type === 0) {
    // Basic blob
    ctx.beginPath();
    ctx.arc(0, ih * 0.05, iw * 0.38, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(-iw * 0.5 + dx, ih * 0.15, iw * 0.22, ih * 0.18);
    ctx.fillRect(iw * 0.28 - dx, ih * 0.15, iw * 0.22, ih * 0.18);
    ctx.shadowBlur = 0;
    ctx.fillStyle = flash > 0 ? '#000' : '#ff4060';
    ctx.beginPath();
    ctx.arc(-iw * 0.14, -ih * 0.02, iw * 0.09, 0, Math.PI * 2);
    ctx.arc( iw * 0.14, -ih * 0.02, iw * 0.09, 0, Math.PI * 2);
    ctx.fill();
  } else if (type === 1) {
    // Standard crab
    ctx.beginPath();
    ctx.ellipse(0, 0, iw * 0.4, ih * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
    // claws
    ctx.fillRect(-iw * 0.52 + dx, -ih * 0.12, iw * 0.15, ih * 0.22);
    ctx.fillRect( iw * 0.37 - dx, -ih * 0.12, iw * 0.15, ih * 0.22);
    // antennae
    ctx.fillRect(-iw * 0.22, -ih * 0.52, iw * 0.08, ih * 0.14);
    ctx.fillRect( iw * 0.14, -ih * 0.52, iw * 0.08, ih * 0.14);
    // fangs
    ctx.fillRect(-iw * 0.14, ih * 0.2, iw * 0.07, ih * 0.2);
    ctx.fillRect( iw * 0.07, ih * 0.2, iw * 0.07, ih * 0.2);
    ctx.shadowBlur = 0;
    ctx.fillStyle = flash > 0 ? '#000' : '#ff4060';
    ctx.beginPath();
    ctx.arc(-iw * 0.16, -ih * 0.06, iw * 0.09, 0, Math.PI * 2);
    ctx.arc( iw * 0.16, -ih * 0.06, iw * 0.09, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Elite — angular diamond
    ctx.beginPath();
    ctx.moveTo(0, -ih * 0.5);
    ctx.lineTo( iw * 0.42, -ih * 0.12);
    ctx.lineTo( iw * 0.5,   ih * 0.18);
    ctx.lineTo( iw * 0.2,   ih * 0.5);
    ctx.lineTo(-iw * 0.2,   ih * 0.5);
    ctx.lineTo(-iw * 0.5,   ih * 0.18);
    ctx.lineTo(-iw * 0.42, -ih * 0.12);
    ctx.closePath();
    ctx.fill();
    // side spikes
    ctx.beginPath();
    ctx.moveTo(-iw * 0.5,  0);
    ctx.lineTo(-iw * 0.72 + dx, -ih * 0.1);
    ctx.lineTo(-iw * 0.62 + dx,  ih * 0.1);
    ctx.closePath();
    ctx.moveTo( iw * 0.5,  0);
    ctx.lineTo( iw * 0.72 - dx, -ih * 0.1);
    ctx.lineTo( iw * 0.62 - dx,  ih * 0.1);
    ctx.closePath();
    ctx.fill();
    // core glow
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(255,80,100,0.35)';
    ctx.beginPath();
    ctx.arc(0, 0, iw * 0.14, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawPlayer(ctx: CanvasRenderingContext2D, cx: number, cy: number, pw: number, ph: number) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.shadowColor = '#dc143c';
  ctx.shadowBlur = 18;
  ctx.fillStyle = '#dc143c';
  ctx.beginPath();
  ctx.moveTo(0, -ph * 0.9);
  ctx.lineTo( pw * 0.28, -ph * 0.2);
  ctx.lineTo( pw * 0.5,   ph * 0.5);
  ctx.lineTo(-pw * 0.5,   ph * 0.5);
  ctx.lineTo(-pw * 0.28, -ph * 0.2);
  ctx.closePath();
  ctx.fill();
  // engine glow
  ctx.fillStyle = '#ff6080';
  ctx.fillRect(-pw * 0.14, ph * 0.4, pw * 0.28, ph * 0.2);
  ctx.restore();
}

// ── Init helpers ───────────────────────────────────────────────────────
function initInvaders(): Inv[] {
  const arr: Inv[] = [];
  for (let r = 0; r < N_ROWS; r++)
    for (let c = 0; c < N_COLS; c++)
      arr.push({ row: r, col: c, alive: true, type: ROW_TYPE[r], flash: 0 });
  return arr;
}

function initBars(cx: number, barY: number, barW: number, barH: number) {
  return [0.2, 0.5, 0.8].map(frac => ({ hp: BAR_HP, x: cx * frac - barW / 2, y: barY, w: barW, h: barH }));
}

function initStars(cx: number, cy: number, n = 120): Star[] {
  return Array.from({ length: n }, () => ({
    x: Math.random() * cx, y: Math.random() * cy,
    r: Math.random() * 1.5 + 0.4, a: Math.random(), va: (Math.random() - 0.5) * 0.5,
  }));
}

// ── Component ──────────────────────────────────────────────────────────
export function GamePanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gsRef = useRef<GS | null>(null);
  const rafRef = useRef<number>(0);
  const lastTRef = useRef<number>(0);
  const [uiPhase, setUiPhase] = useState<GS['phase']>('title');
  const [uiScore, setUiScore] = useState(0);
  const [uiLives, setUiLives] = useState(3);
  const [uiHi, setUiHi] = useState(0);
  const [uiLevel, setUiLevel] = useState(1);

  const getHi = () => { try { return parseInt(localStorage.getItem('si-hi') || '0'); } catch { return 0; } };
  const saveHi = (s: number) => { try { localStorage.setItem('si-hi', String(s)); } catch {} };

  const initGS = useCallback((level = 1): GS => {
    const cv = canvasRef.current!;
    const cx = cv.width, cy = cv.height;
    const cell = cx / 11;
    const iw = cell * 0.58, ih = cell * 0.46;
    const gridW = N_COLS * cell;
    const gridX = (cx - gridW) / 2;
    const gridY = 80;
    const pW = cell * 1.15, pH = 18;
    const barW = cell * 1.4, barH = 38;
    const barY = cy - 155;
    const speed = 38 + level * 10;

    return {
      phase: 'playing', phaseTimer: 0,
      px: cx / 2,
      pShootCD: 0,
      invs: initInvaders(),
      gx: gridX, gy: gridY,
      gdir: 1, gspeed: speed,
      bullets: [],
      eShootTimer: 0, eShootInt: Math.max(0.9, 2.6 - level * 0.18),
      bars: initBars(cx, barY, barW, barH),
      mys: { active: false, x: 0, dir: 1, pts: 150, timer: 0, interval: 14 + Math.random() * 10 },
      ptls: [],
      stars: initStars(cx, cy),
      score: gsRef.current?.score ?? 0, lives: 3, level, hi: getHi(),
      anim: 0, animTimer: 0.45,
      keys: new Set(),
    };
  }, []);

  // Reset score when starting fresh from title
  const startGame = useCallback((fresh = true) => {
    if (!canvasRef.current) return;
    const gs = initGS(1);
    if (fresh) gs.score = 0;
    gsRef.current = gs;
    setUiPhase('playing');
    setUiScore(0);
    setUiLives(3);
    setUiLevel(1);
    setUiHi(gs.hi);
  }, [initGS]);

  // Main loop
  useEffect(() => {
    if (!open) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      if (gsRef.current) {
        // Re-init bars positions only
        const cx = canvas.width, cy = canvas.height;
        const cell = cx / 11;
        const barW = cell * 1.4, barH = 38;
        gsRef.current.bars = initBars(cx, cy - 155, barW, barH);
        gsRef.current.stars = initStars(cx, cy);
      }
    };
    resize();
    window.addEventListener('resize', resize);

    if (!gsRef.current) {
      gsRef.current = { ...initGS(1), score: 0, phase: 'title' };
      setUiPhase('title');
    }

    const loop = (ts: number) => {
      const dt = Math.min((ts - lastTRef.current) / 1000, 0.05);
      lastTRef.current = ts;
      const gs = gsRef.current;
      if (!gs) { rafRef.current = requestAnimationFrame(loop); return; }

      const cx = canvas.width, cy = canvas.height;
      const cell = cx / 11;
      const iw = cell * 0.58, ih = cell * 0.46;
      const pW = cell * 1.15, pH = 18;
      const pY = cy - 62;

      // ── Update ──────────────────────────────────────────────
      if (gs.phase === 'playing') {
        // Player movement
        if ((gs.keys.has('ArrowLeft') || gs.keys.has('a') || gs.keys.has('A')) && gs.px - pW / 2 > 4) gs.px -= 320 * dt;
        if ((gs.keys.has('ArrowRight') || gs.keys.has('d') || gs.keys.has('D')) && gs.px + pW / 2 < cx - 4) gs.px += 320 * dt;

        // Shoot
        gs.pShootCD -= dt;
        if (gs.keys.has(' ') && gs.pShootCD <= 0) {
          gs.bullets.push({ x: gs.px, y: pY - pH / 2, vy: -520, vx: 0, fp: true, active: true });
          gs.pShootCD = 0.35;
        }

        // Invader anim
        gs.animTimer -= dt;
        if (gs.animTimer <= 0) { gs.anim ^= 1; gs.animTimer = 0.45; }

        // Invader flash decay
        gs.invs.forEach(inv => { if (inv.flash > 0) inv.flash -= dt; });

        // Grid movement
        const aliveInvs = gs.invs.filter(i => i.alive);
        if (aliveInvs.length === 0) {
          // Level clear
          gs.phase = 'levelclear'; gs.phaseTimer = 2.5;
          setUiPhase('levelclear');
        } else {
          const speedBoost = 1 + (N_COLS * N_ROWS - aliveInvs.length) * 0.022;
          const moveAmt = gs.gspeed * speedBoost * gs.gdir * dt;
          gs.gx += moveAmt;

          // Find grid bounds
          const cols = aliveInvs.map(i => i.col);
          const rows = aliveInvs.map(i => i.row);
          const leftCol = Math.min(...cols), rightCol = Math.max(...cols);
          const bottomRow = Math.max(...rows);
          const leftEdge = gs.gx + leftCol * cell;
          const rightEdge = gs.gx + (rightCol + 1) * cell;
          const bottomEdge = gs.gy + (bottomRow + 1) * cell * 0.8;

          if (gs.gdir === 1 && rightEdge >= cx - 10) {
            gs.gdir = -1;
            gs.gy += 22;
          } else if (gs.gdir === -1 && leftEdge <= 10) {
            gs.gdir = 1;
            gs.gy += 22;
          }

          // Game over if invaders reach player
          if (bottomEdge >= pY - 30) {
            gs.lives = 0; gs.phase = 'gameover';
            if (gs.score > gs.hi) { gs.hi = gs.score; saveHi(gs.score); }
            setUiPhase('gameover'); setUiHi(gs.hi);
          }
        }

        // Enemy shooting
        gs.eShootTimer -= dt;
        if (gs.eShootTimer <= 0) {
          gs.eShootTimer = gs.eShootInt * (0.7 + Math.random() * 0.6);
          const aliveCols = [...new Set(gs.invs.filter(i => i.alive).map(i => i.col))];
          if (aliveCols.length > 0) {
            const col = aliveCols[Math.floor(Math.random() * aliveCols.length)];
            const shooter = gs.invs.filter(i => i.alive && i.col === col).sort((a, b) => b.row - a.row)[0];
            if (shooter) {
              const ex = gs.gx + (shooter.col + 0.5) * cell;
              const ey = gs.gy + (shooter.row + 0.85) * cell * 0.8;
              gs.bullets.push({ x: ex, y: ey, vy: 230, vx: (Math.random() - 0.5) * 40, fp: false, active: true });
            }
          }
        }

        // Mystery ship
        gs.mys.timer += dt;
        if (!gs.mys.active && gs.mys.timer >= gs.mys.interval) {
          gs.mys.active = true;
          gs.mys.dir = Math.random() > 0.5 ? 1 : -1;
          gs.mys.x = gs.mys.dir === 1 ? -80 : cx + 80;
          gs.mys.pts = [100, 150, 200, 300][Math.floor(Math.random() * 4)];
          gs.mys.timer = 0;
          gs.mys.interval = 14 + Math.random() * 10;
        }
        if (gs.mys.active) {
          gs.mys.x += gs.mys.dir * 140 * dt;
          if (gs.mys.x < -100 || gs.mys.x > cx + 100) gs.mys.active = false;
        }

        // Bullets movement
        gs.bullets.forEach(b => {
          if (!b.active) return;
          b.y += b.vy * dt;
          b.x += b.vx * dt;
          if (b.y < 0 || b.y > cy) { b.active = false; return; }

          if (b.fp) {
            // Player bullet vs invaders
            for (const inv of gs.invs) {
              if (!inv.alive) continue;
              const ix = gs.gx + (inv.col + 0.5) * cell;
              const iy = gs.gy + (inv.row + 0.5) * cell * 0.8;
              if (Math.abs(b.x - ix) < iw * 0.55 && Math.abs(b.y - iy) < ih * 0.55) {
                inv.alive = false; inv.flash = 0.15; b.active = false;
                const pts = TYPE_PTS[inv.type];
                gs.score += pts;
                gs.ptls.push(...burst(ix, iy, TYPE_COLORS[inv.type], 12));
                setUiScore(gs.score);
                break;
              }
            }
            // Player bullet vs mystery ship
            if (gs.mys.active) {
              const my = 55;
              if (Math.abs(b.x - gs.mys.x) < 45 && Math.abs(b.y - my) < 20) {
                gs.mys.active = false; b.active = false;
                gs.score += gs.mys.pts;
                gs.ptls.push(...burst(gs.mys.x, my, '#ff4080', 18));
                setUiScore(gs.score);
              }
            }
            // Player bullet vs barriers
            for (const bar of gs.bars) {
              if (bar.hp <= 0) continue;
              if (b.x >= bar.x && b.x <= bar.x + bar.w && b.y >= bar.y && b.y <= bar.y + bar.h) {
                bar.hp--; b.active = false; break;
              }
            }
          } else {
            // Enemy bullet vs player
            if (Math.abs(b.x - gs.px) < pW * 0.52 && Math.abs(b.y - pY) < pH) {
              b.active = false;
              gs.lives--;
              gs.ptls.push(...burst(gs.px, pY, '#dc143c', 20));
              setUiLives(gs.lives);
              if (gs.lives <= 0) {
                gs.phase = 'gameover';
                if (gs.score > gs.hi) { gs.hi = gs.score; saveHi(gs.score); }
                setUiPhase('gameover'); setUiHi(gs.hi);
              } else {
                gs.phase = 'dead'; gs.phaseTimer = 1.5;
                setUiPhase('dead');
              }
            }
            // Enemy bullet vs barriers
            for (const bar of gs.bars) {
              if (bar.hp <= 0) continue;
              if (b.x >= bar.x && b.x <= bar.x + bar.w && b.y >= bar.y && b.y <= bar.y + bar.h) {
                bar.hp--; b.active = false; break;
              }
            }
          }
        });
        gs.bullets = gs.bullets.filter(b => b.active);

        // Particles
        gs.ptls.forEach(p => {
          p.x += p.vx * dt; p.y += p.vy * dt; p.vy += p.g * dt; p.life -= dt;
        });
        gs.ptls = gs.ptls.filter(p => p.life > 0);
      }

      if (gs.phase === 'dead' || gs.phase === 'levelclear') {
        gs.phaseTimer -= dt;
        if (gs.phaseTimer <= 0) {
          if (gs.phase === 'dead') {
            gs.phase = 'playing'; gs.pShootCD = 0;
            gs.bullets = [];
            setUiPhase('playing');
          } else {
            const next = initGS(gs.level + 1);
            next.score = gs.score; next.hi = gs.hi;
            gsRef.current = next;
            setUiPhase('playing'); setUiLevel(next.level);
          }
        }
      }

      // Stars twinkle
      gs.stars.forEach(s => { s.a += s.va * dt; if (s.a < 0.1) s.va = Math.abs(s.va); if (s.a > 1) s.va = -Math.abs(s.va); });

      // ── Draw ─────────────────────────────────────────────────
      ctx.clearRect(0, 0, cx, cy);

      // Background
      ctx.fillStyle = '#060305';
      ctx.fillRect(0, 0, cx, cy);

      // Stars
      gs.stars.forEach(s => {
        ctx.save();
        ctx.globalAlpha = s.a * 0.7;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Grid subtle red scanlines
      ctx.save();
      ctx.globalAlpha = 0.03;
      for (let y = 0; y < cy; y += 3) {
        ctx.fillStyle = '#dc143c'; ctx.fillRect(0, y, cx, 1);
      }
      ctx.restore();

      // HUD line
      ctx.strokeStyle = 'rgba(220,20,60,0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, 68); ctx.lineTo(cx, 68); ctx.stroke();

      // HUD text
      ctx.fillStyle = '#dc143c';
      ctx.font = `600 ${Math.round(cx * 0.016)}px Orbitron, sans-serif`;
      ctx.textAlign = 'left';
      ctx.fillText(`SCORE: ${gs.score.toString().padStart(6, '0')}`, 20, 44);
      ctx.textAlign = 'center';
      ctx.fillText(`LEVEL ${gs.level}`, cx / 2, 44);
      ctx.textAlign = 'right';
      ctx.fillText(`HI: ${gs.hi.toString().padStart(6, '0')}`, cx - 20, 44);

      // Lives (hearts)
      ctx.fillStyle = '#dc143c';
      ctx.textAlign = 'left';
      ctx.font = `${Math.round(cx * 0.018)}px sans-serif`;
      ctx.fillText('♥'.repeat(Math.max(0, gs.lives)), 20, 64);

      // Mystery ship
      if (gs.mys.active) {
        ctx.save();
        ctx.shadowColor = '#ff0040'; ctx.shadowBlur = 20;
        ctx.fillStyle = '#cc1040';
        ctx.beginPath();
        ctx.ellipse(gs.mys.x, 55, 44, 18, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ff2060';
        ctx.beginPath();
        ctx.ellipse(gs.mys.x, 48, 24, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = `bold ${Math.round(cx * 0.012)}px Orbitron`;
        ctx.textAlign = 'center';
        ctx.fillText('???', gs.mys.x, 58);
        ctx.restore();
      }

      // Barriers
      gs.bars.forEach(bar => {
        if (bar.hp <= 0) return;
        const alpha = bar.hp / BAR_HP;
        ctx.save();
        ctx.globalAlpha = Math.max(0.15, alpha);
        ctx.shadowColor = '#dc143c'; ctx.shadowBlur = 8;
        ctx.fillStyle = '#8b0020';
        const shrink = (1 - alpha) * bar.h * 0.5;
        ctx.fillRect(bar.x, bar.y + shrink, bar.w, bar.h - shrink);
        ctx.strokeStyle = '#dc143c';
        ctx.lineWidth = 1;
        ctx.strokeRect(bar.x, bar.y + shrink, bar.w, bar.h - shrink);
        ctx.restore();
      });

      // Invaders
      if (gs.phase !== 'dead' && gs.phase !== 'gameover') {
        gs.invs.forEach(inv => {
          if (!inv.alive) return;
          const ix = gs.gx + (inv.col + 0.5) * cell;
          const iy = gs.gy + (inv.row + 0.5) * cell * 0.8;
          drawInvader(ctx, ix, iy, iw, ih, inv.type, gs.anim, inv.flash);
        });
      }

      // Player (hidden during dead phase)
      if (gs.phase !== 'dead' && gs.phase !== 'gameover') {
        const playerAlpha = gs.phase === 'levelclear' ? 0.5 : 1;
        ctx.save(); ctx.globalAlpha = playerAlpha;
        drawPlayer(ctx, gs.px, pY, pW, pH);
        ctx.restore();
      }

      // Bullets
      gs.bullets.forEach(b => {
        if (!b.active) return;
        ctx.save();
        if (b.fp) {
          ctx.shadowColor = '#ff6090'; ctx.shadowBlur = 10;
          ctx.fillStyle = '#ff6090';
          ctx.fillRect(b.x - 1.5, b.y - 8, 3, 16);
        } else {
          ctx.shadowColor = '#dc143c'; ctx.shadowBlur = 8;
          ctx.fillStyle = '#dc143c';
          ctx.beginPath(); ctx.arc(b.x, b.y, 4, 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();
      });

      // Particles
      gs.ptls.forEach(p => {
        const alpha = p.life / p.ml;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.shadowColor = p.c; ctx.shadowBlur = 6;
        ctx.fillStyle = p.c;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      });

      // Phase overlays on canvas (dead flash)
      if (gs.phase === 'dead') {
        const t = gs.phaseTimer;
        if (Math.sin(t * 20) > 0) {
          ctx.save(); ctx.globalAlpha = 0.18;
          ctx.fillStyle = '#dc143c'; ctx.fillRect(0, 0, cx, cy);
          ctx.restore();
        }
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    lastTRef.current = performance.now();
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [open, initGS]);

  // Keyboard handler while game is open
  useEffect(() => {
    if (!open) return;
    const gs = gsRef.current;

    const onDown = (e: KeyboardEvent) => {
      if (!gsRef.current) return;
      const g = gsRef.current;

      // Prevent these keys from propagating to portfolio nav
      if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown',' ','a','d','A','D','w','s','W','S'].includes(e.key)) {
        e.stopPropagation();
      }

      if (e.key === 'Escape') { onClose(); return; }
      if (e.key === 'p' || e.key === 'P') {
        if (g.phase === 'playing') { g.phase = 'paused'; setUiPhase('paused'); }
        else if (g.phase === 'paused') { g.phase = 'playing'; setUiPhase('playing'); }
        return;
      }
      if (e.key === 'r' || e.key === 'R') { if (g.phase === 'gameover') startGame(true); return; }
      if (e.key === ' ' && g.phase === 'title') { startGame(true); return; }
      if (e.key === ' ' && g.phase === 'gameover') { startGame(true); return; }

      g.keys.add(e.key);
    };
    const onUp = (e: KeyboardEvent) => {
      if (!gsRef.current) return;
      gsRef.current.keys.delete(e.key);
    };

    window.addEventListener('keydown', onDown, true);
    window.addEventListener('keyup', onUp, true);
    return () => {
      window.removeEventListener('keydown', onDown, true);
      window.removeEventListener('keyup', onUp, true);
    };
  }, [open, onClose, startGame]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="game"
          className="fixed inset-0 z-[80]"
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 220 }}
          style={{ background: '#060305' }}
        >
          {/* Red border accent */}
          <div className="absolute inset-0 pointer-events-none" style={{ border: '1px solid rgba(220,20,60,0.25)', zIndex: 2 }} />

          {/* Canvas */}
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

          {/* Close btn */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 z-10 p-2 text-[#dc143c] hover:text-white transition-colors duration-200"
            style={{ border: '1px solid rgba(220,20,60,0.35)', background: 'rgba(6,3,5,0.85)' }}
          >
            <X className="w-4 h-4" />
          </button>

          {/* Label */}
          <div
            className="absolute top-4 right-4 z-10 flex items-center gap-2 px-4 py-2"
            style={{ border: '1px solid rgba(220,20,60,0.3)', background: 'rgba(6,3,5,0.8)', fontFamily: 'Orbitron, sans-serif', fontSize: '11px', color: '#dc143c', letterSpacing: '0.3em' }}
          >
            SYMBIOTE INVADERS
          </div>

          {/* Title screen overlay */}
          <AnimatePresence>
            {uiPhase === 'title' && (
              <motion.div
                key="title"
                className="absolute inset-0 z-10 flex flex-col items-center justify-center"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ background: 'rgba(6,3,5,0.85)' }}
              >
                <motion.div initial={{ y: -30 }} animate={{ y: 0 }} transition={{ type: 'spring', damping: 20 }}>
                  <div className="text-center mb-8">
                    <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(2rem,6vw,4rem)', color: '#dc143c', textShadow: '0 0 40px rgba(220,20,60,0.8)', letterSpacing: '0.1em', fontWeight: 900 }}>
                      SYMBIOTE
                    </div>
                    <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(1rem,3vw,2rem)', color: '#fff', letterSpacing: '0.5em' }}>
                      INVADERS
                    </div>
                  </div>
                  <div className="text-center mb-10 space-y-2" style={{ fontFamily: 'Rajdhani, sans-serif', color: '#aaa', fontSize: '14px', letterSpacing: '0.1em' }}>
                    <div>← / → or A / D  —  Move</div>
                    <div>SPACE  —  Fire Web Strand</div>
                    <div>P  —  Pause  |  ESC  —  Exit</div>
                  </div>
                  <div className="flex justify-center">
                    <motion.button
                      onClick={() => startGame(true)}
                      className="px-12 py-4 text-white tracking-[0.35em] uppercase"
                      style={{ background: '#dc143c', fontFamily: 'Orbitron, sans-serif', fontSize: '14px', clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))' }}
                      animate={{ boxShadow: ['0 0 20px rgba(220,20,60,0.5)', '0 0 40px rgba(220,20,60,0.9)', '0 0 20px rgba(220,20,60,0.5)'] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      PRESS SPACE
                    </motion.button>
                  </div>
                  {uiHi > 0 && (
                    <div className="flex items-center justify-center gap-2 mt-6" style={{ color: '#dc143c', fontFamily: 'Orbitron, sans-serif', fontSize: '12px' }}>
                      <Trophy className="w-4 h-4" />
                      <span>BEST: {uiHi.toString().padStart(6, '0')}</span>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pause overlay */}
          <AnimatePresence>
            {uiPhase === 'paused' && (
              <motion.div
                key="pause"
                className="absolute inset-0 z-10 flex items-center justify-center"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ background: 'rgba(6,3,5,0.75)', backdropFilter: 'blur(4px)' }}
              >
                <div className="text-center">
                  <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(2rem,5vw,3.5rem)', color: '#dc143c', letterSpacing: '0.2em' }}>PAUSED</div>
                  <div className="mt-4" style={{ fontFamily: 'Rajdhani, sans-serif', color: '#666', letterSpacing: '0.15em', fontSize: '13px' }}>PRESS P TO RESUME</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Level clear */}
          <AnimatePresence>
            {uiPhase === 'levelclear' && (
              <motion.div
                key="levelclear"
                className="absolute inset-0 z-10 flex items-center justify-center"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ background: 'rgba(6,3,5,0.6)' }}
              >
                <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 15 }} className="text-center">
                  <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(1.5rem,4vw,3rem)', color: '#dc143c', letterSpacing: '0.2em' }}>SECTOR CLEARED</div>
                  <div className="mt-3" style={{ fontFamily: 'Rajdhani, sans-serif', color: '#aaa', letterSpacing: '0.2em', fontSize: '18px' }}>NEXT WAVE INCOMING…</div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Game over */}
          <AnimatePresence>
            {uiPhase === 'gameover' && (
              <motion.div
                key="gameover"
                className="absolute inset-0 z-10 flex flex-col items-center justify-center"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ background: 'rgba(6,3,5,0.88)' }}
              >
                <motion.div initial={{ y: -20 }} animate={{ y: 0 }} transition={{ type: 'spring', damping: 18 }} className="text-center">
                  <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(2rem,6vw,4rem)', color: '#dc143c', textShadow: '0 0 50px rgba(220,20,60,0.9)', letterSpacing: '0.1em', fontWeight: 900 }}>
                    GAME OVER
                  </div>
                  <div className="mt-6 space-y-2" style={{ fontFamily: 'Rajdhani, sans-serif', color: '#888', fontSize: '16px', letterSpacing: '0.15em' }}>
                    <div style={{ color: '#fff' }}>SCORE: <span style={{ color: '#dc143c' }}>{uiScore.toString().padStart(6, '0')}</span></div>
                    {uiScore >= uiHi && uiHi > 0 && <div style={{ color: '#ffd700' }}>⭐ NEW HIGH SCORE!</div>}
                    <div>BEST: {uiHi.toString().padStart(6, '0')}</div>
                  </div>
                  <div className="flex gap-4 mt-8 justify-center">
                    <motion.button
                      onClick={() => startGame(true)}
                      className="px-8 py-3 flex items-center gap-2 text-white tracking-widest uppercase"
                      style={{ background: '#dc143c', fontFamily: 'Orbitron, sans-serif', fontSize: '12px', clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))' }}
                      whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                    >
                      <RotateCcw className="w-4 h-4" /> Play Again
                    </motion.button>
                    <motion.button
                      onClick={onClose}
                      className="px-8 py-3 text-[#dc143c] tracking-widest uppercase"
                      style={{ border: '1px solid rgba(220,20,60,0.5)', fontFamily: 'Orbitron, sans-serif', fontSize: '12px', background: 'transparent' }}
                      whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                    >
                      Exit
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Touch Controls Overlay for Mobile */}
          <div className="absolute inset-0 z-5 md:hidden flex pointer-events-none">
            <div 
              className="w-1/4 h-full pointer-events-auto relative active:bg-white/5 transition-colors" 
              onTouchStart={(e) => { e.preventDefault(); if(gsRef.current) gsRef.current.keys.add('ArrowLeft'); }}
              onTouchEnd={(e) => { e.preventDefault(); if(gsRef.current) gsRef.current.keys.delete('ArrowLeft'); }}
            >
              <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20"><ChevronLeft className="w-8 h-8 text-[#dc143c]" /></div>
            </div>
            <div 
              className="w-2/4 h-full pointer-events-auto relative active:bg-white/5 transition-colors" 
              onTouchStart={(e) => { e.preventDefault(); if(gsRef.current) gsRef.current.keys.add(' '); }}
              onTouchEnd={(e) => { e.preventDefault(); if(gsRef.current) gsRef.current.keys.delete(' '); }}
            >
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-20"><Crosshair className="w-10 h-10 text-[#dc143c]" /></div>
            </div>
            <div 
              className="w-1/4 h-full pointer-events-auto relative active:bg-white/5 transition-colors" 
              onTouchStart={(e) => { e.preventDefault(); if(gsRef.current) gsRef.current.keys.add('ArrowRight'); }}
              onTouchEnd={(e) => { e.preventDefault(); if(gsRef.current) gsRef.current.keys.delete('ArrowRight'); }}
            >
              <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20"><ChevronRight className="w-8 h-8 text-[#dc143c]" /></div>
            </div>
          </div>

          {/* Controls hint */}
          <div
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col md:flex-row items-center gap-2 md:gap-5 text-[10px] tracking-widest uppercase pointer-events-none text-center"
            style={{ fontFamily: 'Rajdhani, sans-serif', color: 'rgba(220,20,60,0.4)' }}
          >
            <div className="md:hidden">TAP SIDES TO MOVE | CENTER TO FIRE</div>
            <div className="hidden md:flex items-center gap-5">
              <span>← → Move</span>
              <span>|</span>
              <span>Space Shoot</span>
              <span>|</span>
              <span>P Pause</span>
              <span>|</span>
              <span>ESC Exit</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
