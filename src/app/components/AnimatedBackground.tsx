import { motion } from "motion/react";

export function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
      {/* Floating geometric shapes */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${10 + i * 12}%`,
            top: `${20 + (i % 3) * 25}%`,
            width: `${40 + i * 8}px`,
            height: `${40 + i * 8}px`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, i % 2 === 0 ? 20 : -20, 0],
            rotate: [0, 180, 360],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        >
          <div
            className="w-full h-full"
            style={{
              border: '1px solid rgba(220,20,60,0.2)',
              clipPath: i % 2 === 0
                ? 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
                : 'polygon(0 0, 100% 0, 100% 80%, 80% 100%, 0 100%)',
            }}
          />
        </motion.div>
      ))}

      {/* Scanning lines */}
      <motion.div
        className="absolute left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(220,20,60,0.4), transparent)' }}
        animate={{ top: ['0%', '100%'] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(220,20,60,0.3), transparent)' }}
        animate={{ top: ['100%', '0%'] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}
