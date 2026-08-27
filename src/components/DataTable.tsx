import type { ReactNode } from 'react';
import Term from './Term';
import type { TermId } from '../i18n';

export interface Column<T> {
  /** Identifiant de glossaire de l'en-tête : il porte le libellé et sa définition. */
  term: TermId;
  render: (row: T) => ReactNode;
  numeric?: boolean;
  strong?: boolean;
}

export default function DataTable<T>({
  columns,
  rows,
  rowKey,
  caption,
}: {
  columns: Array<Column<T>>;
  rows: T[];
  rowKey: (row: T, index: number) => string;
  caption?: string;
}) {
  return (
    <div className="table-scroll">
      <table className="data-table">
        {caption ? <caption>{caption}</caption> : null}
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.term} scope="col">
                <Term id={c.term} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={rowKey(row, i)}>
              {columns.map((c) => (
                <td
                  key={c.term}
                  className={[c.numeric ? 'num' : 'mono', c.strong ? 'strong' : '']
                    .filter(Boolean)
                    .join(' ')}
                >
                  {c.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
