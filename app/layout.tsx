import type { Metadata, Viewport } from "next";
import { Alex_Brush, Cinzel, EB_Garamond, Great_Vibes, Marcellus } from "next/font/google";
import { coupleNames, ogImage, wedding } from "@/lib/wedding";
import "./globals.css";

// Intro screen fonts
const body = EB_Garamond({ subsets: ["latin"], weight: ["400", "500", "600"], style: ["normal", "italic"], variable: "--font-body" });
const head = Marcellus({ subsets: ["latin"], weight: "400", variable: "--font-head" });
const script = Alex_Brush({ subsets: ["latin"], weight: "400", variable: "--font-script" });
// Invitation fonts: royal capitals and a flowing script
const royal = Cinzel({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--font-royal" });
const vibes = Great_Vibes({ subsets: ["latin"], weight: "400", variable: "--font-vibes" });

export const metadata: Metadata = {
  ...(wedding.baseUrl ? { metadataBase: new URL(wedding.baseUrl) } : {}),
  title: coupleNames,
  description: `${coupleNames} · ${wedding.eventName} · ${wedding.dateLong}`,
  openGraph: {
    title: `${coupleNames} · ${wedding.eventName}`,
    description: `${wedding.dateLong} · ${wedding.venue.name}, ${wedding.venue.area}`,
    type: "website",
    images: [ogImage],
  },
  twitter: { card: "summary_large_image", images: [ogImage.url] },
};

export const viewport: Viewport = {
  themeColor: "#4A0E17",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${body.variable} ${head.variable} ${script.variable} ${royal.variable} ${vibes.variable}`}>
      <body>{children}</body>
    </html>
  );
}
