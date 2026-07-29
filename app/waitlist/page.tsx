import type { Metadata } from "next";
import ComingSoon from "../components/ComingSoon";
import WaitlistForm from "../components/WaitlistForm";

export const metadata: Metadata = {
  title: "Join the waitlist · Cerno",
  description:
    "Join the Cerno waitlist and be among the first minds inside when it opens.",
};

export default function WaitlistPage() {
  return (
    <ComingSoon eyebrow="THE WAITLIST" title="Join the waitlist">
      <p className="cs-sub">
        Cerno launches in September 2026. Leave your email and we&rsquo;ll let
        you know the moment it opens.
      </p>
      <WaitlistForm />
      <a className="cs-back" href="/">
        Back to cerno
      </a>
    </ComingSoon>
  );
}
