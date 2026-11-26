"use client";

import { useEffect, useState } from "react";
import { chapitres, site } from "@/data/contenu";
import { reglerSon } from "@/lib/son";
import { TexteRoulant } from "./TexteRoulant";

// En-tête fixe (marque, compteur de section, bouton) et rail de navigation à droite.
// Composant client : il observe le défilement pour savoir quelle section est à l'écran.
export function Navigation() {
  const [actif, setActif] = useState(0);
  const [son, setSon] = useState(false);

  useEffect(() => {
    // Une section devient "active" quand elle traverse le milieu de l'écran.
    const observateur = new IntersectionObserver(
      (entrees) => {
        for (const entree of entrees) {
          if (entree.isIntersecting) {
            const index = chapitres.findIndex((chapitre) => chapitre.id === entree.target.id);
            if (index !== -1) setActif(index);
          }
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );

    for (const chapitre of chapitres) {
      const section = document.getElementById(chapitre.id);
      if (section) observateur.observe(section);
    }
    return () => observateur.disconnect();
  }, []);

  const deuxChiffres = (n: number) => String(n).padStart(2, "0");

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 bg-black/75 backdrop-blur-md">
        <div className="cadre flex h-16 items-center justify-between">
          <a href="#hero" className="text-xl font-semibold tracking-tight">
            {site.nom}
            <span className="text-accent">.</span>
          </a>

          <p className="libelle hidden text-encre-2 sm:block" aria-live="polite">
            <span className="text-encre">{deuxChiffres(actif + 1)}</span>
            <span className="mx-2 text-encre-3">/</span>
            {deuxChiffres(chapitres.length)}
            <span className="ml-4 text-encre-3">{chapitres[actif].titre}</span>
          </p>

          <div className="flex items-center gap-3">
            {/* Le son est coupé par défaut : c'est le visiteur qui l'allume. */}
            <button
              type="button"
              aria-pressed={son}
              onClick={() => {
                reglerSon(!son);
                setSon(!son);
              }}
              className="libelle hidden cursor-pointer rounded-full border border-trait px-4 py-2 text-encre-2 transition-colors hover:border-encre hover:text-encre md:block"
            >
              Son <span className={son ? "text-accent" : ""}>{son ? "on" : "off"}</span>
            </button>
            <a
              href="#tarifs"
              className="rounded-full border border-trait px-5 py-2 text-sm font-medium transition-colors hover:border-accent hover:bg-accent hover:text-black"
            >
              <TexteRoulant>Commander</TexteRoulant>
            </a>
          </div>
        </div>
      </header>

      <nav aria-label="Sections de la page" className="fixed top-1/2 right-6 z-30 hidden -translate-y-1/2 xl:block">
        <ol className="flex flex-col items-end gap-4">
          {chapitres.map((chapitre, i) => (
            <li key={chapitre.id}>
              <a
                href={`#${chapitre.id}`}
                aria-current={i === actif ? "true" : undefined}
                className="group flex items-center gap-3"
              >
                {/* Le nom n'apparaît qu'au survol : la section en cours est déjà écrite dans l'en-tête. */}
                <span className="libelle rounded-full bg-black px-3 py-1 text-encre opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  {deuxChiffres(i + 1)} {chapitre.titre}
                </span>
                <span
                  aria-hidden="true"
                  className={`block h-px transition-all ${i === actif ? "w-8 bg-accent" : "w-4 bg-encre-3"}`}
                />
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
