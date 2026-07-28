import type { Metadata } from "next";
import { POLICIES } from "./legal";

export const metadata: Metadata = {
  title: "Legal · Cerno",
  description: "Cerno's policies: privacy, cookies, terms, acceptable use, and refunds.",
};

export default function LegalIndex() {
  return (
    <div className="legal-page">
      <header className="legal-top">
        <a className="legal-home" href="/">
          cerno
        </a>
        <a className="legal-back" href="/">
          Back to site
        </a>
      </header>

      <main className="legal-shell">
        <div className="legal legal-index">
          <h1>Legal</h1>
          <p className="legal-lead">
            Our policies for the Cerno website and app. If anything here is
            unclear, email <a href="mailto:info@cerno.group">info@cerno.group</a>.
          </p>

          <ul className="legal-list">
            {POLICIES.map((p) => (
              <li key={p.slug}>
                <a href={`/${p.slug}`}>
                  <span className="legal-list-title">{p.title}</span>
                  <span className="legal-list-blurb">{p.blurb}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </main>

      <footer className="legal-foot">
        <p>
          CERNO GROUP LTD, registered in England &amp; Wales, company number
          16882401. Registered office: 167-169 Great Portland Street, Fifth
          Floor, London, W1W 5PF, United Kingdom.{" "}
          <a href="mailto:info@cerno.group">info@cerno.group</a>
        </p>
        <p>© {new Date().getFullYear()} Cerno. All rights reserved.</p>
      </footer>
    </div>
  );
}
