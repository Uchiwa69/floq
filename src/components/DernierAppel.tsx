import Image from "next/image";
import { AppelAction } from "@/components/AppelAction";
import { site } from "@/data/contenu";
import terrain from "@/images/terrain.webp";

// Le dernier appel à commander. Il est fixé au fond de l'écran, derrière toute la page :
// en arrivant en bas, le contenu se soulève comme un rideau et le découvre.
export function DernierAppel() {
  return (
    <div className="fixed inset-0 z-0 flex flex-col">
      <Image
        src={terrain}
        alt="Un joueur amateur vu de dos au bord d'un terrain, la nuit, avec un maillot Floq floqué Rayan numéro 10"
        sizes="100vw"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Un dégradé sombre pour que le texte reste lisible sur la photo :
          plus couvrant sur mobile, où le texte occupe toute la largeur. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40 sm:bg-gradient-to-r sm:from-black sm:via-black/70 sm:to-transparent"
      />

      <div className="cadre relative flex flex-1 items-center pt-16 sm:pt-20">
        <div>
          <p className="max-w-3xl text-[clamp(2rem,5.4vw,5rem)] leading-[1] font-medium tracking-tight text-balance">
            Le prochain nom dans ton dos,{" "}
            <em className="font-serif font-normal text-accent">c&apos;est toi qui le choisis.</em>
          </p>
          <AppelAction className="mt-8 sm:mt-10" />
        </div>
      </div>

      <footer className="relative border-t border-trait py-6">
        <div className="cadre libelle text-encre-2">
          <p>© 2026 {site.nom}</p>
        </div>
      </footer>
    </div>
  );
}
