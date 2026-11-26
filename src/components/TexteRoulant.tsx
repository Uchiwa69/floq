// Un texte qui "roule" au survol du lien ou du bouton qui le contient :
// la première copie sort par le haut, la seconde entre par le bas.
// Tout est en CSS (classe .roule dans globals.css), sans JavaScript.
export function TexteRoulant({ children }: { children: string }) {
  return (
    <span className="roule">
      <span>{children}</span>
      {/* La copie est cachée aux lecteurs d'écran, pour ne pas lire le texte deux fois. */}
      <span aria-hidden="true">{children}</span>
    </span>
  );
}
