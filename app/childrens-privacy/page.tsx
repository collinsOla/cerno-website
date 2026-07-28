import type { Metadata } from "next";
import LegalArticle from "../legal/LegalArticle";
import { renderPolicy } from "../legal/legal";

export const metadata: Metadata = {
  title: "Privacy for under-18s · Cerno",
  description: "A short, plain-language privacy notice for users aged 13 to 17.",
};

export default async function Page() {
  const html = await renderPolicy("childrens-privacy");
  return <LegalArticle slug="childrens-privacy" html={html} />;
}
