// Cerno website connector (deployed in Supabase as "clever-api").
// Handles two intents from the website, both via Brevo:
//   • waitlist (default) — adds { firstName, email, region } to the Waitlist list (id 3)
//   • contact           — emails a { firstName, lastName, email, subject, message }
//                         enquiry to contact@cerno.group
// The Brevo API key lives ONLY in the BREVO_API_KEY secret — never in the
// website or the repo.

const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY") ?? "";
const WAITLIST_LIST_ID = 3;
const CONTACT_TO = "contact@cerno.group";
const CONTACT_SENDER = { name: "Cerno Website", email: "contact@cerno.group" };

const cors: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "content-type": "application/json" },
  });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// --- Waitlist ------------------------------------------------------------
async function handleWaitlist(payload: {
  firstName?: string;
  email?: string;
  region?: string;
  consent?: boolean;
}): Promise<Response> {
  const email = (payload.email ?? "").trim().toLowerCase();
  if (!EMAIL_RE.test(email)) return json({ error: "invalid_email" }, 400);
  if (!payload.consent) return json({ error: "consent_required" }, 400);

  const res = await fetch("https://api.brevo.com/v3/contacts", {
    method: "POST",
    headers: {
      "api-key": BREVO_API_KEY,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      email,
      attributes: {
        FIRSTNAME: (payload.firstName ?? "").trim(),
        REGION: payload.region ?? "",
        SOURCE: "website-waitlist",
      },
      listIds: [WAITLIST_LIST_ID],
      updateEnabled: true,
    }),
  });

  if (res.status === 201 || res.status === 204) return json({ ok: true });

  const err = await res.json().catch(() => ({}));
  if (err?.code === "duplicate_parameter") return json({ ok: true, duplicate: true });

  console.error("Brevo waitlist error", res.status, JSON.stringify(err));
  return json({ error: "provider_error" }, 502);
}

// --- Contact form --------------------------------------------------------
async function handleContact(payload: {
  firstName?: string;
  lastName?: string;
  email?: string;
  subject?: string;
  message?: string;
}): Promise<Response> {
  const firstName = (payload.firstName ?? "").trim();
  const lastName = (payload.lastName ?? "").trim();
  const email = (payload.email ?? "").trim();
  const subject = (payload.subject ?? "").trim();
  const message = (payload.message ?? "").trim();

  if (!firstName || !lastName) return json({ error: "name_required" }, 400);
  if (!EMAIL_RE.test(email)) return json({ error: "invalid_email" }, 400);
  if (!subject) return json({ error: "subject_required" }, 400);
  if (message.length < 10) return json({ error: "message_too_short" }, 400);

  const fullName = `${firstName} ${lastName}`;
  const html =
    `<h2 style="font-family:Georgia,serif">New enquiry from the Cerno website</h2>` +
    `<p><strong>Name:</strong> ${escapeHtml(fullName)}</p>` +
    `<p><strong>Email:</strong> ${escapeHtml(email)}</p>` +
    `<p><strong>Subject:</strong> ${escapeHtml(subject)}</p>` +
    `<p><strong>Message:</strong></p>` +
    `<p style="white-space:pre-wrap">${escapeHtml(message)}</p>`;
  const text =
    `New enquiry from the Cerno website\n\n` +
    `Name: ${fullName}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`;

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": BREVO_API_KEY,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      sender: CONTACT_SENDER,
      to: [{ email: CONTACT_TO }],
      replyTo: { email, name: fullName },
      subject: `Website enquiry — ${subject}`,
      htmlContent: html,
      textContent: text,
    }),
  });

  if (res.status === 201 || res.status === 200) return json({ ok: true });

  const err = await res.json().catch(() => ({}));
  console.error("Brevo contact error", res.status, JSON.stringify(err));
  return json({ error: "provider_error" }, 502);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  let payload: { intent?: string; [k: string]: unknown };
  try {
    payload = await req.json();
  } catch {
    return json({ error: "bad_request" }, 400);
  }

  if (payload.intent === "contact") return handleContact(payload);
  return handleWaitlist(payload);
});
