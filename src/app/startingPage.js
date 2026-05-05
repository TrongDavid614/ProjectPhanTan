"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import localFont from "next/font/local";

const fogtwono5 = localFont({
  src: "../../public/assets/fonts/fogtwono5/FogtwoNo5.otf",
  variable: "--font-fogtwono5",
  display: "swap",
});

const kanit = localFont({
  src: "../../public/assets/fonts/Kanit/Kanit-Medium.ttf",
  variable: "--font-kanit",
  display: "swap",
});

const ModelViewer = dynamic(() => import("@/components/three/ModelViewer"), {
  ssr: false,
});

export default function StartingPage() {
  const containerRef = useRef(null);
  const enterTimeoutRef = useRef(null);
  const [zooming, setZooming] = useState(false);
  const router = useRouter();

  const handleEnter = useCallback(() => {
    if (enterTimeoutRef.current) {
      clearTimeout(enterTimeoutRef.current);
    }
    setZooming(true);
    enterTimeoutRef.current = setTimeout(() => {
      router.push("/highlight");
    }, 250);
  }, [router]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleEnter();
      }
    },
    [handleEnter],
  );

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.focus();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (enterTimeoutRef.current) {
        clearTimeout(enterTimeoutRef.current);
      }
    };
  }, [handleKeyDown]);

  const handleMouseMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const el = containerRef.current;
    if (el) {
      el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      el.style.setProperty("--my", `${e.clientY - rect.top}px`);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    const el = containerRef.current;
    if (el) {
      el.style.setProperty("--mx", "-9999px");
      el.style.setProperty("--my", "-9999px");
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full min-h-screen overflow-hidden page-container${zooming ? " zoom-in" : ""}`}
      style={{ "--mx": "-9999px", "--my": "-9999px" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/FirstPage.png')",
          filter: "brightness(1.4)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle 200px at var(--mx) var(--my), transparent 0%, rgba(0,0,0,0.5) 100%)",
          transition: "background 0.05s ease",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle 180px at var(--mx) var(--my), rgba(255,255,255,0.2) 0%, transparent 100%)",
          mixBlendMode: "screen",
          transition: "background 0.05s ease",
        }}
      />
      <div className="absolute inset-0 pointer-events-none spotlight-beam beam-1" />
      <div className="absolute inset-0 pointer-events-none spotlight-beam beam-2" />
      <div className="absolute inset-0 pointer-events-none spotlight-beam beam-3" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-white text-center px-6">
        <div style={{ width: 800, height: 800, marginLeft: -100 }}>
          <ModelViewer url="/Model8Threadfinal.glb" />
        </div>
        <div
          className="enter-btn"
          onClick={handleEnter}
          style={{
            background: "url('/assets/images/button-bg 1.png')",
            backgroundRepeat: "no-repeat",
            width: 157,
            height: 39,
            color: "black",
            cursor: "pointer",
          }}
        >
          <span
            style={{
              fontSize: 23,
              lineHeight: "40px",
              fontFamily: fogtwono5.style.fontFamily,
            }}
          >
            ENTER
          </span>
        </div>
      </div>
    </div>
  );
}
