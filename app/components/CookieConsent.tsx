"use client";

import { useEffect, useState } from "react";

/* --------------------------------------------------------------------------
   Cookie consent.

   The site currently sets only strictly-necessary cookies, so this banner is
   the consent framework for any *non-essential* cookies added later (e.g.
   privacy-friendly analytics). Nothing non-essential should load until the
   stored choice allows it — future scripts must read `getConsent()` or listen
   for the `cerno:consent` event before running.

   Compliance notes: "Reject all" is given equal prominence to "Accept all",
   nothing non-essential fires before a choice is made, the choice persists,
   and it can be reopened from the footer ("Cookie settings").
-------------------------------------------------------------------------- */

const STORAGE_KEY = "cerno_cookie_consent";
const CONSENT_VERSION = 1;
const MAX_AGE_DAYS = 182; // re-ask after ~6 months

type Consent = {
  v: number;
  ts: number;
  functional: boolean;
  analytics: boolean;
};

function readConsent(): Consent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const c = JSON.parse(raw) as Consent;
    if (c.v !== CONSENT_VERSION) return null;
    const ageDays = (Date.now() - c.ts) / 86_400_000;
    if (ageDays > MAX_AGE_DAYS) return null;
    return c;
  } catch {
    return null;
  }
}

/** Read the current consent (for future analytics gating). */
export function getConsent(): Consent | null {
  if (typeof window === "undefined") return null;
  return readConsent();
}

export default function CookieConsent() {
  const [open, setOpen] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [functional, setFunctional] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  // Decide whether to show on load; wire up the footer "Cookie settings" link.
  useEffect(() => {
    const existing = readConsent();
    if (!existing) {
      setOpen(true);
    } else {
      setFunctional(existing.functional);
      setAnalytics(existing.analytics);
    }

    const onReopen = (e: Event) => {
      const target = (e.target as HTMLElement | null)?.closest(
        "[data-cookie-settings]"
      );
      if (!target) return;
      e.preventDefault();
      const current = readConsent();
      setFunctional(current?.functional ?? false);
      setAnalytics(current?.analytics ?? false);
      setShowPrefs(true);
      setOpen(true);
    };
    document.addEventListener("click", onReopen);
    return () => document.removeEventListener("click", onReopen);
  }, []);

  const save = (choice: { functional: boolean; analytics: boolean }) => {
    const consent: Consent = {
      v: CONSENT_VERSION,
      ts: Date.now(),
      functional: choice.functional,
      analytics: choice.analytics,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    } catch {
      /* storage blocked — treat as reject for this session */
    }
    window.dispatchEvent(new CustomEvent("cerno:consent", { detail: consent }));
    setOpen(false);
    setShowPrefs(false);
  };

  if (!open) return null;

  return (
    <div
      className="cookie-banner"
      role="dialog"
      aria-label="Cookie consent"
      aria-live="polite"
    >
      <div className="cookie-inner">
        <div className="cookie-text">
          <p className="cookie-title">A note on cookies</p>
          <p>
            We use strictly necessary cookies to make Cerno work. With your
            consent, we may also use privacy-friendly analytics to improve the
            site. We never use advertising cookies. See our{" "}
            <a href="/cookies">Cookie Policy</a>.
          </p>

          {showPrefs && (
            <div className="cookie-prefs">
              <label className="cookie-row cookie-row-locked">
                <span>
                  <strong>Strictly necessary</strong>
                  <em>Required for the site to work. Always on.</em>
                </span>
                <input type="checkbox" checked disabled aria-label="Strictly necessary (always on)" />
              </label>
              <label className="cookie-row">
                <span>
                  <strong>Functional</strong>
                  <em>Remembers preferences like your settings.</em>
                </span>
                <input
                  type="checkbox"
                  checked={functional}
                  onChange={(e) => setFunctional(e.target.checked)}
                />
              </label>
              <label className="cookie-row">
                <span>
                  <strong>Analytics</strong>
                  <em>Privacy-friendly, aggregate usage measurement.</em>
                </span>
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                />
              </label>
            </div>
          )}
        </div>

        <div className="cookie-actions">
          <button
            type="button"
            className="cookie-btn cookie-reject"
            onClick={() => save({ functional: false, analytics: false })}
          >
            Reject all
          </button>
          {showPrefs ? (
            <button
              type="button"
              className="cookie-btn cookie-save"
              onClick={() => save({ functional, analytics })}
            >
              Save choices
            </button>
          ) : (
            <button
              type="button"
              className="cookie-btn cookie-accept"
              onClick={() => save({ functional: true, analytics: true })}
            >
              Accept all
            </button>
          )}
        </div>

        {!showPrefs && (
          <button
            type="button"
            className="cookie-customise"
            onClick={() => setShowPrefs(true)}
          >
            Customise
          </button>
        )}
      </div>
    </div>
  );
}
