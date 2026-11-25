"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Icon, { type IconName } from "./Icon";
import Countdown from "./Countdown";
import CalendarButton from "./CalendarButton";
import RsvpForm from "./RsvpForm";
import NightSky from "./NightSky";
import { coupleNames, mapsEmbed, mapsLink, wedding } from "@/lib/wedding";

type Phase = "closed" | "opening" | "gone" | "removed";

const parents = wedding.parents.filter((p) => p.names.trim());

function Sprig() {
  // Small drawn divider: a reed sprig either side of a sun
  return (
    <svg className="sprig" viewBox="0 0 120 16" aria-hidden="true">
      <path d="M2 8h44M74 8h44" stroke="currentColor" strokeWidth="1" />
      <circle cx="60" cy="8" r="4" fill="currentColor" />
      <path d="M60 0v2M60 14v2M52 8h2M66 8h2M54.3 2.3l1.4 1.4M64.3 12.3l1.4 1.4M54.3 13.7l1.4-1.4M64.3 3.7l1.4-1.4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

export default function Invitation({ guest = "" }: { guest?: string }) {
  const [phase, setPhase] = useState<Phase>("closed");
  const [playing, setPlaying] = useState(false);
  const audio = useRef<HTMLAudioElement>(null);

  const playMusic = useCallback(() => {
    const el = audio.current;
    if (!el) return;
    el.volume = 0.5;
    el.play().then(() => setPlaying(true), () => setPlaying(false));
  }, []);

  function toggleMusic() {
    const el = audio.current;
    if (!el) return;
    if (el.paused) playMusic();
    else { el.pause(); setPlaying(false); }
  }

  function openInvite() {
    if (phase !== "closed") return;
    playMusic(); // the tap is the user gesture browsers require before audio can play
    setPhase("opening");
    setTimeout(() => setPhase("gone"), 1100);
    setTimeout(() => setPhase("removed"), 2100);
  }

  // Lock scrolling behind the welcome screen; #open skips it (handy while editing)
  useEffect(() => {
    if (location.hash === "#open") { setPhase("removed"); return; }
    document.body.classList.add("locked");
    return () => document.body.classList.remove("locked");
  }, []);

  const introDone = phase === "gone" || phase === "removed";

  useEffect(() => {
    if (introDone) document.body.classList.remove("locked");
  }, [introDone]);

  useEffect(() => {
    if (!introDone) return;
    const els = document.querySelectorAll(".rise");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [introDone]);

  const welcomeClass = [phase !== "closed" && "opening", introDone && "gone"].filter(Boolean).join(" ");

  return (
    <>
      <NightSky />

      {/* ============ WELCOME SCREEN ============ */}
      {phase !== "removed" && (
        <div id="welcome" className={welcomeClass} role="dialog" aria-label="Open your invitation">
          <video className="welcome-video" src="/assets/intro-video.mp4" poster="/assets/intro-video-poster.jpg"
            autoPlay muted loop playsInline preload="auto" disablePictureInPicture aria-hidden="true" />
          <div className="welcome-frame" aria-hidden="true"><i /><i /><i /><i /></div>

          <div className="welcome-top">
            <p className="welcome-kicker w-in" style={{ ["--d" as string]: "0.3s" }}>
              <span aria-hidden="true" />A Homecoming Invitation<span aria-hidden="true" />
            </p>
            <p className="welcome-names w-in" style={{ ["--d" as string]: "0.7s" }}>
              {wedding.partner1}<span className="welcome-amp">&amp;</span>{wedding.partner2}
            </p>
            <p className="welcome-si w-in" lang="si" style={{ ["--d" as string]: "1.1s" }}>{wedding.namesSi}</p>
            <p className="welcome-date w-in" style={{ ["--d" as string]: "1.4s" }}>{wedding.dateParts.join(" · ")}</p>
          </div>

          <div className="welcome-bottom">
            {guest && (
              <p className="welcome-guest w-in" style={{ ["--d" as string]: "1.8s" }}>
                <span>Especially for</span>{guest}
              </p>
            )}
            <button type="button" className="seal w-in" style={{ ["--d" as string]: "2.1s" }} onClick={openInvite}
              aria-label={`Open the invitation from ${coupleNames}`}>
              <span className="seal-halo" aria-hidden="true" />
              <Icon name="rings" size={30} stroke={1.3} />
            </button>
            <p className="welcome-tap w-in" style={{ ["--d" as string]: "2.3s" }} aria-hidden="true">Tap to open</p>
          </div>
        </div>
      )}

      <main id="main">
        {/* ============ HERO ============ */}
        <header id="hero" className="hero">
          <p className="label">{wedding.eventName} Celebration</p>
          <h1 className="hero-names">
            <span>{wedding.partner1}</span>
            <span className="hero-and" aria-hidden="true">&amp;</span>
            <span className="sr">and</span>
            <span>{wedding.partner2}</span>
          </h1>
          <p className="hero-si" lang="si">{wedding.namesSi}</p>
          <Sprig />
          <p className="hero-line">With the blessings of our families, we warmly invite you to celebrate our {wedding.eventName.toLowerCase()}.</p>

          <div className="hero-when">
            <span className="label">{wedding.weekday}</span>
            <strong>{wedding.dateLong}</strong>
            <span lang="si">{wedding.dateSi}</span>
            <span className="hero-where">{wedding.venue.name} · {wedding.venue.area}</span>
          </div>

          {guest && (
            <div className="hero-guest">
              <span className="label">Specially invited</span>
              <span>We cordially invite</span>
              <strong>{guest}</strong>
              <span>to celebrate our special day with us.</span>
            </div>
          )}

          {parents.length > 0 && (
            <div className="hero-parents">
              {parents.map((p) => (
                <p key={p.label}><span className="label">{p.label}</span><span lang="si">{p.names}</span></p>
              ))}
            </div>
          )}

          <a href="#countdown" className="hero-more">
            Details below <Icon name="chevron" size={16} stroke={1.6} />
          </a>
        </header>

        {/* ============ COUNTDOWN ============ */}
        <section id="countdown" className="panel rise" aria-labelledby="h-count">
          <p className="label">Save the date</p>
          <h2 id="h-count" className="panel-title">The celebration begins in</h2>
          <Countdown to={wedding.start} />
        </section>

        {/* ============ PROGRAMME ============ */}
        <section id="events" className="panel rise" aria-labelledby="h-prog">
          <p className="label">{wedding.weekday}, {wedding.dateLong}</p>
          <h2 id="h-prog" className="panel-title">Programme</h2>
          <ol className="timeline">
            {wedding.events.map((ev) => (
              <li key={ev.title}>
                <span className="tl-time">{ev.time}</span>
                <span className="tl-mark"><Icon name={ev.icon as IconName} size={16} stroke={1.6} /></span>
                <span className="tl-text">
                  <strong>{ev.title}</strong>
                  <span lang="si">{ev.note}</span>
                </span>
              </li>
            ))}
          </ol>
        </section>

        {/* ============ VENUE ============ */}
        <section id="venue" className="panel rise" aria-labelledby="h-venue">
          <p className="label">Venue</p>
          <h2 id="h-venue" className="panel-title">{wedding.venue.name}</h2>
          <p className="panel-sub">{wedding.venue.area} · <span lang="si">{wedding.venue.areaSi}</span></p>
          <p className="panel-text">{wedding.weekday}, {wedding.dateLong}{wedding.timeLabel && ` · from ${wedding.timeLabel}`}</p>
          <div className="map">
            <iframe src={mapsEmbed} title={`Map of ${wedding.venue.name}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
          </div>
          <div className="actions">
            <a href={mapsLink} target="_blank" rel="noopener noreferrer" className="btn">
              <Icon name="navigate" size={15} stroke={1.6} /> Get directions
            </a>
            <CalendarButton />
          </div>
        </section>

        {/* ============ RSVP ============ */}
        <section id="rsvp" className="panel rise" aria-labelledby="h-rsvp">
          <p className="label">RSVP</p>
          <h2 id="h-rsvp" className="panel-title">Kindly reply</h2>
          <p className="panel-text">
            {wedding.rsvpBy ? `Please let us know by ${wedding.rsvpBy} if you can join us.` : "Please let us know if you can join us."}
          </p>
          <RsvpForm defaultName={guest} />
        </section>

        {/* ============ THANK YOU ============ */}
        <section id="footer" className="farewell rise" aria-labelledby="h-thanks">
          <h2 id="h-thanks" className="farewell-script">Thank you</h2>
          <p className="farewell-text">We look forward to celebrating with you by the lake.</p>
          <Sprig />
          <p className="farewell-names">With love, {coupleNames}</p>
          {wedding.contacts.length > 0 && (
            <div className="contacts">
              {wedding.contacts.map((c) => (
                <a key={c.href} href={c.href} {...(c.whatsapp ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                  <Icon name={c.whatsapp ? "whatsapp" : "phone"} size={15} stroke={1.6} /> {c.label}
                </a>
              ))}
            </div>
          )}
        </section>

        <footer className="credit">
          <p>Made with love for {coupleNames}</p>
          <p className="credit-promo">
            Want a beautiful wedding website like this? Create yours with{" "}
            <a href="https://wa.me/94707819074" target="_blank" rel="noreferrer">invitemint</a>
          </p>
        </footer>
      </main>

      {/* Background music: "Tumhi Dekho Naa" (Kabhi Alvida Naa Kehna) - Sonu Nigam & Alka Yagnik */}
      <audio ref={audio} src="/assets/tumhi-dekho-naa.mp3" loop preload="auto" />
      {phase !== "closed" && (
        <button type="button" className="music-btn" onClick={toggleMusic}
          aria-label={playing ? "Pause music" : "Play music"} aria-pressed={playing}>
          <Icon name="music" className="ic-on" />
          <Icon name="musicOff" className="ic-off" />
        </button>
      )}
    </>
  );
}
