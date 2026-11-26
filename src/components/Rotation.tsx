"use client";

import { useRef } from "react";
import { angles } from "@/data/contenu";
import { entre, etape, useAvancement } from "@/hooks/useAvancement";
import { Maillot3D } from "./Maillot3D";

// L'angle du maillot à chaque arrêt, en radians (0 = de dos, Math.PI = de face).
// Un par entrée de "angles" dans contenu.ts.
const ARRETS = [0, 0.62, Math.PI - 0.62, Math.PI];

// Le maillot fait un demi-tour sur lui-même pendant qu'on défile, de dos jusqu'à de face.
// C'est le défilement qui fixe l'angle du maillot 3D.
export function Rotation() {
  const ref = useRef<HTMLDivElement>(null);
  const avancement = useAvancement(ref);

  // Position dans la rotation : 0 = premier arrêt, 3 = dernier. Elle peut valoir 1,5 (entre deux arrêts).
  // Elle atteint le dernier arrêt à 85 % du défilement, pour laisser le temps de le lire.
  const dernier = angles.length - 1;
  const position = Math.min(dernier, (avancement / 0.85) * dernier);
  const actif = Math.round(position);

  // Entre deux arrêts, le maillot reste un moment immobile, puis tourne d'un coup :
  // il passe vite par la tranche, là où le volume est le moins flatteur.
  const depuis = Math.min(dernier - 1, Math.floor(position));
  const angle = entre(ARRETS[depuis], ARRETS[depuis + 1], etape(position - depuis, 0.3, 0.7));

  return (
    // Bloc très haut : il laisse le temps de faire tourner le maillot.
    <div ref={ref} className="relative h-[230vh] lg:h-[280vh]">
      {/* pt-14 / sm:pt-16 : on laisse la place à l'en-tête fixe sous lg. */}
      <div className="sticky top-0 flex h-[100dvh] items-center overflow-hidden pt-14 pb-4 sm:pt-16 lg:py-0">
        <div className="cadre grid items-center gap-4 sm:gap-6 lg:grid-cols-2 lg:gap-10">
          {/* Sous lg, la largeur est aussi déduite de la hauteur d'écran (rapport 928/1152 de la photo) :
              le maillot entier tient toujours à l'écran avec le texte, sans être rogné ni déformé. */}
          <Maillot3D
            nom="JUNINHO"
            numero="8"
            angleImpose={angle}
            alt="Le maillot Floq qui tourne sur lui-même, de dos jusqu'à de face"
            className="mx-auto w-[min(56vw,14rem,calc(33dvh*928/1152))] sm:w-[min(48vw,20rem,calc(38dvh*928/1152))] lg:w-full lg:max-w-[32rem]"
          />

          <div>
            {/* Sous lg, le libellé et le compteur tiennent sur une ligne. */}
            <div className="flex items-end justify-between gap-4 lg:block">
              <p className="libelle text-accent">Sous tous les angles</p>
              <p
                className="font-flocage text-4xl leading-none text-encre sm:text-6xl lg:mt-6 lg:text-[8rem]"
                aria-hidden="true"
              >
                {String(actif + 1).padStart(2, "0")}
                <span className="text-lg text-encre-3 sm:text-2xl lg:text-4xl"> / {String(angles.length).padStart(2, "0")}</span>
              </p>
            </div>

            <ol className="mt-3 border-t border-trait sm:mt-5 lg:mt-8">
              {angles.map((vue, i) => (
                <li
                  key={vue.titre}
                  className={`border-b border-trait py-2.5 transition-opacity duration-300 sm:py-3.5 lg:py-5 ${
                    i === actif ? "opacity-100" : "opacity-45"
                  }`}
                >
                  <h3 className="text-lg font-medium tracking-tight sm:text-xl lg:text-2xl">{vue.titre}</h3>
                  {/* Le texte de la vue en cours se déplie, les autres restent repliés. */}
                  <div
                    className={`grid transition-[grid-template-rows] duration-500 ${
                      i === actif ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <p className="overflow-hidden text-sm text-encre-2 sm:text-base lg:text-lg">
                      <span className="block pt-1 lg:pt-2">{vue.texte}</span>
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
