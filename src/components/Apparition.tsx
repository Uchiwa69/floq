"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  // Retard en millisecondes, pour faire arriver plusieurs blocs l'un après l'autre.
  delai?: number;
  className?: string;
};

// Fait apparaître son contenu en douceur quand il entre dans l'écran.
// L'animation elle-même est en CSS (classe .apparition dans globals.css).
export function Apparition({ children, delai = 0, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // L'IntersectionObserver prévient quand l'élément entre dans la fenêtre.
    const observateur = new IntersectionObserver(
      ([entree]) => {
        if (entree.isIntersecting) {
          setVisible(true);
          observateur.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    observateur.observe(element);
    return () => observateur.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delai}ms` }}
      className={`apparition ${visible ? "est-visible" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
