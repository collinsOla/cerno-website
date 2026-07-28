import type { Metadata } from "next";
import "./globals.css";
import CookieConsent from "./components/CookieConsent";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://cerno.group"
  ),
  title: "Cerno · Feed the mind, run the room",
  description:
    "Cerno turns a few quiet minutes a day into real intellectual progress: reading, reasoning, vocabulary, and the habits behind a sharper mind. Launching September 2026.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "Cerno · Feed the mind, run the room",
    description:
      "A daily practice for reading, reasoning, and vocabulary, across twelve defined levels from Rousseau to Borges. Launching September 2026.",
    type: "website",
    images: [
      { url: "/og.png", width: 1200, height: 630, alt: "Cerno · Feed the mind, run the room" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cerno · Feed the mind, run the room",
    description:
      "A daily practice for reading, reasoning, and vocabulary. Launching September 2026.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          href="/fonts/inter-variable.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/fraunces-variable.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/cormorant-600.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
