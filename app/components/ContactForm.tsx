"use client";

import { useState } from "react";

/* Posts the enquiry to the same Supabase Edge Function that handles the
   waitlist. The function routes on `intent` and sends the message on to
   contact@cerno.group as a transactional email. Both values are public by
   design; the Brevo secret lives only inside the function. */
const CONTACT_ENDPOINT =
  "https://mfuhglobqsnqfymjpfad.supabase.co/functions/v1/clever-api";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_QbSaXdPZxFV4OQJnzFT9ng_Jtg4qL-F";

type Status = "idle" | "loading" | "success" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const clearError = () => {
    if (status === "error") setStatus("idle");
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      setStatus("error");
      setError("Please enter your first and last name.");
      return;
    }
    if (!EMAIL_RE.test(email)) {
      setStatus("error");
      setError("Please enter a valid email address.");
      return;
    }
    if (!subject.trim()) {
      setStatus("error");
      setError("Please add a subject.");
      return;
    }
    if (message.trim().length < 10) {
      setStatus("error");
      setError("Please tell us a little more (at least a sentence).");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          intent: "contact",
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim(),
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("success");
    } catch {
      setStatus("error");
      setError("Something went wrong. Please try again in a moment.");
    }
  }

  if (status === "success") {
    return (
      <div className="wl-success" role="status" aria-live="polite">
        <span className="wl-tick" aria-hidden="true">
          ✦
        </span>
        <p className="wl-success-title">Message sent.</p>
        <p className="wl-success-sub">
          Thank you for reaching out. We&rsquo;ll be in touch soon.
        </p>
      </div>
    );
  }

  return (
    <form className="wl-form is-contact" onSubmit={onSubmit} noValidate>
      <div className="wl-row">
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
          type="text"
          autoComplete="family-name"
          placeholder="Last name"
          aria-label="Last name"
          value={lastName}
          onChange={(e) => {
            setLastName(e.target.value);
            clearError();
          }}
          required
        />
      </div>

      <input
        className="wl-input"
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder="Email address"
        aria-label="Email address"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          clearError();
        }}
        required
      />

      <input
        className="wl-input"
        type="text"
        placeholder="Subject"
        aria-label="Subject"
        value={subject}
        onChange={(e) => {
          setSubject(e.target.value);
          clearError();
        }}
        required
      />

      <textarea
        className="wl-textarea"
        placeholder="Your message"
        aria-label="Your message"
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
          clearError();
        }}
        required
      />

      <button
        className="wl-submit"
        type="submit"
        disabled={status === "loading"}
      >
        {status === "loading" ? "Sending…" : "Send message"}
      </button>

      {status === "error" && (
        <p className="wl-msg wl-error" role="alert">
          {error}
        </p>
      )}
      <p className="wl-fine">
        We&rsquo;ll only use your details to reply to this enquiry.
      </p>
    </form>
  );
}
