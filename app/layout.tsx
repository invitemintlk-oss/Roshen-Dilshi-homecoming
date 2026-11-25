import type { Metadata, Viewport } from "next";
import { Alex_Brush, EB_Garamond, Marcellus, Noto_Serif_Sinhala } from "next/font/google";
import { coupleNames, ogImage, wedding } from "@/lib/wedding";
import "./globals.css";

const body = EB_Garamond({ subsets: ["latin"], weight: ["400", "500", "600"], style: ["normal", "italic"], variable: "--font-body" });
const head = Marcellus({ subsets: ["latin"], weight: "400", variable: "--font-head" });
const sinhala = Noto_Serif_Sinhala({ subsets: ["sinhala"], weight: ["400", "500", "600"], variable: "--font-si" });
const script = Alex_Brush({ subsets: ["latin"], weight: "400", variable: "--font-script" });

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
  themeColor: "#D6E9F0",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="si" className={`${body.variable} ${head.variable} ${script.variable} ${sinhala.variable}`}>
      <body>{children}</body>
    </html>
  );
}
