import Image from "next/image";
import maillotVide from "@/images/maillot-vide.webp";

type Props = {
  nom: string;
  numero: string;
  alt: string;
  // true pour l'image du hero : le navigateur la charge en priorité.
  prioritaire?: boolean;
  className?: string;
};

// Le maillot avec son panneau. La photo montre un panneau vide ;
// le nom et le numéro sont du vrai texte posé par-dessus, aux coordonnées du panneau.
export function MaillotEink({ nom, numero, alt, prioritaire = false, className = "" }: Props) {
  // Plus le nom est long, plus il est écrit petit, pour rester dans le panneau.
  const tailleNom = Math.min(7.5, 56 / Math.max(nom.length, 1));

  return (
    // @container : les tailles en "cqw" ci-dessous suivent la largeur du maillot.
    <div className={`@container relative ${className}`}>
      <Image
        src={maillotVide}
        alt={alt}
        preload={prioritaire}
        loading={prioritaire ? "eager" : "lazy"}
        sizes="(min-width: 1024px) 36vw, 90vw"
        className="h-auto w-full"
      />

      {/* Zone du panneau sur la photo, en pourcentage de l'image. */}
      <div
        aria-hidden="true"
        className="absolute top-[21.6%] left-[33.1%] flex h-[34%] w-[34%] flex-col items-center justify-center gap-[1.5cqw] font-flocage text-[#191817] mix-blend-multiply"
      >
        <span className="leading-none tracking-[0.04em] uppercase" style={{ fontSize: `${tailleNom}cqw` }}>
          {nom}
        </span>
        <span className="text-[23cqw] leading-[0.82]">{numero}</span>
      </div>

      {/* Le clignotement noir d'un écran e-ink. La "key" relance l'animation à chaque changement. */}
      <div
        key={`${nom}-${numero}`}
        aria-hidden="true"
        className="flash-eink absolute top-[21.6%] left-[33.1%] h-[34%] w-[34%] bg-[#191817]"
      />
    </div>
  );
}
