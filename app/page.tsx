const learningPaths = [
  {
    number: "01",
    title: "Read with confidence",
    text: "Thoughtful reading experiences that help learners build fluency, focus, and a lasting relationship with words.",
    tag: "READING",
  },
  {
    number: "02",
    title: "Make words stick",
    text: "Grow vocabulary through context, repetition, and meaningful connections—not memorisation alone.",
    tag: "WORD LEARNING",
  },
  {
    number: "03",
    title: "Understand deeply",
    text: "Turn reading into understanding with prompts that strengthen recall, inference, and comprehension.",
    tag: "COMPREHENSION",
  },
  {
    number: "04",
    title: "Think more clearly",
    text: "Build the cognitive foundations behind learning: attention, reasoning, memory, and flexible thinking.",
    tag: "COGNITION",
  },
];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Cerno home">
          <span className="brand-mark" aria-hidden="true">C</span>
          <span>cerno</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#approach">Our approach</a>
          <a href="#learning">How it helps</a>
          <a className="nav-contact" href="#contact">Contact</a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="star-field" aria-hidden="true">
          <i className="star s1" /><i className="star s2" /><i className="star s3" />
          <i className="star s4" /><i className="star s5" /><i className="star s6" />
          <i className="star s7" /><i className="star s8" /><i className="star s9" />
        </div>
        <div className="hero-copy">
          <p className="eyebrow"><span /> Learn. Connect. Understand.</p>
          <h1>Clarity begins<br />with <em>curiosity.</em></h1>
          <p className="hero-intro">
            Cerno is a learning companion designed to strengthen reading,
            language, comprehension, and the thinking skills behind them.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#learning">Explore how it helps <span>↗</span></a>
            <a className="text-link" href="#approach">Discover our approach <span>↓</span></a>
          </div>
        </div>
        <div className="hero-orbit" aria-label="Cerno constellation logo">
          <div className="orbit-ring outer-ring">
            {Array.from({ length: 12 }, (_, index) => (
              <span className={`orbit-star orbit-star-${index + 1}`} key={index} />
            ))}
          </div>
          <div className="orbit-ring inner-ring" />
          <img src="/cerno-logo.jpg" alt="Cerno logo" />
          <div className="orbit-glow" />
        </div>
        <div className="scroll-cue" aria-hidden="true">
          <span>SCROLL TO DISCOVER</span>
          <i />
        </div>
      </section>

      <section className="statement" id="approach">
        <div className="section-kicker"><span>THE CERNO APPROACH</span><i /></div>
        <div className="statement-grid">
          <h2>Knowledge becomes powerful when it <em>connects.</em></h2>
          <div className="statement-copy">
            <p>
              Learning is more than collecting facts. It is the ability to
              recognise patterns, question ideas, and connect new knowledge to
              what you already understand.
            </p>
            <p>
              Cerno brings literacy and cognition together in one calm,
              purposeful experience—helping every learner move from recognising
              words to reasoning with confidence.
            </p>
          </div>
        </div>
        <div className="principles">
          <div><span>01</span><strong>Purposeful</strong><p>Every activity supports a meaningful learning goal.</p></div>
          <div><span>02</span><strong>Connected</strong><p>Skills build on one another, creating deeper understanding.</p></div>
          <div><span>03</span><strong>Human</strong><p>A calm, encouraging space designed around the learner.</p></div>
        </div>
      </section>

      <section className="learning" id="learning">
        <div className="learning-head">
          <div>
            <div className="section-kicker light"><span>ONE JOURNEY, MANY SKILLS</span><i /></div>
            <h2>Everything learning<br />asks of the mind.</h2>
          </div>
          <p>
            Cerno supports the connected skills that help learners make sense
            of language—and the world around them.
          </p>
        </div>
        <div className="path-grid">
          {learningPaths.map((path) => (
            <article className="path-card" key={path.number}>
              <div className="card-top"><span>{path.number}</span><i>✦</i></div>
              <p className="card-tag">{path.tag}</p>
              <h3>{path.title}</h3>
              <p>{path.text}</p>
              <div className="card-line" />
            </article>
          ))}
        </div>
      </section>

      <section className="quote-section">
        <span className="quote-mark">“</span>
        <blockquote>
          We believe every mind has its own constellation of potential.
          Learning helps bring it into view.
        </blockquote>
        <p>— THE IDEA BEHIND CERNO</p>
      </section>

      <section className="contact" id="contact">
        <div className="contact-copy">
          <div className="section-kicker light"><span>WE’RE HERE TO HELP</span><i /></div>
          <h2>Have a question?<br /><em>Let’s connect.</em></h2>
          <p>
            Whether you want to know more about Cerno or need help with the app,
            our team is ready to point you in the right direction.
          </p>
        </div>
        <div className="contact-options">
          <a href="mailto:Kaira@cerno.group">
            <span><small>GENERAL ENQUIRIES</small>Kaira@cerno.group</span><b>↗</b>
          </a>
          <a href="mailto:Tech@cerno.group?subject=Cerno%20support%20request">
            <span><small>TECHNICAL SUPPORT</small>Tech@cerno.group</span><b>↗</b>
          </a>
        </div>
      </section>

      <footer>
        <a className="brand footer-brand" href="#top">
          <span className="brand-mark" aria-hidden="true">C</span><span>cerno</span>
        </a>
        <p>Learning, illuminated.</p>
        <p>© {new Date().getFullYear()} Cerno. All rights reserved.</p>
      </footer>
    </main>
  );
}
