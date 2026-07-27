import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://cerno.group"
  ),
  title: "Cerno | Learning, illuminated",
  description:
    "Cerno is a learning companion for reading, vocabulary, comprehension, literacy, and cognitive development.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "Cerno | Learning, illuminated",
    description:
      "A learning companion for reading, language, comprehension, and clearer thinking.",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Cerno — Learning, illuminated" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cerno | Learning, illuminated",
    description:
      "A learning companion for reading, language, comprehension, and clearer thinking.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
