import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- TypeScript Interfaces ---
interface SplashAnimationProps {
  onComplete?: () => void;
}

interface BuildingData {
  id: string;
  x: number;
  w: number;
  h: number;
  delay: number;
  tone: string;
  accent?: boolean;
  flagship?: boolean;
}

interface PlotCorner {
  id: string;
  pos: { top?: number; bottom?: number; left?: number; right?: number };
}

interface LogoLetter {
  id: string;
  ch: string;
}

const DURATION_MS = 2800;
const EXIT_MS = 550;

// Aligning with Cal.com / Territory Clean Light Design System
const PALETTE = {
  obsidian: "#f4f4f4",  // Clean canvas background (paper)
  ink: "#101010",       // Primary charcoal body/text
  gold: "#242424",      // High contrast graphite for details
  emerald: "#10b981",   // Premium modern emerald green accent
  bone: "#101010",      // Main stark dark ink typography
  silver: "#cbd5e1",    // Subtle grey separators and borders
};

const BUILDINGS: BuildingData[] = [
  { id: "b-l3", x: -220, w: 46, h: 90,  delay: 0.15, tone: "#cbd5e1" },
  { id: "b-l2", x: -170, w: 54, h: 140, delay: 0.25, tone: "#cbd5e1" },
  { id: "b-l1", x: -110, w: 62, h: 200, delay: 0.35, tone: "#94a3b8", accent: true },
  { id: "b-flagship", x: -42,  w: 70, h: 260, delay: 0.45, tone: "#101010", flagship: true }, // The flagship is a solid ink black pillar
  { id: "b-r1", x: 40,   w: 58, h: 175, delay: 0.55, tone: "#475569" },
  { id: "b-r2", x: 108,  w: 50, h: 120, delay: 0.65, tone: "#94a3b8" },
  { id: "b-r3", x: 168,  w: 46, h: 95,  delay: 0.75, tone: "#cbd5e1" },
];

const LOGO_LETTERS: LogoLetter[] = [
  { id: "L0", ch: "T" }, { id: "L1", ch: "E" }, { id: "L2", ch: "R" },
  { id: "L3", ch: "R" }, { id: "L4", ch: "I" }, { id: "L5", ch: "T" },
  { id: "L6", ch: "O" }, { id: "L7", ch: "R" }, { id: "L8", ch: "Y" },
];

const PLOT_CORNERS: PlotCorner[] = [
  { id: "tl", pos: { top: -6, left: -6 } },
  { id: "tr", pos: { top: -6, right: -6 } },
  { id: "bl", pos: { bottom: -6, left: -6 } },
  { id: "br", pos: { bottom: -6, right: -6 } },
];

const HUD_FONT = "'JetBrains Mono', ui-monospace, monospace";
const DISPLAY_FONT = "'Playfair Display', Georgia, serif";
const MONO_FONT = "'Inter', ui-sans-serif, system-ui, sans-serif";

// Premium Butter-Smooth Cubic Bezier (Apple / Linear style)
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

/* ---------------- Sub-components ---------------- */

function Backdrop() {
  return (
    <>
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(16,16,16,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(16,16,16,0.04) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage:
            "radial-gradient(circle at center, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 70%)",
          WebkitMaskImage:
            "radial-gradient(circle at center, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 70%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='200' height='200' filter='url(%23n)' opacity='0.6'/></svg>\")",
        }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 0.75, scale: 1 }}
        transition={{ duration: 1.4, ease: EASE_OUT_EXPO }}
        className="absolute pointer-events-none"
        style={{
          width: "140vw",
          height: "140vw",
          maxWidth: 720,
          maxHeight: 720,
          background:
            "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(16,16,16,0.02) 60%)",
          filter: "blur(20px)",
        }}
      />
    </>
  );
}

function TerritoryPlot() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, z: -30 }}
      animate={{ opacity: 1, scale: 1, z: -30 }}
      transition={{ duration: 0.95, ease: EASE_OUT_EXPO }}
      className="absolute left-1/2 top-[62%]"
      style={{
        width: 380,
        height: 180,
        x: "-50%",
        y: "-50%",
        background:
          "linear-gradient(135deg, #ffffff 0%, #f4f4f4 60%, #e2e8f0 100%)",
        border: "1.5px solid rgba(16,16,16,0.08)",
        boxShadow:
          "0 30px 60px rgba(16,16,16,0.04), inset 0 0 40px rgba(255,255,255,0.8)",
        transformStyle: "preserve-3d",
      }}
    >
      {PLOT_CORNERS.map((c, i) => (
        <motion.div
          key={c.id}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 + i * 0.08, duration: 0.35, ease: EASE_OUT_EXPO }}
          className="absolute"
          style={{
            ...c.pos,
            width: 14,
            height: 14,
            border: `2px solid ${PALETTE.gold}`,
            borderRadius: 2,
          }}
        />
      ))}
    </motion.div>
  );
}

function Building({ b }: { b: BuildingData }) {
  const borderTop = b.flagship
    ? `2px solid ${PALETTE.emerald}` // Bright emerald beacon top for Cal.com alignment
    : b.accent
    ? `2px solid ${PALETTE.gold}`
    : "1px solid rgba(16,16,16,0.12)";

  return (
    <motion.div
      initial={{ y: 300, opacity: 0, scaleY: 0.2 }}
      animate={{ y: 0, opacity: 1, scaleY: 1 }}
      transition={{ delay: b.delay, duration: 0.95, ease: EASE_OUT_EXPO }}
      className="absolute bottom-0"
      style={{
        left: b.x,
        width: b.w,
        height: b.h,
        background: b.flagship
          ? `linear-gradient(180deg, #101010 0%, #242424 100%)`
          : `linear-gradient(180deg, ${b.tone} 0%, #cbd5e1 100%)`,
        border: "1px solid rgba(16,16,16,0.08)",
        borderTop,
        transformOrigin: "bottom",
        boxShadow:
          "0 15px 25px rgba(16,16,16,0.05), inset 1px 0 0 rgba(255,255,255,0.4)",
      }}
    >
      <div
        className="w-full h-full opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent 0, transparent 10px, rgba(16,16,16,0.2) 10px, rgba(16,16,16,0.2) 12px), repeating-linear-gradient(90deg, transparent 0, transparent 8px, rgba(16,16,16,0.2) 8px, rgba(16,16,16,0.2) 10px)",
        }}
      />
      {b.flagship && (
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 1.3, duration: 0.45, ease: EASE_OUT_EXPO }}
          className="absolute left-1/2 -top-6 -translate-x-1/2"
          style={{
            width: 2,
            height: 24,
            background: PALETTE.emerald,
            transformOrigin: "bottom",
            boxShadow: `0 0 8px ${PALETTE.emerald}`,
          }}
        />
      )}
    </motion.div>
  );
}

function Skyline() {
  return (
    <motion.div
      initial={{ z: 30 }}
      animate={{ z: 30 }}
      className="absolute left-1/2 top-[62%]"
      style={{ x: "-50%", y: "-100%", transformStyle: "preserve-3d" }}
    >
      {BUILDINGS.map((b) => <Building key={b.id} b={b} />)}
    </motion.div>
  );
}

function LightBeam() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -400 }}
      animate={{ opacity: [0, 0.2, 0], x: 400 }}
      transition={{ delay: 1.4, duration: 1.2, ease: "easeInOut" }}
      className="absolute left-1/2 top-[10%] -translate-x-1/2"
      style={{
        width: 240,
        height: 320,
        background:
          "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
        filter: "blur(14px)",
        transform: "rotate(18deg)",
      }}
    />
  );
}

function IsometricStage() {
  return (
    <div 
      className="relative scale-[0.60] xs:scale-[0.75] sm:scale-90 md:scale-100 transition-transform duration-300 origin-center" 
      style={{ width: 560, height: 380, perspective: 1200 }}
    >
      <motion.div
        initial={{ rotateX: 55, rotateZ: -35, y: 40, opacity: 0 }}
        animate={{ rotateX: 32, rotateZ: -18, y: 0, opacity: 1 }}
        transition={{ duration: 1.4, ease: EASE_OUT_EXPO, delay: 0.05 }}
        className="absolute inset-0"
        style={{ transformStyle: "preserve-3d" }}
      >
        <TerritoryPlot />
        <Skyline />
        <LightBeam />
      </motion.div>
    </div>
  );
}

function Logotype() {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 bottom-[14%] sm:bottom-[18%] flex flex-col items-center w-full px-4 text-center">
      <div className="flex items-end justify-center w-full max-w-full overflow-visible" style={{ perspective: 900 }}>
        {LOGO_LETTERS.map((l, i) => (
          <motion.span
            key={l.id}
            data-testid={`territory-letter-${i}`}
            initial={{ opacity: 0, y: 25, rotateX: -80, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" }}
            transition={{ delay: 1.15 + i * 0.05, duration: 0.65, ease: EASE_OUT_EXPO }}
            className="text-[32px] xs:text-[42px] sm:text-[56px] md:text-[68px] tracking-[0.16em] sm:tracking-[0.22em]"
            style={{
              display: "inline-block",
              lineHeight: 1,
              color: PALETTE.bone,
              fontWeight: 600,
              textShadow: "0 4px 12px rgba(16,16,16,0.04)",
              transformStyle: "preserve-3d",
              marginRight: i === LOGO_LETTERS.length - 1 ? 0 : 1,
              fontFamily: DISPLAY_FONT,
            }}
          >
            {l.ch}
          </motion.span>
        ))}
      </div>

      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ delay: 1.85, duration: 0.65, ease: EASE_OUT_EXPO }}
        className="mt-3 sm:mt-4 w-[160px] sm:w-[260px]"
        style={{
          height: 1.5,
          background: `linear-gradient(90deg, transparent, ${PALETTE.emerald}, transparent)`, // Emerald modern accent separator
          transformOrigin: "center",
          boxShadow: "0 0 8px rgba(16,185,129,0.15)",
        }}
      />

      <motion.p
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.0, duration: 0.6, ease: EASE_OUT_EXPO }}
        data-testid="territory-tagline"
        className="mt-3 sm:mt-4 uppercase text-[7.5px] xs:text-[9px] sm:text-[10px] tracking-[0.25em] xs:tracking-[0.4em] sm:tracking-[0.5em] font-semibold"
        style={{
          fontFamily: MONO_FONT,
          color: PALETTE.gold,
        }}
      >
        own&nbsp;·&nbsp;the&nbsp;·&nbsp;land&nbsp;·&nbsp;you&nbsp;·&nbsp;deserve
      </motion.p>
    </div>
  );
}

function HudOverlay() {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 0.7, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6, ease: EASE_OUT_EXPO }}
        className="absolute top-4 sm:top-6 left-4 sm:left-6 text-[8px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.3em] uppercase"
        style={{ color: "#6b7280", fontFamily: HUD_FONT }}
      >
        <div>lat&nbsp;·&nbsp;11.1271°N</div>
        <div className="mt-0.5 sm:mt-1">lng&nbsp;·&nbsp;78.6569°E</div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 0.7, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6, ease: EASE_OUT_EXPO }}
        className="absolute top-4 sm:top-6 right-4 sm:right-6 text-[8px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.3em] uppercase text-right"
        style={{ color: "#242424", fontFamily: HUD_FONT }}
      >
        <div>est.&nbsp;2026</div>
        <div className="mt-0.5 sm:mt-1" style={{ color: PALETTE.emerald }}>● live&nbsp;market</div>
      </motion.div>

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.4, duration: 2.0, ease: "linear" }}
        className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6"
        style={{
          height: 1,
          background: `linear-gradient(90deg, ${PALETTE.silver} 0%, ${PALETTE.ink} 50%, transparent 100%)`,
          transformOrigin: "left",
          opacity: 0.1,
        }}
      />
    </>
  );
}

/* ---------------- Main component ---------------- */

export default function SplashAnimation({ onComplete }: SplashAnimationProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const hideTimer = setTimeout(() => setVisible(false), DURATION_MS);
    const completeTimer = setTimeout(() => {
      if (onComplete) onComplete();
    }, DURATION_MS + EXIT_MS);
    return () => {
      clearTimeout(hideTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          data-testid="territory-splash-root"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98, filter: "blur(8px)" }}
          transition={{ duration: 0.55, ease: EASE_OUT_EXPO }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden select-none touch-none"
          style={{ backgroundColor: PALETTE.obsidian, fontFamily: DISPLAY_FONT }}
        >
          <Backdrop />
          <IsometricStage />
          <Logotype />
          <HudOverlay />
        </motion.div>
      )}
    </AnimatePresence>
  );
}