"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GalaxyBackground from "./GalaxyBackground";
import BrandMark from "./BrandMark";
import { scrollStore } from "../lib/scrollStore";

/* The four everyday features. `text` shows on tablet/desktop; `short` is the
   one-line version used on phones. */
const features = [
  {
    i: "01",
    name: "Twelve levels",
    short: "Reading and reasoning, trained daily across twelve levels.",
    text: "Your literacy and critical thinking skills are trained daily, with different modes focusing on the different facets required for comprehension and nuance.",
  },
  {
    i: "02",
    name: "The Lexicon",
    short: "Training vocabulary to stick.",
    text: "Vocabulary expansion done in a way that genuinely promotes word learning. Research shows that we are exposed to more words today than ever before, but the frequency of repeated exposure is lower than it has ever been. Cerno solves that through the lexicon.",
  },
  {
    i: "03",
    name: "The Daily Insight",
    short: "A fact a day, a treat for the mind.",
    text: "Love a fun fact? You’ll receive a daily treat in the form of an insight, and it could be about any topic. The most interesting minds know small snippets of a lot.",
  },
  {
    i: "04",
    name: "The Daily Read",
    short: "A short daily essay on an interesting concept.",
    text: "A short, daily essay on an idea or concept. Dedicate a small amount of time each day, be it morning or evening, to learning about something interesting.",
  },
];

/* Small line-icons that separate the feature cards (helpful on phones). */
function featureIcon(index: number) {
  const props = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (index) {
    case 0: // twelve levels — ascending steps
      return (
        <svg {...props}>
          <path d="M3 20h5v-6H3zM9.5 20h5V9h-5zM16 20h5V4h-5z" />
        </svg>
      );
    case 1: // lexicon — open book
      return (
        <svg {...props}>
          <path d="M12 6c-1.6-1-4-1.6-6.2-1.6V17c2.2 0 4.6.6 6.2 1.6 1.6-1 4-1.6 6.2-1.6V4.4C16 4.4 13.6 5 12 6Z" />
          <path d="M12 6v12" />
        </svg>
      );
    case 2: // daily insight — lightbulb
      return (
        <svg {...props}>
          <path d="M9 18h6" />
          <path d="M10 21h4" />
          <path d="M8.5 14c-.3-1-.9-1.7-1.6-2.4A5 5 0 1 1 17 8a5 5 0 0 1-1.9 3.6c-.7.7-1.3 1.4-1.6 2.4" />
        </svg>
      );
    default: // daily read — page
      return (
        <svg {...props}>
          <path d="M7 3h7l4 4v14H7z" />
          <path d="M14 3v4h4" />
          <path d="M10 13h5M10 16h5" />
        </svg>
      );
  }
}

/* The twelve named levels. Descriptor phrases are brand-level, not per-user. */
const levels = [
  { n: 1, name: "Rousseau", arch: "Raw curiosity, natural wonder" },
  { n: 2, name: "Emerson", arch: "Self-reliance, early reflection" },
  { n: 3, name: "Montaigne", arch: "The essayist, forming opinions" },
  { n: 4, name: "Voltaire", arch: "Sharp, critical, questioning" },
  { n: 5, name: "Locke", arch: "Structured thought, early logic" },
  { n: 6, name: "Hume", arch: "Empirical, sceptical reasoning" },
  { n: 7, name: "Aristotle", arch: "Systematic, framework-building" },
  { n: 8, name: "Kant", arch: "Rigorous, demanding abstraction" },
  { n: 9, name: "Nietzsche", arch: "Challenging, unconventional depth" },
  { n: 10, name: "Woolf", arch: "Literary intellect, nuance, voice" },
  { n: 11, name: "Dostoevsky", arch: "Psychological complexity, moral weight" },
  { n: 12, name: "Borges", arch: "The master, ideas within ideas" },
];

/* Proper line arrows (never render as emoji). */
function ArrowDown() {
  return (
    <svg
      className="ui-arrow"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M8 3v10M3.5 8.5 8 13l4.5-4.5" />
    </svg>
  );
}
function ArrowUpRight() {
  return (
    <svg
      className="ui-arrow"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 11 11 5M5.5 5H11v5.5" />
    </svg>
  );
}

// A loose constellation the transition draws as you scroll into it.
const nodes: [number, number][] = [
  [120, 96],
  [232, 168],
  [188, 300],
  [300, 246],
  [414, 122],
  [470, 262],
  [372, 384],
  [250, 446],
  [140, 398],
];
const constellationPath = "M " + nodes.map(([x, y]) => `${x} ${y}`).join(" L ");

// A wide, horizontal constellation used as a divider between sections.
const hNodes: [number, number][] = [
  [40, 74],
  [180, 40],
  [320, 92],
  [470, 52],
  [610, 96],
  [760, 44],
  [900, 84],
  [980, 58],
];
const hConstellationPath = "M " + hNodes.map(([x, y]) => `${x} ${y}`).join(" L ");

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (c.getContext("webgl2") || c.getContext("webgl"))
    );
  } catch {
    return false;
  }
}

export default function Experience() {
  const root = useRef<HTMLDivElement>(null);
  const [motion, setMotion] = useState(false);
  const [showGalaxy, setShowGalaxy] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const enable = !reduce;
    setMotion(enable);
    setShowGalaxy(enable && hasWebGL());
  }, []);

  // Lenis smooth scroll wired into GSAP's ticker + the shared scroll store.
  useEffect(() => {
    if (!motion) return;
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on("scroll", (e: { progress: number; velocity: number }) => {
      scrollStore.progress = e.progress;
      scrollStore.velocity = e.velocity;
      ScrollTrigger.update();
      setScrolled(e.progress > 0.008);
    });

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const onMove = (e: PointerEvent) => {
      scrollStore.px = (e.clientX / window.innerWidth) * 2 - 1;
      scrollStore.py = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove);

    return () => {
      window.removeEventListener("pointermove", onMove);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, [motion]);

  // Scroll-driven choreography, scoped to the root.
  useLayoutEffect(() => {
    if (!motion || !root.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Hero intro - plays once on load.
      gsap
        .timeline({ defaults: { ease: "power3.out", duration: 1 } })
        .from(".hero-launch", { y: 16, opacity: 0, duration: 0.7 })
        .from(".hero-eyebrow", { y: 18, opacity: 0, duration: 0.7 }, "-=0.4")
        .from(
          ".hero-line",
          { yPercent: 115, opacity: 0, stagger: 0.12, duration: 1.1 },
          "-=0.35"
        )
        .from(".hero-intro", { y: 24, opacity: 0 }, "-=0.7")
        .from(".hero-actions > *", { y: 20, opacity: 0, stagger: 0.12 }, "-=0.7")
        .from(".scroll-cue", { opacity: 0, duration: 1.2 }, "-=0.4");

      // Generic reveal-on-enter.
      gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
        gsap.from(el, {
          y: 46,
          opacity: 0,
          duration: 1.05,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 84%" },
        });
      });

      // Kickers drift subtly as they pass.
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const d = parseFloat(el.dataset.parallax || "40");
        gsap.fromTo(
          el,
          { y: d },
          {
            y: -d,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });

      // Each constellation draws itself + pops its dots, triggered by its section.
      gsap.utils.toArray<SVGElement>(".constellation").forEach((svg) => {
        const section = svg.closest("section") || svg;
        svg
          .querySelectorAll<SVGPathElement>(".constellation-line")
          .forEach((p) => {
            const len = p.getTotalLength();
            gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
            gsap.to(p, {
              strokeDashoffset: 0,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top 82%",
                end: "bottom 55%",
                scrub: true,
              },
            });
          });
        gsap.from(svg.querySelectorAll(".constellation-node"), {
          scale: 0,
          opacity: 0,
          transformOrigin: "center",
          stagger: 0.06,
          duration: 0.6,
          ease: "back.out(2)",
          scrollTrigger: { trigger: section, start: "top 80%" },
        });
      });

      // Progression: the central line draws, each level node lights as it enters.
      const line = root.current!.querySelector(".prog-line");
      if (line) {
        gsap.fromTo(
          line,
          { scaleY: 0 },
          {
            scaleY: 1,
            transformOrigin: "top",
            ease: "none",
            scrollTrigger: {
              trigger: ".progression-map",
              start: "top 70%",
              end: "bottom 70%",
              scrub: true,
            },
          }
        );
      }
      gsap.utils.toArray<HTMLElement>(".level-row").forEach((row) => {
        gsap.to(row, {
          "--lit": 1,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: { trigger: row, start: "top 82%" },
        });
      });

      ScrollTrigger.refresh();
    }, root);

    const id = setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => {
      clearTimeout(id);
      ctx.revert();
    };
  }, [motion]);

  // Magnetic hover.
  useEffect(() => {
    if (!motion || !root.current) return;
    const els = Array.from(
      root.current.querySelectorAll<HTMLElement>(".magnetic")
    );
    const cleanups = els.map((el) => {
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        gsap.to(el, { x: x * 0.28, y: y * 0.32, duration: 0.5, ease: "power3.out" });
      };
      const leave = () =>
        gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1,0.4)" });
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      return () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
      };
    });
    return () => cleanups.forEach((c) => c());
  }, [motion]);

  return (
    <div ref={root} className={motion ? "experience motion" : "experience"}>
      {showGalaxy ? (
        <GalaxyBackground />
      ) : (
        <div className="galaxy-fallback" aria-hidden="true" />
      )}
      <div className="page-veil" aria-hidden="true" />

      <header className={scrolled ? "site-header is-scrolled" : "site-header"}>
        <a className="brand" href="#top" aria-label="Cerno home">
          <BrandMark />
          <span className="brand-word">cerno</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#idea">The idea</a>
          <a href="#features">Features</a>
          <a href="#progression">Progression</a>
          <a className="nav-dilemma" href="/dilemma">Dilemma</a>
          <a className="nav-contact magnetic" href="/contact">
            Contact
          </a>
        </nav>
      </header>

      <main>
        {/* HERO */}
        <section className="hero" id="top">
          <div className="hero-copy">
            <p className="hero-launch">
              <i aria-hidden="true" /> Launching September 2026
            </p>
            <p className="hero-eyebrow eyebrow">Feed the mind, run the room</p>
            <h1 className="hero-title">
              <span className="line-mask">
                <span className="hero-line">It begins</span>
              </span>
              <span className="line-mask">
                <span className="hero-line">
                  with <em>curiosity.</em>
                </span>
              </span>
            </h1>
            <p className="hero-intro">
              Cerno&rsquo;s mission is centred around a love of the mind, for we
              cannot lose that love.
            </p>
            <div className="hero-actions">
              <a className="button button-primary magnetic" href="#idea">
                See how it works <span><ArrowDown /></span>
              </a>
              <a className="text-link" href="#progression">
                The progression <span><ArrowUpRight /></span>
              </a>
            </div>
          </div>
          <div className="scroll-cue" aria-hidden="true">
            <span>SCROLL TO DISCOVER</span>
            <i />
          </div>
        </section>

        {/* CONSTELLATION - self-drawing transition + download CTA */}
        <section className="constellation-break">
          <svg
            className="constellation"
            viewBox="0 0 600 520"
            aria-hidden="true"
          >
            <path
              className="constellation-line"
              d={constellationPath}
              fill="none"
            />
            {nodes.map(([x, y], i) => (
              <circle
                className="constellation-node"
                key={i}
                cx={x}
                cy={y}
                r={i % 3 === 0 ? 5 : 3.4}
              />
            ))}
          </svg>
          <a className="download-app magnetic reveal" href="/download">
            Download the app <span><ArrowDown /></span>
          </a>
        </section>

        {/* THE IDEA */}
        <section className="idea" id="idea">
          <div className="section-kicker reveal" data-parallax="26">
            <span>THE IDEA</span>
          </div>
          <div className="idea-grid">
            <h2 className="reveal">
              Intelligence is treated as something you have or you don&rsquo;t.
              But <em>we don&rsquo;t agree.</em>
            </h2>
            <div className="idea-side">
              <div className="idea-copy reveal hide-phone">
                <p>
                  Reading closely, reaching for the exact word, following an
                  argument all the way to its real conclusion. These are skills,
                  and skills grow when they are practised well.
                </p>
                <p>
                  Cerno provides a structure for that practice, at a high,
                  thoughtful standard.
                </p>
              </div>
              <div className="quote-card reveal">
                <p className="q-line">Intelligence compounds.</p>
                <p className="q-sub">Small habits each day feed the mind.</p>
                <span className="q-attr">THE CERNO IDEA</span>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES - numbered */}
        <section className="features" id="features">
          <div className="features-head">
            <div className="section-kicker light reveal">
              <span>A FEW MINUTES A DAY</span>
            </div>
            <h2 className="reveal">
              Small habits,
              <br />
              done <em>well.</em>
            </h2>
            <p className="reveal hide-phone">
              Every day Cerno puts something in front of you that is genuinely
              worth the moment it asks for. A level to climb, a word, a fact,
              and an idea.
            </p>
          </div>
          <div className="feature-grid">
            {features.map((f, index) => (
              <article className="feature-card reveal" key={f.i}>
                <div className="feature-head">
                  <span className="feature-icon" aria-hidden="true">
                    {featureIcon(index)}
                  </span>
                  <span className="feature-num">{f.i}</span>
                </div>
                <h3>{f.name}</h3>
                <p className="feature-full">{f.text}</p>
                <p className="feature-short">{f.short}</p>
              </article>
            ))}
          </div>
        </section>

        {/* THE PROGRESSION */}
        <section className="progression" id="progression">
          <div className="progression-head">
            <div className="section-kicker light reveal">
              <span>THE PROGRESSION</span>
            </div>
            <h2 className="reveal">
              Climb minds,
              <br />
              <em>progress slowly but surely.</em>
            </h2>
          </div>

          <div className="progression-map">
            <div className="prog-line" aria-hidden="true" />
            {levels.map((l) => (
              <div
                className={
                  l.n === 12 ? "level-row is-peak" : "level-row"
                }
                key={l.n}
              >
                <div className="level-card">
                  <span className="level-num">Level {l.n}</span>
                  <span className="level-name">{l.name}</span>
                  <span className="level-arch">{l.arch}</span>
                </div>
                <span className="level-node" aria-hidden="true" />
                <div className="level-spacer" aria-hidden="true" />
              </div>
            ))}
          </div>

          <p className="prog-note reveal">
            A short assessment sets your first level.
          </p>
        </section>

        {/* THE CERNO DILEMMA */}
        <section className="dilemma" id="dilemma">
          <div className="dilemma-orbit">
            <div className="orbit-ring orbit-outer" aria-hidden="true">
              {Array.from({ length: 8 }, (_, i) => (
                <span className={`orbit-star orbit-star-${i + 1}`} key={i} />
              ))}
            </div>
            <div className="orbit-ring orbit-inner" />
            <a className="orbit-core" href="/dilemma" aria-label="Enter the Cerno Dilemma">
              <span>ENTER</span>
            </a>
            <div className="orbit-glow" />
          </div>
          <div className="dilemma-copy">
            <div className="section-kicker reveal">
              <span>THE CERNO DILEMMA</span>
            </div>
            <p className="dilemma-cadence reveal">A new dilemma every day</p>
            <blockquote className="dilemma-quote reveal">
              Every real choice requires you to betray something you believe in.
              <em> The only question is what.</em>
            </blockquote>
            <p className="dilemma-text reveal hide-phone">
              Every day, a moral scenario built with enough layers that
              thoughtful people reach different conclusions. There is no right
              answer, and none is offered. Only two positions, and the
              discomfort of choosing one. Take your side, then see how everyone
              else voted. It is designed to follow you out of the app and into a
              real conversation.
            </p>
          </div>
        </section>

        {/* HORIZONTAL CONSTELLATION DIVIDER */}
        <section className="constellation-divider" aria-hidden="true">
          <svg
            className="constellation constellation-h"
            viewBox="0 0 1020 130"
            preserveAspectRatio="xMidYMid meet"
          >
            <path
              className="constellation-line"
              d={hConstellationPath}
              fill="none"
            />
            {hNodes.map(([x, y], i) => (
              <circle
                className="constellation-node"
                key={i}
                cx={x}
                cy={y}
                r={i % 3 === 0 ? 4.5 : 3}
              />
            ))}
          </svg>
        </section>

        {/* CONTACT */}
        <section className="contact" id="contact">
          <div className="contact-copy">
            <div className="section-kicker light reveal">
              <span>GET IN TOUCH</span>
            </div>
            <h2 className="reveal">
              Have a question?
              <br />
              <em>Let&rsquo;s connect.</em>
            </h2>
            <p className="reveal">
              Whether you want to know more about Cerno, or you need a hand. Get
              in touch.
            </p>
          </div>
          <div className="contact-options reveal">
            <a className="contact-cta magnetic" href="/contact">
              <span>Contact us</span>
              <b>
                <ArrowUpRight />
              </b>
            </a>
          </div>
        </section>

        <footer>
          <div className="footer-top">
            <a className="brand footer-brand" href="#top">
              <BrandMark />
              <span className="brand-word">cerno</span>
            </a>
            <nav className="footer-links" aria-label="Legal">
              <a href="/privacy">Privacy Policy</a>
              <a className="hide-phone" href="/cookies">Cookies</a>
              <a className="hide-phone" href="/terms">Terms</a>
              <a className="hide-phone" href="/acceptable-use">Acceptable use</a>
              <a className="hide-phone" href="/refunds">Refunds</a>
              <a className="hide-phone" href="/legal">Legal</a>
              <a className="footer-policies only-phone" href="/legal">
                Policies
              </a>
              <button type="button" className="footer-cookie-link" data-cookie-settings>
                Cookie settings
              </button>
            </nav>
          </div>
          <div className="footer-bottom">
            <p className="footer-company">
              CERNO GROUP LTD, registered in England &amp; Wales, company number
              16882401. Registered office: 167-169 Great Portland Street, Fifth
              Floor, London, W1W 5PF, United Kingdom.
            </p>
            <p className="footer-meta">
              <span className="footer-email">info@cerno.group</span> · Launching
              September 2026 · © {new Date().getFullYear()} Cerno.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
