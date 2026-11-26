import { Apparition } from "@/components/Apparition";
import { ImageOndulante } from "@/components/ImageOndulante";
import { Manifeste } from "@/components/Manifeste";
import { TitreSection } from "@/components/TitreSection";
import { histoire } from "@/data/contenu";
import fondateur from "@/images/fondateur.webp";

// Section 3 : l'histoire. D'où vient le produit, et pourquoi on peut y croire.
export function Histoire() {
  return (
    <section id="histoire" aria-labelledby="titre-histoire" className="border-t border-trait">
      <Manifeste texte={histoire.citation} auteur={histoire.auteur} />

      <div className="cadre grid items-center gap-14 pb-32 lg:grid-cols-[1.1fr_0.9fr]">
        <Apparition>
          <ImageOndulante
            src={fondateur}
            alt="Yanis à son établi, en train de souder un panneau d'encre électronique sur un maillot noir"
            sizes="(min-width: 1024px) 52vw, 95vw"
            className="aspect-[3/2] w-full rounded-[2rem]"
          />
        </Apparition>

        <Apparition delai={120}>
          <TitreSection id="titre-histoire" numero="03" libelle="L'histoire">
            Né dans <em className="font-serif font-normal">un garage,</em> pas dans une usine.
          </TitreSection>
          <div className="mt-8 space-y-5 text-lg leading-relaxed text-encre-2">
            {histoire.paragraphes.map((paragraphe) => (
              <p key={paragraphe}>{paragraphe}</p>
            ))}
          </div>
        </Apparition>
      </div>
    </section>
  );
}
