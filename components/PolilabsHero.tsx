"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";

/* ----------------------------- data ----------------------------- */

type Doodle = {
  text: string;
  left: string;
  top: string;
  size: number;
  rot: number;
  color: string;
  blur: number;
  anim: "drift" | "drift2";
  dur: number;
  delay: number;
  hideSm?: boolean;
};

const DOODLES: Doodle[] = [
  { text: "hire an SEO agency", left: "7%", top: "16%", size: 38, rot: -7, color: "rgba(234,241,237,.4)", blur: 1.6, anim: "drift", dur: 9, delay: -1 },
  { text: "find a writer", left: "62%", top: "11%", size: 44, rot: 5, color: "rgba(167, 139, 250,.45)", blur: 1.4, anim: "drift2", dur: 11, delay: 0 },
  { text: "backlinks?", left: "78%", top: "30%", size: 32, rot: 9, color: "rgba(234,241,237,.3)", blur: 2.4, anim: "drift", dur: 10, delay: -3, hideSm: true },
  { text: "keywords", left: "11%", top: "40%", size: 30, rot: 6, color: "rgba(234,241,237,.28)", blur: 2.8, anim: "drift2", dur: 12, delay: -2 },
  { text: "blog every week??", left: "70%", top: "46%", size: 40, rot: -6, color: "rgba(234,241,237,.34)", blur: 2, anim: "drift", dur: 13, delay: -5 },
  { text: "what's GEO?", left: "4%", top: "62%", size: 34, rot: -4, color: "rgba(167, 139, 250,.34)", blur: 2.2, anim: "drift", dur: 10.5, delay: -1.5, hideSm: true },
  { text: "where's my traffic?", left: "30%", top: "73%", size: 46, rot: 3, color: "rgba(234,241,237,.36)", blur: 1.6, anim: "drift2", dur: 12.5, delay: -4 },
  { text: "structured data", left: "74%", top: "69%", size: 33, rot: 7, color: "rgba(234,241,237,.3)", blur: 2.6, anim: "drift", dur: 11.5, delay: -6, hideSm: true },
  { text: "another invoice", left: "16%", top: "85%", size: 30, rot: -8, color: "rgba(234,241,237,.26)", blur: 3, anim: "drift2", dur: 13.5, delay: -2.5 },
  { text: "AEO??", left: "55%", top: "86%", size: 36, rot: 5, color: "rgba(167, 139, 250,.3)", blur: 2.4, anim: "drift", dur: 12, delay: -3.5, hideSm: true },
  { text: "schema markup", left: "84%", top: "54%", size: 29, rot: -5, color: "rgba(234,241,237,.26)", blur: 2.8, anim: "drift2", dur: 10, delay: -1, hideSm: true },
  { text: "redesign the site", left: "40%", top: "8%", size: 34, rot: -3, color: "rgba(234,241,237,.3)", blur: 2.4, anim: "drift", dur: 11, delay: -5.5 },
  { text: "page speed", left: "2%", top: "30%", size: 28, rot: 8, color: "rgba(234,241,237,.24)", blur: 3.2, anim: "drift2", dur: 12, delay: -2, hideSm: true },
  { text: "Google update again", left: "88%", top: "18%", size: 30, rot: -9, color: "rgba(234,241,237,.26)", blur: 2.8, anim: "drift", dur: 13, delay: -4.5, hideSm: true },
  { text: "publish… publish…", left: "24%", top: "54%", size: 31, rot: 4, color: "rgba(234,241,237,.22)", blur: 3, anim: "drift2", dur: 11, delay: -6 },
  { text: "rankings dropped", left: "60%", top: "62%", size: 27, rot: -6, color: "rgba(234,241,237,.22)", blur: 3.2, anim: "drift", dur: 10, delay: -3, hideSm: true },
  { text: "meta descriptions", left: "46%", top: "40%", size: 26, rot: 7, color: "rgba(234,241,237,.16)", blur: 3.6, anim: "drift2", dur: 14, delay: -1, hideSm: true },
  { text: "content calendar", left: "33%", top: "26%", size: 28, rot: -5, color: "rgba(234,241,237,.18)", blur: 3.4, anim: "drift", dur: 12, delay: -5, hideSm: true },
];

type Particle = {
  left: string;
  top: string;
  size: number;
  bg: string;
  glow: string;
  floatDur: number;
  blinkDur?: number;
  delay: number;
};

const PARTICLES: Particle[] = [
  { left: "20%", top: "25%", size: 5, bg: "#A78BFA", glow: "rgba(167, 139, 250,.8)", floatDur: 7, blinkDur: 4, delay: 0 },
  { left: "80%", top: "40%", size: 4, bg: "#E879F9", glow: "rgba(232, 121, 249,.8)", floatDur: 9, blinkDur: 5, delay: -2 },
  { left: "65%", top: "78%", size: 5, bg: "#A78BFA", glow: "rgba(167, 139, 250,.8)", floatDur: 8, blinkDur: 6, delay: -3 },
  { left: "35%", top: "65%", size: 3, bg: "#EDEAF6", glow: "rgba(234,241,237,.6)", floatDur: 10, delay: -1 },
  { left: "50%", top: "18%", size: 4, bg: "#A78BFA", glow: "rgba(167, 139, 250,.7)", floatDur: 7.5, blinkDur: 4.5, delay: -4 },
  { left: "88%", top: "66%", size: 3, bg: "#E879F9", glow: "rgba(232, 121, 249,.7)", floatDur: 9.5, delay: -2.5 },
];

type LoopNode = { label: string; top: string; left: string; delay: number };

const LOOP_NODES: LoopNode[] = [
  { label: "Research", top: "11%", left: "50%", delay: 0 },
  { label: "Write", top: "50%", left: "89%", delay: -3.5 },
  { label: "Publish", top: "89%", left: "50%", delay: -7 },
  { label: "Measure", top: "50%", left: "11%", delay: -10.5 },
];

const SEARCH_COVERAGE = [
  { label: "SEO", value: 94 },
  { label: "AEO", value: 88 },
  { label: "GEO", value: 91 },
];

const RANKINGS = [
  { rank: "#1", term: "best craft soda", delta: "↑3", active: true },
  { rank: "#2", term: "low-sugar drinks", delta: "↑5", active: true },
  { rank: "#4", term: "natural energy", delta: "↑2", active: false },
];

/* ----------------------------- shared style fragments ----------------------------- */

const mono = "'JetBrains Mono', monospace";
const mintGradient = "linear-gradient(115deg,#A78BFA,#E879F9)";

const widgetBase: CSSProperties = {
  opacity: 0,
  transform: "translateY(24px) scale(.96)",
  transition:
    "opacity .55s ease, transform .6s cubic-bezier(.34,1.56,.64,1)",
};

const eyebrow: CSSProperties = {
  fontFamily: mono,
  fontSize: 10.5,
  letterSpacing: ".12em",
  textTransform: "uppercase",
  color: "#827C90",
};

const gradientText: CSSProperties = {
  background: mintGradient,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  WebkitTextFillColor: "transparent",
  color: "transparent",
};

/* the handwritten doodle phrases, as floating animated spans */
function DoodleSpans() {
  return (
    <>
      {DOODLES.map((d, i) => (
        <span
          key={i}
          className={`doodle${d.hideSm ? " hide-sm" : ""}`}
          style={{
            position: "absolute",
            left: d.left,
            top: d.top,
            fontSize: d.size,
            ["--rot" as string]: `${d.rot}deg`,
            transform: `rotate(${d.rot}deg)`,
            color: d.color,
            filter: `blur(${d.blur}px)`,
            animation: `${d.anim} ${d.dur}s ease-in-out infinite`,
            animationDelay: `${d.delay}s`,
          }}
        >
          {d.text}
        </span>
      ))}
    </>
  );
}

/* ----------------------------- component ----------------------------- */

export default function PolilabsHero() {
  const [revealed, setRevealed] = useState(false);
  const [customCursor, setCustomCursor] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const particleRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  const back = useCallback(() => setRevealed(false), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") back();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [back]);

  // Cursor-driven parallax (the doodle field tilts in 3D) + a custom cursor.
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setCustomCursor(true);

    let cx = window.innerWidth / 2;
    let cy = window.innerHeight / 2;
    let curX = cx;
    let curY = cy;
    // normalized -1..1 offset from centre, smoothed
    let tnx = 0;
    let tny = 0;
    let nx = 0;
    let ny = 0;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      cx = e.clientX;
      cy = e.clientY;
      tnx = (e.clientX / window.innerWidth - 0.5) * 2;
      tny = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const tick = () => {
      // smooth follow for the cursor (a touch of lag/trail)
      curX += (cx - curX) * 0.22;
      curY += (cy - curY) * 0.22;
      // slower smoothing for the parallax so the field glides like a globe
      nx += (tnx - nx) * 0.05;
      ny += (tny - ny) * 0.05;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${curX}px, ${curY}px, 0) translate(-50%, -50%)`;
      }
      if (!reduce) {
        if (fieldRef.current) {
          fieldRef.current.style.transform = `perspective(1200px) rotateX(${(
            -ny * 11
          ).toFixed(2)}deg) rotateY(${(nx * 13).toFixed(2)}deg) translate3d(${(
            nx * -26
          ).toFixed(1)}px, ${(ny * -26).toFixed(1)}px, 0)`;
        }
        if (particleRef.current) {
          // particles drift the opposite way for layered depth
          particleRef.current.style.transform = `translate3d(${(nx * 16).toFixed(
            1
          )}px, ${(ny * 16).toFixed(1)}px, 0)`;
        }
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);

    // grow the ring over interactive targets
    const onEnter = () => ringRef.current?.classList.add("cursor-hover");
    const onLeave = () => ringRef.current?.classList.remove("cursor-hover");
    const targets = stageRef.current?.querySelectorAll<HTMLElement>(
      ".nomore-go, .backbtn"
    );
    targets?.forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      targets?.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
    };
  }, []);

  return (
    <div
      id="pl-stage"
      ref={stageRef}
      className={`${revealed ? "revealed" : ""}${
        customCursor ? " cursor-active" : ""
      }`.trim()}
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        overflow: "hidden",
        backgroundImage:
          "radial-gradient(rgba(255,255,255,.035) 1px,transparent 1px)",
        backgroundSize: "30px 30px",
      }}
    >
      {/* custom cursor — a glowing ring that trails + a solid dot */}
      {customCursor && (
        <>
          <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
          <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
        </>
      )}

      {/* ============ NOISE LAYER (front page) ============ */}
      <div
        className="noise-layer"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: 32,
          transition:
            "opacity .85s cubic-bezier(.22,1,.36,1), filter .85s cubic-bezier(.22,1,.36,1), transform .85s cubic-bezier(.22,1,.36,1)",
        }}
      >
        {/* soft moving glows */}
        <div
          style={{
            position: "absolute",
            top: "8%",
            left: "14%",
            width: "42vw",
            height: "42vw",
            maxWidth: 560,
            maxHeight: 560,
            borderRadius: "50%",
            background:
              "radial-gradient(circle,rgba(167, 139, 250,.14),transparent 70%)",
            filter: "blur(6px)",
            animation: "glowPulse 11s ease-in-out infinite",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "6%",
            right: "12%",
            width: "40vw",
            height: "40vw",
            maxWidth: 520,
            maxHeight: 520,
            borderRadius: "50%",
            background:
              "radial-gradient(circle,rgba(232, 121, 249,.11),transparent 70%)",
            filter: "blur(6px)",
            animation: "glowPulse 13s ease-in-out infinite",
            animationDelay: "-4s",
            pointerEvents: "none",
          }}
        />

        {/* doodle field (the chaos businesses juggle) — tilts in 3D with the cursor */}
        <div
          ref={fieldRef}
          style={{
            position: "absolute",
            inset: "-8%",
            fontFamily: "'Caveat', cursive",
            pointerEvents: "none",
            overflow: "visible",
            transformStyle: "preserve-3d",
            willChange: "transform",
          }}
        >
          <DoodleSpans />
        </div>

        {/* floating particles */}
        <div
          ref={particleRef}
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            willChange: "transform",
          }}
        >
          {PARTICLES.map((p, i) => (
            <span
              key={i}
              style={{
                position: "absolute",
                left: p.left,
                top: p.top,
                width: p.size,
                height: p.size,
                borderRadius: "50%",
                background: p.bg,
                boxShadow: `0 0 ${p.size * 2}px 2px ${p.glow}`,
                animation: `floaty ${p.floatDur}s ease-in-out infinite${
                  p.blinkDur ? `, blink ${p.blinkDur}s ease-in-out infinite` : ""
                }`,
                animationDelay: `${p.delay}s`,
              }}
            />
          ))}
        </div>

        {/* THE one thing: Polilabs */}
        <div
          style={{
            position: "relative",
            zIndex: 5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h1
            style={{
              fontSize: "clamp(58px,13vw,184px)",
              fontWeight: 600,
              letterSpacing: "-0.045em",
              lineHeight: 0.92,
              margin: 0,
              color: "#EDEAF6",
              textShadow: "0 0 70px rgba(167, 139, 250,.3)",
            }}
          >
            poli
            <span style={gradientText}>labs</span>
          </h1>
          <p
            style={{
              margin: "22px 0 0",
              fontFamily: mono,
              fontSize: "clamp(11px,1.4vw,14px)",
              letterSpacing: ".22em",
              textTransform: "uppercase",
              color: "#827C90",
            }}
          >
            The AI growth engine
          </p>
        </div>

        {/* the only affordance: No more */}
        <div
          style={{
            position: "absolute",
            bottom: "clamp(28px,6vh,64px)",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 6,
          }}
        >
          <button
            type="button"
            className="nomore-go"
            aria-label="Enter Polilabs"
            onClick={() => setRevealed(true)}
            style={{ width: 72, height: 72 }}
          />
        </div>
      </div>

      {/* ============ POWER LAYER (revealed) ============ */}
      <div
        className="power-layer"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          opacity: 0,
          pointerEvents: "none",
          overflowY: "auto",
          transition: "opacity .7s cubic-bezier(.22,1,.36,1)",
          backgroundImage:
            "radial-gradient(rgba(167, 139, 250,.05) 1px,transparent 1px)",
          backgroundSize: "30px 30px",
          backgroundColor: "#08070D",
        }}
      >
        {/* faint handwritten doodle backdrop — same as the front, but quiet */}
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            fontFamily: "'Caveat', cursive",
            pointerEvents: "none",
            overflow: "hidden",
            opacity: 0.4,
            zIndex: 0,
          }}
        >
          <DoodleSpans />
        </div>

        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 1140,
            margin: "0 auto",
            padding:
              "clamp(28px,5vw,56px) clamp(20px,5vw,48px) 72px",
          }}
        >
          {/* header: the polilabs wordmark + a way back. no nav. */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              marginBottom: "clamp(36px,6vw,64px)",
            }}
          >
            <span
              style={{
                fontSize: "clamp(22px,2.6vw,30px)",
                fontWeight: 600,
                letterSpacing: "-0.03em",
                lineHeight: 1,
              }}
            >
              poli
              <span style={gradientText}>labs</span>
            </span>
            <button
              className="backbtn"
              onClick={back}
              style={{
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "transparent",
                border: "1px solid rgba(255,255,255,.16)",
                borderRadius: 999,
                padding: "9px 16px",
                color: "#A29BB2",
                fontFamily: mono,
                fontSize: 12,
                letterSpacing: ".06em",
                transition:
                  "border-color .25s ease, background .25s ease, color .25s ease",
              }}
            >
              ← back to the noise
            </button>
          </div>

          {/* heading */}
          <div
            className="widget"
            style={{
              ...widgetBase,
              transitionDelay: ".05s",
              maxWidth: 760,
              marginBottom: "clamp(28px,4vw,44px)",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 9,
                fontFamily: mono,
                fontSize: 12,
                letterSpacing: ".16em",
                textTransform: "uppercase",
                color: "#A78BFA",
                marginBottom: 18,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#A78BFA",
                  boxShadow: "0 0 9px 1px rgba(167, 139, 250,.9)",
                  animation: "blink 2.2s ease-in-out infinite",
                }}
              />
              One engine, instead
            </div>
            <h2
              style={{
                fontSize: "clamp(32px,5.4vw,64px)",
                fontWeight: 500,
                letterSpacing: "-0.035em",
                lineHeight: 1.02,
                margin: "0 0 16px",
              }}
            >
              The <span style={gradientText}>power</span> of what we do.
            </h2>
            <p
              style={{
                fontSize: "clamp(16px,1.6vw,20px)",
                lineHeight: 1.55,
                color: "#A29BB2",
                margin: 0,
                maxWidth: 600,
              }}
            >
              Everything that used to be scattered across agencies, writers, and
              developers — research, writing, publishing, and measurement —
              running as one continuous engine.
            </p>
          </div>

          {/* FEATURE: the Living Website loop */}
          <div
            className="feature-tile widget"
            style={{
              ...widgetBase,
              transitionDelay: ".13s",
              display: "flex",
              gap: "clamp(24px,4vw,56px)",
              alignItems: "center",
              background: "linear-gradient(160deg,#0E1417,#0A0D10)",
              border: "1px solid rgba(167, 139, 250,.22)",
              borderRadius: 24,
              padding: "clamp(26px,4vw,48px)",
              marginBottom: 18,
              overflow: "hidden",
            }}
          >
            <div style={{ flex: "1 1 280px", minWidth: 0 }}>
              <div
                style={{
                  fontFamily: mono,
                  fontSize: 12,
                  letterSpacing: ".16em",
                  textTransform: "uppercase",
                  color: "#A78BFA",
                  marginBottom: 16,
                }}
              >
                The Living Website
              </div>
              <h3
                style={{
                  fontSize: "clamp(24px,3vw,38px)",
                  fontWeight: 500,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.06,
                  margin: "0 0 14px",
                }}
              >
                A website that never sits still.
              </h3>
              <p
                style={{
                  fontSize: "clamp(15px,1.4vw,17.5px)",
                  lineHeight: 1.55,
                  color: "#A29BB2",
                  margin: 0,
                }}
              >
                It researches what&apos;s ranking, writes new content to match,
                publishes it, and measures the result — then starts again. A
                growth loop that runs on its own.
              </p>
            </div>

            {/* the loop */}
            <div
              style={{
                flex: "none",
                position: "relative",
                width: "min(380px,80vw)",
                aspectRatio: "1",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: "11%",
                  borderRadius: "50%",
                  border: "1px dashed rgba(167, 139, 250,.28)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: "11%",
                  borderRadius: "50%",
                  background:
                    "conic-gradient(from -90deg,rgba(167, 139, 250,0) 0deg,rgba(167, 139, 250,.22) 55deg,rgba(232, 121, 249,0) 120deg)",
                  animation: "orbit 14s linear infinite",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: "11%",
                  animation: "orbit 14s linear infinite",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: -7,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    background: "#A78BFA",
                    boxShadow: "0 0 18px 5px rgba(167, 139, 250,.8)",
                  }}
                />
              </div>
              <div
                style={{
                  position: "absolute",
                  inset: "34%",
                  borderRadius: "50%",
                  background: "radial-gradient(circle,#1B1233,#0A0814)",
                  border: "1px solid rgba(167, 139, 250,.3)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  animation: "corePulse 4s ease-in-out infinite",
                }}
              >
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: 10,
                    letterSpacing: ".14em",
                    textTransform: "uppercase",
                    color: "#A78BFA",
                  }}
                >
                  Living
                </span>
                <span
                  style={{
                    fontSize: "clamp(13px,2vw,17px)",
                    fontWeight: 600,
                    letterSpacing: "-0.01em",
                  }}
                >
                  Website
                </span>
              </div>
              {LOOP_NODES.map((n) => (
                <div
                  key={n.label}
                  style={{
                    position: "absolute",
                    top: n.top,
                    left: n.left,
                    transform: "translate(-50%,-50%)",
                    fontFamily: mono,
                    fontSize: 11,
                    letterSpacing: ".08em",
                    textTransform: "uppercase",
                    background: "#0E1316",
                    border: "1px solid rgba(255,255,255,.1)",
                    borderRadius: 999,
                    padding: "8px 14px",
                    whiteSpace: "nowrap",
                    animation: "nodePulse 14s linear infinite",
                    animationDelay: `${n.delay}s`,
                  }}
                >
                  {n.label}
                </div>
              ))}
            </div>
          </div>

          {/* WIDGET CASCADE */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
              gap: 18,
            }}
          >
            {/* Visibility */}
            <div
              className="widget"
              style={{
                ...widgetBase,
                transitionDelay: ".2s",
                background: "#0E1316",
                border: "1px solid rgba(255,255,255,.07)",
                borderRadius: 18,
                padding: 22,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 14,
                }}
              >
                <span style={eyebrow}>Visibility</span>
                <span
                  style={{ fontSize: 13, color: "#A78BFA", fontWeight: 500 }}
                >
                  ↑ climbing
                </span>
              </div>
              <svg
                viewBox="0 0 240 90"
                style={{ width: "100%", height: "auto", display: "block" }}
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="hg1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#A78BFA" stopOpacity="0.28" />
                    <stop offset="1" stopColor="#A78BFA" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="hg2" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor="#A78BFA" />
                    <stop offset="1" stopColor="#E879F9" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,78 C36,72 52,64 80,54 C108,44 124,30 156,24 C188,18 212,12 240,6 L240,90 L0,90 Z"
                  fill="url(#hg1)"
                />
                <path
                  d="M0,78 C36,72 52,64 80,54 C108,44 124,30 156,24 C188,18 212,12 240,6"
                  fill="none"
                  stroke="url(#hg2)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <circle cx="240" cy="6" r="4" fill="#A78BFA" />
              </svg>
            </div>

            {/* Search coverage */}
            <div
              className="widget"
              style={{
                ...widgetBase,
                transitionDelay: ".27s",
                background: "#0E1316",
                border: "1px solid rgba(255,255,255,.07)",
                borderRadius: 18,
                padding: 22,
              }}
            >
              <span style={eyebrow}>Search coverage</span>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 13,
                  marginTop: 16,
                }}
              >
                {SEARCH_COVERAGE.map((row) => (
                  <div key={row.label}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: 12,
                        marginBottom: 5,
                      }}
                    >
                      <span style={{ color: "#C0B9CE" }}>{row.label}</span>
                      <span style={{ color: "#A78BFA", fontFamily: mono }}>
                        {row.value}
                      </span>
                    </div>
                    <div
                      style={{
                        height: 6,
                        borderRadius: 999,
                        background: "rgba(255,255,255,.07)",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${row.value}%`,
                          height: "100%",
                          background: "linear-gradient(90deg,#A78BFA,#E879F9)",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rankings */}
            <div
              className="widget"
              style={{
                ...widgetBase,
                transitionDelay: ".34s",
                background: "#0E1316",
                border: "1px solid rgba(255,255,255,.07)",
                borderRadius: 18,
                padding: 22,
              }}
            >
              <span style={eyebrow}>Rankings</span>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 11,
                  marginTop: 16,
                }}
              >
                {RANKINGS.map((r) => (
                  <div
                    key={r.term}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      fontSize: 13.5,
                    }}
                  >
                    <span
                      style={{
                        color: r.active ? "#EDEAF6" : "#A29BB2",
                        display: "flex",
                        gap: 9,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: mono,
                          color: r.active ? "#A78BFA" : "#827C90",
                        }}
                      >
                        {r.rank}
                      </span>
                      {r.term}
                    </span>
                    <span style={{ color: "#A78BFA", fontSize: 12 }}>
                      {r.delta}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Just published */}
            <div
              className="widget"
              style={{
                ...widgetBase,
                transitionDelay: ".41s",
                background: "#0E1316",
                border: "1px solid rgba(255,255,255,.07)",
                borderRadius: 18,
                padding: 22,
              }}
            >
              <span style={eyebrow}>Just published</span>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  marginTop: 16,
                }}
              >
                <span
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 7,
                    background: "linear-gradient(120deg,#A78BFA,#E879F9)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#1E0B33",
                    fontWeight: 700,
                    fontSize: 13,
                    flex: "none",
                  }}
                >
                  ✓
                </span>
                <div>
                  <div
                    style={{
                      fontSize: 14.5,
                      fontWeight: 500,
                      lineHeight: 1.35,
                      marginBottom: 4,
                    }}
                  >
                    12 F&amp;B flavor trends for 2026
                  </div>
                  <div
                    style={{ fontFamily: mono, fontSize: 11, color: "#827C90" }}
                  >
                    1,480 words · schema attached
                  </div>
                </div>
              </div>
            </div>

            {/* Structured data */}
            <div
              className="widget"
              style={{
                ...widgetBase,
                transitionDelay: ".48s",
                background: "#0B0E11",
                border: "1px solid rgba(255,255,255,.07)",
                borderRadius: 18,
                padding: 22,
              }}
            >
              <span style={eyebrow}>Structured data</span>
              <pre
                style={{
                  margin: "14px 0 0",
                  fontFamily: mono,
                  fontSize: 11.5,
                  lineHeight: 1.6,
                  color: "#C0B9CE",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {"{\n  "}
                <span style={{ color: "#A78BFA" }}>&quot;@type&quot;</span>
                {": "}
                <span style={{ color: "#E879F9" }}>&quot;Product&quot;</span>
                {",\n  "}
                <span style={{ color: "#A78BFA" }}>&quot;brand&quot;</span>
                {": "}
                <span style={{ color: "#E879F9" }}>&quot;Polilabs&quot;</span>
                {",\n  "}
                <span style={{ color: "#A78BFA" }}>&quot;rating&quot;</span>
                {": "}
                <span style={{ color: "#E879F9" }}>4.9</span>
                {"\n}"}
              </pre>
            </div>

            {/* Keywords stat */}
            <div
              className="widget"
              style={{
                ...widgetBase,
                transitionDelay: ".55s",
                background:
                  "linear-gradient(160deg,rgba(167, 139, 250,.08),rgba(232, 121, 249,.03))",
                border: "1px solid rgba(167, 139, 250,.22)",
                borderRadius: 18,
                padding: 22,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  fontSize: "clamp(34px,4vw,46px)",
                  fontWeight: 600,
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                  ...gradientText,
                }}
              >
                +148
              </div>
              <div
                style={{
                  fontSize: 13.5,
                  color: "#C0B9CE",
                  marginTop: 8,
                  lineHeight: 1.4,
                }}
              >
                new keywords tracked and targeted this month
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
