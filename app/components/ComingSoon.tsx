"use client";

import { useEffect, useState } from "react";
import GalaxyBackground from "./GalaxyBackground";
import BrandMark from "./BrandMark";

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

type Props = {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
};

/**
 * A standalone "galaxy" page used for the placeholder routes (app download,
 * waitlist, dilemma example). Same void + star-dust world as the home hero,
 * with a single centred message.
 */
export default function ComingSoon({ eyebrow, title, children }: Props) {
  const [showGalaxy, setShowGalaxy] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setShowGalaxy(!reduce && hasWebGL());
  }, []);

  return (
    <div className="coming-soon">
      {showGalaxy ? (
        <GalaxyBackground />
      ) : (
        <div className="galaxy-fallback" aria-hidden="true" />
      )}
      <div className="page-veil" aria-hidden="true" />

      <div className="cs-inner">
        <a className="cs-brand" href="/" aria-label="Cerno home">
          <BrandMark />
          <span className="brand-word">cerno</span>
        </a>
        <p className="cs-eyebrow">{eyebrow}</p>
        <h1 className="cs-title">{title}</h1>
        {children}
      </div>
    </div>
  );
}
