import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { soundManager } from "../utils/sounds";

const SECTIONS = [
  { id: "home",       label: "Origin"   },
  { id: "about",      label: "Host"     },
  { id: "skills",     label: "Powers"   },
  { id: "projects",   label: "Projects" },
  { id: "experience", label: "Legacy"   },
  { id: "contact",    label: "Bond"     },
];

export function SectionNavigator({ minimalist }: { minimalist: boolean }) {
  const [active, setActive] = useState(0);
  const [scratching, setScratching] = useState(false);
  const lockRef = useRef(false);
  const activeRef = useRef(0);

  const goTo = (idx: number, force = false) => {
    if (lockRef.current && !force) return;
    const clamped = Math.max(0, Math.min(SECTIONS.length - 1, idx));
    
    // Always trigger effect on manual call even if same section
    setScratching(true);
    soundManager.play('slash', 0.4);
    setTimeout(() => setScratching(false), 450);

    if (clamped === activeRef.current && !force) return;
    
    lockRef.current = true;
    activeRef.current = clamped;
    setActive(clamped);

    const el = document.getElementById(SECTIONS[clamped].id);
    if (el) {
      const offset = 80; // offset for nav
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }

    setTimeout(() => { lockRef.current = false; }, 800);
  };

  // Keyboard: W/S/↑/↓ = nav | A/← = game | D/→ = calendar
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Don't trigger if user is typing
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") return;

      if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
        e.preventDefault();
        goTo(activeRef.current - 1, true);
      } else if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
        e.preventDefault();
        goTo(activeRef.current + 1, true);
      } else if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("open-panel", { detail: { panel: "game" } }));
      } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("open-panel", { detail: { panel: "calendar" } }));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Sync dots with scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = SECTIONS.findIndex((s) => s.id === entry.target.id);
            if (idx !== -1 && !lockRef.current) { activeRef.current = idx; setActive(idx); }
          }
        });
      },
      { threshold: 0, rootMargin: '-80px 0px -75% 0px' }
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Spider Web Scratch Effect - Now unconditionally active for impact */}
      {scratching && (
        <div className="fixed inset-0 pointer-events-none z-[9999]">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.45 }}
            className="absolute inset-0 bg-[#dc143c]/10 mix-blend-overlay"
          />
          <svg width="100%" height="100%" className="absolute inset-0 overflow-visible">
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <g filter="url(#glow)">
              {[
                { x1: "10%", y1: "-10%", x2: "20%", y2: "110%", w: 3, o: 0.9 },
                { x1: "30%", y1: "-10%", x2: "25%", y2: "110%", w: 1.5, o: 0.6 },
                { x1: "50%", y1: "-10%", x2: "45%", y2: "110%", w: 4, o: 0.8 },
                { x1: "70%", y1: "-10%", x2: "85%", y2: "110%", w: 2, o: 0.7 },
                { x1: "90%", y1: "-10%", x2: "80%", y2: "110%", w: 1, o: 0.4 },
                { x1: "-10%", y1: "20%", x2: "110%", y2: "25%", w: 2.5, o: 0.8 },
                { x1: "-10%", y1: "50%", x2: "110%", y2: "45%", w: 3.5, o: 0.75 },
                { x1: "-10%", y1: "80%", x2: "110%", y2: "90%", w: 1.5, o: 0.5 },
                { x1: "0%", y1: "10%", x2: "100%", y2: "90%", w: 1, o: 0.6 },
                { x1: "100%", y1: "10%", x2: "0%", y2: "90%", w: 1, o: 0.6 },
              ].map((l, i) => (
                <motion.line
                  key={i}
                  x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
                  stroke="#dc143c"
                  strokeWidth={l.w}
                  strokeDasharray="1000"
                  initial={{ strokeDashoffset: 1000, opacity: 0 }}
                  animate={{ strokeDashoffset: 0, opacity: l.o }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              ))}
            </g>
          </svg>
          <div className="absolute inset-0 bg-gradient-to-tr from-[#dc143c]/5 to-transparent animate-pulse" />
        </div>
      )}

      {/* Side dot indicators - hidden on mobile */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex-col gap-4 pointer-events-auto hidden md:flex">
        {SECTIONS.map((s, i) => (
          <button key={s.id} onClick={() => goTo(i)} className="group flex items-center gap-3" aria-label={`Go to ${s.label}`}>
            <span
              className="text-[10px] tracking-[0.25em] uppercase opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 whitespace-nowrap"
              style={{ color: "#dc143c", fontFamily: "Rajdhani, sans-serif" }}
            >
              {s.label}
            </span>
            <span
              className="relative block rounded-full transition-all duration-400"
              style={{
                width: i === active ? 12 : 6,
                height: i === active ? 12 : 6,
                background: i === active ? "#dc143c" : "rgba(255,255,255,0.18)",
                boxShadow: i === active ? "0 0 10px #dc143c, 0 0 20px rgba(220,20,60,0.4)" : "none",
              }}
            />
          </button>
        ))}
      </div>

      {/* Control hints - hidden in minimalist for cleaner look */}
      {!minimalist && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 pointer-events-none select-none"
          style={{ fontFamily: "Rajdhani, sans-serif", color: "rgba(220,20,60,0.75)", fontSize: "11px", letterSpacing: "0.18em" }}
        >
          <div className="flex items-center gap-1.5">
            <kbd className="px-2 py-1 text-[10px]" style={{ border: "1px solid rgba(220,20,60,0.5)", color: "rgba(220,20,60,0.85)", background: "rgba(220,20,60,0.08)" }}>A</kbd>
            <span>GAME</span>
          </div>
          <div className="w-px h-3" style={{ background: "rgba(220,20,60,0.3)" }} />
          <div className="flex items-center gap-1.5">
            <kbd className="px-2 py-1 text-[10px]" style={{ border: "1px solid rgba(220,20,60,0.5)", color: "rgba(220,20,60,0.85)", background: "rgba(220,20,60,0.08)" }}>W</kbd>
            <kbd className="px-2 py-1 text-[10px]" style={{ border: "1px solid rgba(220,20,60,0.5)", color: "rgba(220,20,60,0.85)", background: "rgba(220,20,60,0.08)" }}>S</kbd>
            <span>NAVIGATE</span>
          </div>
          <div className="w-px h-3" style={{ background: "rgba(220,20,60,0.3)" }} />
          <div className="flex items-center gap-1.5">
            <span>CALENDAR</span>
            <kbd className="px-2 py-1 text-[10px]" style={{ border: "1px solid rgba(220,20,60,0.5)", color: "rgba(220,20,60,0.85)", background: "rgba(220,20,60,0.08)" }}>D</kbd>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scratch-fade {
          0%   { opacity: 1; }
          60%  { opacity: 0.8; }
          100% { opacity: 0; }
        }
      `}</style>
    </>
  );
}
