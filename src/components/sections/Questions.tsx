import { Apparition } from "@/components/Apparition";
import { TitreSection } from "@/components/TitreSection";
import { questions } from "@/data/contenu";

// Section 7 : les questions fréquentes. Le dernier appel à commander vient juste après,
// dans components/DernierAppel.tsx : il se découvre quand on arrive en bas de la page.
export function Questions() {
  return (
    <section id="questions" aria-labelledby="titre-questions" className="border-t border-trait py-32">
      <div className="cadre grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
        <Apparition>
          <TitreSection id="titre-questions" numero="07" libelle="Les questions">
            Ce qu&apos;on nous <em className="font-serif font-normal">demande</em> avant de commander.
          </TitreSection>
        </Apparition>

        <Apparition delai={120}>
          {/* <details> s'ouvre et se ferme sans JavaScript, et reste lisible par les moteurs de recherche. */}
          <div className="border-t border-trait">
            {questions.map((item) => (
              <details key={item.question} className="group border-b border-trait">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-xl font-medium [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <span
                    aria-hidden="true"
                    className="text-2xl font-normal text-accent transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="max-w-2xl pb-8 text-lg leading-relaxed text-encre-2">{item.reponse}</p>
              </details>
            ))}
          </div>
        </Apparition>
      </div>

      <p className="libelle mt-24 text-center text-encre-3" aria-hidden="true">
        Continue de défiler ↓
      </p>
    </section>
  );
}
