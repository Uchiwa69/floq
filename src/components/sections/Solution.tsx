import { Apparition } from "@/components/Apparition";
import { Assemblage } from "@/components/Assemblage";
import { BeneficesDefilants } from "@/components/BeneficesDefilants";
import { DemoFlocage } from "@/components/DemoFlocage";
import { Rotation } from "@/components/Rotation";
import { TitreSection } from "@/components/TitreSection";
import { mesures } from "@/data/contenu";

// Section 4 : la solution, en trois bénéfices au maximum.
export function Solution() {
  return (
    <section id="solution" aria-labelledby="titre-solution" className="border-t border-trait py-32">
      <div className="cadre">
        <div className="grid items-end gap-12 lg:grid-cols-[1.25fr_0.75fr]">
          <Apparition>
            <TitreSection id="titre-solution" numero="04" libelle="La solution">
              1 panneau. 0 fil.
              <br />
              <em className="font-serif font-normal text-accent">10 secondes.</em>
            </TitreSection>
          </Apparition>
          <Apparition delai={120}>
            <p className="max-w-lg text-xl leading-relaxed text-encre-2">
              Floq remplace le flocage par un écran d&apos;encre électronique souple, cousu dans le dos du maillot.
              Tu écris le nom dans l&apos;application, le maillot l&apos;affiche.
            </p>
          </Apparition>
        </div>

        {/* La démonstration : le visiteur essaie le produit sur la page. */}
        <Apparition className="mt-20 rounded-[2.5rem] border border-trait p-8 lg:p-14">
          <DemoFlocage />
        </Apparition>
      </div>

      {/* Trois animations pilotées par le défilement : les bénéfices passent de côté,
          le maillot tourne, puis il se monte pièce par pièce. */}
      <div className="mt-24 border-t border-trait">
        <BeneficesDefilants />
      </div>
      <div className="border-t border-trait">
        <Rotation />
      </div>
      <div className="border-t border-trait">
        <Assemblage />
      </div>

      {/* Les caractéristiques, en chiffres. */}
      <div className="cadre">
        <dl className="grid gap-y-10 border-t border-trait pt-10 sm:grid-cols-2 lg:grid-cols-4">
          {mesures.map((mesure, i) => (
            <Apparition key={mesure.valeur} delai={i * 80}>
              <dt className="text-5xl font-medium tracking-tight lg:text-6xl">{mesure.valeur}</dt>
              <dd className="mt-3 max-w-[14rem] text-encre-2">{mesure.texte}</dd>
            </Apparition>
          ))}
        </dl>
      </div>
    </section>
  );
}
