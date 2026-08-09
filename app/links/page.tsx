import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cerno · Links",
  description: "Everything Cerno in one place — the daily dilemma, the app, and our socials.",
  robots: { index: false, follow: true },
};

function ArrowIcon() {
  return (
    <svg className="lt-ext" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

type LtLink = {
  label: string;
  href: string;
  external: boolean;
};

// Add more links here as they come — order top-to-bottom.
const links: LtLink[] = [
  { label: "Today's Dilemma", href: "/dilemma", external: false },
  { label: "Join the waitlist", href: "/waitlist", external: false },
  { label: "Instagram", href: "https://www.instagram.com/cernoapp", external: true },
  // TODO: replace "#" with the Cerno TikTok link
  { label: "TikTok", href: "#", external: true },
];

export default function LinksPage() {
  return (
    <div className="lt-page">
      <div className="lt-inner">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="lt-logo" src="/cerno-wordmark.png" alt="Cerno" />
        <p className="lt-handle">@cernoapp</p>
        <p className="lt-tag">Feed the mind, run the room.</p>

        <div className="lt-links">
          {links.map((l) => (
            <a
              key={l.label}
              className="lt-link"
              href={l.href}
              {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              <span className="lt-lbl">{l.label}</span>
              {l.external ? <ArrowIcon /> : null}
            </a>
          ))}
        </div>

        <div className="lt-foot">
          <a href="/">cerno.group</a>
        </div>
      </div>
    </div>
  );
}
