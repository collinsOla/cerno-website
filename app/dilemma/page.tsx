import type { Metadata } from "next";
import BrandMark from "../components/BrandMark";
import DilemmaCalendar, { type DilemmaDay } from "./DilemmaCalendar";
import today from "./data/today.json";
import archive from "./data/archive.json";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAYS = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
];
function longDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

// Releases land on Wednesdays and Sundays, so the live dilemma stays up for
// three or four days. The next release is simply the next Wed/Sun after the
// live one's date — derived from the data, so it can never disagree with what
// is on the page (UTC maths only; these are plain calendar dates).
const RELEASE_DOW = [0, 3]; // Sunday, Wednesday
function nextReleaseAfter(iso: string) {
  const d = new Date(`${iso}T00:00:00Z`);
  do {
    d.setUTCDate(d.getUTCDate() + 1);
  } while (!RELEASE_DOW.includes(d.getUTCDay()));
  return { iso: d.toISOString().slice(0, 10), weekday: DAYS[d.getUTCDay()] };
}

export const metadata: Metadata = {
  title: `The Cerno Dilemma · ${today.title}`,
  description: today.question,
};

export default function DilemmaPage() {
  const t = today as DilemmaDay;
  const days = (archive.days as DilemmaDay[]) ?? [];
  const paragraphs = t.scenario.split(/\n\n+/);
  const next = nextReleaseAfter(t.date);

  return (
    <div className="dl-page">
      <nav className="dl-nav">
        <a className="dl-brand" href="/" aria-label="Cerno home">
          <BrandMark />
          <span>CERNO</span>
        </a>
        <div className="dl-links">
          <a href="/#features">The App</a>
          <a className="here" href="/dilemma">The Dilemma</a>
          <a href="/waitlist">Waitlist</a>
        </div>
      </nav>

      <div className="dl-wrap">
        {/* ---- today's dilemma ---- */}
        <header className="dl-hero" id="top">
          <span className="dl-glow" />
          <div className="dl-cat">{t.category_label}</div>
          <h1 className="dl-title">{t.title}</h1>
          <div className="dl-byline">{t.byline}</div>
          <div className="dl-today">
            Live now · <b>{longDate(t.date)}</b>
          </div>
          <div className="dl-cadence">
            New dilemmas Wednesdays &amp; Sundays · next on {next.weekday}{" "}
            {longDate(next.iso)}
          </div>
        </header>

        <div className="dl-scenario">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div className="dl-qwrap">
          <div className="dl-qkick">The question</div>
          <div className="dl-question">{t.question}</div>
        </div>

        <div className="dl-options">
          <div className="dl-opt a">
            <div className="dl-badge">A</div>
            <div className="dl-otext">{t.option_a_text}</div>
          </div>
          <div className="dl-opt b">
            <div className="dl-badge">B</div>
            <div className="dl-otext">{t.option_b_text}</div>
          </div>
        </div>

        {/* ---- buttons ---- */}
        <div className="dl-ctas">
          {/* Download stays on the coming-soon placeholder for now */}
          <a className="dl-btn primary" href="/download">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2a1 1 0 0 1 1 1v10.6l3.3-3.3a1 1 0 1 1 1.4 1.4l-5 5a1 1 0 0 1-1.4 0l-5-5a1 1 0 1 1 1.4-1.4l3.3 3.3V3a1 1 0 0 1 1-1Zm-7 16a1 1 0 0 1 1 1v1h12v-1a1 1 0 1 1 2 0v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1Z" />
            </svg>
            Download the app to vote
          </a>
          <a
            className="dl-btn ghost"
            href="https://www.instagram.com/cernoapp"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Vote on our Instagram story"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
            </svg>
            Vote on our Instagram story
          </a>
        </div>
        <p className="dl-ctahint">Join the Cerno community and cast your vote in the app.</p>

        <div className="dl-div" />

        {/* ---- the bank of dilemmas ---- */}
        <section className="dl-bank">
          <div className="dl-bankkick">The Bank of Dilemmas</div>
          <h2>Explore past dilemmas</h2>
          <div className="dl-callout">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
            Click any past day to read that dilemma and see how the vote finally landed
          </div>

          <DilemmaCalendar today={t} days={days} />
        </section>

        <footer className="dl-footer">Cerno · Feed the mind, run the room</footer>
      </div>
    </div>
  );
}
