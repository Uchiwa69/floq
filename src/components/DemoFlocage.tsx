"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { exemples, type Flocage } from "@/data/contenu";
import { Maillot3D } from "./Maillot3D";

// Les trois moments de la démo : on écrit, l'envoi part, le maillot confirme.
type Etape = "saisie" | "envoi" | "confirme";

// La démonstration : un téléphone avec l'application Floq, relié au maillot en 3D.
// Le visiteur écrit un nom, appuie sur "Envoyer", et le maillot se met à jour,
// comme avec le vrai produit.
export function DemoFlocage() {
  // Ce qui est écrit dans l'application...
  const [nom, setNom] = useState("TON NOM");
  const [numero, setNumero] = useState("10");
  // ...et ce que le maillot affiche pour l'instant.
  const [affiche, setAffiche] = useState<Flocage>(exemples[0]);
  const [etape, setEtape] = useState<Etape>("saisie");
  const minuteurs = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Si on quitte la page en plein envoi, on annule les minuteurs en attente.
  useEffect(() => () => minuteurs.current.forEach(clearTimeout), []);

  const envoyer = (flocage: Flocage) => {
    if (etape !== "saisie") return;
    setNom(flocage.nom);
    setNumero(flocage.numero);
    setEtape("envoi");
    // 1. le signal met un peu plus d'une seconde à "traverser" jusqu'au maillot ;
    // 2. le maillot change et l'application confirme ;
    // 3. l'application revient à l'écran de saisie.
    minuteurs.current = [
      setTimeout(() => {
        setAffiche({ nom: flocage.nom || " ", numero: flocage.numero || " " });
        setEtape("confirme");
      }, 1200),
      setTimeout(() => setEtape("saisie"), 3000),
    ];
  };

  const valider = (event: FormEvent) => {
    event.preventDefault(); // on reste sur la page, sans rechargement
    envoyer({ nom, numero });
  };

  return (
    <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto_auto]">
      <div>
        <Maillot3D
          nom={affiche.nom}
          numero={affiche.numero}
          alt="Maillot Floq vu de dos, avec le flocage que tu viens d'envoyer"
          className="mx-auto w-full max-w-lg"
        />
      </div>

      {/* Le signal : cinq points qui s'allument l'un après l'autre, du téléphone vers le maillot. */}
      <div aria-hidden="true" className="hidden flex-row-reverse items-center gap-3 lg:flex">
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            style={{ animationDelay: `${i * 0.16}s` }}
            className={`h-2 w-2 rounded-full ${etape === "envoi" ? "signal bg-accent" : "bg-trait"}`}
          />
        ))}
      </div>

      {/* Le téléphone. */}
      <div className="mx-auto w-[20rem] rounded-[2.75rem] border border-trait bg-surface p-3 shadow-[0_0_80px_-20px_rgba(255,58,38,0.35)]">
        <div className="relative overflow-hidden rounded-[2.1rem] bg-black px-5 pt-5 pb-6">
          <div className="libelle flex items-center justify-between text-[0.65rem] text-encre-2">
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Floq connecté
            </span>
            <span>Batterie 82 %</span>
          </div>

          <form onSubmit={valider} className="mt-6">
            <label className="block">
              <span className="libelle text-[0.65rem] text-encre-2">Nom</span>
              <input
                type="text"
                value={nom}
                maxLength={12}
                autoComplete="off"
                spellCheck={false}
                // Au clic, tout le texte est sélectionné : on tape directement son nom par-dessus.
                onFocus={(e) => e.target.select()}
                onChange={(e) => setNom(e.target.value.toUpperCase())}
                className="mt-1 w-full rounded-xl border border-trait bg-transparent px-3 py-1 font-flocage text-5xl uppercase outline-none focus:border-accent"
              />
            </label>

            <div className="mt-4">
              <label className="block">
                <span className="libelle block text-[0.65rem] text-encre-2">Numéro</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={numero}
                  maxLength={2}
                  autoComplete="off"
                  // On ne garde que les chiffres.
                  onChange={(e) => setNumero(e.target.value.replace(/\D/g, ""))}
                  className="mt-1 w-24 rounded-xl border border-trait bg-transparent px-3 py-1 font-flocage text-5xl outline-none focus:border-accent"
                />
              </label>
            </div>

            <p className="libelle mt-5 text-[0.65rem] text-encre-2">Mes joueurs</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {exemples.map((exemple) => (
                <button
                  key={exemple.nom}
                  type="button"
                  onClick={() => envoyer(exemple)}
                  className="cursor-pointer rounded-full border border-trait px-2.5 py-1 font-flocage text-base tracking-wide transition-colors hover:border-accent hover:text-accent"
                >
                  {exemple.nom} {exemple.numero}
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={etape !== "saisie"}
              className="mt-6 w-full cursor-pointer rounded-full bg-accent py-3 font-flocage text-2xl tracking-wide text-black uppercase transition-colors hover:bg-encre disabled:cursor-default disabled:opacity-60"
            >
              {etape === "envoi" ? "Envoi…" : "Envoyer"}
            </button>
          </form>

          {/* L'écran de confirmation recouvre l'application pendant deux secondes. */}
          <div
            role="status"
            className={`absolute inset-0 flex flex-col items-center justify-center gap-5 bg-black text-center transition-opacity duration-300 ${
              etape === "confirme" ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            {etape === "confirme" && (
              <>
                <svg viewBox="0 0 48 48" className="h-20 w-20" aria-hidden="true">
                  <circle cx="24" cy="24" r="21" fill="none" stroke="currentColor" strokeWidth="2.5" />
                  <path d="M15 25l6 6 12-13" fill="none" stroke="currentColor" strokeWidth="2.5" />
                </svg>
                <p className="font-flocage text-4xl leading-none uppercase">
                  Maillot
                  <br />
                  mis à jour
                </p>
                <p className="libelle text-[0.65rem] text-encre-2">
                  {affiche.nom} · {affiche.numero}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
