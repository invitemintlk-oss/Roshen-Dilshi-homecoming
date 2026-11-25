"use client";

import { useEffect, useRef } from "react";

// Celebration night sky drawn on a canvas: warm lights drifting upwards, twinkling sparkles,
// and an occasional soft firework. Everything moves a little faster while the guest scrolls.

type Light = { x: number; y: number; r: number; speed: number; sway: number; phase: number; hue: number; alpha: number };
type Spark = { x: number; y: number; vx: number; vy: number; life: number; max: number; hue: number };

const rand = (a: number, b: number) => a + Math.random() * (b - a);

export default function NightSky() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, dpr = 1;
    let lights: Light[] = [];
    let sparks: Spark[] = [];
    let boost = 0;
    let lastY = window.scrollY;
    let nextBurst = performance.now() + 1500;
    let frame = 0;
    let last = performance.now();

    const makeLight = (anywhere: boolean): Light => ({
      x: rand(0, w),
      y: anywhere ? rand(0, h) : h + rand(10, 60),
      r: rand(1.2, 4.5) * (Math.random() < 0.18 ? 2.6 : 1),
      speed: rand(8, 26),
      sway: rand(6, 22),
      phase: rand(0, Math.PI * 2),
      hue: rand(28, 46),
      alpha: rand(0.35, 0.9),
    });

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(90, (w * h) / 9000));
      lights = Array.from({ length: count }, () => makeLight(true));
    };

    const burst = () => {
      const x = rand(w * 0.15, w * 0.85), y = rand(h * 0.08, h * 0.38);
      const hue = Math.random() < 0.5 ? rand(36, 48) : rand(340, 360);
      const n = 46;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2, v = rand(40, 95);
        sparks.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 0, max: rand(1.3, 2.1), hue });
      }
    };

    const draw = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      boost *= 0.92;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      for (const l of lights) {
        l.y -= (l.speed + boost * 6) * dt;
        l.phase += dt * 0.8;
        if (l.y < -20) Object.assign(l, makeLight(false));
        const x = l.x + Math.sin(l.phase) * l.sway;
        const twinkle = 0.65 + 0.35 * Math.sin(l.phase * 3);
        const g = ctx.createRadialGradient(x, l.y, 0, x, l.y, l.r * 4);
        g.addColorStop(0, `hsla(${l.hue}, 95%, 78%, ${l.alpha * twinkle})`);
        g.addColorStop(1, `hsla(${l.hue}, 95%, 60%, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(x, l.y, l.r * 4, 0, Math.PI * 2); ctx.fill();
      }

      if (!calm && now > nextBurst) { burst(); nextBurst = now + rand(3800, 6500); }
      sparks = sparks.filter((s) => s.life < s.max);
      for (const s of sparks) {
        s.life += dt;
        s.vx *= 0.985; s.vy = s.vy * 0.985 + 22 * dt;
        s.x += s.vx * dt; s.y += s.vy * dt;
        const a = 1 - s.life / s.max;
        ctx.fillStyle = `hsla(${s.hue}, 95%, 75%, ${a * 0.85})`;
        ctx.beginPath(); ctx.arc(s.x, s.y, 1.6 * a + 0.4, 0, Math.PI * 2); ctx.fill();
      }

      ctx.globalCompositeOperation = "source-over";
      frame = requestAnimationFrame(draw);
    };

    const onScroll = () => {
      const y = window.scrollY;
      boost = Math.min(30, boost + Math.abs(y - lastY) * 0.08);
      lastY = y;
    };
    const onVisibility = () => {
      cancelAnimationFrame(frame);
      if (!document.hidden) { last = performance.now(); frame = requestAnimationFrame(draw); }
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
    <div className="night" aria-hidden="true">
      <canvas ref={ref} />
    </div>
  );
}
