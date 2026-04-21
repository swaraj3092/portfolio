import { useEffect, useRef } from "react";

export function CursorEffect() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const dot = { x: target.x, y: target.y };
    const ring = { x: target.x, y: target.y };
    const glow = { x: target.x, y: target.y };
    const trail = Array.from({ length: 12 }, () => ({ x: target.x, y: target.y }));
    let hovering = false;
    let magnetTarget: HTMLElement | null = null;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      const el = e.target as HTMLElement | null;
      const magneticEl = el?.closest("[data-magnetic='true']") as HTMLElement | null;
      
      if (magneticEl) {
        const rect = magneticEl.getBoundingClientRect();
        target.x = rect.left + rect.width / 2;
        target.y = rect.top + rect.height / 2;
        magnetTarget = magneticEl;
      } else {
        magnetTarget = null;
      }
      
      hovering = !!el?.closest("a, button, [role='button'], input, textarea, select, [data-cursor='hover']");
    };

    const lerp = (a: number, b: number, n: number) => a + (b - a) * n;

    const tick = () => {
      const isMagnetized = !!magnetTarget;
      
      dot.x = lerp(dot.x, target.x, isMagnetized ? 0.35 : 0.9);
      dot.y = lerp(dot.y, target.y, isMagnetized ? 0.35 : 0.9);
      ring.x = lerp(ring.x, target.x, isMagnetized ? 0.25 : 0.18);
      ring.y = lerp(ring.y, target.y, isMagnetized ? 0.25 : 0.18);
      glow.x = lerp(glow.x, target.x, 0.08);
      glow.y = lerp(glow.y, target.y, 0.08);

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dot.x}px, ${dot.y}px, 0) translate(-50%, -50%) scale(${hovering ? 0.4 : 1})`;
      }
      if (ringRef.current) {
        const baseScale = hovering ? 1.8 : 1;
        const magnetScale = isMagnetized ? 2.2 : baseScale;
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%) scale(${magnetScale}) rotate(${(performance.now() / 20) % 360}deg)`;
        ringRef.current.style.borderRadius = isMagnetized ? '12px' : '50%';
        ringRef.current.style.transition = 'border-radius 0.3s ease';
      }
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${glow.x}px, ${glow.y}px, 0) translate(-50%, -50%)`;
      }

      // trail: shift positions
      for (let i = trail.length - 1; i > 0; i--) {
        trail[i].x = lerp(trail[i].x, trail[i - 1].x, 0.35);
        trail[i].y = lerp(trail[i].y, trail[i - 1].y, 0.35);
      }
      trail[0].x = lerp(trail[0].x, target.x, 0.5);
      trail[0].y = lerp(trail[0].y, target.y, 0.5);
      trailRefs.current.forEach((el, i) => {
        if (!el) return;
        const scale = 1 - i / trail.length;
        el.style.transform = `translate3d(${trail[i].x}px, ${trail[i].y}px, 0) translate(-50%, -50%) scale(${scale})`;
        el.style.opacity = `${scale * 0.6}`;
      });

      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div
        ref={glowRef}
        className="fixed top-0 left-0 pointer-events-none z-40 w-64 h-64 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(220,20,60,0.18) 0%, rgba(220,20,60,0) 70%)",
          filter: "blur(8px)",
          willChange: "transform",
        }}
      />
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            if (el) trailRefs.current[i] = el;
          }}
          className="fixed top-0 left-0 pointer-events-none z-40 w-2 h-2 rounded-full"
          style={{
            background: "#dc143c",
            boxShadow: "0 0 8px rgba(220,20,60,0.8)",
            willChange: "transform, opacity",
          }}
        />
      ))}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-50 w-10 h-10 rounded-full border-2"
        style={{
          borderColor: "#dc143c",
          borderStyle: "dashed",
          willChange: "transform",
          boxShadow: "0 0 20px rgba(220,20,60,0.5), inset 0 0 10px rgba(220,20,60,0.3)",
        }}
      />
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-50 w-2 h-2 rounded-full"
        style={{
          background: "#fff",
          boxShadow: "0 0 10px #dc143c, 0 0 20px #dc143c",
          willChange: "transform",
          mixBlendMode: "difference",
        }}
      />
    </>
  );
}
