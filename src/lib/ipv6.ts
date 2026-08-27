/**
 * Moteur de calcul IPv6 — logique pure, sans dépendance ni DOM.
 *
 * Représentation : une adresse IPv6 est un `bigint` de 0 à 2^128-1. Les
 * `number` JS ne portent que 53 bits de mantisse entière, donc toute
 * l'arithmétique d'adresse passe par BigInt. Le moteur IPv4 reste séparé :
 * ses entiers tiennent dans un `number` et ses 32 tests avec.
 */

import { IPv6Error } from './errors';

export { IPv6Error };

export const BITS = 128;
export const UINT128_MAX = (1n << 128n) - 1n;

/* ------------------------------------------------------------------ */
/* Parsing                                                             */
/* ------------------------------------------------------------------ */

const GROUP_RE = /^[0-9a-fA-F]{1,4}$/;
const IPV4_RE = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;

/** Quatre octets décimaux -> entier 32 bits, pour la forme `::ffff:192.0.2.1`. */
function parseEmbeddedIPv4(s: string): bigint {
  const m = IPV4_RE.exec(s);
  if (!m) throw new IPv6Error('invalidEmbeddedIPv4', { input: s });
  let value = 0n;
  for (let i = 1; i <= 4; i++) {
    const raw = m[i];
    if (raw.length > 1 && raw[0] === '0') {
      throw new IPv6Error('leadingZero', { input: s, octet: raw });
    }
    const octet = Number(raw);
    if (octet > 255) throw new IPv6Error('octetOutOfRange', { input: s, octet });
    value = value * 256n + BigInt(octet);
  }
  return value;
}

/**
 * Développe une liste de groupes textuels en huit groupes numériques.
 * Le dernier groupe peut être une adresse IPv4 pointée, qui en vaut deux.
 */
function groupsToNumbers(groups: string[]): number[] {
  const out: number[] = [];
  groups.forEach((g, i) => {
    if (g.includes('.')) {
      if (i !== groups.length - 1) {
        throw new IPv6Error('ipv4MustEnd');
      }
      const v = parseEmbeddedIPv4(g);
      out.push(Number(v >> 16n), Number(v & 0xffffn));
      return;
    }
    if (!GROUP_RE.test(g)) throw new IPv6Error('invalidGroup', { group: g });
    out.push(parseInt(g, 16));
  });
  return out;
}

/**
 * Parse une adresse IPv6 littérale.
 *
 * Accepte la forme complète, la forme abrégée par `::` (une seule occurrence),
 * l'IPv4 embarquée en fin d'adresse et les crochets de la notation URL.
 * Refuse l'identifiant de zone (`fe80::1%eth0`), qui désigne une interface
 * locale et n'a pas de sens hors de la machine qui l'écrit.
 *
 * Les zéros de tête à l'intérieur d'un groupe sont légaux (`0db8` = `db8`) :
 * la lecture est toujours hexadécimale, sans ambiguïté octale.
 */
export function parseIPv6(input: string): bigint {
  let s = String(input).trim();
  if (s === '') throw new IPv6Error('emptyInput');
  if (s.startsWith('[') && s.endsWith(']')) s = s.slice(1, -1);
  if (s.includes('%')) {
    throw new IPv6Error('zoneIdUnsupported');
  }
  if (s.includes('/')) throw new IPv6Error('unexpectedPrefix');

  let numbers: number[];
  const idx = s.indexOf('::');
  if (idx !== -1) {
    if (s.indexOf('::', idx + 1) !== -1) {
      throw new IPv6Error('doubleColonTwice', { input: s });
    }
    const head = s.slice(0, idx);
    const tail = s.slice(idx + 2);
    if (head.endsWith(':') || tail.startsWith(':')) {
      throw new IPv6Error('emptyGroupAroundColon', { input: s });
    }
    const headGroups = groupsToNumbers(head === '' ? [] : head.split(':'));
    const tailGroups = groupsToNumbers(tail === '' ? [] : tail.split(':'));
    const missing = 8 - headGroups.length - tailGroups.length;
    // `::` remplace au moins un groupe de zéros : 1:2:3:4:5:6:7::8 est invalide.
    if (missing < 1) {
      throw new IPv6Error('doubleColonNoZeros', { input: s });
    }
    numbers = [...headGroups, ...Array(missing).fill(0), ...tailGroups];
  } else {
    numbers = groupsToNumbers(s.split(':'));
    if (numbers.length !== 8) {
      throw new IPv6Error('groupCountMismatch', { input: s, count: numbers.length });
    }
  }

  let value = 0n;
  for (const n of numbers) value = (value << 16n) | BigInt(n);
  return value;
}

/* ------------------------------------------------------------------ */
/* Formatage                                                           */
/* ------------------------------------------------------------------ */

export function toGroups(value: bigint): number[] {
  const groups: number[] = [];
  for (let i = 7; i >= 0; i--) {
    groups.push(Number((value >> BigInt(i * 16)) & 0xffffn));
  }
  return groups;
}

/** Forme complète : huit groupes de quatre chiffres hexadécimaux. */
export function expandIPv6(value: bigint): string {
  return toGroups(value)
    .map((g) => g.toString(16).padStart(4, '0'))
    .join(':');
}

/** Vrai pour les adresses de `::ffff:0:0/96`, qui s'écrivent en IPv4 pointée. */
function isIPv4Mapped(value: bigint): boolean {
  return value >> 32n === 0xffffn;
}

function embeddedIPv4String(value: bigint): string {
  const v = value & 0xffffffffn;
  return `${(v >> 24n) & 255n}.${(v >> 16n) & 255n}.${(v >> 8n) & 255n}.${v & 255n}`;
}

/**
 * Forme canonique RFC 5952 : hexadécimal minuscule, groupes sans zéros de
 * tête, plus longue suite de groupes nuls remplacée par `::` (la plus à gauche
 * en cas d'égalité), une suite d'un seul groupe restant écrite en clair.
 */
export function compressIPv6(value: bigint): string {
  if (isIPv4Mapped(value)) return `::ffff:${embeddedIPv4String(value)}`;

  const groups = toGroups(value);
  let bestStart = -1;
  let bestLen = 0;
  let start = -1;
  for (let i = 0; i <= 8; i++) {
    if (i < 8 && groups[i] === 0) {
      if (start === -1) start = i;
    } else if (start !== -1) {
      const len = i - start;
      if (len > bestLen) {
        bestLen = len;
        bestStart = start;
      }
      start = -1;
    }
  }

  const text = groups.map((g) => g.toString(16));
  if (bestLen < 2) return text.join(':');

  const head = text.slice(0, bestStart).join(':');
  const tail = text.slice(bestStart + bestLen).join(':');
  return `${head}::${tail}`;
}

export function ipv6ToHex(value: bigint): string {
  return '0x' + value.toString(16).toUpperCase().padStart(32, '0');
}

/* ------------------------------------------------------------------ */
/* Masques et préfixes                                                 */
/* ------------------------------------------------------------------ */

export function maskFromPrefix6(prefix: number): bigint {
  if (!Number.isInteger(prefix) || prefix < 0 || prefix > 128) {
    throw new IPv6Error('prefixOutOfRange6', { prefix });
  }
  return prefix === 0 ? 0n : (UINT128_MAX << BigInt(128 - prefix)) & UINT128_MAX;
}

/** Accepte « 64 » ou « /64 ». IPv6 ne connaît pas la notation en masque pointé. */
export function parsePrefix6(input: string): number {
  const s = String(input).trim().replace(/^\//, '');
  if (s === '') throw new IPv6Error('missingPrefix');
  if (!/^\d{1,3}$/.test(s)) throw new IPv6Error('invalidPrefix6', { input: s });
  const p = Number(s);
  if (p > 128) throw new IPv6Error('prefixOutOfRange6', { prefix: p });
  return p;
}

/* ------------------------------------------------------------------ */
/* Classification                                                      */
/* ------------------------------------------------------------------ */

/** Clé de libellé de type, résolue dans la langue active à l'affichage. */
export type Ipv6TypeKey =
  | 'unspecified'
  | 'loopback6'
  | 'ipv4Compatible'
  | 'ipv4Mapped'
  | 'nat64WellKnown'
  | 'nat64Local'
  | 'discardOnly'
  | 'teredo'
  | 'orchidv2'
  | 'documentation6'
  | 'sixToFour'
  | 'globalUnicast'
  | 'ula6'
  | 'linkLocal6'
  | 'multicast6';

export interface Ipv6Type {
  cidr: string;
  labelKey: Ipv6TypeKey;
  rfc: string;
  /** Routable sur l'Internet public. */
  routable: boolean;
}

const TYPES: Array<Ipv6Type & { network: bigint; prefix: number }> = (
  [
    ['::/128', 'unspecified', 'RFC 4291', false],
    ['::1/128', 'loopback6', 'RFC 4291', false],
    ['::/96', 'ipv4Compatible', 'RFC 4291', false],
    ['::ffff:0:0/96', 'ipv4Mapped', 'RFC 4291', false],
    ['64:ff9b::/96', 'nat64WellKnown', 'RFC 6052', false],
    ['64:ff9b:1::/48', 'nat64Local', 'RFC 8215', false],
    ['100::/64', 'discardOnly', 'RFC 6666', false],
    ['2001::/32', 'teredo', 'RFC 4380', true],
    ['2001:20::/28', 'orchidv2', 'RFC 7343', false],
    ['2001:db8::/32', 'documentation6', 'RFC 3849', false],
    ['2002::/16', 'sixToFour', 'RFC 7526', true],
    ['2000::/3', 'globalUnicast', 'RFC 4291', true],
    ['fc00::/7', 'ula6', 'RFC 4193', false],
    ['fe80::/10', 'linkLocal6', 'RFC 4291', false],
    ['ff00::/8', 'multicast6', 'RFC 4291', false],
  ] as Array<[string, Ipv6TypeKey, string, boolean]>
).map(([cidr, labelKey, rfc, routable]) => {
  const [addr, len] = cidr.split('/');
  return { cidr, labelKey, rfc, routable, network: parseIPv6(addr), prefix: Number(len) };
});

/** Type de l'adresse, préfixe le plus spécifique d'abord. */
export function typeOf(address: bigint): Ipv6Type | null {
  let best: (Ipv6Type & { prefix: number }) | null = null;
  for (const entry of TYPES) {
    const mask = maskFromPrefix6(entry.prefix);
    if ((address & mask) === entry.network) {
      if (!best || entry.prefix > best.prefix) best = entry;
    }
  }
  return best;
}

export type ScopeKey =
  | 'scopeReserved'
  | 'scopeInterfaceLocal'
  | 'scopeLinkLocal'
  | 'scopeRealmLocal'
  | 'scopeAdminLocal'
  | 'scopeSiteLocal'
  | 'scopeOrgLocal'
  | 'scopeGlobal'
  | 'scopeUnassigned';

const MULTICAST_SCOPES: Record<number, ScopeKey> = {
  0x0: 'scopeReserved',
  0x1: 'scopeInterfaceLocal',
  0x2: 'scopeLinkLocal',
  0x3: 'scopeRealmLocal',
  0x4: 'scopeAdminLocal',
  0x5: 'scopeSiteLocal',
  0x8: 'scopeOrgLocal',
  0xe: 'scopeGlobal',
  0xf: 'scopeReserved',
};

/** Portée multicast : la clé de libellé et le demi-octet qui la porte. */
export interface MulticastScope {
  key: ScopeKey;
  value: number;
}

export function isMulticast(address: bigint): boolean {
  return address >> 120n === 0xffn;
}

/** Portée d'une adresse multicast, lue dans le second demi-octet (RFC 4291 §2.7). */
export function multicastScope(address: bigint): MulticastScope | null {
  if (!isMulticast(address)) return null;
  const value = Number((address >> 112n) & 0xfn);
  return { key: MULTICAST_SCOPES[value] ?? 'scopeUnassigned', value };
}

export function isUnicast(address: bigint): boolean {
  return !isMulticast(address);
}

/**
 * Adresse MAC reconstruite quand l'identifiant d'interface suit le format
 * EUI-64 modifié : `xxxx:xxff:fexx:xxxx`, bit universel/local inversé.
 */
export function macFromInterfaceId(iid: bigint): string | null {
  if (((iid >> 24n) & 0xffffn) !== 0xfffen) return null;
  const bytes: number[] = [];
  for (let i = 7; i >= 0; i--) bytes.push(Number((iid >> BigInt(i * 8)) & 0xffn));
  const mac = [bytes[0] ^ 0x02, bytes[1], bytes[2], bytes[5], bytes[6], bytes[7]];
  return mac.map((b) => b.toString(16).padStart(2, '0')).join(':');
}

/**
 * Adresse multicast de sollicitation de voisin : `ff02::1:ff` suivi des
 * 24 bits de poids faible de l'adresse. C'est elle que Neighbor Discovery
 * interroge à la place d'un ARP broadcast.
 */
export function solicitedNodeMulticast(address: bigint): bigint {
  return (parseIPv6('ff02::1:ff00:0') | (address & 0xffffffn)) & UINT128_MAX;
}

/* ------------------------------------------------------------------ */
/* Analyse d'un bloc                                                   */
/* ------------------------------------------------------------------ */

export interface Ipv6SubnetInfo {
  address: bigint;
  prefix: number;
  mask: bigint;
  network: bigint;
  lastAddress: bigint;
  /** Bits laissés libres par le préfixe — l'identifiant d'interface en /64. */
  hostBits: number;
  interfaceId: bigint;
  totalAddresses: bigint;
  /** Première adresse assignable à une interface. */
  firstUsable: bigint;
  lastUsable: bigint;
  usableAddresses: bigint;
  cidr: string;
  compressed: string;
  expanded: string;
  hex: string;
  type: Ipv6Type | null;
  scope: MulticastScope | null;
  /** Adresse tout-à-zéro du bloc, réservée au routeur (nul en multicast). */
  subnetRouterAnycast: bigint | null;
  solicitedNode: bigint;
  embeddedMac: string | null;
  addressIsNetwork: boolean;
  noteKey: Note6Key | null;
}

/** Remarque attachée aux blocs dont les réservations sortent de l'ordinaire. */
export type Note6Key = 'hostRoute6' | 'pointToPoint6' | 'subnetRouterAnycast6';

export function describeSubnet6(address: bigint, prefix: number): Ipv6SubnetInfo {
  if (address < 0n || address > UINT128_MAX) {
    throw new IPv6Error('addressOutOfSpace');
  }
  const mask = maskFromPrefix6(prefix);
  const network = address & mask;
  const lastAddress = network | (UINT128_MAX ^ mask);
  const hostBits = 128 - prefix;
  const totalAddresses = 1n << BigInt(hostBits);
  const interfaceId = address & (UINT128_MAX ^ mask);
  const multicast = isMulticast(network);

  let firstUsable = network;
  let usableAddresses = totalAddresses;
  let subnetRouterAnycast: bigint | null = null;
  let noteKey: Note6Key | null = null;

  if (prefix === 128) {
    noteKey = 'hostRoute6';
  } else if (prefix === 127) {
    noteKey = 'pointToPoint6';
  } else if (!multicast) {
    // L'adresse tout-à-zéro du bloc est l'anycast Subnet-Router (RFC 4291 §2.6.1).
    subnetRouterAnycast = network;
    firstUsable = network + 1n;
    usableAddresses = totalAddresses - 1n;
    noteKey = 'subnetRouterAnycast6';
  }

  return {
    address,
    prefix,
    mask,
    network,
    lastAddress,
    hostBits,
    interfaceId,
    totalAddresses,
    firstUsable,
    lastUsable: lastAddress,
    usableAddresses,
    cidr: `${compressIPv6(network)}/${prefix}`,
    compressed: compressIPv6(address),
    expanded: expandIPv6(address),
    hex: ipv6ToHex(address),
    type: typeOf(network),
    scope: multicastScope(network),
    subnetRouterAnycast,
    solicitedNode: solicitedNodeMulticast(address),
    embeddedMac: prefix <= 64 ? macFromInterfaceId(address & 0xffffffffffffffffn) : null,
    addressIsNetwork: address === network,
    noteKey,
  };
}

/** Parse « 2001:db8::/32 », « 2001:db8:: 32 » ou une adresse seule (=> /128). */
export function parseCidr6(input: string): Ipv6SubnetInfo {
  const s = String(input).trim();
  if (s === '') throw new IPv6Error('emptyInput');
  const bySlash = s.split('/');
  if (bySlash.length === 2) {
    return describeSubnet6(parseIPv6(bySlash[0]), parsePrefix6(bySlash[1]));
  }
  if (bySlash.length > 2) throw new IPv6Error('invalidCidr6', { input: s });
  const bySpace = s.split(/\s+/);
  if (bySpace.length === 2) {
    return describeSubnet6(parseIPv6(bySpace[0]), parsePrefix6(bySpace[1]));
  }
  if (bySpace.length > 2) throw new IPv6Error('invalidCidr6', { input: s });
  return describeSubnet6(parseIPv6(s), 128);
}

/** Plus petit préfixe offrant au moins `count` adresses. */
export function prefixForAddresses6(count: bigint): number {
  if (count < 1n) throw new IPv6Error('addressCountMin');
  if (count > UINT128_MAX + 1n) {
    throw new IPv6Error('addressCountTooLarge');
  }
  for (let prefix = 128; prefix >= 0; prefix--) {
    if (1n << BigInt(128 - prefix) >= count) return prefix;
  }
  return 0;
}

/* ------------------------------------------------------------------ */
/* Plage d'adresses <-> blocs CIDR                                     */
/* ------------------------------------------------------------------ */

export interface RangeResult6 {
  start: bigint;
  end: bigint;
  count: bigint;
  cidrs: Ipv6SubnetInfo[];
  enclosing: Ipv6SubnetInfo;
  exact: boolean;
}

/** Décompose [start, end] en un ensemble minimal de blocs CIDR alignés. */
export function rangeToCidrs6(start: bigint, end: bigint): Array<{ network: bigint; prefix: number }> {
  if (start > end) throw new IPv6Error('rangeReversed');
  const blocks: Array<{ network: bigint; prefix: number }> = [];
  let current = start;
  while (current <= end) {
    // Le plus grand bloc à la fois aligné sur `current` et contenu dans la plage.
    let prefix = 128;
    while (prefix > 0) {
      const size = 1n << BigInt(129 - prefix);
      if (current % size !== 0n || current + size - 1n > end) break;
      prefix--;
    }
    blocks.push({ network: current, prefix });
    current += 1n << BigInt(128 - prefix);
  }
  return blocks;
}

export function analyzeRange6(start: bigint, end: bigint): RangeResult6 {
  if (start > end) throw new IPv6Error('rangeReversed');
  const blocks = rangeToCidrs6(start, end);

  let prefix = 128;
  while (prefix > 0) {
    const mask = maskFromPrefix6(prefix);
    if ((start & mask) === (end & mask)) break;
    prefix--;
  }
  const enclosing = describeSubnet6(start, prefix);

  return {
    start,
    end,
    count: end - start + 1n,
    cidrs: blocks.map((b) => describeSubnet6(b.network, b.prefix)),
    enclosing,
    exact: blocks.length === 1 && blocks[0].network === start && enclosing.lastAddress === end,
  };
}

/* ------------------------------------------------------------------ */
/* Découpage en sous-réseaux                                           */
/* ------------------------------------------------------------------ */

export interface SplitResult6 {
  subnets: Ipv6SubnetInfo[];
  total: bigint;
  truncated: boolean;
}

export function splitSubnet6(
  network: bigint,
  prefix: number,
  newPrefix: number,
  limit = 256,
): SplitResult6 {
  if (newPrefix < prefix) {
    throw new IPv6Error('splitWiderThanBlock', { newPrefix, prefix });
  }
  if (newPrefix > 128) throw new IPv6Error('prefixOutOfRange6', { prefix: newPrefix });
  const total = 1n << BigInt(newPrefix - prefix);
  const step = 1n << BigInt(128 - newPrefix);
  const shown = total < BigInt(limit) ? Number(total) : limit;
  const subnets: Ipv6SubnetInfo[] = [];
  for (let i = 0; i < shown; i++) {
    subnets.push(describeSubnet6(network + BigInt(i) * step, newPrefix));
  }
  return { subnets, total, truncated: total > BigInt(shown) };
}

/* ------------------------------------------------------------------ */
/* Divers                                                              */
/* ------------------------------------------------------------------ */

export function contains6(info: Ipv6SubnetInfo, address: bigint): boolean {
  return address >= info.network && address <= info.lastAddress;
}

const DECIMAL_LIMIT = 10n ** 15n;

/**
 * Nombre lisible : décimal groupé tant qu'il reste saisissable, puissance de
 * deux et ordre de grandeur au-delà — un /0 IPv6 vaut 2^128 adresses.
 */
export function formatBigCount(n: bigint, locale: string): string {
  if (n < 0n) return String(n);
  if (n <= DECIMAL_LIMIT) return n.toLocaleString(locale);

  const digits = n.toString();
  const mantissa = Number(`${digits[0]}.${digits.slice(1, 3)}`).toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const approx = `≈ ${mantissa} × 10^${digits.length - 1}`;

  // Puissance de deux : un seul bit à 1.
  if ((n & (n - 1n)) === 0n) {
    let exp = 0;
    let v = n;
    while (v > 1n) {
      v >>= 1n;
      exp++;
    }
    return `2^${exp} (${approx})`;
  }
  return approx;
}
