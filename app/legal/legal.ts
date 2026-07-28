import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";

export type PolicyMeta = { slug: string; title: string; nav: string; blurb: string };

/** Published policies, in nav order. */
export const POLICIES: PolicyMeta[] = [
  {
    slug: "privacy",
    title: "Privacy Policy",
    nav: "Privacy",
    blurb: "What we collect, why, and the rights you have over your data.",
  },
  {
    slug: "cookies",
    title: "Cookie Policy",
    nav: "Cookies",
    blurb: "Cookies and similar technologies, and how to manage your choices.",
  },
  {
    slug: "terms",
    title: "Terms of Service",
    nav: "Terms",
    blurb: "The agreement between you and Cerno for using the service.",
  },
  {
    slug: "acceptable-use",
    title: "Acceptable Use Policy",
    nav: "Acceptable use",
    blurb: "The rules for how the service may and may not be used.",
  },
  {
    slug: "refunds",
    title: "Refund & Cancellation Policy",
    nav: "Refunds",
    blurb: "Immediate access, auto-renewal, cancellation, and your statutory rights.",
  },
  {
    slug: "childrens-privacy",
    title: "Privacy for under-18s",
    nav: "Under 18",
    blurb: "A short, plain-language privacy notice for users aged 13 to 17.",
  },
];

export function policyBySlug(slug: string): PolicyMeta | undefined {
  return POLICIES.find((p) => p.slug === slug);
}

/**
 * Add a `data-label` (the column header) to every table cell so tables can
 * reflow into labeled cards on small screens.
 */
function addTableLabels(html: string): string {
  return html.replace(/<table>([\s\S]*?)<\/table>/g, (whole, inner) => {
    const thead = inner.match(/<thead>([\s\S]*?)<\/thead>/);
    if (!thead) return whole;
    const headers: string[] = [];
    const thRe = /<th[^>]*>([\s\S]*?)<\/th>/g;
    let m: RegExpExecArray | null;
    while ((m = thRe.exec(thead[1])) !== null) {
      headers.push(m[1].replace(/<[^>]+>/g, "").trim().replace(/"/g, "&quot;"));
    }
    const labelled = inner.replace(
      /<tbody>([\s\S]*?)<\/tbody>/,
      (_tb: string, body: string) =>
        "<tbody>" +
        body.replace(/<tr>([\s\S]*?)<\/tr>/g, (_tr: string, cells: string) => {
          let i = 0;
          const withLabels = cells.replace(
            /<td([^>]*)>/g,
            (_td: string, attrs: string) => {
              const label = headers[i] || "";
              i += 1;
              return `<td${attrs} data-label="${label}">`;
            }
          );
          return `<tr>${withLabels}</tr>`;
        }) +
        "</tbody>"
    );
    return `<table>${labelled}</table>`;
  });
}

/** Read a policy's markdown at build time and render it to HTML. */
export async function renderPolicy(slug: string): Promise<string> {
  const file = path.join(process.cwd(), "app", "legal", "content", `${slug}.md`);
  const md = fs.readFileSync(file, "utf8");
  const html = await marked.parse(md, { gfm: true });
  return addTableLabels(html);
}
