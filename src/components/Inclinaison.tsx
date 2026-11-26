"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  // Angle maximal, en degrés.
  angle?: number;
  // true : suit la souris dans toute la fenêtre. false : seulement au survol de l'élément.
  suitFenetre?: boolean;
  className?: string;
};

// Incline son contenu en 3D selon la position de la souris.
// On modifie directement le style de l'élément (sans état React) : c'est plus fluide.
export function Inclinaison({ children, angle = 8, suitFenetre = false, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    // Rien sur écran tactile, ni si la personne a demandé moins d'animations.
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const incliner = (event: PointerEvent) => {
      const zone = suitFenetre
        ? { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight }
        : element.getBoundingClientRect();
      // De -1 (bord gauche / haut) à 1 (bord droit / bas).
      const x = ((event.clientX - zone.left) / zone.width) * 2 - 1;
      const y = ((event.clientY - zone.top) / zone.height) * 2 - 1;
      element.style.transform = `perspective(1100px) rotateY(${x * angle}deg) rotateX(${-y * angle}deg)`;
      // Position de la souris dans l'élément, pour le halo lumineux (classe .halo).
      element.style.setProperty("--mx", `${event.clientX - zone.left}px`);
      element.style.setProperty("--my", `${event.clientY - zone.top}px`);
    };

    const redresser = () => {
      element.style.transform = "perspective(1100px) rotateY(0deg) rotateX(0deg)";
    };

    const cible: Window | HTMLElement = suitFenetre ? window : element;
    cible.addEventListener("pointermove", incliner as EventListener);
    element.addEventListener("pointerleave", redresser);
    return () => {
      cible.removeEventListener("pointermove", incliner as EventListener);
      element.removeEventListener("pointerleave", redresser);
    };
  }, [angle, suitFenetre]);

  return (
    <div ref={ref} className={`transition-transform duration-300 ease-out will-change-transform ${className}`}>
      {children}
    </div>
  );
}
