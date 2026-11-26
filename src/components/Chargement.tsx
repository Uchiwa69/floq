import { site } from "@/data/contenu";

// L'écran de chargement : un compteur de 0 à 100, puis le rideau se lève.
// Tout est en CSS (classes .chargement dans globals.css) : même si le JavaScript
// ne se charge pas, le rideau se lève quand même et la page reste lisible.
export function Chargement() {
  return (
    <div className="chargement" aria-hidden="true">
      <p className="text-2xl font-semibold tracking-tight">
        {site.nom}
        <span className="text-accent">.</span>
      </p>
      <p className="chargement-nombre font-flocage text-[9rem] leading-none" />
      <p className="libelle text-encre-2">Chargement de l&apos;encre</p>
    </div>
  );
}
