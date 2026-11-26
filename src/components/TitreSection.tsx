import type { ReactNode } from "react";

type Props = {
  id: string;
  numero: string;
  libelle: string;
  children: ReactNode;
  className?: string;
};

// L'en-tête commun à chaque section : "02 —— Le problème", puis le grand titre.
export function TitreSection({ id, numero, libelle, children, className = "" }: Props) {
  return (
    <div className={className}>
      <p className="libelle flex items-center gap-4 text-encre-2">
        <span className="text-accent">{numero}</span>
        <span aria-hidden="true" className="h-px w-10 bg-trait" />
        {libelle}
      </p>
      <h2 id={id} className="mt-8 text-[clamp(2.5rem,5.4vw,5rem)] leading-[1] font-medium tracking-tight text-balance">
        {children}
      </h2>
    </div>
  );
}
