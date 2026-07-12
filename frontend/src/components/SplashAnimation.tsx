import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

interface SplashAnimationProps {
  onComplete?: () => void;
}

// ── Timing ─────────────────────────────────────────────────────────────────
const DISPLAY_MS = 2900;
const EXIT_MS    = 480;

// ── App Design System ───────────────────────────────────────────────────────
// Fonts: Poppins (headings) + Inter (body) — same as index.css
const FONT_HEADING = "'Poppins', ui-sans-serif, system-ui, sans-serif";
const FONT_BODY    = "'Inter', ui-sans-serif, system-ui, sans-serif";

// Colours from @theme in index.css
const INK      = "#101010";
const GRAPHITE = "#242424";
const SLATE    = "#6b7280";
const SILVER   = "#e5e7eb";
const PAPER    = "#f4f4f4";
const EMERALD  = "#10b981";

// ── Easing ─────────────────────────────────────────────────────────────────
// Apple / Linear-style ease-out — feels buttery, no spring jitter
const EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

// ── Minimal building data (flat 2D, no 3D transforms) ──────────────────────
const BARS = [
  { id: "a", delay: 0.10, h: 72,  w: 36, x: 0   },
  { id: "b", delay: 0.18, h: 108, w: 44, x: 44  },
  { id: "c", delay: 0.26, h: 156, w: 52, x: 96  },
  { id: "d", delay: 0.34, h: 212, w: 60, x: 157, flagship: true },
  { id: "e", delay: 0.42, h: 140, w: 48, x: 226 },
  { id: "f", delay: 0.50, h: 90,  w: 40, x: 282 },
  { id: "g", delay: 0.58, h: 60,  w: 34, x: 330 },
];

const TOTAL_W = 364; // px, used to centre the skyline

const LETTERS = ["T","E","R","R","I","T","O","R","Y"];

// ── Building bar ─────────────────────────────────────────────────────────────
function Bar({ id, delay, h, w, flagship }: { id: string; delay: number; h: number; w: number; flagship?: boolean }) {
  return (
    <motion.div
      key={id}
      initial={{ scaleY: 0, opacity: 0 }}
      animate={{ scaleY: 1, opacity: 1 }}
      transition={{ delay, duration: 0.7, ease: EXPO }}
      style={{
        width: w,
        height: h,
        transformOrigin: "bottom",
        position: "absolute",
        bottom: 0,
        // Graduated shades: flagship is ink black, others are graphite/silver tones
        background: flagship
          ? `linear-gradient(180deg, ${GRAPHITE} 0%, ${INK} 100%)`
          : `linear-gradient(180deg, ${SILVER} 0%, #94a3b8 100%)`,
        borderTop: flagship
          ? `2px solid ${EMERALD}`
          : "1px solid rgba(16,16,16,0.1)",
        // Only GPU-composited properties
        willChange: "transform, opacity",
      }}
    >
      {/* Window grid — very subtle */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: flagship
            ? "repeating-linear-gradient(0deg, transparent 0, transparent 10px, rgba(255,255,255,0.06) 10px, rgba(255,255,255,0.06) 12px)"
            : "repeating-linear-gradient(0deg, transparent 0, transparent 10px, rgba(16,16,16,0.04) 10px, rgba(16,16,16,0.04) 12px)",
        }}
      />
      {flagship && (
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 1.1, duration: 0.4, ease: EXPO }}
          style={{
            position: "absolute",
            bottom: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            width: 2,
            height: 20,
            background: EMERALD,
            transformOrigin: "bottom",
            boxShadow: `0 0 8px ${EMERALD}`,
            willChange: "transform",
          }}
        />
      )}
    </motion.div>
  );
}

// ── Skyline (pure 2D — the key perf fix) ─────────────────────────────────────
function Skyline() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EXPO, delay: 0.05 }}
      style={{
        position: "relative",
        width: TOTAL_W,
        height: 220,
        margin: "0 auto",
        willChange: "transform, opacity",
      }}
    >
      {BARS.map((b, i) => (
        <div key={b.id} style={{ position: "absolute", left: b.x, bottom: 0, width: b.w, height: b.h }}>
          <Bar {...b} />
        </div>
      ))}
      {/* Ground line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.8, duration: 0.7, ease: EXPO }}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 1.5,
          background: `linear-gradient(90deg, transparent, ${INK}, transparent)`,
          transformOrigin: "center",
          opacity: 0.15,
          willChange: "transform",
        }}
      />
    </motion.div>
  );
}

// ── Tag dots row (surveyor-style) ─────────────────────────────────────────
function TagRow() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.0, duration: 0.55, ease: EXPO }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 10,
        willChange: "transform, opacity",
      }}
    >
      <div style={{ width: 6, height: 6, borderRadius: "50%", background: EMERALD }} />
      <span
        style={{
          fontFamily: FONT_BODY,
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: "0.35em",
          textTransform: "uppercase",
          color: EMERALD,
        }}
      >
        Tamil Nadu · Live Market
      </span>
      <div style={{ width: 6, height: 6, borderRadius: "50%", background: EMERALD }} />
    </motion.div>
  );
}

// ── Brand wordmark using Poppins ─────────────────────────────────────────
function Wordmark() {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      {LETTERS.map((ch, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 1.1 + i * 0.045, duration: 0.6, ease: EXPO }}
          style={{
            fontFamily: FONT_HEADING,
            fontSize: "clamp(36px, 9vw, 68px)",
            fontWeight: 600,
            letterSpacing: "0.18em",
            lineHeight: 1,
            color: INK,
            display: "inline-block",
            willChange: "transform, opacity, filter",
          }}
        >
          {ch}
        </motion.span>
      ))}
    </div>
  );
}

// ── Divider line ──────────────────────────────────────────────────────────
function Divider() {
  return (
    <motion.div
      initial={{ scaleX: 0, opacity: 0 }}
      animate={{ scaleX: 1, opacity: 1 }}
      transition={{ delay: 1.85, duration: 0.6, ease: EXPO }}
      style={{
        height: 1.5,
        width: "min(260px, 55vw)",
        background: `linear-gradient(90deg, transparent, ${EMERALD}, transparent)`,
        transformOrigin: "center",
        boxShadow: `0 0 6px rgba(16,185,129,0.2)`,
        margin: "10px auto 0",
        willChange: "transform, opacity",
      }}
    />
  );
}

// ── Tagline using Inter ───────────────────────────────────────────────────
function Tagline() {
  return (
    <motion.p
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 0.7, y: 0 }}
      transition={{ delay: 2.05, duration: 0.55, ease: EXPO }}
      style={{
        fontFamily: FONT_BODY,
        fontSize: "clamp(8px, 1.8vw, 10px)",
        fontWeight: 500,
        letterSpacing: "0.5em",
        textTransform: "uppercase",
        color: SLATE,
        marginTop: 12,
        willChange: "transform, opacity",
      }}
    >
      own · the · land · you · deserve
    </motion.p>
  );
}

// ── Corner HUD labels (Inter, minimal) ───────────────────────────────────
function Hud() {
  const labelStyle: React.CSSProperties = {
    fontFamily: FONT_BODY,
    fontSize: "clamp(8px, 1.5vw, 10px)",
    fontWeight: 500,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    lineHeight: 1.6,
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 0.7, duration: 0.7, ease: "easeOut" }}
        style={{ position: "absolute", top: "clamp(16px,3vw,28px)", left: "clamp(16px,3vw,28px)", ...labelStyle, color: SLATE }}
      >
        <div>lat · 11.1271° N</div>
        <div style={{ marginTop: 3 }}>lng · 78.6569° E</div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 0.7, duration: 0.7, ease: "easeOut" }}
        style={{ position: "absolute", top: "clamp(16px,3vw,28px)", right: "clamp(16px,3vw,28px)", textAlign: "right", ...labelStyle, color: GRAPHITE }}
      >
        <div>est. 2026</div>
        <div style={{ marginTop: 3, color: EMERALD }}>● live</div>
      </motion.div>

      {/* Bottom scan line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.3, duration: 2.3, ease: "linear" }}
        style={{
          position: "absolute",
          bottom: "clamp(16px,3vw,28px)",
          left: "clamp(16px,3vw,28px)",
          right: "clamp(16px,3vw,28px)",
          height: 1,
          background: `linear-gradient(90deg, ${EMERALD}, ${SILVER}, transparent)`,
          transformOrigin: "left",
          opacity: 0.12,
          willChange: "transform",
        }}
      />
    </>
  );
}

// ── Root ─────────────────────────────────────────────────────────────────────
export default function SplashAnimation({ onComplete }: SplashAnimationProps) {
  const [visible, setVisible] = useState(true);
  const prefersReduced = useReducedMotion();

  // If user prefers reduced motion, skip splash entirely
  useEffect(() => {
    if (prefersReduced) {
      setVisible(false);
      onComplete?.();
      return;
    }
    const t1 = setTimeout(() => setVisible(false), DISPLAY_MS);
    const t2 = setTimeout(() => onComplete?.(), DISPLAY_MS + EXIT_MS);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onComplete, prefersReduced]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          data-testid="territory-splash-root"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.48, ease: EXPO }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: PAPER,
            overflow: "hidden",
            userSelect: "none",
            touchAction: "none",
            // Force GPU layer for the root so children composite correctly
            transform: "translateZ(0)",
            willChange: "opacity, transform",
          }}
        >
          {/* Subtle dot grid background */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `radial-gradient(${SILVER} 1px, transparent 1px)`,
              backgroundSize: "28px 28px",
              opacity: 0.6,
              maskImage: "radial-gradient(circle at center, black 20%, transparent 75%)",
              WebkitMaskImage: "radial-gradient(circle at center, black 20%, transparent 75%)",
              pointerEvents: "none",
            }}
          />

          {/* Centre glow orb */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 0.4, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            style={{
              position: "absolute",
              width: "min(640px, 90vw)",
              height: "min(640px, 90vw)",
              background: "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(244,244,244,0) 70%)",
              filter: "blur(30px)",
              pointerEvents: "none",
              willChange: "transform, opacity",
            }}
          />

          {/* Content stack */}
          <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", width: "100%", padding: "0 24px" }}>
            <Skyline />
            <div style={{ marginTop: 28, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <TagRow />
              <Wordmark />
              <Divider />
              <Tagline />
            </div>
          </div>

          <Hud />
        </motion.div>
      )}
    </AnimatePresence>
  );
}