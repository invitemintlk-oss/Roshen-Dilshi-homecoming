"use client";

import { useEffect, useRef } from "react";

// Festive backdrop: peacock feathers drifting down, rocking gently from side to side
// like a pendulum. They hurry a little while the guest scrolls.

type Feather = { x: number; y: number; size: number; fall: number; sway: number; phase: number; tilt: number };

const FEATHER_SRC = "/assets/peacock-feather.webp";
const FEATHER_RATIO = 132 / 240; // width / height of the feather image
const rand = (a: number, b: number) => a + Math.random() * (b - a);

export default function Feathers() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0;
    let feathers: Feather[] = [];
    let boost = 0, lastY = window.scrollY, frame = 0, last = performance.now();
    const img = new Image();
    img.src = FEATHER_SRC;

    const makeFeather = (anywhere: boolean): Feather => ({
      x: rand(w * 0.05, w * 0.95),
      y: anywhere ? rand(-h * 0.5, h) : rand(-140, -80),
      size: rand(58, 96),
      fall: rand(18, 32),
      sway: rand(25, 55),
      phase: rand(0, Math.PI * 2),
      tilt: rand(-0.45, 0.45),
    });

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      feathers = Array.from({ length: w < 600 ? 8 : 12 }, () => makeFeather(true));
    };

    const draw = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      boost *= 0.92;
      ctx.clearRect(0, 0, w, h);

      if (img.complete && img.naturalWidth) {
        for (const f of feathers) {
          f.y += (f.fall + boost * 3) * dt;
          f.phase += dt * 0.9;
          if (f.y > h + 90) Object.assign(f, makeFeather(false));
          ctx.save();
          ctx.translate(f.x + Math.sin(f.phase) * f.sway, f.y);
          ctx.rotate(f.tilt + Math.sin(f.phase) * 0.5);
          ctx.globalAlpha = 0.92;
          ctx.drawImage(img, (-f.size * FEATHER_RATIO) / 2, -f.size / 2, f.size * FEATHER_RATIO, f.size);
          ctx.restore();
        }
      }
      frame = requestAnimationFrame(draw);
    };

    const onScroll = () => {
      const y = window.scrollY;
      boost = Math.min(30, boost + Math.abs(y - lastY) * 0.06);
      lastY = y;
    };
    const onVisibility = () => {
      cancelAnimationFrame(frame);
      if (!document.hidden && !calm) { last = performance.now(); frame = requestAnimationFrame(draw); }
    };

    resize();
    // with reduced motion, draw one still frame (again once the feather image has loaded)
    const still = () => { draw(performance.now()); cancelAnimationFrame(frame); };
    if (calm) { still(); img.onload = still; }
    else frame = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div className="backdrop" aria-hidden="true">
      <canvas ref={ref} />
    </div>
  );
}
