import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef, useState } from "react";
import { ExternalLink, Github, Zap, Eye, Brain, MessageSquare, Gamepad2, FileText } from "lucide-react";
import { SectionTitle } from "./SectionTitle";
import { TiltedCard, SectionReveal } from "./ui/CreativeComponents";

const projects = [
  {
    title: "EduPilot",
    subtitle: "AI-Powered Study Abroad Navigator",
    period: "2024 — TenzorX",
    category: "Full-Stack",
    description: "Gamified platform simplifying studying abroad. Features admission probability analysis, AI essay coaching, and personalized ROI calculators with real-time gamification.",
    tech: ["React", "FastAPI", "Gemini AI", "Supabase"],
    metrics: ["Full-Stack Platform", "Gemini Pro", "Gamification"],
    icon: Zap,
    tag: "HACKATHON",
    badge: "WINNER",
    github: "https://github.com/swaraj3092/EduPilot",
    demo: "https://edu-pilot-tau.vercel.app/",
  },
  {
    title: "Speech Emotion",
    subtitle: "& Stress Detection System",
    period: "2026 — Present",
    category: "AI/ML",
    description: "Hybrid CNN + BiLSTM architecture for detecting emotion and stress from speech signals. CNN extracts spatial features while BiLSTM captures temporal patterns.",
    tech: ["CNN", "BiLSTM", "Signal Processing"],
    metrics: ["Target: 85%+ acc", "6+ classes", "Hybrid Model"],
    icon: Brain,
    tag: "AI/ML",
    github: "https://github.com/swaraj3092/Speech-Emotion-Stress-Detection-CNN-BiLSTM",
    demo: null,
  },
  {
    title: "Cattle Breed AI",
    subtitle: "Classification at 92.5% Accuracy",
    period: "2024 — 2025",
    category: "Research",
    description: "Custom 5-block CNN trained on 9,200 Indian cattle images. Achieved 92.5% accuracy, outperforming standard ResNet and VGG models. Paper under review.",
    tech: ["Custom CNN", "Deep Learning", "Vision"],
    metrics: ["92.5% accuracy", "Indian Cattle", "Research Paper"],
    icon: Eye,
    tag: "RESEARCH",
    badge: "REVIEW PENDING",
    github: "https://github.com/swaraj3092/animal_breed_classification",
    research: "https://github.com/swaraj3092/animal_breed_classification/blob/main/research_paper_draft.pdf",
    demo: null,
  },
  {
    title: "Smart Complaints",
    subtitle: "AI Complaint Management",
    period: "2025 — 2026",
    category: "AI/ML",
    description: "End-to-end pipeline integrating WhatsApp API with NLP classifier. Automates routing for 100+ daily complaints, reducing resolution time by 60%.",
    tech: ["NLP", "WhatsApp API", "Automation"],
    metrics: ["60% faster", "100+ daily", "24/7 Auto"],
    icon: MessageSquare,
    tag: "AUTOMATION",
    github: "https://github.com/swaraj3092/fixxo",
    demo: null,
  },
  {
    title: "Symbiote Invaders",
    subtitle: "Interactive Browser Game",
    period: "2026",
    category: "Full-Stack",
    description: "React-based space invaders clone with physics-based collision detection and 60fps canvas rendering. Showcases game dev and UI engineering skills.",
    tech: ["React", "Canvas API", "Game Loop"],
    metrics: ["60fps", "Collision Logic", "Portfolio Fun"],
    icon: Gamepad2,
    tag: "INTERACTIVE",
    github: null,
    demo: "game",
    isGame: true,
  },
];

const categories = ["All", "AI/ML", "Full-Stack", "Research"];

export function Projects() {
  const ref = useRef(null);
  const [activeTab, setActiveTab] = useState("All");
  const [hovered, setHovered] = useState<number | null>(null);

  const filteredProjects = projects.filter(p => 
    activeTab === "All" || p.category === activeTab
  );

  return (
    <section id="projects" className="pt-0 pb-32 -mt-8 relative overflow-hidden scroll-mt-24">
      <div className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 30%, rgba(80,0,12,0.12) 0%, transparent 60%)',
        }}
      />

      <div className="container mx-auto px-6 relative z-10" ref={ref}>
        <SectionReveal>
          <SectionTitle label="PROJECTS" sub="Missions" />
        </SectionReveal>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-16 px-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`relative px-6 py-2 text-[10px] tracking-[0.3em] uppercase transition-all duration-300 ${
                activeTab === cat ? 'text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
              style={{ fontFamily: 'Orbitron, sans-serif' }}
            >
              {cat}
              {activeTab === cat && (
                <motion.div
                  layoutId="project-tab"
                  className="absolute inset-0 border border-[#dc143c]"
                  style={{
                    boxShadow: '0 0 15px rgba(220,20,60,0.3)',
                    clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
                  }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          ))}
        </div>

        <motion.div 
          layout
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {filteredProjects.map((p, idx) => (
            <SectionReveal key={p.title} delay={idx * 0.1}>
              <TiltedCard>
                <motion.div
                  layout
                  onMouseEnter={() => setHovered(idx)}
                  onMouseLeave={() => setHovered(null)}
                  className="group relative flex flex-col h-full"
                >
                  {/* Glow */}
                  <div
                    className="absolute -inset-1 blur-2xl transition-opacity duration-500 -z-10 rounded"
                    style={{
                      background: 'radial-gradient(circle, rgba(220,20,60,0.15), transparent 70%)',
                      opacity: hovered === idx ? 1 : 0,
                    }}
                  />

                  <div
                    className="flex flex-col flex-1 relative overflow-hidden transition-all duration-500"
                    style={{
                      background: 'linear-gradient(145deg, rgba(10,4,6,0.55) 0%, rgba(6,2,4,0.45) 100%)',
                      border: `1px solid ${hovered === idx ? 'rgba(220,20,60,0.45)' : 'rgba(220,20,60,0.12)'}`,
                      backdropFilter: 'blur(12px)',
                      clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))',
                      boxShadow: hovered === idx ? '0 0 60px rgba(220,20,60,0.12), inset 0 0 40px rgba(0,0,0,0.6)' : 'inset 0 0 30px rgba(0,0,0,0.4)',
                    }}
                  >
                    {/* Top red bar */}
                    <div
                      className="absolute top-0 left-0 right-0 h-[2px] transition-all duration-400"
                      style={{
                        background: 'linear-gradient(90deg, #dc143c, #8b0000, transparent)',
                        opacity: hovered === idx ? 1 : 0.4,
                      }}
                    />

                    {/* Comic panel texture on hover */}
                    <div
                      className="absolute inset-0 pointer-events-none transition-opacity duration-500"
                      style={{
                        backgroundImage: `radial-gradient(circle, rgba(220,20,60,0.03) 1px, transparent 1px)`,
                        backgroundSize: '16px 16px',
                        opacity: hovered === idx ? 1 : 0,
                      }}
                    />

                    <div className="p-7 flex flex-col flex-1">
                      {/* Header row */}
                      <div className="flex items-start justify-between mb-5">
                        <div className="flex items-center gap-4">
                          <div
                            className="w-11 h-11 flex items-center justify-center shrink-0 transition-all duration-400"
                            style={{
                              border: '1px solid rgba(220,20,60,0.35)',
                              background: 'rgba(220,20,60,0.08)',
                              clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
                              boxShadow: hovered === idx ? '0 0 20px rgba(220,20,60,0.3)' : 'none',
                            }}
                          >
                            <p.icon className="w-5 h-5 text-[#dc143c]" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span
                                className="text-[10px] text-[#dc143c]/70 tracking-[0.35em] uppercase"
                                style={{ fontFamily: 'Rajdhani, sans-serif' }}
                              >{p.tag}</span>
                              {p.badge && (
                                <motion.span
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  className="px-2 py-0.5 text-[8px] font-bold tracking-widest text-[#dc143c] border border-[#dc143c]/40 rounded-sm bg-[#dc143c]/5"
                                  style={{ 
                                    fontFamily: 'Orbitron, sans-serif',
                                    boxShadow: '0 0 10px rgba(220, 20, 60, 0.2)'
                                  }}
                                >
                                  {p.badge}
                                </motion.span>
                              )}
                            </div>
                            <h3
                              className="text-lg text-white leading-tight"
                              style={{ fontFamily: 'Orbitron, sans-serif' }}
                            >{p.title}</h3>
                            <p className="text-sm text-gray-200 font-medium" style={{ fontFamily: 'Rajdhani, sans-serif' }}>{p.subtitle}</p>
                          </div>
                        </div>
                        <span
                          className="shrink-0 text-xs text-[#dc143c] mt-1 font-bold tracking-widest"
                          style={{ fontFamily: 'Rajdhani, sans-serif' }}
                        >{p.period}</span>
                      </div>

                      <p className="text-gray-200 text-sm leading-relaxed mb-5 flex-1 font-medium" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                        {p.description}
                      </p>

                      {/* Metrics */}
                      <div
                        className="grid grid-cols-3 gap-2 mb-5 py-3 px-3"
                        style={{
                          background: 'rgba(0,0,0,0.5)',
                          border: '1px solid rgba(220,20,60,0.15)',
                        }}
                      >
                        {p.metrics.map(m => (
                          <div key={m} className="text-center">
                            <div className="text-[10px] text-[#dc143c] font-black leading-tight tracking-wider" style={{ fontFamily: 'Orbitron, sans-serif' }}>{m}</div>
                          </div>
                        ))}
                      </div>

                      {/* Tech tags */}
                      <div className="flex flex-wrap gap-2 mb-5">
                        {p.tech.map(t => (
                          <span
                            key={t}
                            className="text-xs px-2.5 py-1 text-white font-semibold"
                            style={{
                              background: 'rgba(220,20,60,0.12)',
                              border: '1px solid rgba(220,20,60,0.3)',
                              fontFamily: 'Rajdhani, sans-serif',
                            }}
                          >{t}</span>
                        ))}
                      </div>

                      {/* Actions - always visible on mobile/tablet, hover on desktop */}
                      <div
                        className="flex gap-3 transition-all duration-400 overflow-hidden lg:max-h-0 lg:opacity-0 lg:group-hover:max-h-[60px] lg:group-hover:opacity-100"
                        style={{ 
                          maxHeight: hovered === idx ? '60px' : undefined,
                          opacity: hovered === idx ? 1 : undefined 
                        }}
                      >
                        {(p.demo || p.research) && (
                          p.isGame ? (
                            <button
                              onClick={() => window.dispatchEvent(new CustomEvent('open-panel', { detail: { panel: 'game' } }))}
                              className="flex items-center gap-2 px-4 py-2 text-xs text-white transition-all duration-300"
                              style={{
                                background: '#dc143c',
                                clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
                                fontFamily: 'Rajdhani, sans-serif',
                              }}
                              aria-label={`Play ${p.title} game`}
                            >
                              <Gamepad2 className="w-3.5 h-3.5" />
                              Play Now
                            </button>
                          ) : p.research ? (
                            <a
                              href={p.research}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-4 py-2 text-xs text-white transition-all duration-300"
                              style={{
                                background: '#dc143c',
                                clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
                                fontFamily: 'Rajdhani, sans-serif',
                              }}
                              aria-label={`View research paper for ${p.title}`}
                            >
                              <FileText className="w-3.5 h-3.5" />
                              View Paper
                            </a>
                          ) : (
                            <a
                              href={p.demo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-4 py-2 text-xs text-white transition-all duration-300"
                              style={{
                                background: '#dc143c',
                                clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
                                fontFamily: 'Rajdhani, sans-serif',
                              }}
                              aria-label={`View live demo of ${p.title}`}
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              Live Demo
                            </a>
                          )
                        )}
                        {p.github && (
                          <a
                            href={p.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 text-xs text-gray-300 transition-all duration-300 hover:text-white"
                            style={{
                              background: 'transparent',
                              border: '1px solid rgba(220,20,60,0.35)',
                              fontFamily: 'Rajdhani, sans-serif',
                            }}
                            aria-label={`View source code for ${p.title} on GitHub`}
                          >
                            <Github className="w-3.5 h-3.5" />
                            {p.demo || p.research ? 'Source' : 'View Code'}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </TiltedCard>
            </SectionReveal>
          ))}
        </motion.div>
      </div>
    </section>
  );
}