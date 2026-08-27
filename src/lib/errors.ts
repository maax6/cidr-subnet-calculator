/**
 * Erreurs des moteurs de calcul, portées par un code plutôt que par un texte.
 *
 * Les moteurs sont purs et sans locale : ils signalent *ce qui* ne va pas, et
 * l'interface choisit la langue au moment du rendu. `message` reste lisible
 * pour un développeur si une erreur remonte non interceptée.
 */

export type ErrorParams = Record<string, string | number>;

export type ErrorCode =
  /* Communs */
  | 'emptyInput'
  | 'leadingZero'
  | 'octetOutOfRange'
  | 'rangeReversed'
  | 'splitWiderThanBlock'
  /* IPv4 */
  | 'invalidIPv4'
  | 'prefixOutOfRange4'
  | 'nonContiguousMask'
  | 'missingMask'
  | 'invalidCidr4'
  | 'hostsNotInteger'
  | 'hostsTooLarge'
  /* IPv6 */
  | 'invalidEmbeddedIPv4'
  | 'ipv4MustEnd'
  | 'invalidGroup'
  | 'zoneIdUnsupported'
  | 'unexpectedPrefix'
  | 'doubleColonTwice'
  | 'emptyGroupAroundColon'
  | 'doubleColonNoZeros'
  | 'groupCountMismatch'
  | 'prefixOutOfRange6'
  | 'missingPrefix'
  | 'invalidPrefix6'
  | 'addressOutOfSpace'
  | 'invalidCidr6'
  | 'addressCountMin'
  | 'addressCountTooLarge';

function describe(code: ErrorCode, params: ErrorParams): string {
  const rest = Object.entries(params)
    .map(([k, v]) => `${k}=${v}`)
    .join(' ');
  return rest ? `${code} (${rest})` : code;
}

export class IPv4Error extends Error {
  constructor(
    readonly code: ErrorCode,
    readonly params: ErrorParams = {},
  ) {
    super(describe(code, params));
    this.name = 'IPv4Error';
  }
}

export class IPv6Error extends Error {
  constructor(
    readonly code: ErrorCode,
    readonly params: ErrorParams = {},
  ) {
    super(describe(code, params));
    this.name = 'IPv6Error';
  }
}

/** Vrai pour les erreurs des deux moteurs, qui partagent le vocabulaire de codes. */
export function isAddressError(err: unknown): err is IPv4Error | IPv6Error {
  return err instanceof IPv4Error || err instanceof IPv6Error;
}
