import type { Metadata } from "next";
import ComingSoon from "../components/ComingSoon";

export const metadata: Metadata = {
  title: "Download Cerno · Launching September 2026",
  description: "The Cerno app is launching September 2026. Join the waitlist.",
};

export default function DownloadPage() {
  return (
    <ComingSoon eyebrow="THE CERNO APP" title="Launching September 2026">
      <p className="cs-sub">
        The app is on its way. Add your name to the waitlist and we will let you
        know the moment it lands.
      </p>
      <a className="cs-cta" href="/waitlist">
        Join the waitlist
        <svg
          className="ui-arrow"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M3 8h10M8.5 3.5 13 8l-4.5 4.5" />
        </svg>
      </a>
      <a className="cs-back" href="/">
        Back to cerno
      </a>
    </ComingSoon>
  );
}
