import type { Metadata } from "next";
import LegalArticle from "../legal/LegalArticle";
import { renderPolicy } from "../legal/legal";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy · Cerno",
  description: "How subscriptions, cancellation, and refunds work at Cerno.",
};

export default async function Page() {
  const html = await renderPolicy("refunds");
  return <LegalArticle slug="refunds" html={html} />;
}
