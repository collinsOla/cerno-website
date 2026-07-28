import type { Metadata } from "next";
import ComingSoon from "../components/ComingSoon";

export const metadata: Metadata = {
  title: "Join the waitlist · Cerno",
  description: "Waitlist sign-up for Cerno is opening soon.",
};

export default function WaitlistPage() {
  return (
    <ComingSoon eyebrow="THE WAITLIST" title="Coming soon">
      <p className="cs-sub">
        Waitlist sign-up opens shortly. Check back soon to be among the first
        minds inside.
      </p>
      <a className="cs-back" href="/">
        Back to cerno
      </a>
    </ComingSoon>
  );
}
