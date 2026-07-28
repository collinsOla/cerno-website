import type { Metadata } from "next";
import LegalArticle from "../legal/LegalArticle";
import { renderPolicy } from "../legal/legal";

export const metadata: Metadata = {
  title: "Terms of Service · Cerno",
  description: "The agreement between you and Cerno for using the service.",
};

export default async function Page() {
  const html = await renderPolicy("terms");
  return <LegalArticle slug="terms" html={html} />;
}
