import type { Metadata } from "next";
import ComingSoon from "../components/ComingSoon";

export const metadata: Metadata = {
  title: "The Cerno Dilemma · Coming soon",
  description: "A sample Cerno Dilemma is coming soon.",
};

export default function DilemmaExamplePage() {
  return (
    <ComingSoon eyebrow="THE CERNO DILEMMA" title="Coming soon">
      <p className="cs-sub">
        A dilemma to sit with is on its way.
      </p>
      <a className="cs-back" href="/#dilemma">
        Back to cerno
      </a>
    </ComingSoon>
  );
}
