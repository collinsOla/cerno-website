import { POLICIES } from "./legal";

/* A single policy page: white background, black text, one readable column,
   with a policy switcher and the required company identity in the footer. */
export default function LegalArticle({
  slug,
  html,
}: {
  slug: string;
  html: string;
}) {
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
        <nav className="legal-nav" aria-label="Policies">
          {POLICIES.map((p) => (
            <a
              key={p.slug}
              href={`/${p.slug}`}
              className={p.slug === slug ? "is-active" : undefined}
              aria-current={p.slug === slug ? "page" : undefined}
            >
              {p.nav}
            </a>
          ))}
        </nav>

        <article className="legal" dangerouslySetInnerHTML={{ __html: html }} />
      </main>

      <footer className="legal-foot">
        <p>
          CERNO GROUP LTD, registered in England &amp; Wales, company number
          16882401. Registered office: 167-169 Great Portland Street, Fifth
          Floor, London, W1W 5PF, United Kingdom.{" "}
          <a href="mailto:info@cerno.group">info@cerno.group</a>
        </p>
        <p>
          © {new Date().getFullYear()} Cerno. All rights reserved.{" "}
          <button type="button" className="legal-cookie-link" data-cookie-settings>
            Cookie settings
          </button>
        </p>
      </footer>
    </div>
  );
}
