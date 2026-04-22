import { useEffect, useState } from "react";
import { motion, useScroll, AnimatePresence } from "motion/react";
import { VenomBackground } from "./components/VenomBackground";
import { Navigation } from "./components/Navigation";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Skills } from "./components/Skills";
import { Projects } from "./components/Projects";
import { Experience } from "./components/Experience";
import { Contact } from "./components/Contact";
import { CursorEffect } from "./components/CursorEffect";
import { SectionNavigator } from "./components/SectionNavigator";
import { Loader } from "./components/Loader";
import { GamePanel } from "./components/GamePanel";
import { CalendarPanel } from "./components/CalendarPanel";
import { Terminal } from "./components/Terminal";

export default function App() {
  const [gameOpen, setGameOpen] = useState(false);
  const [calOpen, setCalOpen] = useState(false);
  const [minimalist, setMinimalist] = useState(false);
  const [isMobileSim, setIsMobileSim] = useState(false);

  useEffect(() => {
    // Only auto-enable minimalist on mobile-sized screens
    if (window.innerWidth < 768) {
      setMinimalist(true);
    }
  }, []);

  useEffect(() => {
    const onPanel = (e: Event) => {
      const { panel } = (e as CustomEvent).detail;
      if (panel === "game") {
        setGameOpen(true);
        setCalOpen(false);
      } else if (panel === "calendar") {
        setCalOpen(true);
        setGameOpen(false);
      }
    };
    window.addEventListener("open-panel", onPanel);
    return () => window.removeEventListener("open-panel", onPanel);
  }, []);

  // Strictly detect mobile phones with touch OR simulation mode
  const isMobileTouch = (typeof window !== 'undefined' && 
    ('ontouchstart' in window || navigator.maxTouchPoints > 0) && 
    window.innerWidth < 768) || isMobileSim;

  // Keyboard shortcut for Mobile Sim (Alt + M)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === 'm') {
        setIsMobileSim(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Swipe Gestures for Mobile
  useEffect(() => {
    if (!isMobileTouch) return;

    let touchStartX = 0;
    let touchStartY = 0;

    const onTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const onTouchEnd = (e: TouchEvent) => {
      // Don't trigger if a panel is already open (avoid confusion)
      if (gameOpen || calOpen) return;

      const deltaX = e.changedTouches[0].clientX - touchStartX;
      const deltaY = e.changedTouches[0].clientY - touchStartY;

      // Ensure horizontal swipe is dominant and above threshold (100px)
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 100) {
        if (deltaX > 0) {
          // Swipe Right -> Game
          setGameOpen(true);
          setCalOpen(false);
        } else {
          // Swipe Left -> Calendar
          setCalOpen(true);
          setGameOpen(false);
        }
      }
    };

    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [isMobileTouch, gameOpen, calOpen]);
  
  return (
    <>
      <Loader minimalist={minimalist} setMinimalist={setMinimalist} />
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-[#dc143c] z-[100] origin-left"
        style={{ scaleX: useScroll().scrollYProgress }}
      />
      <div
        className={`min-h-screen text-white overflow-x-hidden relative ${(minimalist || isMobileTouch) ? 'cursor-auto' : 'cursor-none'}`}
        style={{ background: "transparent", maxWidth: "100vw" }}
      >
        {!minimalist && !isMobileTouch && <CursorEffect />}
        {!minimalist && <VenomBackground />}
        <Navigation minimalist={minimalist} setMinimalist={setMinimalist} />
        <SectionNavigator minimalist={minimalist} />

        <Hero minimalist={minimalist} setMinimalist={setMinimalist} />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />

        {/* Scroll to top */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-16 right-6 z-50 p-3 group transition-all duration-300"
          style={{
            background: "rgba(220,20,60,0.12)",
            border: "1px solid rgba(220,20,60,0.3)",
            clipPath: "polygon(0 0, calc(100% - 7px) 0, 100% 7px, 100% 100%, 7px 100%, 0 calc(100% - 7px))",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = "rgba(220,20,60,0.2)";
            (e.currentTarget as HTMLElement).style.boxShadow = "0 0 16px rgba(220,20,60,0.3)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = "rgba(220,20,60,0.12)";
            (e.currentTarget as HTMLElement).style.boxShadow = "none";
          }}
          aria-label="Scroll to top"
        >
          <svg className="w-4 h-4 text-[#dc143c] group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      </div>

      {/* Panels */}
      <AnimatePresence mode="wait">
        {gameOpen && (
          <GamePanel 
            key="game-panel"
            open={gameOpen} 
            onClose={() => setGameOpen(false)} 
            isMobile={isMobileTouch}
          />
        )}
        {calOpen && (
          <CalendarPanel 
            key="calendar-panel"
            open={calOpen} 
            onClose={() => setCalOpen(false)} 
            isMobile={isMobileTouch}
          />
        )}
      </AnimatePresence>



      <Terminal />
    </>
  );
}
