import Image from "next/image";
import { Apparition } from "@/components/Apparition";
import { BoutonOffre } from "@/components/BoutonOffre";
import { Inclinaison } from "@/components/Inclinaison";
import { TitreSection } from "@/components/TitreSection";
import { offres, site } from "@/data/contenu";
import coffret from "@/images/coffret.webp";
import maillotFace from "@/images/maillot-face.webp";
import vestiaire from "@/images/vestiaire.webp";

// Une image par offre, repérée par l'identifiant de l'offre.
const imagesOffres: Record<string, { src: typeof coffret; alt: string }> = {
  solo: { src: maillotFace, alt: "Le maillot Floq noir vu de face" },
  duo: { src: coffret, alt: "Coffret Floq ouvert : le maillot plié, le module et le câble USB-C" },
  equipe: { src: vestiaire, alt: "Sept maillots Floq numérotés, suspendus dans un vestiaire" },
};

// Section 5 : les tarifs. Trois offres, une seule mise en avant, aucun faux prix barré.
export function Tarifs() {
  return (
    <section id="tarifs" aria-labelledby="titre-tarifs" className="border-t border-trait py-32">
      <div className="cadre">
        <Apparition>
          <TitreSection id="titre-tarifs" numero="05" libelle="Les tarifs">
            Tu paies le maillot. <em className="font-serif font-normal">Les flocages sont offerts, à vie.</em>
          </TitreSection>
        </Apparition>

        <ul className="mt-16 grid items-stretch gap-6 lg:grid-cols-3">
          {offres.map((offre, i) => (
            <li key={offre.id} className="flex">
              <Apparition delai={i * 120} className="flex w-full">
                {/* La carte penche légèrement en 3D sous la souris. */}
                <Inclinaison angle={4} className="flex w-full">
                <article
                  className={`group relative flex w-full flex-col overflow-hidden rounded-[2rem] border bg-surface ${
                    offre.miseEnAvant ? "border-accent" : "border-trait"
                  }`}
                >
                  {/* Le halo n'apparaît qu'au survol de la carte. */}
                  <div
                    aria-hidden="true"
                    className="halo pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  />
                  <div className="relative">
                    <Image
                      src={imagesOffres[offre.id].src}
                      alt={imagesOffres[offre.id].alt}
                      sizes="(min-width: 1024px) 30vw, 95vw"
                      className="aspect-[16/10] w-full object-cover object-[50%_22%]"
                    />
                    {offre.miseEnAvant && (
                      <p className="libelle absolute top-4 left-4 rounded-full bg-accent px-4 py-1.5 text-black">
                        Notre conseil
                      </p>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-8">
                    <h3 className="text-2xl font-medium tracking-tight">{offre.nom}</h3>
                    <p className="mt-1 text-encre-2">{offre.pour}</p>

                    <p className="mt-8 text-6xl font-medium tracking-tight">
                      {offre.prix} <span className="text-3xl">€</span>
                    </p>
                    <p className="libelle mt-3 text-encre-2">{offre.detailPrix}</p>

                    <ul className="mt-8 flex-1 space-y-3 border-t border-trait pt-8">
                      {offre.inclus.map((ligne) => (
                        <li key={ligne} className="flex gap-3 text-encre-2">
                          <span aria-hidden="true" className="text-accent">
                            +
                          </span>
                          {ligne}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-10">
                      <BoutonOffre offre={offre.nom} prix={offre.prix} miseEnAvant={offre.miseEnAvant} />
                    </div>
                  </div>
                </article>
                </Inclinaison>
              </Apparition>
            </li>
          ))}
        </ul>

        <p className="libelle mt-8 text-center text-encre-2">{site.reassurance}</p>
      </div>
    </section>
  );
}
