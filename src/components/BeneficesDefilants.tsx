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

// Le visuel d'un bénéfice. Le deuxième montre l'application : trois écrans qui se succèdent dans un téléphone.
function Visuel({ rang, tailles }: { rang: number; tailles: string }) {
  if (rang === 1) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-3xl bg-surface lg:rounded-[2rem]">
        <div className="relative h-[88%] rounded-[1.25rem] border border-trait bg-black p-1.5 sm:rounded-[1.75rem] sm:p-2">
          <div className="relative aspect-[768/1376] h-full overflow-hidden rounded-[0.9rem] sm:rounded-[1.25rem]">
            {ecrans.map((ecran, position) => (
              <Image
                key={ecran.alt}
                src={ecran.src}
                alt={ecran.alt}
                sizes="16rem"
                style={{ animationDelay: `${position * 2.5}s` }}
                className="ecran absolute inset-0 h-full w-full object-cover"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="overflow-hidden rounded-3xl lg:rounded-[2rem]">
      <Image
        src={images[rang].src}
        alt={images[rang].alt}
        sizes={tailles}
        className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-105"
      />
    </div>
  );
}

// Les trois bénéfices. Sur grand écran, une galerie qui avance de côté pendant qu'on défile vers le bas ;
// sur mobile et tablette, une simple pile verticale (rien n'est rogné, le défilement reste naturel).
export function BeneficesDefilants() {
  const ref = useRef<HTMLDivElement>(null);
  const piste = useRef<HTMLOListElement>(null);
  const avancement = useAvancement(ref);
  // La distance à parcourir : la largeur de la piste, moins ce qui tient déjà à l'écran.
  const [course, setCourse] = useState(0);

  useEffect(() => {
    const element = piste.current;
    if (!element) return;
    const mesurer = () => setCourse(Math.max(0, element.scrollWidth - window.innerWidth));
    // Le ResizeObserver refait la mesure si les cartes changent de taille ;
    // l'écoute de "resize" couvre les changements de largeur de fenêtre qui ne touchent pas la piste.
    const observateur = new ResizeObserver(mesurer);
    observateur.observe(element);
    window.addEventListener("resize", mesurer);
    mesurer();
    return () => {
      observateur.disconnect();
      window.removeEventListener("resize", mesurer);
    };
  }, []);

  const actif = Math.min(benefices.length - 1, Math.floor(avancement * benefices.length));

  return (
    <>
      {/* Mobile et tablette : la pile verticale. */}
      <div className="cadre py-16 sm:py-24 lg:hidden">
        <p className="libelle text-accent">Trois raisons de l&apos;adopter</p>
        <ol className="mt-8 grid gap-14 sm:mt-10 sm:gap-20">
          {benefices.map((benefice, i) => (
            <li key={benefice.titre} className="grid gap-6 sm:grid-cols-2 sm:items-center sm:gap-10">
              <Visuel rang={i} tailles="(min-width: 640px) 50vw, 92vw" />
              <div>
                <p className="font-flocage text-6xl leading-none text-accent sm:text-7xl" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 text-2xl font-medium tracking-tight text-balance sm:text-3xl">{benefice.titre}</h3>
                <p className="mt-4 text-lg leading-relaxed text-encre-2">{benefice.texte}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Grand écran : la galerie horizontale épinglée. */}
      <div ref={ref} className="relative hidden h-[300vh] lg:block">
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
              <li key={benefice.titre} className="grid w-[min(82vw,64rem)] grid-cols-[1.1fr_0.9fr] items-center gap-10">
                <Visuel rang={i} tailles="36rem" />
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
    </>
  );
}
