// Waitlist signup connector.
// Receives { email, region, consent } from the website form and adds the
// contact to the Brevo "Waitlist" list (id 3). The Brevo API key lives ONLY
// in the BREVO_API_KEY secret — never in the website or the repo.

const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY") ?? "";
const WAITLIST_LIST_ID = 3;

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

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  let payload: { email?: string; region?: string; consent?: boolean };
  try {
    payload = await req.json();
  } catch {
    return json({ error: "bad_request" }, 400);
  }

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
        REGION: payload.region ?? "",
        SOURCE: "website-waitlist",
      },
      listIds: [WAITLIST_LIST_ID],
      updateEnabled: true,
    }),
  });

  if (res.status === 201 || res.status === 204) return json({ ok: true });

  const err = await res.json().catch(() => ({}));
  // Contact already exists and is fine — treat as success.
  if (err?.code === "duplicate_parameter") return json({ ok: true, duplicate: true });

  console.error("Brevo error", res.status, JSON.stringify(err));
  return json({ error: "provider_error" }, 502);
});
