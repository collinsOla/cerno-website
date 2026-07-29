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
    <ComingSoon eyebrow="THE WAITLIST" title="Launching September 2026">
      <p className="cs-sub">
        We are no longer accepting submissions for beta testing. Join the
        waitlist to gain access to the app upon launch.
      </p>
      <WaitlistForm />
      <a className="cs-back" href="/">
        Back to cerno
      </a>
    </ComingSoon>
  );
}
