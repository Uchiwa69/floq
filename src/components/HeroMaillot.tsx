"use client";

import { useEffect, useState } from "react";
import { flocages } from "@/data/contenu";
import { Maillot3D } from "./Maillot3D";

// Composant client : il a besoin d'un état (quel flocage est affiché) et d'un minuteur.
export function HeroMaillot() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Pas de défilement automatique si la personne a demandé moins d'animations.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const minuteur = setInterval(() => {
      setIndex((actuel) => (actuel + 1) % flocages.length);
    }, 2600);

    return () => clearInterval(minuteur);
  }, []);

  const flocage = flocages[index];

  return (
    <>
      <Maillot3D
        nom={flocage.nom}
        numero={flocage.numero}
        alt="Maillot Floq noir vu de dos : le nom et le numéro s'affichent sur un panneau d'encre électronique"
        prioritaire
      />
      <p className="libelle mt-2 hidden text-center text-encre-3 lg:block" aria-hidden="true">
        ← Tire pour le faire tourner →
      </p>
    </>
  );
}
