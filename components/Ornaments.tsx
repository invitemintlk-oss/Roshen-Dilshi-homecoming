import { useId } from "react";

// Hand-drawn Indian ornaments used across the invitation.

/** Marigold toran: swags of orange and yellow flowers with hanging drops and mango leaves. */
export function Toran({ className = "" }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  const swag = "M0 8 Q36 40 72 8";
  return (
    <svg className={`toran ${className}`} width="100%" height="78" aria-hidden="true">
      <defs>
        <pattern id={`t${id}`} width="72" height="78" patternUnits="userSpaceOnUse">
          <path d="M0 2h72" stroke="#C9A04E" strokeWidth="2" />
          {/* mango leaves at each tie point (half on either edge, they join when the pattern repeats) */}
          <path d="M0 4C-8 14-6 26 0 34C6 26 8 14 0 4Z" fill="#1F5A33" />
          <path d="M72 4C64 14 66 26 72 34C78 26 80 14 72 4Z" fill="#1F5A33" />
          <path d="M0 6V32M72 6V32" stroke="#4E8A4F" strokeWidth="0.8" />
          {/* flower swag */}
          <path d={swag} fill="none" stroke="#D9661A" strokeWidth="9" strokeLinecap="round" strokeDasharray="0 8" />
          <path d={swag} fill="none" stroke="#F5B731" strokeWidth="6" strokeLinecap="round" strokeDasharray="0 8" strokeDashoffset="4" />
          {/* hanging drop */}
          <path d="M36 25V52" stroke="#C9A04E" strokeWidth="1" />
          <circle cx="36" cy="34" r="4.5" fill="#F5B731" />
          <circle cx="36" cy="43" r="4.5" fill="#D9661A" />
          <circle cx="36" cy="52" r="3.2" fill="#9E1B2E" />
          <path d="M33.5 55h5l-1 13h-3z" fill="#C9A04E" />
        </pattern>
      </defs>
      <rect width="100%" height="78" fill={`url(#t${id})`} />
    </svg>
  );
}

/** Lotus flower, used in dividers and panel crests. */
export function Lotus({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.8} viewBox="0 0 40 32" aria-hidden="true" className="lotus">
      <path d="M20 2C26 9 26 20 20 30C14 20 14 9 20 2Z" fill="currentColor" />
      <path d="M20 30C12 28 5 21 3 12C11 13 17 20 20 30Z" fill="currentColor" opacity="0.85" />
      <path d="M20 30C28 28 35 21 37 12C29 13 23 20 20 30Z" fill="currentColor" opacity="0.85" />
      <path d="M20 30C14 31 6 30 0 25C7 23 15 26 20 30ZM20 30C26 31 34 30 40 25C33 23 25 26 20 30Z" fill="currentColor" opacity="0.6" />
    </svg>
  );
}

/** Gold line divider with a lotus in the middle. */
export function Divider() {
  return (
    <div className="divider" aria-hidden="true">
      <span /><i /><Lotus size={30} /><i /><span />
    </div>
  );
}

/** Gold lotus medallion that sits on top of each panel. */
export function Crest() {
  return <span className="crest" aria-hidden="true"><Lotus size={24} /></span>;
}

/** Photo inside a Mughal (onion) arch with a double gold outline. */
const ARCH = "M0 133V50C0 32 14 24 30 18C40 14 47 8 50 0C53 8 60 14 70 18C86 24 100 32 100 50V133Z";

export function ArchPhoto({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return (
    <div className={`arch ${className}`}>
      <svg className="arch-line" viewBox="0 0 100 133" preserveAspectRatio="none" aria-hidden="true">
        <path d={ARCH} vectorEffect="non-scaling-stroke" />
      </svg>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="arch-img" />
    </div>
  );
}
