import type { Metadata } from "next";
import LegalArticle from "../legal/LegalArticle";
import { renderPolicy } from "../legal/legal";

export const metadata: Metadata = {
  title: "Privacy Policy · Cerno",
  description: "How Cerno collects, uses, and protects your personal information.",
};

export default async function Page() {
  const html = await renderPolicy("privacy");
  return <LegalArticle slug="privacy" html={html} />;
}
