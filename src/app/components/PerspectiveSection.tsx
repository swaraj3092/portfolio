import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { useRef, ReactNode } from "react";

type TransitionType = "cube" | "stack" | "slide" | "zoom" | "fade";

interface PerspectiveSectionProps {
  children: ReactNode;
  type?: TransitionType;
  index?: number;
}

/**
 * PerspectiveSection applies 3D scroll-linked transitions to its content.
 * It detects its own position in the viewport and applies transformations.
 */
export function PerspectiveSection({ children, type = "cube", index = 0 }: PerspectiveSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll progress of THIS specific section relative to the viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Smooth out the progress for cinematic feel
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // 1. CUBE TRANSITION (Rotate on X axis)
  // [0 = bottom of screen, 0.5 = middle, 1 = top of screen]
  const rotateX = useTransform(smoothProgress, [0, 0.5, 1], [45, 0, -45]);
  const translateZ = useTransform(smoothProgress, [0, 0.5, 1], [-200, 0, -200]);
  const opacityCube = useTransform(smoothProgress, [0, 0.2, 0.5, 0.8, 1], [0, 1, 1, 1, 0]);

  // 2. STACK TRANSITION (Scale and Offset)
  const scaleStack = useTransform(smoothProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const yStack = useTransform(smoothProgress, [0, 0.5, 1], ["50px", "0px", "-50px"]);
  const opacityStack = useTransform(smoothProgress, [0, 0.4, 0.6, 1], [0, 1, 1, 0]);

  // 3. ZOOM TRANSITION (Scale from center)
  const scaleZoom = useTransform(smoothProgress, [0, 0.5, 1], [1.5, 1, 0.5]);
  const opacityZoom = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  // Select transformation based on type
  let styles = {};
  if (type === "cube") {
    styles = { rotateX, translateZ, opacity: opacityCube };
  } else if (type === "stack") {
    styles = { scale: scaleStack, y: yStack, opacity: opacityStack };
  } else if (type === "zoom") {
    styles = { scale: scaleZoom, opacity: opacityZoom };
  } else {
    // Default fade/slide
    styles = { opacity: opacityCube, y: yStack };
  }

  return (
    <div 
      ref={containerRef} 
      className="relative min-h-screen w-full perspective-2000"
      style={{ perspective: "1500px" }}
    >
      <motion.div
        style={{
          ...styles,
          transformStyle: "preserve-3d",
        }}
        className="w-full h-full will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
}
