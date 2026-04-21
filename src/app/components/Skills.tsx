import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef, useState } from "react";
import { Code2, Brain, Database, Wrench } from "lucide-react";
import { SectionTitle } from "./SectionTitle";
import { AnimatedBackground } from "./AnimatedBackground";
import { SectionReveal } from "./ui/CreativeComponents";

type SkillLevel = 'Advanced' | 'Intermediate' | 'Familiar';

const skillCategories = [
  {
    title: "Languages",
    icon: Code2,
    skills: [
      { name: "Python", level: "Advanced" as SkillLevel },
      { name: "JavaScript", level: "Advanced" as SkillLevel },
      { name: "Java", level: "Intermediate" as SkillLevel },
      { name: "C", level: "Intermediate" as SkillLevel },
      { name: "SQL", level: "Intermediate" as SkillLevel },
      { name: "Bash", level: "Intermediate" as SkillLevel },
      { name: "HTML/CSS", level: "Advanced" as SkillLevel },
    ],
    accent: "#dc143c",
    number: "01",
  },
  {
    title: "AI / ML & Data",
    icon: Brain,
    skills: [
      { name: "TensorFlow", level: "Advanced" as SkillLevel },
      { name: "PyTorch", level: "Advanced" as SkillLevel },
      { name: "Scikit-learn", level: "Advanced" as SkillLevel },
      { name: "OpenCV", level: "Intermediate" as SkillLevel },
      { name: "Pandas", level: "Advanced" as SkillLevel },
      { name: "NumPy", level: "Advanced" as SkillLevel },
      { name: "Matplotlib", level: "Intermediate" as SkillLevel },
      { name: "Power BI", level: "Intermediate" as SkillLevel },
    ],
    accent: "#c01030",
    number: "02",
  },
  {
    title: "Core CS",
    icon: Database,
    skills: [
      { name: "Data Structures & Algorithms", level: "Advanced" as SkillLevel },
      { name: "OOP", level: "Advanced" as SkillLevel },
      { name: "DBMS", level: "Intermediate" as SkillLevel },
      { name: "Operating Systems", level: "Intermediate" as SkillLevel },
      { name: "Computer Networks", level: "Familiar" as SkillLevel },
    ],
    accent: "#a00f28",
    number: "03",
  },
  {
    title: "Tools & APIs",
    icon: Wrench,
    skills: [
      { name: "Git / GitHub", level: "Advanced" as SkillLevel },
      { name: "Linux", level: "Advanced" as SkillLevel },
      { name: "REST APIs", level: "Advanced" as SkillLevel },
      { name: "WhatsApp / Twilio API", level: "Intermediate" as SkillLevel },
      { name: "SMTP Automation", level: "Intermediate" as SkillLevel },
    ],
    accent: "#8b0000",
    number: "04",
  },
];

export function Skills() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="skills" className="pt-0 pb-32 -mt-16 relative overflow-hidden scroll-mt-24">
      <AnimatedBackground />
      <div className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 70% 50% at 80% 50%, rgba(100,0,15,0.1) 0%, transparent 60%)',
        }}
      />

      <div className="container mx-auto px-6 relative z-10" ref={ref}>
        <SectionReveal>
          <SectionTitle label="SKILLS" sub="Powers" />
        </SectionReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skillCategories.map((cat, idx) => (
            <SectionReveal key={cat.title} delay={idx * 0.15}>
              <motion.div
                onMouseEnter={() => setHovered(idx)}
                onMouseLeave={() => setHovered(null)}
                className="group relative cursor-default h-full"
              >
                {/* Glow behind card */}
                <div
                  className="absolute inset-0 transition-opacity duration-500 blur-2xl -z-10"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, ${cat.accent}30, transparent 70%)`,
                    opacity: hovered === idx ? 1 : 0,
                  }}
                />

                <div
                  className="relative h-full overflow-hidden transition-all duration-400"
                  style={{
                    background: 'linear-gradient(145deg, rgba(12,4,6,0.98) 0%, rgba(8,3,5,0.95) 100%)',
                    border: `1px solid ${hovered === idx ? cat.accent + '60' : 'rgba(220,20,60,0.12)'}`,
                    clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
                    boxShadow: hovered === idx ? `0 0 40px ${cat.accent}20, inset 0 0 40px rgba(0,0,0,0.5)` : 'none',
                    transition: 'border-color 0.4s, box-shadow 0.4s',
                  }}
                >
                  {/* Number watermark */}
                  <div
                    className="absolute top-3 right-5 select-none pointer-events-none"
                    style={{
                      fontFamily: 'Orbitron, sans-serif',
                      fontSize: '4rem',
                      fontWeight: 900,
                      color: 'transparent',
                      WebkitTextStroke: `1px ${cat.accent}18`,
                      lineHeight: 1,
                    } as React.CSSProperties}
                  >
                    {cat.number}
                  </div>

                  {/* Top accent line */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[2px] transition-opacity duration-400"
                    style={{
                      background: `linear-gradient(90deg, ${cat.accent}, transparent)`,
                      opacity: hovered === idx ? 1 : 0.3,
                    }}
                  />

                  <div className="p-8">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-7">
                      <div
                        className="w-12 h-12 flex items-center justify-center transition-all duration-400"
                        style={{
                          border: `1px solid ${cat.accent}50`,
                          background: `${cat.accent}10`,
                          clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
                          boxShadow: hovered === idx ? `0 0 20px ${cat.accent}30` : 'none',
                        }}
                      >
                        <cat.icon className="w-6 h-6" style={{ color: cat.accent }} />
                      </div>
                      <div>
                        <h3
                          className="text-lg text-white tracking-wider"
                          style={{ fontFamily: 'Orbitron, sans-serif', textShadow: hovered === idx ? `0 0 20px ${cat.accent}60` : 'none' }}
                        >
                          {cat.title}
                        </h3>
                        <div className="h-px w-12 mt-1"
                          style={{ background: `linear-gradient(90deg, ${cat.accent}, transparent)` }} />
                      </div>
                    </div>

                    {/* Skills Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 mt-4">
                      {cat.skills.map((skill, si) => {
                        const levelValue = skill.level === 'Advanced' ? 95 : skill.level === 'Intermediate' ? 75 : 50;
                        return (
                          <motion.div
                            key={skill.name}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 + si * 0.05 }}
                            className="group/skill relative"
                          >
                            <div className="flex items-center justify-between mb-1.5 px-1">
                              <span className="text-xs text-gray-100 font-semibold tracking-wide" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                                {skill.name}
                              </span>
                              <span 
                                className="text-[10px] uppercase tracking-widest font-bold" 
                                style={{ 
                                  fontFamily: 'Orbitron, sans-serif', 
                                  color: skill.level === 'Advanced' ? cat.accent : skill.level === 'Intermediate' ? `${cat.accent}cc` : `${cat.accent}99`
                                }}
                              >
                                {skill.level}
                              </span>
                            </div>
                            
                            {/* Power Bar */}
                            <div className="relative h-1.5 w-full bg-[#151515] overflow-hidden rounded-full border border-white/5">
                              {/* Background grid/segments */}
                              <div className="absolute inset-0 flex justify-between pointer-events-none opacity-20 px-1">
                                {[...Array(10)].map((_, i) => (
                                  <div key={i} className="w-[1px] h-full bg-white/30" />
                                ))}
                              </div>
                              
                              {/* Progress bar */}
                              <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: `${levelValue}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 1.5, delay: 0.5 + si * 0.05, ease: [0.16, 1, 0.3, 1] }}
                                className="absolute inset-y-0 left-0 rounded-full"
                                style={{ 
                                  background: `linear-gradient(90deg, ${cat.accent}40, ${cat.accent})`,
                                  boxShadow: `0 0 10px ${cat.accent}60`
                                }}
                              >
                                {/* Moving highlight */}
                                <motion.div 
                                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                  animate={{ x: ['-100%', '200%'] }}
                                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                />
                              </motion.div>
                            </div>

                            {/* Glow on hover */}
                            <div 
                              className="absolute -inset-2 opacity-0 group-hover/skill:opacity-100 transition-opacity duration-300 blur-lg pointer-events-none -z-10 rounded-full"
                              style={{ background: `radial-gradient(circle, ${cat.accent}15, transparent 70%)` }}
                            />
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}