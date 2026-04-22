import { motion } from "motion/react";
import { useEffect, useState, useRef } from "react";
import { Github, Linkedin, Mail, Download } from "lucide-react";
import { Magnetic, RevealText } from "./ui/CreativeComponents";

function GlitchText({ text }: { text: string }) {
  const [glitch, setGlitch] = useState(false);
  const gRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    let tA: ReturnType<typeof setTimeout>;
    let tB: ReturnType<typeof setTimeout>;
    let alive = true;

    const loop = () => {
      tA = setTimeout(() => {
        if (!alive) return;
        gRef.current = {
          x: (Math.random() - 0.5) * 6,
          y: (Math.random() - 0.5) * 3,
        };
        setGlitch(true);
        tB = setTimeout(() => {
          if (!alive) return;
          setGlitch(false);
          loop();
        }, 150);
      }, 2500 + Math.random() * 3500);
    };
    loop();
    return () => { alive = false; clearTimeout(tA); clearTimeout(tB); };
  }, []);

  return (
    <span className="relative inline-block">
      <span className="relative z-10">{text}</span>
      {glitch && (
        <>
          <span
            className="absolute inset-0 z-20 select-none"
            style={{
              color: '#dc143c',
              transform: `translate(${gRef.current.x}px, ${gRef.current.y}px)`,
              clipPath: `inset(${20 + Math.random() * 30}% 0 ${20 + Math.random() * 30}% 0)`,
            }}
          >{text}</span>
          <span
            className="absolute inset-0 z-20 select-none"
            style={{
              color: '#003cdc',
              opacity: 0.45,
              transform: `translate(${-gRef.current.x * 0.8}px, ${gRef.current.y * 0.5}px)`,
              clipPath: `inset(${Math.random() * 50}% 0 ${Math.random() * 25}% 0)`,
            }}
          >{text}</span>
        </>
      )}
    </span>
  );
}

export function Hero({ minimalist, setMinimalist }: { minimalist: boolean; setMinimalist: (val: boolean) => void }) {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const px = (mousePos.x - 0.5) * 18;
  const py = (mousePos.y - 0.5) * 12;

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden scroll-mt-24">
      {/* Dramatic directional light that follows mouse subtly */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 55% 65% at ${58 + px * 0.25}% ${40 + py * 0.2}%, rgba(160,0,18,0.32) 0%, rgba(80,0,8,0.12) 45%, transparent 70%)`,
        }}
      />
      {/* Bottom fade into page */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#060305] to-transparent pointer-events-none" />

      <div className="container mx-auto px-6 z-10 relative pt-12">
        <div className="flex flex-col items-center text-center max-w-6xl mx-auto mt-8 mb-20">

          {/* Vertical status badge on the left */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="fixed left-6 top-1/2 -translate-y-1/2 z-[50] hidden lg:flex flex-col items-center gap-6"
          >
            <div className="w-px h-24 bg-gradient-to-b from-transparent via-[#dc143c] to-transparent opacity-40" />
            <div 
              className="flex flex-col items-center gap-5 py-10 px-3"
              style={{ 
                border: '1px solid rgba(220,20,60,0.3)',
                background: 'rgba(220,20,60,0.05)',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 0 30px rgba(220,20,60,0.15)',
              }}
            >
              <motion.div 
                animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2.5 h-2.5 rounded-full bg-[#dc143c] mb-2 shadow-[0_0_12px_#dc143c]" 
              />
              
              {/* Stacked "OPEN" */}
              <div 
                className="flex flex-col items-center gap-3 text-[#dc143c] font-black"
                style={{ 
                  fontFamily: 'Orbitron, sans-serif', 
                  fontSize: '16px',
                  textShadow: '0 0 10px rgba(220,20,60,0.8)'
                }}
              >
                {['O', 'P', 'E', 'N'].map((char, i) => <span key={i}>{char}</span>)}
              </div>

              {/* Decorative separator */}
              <div className="h-12 w-px bg-gradient-to-b from-transparent via-[#dc143c] to-transparent opacity-50 my-2" />

              {/* Vertical "FOR OPPORTUNITIES" */}
              <div 
                className="text-[#dc143c] tracking-[0.6em] font-bold uppercase opacity-80"
                style={{ 
                  fontFamily: 'Rajdhani, sans-serif', 
                  fontSize: '9px',
                  writingMode: 'vertical-rl',
                  textShadow: '0 0 5px rgba(220,20,60,0.4)'
                }}
              >
                FOR OPPORTUNITIES
              </div>

              <div className="flex flex-col gap-1.5 mt-2 opacity-50">
                <div className="w-1 h-1 bg-[#dc143c] rounded-full" />
                <div className="w-1 h-1 bg-[#dc143c] rounded-full" />
              </div>
            </div>
            <div className="w-px h-24 bg-gradient-to-b from-transparent via-[#dc143c] to-transparent opacity-40" />
          </motion.div>

          {/* Mobile version of status badge */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mb-8 lg:hidden"
          >
            <div
              className="inline-flex items-center gap-3 px-5 py-2"
              style={{
                border: '1px solid rgba(220,20,60,0.35)',
                background: 'rgba(220,20,60,0.04)',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#dc143c] animate-pulse" />
              <span
                className="text-[#dc143c] tracking-[0.45em] uppercase"
                style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '11px' }}
              >
                <RevealText text="Open to Opportunities" />
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ 
              opacity: 1, 
              y: [0, -8, 0],
            }}
            transition={{ 
              opacity: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
              y: { duration: 6, repeat: Infinity, ease: "easeInOut" }
            }}
            style={{ transform: `translate(${px * -0.35}px, ${py * -0.25}px)` }}
            className="relative z-0"
          >
            <h1
              className="text-center"
              style={{
                fontFamily: 'Space Grotesk, Orbitron, sans-serif',
                fontSize: 'clamp(2rem, 12vw, 12rem)',
                fontWeight: 800,
                lineHeight: 0.85,
                letterSpacing: '-0.02em',
                color: '#ffffff',
                textShadow: '0 0 30px rgba(220,20,60,0.4)',
                WebkitTextStroke: '1px rgba(255,255,255,0.1)',
              }}
            >
              <GlitchText text="SWARAJ" />
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ 
              opacity: 1, 
              y: [0, -5, 0],
            }}
            transition={{ 
              opacity: { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.08 },
              y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
            }}
            style={{ transform: `translate(${px * -0.25}px, ${py * -0.18}px)` }}
            className="mb-4 relative z-0"
          >
            <h1
              className="text-center"
              style={{
                fontFamily: 'Space Grotesk, Orbitron, sans-serif',
                fontSize: 'clamp(1.5rem, 8vw, 8rem)',
                fontWeight: 800,
                lineHeight: 1,
                letterSpacing: '0.1em',
                background: 'linear-gradient(to bottom, #dc143c 20%, #8b0000 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 20px rgba(220,20,60,0.5))',
              }}
            >
              KUMAR BEHERA
            </h1>
          </motion.div>

          {/* Horizontal rule */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.45 }}
            className="w-full max-w-xl h-px mb-8"
            style={{
              background: 'linear-gradient(90deg, transparent, #8b0000 25%, #dc143c 50%, #8b0000 75%, transparent)',
              boxShadow: '0 0 16px rgba(220,20,60,0.45)',
            }}
          />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.7 }}
            className="flex flex-wrap gap-y-2 gap-x-0 justify-center mb-10 w-full"
          >
            {['AI / ML Engineer', 'Full Stack Developer', 'Research Engineer'].map((role, i) => (
              <motion.div
                key={role}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 + i * 0.1 }}
                className="flex items-center"
              >
                <span
                  className="px-4 py-1.5 text-gray-400 text-sm md:text-base"
                  style={{ fontFamily: 'Inter, Rajdhani, sans-serif', letterSpacing: '0.05em', fontWeight: 500 }}
                >
                  {role}
                </span>
                {i < 2 && <span className="hidden md:inline text-[#dc143c]/30 text-sm">|</span>}
              </motion.div>
            ))}
          </motion.div>

          {/* Social links */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="flex flex-wrap gap-3 mb-10 justify-center"
          >
            {[
              { icon: Github,   href: 'https://github.com/swaraj3092',                                        label: 'GitHub' },
              { icon: Linkedin, href: 'https://www.linkedin.com/in/swaraj-kumar-behera-b48b07325/',          label: 'LinkedIn' },
              { icon: Mail,     href: 'mailto:swarajbehera923@gmail.com',                                     label: 'Email' },
            ].map(({ icon: Icon, href, label }) => (
              <Magnetic key={label} strength={0.3}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 px-5 py-3 transition-all duration-300"
                  style={{
                    background: 'rgba(8,4,5,0.85)',
                    border: '1px solid rgba(220,20,60,0.2)',
                    backdropFilter: 'blur(8px)',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(220,20,60,0.6)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 0 20px rgba(220,20,60,0.15)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(220,20,60,0.2)';
                    (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                  }}
                >
                  <Icon className="w-4 h-4 text-[#dc143c]" />
                  <span
                    className="text-gray-400 group-hover:text-white transition-colors duration-300"
                    style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '13px', letterSpacing: '0.08em' }}
                  >
                    {label}
                  </span>
                </a>
              </Magnetic>
            ))}
          </motion.div>

          <div className="flex flex-wrap gap-4 justify-center">
            <Magnetic strength={0.2}>
              <motion.button
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.5 }}
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                className="group relative px-10 py-4 overflow-hidden"
                style={{
                  background: '#dc143c',
                  clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))',
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#b01030'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#dc143c'; }}
                aria-label="Scroll to projects section"
              >
                {/* shimmer */}
                <div
                  className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)' }}
                />
                <span
                  className="relative z-10 text-white tracking-[0.3em] uppercase"
                  style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '11px' }}
                >
                  View My Work
                </span>
              </motion.button>
            </Magnetic>

            <Magnetic strength={0.2}>
              <motion.a
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                href="/resume.pdf"
                download="Swaraj_Kumar_Behera_Resume.pdf"
                className="group relative px-10 py-4 overflow-hidden flex items-center justify-center gap-2"
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(220,20,60,0.4)',
                  clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 7px))',
                }}
                whileHover={{ scale: 1.05, borderColor: 'rgba(220,20,60,0.8)', background: 'rgba(220,20,60,0.05)' }}
                whileTap={{ scale: 0.95 }}
                aria-label="Download Swaraj's Resume"
              >
                <Download className="w-4 h-4 text-[#dc143c]" />
                <span
                  className="relative z-10 text-white tracking-[0.3em] uppercase"
                  style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '11px' }}
                >
                  Resume
                </span>
              </motion.a>
            </Magnetic>
          </div>

          {/* New Cinematic Toggle on Home Page */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            className="mt-10"
          >
            <button
              onClick={() => setMinimalist(!minimalist)}
              className="group flex items-center gap-4 px-6 py-2 transition-all duration-300"
              style={{
                background: 'rgba(220,20,60,0.05)',
                border: '1px solid rgba(220,20,60,0.2)',
                backdropFilter: 'blur(10px)',
                borderRadius: '2px'
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(220,20,60,0.6)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(220,20,60,0.2)'; }}
            >
              <div className={`w-2 h-2 rounded-full transition-all duration-500 ${!minimalist ? 'bg-[#dc143c] shadow-[0_0_10px_#dc143c]' : 'bg-gray-600'}`} />
              <span className="text-[9px] tracking-[0.4em] uppercase text-white opacity-80 group-hover:opacity-100" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                {minimalist ? 'ENABLE CINEMATIC EFFECTS' : 'CINEMATIC MODE ACTIVE'}
              </span>
            </button>
          </motion.div>

          {/* Scroll hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="mt-20 flex flex-col items-center gap-2"
          >
            <div className="w-px h-14 relative overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 w-full"
                style={{ height: '55%', background: 'linear-gradient(to bottom, #dc143c, transparent)' }}
                animate={{ y: ['0%', '200%'] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
              />
            </div>
            <span
              className="text-[#dc143c]/40 tracking-[0.4em] uppercase"
              style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '9px' }}
            >
              Scroll
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
