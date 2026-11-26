"use client";

import Lenis from "lenis";
import { useEffect } from "react";

// Rend le défilement de toute la page plus souple, avec un peu d'inertie.
// Lenis est une petite bibliothèque faite pour ça ; elle garde le vrai défilement
// du navigateur, donc les blocs "sticky" et les ancres continuent de fonctionner.
export function DefilementDoux() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      autoRaf: true, // Lenis gère sa propre boucle d'animation
      anchors: true, // les liens #tarifs, #hero... défilent en douceur aussi
      lerp: 0.1, // plus la valeur est petite, plus le défilement "glisse"
    });

    return () => lenis.destroy();
  }, []);

  return null;
}
