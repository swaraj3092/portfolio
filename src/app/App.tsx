import { useEffect, useState } from "react";
import { motion, useScroll } from "motion/react";
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
import { PerspectiveSection } from "./components/PerspectiveSection";

export default function App() {
  const [gameOpen, setGameOpen] = useState(false);
  const [calOpen, setCalOpen] = useState(false);
  const [minimalist, setMinimalist] = useState(false);

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

  return (
    <>
      <Loader />
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-[#dc143c] z-[100] origin-left"
        style={{ scaleX: useScroll().scrollYProgress }}
      />
      <div
        className={`min-h-screen text-white overflow-x-hidden relative ${minimalist ? 'cursor-auto' : 'cursor-none'}`}
        style={{ background: "transparent", maxWidth: "100vw" }}
      >
        {!minimalist && <CursorEffect />}
        {!minimalist && <VenomBackground />}
        <Navigation minimalist={minimalist} setMinimalist={setMinimalist} />
        <SectionNavigator minimalist={minimalist} />

        <div id="home"><PerspectiveSection type="fade"><Hero /></PerspectiveSection></div>
        <div id="about"><PerspectiveSection type="cube"><About /></PerspectiveSection></div>
        <div id="skills"><PerspectiveSection type="stack"><Skills /></PerspectiveSection></div>
        <div id="projects"><PerspectiveSection type="cube"><Projects /></PerspectiveSection></div>
        <div id="experience"><PerspectiveSection type="zoom"><Experience /></PerspectiveSection></div>
        <div id="contact"><PerspectiveSection type="cube"><Contact /></PerspectiveSection></div>

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
      <GamePanel open={gameOpen} onClose={() => setGameOpen(false)} />
      <CalendarPanel open={calOpen} onClose={() => setCalOpen(false)} />
      <Terminal />
    </>
  );
}
