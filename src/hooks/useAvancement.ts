"use client";

import { useEffect, useState, type RefObject } from "react";

// Renvoie un nombre entre 0 et 1 : où en est le défilement à l'intérieur d'un bloc
// plus haut que l'écran. 0 quand son haut touche le haut de l'écran, 1 quand son bas
// touche le bas. C'est ce nombre qui pilote les animations "épinglées".
export function useAvancement(ref: RefObject<HTMLElement | null>) {
  const [avancement, setAvancement] = useState(0);

  useEffect(() => {
    let image = 0;

    const mesurer = () => {
      image = 0;
      const element = ref.current;
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const course = rect.height - window.innerHeight;
      const valeur = course > 0 ? Math.min(1, Math.max(0, -rect.top / course)) : 0;
      // Arrondi à 3 décimales : inutile de redessiner pour un millième de pixel.
      setAvancement(Math.round(valeur * 1000) / 1000);
    };

    // requestAnimationFrame : au plus un calcul par image affichée, même si le
    // navigateur envoie des dizaines d'événements de défilement.
    const demander = () => {
      if (!image) image = requestAnimationFrame(mesurer);
    };

    demander();
    window.addEventListener("scroll", demander, { passive: true });
    window.addEventListener("resize", demander);
    return () => {
      cancelAnimationFrame(image);
      window.removeEventListener("scroll", demander);
      window.removeEventListener("resize", demander);
    };
  }, [ref]);

  return avancement;
}

// Deux petits outils de calcul pour les animations.

// Ramène "valeur" entre 0 et 1 sur l'intervalle [debut, fin], avec un départ et une arrivée en douceur.
export function etape(valeur: number, debut: number, fin: number) {
  const t = Math.min(1, Math.max(0, (valeur - debut) / (fin - debut)));
  return t * t * (3 - 2 * t);
}

// Valeur intermédiaire entre a et b (t = 0 donne a, t = 1 donne b).
export function entre(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
