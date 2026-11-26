"use client";

import { useEffect, useRef } from "react";

// Festive backdrop: rose and marigold petals drifting down over a maroon wall,
// with small gold sparkles twinkling in between. Petals hurry a little while the guest scrolls.

type Petal = { x: number; y: number; size: number; fall: number; sway: number; phase: number; spin: number; angle: number; color: string };
type Glint = { x: number; y: number; r: number; phase: number; speed: number };

const COLORS = ["#B0162E", "#8E1B2B", "#C8283E", "#E8891C", "#F5B731", "#D9661A"];
const rand = (a: number, b: number) => a + Math.random() * (b - a);

export default function Petals() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0;
    let petals: Petal[] = [];
    let glints: Glint[] = [];
    let boost = 0, lastY = window.scrollY, frame = 0, last = performance.now();

    const makePetal = (anywhere: boolean): Petal => ({
      x: rand(0, w),
      y: anywhere ? rand(-h, h) : rand(-60, -20),
      size: rand(6, 13),
      fall: rand(22, 48),
      sway: rand(10, 30),
      phase: rand(0, Math.PI * 2),
      spin: rand(-1.4, 1.4),
      angle: rand(0, Math.PI * 2),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    });

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      petals = Array.from({ length: Math.round(Math.min(34, (w * h) / 22000)) }, () => makePetal(true));
      glints = Array.from({ length: Math.round(Math.min(60, (w * h) / 12000)) }, () => ({
        x: rand(0, w), y: rand(0, h), r: rand(0.8, 2.2), phase: rand(0, Math.PI * 2), speed: rand(1, 2.6),
      }));
    };

    const drawPetal = (p: Petal, x: number) => {
      ctx.save();
      ctx.translate(x, p.y);
      ctx.rotate(p.angle);
      ctx.scale(1, 0.55 + 0.45 * Math.abs(Math.sin(p.phase * 1.3))); // tumbling
      ctx.fillStyle = p.color;
      ctx.globalAlpha = 0.85;
      ctx.beginPath();
      ctx.moveTo(0, -p.size);
      ctx.bezierCurveTo(p.size * 0.9, -p.size * 0.6, p.size * 0.7, p.size * 0.7, 0, p.size);
      ctx.bezierCurveTo(-p.size * 0.7, p.size * 0.7, -p.size * 0.9, -p.size * 0.6, 0, -p.size);
      ctx.fill();
      ctx.globalAlpha = 0.25;
      ctx.fillStyle = "#FFE3A3";
      ctx.beginPath(); ctx.ellipse(0, -p.size * 0.2, p.size * 0.18, p.size * 0.6, 0, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    };

    const draw = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      boost *= 0.92;
      ctx.clearRect(0, 0, w, h);

      for (const g of glints) {
        g.phase += dt * g.speed;
        const a = Math.max(0, Math.sin(g.phase));
        ctx.globalAlpha = a * 0.9;
        ctx.fillStyle = "#FFE3A3";
        ctx.beginPath(); ctx.arc(g.x, g.y, g.r, 0, Math.PI * 2); ctx.fill();
        if (a > 0.85) { // little cross flare at the peak
          ctx.fillRect(g.x - g.r * 4, g.y - 0.4, g.r * 8, 0.8);
          ctx.fillRect(g.x - 0.4, g.y - g.r * 4, 0.8, g.r * 8);
        }
      }
      ctx.globalAlpha = 1;

      for (const p of petals) {
        p.y += (p.fall + boost * 5) * dt;
        p.phase += dt;
        p.angle += p.spin * dt;
        if (p.y > h + 30) Object.assign(p, makePetal(false));
        drawPetal(p, p.x + Math.sin(p.phase) * p.sway);
      }
      ctx.globalAlpha = 1;
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
    if (calm) { draw(performance.now()); cancelAnimationFrame(frame); }
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
