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
  const [isBreaching, setIsBreaching] = useState(false);

  const goTo = (idx: number, force = false) => {
    if (lockRef.current && !force) return;
    const clamped = Math.max(0, Math.min(SECTIONS.length - 1, idx));
    
    // Trigger Symbiote Breach effect
    setIsBreaching(true);
    soundManager.play('slash', 0.35);
    setTimeout(() => setIsBreaching(false), 800);

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
      {/* The Symbiote Breach - High-Fidelity Cinematic Transition */}
      {isBreaching && (
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
          {/* 1. Liquid Organic Wash */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0, borderTopLeftRadius: "100%", borderBottomRightRadius: "100%" }}
            animate={{ 
              scale: [0.8, 1.2, 1.5], 
              opacity: [0, 0.4, 0],
              borderTopLeftRadius: ["100%", "20%", "0%"],
              borderBottomRightRadius: ["100%", "40%", "0%"]
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 bg-gradient-to-br from-[#dc143c]/20 via-black/40 to-[#003cdc]/20 backdrop-blur-[2px]"
          />

          {/* 2. Tactical Bio-Scanner Sweep */}
          <motion.div 
            initial={{ y: "-100%" }}
            animate={{ y: "200%" }}
            transition={{ duration: 0.6, ease: "linear" }}
            className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#dc143c] to-transparent shadow-[0_0_20px_#dc143c] z-20"
          />

          {/* 3. Chromatic Glitch Pulse */}
          <motion.div 
            animate={{ 
              x: [-4, 4, -2, 2, 0],
              opacity: [0, 0.3, 0.1, 0.2, 0]
            }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-[#dc143c]/5 mix-blend-screen z-10"
          />

          {/* 4. Tactical Data Fragments */}
          <div className="absolute inset-0 flex items-center justify-center">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: (i - 2.5) * 100, y: (Math.random() - 0.5) * 200 }}
                animate={{ opacity: [0, 1, 0], scale: [0.8, 1.1, 1] }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="text-[10px] text-[#dc143c]/60 font-mono tracking-widest whitespace-nowrap"
              >
                {`0x${Math.random().toString(16).slice(2, 8).toUpperCase()}_BREACH_v1.0.4`}
              </motion.div>
            ))}
          </div>

          {/* 5. Liquid "Symbiote" Blobs */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, x: "50%", y: "50%", opacity: 0 }}
              animate={{ 
                scale: [0, 2.5, 4], 
                x: [`${50 + (i-1)*10}%`, `${50 + (i-1)*20}%`],
                y: [`${50 + (i-1)*5}%`, `${50 + (i-1)*15}%`],
                opacity: [0, 0.35, 0] 
              }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: "easeOut" }}
              className="absolute w-64 h-64 rounded-full bg-black blur-3xl mix-blend-multiply"
            />
          ))}
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
