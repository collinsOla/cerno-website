/**
 * refresh-dilemmas.mjs
 * -------------------------------------------------------------------------
 * Pulls the Cerno Dilemma content + finalised vote results from the *app's*
 * Supabase project and writes two static JSON files the website builds from:
 *
 *   app/dilemma/data/today.json    – the dilemma live RIGHT NOW (no vote %)
 *   app/dilemma/data/archive.json  – every SUPERSEDED release, final vote %
 *
 * Dilemmas are released on Wednesdays and Sundays (daily until 2026-08-16), so
 * the live one stays live for several days; the script still runs daily and is
 * a no-op on the days between. Run from GitHub Actions (see
 * .github/workflows/refresh-dilemmas.yml), then commit the changed files — the
 * commit triggers the Pages deploy.
 *
 * TIMEZONE: "today" is computed in Europe/London (BST in summer, GMT in
 * winter), NOT the runner's UTC clock — the same UK-time rule the mobile app
 * uses (ukToday). A fixed UTC cron drifts against London midnight across the
 * DST switch, so the workflow fires at both 23:05 and 00:05 UTC and this
 * script is idempotent + write-once, so extra runs are harmless.
 *
 * WRITE-ONCE: once a release's result is in archive.json it is never
 * overwritten, and nothing is archived until the NEXT dilemma is live. That
 * freezes each result exactly as it stood when the next dilemma went out,
 * regardless of any later voting on a recycled dilemma.
 * -------------------------------------------------------------------------
 */
import { writeFileSync, readFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = resolve(__dirname, "../app/dilemma/data");
const TODAY_FILE = resolve(DATA_DIR, "today.json");
const ARCHIVE_FILE = resolve(DATA_DIR, "archive.json");

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// --- Weekly→daily transition (2026-08) ---------------------------------
// The last WEEKLY dilemma ("The Wrong Man's Freedom") is dated 2026-08-02 in
// the DB (its week ran Sun 2 Aug → Sat 8 Aug). We pin it to Sat 8 Aug on the
// site; the daily series flows from its own dates (Sun 9 Aug onward). The
// archive begins on 8 Aug so the weekly dilemma is not duplicated across its
// week.
const SITE_DATE_OVERRIDES = {
  "92a1a2bf-51c4-44cf-b392-be96c9e422cb": "2026-08-08",
};
const ARCHIVE_START = "2026-08-08";

const DISPLAY_COLS =
  "id,category_label,title,byline,scenario,question,option_a_text,option_b_text,scheduled_for_week_start,created_at";

function londonToday() {
  // en-CA gives ISO-style YYYY-MM-DD; timeZone does the BST/GMT maths for us.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/London",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

async function sb(path) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
    },
  });
  if (!res.ok) {
    throw new Error(`Supabase ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

function siteDate(d) {
  return SITE_DATE_OVERRIDES[d.id] ?? d.scheduled_for_week_start;
}

function pct(a, b) {
  const total = a + b;
  const aPct = total ? Math.round((a / total) * 100) : 0;
  const bPct = total ? 100 - aPct : 0;
  return { a, b, total, a_pct: aPct, b_pct: bPct };
}

function publicFields(d, date) {
  return {
    date,
    id: d.id,
    category_label: d.category_label,
    title: d.title,
    byline: d.byline ?? "by Cerno",
    scenario: d.scenario,
    question: d.question,
    option_a_text: d.option_a_text,
    option_b_text: d.option_b_text,
  };
}

async function main() {
  if (!SUPABASE_URL || !SERVICE_KEY) {
    throw new Error(
      "Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY environment variables."
    );
  }
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });

  // LONDON_DATE_OVERRIDE is a test-only hook to preview a future day's state.
  const today = process.env.LONDON_DATE_OVERRIDE || londonToday();
  console.log(`London date: ${today}`);

  // Every approved dilemma, with a resolved site date, oldest→newest.
  const rows = await sb(`cerno_dilemmas?approved=eq.true&select=${DISPLAY_COLS}`);
  const dilemmas = rows
    .map((d) => ({ ...d, _siteDate: siteDate(d) }))
    .filter((d) => d._siteDate)
    .sort((x, y) =>
      x._siteDate === y._siteDate
        ? String(x.created_at).localeCompare(String(y.created_at))
        : x._siteDate.localeCompare(y._siteDate)
    );

  // --- today.json : newest dilemma whose site date is on/before today ----
  const activeToday = [...dilemmas]
    .reverse()
    .find((d) => d._siteDate <= today);
  if (!activeToday) throw new Error("No active dilemma found for today.");
  writeFileSync(
    TODAY_FILE,
    JSON.stringify(publicFields(activeToday, activeToday._siteDate), null, 2) + "\n"
  );
  console.log(`today.json  → ${activeToday._siteDate}  "${activeToday.title}"`);

  // --- archive.json : every past day, final result, WRITE-ONCE -----------
  const archive = existsSync(ARCHIVE_FILE)
    ? JSON.parse(readFileSync(ARCHIVE_FILE, "utf8"))
    : { days: [] };
  const byDate = new Map(archive.days.map((d) => [d.date, d]));

  for (const d of dilemmas) {
    const date = d._siteDate;
    if (date < ARCHIVE_START) continue; // ignore the pre-daily weekly history
    // A dilemma is final only once the NEXT one has gone out. Releases are
    // Wednesdays and Sundays, so the live dilemma's own date is days behind
    // "today" for most of its run — freezing on `date < today` would snapshot a
    // half-finished vote and, being write-once, keep it forever.
    if (date >= activeToday._siteDate) continue; // still live (or future)
    if (byDate.has(date)) continue; // already frozen — never overwrite

    const agg = await sb(
      `dilemma_vote_aggregates?dilemma_id=eq.${d.id}&select=option_a_count,option_b_count`
    );
    const a = agg[0]?.option_a_count ?? 0;
    const b = agg[0]?.option_b_count ?? 0;
    const entry = { ...publicFields(d, date), result: pct(a, b) };
    byDate.set(date, entry);
    console.log(`archive     + ${date}  "${d.title}"  ${a}/${b}`);
  }

  const days = [...byDate.values()].sort((x, y) => y.date.localeCompare(x.date));
  writeFileSync(
    ARCHIVE_FILE,
    JSON.stringify({ days }, null, 2) + "\n"
  );
  console.log(`archive.json → ${days.length} day(s)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
