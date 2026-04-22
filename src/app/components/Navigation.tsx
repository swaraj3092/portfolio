import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { Menu, X, Gamepad2, Calendar, Download, Zap, ZapOff, Terminal, Settings2, Monitor, Smartphone, Volume2, VolumeX } from "lucide-react";
import { Magnetic } from "./ui/CreativeComponents";
import { soundManager } from "../utils/sounds";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" }
];

export function Navigation({ minimalist, setMinimalist }: { minimalist: boolean; setMinimalist: (v: boolean) => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [soundEnabled, setSoundEnabled] = useState(soundManager.isEnabled());

  const toggleSound = () => {
    const enabled = soundManager.toggle();
    setSoundEnabled(enabled);
    if (enabled) soundManager.playSuccess();
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Robust active section detection
      const scrollPos = window.scrollY + 120; // 120px buffer for early highlighting
      const sections = navItems.map(item => item.href.slice(1));
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && scrollPos >= el.offsetTop) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id.replace('#', ''));
    if (el) {
      const offset = 80;
      const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#0a0a0a]/95 backdrop-blur-lg border-b border-[#dc143c]/20"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-2xl cursor-pointer"
              onClick={() => scrollToSection("#home")}
            >
              <span className="text-[#dc143c]">SK</span>
              <span className="text-white">B</span>
            </motion.div>

            <div className="hidden md:flex items-center gap-3">
              {['home', 'about', 'skills', 'projects', 'experience', 'contact'].map((id) => (
                <Magnetic key={id} strength={0.2}>
                  <a
                    href={`#${id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(id);
                    }}
                    className={`relative px-4 py-2 text-xs tracking-[0.25em] uppercase transition-all duration-300 ${
                      activeSection === id ? 'text-[#dc143c]' : 'text-gray-400 hover:text-white'
                    }`}
                    style={{ fontFamily: 'Orbitron, sans-serif' }}
                  >
                    {id}
                    {activeSection === id && (
                      <motion.div
                        layoutId="nav-active"
                        className="absolute bottom-0 left-4 right-4 h-[2px] bg-[#dc143c]"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </a>
                </Magnetic>
              ))}

              <div className="w-px h-6 bg-[#dc143c]/20 mx-2" />

              <button
                onClick={() => setMinimalist(!minimalist)}
                className="relative p-2 text-gray-400 hover:text-[#dc143c] transition-colors duration-300 group"
                title={minimalist ? "Enable Visual Effects" : "Disable Visual Effects (Minimalist Mode)"}
                aria-label={minimalist ? "Enable visual effects" : "Disable visual effects"}
              >
                {minimalist ? <Zap className="w-4 h-4" /> : <ZapOff className="w-4 h-4" />}
                {minimalist && <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#dc143c] rounded-full animate-pulse" />}
              </button>

              <button
                onClick={toggleSound}
                className="relative p-2 text-gray-400 hover:text-[#dc143c] transition-colors duration-300 group"
                title={soundEnabled ? "Mute Tactical Audio" : "Unmute Tactical Audio"}
                aria-label={soundEnabled ? "Mute audio" : "Unmute audio"}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-[#dc143c]" /> : <VolumeX className="w-4 h-4" />}
                {!soundEnabled && <span className="absolute -top-1 -right-1 w-2 h-2 bg-gray-500 rounded-full" />}
              </button>

              <button
                onClick={() => window.dispatchEvent(new CustomEvent('open-panel', { detail: { panel: 'game' } }))}
                className="relative p-2 text-gray-400 hover:text-[#dc143c] transition-colors duration-300 group"
                title="Play Symbiote Invaders"
                aria-label="Play Symbiote Invaders game"
              >
                <Gamepad2 className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#dc143c] rounded-full animate-pulse" />
              </button>

              <button
                onClick={() => window.dispatchEvent(new CustomEvent('open-panel', { detail: { panel: 'calendar' } }))}
                className="relative p-2 text-gray-400 hover:text-[#dc143c] transition-colors duration-300 group"
                title="View Schedule & Resume"
                aria-label="View schedule and resume panel"
              >
                <Calendar className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#dc143c] rounded-full animate-pulse" />
              </button>

              <a
                href="/resume.pdf"
                download="Swaraj_Kumar_Behera_Resume.pdf"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white transition-all duration-300"
                style={{
                  background: '#dc143c',
                  clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
                  fontFamily: 'Rajdhani, sans-serif',
                  letterSpacing: '0.1em',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#b01030'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#dc143c'; }}
              >
                <Download className="w-3 h-3" />
                RESUME
              </a>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden relative z-50 p-2 text-white hover:text-[#dc143c] transition-colors"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed inset-0 z-40 bg-[#0a0a0a]/98 backdrop-blur-lg md:hidden"
          style={{ marginTop: '72px' }}
        >
          <div className="container mx-auto px-6 py-8">
            <div className="flex flex-col gap-6">
              {navItems.map((item, idx) => (
                <motion.button
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => scrollToSection(item.href)}
                  className={`text-left text-2xl py-3 border-b border-[#dc143c]/20 transition-colors ${
                    activeSection === item.href.slice(1)
                      ? "text-[#dc143c]"
                      : "text-gray-400"
                  }`}
                >
                  {item.label}
                </motion.button>
              ))}

              <div className="pt-4 space-y-3">
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  onClick={() => setMinimalist(!minimalist)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left border border-[#dc143c]/30 text-gray-300 hover:text-white transition-colors"
                  style={{ fontFamily: 'Rajdhani, sans-serif' }}
                >
                  <div className="flex items-center gap-3">
                    {minimalist ? <Zap className="w-5 h-5 text-[#dc143c]" /> : <ZapOff className="w-5 h-5 text-[#dc143c]" />}
                    <span>{minimalist ? "Enable Effects" : "Minimalist Mode"}</span>
                  </div>
                  {minimalist && <div className="w-2 h-2 bg-[#dc143c] rounded-full animate-pulse" />}
                </motion.button>

                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                  onClick={() => { window.dispatchEvent(new CustomEvent('open-panel', { detail: { panel: 'game' } })); setMobileMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left border border-[#dc143c]/30 text-gray-300 hover:text-white transition-colors"
                  style={{ fontFamily: 'Rajdhani, sans-serif' }}
                >
                  <Gamepad2 className="w-5 h-5 text-[#dc143c]" />
                  Play Symbiote Invaders
                </motion.button>

                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  onClick={() => { window.dispatchEvent(new CustomEvent('open-panel', { detail: { panel: 'calendar' } })); setMobileMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left border border-[#dc143c]/30 text-gray-300 hover:text-white transition-colors"
                  style={{ fontFamily: 'Rajdhani, sans-serif' }}
                >
                  <Calendar className="w-5 h-5 text-[#dc143c]" />
                  View Schedule & Resume
                </motion.button>

                <motion.a
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 }}
                  href="/resume.pdf"
                  download="Swaraj_Kumar_Behera_Resume.pdf"
                  className="w-full flex items-center justify-center gap-2 px-4 py-4 text-white text-sm"
                  style={{
                    background: '#dc143c',
                    clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
                    fontFamily: 'Rajdhani, sans-serif',
                    letterSpacing: '0.1em',
                  }}
                >
                  <Download className="w-4 h-4" />
                  DOWNLOAD RESUME
                </motion.a>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}
