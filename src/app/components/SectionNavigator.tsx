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
  const [scratches, setScratches] = useState<{ x1: string; y1: string; x2: string; y2: string; w: number; o: number; color: string }[]>([]);

  const generateScratches = () => {
    const newLines = [];
    const count = 8 + Math.floor(Math.random() * 6);
    for (let i = 0; i < count; i++) {
      const isHorizontal = Math.random() > 0.5;
      const color = Math.random() > 0.4 ? "#dc143c" : "#003cdc"; 
      if (isHorizontal) {
        newLines.push({
          x1: "-10%", y1: `${Math.random() * 110}%`,
          x2: "110%", y2: `${Math.random() * 110}%`,
          w: 0.5 + Math.random() * 1.5,
          o: 0.3 + Math.random() * 0.6,
          color
        });
      } else {
        newLines.push({
          x1: `${Math.random() * 110}%`, y1: "-10%",
          x2: `${Math.random() * 110}%`, y2: "110%",
          w: 0.5 + Math.random() * 1.5,
          o: 0.3 + Math.random() * 0.6,
          color
        });
      }
    }
    setScratches(newLines);
  };

  const goTo = (idx: number, force = false) => {
    if (lockRef.current && !force) return;
    const clamped = Math.max(0, Math.min(SECTIONS.length - 1, idx));
    
    generateScratches();
    setScratching(true);
    soundManager.play('slash', 0.4);
    setTimeout(() => setScratching(false), 450);

    if (clamped === activeRef.current && !force) return;
    
    lockRef.current = true;
    activeRef.current = clamped;
    setActive(clamped);

    const el = document.getElementById(SECTIONS[clamped].id);
    if (el) {
      const offset = 80;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }

    setTimeout(() => { lockRef.current = false; }, 500);
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
    const handleScroll = () => {
      if (lockRef.current) return;

      const scrollPos = window.scrollY + 120;
      const sections = SECTIONS.map(s => s.id);
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && scrollPos >= el.offsetTop) {
          activeRef.current = i;
          setActive(i);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Dynamic Multiverse Scratch Effect */}
      {scratching && (
        <div className="fixed inset-0 pointer-events-none z-[9999]">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.15, 0] }}
            transition={{ duration: 0.45 }}
            className="absolute inset-0 bg-gradient-to-br from-[#dc143c]/5 via-transparent to-[#003cdc]/5 mix-blend-overlay"
          />
          <svg width="100%" height="100%" className="absolute inset-0 overflow-visible">
            <g>
              {scratches.map((l, i) => (
                <motion.line
                  key={i}
                  x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
                  stroke={l.color}
                  strokeWidth={l.w}
                  strokeDasharray="1000"
                  initial={{ strokeDashoffset: 1000, opacity: 0 }}
                  animate={{ strokeDashoffset: 0, opacity: l.o }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                />
              ))}
            </g>
          </svg>
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
