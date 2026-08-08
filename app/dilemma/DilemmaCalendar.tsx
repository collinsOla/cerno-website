"use client";

import { useMemo, useRef, useState } from "react";

export type DilemmaResult = {
  a: number;
  b: number;
  total: number;
  a_pct: number;
  b_pct: number;
};

export type DilemmaDay = {
  date: string; // YYYY-MM-DD
  id: string;
  category_label: string;
  title: string;
  byline: string;
  scenario: string;
  question: string;
  option_a_text: string;
  option_b_text: string;
  result?: DilemmaResult;
};

const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** "2026-08-07" → "7 August 2026" (no Date object → no timezone drift). */
function longDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}
function ym(iso: string) {
  const [y, m] = iso.split("-").map(Number);
  return y * 12 + (m - 1);
}
function firstLetter(text: string) {
  // The A/B option text is long; show a short lead for the bar labels.
  return text.split(/[.—-]/)[0].trim();
}

export default function DilemmaCalendar({
  today,
  days,
}: {
  today: DilemmaDay;
  days: DilemmaDay[];
}) {
  const byDate = useMemo(
    () => new Map(days.map((d) => [d.date, d])),
    [days]
  );
  const todayYm = ym(today.date);
  const earliestYm = days.length ? ym(days[days.length - 1].date) : todayYm;

  const [view, setView] = useState(todayYm); // year*12+monthIndex
  const [selected, setSelected] = useState<string | null>(
    days.length ? days[0].date : null
  );
  const selRef = useRef<HTMLDivElement>(null);

  const year = Math.floor(view / 12);
  const monthIdx = view % 12;
  const firstWeekday = new Date(year, monthIdx, 1).getDay();
  const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const iso = (d: number) =>
    `${year}-${String(monthIdx + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  function openDay(date: string) {
    setSelected(date);
    // let React paint the new card, then bring it into view
    requestAnimationFrame(() =>
      selRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    );
  }

  const sel = selected ? byDate.get(selected) : undefined;

  return (
    <>
      <div className="dl-cal">
        <div className="dl-calnav">
          <button
            className="dl-cbtn"
            aria-label="Previous month"
            disabled={view <= earliestYm}
            onClick={() => setView((v) => Math.max(earliestYm, v - 1))}
          >
            ‹
          </button>
          <h3>
            {MONTHS[monthIdx]} {year}
          </h3>
          <button
            className="dl-cbtn"
            aria-label="Next month"
            disabled={view >= todayYm}
            onClick={() => setView((v) => Math.min(todayYm, v + 1))}
          >
            ›
          </button>
        </div>

        <div className="dl-dow">
          {DOW.map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>

        <div className="dl-grid">
          {cells.map((d, i) => {
            if (d === null) return <div className="dl-cell empty" key={`e${i}`} />;
            const date = iso(d);
            if (date === today.date) {
              return (
                <button
                  className="dl-cell today"
                  key={date}
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                  aria-label={`${longDate(date)} — live now`}
                >
                  <span className="dl-livebadge">LIVE</span>
                  <span className="dl-dnum">{d}</span>
                  <span className="dl-livetxt">Vote open</span>
                </button>
              );
            }
            const entry = byDate.get(date);
            if (entry?.result) {
              return (
                <button
                  className={`dl-cell has${selected === date ? " sel" : ""}`}
                  key={date}
                  onClick={() => openDay(date)}
                  aria-label={`${longDate(date)} — ${entry.title}`}
                >
                  <span className="dl-dnum">{d}</span>
                  <span className="dl-mini">
                    <span className="a" style={{ width: `${entry.result.a_pct}%` }} />
                    <span className="b" style={{ width: `${entry.result.b_pct}%` }} />
                  </span>
                </button>
              );
            }
            return (
              <div className="dl-cell" key={date}>
                <span className="dl-dnum">{d}</span>
              </div>
            );
          })}
        </div>

        <div className="dl-legend">
          <span>
            <i style={{ background: "var(--gold)" }} />
            Option A share
          </span>
          <span>
            <i style={{ background: "var(--glow)" }} />
            Option B share
          </span>
          <span>
            <i
              style={{
                background: "rgba(201,169,97,.16)",
                outline: "1px solid var(--gold)",
              }}
            />
            Today — live, no result yet
          </span>
        </div>
      </div>

      {sel && sel.result ? (
        <>
          <div className="dl-selhead" ref={selRef}>
            <span className="k">Selected day · {longDate(sel.date)}</span>
            <span className="s">Tap the card to read the full dilemma</span>
          </div>
          <a className="dl-rescard" href={`/dilemma/${sel.date}/`}>
            <div className="dl-restop">
              <span className="dl-rcat">{sel.category_label}</span>
              <span className="dl-rdate">{longDate(sel.date)}</span>
            </div>
            <h3>{sel.title}</h3>
            <p className="dl-rq">{sel.question}</p>
            <div className="dl-final">Final result</div>
            <div className="dl-bar">
              <span className="a" style={{ width: `${sel.result.a_pct}%` }} />
              <span className="b" style={{ width: `${sel.result.b_pct}%` }} />
            </div>
            <div className="dl-barlbl">
              <span className="la">
                {firstLetter(sel.option_a_text)} — <b>{sel.result.a_pct}%</b>
              </span>
              <span className="lb">
                <b>{sel.result.b_pct}%</b> — {firstLetter(sel.option_b_text)}
              </span>
            </div>
            <div className="dl-readmore">
              Read the full dilemma
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </div>
          </a>
        </>
      ) : null}
    </>
  );
}
