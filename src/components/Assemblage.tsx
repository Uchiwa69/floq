"use client";

import Image from "next/image";
import { useRef } from "react";
import { couches } from "@/data/contenu";
import { entre, etape, useAvancement } from "@/hooks/useAvancement";
import coucheCircuit from "@/images/couche-circuit.webp";
import coucheMaillot from "@/images/couche-maillot.webp";
import coucheModule from "@/images/couche-module.webp";
import couchePanneau from "@/images/couche-panneau.webp";

// Où se trouve chaque pièce quand elle est "éclatée" (depart) et quand elle est
// "montée" dans le maillot (arrivee). x et y sont en % de l'image, e est l'échelle.
// Ces valeurs ont été réglées à l'œil sur les quatre photos.
const trajets = {
  circuit: { depart: { x: 25, y: 0, e: 0.85 }, arrivee: { x: -15.1, y: -11.3, e: 0.56 } },
  panneau: { depart: { x: 4, y: 0, e: 0.85 }, arrivee: { x: -15.3, y: -11.7, e: 0.57 } },
  module: { depart: { x: 9.5, y: 29, e: 0.4 }, arrivee: { x: -33, y: 34, e: 0.09 } },
};

// Sur sa photo, le module n'est pas au centre : on indique où il se trouve (en % de l'image)
// pour qu'il rétrécisse sur lui-même au lieu de glisser vers le milieu.
const centreModule = "70.5% 50.8%";

type Trajet = (typeof trajets)[keyof typeof trajets];

// Calcule la position d'une pièce pour un avancement t entre 0 et 1.
function placer(trajet: Trajet, t: number) {
  const x = entre(trajet.depart.x, trajet.arrivee.x, t);
  const y = entre(trajet.depart.y, trajet.arrivee.y, t);
  const e = entre(trajet.depart.e, trajet.arrivee.e, t);
  return `translate(${x}%, ${y}%) scale(${e})`;
}

// La vue éclatée qui se monte toute seule pendant qu'on défile.
export function Assemblage() {
  const ref = useRef<HTMLDivElement>(null);
  const avancement = useAvancement(ref);

  // Chaque pièce a sa tranche du défilement : d'abord le circuit, puis le panneau, puis le module.
  const circuit = etape(avancement, 0.08, 0.38);
  const panneau = etape(avancement, 0.36, 0.66);
  const moduleAmovible = etape(avancement, 0.64, 0.9);

  // La couche dont on parle en ce moment (0 = le tissu, 3 = le module).
  const actif = avancement < 0.08 ? 0 : avancement < 0.36 ? 1 : avancement < 0.64 ? 2 : 3;
  const termine = avancement > 0.92;

  // mix-blend-lighten : le fond noir de chaque photo disparaît, seules les pièces restent visibles.
  const calque = "absolute inset-0 h-full w-full mix-blend-lighten will-change-transform";

  return (
    <div ref={ref} className="relative h-[230vh] lg:h-[300vh]">
      {/* pt-16 / sm:pt-20 : on laisse la place à l'en-tête fixe sous lg. */}
      <div className="sticky top-0 flex h-[100dvh] flex-col justify-center overflow-hidden pt-16 pb-4 sm:pt-20 lg:py-0">
        <div className="cadre">
          <div className="flex items-end justify-between gap-8">
            <div>
              <p className="libelle text-accent">Ce qu&apos;il y a dedans</p>
              <h3 className="mt-2 text-2xl font-medium tracking-tight sm:mt-3 sm:text-3xl lg:text-4xl">
                Quatre couches. <em className="font-serif font-normal">Un seul maillot.</em>
              </h3>
            </div>
            <p className="libelle hidden text-encre-2 md:block" aria-live="polite">
              {termine ? "Assemblé" : "Continue de défiler"}
            </p>
          </div>

          {/* isolate : les mélanges de calques restent à l'intérieur de ce cadre.
              On limite la largeur (déduite de la hauteur d'écran) plutôt que la hauteur :
              le cadre garde toujours son rapport 16/9, sur lequel les trajets en % sont réglés. */}
          <div className="relative isolate mx-auto mt-3 aspect-[16/9] w-full max-w-[min(64rem,calc(36dvh*16/9))] bg-fond sm:mt-4 sm:max-w-[min(64rem,calc(46dvh*16/9))] lg:max-w-[min(64rem,calc(60vh*16/9))]">
            <Image
              src={coucheMaillot}
              alt="Vue éclatée du maillot Floq : le tissu, le circuit flexible, le panneau d'encre électronique et le module viennent se monter les uns dans les autres"
              sizes="(min-width: 1024px) 64rem, 95vw"
              className="absolute inset-0 h-full w-full"
            />
            <Image
              src={coucheCircuit}
              alt=""
              sizes="(min-width: 1024px) 64rem, 95vw"
              className={calque}
              // Le circuit s'efface quand le panneau vient le recouvrir.
              style={{ transform: placer(trajets.circuit, circuit), opacity: 1 - etape(avancement, 0.56, 0.66) }}
            />
            <Image
              src={couchePanneau}
              alt=""
              sizes="(min-width: 1024px) 64rem, 95vw"
              className={calque}
              style={{ transform: placer(trajets.panneau, panneau) }}
            />
            <Image
              src={coucheModule}
              alt=""
              sizes="(min-width: 1024px) 64rem, 95vw"
              className={calque}
              style={{ transform: placer(trajets.module, moduleAmovible), transformOrigin: centreModule }}
            />
          </div>

          <ol className="grid grid-cols-2 gap-x-4 border-t border-trait lg:grid-cols-4 lg:gap-x-0">
            {couches.map((couche, i) => (
              <li
                key={couche.numero}
                className={`border-b border-trait py-2 transition-opacity duration-300 sm:py-4 lg:border-b-0 lg:pr-6 ${
                  i === actif || termine ? "opacity-100" : "opacity-40"
                }`}
              >
                <p className="libelle flex gap-2 sm:gap-3">
                  <span className="text-accent">{couche.numero}</span>
                  {couche.nom}
                </p>
                <p className="mt-1 text-xs text-encre-2 sm:mt-2 sm:text-sm">{couche.texte}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
