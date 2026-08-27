import type { ReactNode } from 'react';
import Term from './Term';
import type { TermId } from '../i18n';

export interface Cell {
  /** Identifiant de glossaire : il porte à la fois le libellé et sa définition. */
  term: TermId;
  value: ReactNode;
}

/** Grille clé / valeur dont chaque intitulé ouvre son explication. */
export default function ResultGrid({ cells }: { cells: Cell[] }) {
  return (
    <dl className="grid">
      {cells.map((cell) => (
        <div className="grid-cell" key={cell.term}>
          <dt>
            <Term id={cell.term} />
          </dt>
          <dd className="mono">{cell.value}</dd>
        </div>
      ))}
    </dl>
  );
}
