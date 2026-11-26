"use client";

import { useRef } from "react";

type Props = { offre: string; prix: number; miseEnAvant: boolean };

// Le bouton "Commander" d'une offre. Le maillot n'est pas encore en vente :
// le bouton ouvre une fenêtre qui le dit, au lieu d'un vrai paiement.
export function BoutonOffre({ offre, prix, miseEnAvant }: Props) {
  // <dialog> est la fenêtre modale native du navigateur.
  const fenetre = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => fenetre.current?.showModal()}
        aria-label={`Commander l'offre ${offre}`}
        className={`w-full cursor-pointer rounded-full px-6 py-4 text-base font-medium transition-colors ${
          miseEnAvant
            ? "bg-accent text-black hover:bg-encre"
            : "border border-trait hover:border-accent hover:bg-accent hover:text-black"
        }`}
      >
        Commander
      </button>

      <dialog
        ref={fenetre}
        className="m-auto w-[min(32rem,calc(100%-2rem))] rounded-3xl border border-trait bg-surface p-8 text-encre backdrop:bg-black/75"
      >
        <p className="libelle text-accent">
          Offre {offre} · {prix} €
        </p>
        <p className="mt-4 text-2xl font-medium tracking-tight">Merci, c&apos;est noté… ou presque.</p>
        <p className="mt-4 text-encre-2">
          Le maillot Floq n&apos;est pas encore en vente : aucune commande n&apos;est enregistrée et aucun paiement
          ne t&apos;est demandé.
        </p>
        {/* Un formulaire method="dialog" ferme la fenêtre sans JavaScript. */}
        <form method="dialog" className="mt-8">
          <button
            type="submit"
            className="cursor-pointer rounded-full border border-trait px-6 py-3 text-sm font-medium transition-colors hover:border-encre"
          >
            Fermer
          </button>
        </form>
      </dialog>
    </>
  );
}
