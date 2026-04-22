import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

export function Loader({ minimalist, setMinimalist }: { minimalist: boolean; setMinimalist: (val: boolean) => void }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState('initializing'); // initializing, breaching, complete

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setPhase('breaching'), 600);
          setTimeout(() => setPhase('complete'), 2200);
          return 100;
        }
        return prev + (Math.random() > 0.5 ? 1 : 2);
      });
    }, 40);
    return () => clearInterval(interval);
  }, []);

  if (phase === 'complete') return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] bg-[#060305] flex items-center justify-center overflow-hidden"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.2 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Background Multiverse Tunnel Effect */}
        {phase === 'breaching' && (
          <motion.div
            className="absolute inset-0 z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute inset-0 border border-[#dc143c]/10 rounded-full"
                initial={{ scale: 0.1, opacity: 0 }}
                animate={{ scale: 3, opacity: [0, 0.5, 0] }}
                transition={{
                  duration: 2,
                  delay: i * 0.1,
                  repeat: Infinity,
                  ease: "easeIn"
                }}
              />
            ))}
            <motion.div
              className="absolute inset-0 bg-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.8, 0] }}
              transition={{ duration: 0.4, delay: 1.2 }}
            />
          </motion.div>
        )}

        {/* HUD Elements */}
        {phase === 'initializing' && (
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <motion.div
              className="absolute top-10 left-10 w-32 h-32 border-t border-l border-[#dc143c]"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            />
            <motion.div
              className="absolute bottom-10 right-10 w-32 h-32 border-b border-r border-[#dc143c]"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            />
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#dc143c]/30 to-transparent" />
          </div>
        )}

        <div className="relative z-10 text-center">
          <motion.div
            animate={phase === 'breaching' ? {
              scale: [1, 0.8, 15],
              opacity: [1, 1, 0],
              filter: ["blur(0px)", "blur(2px)", "blur(10px)"]
            } : {
              scale: [1, 1.02, 1],
            }}
            transition={phase === 'breaching' ? { duration: 1.5, ease: "easeIn" } : { duration: 2, repeat: Infinity }}
            className="mb-8"
          >
            <div className="relative">
              {/* Logo Glitch Layers */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 text-6xl md:text-9xl font-bold tracking-tighter mix-blend-screen"
                  style={{ color: i === 0 ? '#dc143c' : i === 1 ? '#00fff2' : '#ff00ea', opacity: phase === 'breaching' ? 0.8 : 0 }}
                  animate={phase === 'breaching' ? {
                    x: (Math.random() - 0.5) * 40,
                    y: (Math.random() - 0.5) * 40,
                  } : {}}
                  transition={{ repeat: Infinity, duration: 0.1 }}
                >
                  SKB
                </motion.div>
              ))}

              <h1
                className="text-6xl md:text-9xl font-extrabold tracking-tighter text-white relative z-10"
                style={{ fontFamily: 'Orbitron, sans-serif' }}
              >
                <span className="text-[#dc143c]">SK</span>B
              </h1>
            </div>
          </motion.div>

          <AnimatePresence>
            {phase === 'initializing' && (
              <motion.div
                exit={{ opacity: 0, y: 10 }}
                className="flex flex-col items-center"
              >
                <div className="w-48 h-[2px] bg-[#1a1315] relative overflow-hidden mb-4">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-[#dc143c]"
                    style={{ width: `${progress}%` }}
                    transition={{ type: 'spring', bounce: 0 }}
                  />
                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                </div>
                <div className="flex items-center gap-4 text-[10px] tracking-[0.4em] uppercase font-medium">
                  <span className="text-[#dc143c]">System.init()</span>
                  <span className="text-gray-500">{progress}%</span>
                  <span className="text-[#dc143c]">Breaching_Multiverse</span>
                </div>

                {/* Effect Toggle on Entrance */}
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  onClick={() => setMinimalist(!minimalist)}
                  className="mt-12 group pointer-events-auto flex items-center gap-4 px-6 py-3"
                  style={{ 
                    border: '1px solid rgba(220,20,60,0.3)',
                    background: 'rgba(220,20,60,0.05)',
                    backdropFilter: 'blur(8px)'
                  }}
                >
                  <div 
                    className={`w-3 h-3 rounded-full transition-all duration-500 ${!minimalist ? 'bg-[#dc143c] shadow-[0_0_12px_#dc143c]' : 'bg-gray-600'}`} 
                  />
                  <span className="text-[10px] tracking-[0.3em] uppercase text-white font-bold" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                    {minimalist ? 'ENABLE CINEMATIC EFFECTS' : 'EFFECTS ACTIVE'}
                  </span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Scan-line animation */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="w-full h-[2px] bg-[#dc143c]/10"
            animate={{ y: ['0%', '1000%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
