"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Icon, { type IconName } from "./Icon";
import Countdown from "./Countdown";
import CalendarButton from "./CalendarButton";
import RsvpForm from "./RsvpForm";
import Petals from "./Petals";
import { ArchPhoto, Crest, Divider, Toran } from "./Ornaments";
import { coupleNames, mapsEmbed, mapsLink, wedding } from "@/lib/wedding";

type Phase = "closed" | "opening" | "gone" | "removed";

const parents = wedding.parents.filter((p) => p.names.trim());
const [month, year] = [wedding.dateLong.split(" ")[1], wedding.dateParts[2]];

const gallery = [
  { src: "/pre/couple-1.jpg", alt: `${coupleNames} in wedding clothes in front of the Taj Mahal`, caption: "Two hearts" },
  { src: "/pre/couple-3.jpg", alt: `${coupleNames} looking at each other at sunset`, caption: "One story" },
  { src: "/pre/couple-2.jpg", alt: `${coupleNames} embracing under hanging lamps`, caption: "Forever" },
];

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
      <Petals />

      {/* ============ WELCOME SCREEN ============ */}
      {phase !== "removed" && (
        <div id="welcome" className={welcomeClass} role="dialog" aria-label="Open your invitation">
          <video className="welcome-video" src="/assets/intro-video.mp4" poster="/assets/intro-video-poster.jpg"
            autoPlay muted loop playsInline preload="auto" disablePictureInPicture aria-hidden="true" />
          <div className="welcome-frame" aria-hidden="true"><i /><i /><i /><i /></div>

          <div className="welcome-top">
            <p className="welcome-kicker w-in" style={{ ["--d" as string]: "0.3s" }}>
              <span aria-hidden="true" />A {wedding.eventName} Invitation<span aria-hidden="true" />
            </p>
            <p className="welcome-names w-in" style={{ ["--d" as string]: "0.7s" }}>
              {wedding.partner1}<span className="welcome-amp">&amp;</span>{wedding.partner2}
            </p>
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
          <Toran className="hero-toran" />
          <p className="kicker">The Homecoming Of</p>
          <ArchPhoto src="/pre/couple-2.jpg" alt={`${coupleNames}, illustrated in traditional Indian wedding clothes`} className="hero-arch" />
          <h1 className="hero-names">
            <span>{wedding.partner1}</span>
            <span className="hero-and" aria-hidden="true">&amp;</span>
            <span className="sr">and</span>
            <span>{wedding.partner2}</span>
          </h1>
          <p className="hero-line">are home as husband and wife, and the party is going full Bollywood!</p>
          <Divider />

          <div className="date-strip" aria-label={`${wedding.weekday}, ${wedding.dateLong} at ${wedding.timeLabel}`}>
            <span className="ds-month">{month}</span>
            <div className="ds-row">
              <span className="ds-side">{wedding.weekday}</span>
              <strong className="ds-day">{wedding.dateParts[0]}</strong>
              <span className="ds-side">{wedding.timeLabel}</span>
            </div>
            <span className="ds-year">{year}</span>
          </div>
          <p className="hero-where"><Icon name="pin" size={15} stroke={1.6} /> {wedding.venue.name}, {wedding.venue.area}</p>

          <a href="#card" className="hero-more">
            Scroll down <Icon name="chevron" size={16} stroke={1.6} />
          </a>
        </header>

        {/* ============ INVITATION CARD ============ */}
        <section id="card" className="invite-card rise" aria-label="Invitation">
          {parents.map((p) => (
            <div key={p.names} className="ic-parents">
              <span className="ic-small">{p.label}</span>
              <strong>{p.names}</strong>
            </div>
          ))}
          <p className="ic-text">
            request the pleasure of {guest ? <>the company of</> : <>your company</>}
          </p>
          {guest && <p className="ic-guest">{guest}</p>}
          <p className="ic-text">at the homecoming celebration of</p>
          <p className="ic-names">{wedding.partner1} <span>&amp;</span> {wedding.partner2}</p>
          <Divider />
          <p className="ic-when">{wedding.weekday} · {wedding.dateLong} · {wedding.timeLabel}</p>
          <p className="ic-where">{wedding.venue.name}<br />{wedding.venue.address}</p>
        </section>

        {/* ============ CINEMA MARQUEE + COUNTDOWN ============ */}
        <section id="countdown" className="marquee rise" aria-labelledby="h-count">
          <div className="marquee-inner">
            <h2 id="h-count" className="mq-title">
              {wedding.partner1} <span>&amp;</span> {wedding.partner2}
            </h2>
            <p className="mq-tag">A love story in full colour</p>
            <p className="mq-cast"><span>Starring</span>{wedding.partner1} as the Groom · {wedding.partner2} as the Bride</p>
            <p className="mq-premiere">Grand premiere in</p>
            <Countdown to={wedding.start} />
            <p className="mq-date">{wedding.dateShort.replace(/ /g, "")} · {wedding.timeLabel} · {wedding.venue.name}</p>
          </div>
        </section>

        {/* ============ GALLERY: FILM STRIP ============ */}
        <section id="story" className="story rise" aria-labelledby="h-story">
          <p className="kicker">Picture perfect</p>
          <h2 id="h-story" className="section-title gold-text">Our Story</h2>
          <div className="film" tabIndex={0} aria-label="Photos of the couple, scroll sideways for more">
            {gallery.map((g) => (
              <figure key={g.src} className="film-frame">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={g.src} alt={g.alt} loading="lazy" />
                <figcaption>{g.caption}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* ============ PROGRAMME ============ */}
        <section id="events" className="panel panel-green rise" aria-labelledby="h-prog">
          <Crest />
          <p className="kicker">{wedding.weekday}, {wedding.dateLong}</p>
          <h2 id="h-prog" className="section-title gold-text">The Evening</h2>
          <ol className="timeline">
            {wedding.events.map((ev) => (
              <li key={ev.title}>
                <span className="tl-mark"><Icon name={ev.icon as IconName} size={17} stroke={1.6} /></span>
                <span className="tl-text">
                  {ev.time && <span className="tl-time">{ev.time}</span>}
                  <strong>{ev.title}</strong>
                  <span className="tl-note">{ev.note}</span>
                </span>
              </li>
            ))}
          </ol>
        </section>

        {/* ============ DRESS CODE ============ */}
        {wedding.dressCode.colors.length > 0 && (
          <section id="dress" className="panel panel-maroon rise" aria-labelledby="h-dress">
            <Crest />
            <p className="kicker">Theme &amp; dress code</p>
            <h2 id="h-dress" className="section-title gold-text">{wedding.dressCode.title}</h2>
            {wedding.dressCode.note && <p className="panel-text">{wedding.dressCode.note}</p>}
            <ul className="swatches">
              {wedding.dressCode.colors.map((c) => (
                <li key={c.name}>
                  <span className="swatch" style={{ background: c.hex }} />
                  <span>{c.name}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ============ VENUE ============ */}
        <section id="venue" className="panel panel-green rise" aria-labelledby="h-venue">
          <Crest />
          <p className="kicker">The venue</p>
          <h2 id="h-venue" className="section-title gold-text">{wedding.venue.name}</h2>
          <p className="panel-text">{wedding.venue.address}</p>
          <p className="panel-sub">{wedding.weekday}, {wedding.dateLong}{wedding.timeLabel && ` · from ${wedding.timeLabel}`}</p>
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
        <section id="rsvp" className="panel panel-maroon rise" aria-labelledby="h-rsvp">
          <Crest />
          <p className="kicker">Admit one · RSVP</p>
          <h2 id="h-rsvp" className="section-title gold-text">Book Your Seat</h2>
          <p className="panel-text">
            {wedding.rsvpBy ? `Please let us know by ${wedding.rsvpBy} if you can join us.` : "Please let us know if you can join us."}
          </p>
          <RsvpForm defaultName={guest} />
        </section>

        {/* ============ THANK YOU ============ */}
        <section id="footer" className="farewell rise" aria-labelledby="h-thanks">
          <ArchPhoto src="/pre/couple-3.jpg" alt={`${coupleNames} at sunset`} className="farewell-arch" />
          <h2 id="h-thanks" className="farewell-script">Thank you</h2>
          <p className="farewell-text">Come dressed in your brightest colours and bring your best dance moves. We can&apos;t wait to celebrate with you!</p>
          <Divider />
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
