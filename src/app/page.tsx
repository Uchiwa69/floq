import { Chargement } from "@/components/Chargement";
import { Curseur } from "@/components/Curseur";
import { DefilementDoux } from "@/components/DefilementDoux";
import { DernierAppel } from "@/components/DernierAppel";
import { Navigation } from "@/components/Navigation";
import { Avis } from "@/components/sections/Avis";
import { Hero } from "@/components/sections/Hero";
import { Histoire } from "@/components/sections/Histoire";
import { Probleme } from "@/components/sections/Probleme";
import { Questions } from "@/components/sections/Questions";
import { Solution } from "@/components/sections/Solution";
import { Tarifs } from "@/components/sections/Tarifs";
import { offres, site } from "@/data/contenu";

// Données structurées JSON-LD : elles décrivent le produit aux moteurs de recherche.
// Pas de note moyenne (aggregateRating) : les avis de la page sont fictifs.
const prix = offres.map((offre) => offre.prix);

const donneesStructurees = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Maillot Floq",
  description: site.description,
  image: `${site.url}/opengraph-image.jpg`,
  brand: { "@type": "Brand", name: site.nom },
  category: "Maillot de football",
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "EUR",
    lowPrice: Math.min(...prix),
    highPrice: Math.max(...prix),
    offerCount: offres.length,
    availability: "https://schema.org/PreOrder",
    url: `${site.url}/#tarifs`,
  },
};

// La page : les sept sections, dans l'ordre, une par composant.
export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(donneesStructurees).replace(/</g, "\\u003c") }}
      />

      <Chargement />
      {/* Grain de pellicule sur toute la page (classe .grain dans globals.css). */}
      <div className="grain" aria-hidden="true" />
      <DefilementDoux />
      <Curseur />
      <Navigation />

      <main>
        {/* Ce bloc opaque passe par-dessus le dernier appel, fixé derrière lui.
            Sa marge du bas (100vh) laisse la place de le découvrir en fin de page. */}
        <div className="relative z-10 mb-[100vh] rounded-b-[3rem] bg-fond">
          <Hero />
          <Probleme />
          <Histoire />
          <Solution />
          <Tarifs />
          <Avis />
          <Questions />
        </div>

        <DernierAppel />
      </main>
    </>
  );
}
