import { Apparition } from "@/components/Apparition";
import { ImageOndulante } from "@/components/ImageOndulante";
import { TitreSection } from "@/components/TitreSection";
import { temoignages } from "@/data/contenu";
import supporters from "@/images/supporters.webp";

// Section 6 : les avis. Ils sont fictifs, et la page le dit de façon visible.
export function Avis() {
  return (
    <section id="avis" aria-labelledby="titre-avis" className="border-t border-trait py-32">
      <div className="cadre">
        <Apparition>
          <TitreSection id="titre-avis" numero="06" libelle="Les avis">
            Ils ont changé de nom. <em className="font-serif font-normal">Pas de maillot.</em>
          </TitreSection>
        </Apparition>

        <Apparition className="mt-16">
          <ImageOndulante
            src={supporters}
            alt="Un groupe de supporters vus de dos dans une tribune, trois d'entre eux portent un maillot Floq avec les numéros 7, 10 et 23"
            sizes="(min-width: 1280px) 1170px, 95vw"
            className="aspect-[16/7] w-full rounded-[2rem]"
            classeImage="object-[50%_40%]"
          />
        </Apparition>

        <p className="libelle mt-10 inline-block rounded-full border border-accent px-4 py-2 text-encre">
          Avis fictifs, rédigés pour ce projet d&apos;école
        </p>

        <ul className="mt-8 grid gap-6 lg:grid-cols-3">
          {temoignages.map((temoignage, i) => (
            <li key={temoignage.nom} className="flex">
              <Apparition delai={i * 120} className="flex w-full">
                <figure className="flex w-full flex-col rounded-[2rem] border border-trait bg-surface p-8">
                  <blockquote className="flex-1 text-xl leading-relaxed">« {temoignage.texte} »</blockquote>
                  <figcaption className="mt-8 flex items-center gap-4 border-t border-trait pt-6">
                    {/* Des initiales plutôt qu'un portrait : pas de faux visage. */}
                    <span
                      aria-hidden="true"
                      className="libelle flex h-11 w-11 items-center justify-center rounded-full bg-encre text-black"
                    >
                      {temoignage.initiales}
                    </span>
                    <span>
                      <span className="block font-medium">{temoignage.nom}</span>
                      <span className="libelle block text-encre-2">{temoignage.role}</span>
                    </span>
                  </figcaption>
                </figure>
              </Apparition>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
