"use client";

import { useState } from "react";
import { exemples } from "@/data/contenu";
import { Maillot3D } from "./Maillot3D";

// Composant client : le visiteur tape son nom, le maillot se met à jour.
export function DemoFlocage() {
  const [nom, setNom] = useState("TON NOM");
  const [numero, setNumero] = useState("10");

  return (
    <div className="grid items-center gap-12 lg:grid-cols-2">
      <Maillot3D
        nom={nom || " "}
        numero={numero || " "}
        alt="Maillot Floq vu de dos, avec le flocage que tu viens de saisir"
        className="mx-auto w-full max-w-md"
      />

      <div>
        <p className="libelle text-accent">Essaie</p>
        <h3 className="mt-4 text-3xl font-medium tracking-tight lg:text-4xl">
          Écris ton nom. <em className="font-serif font-normal">Le maillot suit.</em>
        </h3>

        <div className="mt-10 grid grid-cols-[1fr_7rem] gap-4">
          <label className="block">
            <span className="libelle text-encre-3">Nom</span>
            <input
              type="text"
              value={nom}
              maxLength={12}
              autoComplete="off"
              spellCheck={false}
              // Au clic, tout le texte est sélectionné : on tape directement son nom par-dessus.
              onFocus={(e) => e.target.select()}
              onChange={(e) => setNom(e.target.value.toUpperCase())}
              className="mt-2 w-full rounded-2xl border border-trait bg-surface px-5 py-4 text-xl uppercase outline-none focus:border-accent"
            />
          </label>
          <label className="block">
            <span className="libelle text-encre-3">Numéro</span>
            <input
              type="text"
              inputMode="numeric"
              value={numero}
              maxLength={2}
              autoComplete="off"
              // On ne garde que les chiffres.
              onChange={(e) => setNumero(e.target.value.replace(/\D/g, ""))}
              className="mt-2 w-full rounded-2xl border border-trait bg-surface px-5 py-4 text-xl outline-none focus:border-accent"
            />
          </label>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span className="libelle text-encre-3">Ou essaie</span>
          {exemples.map((exemple) => (
            <button
              key={exemple.nom}
              type="button"
              onClick={() => {
                setNom(exemple.nom);
                setNumero(exemple.numero);
              }}
              className="libelle cursor-pointer rounded-full border border-trait px-4 py-2 transition-colors hover:border-encre"
            >
              {exemple.nom} {exemple.numero}
            </button>
          ))}
        </div>

        <p className="mt-8 max-w-md text-encre-2">
          Sur le vrai maillot, c&apos;est pareil : tu valides dans l&apos;application et le panneau change en dix
          secondes.
        </p>
      </div>
    </div>
  );
}
