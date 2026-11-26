import { AppelAction } from "@/components/AppelAction";
import { ChampPixels } from "@/components/ChampPixels";
import { Defile } from "@/components/Defile";
import { HeroMaillot } from "@/components/HeroMaillot";
import { Lettres } from "@/components/Lettres";

// Section 1 : le hero. Le titre vend le bénéfice, pas la technologie.
export function Hero() {
  return (
    <section id="hero" aria-labelledby="titre-hero" className="relative flex min-h-[100svh] flex-col overflow-hidden pt-20 sm:pt-24">
      {/* Le fond : des points d'encre qui réagissent à la souris. */}
      <ChampPixels />

      <div className="cadre relative grid flex-1 items-center gap-8 pb-8 sm:gap-10 sm:pb-10 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <p className="libelle flex items-center gap-3 text-encre-2">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-accent" />
            Le maillot au flocage électronique
          </p>

          {/* Le seul <h1> de la page. */}
          {/* aria-label donne le titre d'un bloc aux lecteurs d'écran, puisqu'il est découpé en lettres. */}
          <h1
            id="titre-hero"
            aria-label="Un seul maillot. Tous tes joueurs."
            className="mt-6 text-[clamp(2.35rem,9vw,7.5rem)] leading-[0.92] font-medium tracking-[-0.035em] sm:mt-8 sm:text-[clamp(3.25rem,7.6vw,7.5rem)]"
          >
            <span aria-hidden="true">
              <Lettres texte="Un seul maillot." />
              <br />
              <em className="font-serif font-normal tracking-[-0.02em] text-accent">
                <Lettres texte="Tous tes joueurs." depart={14} />
              </em>
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed sm:mt-8 sm:text-xl text-encre-2">
            Le dos du Floq est un écran d&apos;encre électronique. Tu changes le nom et le numéro depuis ton
            téléphone, en dix secondes, autant de fois que tu veux.
          </p>

          <AppelAction className="mt-8 sm:mt-10" />
        </div>

        {/* Le maillot en 3D : il suit la souris, et on peut le faire tourner en le tirant.
            La photo a beaucoup de marge noire, d'où l'agrandissement. */}
        <div className="mx-auto w-full max-w-[20rem] sm:max-w-[26rem] lg:max-w-none lg:scale-125">
          <HeroMaillot />
        </div>
      </div>

      <div className="relative bg-fond">
        <Defile />
      </div>
    </section>
  );
}
