import { site } from "@/data/contenu";
import { TexteRoulant } from "./TexteRoulant";

// L'unique action de la page, répétée à l'identique : le bouton "Commander",
// toujours suivi de la même phrase de réassurance.
export function AppelAction({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <a
        href="#tarifs"
        className="inline-flex items-center gap-3 rounded-full bg-accent px-8 py-4 text-lg font-medium text-black transition-colors hover:bg-encre"
      >
        <TexteRoulant>Commander mon Floq</TexteRoulant>
        <span aria-hidden="true">→</span>
      </a>
      <p className="libelle mt-4 text-encre-2">{site.reassurance}</p>
    </div>
  );
}
