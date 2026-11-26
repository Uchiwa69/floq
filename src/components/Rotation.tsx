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
    <div ref={ref} className="relative h-[280vh]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="cadre grid items-center gap-10 lg:grid-cols-2">
          <Maillot3D
            nom="JUNINHO"
            numero="8"
            angleImpose={angle}
            alt="Le maillot Floq qui tourne sur lui-même, de dos jusqu'à de face"
            className="mx-auto w-full max-w-[32rem]"
          />

          <div>
            <p className="libelle text-accent">Sous tous les angles</p>
            <p className="mt-6 font-flocage text-[8rem] leading-none text-encre" aria-hidden="true">
              {String(actif + 1).padStart(2, "0")}
              <span className="text-4xl text-encre-3"> / {String(angles.length).padStart(2, "0")}</span>
            </p>

            <ol className="mt-8 border-t border-trait">
              {angles.map((vue, i) => (
                <li
                  key={vue.titre}
                  className={`border-b border-trait py-5 transition-opacity duration-300 ${
                    i === actif ? "opacity-100" : "opacity-45"
                  }`}
                >
                  <h3 className="text-2xl font-medium tracking-tight">{vue.titre}</h3>
                  {/* Le texte de la vue en cours se déplie, les autres restent repliés. */}
                  <div
                    className={`grid transition-[grid-template-rows] duration-500 ${
                      i === actif ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <p className="overflow-hidden text-lg text-encre-2">
                      <span className="block pt-2">{vue.texte}</span>
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
