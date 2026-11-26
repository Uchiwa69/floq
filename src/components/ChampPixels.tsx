"use client";

import { useEffect, useRef } from "react";

const PAS = 16; // distance entre deux points, en pixels
const RAYON = 150; // rayon d'action de la souris, en pixels

// Le fond du hero : une grille de points d'encre qui s'allument sous la souris
// puis s'éteignent par paliers, comme les pixels d'un écran e-ink.
export function ChampPixels() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const toile = ref.current;
    const contexte = toile?.getContext("2d");
    if (!toile || !contexte) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let colonnes = 0;
    let lignes = 0;
    let encre = new Float32Array(0); // une valeur entre 0 et 1 par point
    let souris = { x: -9999, y: -9999 };
    let image = 0;
    let visible = true;

    const dimensionner = () => {
      const rect = toile.getBoundingClientRect();
      toile.width = rect.width;
      toile.height = rect.height;
      colonnes = Math.ceil(rect.width / PAS);
      lignes = Math.ceil(rect.height / PAS);
      encre = new Float32Array(colonnes * lignes);
    };

    const dessiner = () => {
      image = requestAnimationFrame(dessiner);
      if (!visible) return;

      contexte.clearRect(0, 0, toile.width, toile.height);

      for (let ligne = 0; ligne < lignes; ligne++) {
        for (let colonne = 0; colonne < colonnes; colonne++) {
          const i = ligne * colonnes + colonne;
          const x = colonne * PAS + PAS / 2;
          const y = ligne * PAS + PAS / 2;

          // Plus le point est près de la souris, plus il se charge en encre.
          const distance = Math.hypot(x - souris.x, y - souris.y);
          if (distance < RAYON) encre[i] = Math.max(encre[i], 1 - distance / RAYON);

          // De temps en temps, un point s'allume tout seul.
          if (Math.random() < 0.00025) encre[i] = 0.7;

          if (encre[i] > 0.02) {
            // Quatre niveaux de gris seulement, comme un vrai écran e-ink.
            const niveau = Math.ceil(encre[i] * 4) / 4;
            const taille = 2 + niveau * 3;
            contexte.fillStyle = `rgba(242, 238, 231, ${niveau * 0.5})`;
            contexte.fillRect(x - taille / 2, y - taille / 2, taille, taille);
            encre[i] *= 0.955; // l'encre s'efface peu à peu
          }
        }
      }
    };

    const suivre = (event: PointerEvent) => {
      // Au toucher, le doigt sert à défiler : on n'allume pas les points sous lui.
      if (event.pointerType === "touch") return;
      const rect = toile.getBoundingClientRect();
      souris = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };

    // On arrête de dessiner quand le hero n'est plus à l'écran.
    const observateur = new IntersectionObserver(([entree]) => {
      visible = entree.isIntersecting;
    });
    // La toile peut changer de taille sans que la fenêtre bouge (hauteur du hero, barre d'adresse mobile...).
    const redimension = new ResizeObserver(dimensionner);

    dimensionner();
    observateur.observe(toile);
    redimension.observe(toile);
    window.addEventListener("resize", dimensionner);
    window.addEventListener("pointermove", suivre);
    image = requestAnimationFrame(dessiner);

    return () => {
      cancelAnimationFrame(image);
      observateur.disconnect();
      redimension.disconnect();
      window.removeEventListener("resize", dimensionner);
      window.removeEventListener("pointermove", suivre);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />;
}
