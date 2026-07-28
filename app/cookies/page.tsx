import type { Metadata } from "next";
import LegalArticle from "../legal/LegalArticle";
import { renderPolicy } from "../legal/legal";

export const metadata: Metadata = {
  title: "Cookie Policy · Cerno",
  description: "How Cerno uses cookies and similar technologies.",
};

export default async function Page() {
  const html = await renderPolicy("cookies");
  return <LegalArticle slug="cookies" html={html} />;
}
