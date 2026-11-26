"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useId, useRef } from "react";

type Props = {
  src: StaticImageData;
  alt: string;
  sizes: string;
  // Classes du cadre (forme, arrondi) et de l'image (cadrage).
  className?: string;
  classeImage?: string;
};

// Une image qui ondule comme la surface de l'eau quand la souris passe dessus.
// L'effet vient d'un filtre SVG : un "bruit" (feTurbulence) sert de carte pour
// décaler les pixels de l'image (feDisplacementMap). On anime seulement la force du décalage.
export function ImageOndulante({ src, alt, sizes, className = "", classeImage = "" }: Props) {
  // Chaque image a son propre filtre, donc son propre identifiant.
  const id = `onde-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const cadre = useRef<HTMLDivElement>(null);
  const decalage = useRef<SVGFEDisplacementMapElement>(null);
  const bruit = useRef<SVGFETurbulenceElement>(null);

  useEffect(() => {
    const element = cadre.current;
    if (!element) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let force = 0;
    let cible = 0;
    let phase = 0;
    let image = 0;

    const animer = () => {
      force += (cible - force) * 0.06;
      phase += 0.012;
      decalage.current?.setAttribute("scale", force.toFixed(2));
      // Le bruit bouge lentement : les vagues se déplacent.
      bruit.current?.setAttribute(
        "baseFrequency",
        `${(0.009 + Math.sin(phase) * 0.002).toFixed(4)} ${(0.013 + Math.cos(phase) * 0.003).toFixed(4)}`,
      );

      // Une fois l'image redevenue calme, on arrête la boucle.
      if (cible === 0 && force < 0.2) {
        decalage.current?.setAttribute("scale", "0");
        image = 0;
        return;
      }
      image = requestAnimationFrame(animer);
    };

    const entrer = () => {
      cible = 34;
      if (!image) image = requestAnimationFrame(animer);
    };
    const sortir = () => {
      cible = 0;
    };

    element.addEventListener("pointerenter", entrer);
    element.addEventListener("pointerleave", sortir);
    return () => {
      cancelAnimationFrame(image);
      element.removeEventListener("pointerenter", entrer);
      element.removeEventListener("pointerleave", sortir);
    };
  }, []);

  return (
    <div ref={cadre} className={`overflow-hidden ${className}`}>
      <svg aria-hidden="true" className="absolute h-0 w-0">
        <filter id={id}>
          <feTurbulence ref={bruit} type="fractalNoise" baseFrequency="0.009 0.013" numOctaves="2" seed="4" result="bruit" />
          <feDisplacementMap ref={decalage} in="SourceGraphic" in2="bruit" scale="0" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      {/* L'image est un peu agrandie : les bords décalés par l'ondulation restent hors du cadre. */}
      <Image
        src={src}
        alt={alt}
        sizes={sizes}
        style={{ filter: `url(#${id})` }}
        className={`h-full w-full scale-[1.06] object-cover ${classeImage}`}
      />
    </div>
  );
}
