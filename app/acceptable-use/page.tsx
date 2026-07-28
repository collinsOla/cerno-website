import type { Metadata } from "next";
import LegalArticle from "../legal/LegalArticle";
import { renderPolicy } from "../legal/legal";

export const metadata: Metadata = {
  title: "Acceptable Use Policy · Cerno",
  description: "The rules for how the Cerno service may and may not be used.",
};

export default async function Page() {
  const html = await renderPolicy("acceptable-use");
  return <LegalArticle slug="acceptable-use" html={html} />;
}
