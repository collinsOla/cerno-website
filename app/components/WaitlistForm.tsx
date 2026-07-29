"use client";

import { useState } from "react";

/* The Supabase Edge Function connector that adds the email to Brevo.
   The URL and publishable key are both public by design (the key only works
   with RLS/edge policies); the Brevo secret lives only in the function. */
const WAITLIST_ENDPOINT =
  "https://mfuhglobqsnqfymjpfad.supabase.co/functions/v1/clever-api";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_QbSaXdPZxFV4OQJnzFT9ng_Jtg4qL-F";

const REGIONS = [
  "United Kingdom",
  "Rest of Europe",
  "North America",
  "South America",
  "Asia",
  "Africa",
  "Australia & Oceania",
  "Elsewhere",
];

type Status = "idle" | "loading" | "success" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function WaitlistForm() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [region, setRegion] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const clearError = () => {
    if (status === "error") setStatus("idle");
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName.trim()) {
      setStatus("error");
      setMessage("Please enter your first name.");
      return;
    }
    if (!EMAIL_RE.test(email)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }
    if (!region) {
      setStatus("error");
      setMessage("Please let us know where you&rsquo;re based.");
      return;
    }
    if (!consent) {
      setStatus("error");
      setMessage("Please tick the box to confirm you’d like updates.");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch(WAITLIST_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          firstName: firstName.trim(),
          email: email.trim(),
          region,
          consent: true,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("success");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again in a moment.");
    }
  }

  if (status === "success") {
    return (
      <div className="wl-success" role="status" aria-live="polite">
        <span className="wl-tick" aria-hidden="true">
          ✦
        </span>
        <p className="wl-success-title">You&rsquo;re on the list.</p>
        <p className="wl-success-sub">
          We&rsquo;ll email you the moment Cerno opens in September 2026.
        </p>
      </div>
    );
  }

  return (
    <form className="wl-form" onSubmit={onSubmit} noValidate>
      <input
        className="wl-input"
        type="text"
        autoComplete="given-name"
        placeholder="First name"
        aria-label="First name"
        value={firstName}
        onChange={(e) => {
          setFirstName(e.target.value);
          clearError();
        }}
        required
      />

      <input
        className="wl-input"
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder="you@email.com"
        aria-label="Email address"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          clearError();
        }}
        required
      />

      <div className="wl-select-wrap">
        <select
          className={region ? "wl-select" : "wl-select is-placeholder"}
          aria-label="Where are you based?"
          value={region}
          onChange={(e) => {
            setRegion(e.target.value);
            clearError();
          }}
          required
        >
          <option value="" disabled>
            Where are you based?
          </option>
          {REGIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      <label className="wl-consent">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => {
            setConsent(e.target.checked);
            clearError();
          }}
        />
        <span>
          I&rsquo;d like to receive email updates about Cerno, including its
          September 2026 launch.
        </span>
      </label>

      <button
        className="wl-submit"
        type="submit"
        disabled={status === "loading"}
      >
        {status === "loading" ? "Joining…" : "Join the waitlist"}
      </button>

      {status === "error" && (
        <p className="wl-msg wl-error" role="alert">
          {message}
        </p>
      )}
      <p className="wl-fine">
        No spam, unsubscribe anytime. See our{" "}
        <a href="/privacy">Privacy Policy</a>.
      </p>
    </form>
  );
}
