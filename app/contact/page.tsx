import type { Metadata } from "next";
import ComingSoon from "../components/ComingSoon";
import ContactForm from "../components/ContactForm";

export const metadata: Metadata = {
  title: "Contact · Cerno",
  description:
    "Get in touch with the Cerno team. Questions, partnerships, or a hand with anything.",
};

export default function ContactPage() {
  return (
    <ComingSoon eyebrow="GET IN TOUCH" title="Contact us">
      <p className="cs-sub">
        Questions, partnerships, or just a hand with something. Send us a note
        and we&rsquo;ll get back to you.
      </p>
      <ContactForm />
      <a className="cs-direct" href="mailto:info@cerno.group">
        info@cerno.group
      </a>
      <a className="cs-back" href="/">
        Back to cerno
      </a>
    </ComingSoon>
  );
}
