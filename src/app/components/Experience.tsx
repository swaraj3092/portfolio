import { motion, useInView, useScroll, useSpring } from "motion/react";
import { useRef, useState } from "react";
import { Briefcase, TrendingUp } from "lucide-react";
import { SectionTitle } from "./SectionTitle";

const experiences = [
  {
    role: "Data Analytics Associate",
    company: "USC.KIIT",
    period: "April 2025 — Present",
    description: "Built ML-driven Python models and Power BI dashboard pipelines to automate research reporting and performance tracking.",
    achievements: [
      "Engineered automated ETL pipelines using Python and SQL to integrate disparate faculty data sources.",
      "Designed interactive Power BI dashboards providing real-time research metrics for 10+ department heads.",
      "Implemented predictive analytics models that identified student performance trends with 90%+ precision.",
    ],
    current: true,
  },
  {
    role: "Python Intern",
    company: "iTech Business Solutions",
    period: "July 2024 — August 2024",
    description: "Streamlined data processing workflows across live production projects, focusing on backend performance and scalability.",
    achievements: [
      "Optimized legacy Python scripts using multiprocessing and NumPy vectorization, reducing runtime by 30%.",
      "Contributed to 5+ production backend modules for scalable data ingestion and processing.",
      "Developed comprehensive unit testing and logging frameworks, improving production fault-tolerance.",
    ],
    current: false,
  },
];

export function Experience() {
  const ref = useRef(null);
  const containerRef = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hovered, setHovered] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end center"]
  });
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <section id="experience" className="pt-0 pb-32 -mt-4 relative overflow-hidden scroll-mt-24" ref={containerRef}>
      <div className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 30% 60%, rgba(100,0,15,0.1) 0%, transparent 55%)',
        }}
      />

      <div className="container mx-auto px-6 relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <SectionTitle label="EXPERIENCE" sub="Legacy" />
        </motion.div>

        <div className="max-w-4xl mx-auto relative">
          {/* Timeline line - Background */}
          <div className="absolute left-6 top-0 bottom-0 w-px hidden md:block bg-white/5" />
          
          {/* Timeline line - Active filling */}
          <motion.div 
            className="absolute left-6 top-0 bottom-0 w-px hidden md:block origin-top z-10"
            style={{
              scaleY,
              background: 'linear-gradient(180deg, #dc143c 0%, #8b0000 100%)',
              boxShadow: '0 0 10px rgba(220,20,60,0.5)',
            }}
          />

          <div className="space-y-8">
            {experiences.map((exp, idx) => (
              <motion.div
                key={exp.role}
                initial={{ opacity: 0, x: -40 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.7, delay: idx * 0.2 }}
                onMouseEnter={() => setHovered(idx)}
                onMouseLeave={() => setHovered(null)}
                className="relative group md:pl-20"
              >
                {/* Timeline dot */}
                <div className="absolute left-4 top-6 hidden md:flex items-center justify-center w-5 h-5 -translate-x-1/2 transition-all duration-400"
                  style={{
                    width: hovered === idx ? 20 : 14,
                    height: hovered === idx ? 20 : 14,
                    background: exp.current ? '#dc143c' : 'rgba(220,20,60,0.3)',
                    border: `2px solid ${exp.current ? '#dc143c' : 'rgba(220,20,60,0.5)'}`,
                    borderRadius: '50%',
                    boxShadow: hovered === idx ? '0 0 20px rgba(220,20,60,0.6)' : 'none',
                    transition: 'all 0.4s',
                  }}
                >
                  {exp.current && (
                    <div className="absolute inset-[-4px] rounded-full animate-ping"
                      style={{ background: 'rgba(220,20,60,0.3)' }} />
                  )}
                </div>

                {/* Card */}
                <div
                  className="relative overflow-hidden transition-all duration-700"
                  style={{
                    background: 'rgba(12, 6, 8, 0.45)',
                    border: `1px solid ${hovered === idx ? 'rgba(220, 20, 60, 0.45)' : 'rgba(220, 20, 60, 0.15)'}`,
                    backdropFilter: 'blur(12px)',
                    clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
                    boxShadow: hovered === idx ? '0 0 50px rgba(220, 20, 60, 0.1), inset 0 0 30px rgba(0,0,0,0.5)' : 'none',
                  }}
                >
                  {/* Top bar */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[2px] transition-all duration-700"
                    style={{
                      background: 'linear-gradient(90deg, #dc143c, transparent)',
                      opacity: hovered === idx ? 1 : 0.3,
                    }}
                  />

                  {/* Hover glow bg */}
                  <div
                    className="absolute inset-0 pointer-events-none transition-opacity duration-700"
                    style={{
                      background: 'radial-gradient(ellipse at 0% 50%, rgba(220, 20, 60, 0.08), transparent 60%)',
                      opacity: hovered === idx ? 1 : 0,
                    }}
                  />

                  <div className="p-8">
                    <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
                      <div className="flex items-center gap-5">
                        <div
                          className="w-12 h-12 flex items-center justify-center shrink-0 transition-all duration-500"
                          style={{
                            border: '1px solid rgba(220, 20, 60, 0.4)',
                            background: 'rgba(220, 20, 60, 0.1)',
                            clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
                            boxShadow: hovered === idx ? '0 0 20px rgba(220, 20, 60, 0.35)' : 'none',
                          }}
                        >
                          {exp.current
                            ? <TrendingUp className="w-5 h-5 text-[#dc143c]" />
                            : <Briefcase className="w-5 h-5 text-[#dc143c]" />
                          }
                        </div>
                        <div>
                          <h3
                            className="text-xl text-white font-bold"
                            style={{ 
                              fontFamily: 'Orbitron, sans-serif', 
                              textShadow: hovered === idx ? '0 0 20px rgba(220, 20, 60, 0.4)' : 'none',
                              letterSpacing: '0.05em'
                            }}
                          >{exp.role}</h3>
                          <p className="text-[#dc143c] font-medium text-base mt-0.5" style={{ fontFamily: 'Rajdhani, sans-serif' }}>{exp.company}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span
                          className="text-[11px] text-gray-300 font-semibold px-4 py-1.5 border border-[#dc143c]/30 uppercase tracking-widest"
                          style={{ fontFamily: 'Rajdhani, sans-serif', background: 'rgba(220,20,60,0.05)' }}
                        >{exp.period}</span>
                        {exp.current && (
                          <span
                            className="text-[10px] px-4 py-1.5 text-white font-black animate-pulse tracking-[0.2em]"
                            style={{
                              background: '#dc143c',
                              clipPath: 'polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 5px 100%, 0 calc(100% - 5px))',
                              fontFamily: 'Orbitron, sans-serif',
                            }}
                          >PRESENT</span>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-200 text-base leading-relaxed mb-6 font-medium" style={{ fontFamily: 'Rajdhani, sans-serif', letterSpacing: '0.02em' }}>
                      {exp.description}
                    </p>

                    <div className="flex flex-col gap-y-4 border-t border-white/5 pt-6">
                      {exp.achievements.map((a) => (
                        <div key={a} className="flex items-start gap-3 group/item">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#dc143c] mt-2 group-hover/item:scale-125 transition-transform shrink-0 shadow-[0_0_8px_#dc143c]" />
                          <span className="text-sm text-gray-300 group-hover/item:text-white transition-colors duration-300" style={{ fontFamily: 'Rajdhani, sans-serif', lineHeight: 1.5 }}>{a}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}