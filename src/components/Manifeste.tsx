"use client";

import { useEffect, useRef, useState } from "react";

type Props = { texte: string; auteur: string };

// Une citation qui reste fixe à l'écran pendant que ses mots s'allument au défilement.
export function Manifeste({ texte, auteur }: Props) {
  const mots = texte.split(" ");
  const ref = useRef<HTMLDivElement>(null);
  const [allumes, setAllumes] = useState(0);

  useEffect(() => {
    // Sans animations, toute la citation est lisible d'emblée.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const tout = requestAnimationFrame(() => setAllumes(mots.length));
      return () => cancelAnimationFrame(tout);
    }

    const mettreAJour = () => {
      const element = ref.current;
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const ecran = window.innerHeight;
      // Départ : le haut du bloc arrive à 60 % de l'écran.
      // Arrivée : un peu avant que la citation se décroche, pour avoir le temps de la lire entière.
      const parcouru = ecran * 0.6 - rect.top;
      const total = ecran * 0.6 + (rect.height - ecran) * 0.8;
      const avancement = Math.min(1, Math.max(0, parcouru / total));
      setAllumes(Math.round(avancement * mots.length));
    };

    mettreAJour();
    window.addEventListener("scroll", mettreAJour, { passive: true });
    window.addEventListener("resize", mettreAJour);
    return () => {
      window.removeEventListener("scroll", mettreAJour);
      window.removeEventListener("resize", mettreAJour);
    };
  }, [mots.length]);

  return (
    // Le bloc est plus haut que l'écran : c'est ce qui laisse le temps de lire.
    <div ref={ref} className="relative h-[190vh]">
      <div className="sticky top-0 flex h-screen items-center">
        <figure className="cadre">
          <blockquote className="max-w-5xl text-[clamp(1.75rem,3.6vw,3.5rem)] leading-[1.15] font-medium tracking-tight">
            {mots.map((mot, i) => (
              <span
                key={i}
                className={`transition-opacity duration-300 ${i < allumes ? "opacity-100" : "opacity-45"}`}
              >
                {mot}{" "}
              </span>
            ))}
          </blockquote>
          <figcaption className="libelle mt-10 text-encre-3">{auteur}</figcaption>
          {/* Barre de progression de la lecture. */}
          <div aria-hidden="true" className="mt-6 h-px w-full max-w-xs bg-trait">
            <div
              className="h-px origin-left bg-accent transition-transform duration-300"
              style={{ transform: `scaleX(${allumes / mots.length})` }}
            />
          </div>
        </figure>
      </div>
    </div>
  );
}
