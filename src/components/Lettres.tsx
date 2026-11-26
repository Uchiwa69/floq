import type { CSSProperties } from "react";

type Props = {
  texte: string;
  // Rang de la première lettre : permet d'enchaîner deux lignes sans repartir de zéro.
  depart?: number;
};

// Découpe un texte en lettres qui montent l'une après l'autre (animation CSS .lettre).
// Chaque mot reste d'un seul bloc, pour ne jamais être coupé en fin de ligne.
export function Lettres({ texte, depart = 0 }: Props) {
  const mots = texte.split(" ");

  return (
    <>
      {mots.map((mot, i) => {
        // Nombre de lettres déjà écrites avant ce mot.
        const avant = depart + mots.slice(0, i).join("").length;

        return (
          <span key={i}>
            <span className="mot">
              {[...mot].map((lettre, j) => (
                // --i est le rang de la lettre : le CSS s'en sert pour décaler son départ.
                <span key={j} className="lettre" style={{ "--i": avant + j } as CSSProperties}>
                  {lettre}
                </span>
              ))}
            </span>{" "}
          </span>
        );
      })}
    </>
  );
}
