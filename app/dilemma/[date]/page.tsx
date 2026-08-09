import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BrandMark from "../../components/BrandMark";
import type { DilemmaDay } from "../DilemmaCalendar";
import today from "../data/today.json";
import archive from "../data/archive.json";

// Every archived (past) day plus today, keyed by date. Archive entries win so
// finalised results take precedence; today's permalink keeps the route
// buildable even before the first result is frozen.
const byDate = new Map<string, DilemmaDay>();
byDate.set((today as DilemmaDay).date, today as DilemmaDay);
for (const d of archive.days as DilemmaDay[]) byDate.set(d.date, d);
const days = [...byDate.values()];

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
function longDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}
function lead(text: string) {
  return text.split(/[.—-]/)[0].trim();
}

// Static export: one page per archived date, and only those.
export const dynamicParams = false;
export function generateStaticParams() {
  return days.map((d) => ({ date: d.date }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ date: string }>;
}): Promise<Metadata> {
  const { date } = await params;
  const day = byDate.get(date);
  if (!day) return { title: "The Cerno Dilemma" };
  return {
    title: `${day.title} · The Cerno Dilemma`,
    description: day.question,
  };
}

export default async function DilemmaDatePage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;
  const day = byDate.get(date);
  if (!day) notFound();

  const paragraphs = day.scenario.split(/\n\n+/);
  const r = day.result;

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
        <header className="dl-hero">
          <span className="dl-glow" />
          <div className="dl-cat">{day.category_label}</div>
          <h1 className="dl-title">{day.title}</h1>
          <div className="dl-byline">{day.byline}</div>
          <div className="dl-today">
            <b>{longDate(day.date)}</b>
          </div>
        </header>

        <div className="dl-scenario">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div className="dl-qwrap">
          <div className="dl-qkick">The question</div>
          <div className="dl-question">{day.question}</div>
        </div>

        <div className="dl-options">
          <div className="dl-opt a">
            <div className="dl-badge">A</div>
            <div className="dl-otext">{day.option_a_text}</div>
          </div>
          <div className="dl-opt b">
            <div className="dl-badge">B</div>
            <div className="dl-otext">{day.option_b_text}</div>
          </div>
        </div>

        {r ? (
          <div className="dl-fullresult">
            <div className="dl-final">
              Final result <span className="dl-final-note">(Cerno App Users)</span>
            </div>
            <div className="dl-bar">
              <span className="a" style={{ width: `${r.a_pct}%` }} />
              <span className="b" style={{ width: `${r.b_pct}%` }} />
            </div>
            <div className="dl-barlbl">
              <span className="la">
                {lead(day.option_a_text)} — <b>{r.a_pct}%</b>
              </span>
              <span className="lb">
                <b>{r.b_pct}%</b> — {lead(day.option_b_text)}
              </span>
            </div>
          </div>
        ) : (
          <p className="dl-ctahint" style={{ marginTop: "34px" }}>
            Voting is open today — the result appears here once the next dilemma
            goes live.
          </p>
        )}

        <div style={{ textAlign: "center" }}>
          <a className="dl-back" href="/dilemma">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M11 18l-6-6 6-6" />
            </svg>
            Back to today&rsquo;s dilemma &amp; the calendar
          </a>
        </div>

        <footer className="dl-footer">Cerno · Feed the mind, run the room</footer>
      </div>
    </div>
  );
}
