import { chapitres, site } from "@/data/contenu";
import { TexteRoulant } from "./TexteRoulant";

// Le pied de page, posé en bas du dernier appel : la marque en très grand,
// le sommaire des sept sections et un lien pour remonter.
export function PiedDePage() {
  return (
    <footer className="relative border-t border-trait bg-black/60 backdrop-blur-md">
      <div className="cadre flex flex-col gap-4 pt-4 sm:gap-6 sm:pt-6 lg:flex-row lg:items-end lg:justify-between">
        {/* La marque, en police de flocage, qui s'estompe vers le bas.
            Sa taille suit la largeur de l'écran, mais aussi sa hauteur,
            pour ne jamais pousser le bouton "Commander" hors de l'écran. */}
        <p
          aria-hidden="true"
          className="bg-gradient-to-b from-encre to-encre/15 bg-clip-text font-flocage text-[clamp(3.25rem,min(17vw,18dvh),14rem)] sm:text-[clamp(4.5rem,min(17vw,24vh),14rem)] leading-[0.8] text-transparent uppercase select-none"
        >
          {site.nom}
          <span className="text-accent">.</span>
        </p>

        {/* Le sommaire. Caché sur téléphone, où la place manque. */}
        <nav aria-label="Pied de page" className="hidden sm:block lg:pb-2">
          <ol className="libelle grid grid-cols-4 gap-x-10 gap-y-2 lg:grid-cols-2">
            {chapitres.map((chapitre, i) => (
              <li key={chapitre.id}>
                <a
                  href={`#${chapitre.id}`}
                  className="flex gap-3 text-encre-2 transition-colors hover:text-encre"
                >
                  <span aria-hidden="true" className="text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <TexteRoulant>{chapitre.titre}</TexteRoulant>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </div>

      <div className="cadre libelle mt-4 flex items-center justify-between gap-6 border-t border-trait py-4 sm:mt-6 sm:py-5 text-encre-2">
        <p>© 2026 {site.nom}</p>
        <p className="hidden text-encre-3 md:block">Le flocage qui change avec toi</p>
        <a href="#hero" className="group flex items-center gap-2 transition-colors hover:text-encre">
          <TexteRoulant>Haut de page</TexteRoulant>
          <span aria-hidden="true" className="transition-transform group-hover:-translate-y-0.5 group-hover:text-accent">
            ↑
          </span>
        </a>
      </div>
    </footer>
  );
}
