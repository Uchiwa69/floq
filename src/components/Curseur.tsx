"use client";

import { useEffect, useRef } from "react";

// Un anneau qui suit la souris avec un léger retard et grossit sur ce qui est cliquable.
// Le vrai curseur reste affiché : l'anneau est un plus, pas un remplacement.
export function Curseur() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const anneau = ref.current;
    if (!anneau) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cible = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const position = { ...cible };
    let echelle = 1;
    let echelleCible = 1;
    let image = 0;

    const suivre = (event: PointerEvent) => {
      cible.x = event.clientX;
      cible.y = event.clientY;
      anneau.style.opacity = "1";
      // closest() remonte les parents : est-on au-dessus d'un lien, d'un bouton, d'un champ ?
      const cliquable = (event.target as Element | null)?.closest?.("a, button, summary, input");
      echelleCible = cliquable ? 2.2 : 1;
    };

    const animer = () => {
      // On parcourt 18 % de la distance restante à chaque image : c'est ce qui crée le retard.
      position.x += (cible.x - position.x) * 0.18;
      position.y += (cible.y - position.y) * 0.18;
      echelle += (echelleCible - echelle) * 0.18;
      anneau.style.transform = `translate(${position.x}px, ${position.y}px) translate(-50%, -50%) scale(${echelle})`;
      image = requestAnimationFrame(animer);
    };

    window.addEventListener("pointermove", suivre);
    image = requestAnimationFrame(animer);
    return () => {
      cancelAnimationFrame(image);
      window.removeEventListener("pointermove", suivre);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[90] h-9 w-9 rounded-full border border-white opacity-0 mix-blend-difference"
    />
  );
}
