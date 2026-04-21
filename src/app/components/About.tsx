import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import { GraduationCap, Award, FileText } from "lucide-react";
import { SectionTitle } from "./SectionTitle";
import { AnimatedBackground } from "./AnimatedBackground";
import { RevealText, SectionReveal } from "./ui/CreativeComponents";

export function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const stats = [
    { value: '92.5%', label: 'AI Model Accuracy' },
    { value: '8.40', label: 'CGPA at KIIT' },
    { value: '2', label: 'Internships' },
  ];

  return (
    <section id="about" className="pt-0 pb-32 -mt-20 relative overflow-hidden scroll-mt-24">
      <AnimatedBackground />
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 20% 50%, rgba(100,0,15,0.12) 0%, transparent 60%)',
        }}
      />

      <div className="container mx-auto px-6 relative z-10" ref={ref}>
        <SectionReveal>
          <SectionTitle label="ABOUT ME" sub="The Host" />
        </SectionReveal>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 max-w-3xl mx-auto">
          {stats.map((s, i) => (
            <SectionReveal key={s.label} delay={0.2 + i * 0.1}>
              <div
                className="group relative text-center py-6 px-4"
                style={{
                  background: 'rgba(10,5,5,0.15)',
                  border: '1px solid rgba(220,20,60,0.25)',
                  backdropFilter: 'blur(10px)',
                  clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
                }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: 'radial-gradient(circle at 50% 50%, rgba(220,20,60,0.08), transparent)' }}
                />
                <div
                  className="text-3xl md:text-4xl text-[#dc143c] mb-1"
                  style={{ fontFamily: 'Orbitron, sans-serif', textShadow: '0 0 20px rgba(220,20,60,0.5)' }}
                >
                  {s.value}
                </div>
                <div className="text-xs text-gray-300 tracking-wider uppercase font-semibold" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                  {s.label}
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* Bio text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.3 }}
          >
            <div className="relative">
              <div
                className="absolute left-0 top-0 bottom-0 w-[2px]"
                style={{ background: 'linear-gradient(180deg, #dc143c, rgba(220,20,60,0.1))' }}
              />
              <div
                className="relative pl-8 pr-6 py-8"
                style={{
                  background: 'linear-gradient(135deg, rgba(15,5,8,0.7) 0%, rgba(8,3,5,0.6) 100%)',
                  border: '1px solid rgba(220,20,60,0.25)',
                  backdropFilter: 'blur(16px)',
                  borderLeft: 'none',
                }}
              >
                <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[#dc143c]/40" />
                <div className="absolute bottom-0 left-8 w-8 h-8 border-b border-l border-[#dc143c]/20" />

                {/* Professional Headshot */}
                <div className="flex justify-center mb-6">
                  <motion.div
                    className="relative group/photo cursor-pointer"
                    whileHover={{ y: -8, scale: 1.03 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    {/* Animated rotating rings */}
                    <motion.div
                      className="absolute inset-0 -m-3 pointer-events-none"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    >
                      <div className="absolute inset-0 rounded-full" style={{ border: '1px dashed rgba(220,20,60,0.3)' }} />
                    </motion.div>
                    <motion.div
                      className="absolute inset-0 -m-6 pointer-events-none"
                      animate={{ rotate: -360 }}
                      transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                    >
                      <div className="absolute inset-0 rounded-full" style={{ border: '1px dotted rgba(220,20,60,0.2)' }} />
                    </motion.div>

                    {/* Glow effects */}
                    <div
                      className="absolute inset-0 -m-2 rounded-full blur-xl opacity-0 group-hover/photo:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{ background: 'radial-gradient(circle, rgba(220,20,60,0.4), transparent 70%)' }}
                    />
                    <div
                      className="absolute inset-0 -m-4 rounded-full blur-2xl opacity-0 group-hover/photo:opacity-100 transition-opacity duration-700 pointer-events-none"
                      style={{ background: 'radial-gradient(circle, rgba(220,20,60,0.2), transparent 70%)' }}
                    />

                    {/* Photo container */}
                    <div
                      className="relative w-40 h-40 overflow-hidden rounded-full transition-all duration-500 group-hover/photo:shadow-2xl"
                      style={{
                        border: '3px solid rgba(220,20,60,0.5)',
                        boxShadow: '0 0 30px rgba(220,20,60,0.3), inset 0 0 20px rgba(0,0,0,0.5)',
                      }}
                    >
                      <img
                        src="/profile.jpg"
                        alt="Headshot of Swaraj Kumar Behera"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover/photo:scale-110"
                        style={{ filter: 'grayscale(0.2) contrast(1.1)' }}
                      />
                      
                      {/* Biometric Scanline */}
                      <motion.div 
                        className="absolute inset-0 z-20 pointer-events-none"
                        animate={{ y: ['-100%', '200%'] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        style={{
                          background: 'linear-gradient(to bottom, transparent, rgba(220,20,60,0.4), transparent)',
                          height: '20px'
                        }}
                      />

                      {/* Subtle Glitch Overlay (Active on hover) */}
                      <motion.div 
                        className="absolute inset-0 bg-[#dc143c]/10 mix-blend-overlay opacity-0 group-hover/photo:opacity-100 pointer-events-none z-30"
                        animate={{ 
                          x: [-2, 2, -1, 3, 0],
                          opacity: [0, 0.4, 0.1, 0.5, 0]
                        }}
                        transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3 }}
                      />

                      {/* Overlay gradient */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover/photo:opacity-100 transition-opacity duration-500"
                        style={{ background: 'radial-gradient(circle at 30% 30%, rgba(220,20,60,0.15), transparent 60%)' }}
                      />
                    </div>

                    {/* Floating particles (Now always active) */}
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 rounded-full bg-[#dc143c] opacity-30 pointer-events-none"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                          y: [0, -40, 0],
                          x: [0, (i % 2 === 0 ? 20 : -20), 0],
                          opacity: [0.1, 0.6, 0.1],
                          scale: [1, 1.5, 1]
                        }}
                        transition={{
                          duration: 3 + i,
                          repeat: Infinity,
                          delay: i * 0.5,
                        }}
                      />
                    ))}

                    {/* Corner accents */}
                    <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[#dc143c] opacity-60" />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-[#dc143c] opacity-60" />
                  </motion.div>
                </div>

                <p className="text-gray-100 leading-relaxed mb-5 text-base font-medium" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                  Software Engineer specializing in AI/ML, full-stack development, and automation. Published researcher with{' '}
                  <span className="text-[#dc143c] font-bold" style={{ textShadow: '0 0 15px rgba(220,20,60,0.6)' }}>
                    92.5% accuracy
                  </span>{' '}
                  in custom CNN-based cattle breed classification — paper under review. Built production systems serving 100+ daily users and reduced manual workflows by 40%.
                </p>
                <p className="text-gray-200 leading-relaxed mb-5 text-base" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                  Currently at USC.KIIT building ML-driven analytics pipelines for 10+ faculty. Top 30 finisher at ICDCIT KIIT Hackathon, Top 10 at CodeSprint 2.0 (200+ participants), and Smart India Hackathon participant. Maintainer of 4 live projects including EduPilot, an AI-powered study abroad platform with gamification engine.
                </p>
                <p className="text-gray-200 leading-relaxed text-base" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                  Seeking full-time opportunities in software engineering, AI/ML, backend systems, or data engineering where I can ship production code, optimize at scale, and solve real problems.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Info cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="space-y-5"
          >
            {[
              {
                icon: GraduationCap,
                title: 'Education',
                lines: ['KIIT University — B.Tech CSE', 'CGPA: 8.40 / 10.0'],
              },
              {
                icon: Award,
                title: 'Achievements',
                lines: [
                  'Top 30 — ICDCIT KIIT Hackathon',
                  'Top 10 — CodeSprint 2.0 (200+ participants)',
                  'Smart India Hackathon Participant',
                ],
              },
              {
                icon: FileText,
                title: 'Research',
                lines: [
                  'Published: AI cattle breed classification',
                  '92.5% accuracy | Paper under review'
                ],
                links: [
                  { label: 'View Draft', href: 'https://github.com/swaraj3092/animal_breed_classification/blob/main/research_paper_draft.pdf' },
                  { label: 'Dataset', href: 'https://github.com/swaraj3092/animal_breed_classification/tree/main/dataset_info' }
                ]
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.5 + i * 0.15 }}
                className="group relative"
              >
                <div
                  className="relative flex gap-4 items-start p-5 transition-all duration-400"
                  style={{
                    background: 'rgba(10,4,6,0.4)',
                    border: '1px solid rgba(220,20,60,0.25)',
                    backdropFilter: 'blur(8px)',
                    clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)',
                  }}
                >
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                    style={{ background: 'radial-gradient(circle at 0 50%, rgba(220,20,60,0.07), transparent 60%)' }}
                  />
                  <div
                    className="shrink-0 w-10 h-10 flex items-center justify-center border border-[#dc143c]/30 group-hover:border-[#dc143c]/70 transition-colors duration-300"
                    style={{ background: 'rgba(220,20,60,0.06)' }}
                  >
                    <item.icon className="w-5 h-5 text-[#dc143c]" />
                  </div>
                  <div className="relative z-10">
                    <div
                      className="text-white text-sm tracking-wider uppercase mb-1.5"
                      style={{ fontFamily: 'Orbitron, sans-serif' }}
                    >{item.title}</div>
                    {item.lines.map((l) => (
                      <div key={l} className="text-sm text-gray-200 leading-relaxed font-medium" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                        {l}
                      </div>
                    ))}
                    {item.links && (
                      <div className="flex gap-4 mt-2">
                        {item.links.map(link => (
                          <a
                            key={link.label}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-[#dc143c] hover:underline uppercase tracking-widest"
                            style={{ fontFamily: 'Orbitron, sans-serif' }}
                          >
                            {link.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
