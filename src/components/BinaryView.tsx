import Term from './Term';
import type { TermId } from '../i18n';

export interface BinaryRow {
  /** Identifiant de glossaire de l'intitulé de ligne. */
  term: TermId;
  /** Intitulé court propre à cette vue (« Masque », « Réseau »…). */
  label: string;
  /** Suite de « 0 » et de « 1 », de longueur 32 (IPv4) ou 128 (IPv6). */
  bits: string;
  /** Même valeur en notation usuelle, affichée en bout de ligne. */
  text: string;
}

/**
 * Les bits d'une adresse, colorés de part et d'autre de la frontière posée par
 * le préfixe. `groupSize` espace les groupes : 8 bits pour un octet IPv4,
 * 16 bits pour un groupe hexadécimal IPv6.
 */
export default function BinaryView({
  rows,
  prefix,
  groupSize,
  networkLabel,
  hostLabel,
}: {
  rows: BinaryRow[];
  prefix: number;
  groupSize: number;
  networkLabel: string;
  hostLabel: string;
}) {
  const total = rows[0]?.bits.length ?? 0;

  return (
    <div className="binary">
      <div className="binary-scroll">
        <table className={'binary-table' + (total > 64 ? ' binary-dense' : '')}>
          <tbody>
            {rows.map((row) => (
              <tr key={row.term}>
                <th scope="row">
                  <Term id={row.term}>{row.label}</Term>
                </th>
                <td className="binary-bits">
                  {row.bits.split('').map((bit, i) => (
                    <span
                      key={i}
                      className={
                        'bit' +
                        (i < prefix ? ' bit-network' : ' bit-host') +
                        (i > 0 && i % groupSize === 0 ? ' bit-octet' : '')
                      }
                    >
                      {bit}
                    </span>
                  ))}
                </td>
                <td className="binary-dotted">{row.text}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="binary-legend">
        <span className="swatch swatch-network" /> {prefix} {networkLabel}
        <span className="swatch swatch-host" /> {total - prefix} {hostLabel}
      </p>
    </div>
  );
}

/** Découpe un entier en sa suite de bits, du poids fort au poids faible. */
export function bitsOf(value: bigint | number, width: number): string {
  const v = typeof value === 'bigint' ? value : BigInt(value >>> 0);
  return v.toString(2).padStart(width, '0');
}
