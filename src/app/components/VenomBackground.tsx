import { useEffect, useRef } from 'react';

export function VenomBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // High-visibility Symbiote Orbs
    const orbs = [
      { x: Math.random(), y: Math.random(), r: 550, vx: 0.0004, vy: 0.0003, p: 0, color: 'rgba(220, 20, 60, 0.22)' },
      { x: Math.random(), y: Math.random(), r: 480, vx: -0.0003, vy: -0.0004, p: 2, color: 'rgba(200, 0, 30, 0.18)' },
      { x: Math.random(), y: Math.random(), r: 650, vx: 0.0002, vy: 0.0005, p: 4, color: 'rgba(220, 20, 60, 0.15)' },
      { x: Math.random(), y: Math.random(), r: 580, vx: -0.0004, vy: 0.0002, p: 1, color: 'rgba(139, 0, 0, 0.2)' },
      { x: Math.random(), y: Math.random(), r: 420, vx: 0.0005, vy: -0.0003, p: 3, color: 'rgba(220, 20, 60, 0.18)' },
      { x: Math.random(), y: Math.random(), r: 500, vx: -0.0002, vy: 0.0006, p: 5, color: 'rgba(230, 10, 40, 0.16)' },
      { x: Math.random(), y: Math.random(), r: 620, vx: 0.0004, vy: -0.0005, p: 1.5, color: 'rgba(220, 20, 60, 0.14)' },
      { x: Math.random(), y: Math.random(), r: 450, vx: -0.0003, vy: 0.0003, p: 3.5, color: 'rgba(180, 0, 25, 0.2)' },
      { x: Math.random(), y: Math.random(), r: 550, vx: 0.0006, vy: 0.0002, p: 0.5, color: 'rgba(220, 20, 60, 0.18)' },
      { x: Math.random(), y: Math.random(), r: 480, vx: -0.0005, vy: -0.0004, p: 2.5, color: 'rgba(200, 10, 20, 0.12)' },
      { x: Math.random(), y: Math.random(), r: 700, vx: 0.0001, vy: 0.0004, p: 4.5, color: 'rgba(255, 0, 50, 0.15)' },
      { x: Math.random(), y: Math.random(), r: 400, vx: -0.0002, vy: -0.0006, p: 1.2, color: 'rgba(139, 0, 0, 0.18)' }
    ];

    // Connectivity nodes
    const nodes = Array.from({ length: 35 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0006,
      vy: (Math.random() - 0.5) * 0.0006,
    }));

    const particles = Array.from({ length: 180 }, () => ({
      x: Math.random(),
      y: Math.random(),
      z: Math.random(),
      s: 1.2 + Math.random() * 3,
      o: 0.18 + Math.random() * 0.55,
      flash: Math.random() > 0.75
    }));

    let raf: number;
    let time = 0;

    const draw = () => {
      time += 0.01;
      const w = canvas.width, h = canvas.height;
      
      // Deep Void Background
      ctx.fillStyle = '#040203';
      ctx.fillRect(0, 0, w, h);

      // 1. Biological Connectors
      ctx.lineWidth = 0.8;
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > 1) n.vx *= -1;
        if (n.y < 0 || n.y > 1) n.vy *= -1;

        for (let j = i + 1; j < nodes.length; j++) {
          const m = nodes[j];
          const dist = Math.hypot(n.x - m.x, n.y - m.y);
          if (dist < 0.22) {
            const alpha = 0.15 * (1 - dist / 0.22);
            ctx.strokeStyle = `rgba(220, 20, 60, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(n.x * w, n.y * h);
            ctx.lineTo(m.x * w, m.y * h);
            ctx.stroke();
          }
        }
      }

      // 2. High-Impact Symbiote Energy Masses
      for (const o of orbs) {
        o.x += o.vx; o.y += o.vy;
        o.p += 0.003;
        if (o.x < -0.3 || o.x > 1.3) o.vx *= -1;
        if (o.y < -0.3 || o.y > 1.3) o.vy *= -1;

        const pulse = 1 + Math.sin(time * 0.6 + o.p) * 0.15;
        const g = ctx.createRadialGradient(o.x * w, o.y * h, 0, o.x * w, o.y * h, o.r * pulse);
        
        g.addColorStop(0, o.color);
        g.addColorStop(0.3, o.color.replace('0.', '0.04'));
        g.addColorStop(0.7, 'rgba(80, 0, 10, 0.01)');
        g.addColorStop(1, 'transparent');
        
        ctx.fillStyle = g;
        ctx.globalCompositeOperation = 'screen';
        ctx.fillRect(0, 0, w, h);
        ctx.globalCompositeOperation = 'source-over';
      }

      // 3. Depth Dust & Bio-Matter
      for (const p of particles) {
        p.y -= (0.0003 + p.z * 0.0007);
        if (p.y < -0.1) { p.y = 1.1; p.x = Math.random(); }
        
        const size = p.s * (1.2 + p.z);
        const flicker = p.flash ? (Math.sin(time * 10) * 0.3 + 0.7) : 1;
        const opacity = p.o * (0.4 + Math.sin(time + p.x * 15) * 0.3) * flicker;
        
        ctx.fillStyle = `rgba(220, 20, 60, ${opacity})`;
        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, size, 0, Math.PI * 2);
        ctx.fill();
        
        if (p.z > 0.7) {
          ctx.shadowBlur = 8;
          ctx.shadowColor = '#dc143c';
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      // 4. Heavy Cinematic Vignette
      const vg = ctx.createRadialGradient(w/2, h/2, h*0.2, w/2, h/2, w*0.9);
      vg.addColorStop(0, 'transparent');
      vg.addColorStop(0.6, 'rgba(0,0,0,0.3)');
      vg.addColorStop(1, 'rgba(0,0,0,0.92)');
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, w, h);

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      
      {/* HUD Scanline Interference */}
      <div 
        className="absolute inset-0 z-[1] opacity-[0.05] pointer-events-none"
        style={{
          background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(220, 20, 60, 0.1) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.05), rgba(0, 0, 0, 0), rgba(255, 0, 0, 0.05))',
          backgroundSize: '100% 4px, 100% 100%'
        }}
      />

      {/* Atmospheric Grit */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.08] mix-blend-color-dodge">
        <filter id="grit">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grit)" />
      </svg>

      {/* Crimson Depth Wash */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#8b0000]/15 pointer-events-none" />
    </div>
  );
}
