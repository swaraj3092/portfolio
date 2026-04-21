export function SectionTitle({ label, sub }: { label: string; sub?: string }) {
  return (
    <div className="text-center mb-20 relative">
      {/* Large ghost text behind */}
      <div
        className="absolute inset-0 flex items-center justify-center select-none pointer-events-none"
        style={{
          fontSize: 'clamp(4rem, 12vw, 9rem)',
          fontFamily: 'Space Grotesk, Orbitron, sans-serif',
          fontWeight: 700,
          color: 'transparent',
          WebkitTextStroke: '1px rgba(220,20,60,0.07)',
          letterSpacing: '0.02em',
        } as React.CSSProperties}
      >
        {label}
      </div>
      <div className="relative z-10">
        <div className="inline-flex items-center gap-3 mb-3">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#dc143c]" />
          <span
            className="text-[#dc143c] text-xs tracking-[0.35em] uppercase"
            style={{ fontFamily: 'Inter, Rajdhani, sans-serif', fontWeight: 600 }}
          >
            {sub || label}
          </span>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#dc143c]" />
        </div>
        <h2
          className="text-5xl md:text-7xl text-white"
          style={{
            fontFamily: 'Space Grotesk, Orbitron, sans-serif',
            fontWeight: 800,
            letterSpacing: '0.04em',
            textShadow: '2px 2px 0px rgba(220,20,60,0.5), 0 0 20px rgba(220,20,60,0.2)',
            textTransform: 'uppercase'
          }}
        >
          {label}
        </h2>
        <div
          className="mt-3 mx-auto w-24 h-[2px]"
          style={{ background: 'linear-gradient(90deg, transparent, #dc143c, transparent)' }}
        />
      </div>
    </div>
  );
}
