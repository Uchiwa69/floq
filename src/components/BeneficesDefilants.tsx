"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { benefices } from "@/data/contenu";
import { useAvancement } from "@/hooks/useAvancement";
import appListe from "@/images/app-liste.webp";
import appSaisie from "@/images/app-saisie.webp";
import appValide from "@/images/app-valide.webp";
import application from "@/images/application.webp";
import moduleAmovible from "@/images/module.webp";
import vestiaire from "@/images/vestiaire.webp";

// Une image par bénéfice, dans le même ordre que dans contenu.ts.
const images = [
  { src: vestiaire, alt: "Sept maillots Floq suspendus dans un vestiaire, chacun avec un numéro différent" },
  { src: application, alt: "Téléphone affichant l'application Floq devant le maillot qui porte le même nom" },
  { src: moduleAmovible, alt: "Une main déclipse le petit module noir du bas du maillot" },
];

// Les trois écrans de l'application, montrés à tour de rôle dans le deuxième bénéfice.
const ecrans = [
  { src: appSaisie, alt: "Écran de l'application Floq : saisie du nom Rayan et du numéro 10, bouton Envoyer" },
  { src: appListe, alt: "Écran de l'application Floq : la liste des joueurs enregistrés" },
  { src: appValide, alt: "Écran de l'application Floq : confirmation, maillot mis à jour" },
];

// Les trois bénéfices, dans une galerie qui avance de côté pendant qu'on défile vers le bas.
export function BeneficesDefilants() {
  const ref = useRef<HTMLDivElement>(null);
  const piste = useRef<HTMLOListElement>(null);
  const avancement = useAvancement(ref);
  // La distance à parcourir : la largeur de la piste, moins ce qui tient déjà à l'écran.
  const [course, setCourse] = useState(0);

  useEffect(() => {
    const element = piste.current;
    if (!element) return;
    // Le ResizeObserver refait la mesure si la fenêtre ou les cartes changent de taille.
    const observateur = new ResizeObserver(() => {
      setCourse(Math.max(0, element.scrollWidth - window.innerWidth));
    });
    observateur.observe(element);
    return () => observateur.disconnect();
  }, []);

  const actif = Math.min(benefices.length - 1, Math.floor(avancement * benefices.length));

  return (
    <div ref={ref} className="relative h-[300vh]">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="cadre flex items-center justify-between">
          <p className="libelle text-accent">Trois raisons de l&apos;adopter</p>
          <p className="libelle text-encre-2" aria-hidden="true">
            {String(actif + 1).padStart(2, "0")} / {String(benefices.length).padStart(2, "0")}
          </p>
        </div>

        {/* La piste : ses marges reprennent celles de la classe "cadre". */}
        <ol
          ref={piste}
          className="mt-10 flex w-max gap-10 px-[max(1.5rem,calc((100vw-84rem)/2+5.5rem))] will-change-transform"
          style={{ transform: `translateX(${-course * avancement}px)` }}
        >
          {benefices.map((benefice, i) => (
            <li key={benefice.titre} className="grid w-[min(82vw,64rem)] items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
              {i === 1 ? (
                // Le deuxième bénéfice montre l'application : trois écrans qui se succèdent dans un téléphone.
                <div className="flex aspect-[4/3] items-center justify-center rounded-[2rem] bg-surface">
                  <div className="relative h-[88%] rounded-[1.75rem] border border-trait bg-black p-2">
                    <div className="relative aspect-[768/1376] h-full overflow-hidden rounded-[1.25rem]">
                      {ecrans.map((ecran, rang) => (
                        <Image
                          key={ecran.alt}
                          src={ecran.src}
                          alt={ecran.alt}
                          sizes="16rem"
                          style={{ animationDelay: `${rang * 2.5}s` }}
                          className="ecran absolute inset-0 h-full w-full object-cover"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="overflow-hidden rounded-[2rem]">
                  <Image
                    src={images[i].src}
                    alt={images[i].alt}
                    sizes="(min-width: 1024px) 36rem, 82vw"
                    className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
              )}
              <div>
                <p className="font-flocage text-[7rem] leading-none text-accent" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-4 text-4xl font-medium tracking-tight text-balance">{benefice.titre}</h3>
                <p className="mt-5 text-xl leading-relaxed text-encre-2">{benefice.texte}</p>
              </div>
            </li>
          ))}
        </ol>

        {/* Barre de progression de la galerie. */}
        <div className="cadre mt-12">
          <div aria-hidden="true" className="h-px w-full bg-trait">
            <div className="h-px origin-left bg-accent" style={{ transform: `scaleX(${avancement})` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
