import { motion, useInView, AnimatePresence } from "motion/react";
import { useRef, useState, useEffect } from "react";
import { Mail, Phone, MapPin, Send, Github, Linkedin, CheckCircle, Zap, Code2, Globe } from "lucide-react";
import { SectionTitle } from "./SectionTitle";

// ── Animated counter ─────────────────────────────────────────
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = to / 50;
    const timer = setInterval(() => {
      start += step;
      if (start >= to) { setVal(to); clearInterval(timer); }
      else setVal(Math.round(start));
    }, 28);
    return () => clearInterval(timer);
  }, [inView, to]);

  return <span ref={ref}>{val}{suffix}</span>;
}

// ── Floating particles ────────────────────────────────────────
function ContactParticles() {
  const particles = useRef<{ id: number; x: number; size: number; delay: number; dur: number }[]>(
    Array.from({ length: 20 }, (_, i) => ({
      id: i, x: Math.random() * 100, size: 1 + Math.random() * 2.5, delay: Math.random() * 6, dur: 5 + Math.random() * 8,
    }))
  );
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.current.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{ left: `${p.x}%`, bottom: 0, width: p.size, height: p.size, background: '#dc143c', opacity: 0 }}
          animate={{ y: [0, -(400 + Math.random() * 400)], opacity: [0, 0.6, 0] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}

// ── Stat card ─────────────────────────────────────────────────
function StatCard({ icon: Icon, to, suffix, label }: { icon: React.ElementType; to: number; suffix: string; label: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7 }}
      className="group relative flex flex-col items-center gap-2 p-6"
      style={{ background: 'rgba(8,4,6,0.9)', border: '1px solid rgba(220,20,60,0.12)', clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))' }}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: 'radial-gradient(circle at 50% 0%, rgba(220,20,60,0.09), transparent 65%)' }}
      />
      <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: 'linear-gradient(90deg, transparent, #dc143c, transparent)' }}
      />
      <Icon className="w-5 h-5 text-[#dc143c] group-hover:scale-110 transition-transform duration-300" />
      <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(1.4rem,3vw,2rem)', color: '#fff', fontWeight: 700, lineHeight: 1 }}>
        <Counter to={to} suffix={suffix} />
      </div>
      <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '11px', color: '#999', letterSpacing: '0.2em' }}>{label}</div>
    </motion.div>
  );
}

// ── Magnetic input wrapper ────────────────────────────────────
function MagneticInput({ children, focused }: { children: React.ReactNode; focused: boolean }) {
  return (
    <div className="relative">
      <div
        className="absolute inset-0 transition-all duration-400 pointer-events-none"
        style={{
          borderBottom: `1px solid ${focused ? '#dc143c' : 'rgba(220,20,60,0.15)'}`,
          boxShadow: focused ? '0 2px 20px rgba(220,20,60,0.15)' : 'none',
        }}
      />
      {focused && (
        <motion.div
          className="absolute bottom-0 left-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, #dc143c, transparent)' }}
          initial={{ width: '0%', left: '50%' }}
          animate={{ width: '100%', left: '0%' }}
          transition={{ duration: 0.35 }}
        />
      )}
      {children}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────
export function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [focused, setFocused] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY,
          subject: `VENOM_SIGNAL: Transmission from ${formData.name}`,
          from_name: "PORTFOLIO_LINK",
          name: formData.name,
          email: formData.email,
          message: `
[ SYSTEM LOG: INCOMING TRANSMISSION ]
=============================================
ID: VENOM_${Math.floor(Math.random() * 9000) + 1000}
TIMESTAMP: ${new Date().toISOString()}
---------------------------------------------
OPERATOR: ${formData.name.toUpperCase()}
SOURCE: ${formData.email}
---------------------------------------------
DATA_CONTENT:
"${formData.message}"
---------------------------------------------
[ STATUS: RECEIVED / UNREAD ]
=============================================
          `,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setSent(true);
        // Play transmission sent sound
        const { soundManager } = await import("../utils/sounds");
        soundManager.play('send', 0.6);
        setFormData({ name: '', email: '', message: '' });
      } else {
        console.error("Web3Forms Error:", result.message);
        alert("Transmission failed. Please try again or use the direct email link.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Submission failed. Please check your connection.");
    } finally {
      setSending(false);
    }
  };

  const inputBase = {
    width: '100%', background: 'transparent', border: 'none', outline: 'none',
    color: '#e5e7eb', fontFamily: 'Rajdhani, sans-serif', fontSize: '15px', padding: '10px 0',
  };

  const contactLinks = [
    { icon: Mail, label: 'Email', value: 'swarajbehera923@gmail.com', href: 'mailto:swarajbehera923@gmail.com', color: '#dc143c' },
    { icon: Phone, label: 'Phone', value: '+91 9178773834', href: 'tel:+919178773834', color: '#dc143c' },
    { icon: MapPin, label: 'Location', value: 'Bhubaneswar, Odisha', href: null, color: '#dc143c' },
  ];

  const socials = [
    { icon: Github, label: 'GitHub', href: 'https://github.com/swaraj3092', sub: 'swaraj3092' },
    { icon: Linkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/in/swaraj-kumar-behera-b48b07325/', sub: 'Connect' },
    { icon: Globe, label: 'Portfolio', href: 'https://skb-folio.vercel.app', sub: 'Source_Asset' },
  ];

  return (
    <section id="contact" className="pt-0 pb-32 -mt-8 relative overflow-hidden scroll-mt-24">
      <ContactParticles />

      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 50% 60% at 60% 60%, rgba(80,0,12,0.12) 0%, transparent 65%)' }}
      />

      {/* Horizontal lines decoration */}
      <div className="absolute left-0 top-1/3 w-24 h-px pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent, rgba(220,20,60,0.3))' }} />
      <div className="absolute right-0 bottom-1/3 w-24 h-px pointer-events-none" style={{ background: 'linear-gradient(270deg, transparent, rgba(220,20,60,0.3))' }} />

      <div className="container mx-auto px-6 relative z-10" ref={ref}>
        <motion.div initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}>
          <SectionTitle label="CONTACT" sub="Bond" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.3 }}
          className="text-center mb-5 -mt-10 font-semibold"
          style={{ fontFamily: 'Rajdhani, sans-serif', color: '#f3f4f6', fontSize: '15px', letterSpacing: '0.15em' }}
        >
          [ INITIATING_CONNECTION_PROTOCOL ]
        </motion.p>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.4, duration: 0.7 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto mb-16"
        >
          <StatCard icon={Zap} to={24} suffix="hr" label="RESPONSE TIME" />
          <StatCard icon={Code2} to={12} suffix="+" label="PROJECTS DONE" />
          <StatCard icon={Globe} to={2} suffix="+" label="INTERNSHIPS" />
          <StatCard icon={CheckCircle} to={100} suffix="%" label="COMMITMENT" />
        </motion.div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-5 gap-10 max-w-6xl mx-auto">

          {/* Left: info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.9, delay: 0.35 }}
            className="lg:col-span-2 space-y-4"
          >
            {/* Intro text */}
            <div className="mb-8">
              <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(1.2rem, 5vw, 1.6rem)', color: '#fff', lineHeight: 1.4, marginBottom: '12px' }}>
                Ready to <span style={{ color: '#dc143c' }}>collaborate?</span>
              </div>
              <p style={{ fontFamily: 'Rajdhani, sans-serif', color: '#f3f4f6', lineHeight: 1.7, fontSize: '15px', fontWeight: 500 }}>
                Whether it's an AI system, a full-stack platform, or a research project —
                I'm ready to architect ambitious solutions for your next big idea.
              </p>
            </div>

            {/* Contact cards */}
            {contactLinks.map(({ icon: Icon, label, value, href }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: -20 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.5 + i * 0.1 }}
                className="group relative"
              >
                <div
                  className="flex items-center gap-4 p-4 transition-all duration-400 relative overflow-hidden"
                  style={{ background: 'rgba(8,4,6,0.9)', border: '1px solid rgba(220,20,60,0.1)', clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))' }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(220,20,60,0.35)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 0 20px rgba(220,20,60,0.06)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(220,20,60,0.1)';
                    (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                  }}
                >
                  {/* Slide in shine */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(220,20,60,0.04), transparent)' }}
                  />
                  {/* Left accent */}
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                    style={{ background: 'linear-gradient(to bottom, transparent, #dc143c, transparent)' }}
                  />
                  <div
                    className="w-10 h-10 flex items-center justify-center shrink-0"
                    style={{ border: '1px solid rgba(220,20,60,0.25)', background: 'rgba(220,20,60,0.06)', clipPath: 'polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 5px 100%, 0 calc(100% - 5px))' }}
                  >
                    <Icon className="w-4 h-4 text-[#dc143c]" />
                  </div>
                  <div className="relative z-10">
                    <div className="text-[9px] tracking-[0.3em] uppercase text-[#dc143c]/70 mb-0.5" style={{ fontFamily: 'Rajdhani, sans-serif' }}>{label}</div>
                    {href
                      ? <a href={href} className="text-gray-100 font-bold hover:text-[#dc143c] transition-colors duration-200 text-sm" style={{ fontFamily: 'Rajdhani, sans-serif' }}>{value}</a>
                      : <p className="text-gray-100 font-bold text-sm" style={{ fontFamily: 'Rajdhani, sans-serif' }}>{value}</p>
                    }
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Socials */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.8 }}
              className="grid grid-cols-3 gap-3 pt-2"
            >
              {socials.map(({ icon: Icon, label, href, sub }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center gap-2 p-4 transition-all duration-400 relative overflow-hidden"
                  style={{ background: 'rgba(8,4,6,0.9)', border: '1px solid rgba(220,20,60,0.1)', clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(220,20,60,0.4)';
                    (e.currentTarget as HTMLElement).style.background = 'rgba(220,20,60,0.06)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(220,20,60,0.1)';
                    (e.currentTarget as HTMLElement).style.background = 'rgba(8,4,6,0.9)';
                  }}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: 'radial-gradient(circle at 50% 100%, rgba(220,20,60,0.1), transparent 70%)' }}
                  />
                  <Icon className="w-5 h-5 text-[#dc143c] group-hover:scale-110 transition-transform duration-300 relative z-10" />
                  <div className="text-center relative z-10">
                    <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '11px', color: '#cbd5e1', letterSpacing: '0.1em' }}>{sub}</div>
                  </div>
                </a>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.9, delay: 0.45 }}
            className="lg:col-span-3"
          >
            <div
              className="relative overflow-hidden"
              style={{ 
                background: 'linear-gradient(145deg, rgba(10,4,6,0.65) 0%, rgba(6,2,4,0.5) 100%)', 
                border: '1px solid rgba(220,20,60,0.25)', 
                backdropFilter: 'blur(16px)',
                clipPath: 'polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 24px 100%, 0 calc(100% - 24px))' 
              }}
            >
              {/* Top accent bar */}
              <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: 'linear-gradient(90deg, #dc143c, #8b0000, transparent 80%)' }} />

              {/* Corner decoration */}
              <div className="absolute top-0 right-0 w-24 h-24 pointer-events-none overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 border-t border-r border-[#dc143c]/20" />
                <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-[#dc143c]/40" />
              </div>
              <div className="absolute bottom-0 left-0 w-24 h-24 pointer-events-none overflow-hidden">
                <div className="absolute bottom-0 left-0 w-20 h-20 border-b border-l border-[#dc143c]/20" />
              </div>

              {/* Bio-Scanner Scanline */}
              {isInView && (
                <motion.div 
                  className="absolute left-0 right-0 h-[2px] z-20 pointer-events-none"
                  initial={{ top: 0, opacity: 0 }}
                  animate={{ top: ['0%', '100%'], opacity: [0, 1, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  style={{ background: 'linear-gradient(90deg, transparent, #dc143c, transparent)', boxShadow: '0 0 15px #dc143c' }}
                />
              )}

              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-12 flex flex-col items-center justify-center gap-6 min-h-[460px] relative overflow-hidden"
                  >
                    {/* Background scanlines for success */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                      style={{ backgroundImage: 'linear-gradient(0deg, transparent 0%, #dc143c 50%, transparent 100%)', backgroundSize: '100% 4px' }}
                    />

                    <motion.div
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                      className="relative"
                    >
                      <div className="w-24 h-24 flex items-center justify-center relative"
                        style={{
                          background: 'rgba(220,20,60,0.05)',
                          border: '2px solid #dc143c',
                          clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)',
                          boxShadow: '0 0 30px rgba(220,20,60,0.2), inset 0 0 20px rgba(220,20,60,0.1)'
                        }}
                      >
                        <CheckCircle className="w-10 h-10 text-[#dc143c]" />
                      </div>

                      {/* Geometric orbiters */}
                      {[0, 1].map(i => (
                        <motion.div
                          key={i}
                          className="absolute inset-0 border border-[#dc143c]/30"
                          style={{ clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)' }}
                          animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.1, 0.3], rotate: i === 0 ? 360 : -360 }}
                          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                        />
                      ))}
                    </motion.div>

                    <div className="text-center relative z-10">
                      <motion.h3
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '20px', color: '#fff', letterSpacing: '0.2em', marginBottom: '16px' }}
                      >
                        CONNECTION ESTABLISHED
                      </motion.h3>
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="h-px w-24 mx-auto mb-6"
                        style={{ background: 'linear-gradient(90deg, transparent, #dc143c, transparent)' }}
                      />
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        style={{ fontFamily: 'Rajdhani, sans-serif', color: '#d1d5db', fontSize: '15px', lineHeight: 1.6, maxWidth: '300px', margin: '0 auto' }}
                      >
                        The transmission was successful. My neural network will process your request and respond within 24 hours.
                      </motion.p>
                    </div>

                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 }}
                      onClick={() => setSent(false)}
                      className="mt-4 px-10 py-3 text-white text-[10px] tracking-[0.3em] uppercase transition-all duration-300 relative group"
                      style={{ 
                        fontFamily: 'Orbitron, sans-serif',
                        background: 'rgba(220,20,60,0.1)',
                        border: '1px solid rgba(220,20,60,0.3)',
                        clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))'
                      }}
                      whileHover={{ scale: 1.05, background: 'rgba(220,20,60,0.2)' }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Return to Interface
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={handleSubmit} className="p-8 space-y-8">
                    {/* Name + Email */}
                    <div className="grid sm:grid-cols-2 gap-6">
                      {[
                        { field: 'name', label: 'Your Name', type: 'text', placeholder: 'Swaraj...' },
                        { field: 'email', label: 'Email', type: 'email', placeholder: 'you@domain.com' },
                      ].map(({ field, label, type, placeholder }) => (
                        <div key={field}>
                          <label className="block text-[9px] tracking-[0.3em] uppercase mb-3" style={{ fontFamily: 'Rajdhani, sans-serif', color: focused === field ? '#dc143c' : '#f87171', transition: 'color 0.3s' }}>
                            {label}
                          </label>
                          <MagneticInput focused={focused === field}>
                            <input
                              type={type}
                              required
                              value={(formData as any)[field]}
                              onChange={e => setFormData({ ...formData, [field]: e.target.value })}
                              onFocus={() => setFocused(field)}
                              onBlur={() => setFocused(null)}
                              placeholder={placeholder}
                              style={{ ...inputBase }}
                              className="placeholder:text-gray-400"
                            />
                          </MagneticInput>
                        </div>
                      ))}
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-[9px] tracking-[0.3em] uppercase mb-3" style={{ fontFamily: 'Rajdhani, sans-serif', color: focused === 'message' ? '#dc143c' : '#f87171', transition: 'color 0.3s' }}>
                        Message
                      </label>
                      <MagneticInput focused={focused === 'message'}>
                        <textarea
                          required
                          value={formData.message}
                          onChange={e => setFormData({ ...formData, message: e.target.value })}
                          onFocus={() => setFocused('message')}
                          onBlur={() => setFocused(null)}
                          rows={5}
                          placeholder="Tell me about your project, idea, or opportunity…"
                          style={{ ...inputBase, resize: 'none', lineHeight: 1.6 }}
                          className="placeholder:text-gray-400"
                        />
                      </MagneticInput>
                    </div>

                    {/* Submit */}
                    <motion.button
                      type="submit"
                      disabled={sending}
                      className="group relative w-full py-4 overflow-hidden text-white text-xs tracking-[0.3em] uppercase"
                      style={{ background: '#dc143c', fontFamily: 'Orbitron, sans-serif', clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))' }}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#b8102a'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#dc143c'; }}
                    >
                      {/* Shimmer */}
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)' }}
                      />
                      <AnimatePresence mode="wait">
                        {sending ? (
                          <motion.div key="sending" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center gap-3 relative z-10">
                            <motion.div
                              className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                            />
                            <span>Transmitting…</span>
                          </motion.div>
                        ) : (
                          <motion.div key="send" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center gap-3 relative z-10">
                            <span>Initiate Contact</span>
                            <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>

                    {/* Disclaimer */}
                    <p className="text-center text-[10px] tracking-widest font-semibold" style={{ fontFamily: 'Rajdhani, sans-serif', color: '#d1d5db' }}>
                      Opens your email client · Response within 24 hours
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 1.1 }}
          className="text-center mt-28"
        >
          <div className="flex items-center gap-4 justify-center mb-6">
            <div className="h-px flex-1 max-w-32" style={{ background: 'linear-gradient(90deg, transparent, rgba(220,20,60,0.3))' }} />
            <div className="w-1.5 h-1.5 rounded-full bg-[#dc143c]/40" />
            <div className="h-px flex-1 max-w-32" style={{ background: 'linear-gradient(270deg, transparent, rgba(220,20,60,0.3))' }} />
          </div>
          <p className="text-[10px] tracking-[0.35em] uppercase font-bold" style={{ fontFamily: 'Rajdhani, sans-serif', color: '#f1f5f9' }}>
            © {new Date().getFullYear()} Swaraj Kumar Behera · ENGINEERED FOR THE HUD
          </p>
        </motion.div>
      </div>
    </section>
  );
}