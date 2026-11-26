import { flocages } from "@/data/contenu";

// Un bandeau de noms et de numéros qui défile sans fin en bas du hero.
// L'animation est en CSS (classe .defile dans globals.css).
export function Defile() {
  // La liste est écrite deux fois : quand la première moitié est sortie,
  // la seconde est exactement à sa place, et la boucle ne se voit pas.
  const elements = [...flocages, ...flocages];

  return (
    <div aria-hidden="true" className="overflow-hidden border-y border-trait py-5">
      <div className="defile flex w-max gap-12 font-flocage text-5xl whitespace-nowrap uppercase">
        {elements.map((flocage, i) => (
          <span key={i} className="flex items-center gap-12">
            <span>
              {flocage.nom} <span className="text-accent">{flocage.numero}</span>
            </span>
            <span className="h-2 w-2 rounded-full bg-encre-3" />
          </span>
        ))}
      </div>
    </div>
  );
}
