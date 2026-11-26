import { Apparition } from "@/components/Apparition";
import { ImageOndulante } from "@/components/ImageOndulante";
import { TitreSection } from "@/components/TitreSection";
import { constats } from "@/data/contenu";
import tiroir from "@/images/tiroir.webp";

// Section 2 : le problème que le client connaît déjà.
export function Probleme() {
  return (
    <section id="probleme" aria-labelledby="titre-probleme" className="border-t border-trait py-16 sm:py-24 lg:py-32">
      <div className="cadre">
        <div className="grid items-end gap-8 sm:gap-12 lg:grid-cols-[1.25fr_0.75fr]">
          <Apparition>
            <TitreSection id="titre-probleme" numero="02" libelle="Le problème">
              Ton joueur est parti.
              <br />
              <em className="font-serif font-normal">Son nom est resté.</em>
            </TitreSection>
          </Apparition>

          <Apparition delai={120}>
            <p className="max-w-lg text-base leading-relaxed sm:text-xl text-encre-2">
              Un flocage classique se pose une fois, au fer, et pour toujours. Le joueur change de club, tu changes
              de poste, le petit frère récupère le maillot : le nom, lui, ne bouge pas.
            </p>
          </Apparition>
        </div>

        <Apparition className="mt-10 sm:mt-16">
          <ImageOndulante
            src={tiroir}
            alt="Tiroir rempli de vieux maillots de foot aux flocages craquelés"
            sizes="(min-width: 1280px) 1170px, 95vw"
            className="aspect-[4/3] w-full rounded-2xl sm:aspect-[16/8] sm:rounded-[2rem]"
          />
        </Apparition>

        {/* Trois constats chiffrés, séparés par de fins traits. */}
        <dl className="mt-10 grid sm:mt-16 border-t border-trait md:grid-cols-3">
          {constats.map((constat, i) => (
            <Apparition key={constat.chiffre} delai={i * 100}>
              <div className="border-b border-trait py-6 sm:py-8 md:border-b-0 md:pr-8">
                <dt className="text-4xl font-medium sm:text-5xl lg:text-6xl tracking-tight">{constat.chiffre}</dt>
                <dd className="mt-2 max-w-xs sm:mt-3 text-encre-2">{constat.texte}</dd>
              </div>
            </Apparition>
          ))}
        </dl>
      </div>
    </section>
  );
}
