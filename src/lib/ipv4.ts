/**
 * Moteur de calcul IPv4 / CIDR — logique pure, sans dépendance ni DOM.
 *
 * Représentation : une adresse IPv4 est un entier non signé 0 .. 2^32-1 stocké
 * dans un `number` JS. Toutes les opérations bit à bit sont normalisées avec
 * `>>> 0` : en JavaScript `&`, `|`, `~` et `<<` travaillent sur des entiers
 * signés 32 bits, donc `0xFFFFFFFF << 0` vaut -1 sans cette normalisation.
 */

import { IPv4Error } from './errors';

export { IPv4Error };
export type { ErrorCode } from './errors';

export const UINT32_MAX = 0xffffffff;

/* ------------------------------------------------------------------ */
/* Parsing / formatage                                                 */
/* ------------------------------------------------------------------ */

const OCTET_RE = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;

/**
 * Parse une adresse IPv4 en notation décimale pointée stricte.
 *
 * Les zéros de tête (`010.0.0.1`) sont refusés volontairement : selon
 * l'implémentation ils sont lus en octal (inet_aton) ou en décimal, ce qui est
 * une source classique de parser differential / contournement de filtre SSRF.
 */
export function parseIPv4(input: string): number {
  const s = String(input).trim();
  const m = OCTET_RE.exec(s);
  if (!m) throw new IPv4Error('invalidIPv4', { input: s });

  let value = 0;
  for (let i = 1; i <= 4; i++) {
    const raw = m[i];
    if (raw.length > 1 && raw[0] === '0') {
      throw new IPv4Error('leadingZero', { input: s, octet: raw });
    }
    const octet = Number(raw);
    if (octet > 255) throw new IPv4Error('octetOutOfRange', { input: s, octet });
    value = value * 256 + octet;
  }
  return value >>> 0;
}

export function ipToString(value: number): string {
  const v = value >>> 0;
  return `${(v >>> 24) & 255}.${(v >>> 16) & 255}.${(v >>> 8) & 255}.${v & 255}`;
}

/** Représentation binaire d'un uint32, groupée par octet. */
export function ipToBinary(value: number, separator = '.'): string {
  const v = value >>> 0;
  return [(v >>> 24) & 255, (v >>> 16) & 255, (v >>> 8) & 255, v & 255]
    .map((o) => o.toString(2).padStart(8, '0'))
    .join(separator);
}

export function ipToHex(value: number): string {
  return '0x' + (value >>> 0).toString(16).toUpperCase().padStart(8, '0');
}

/* ------------------------------------------------------------------ */
/* Masques et préfixes                                                 */
/* ------------------------------------------------------------------ */

export function maskFromPrefix(prefix: number): number {
  if (!Number.isInteger(prefix) || prefix < 0 || prefix > 32) {
    throw new IPv4Error('prefixOutOfRange4', { prefix });
  }
  // `0xFFFFFFFF << 32` ne vaut pas 0 en JS (le décalage est pris modulo 32).
  return prefix === 0 ? 0 : (UINT32_MAX << (32 - prefix)) >>> 0;
}

export function popcount(value: number): number {
  let x = value >>> 0;
  let count = 0;
  while (x !== 0) {
    count += x & 1;
    x >>>= 1;
  }
  return count;
}

/** Vérifie qu'un masque est une suite contiguë de 1 puis de 0, et renvoie le préfixe. */
export function prefixFromMask(mask: number): number {
  const m = mask >>> 0;
  const inverted = ~m >>> 0;
  // Un masque contigu implique que ~masque + 1 est une puissance de deux.
  if (((inverted + 1) & inverted) !== 0) {
    throw new IPv4Error('nonContiguousMask', { mask: ipToString(m) });
  }
  return popcount(m);
}

/** Accepte « 24 », « /24 » ou « 255.255.255.0 ». */
export function parsePrefixOrMask(input: string): number {
  const s = String(input).trim().replace(/^\//, '');
  if (s === '') throw new IPv4Error('missingMask');
  if (/^\d{1,2}$/.test(s)) {
    const p = Number(s);
    if (p > 32) throw new IPv4Error('prefixOutOfRange4', { prefix: p });
    return p;
  }
  return prefixFromMask(parseIPv4(s));
}

/* ------------------------------------------------------------------ */
/* Classification (classes historiques + usages spéciaux)              */
/* ------------------------------------------------------------------ */

/** Clé de libellé d'usage spécial, résolue dans la langue active à l'affichage. */
export type SpecialUseKey =
  | 'thisNetwork'
  | 'rfc1918'
  | 'cgnat'
  | 'loopback4'
  | 'linkLocal4'
  | 'ietfProtocol'
  | 'testNet1'
  | 'as112v4'
  | 'amt'
  | 'relay6to4'
  | 'benchmarking'
  | 'testNet2'
  | 'testNet3'
  | 'multicast4'
  | 'reservedFuture'
  | 'limitedBroadcast';

export interface SpecialUse {
  cidr: string;
  labelKey: SpecialUseKey;
  rfc: string;
  routable: boolean;
}

const SPECIAL_USE: Array<{ network: number; prefix: number } & SpecialUse> = (
  [
    ['0.0.0.0/8', 'thisNetwork', 'RFC 1122', false],
    ['10.0.0.0/8', 'rfc1918', 'RFC 1918', false],
    ['100.64.0.0/10', 'cgnat', 'RFC 6598', false],
    ['127.0.0.0/8', 'loopback4', 'RFC 1122', false],
    ['169.254.0.0/16', 'linkLocal4', 'RFC 3927', false],
    ['172.16.0.0/12', 'rfc1918', 'RFC 1918', false],
    ['192.0.0.0/24', 'ietfProtocol', 'RFC 6890', false],
    ['192.0.2.0/24', 'testNet1', 'RFC 5737', false],
    ['192.31.196.0/24', 'as112v4', 'RFC 7535', true],
    ['192.52.193.0/24', 'amt', 'RFC 7450', true],
    ['192.88.99.0/24', 'relay6to4', 'RFC 7526', false],
    ['192.168.0.0/16', 'rfc1918', 'RFC 1918', false],
    ['198.18.0.0/15', 'benchmarking', 'RFC 2544', false],
    ['198.51.100.0/24', 'testNet2', 'RFC 5737', false],
    ['203.0.113.0/24', 'testNet3', 'RFC 5737', false],
    ['224.0.0.0/4', 'multicast4', 'RFC 5771', false],
    ['240.0.0.0/4', 'reservedFuture', 'RFC 1112', false],
  ] as Array<[string, SpecialUseKey, string, boolean]>
).map(([cidr, labelKey, rfc, routable]) => {
  const [addr, len] = cidr.split('/');
  return { cidr, labelKey, rfc, routable, network: parseIPv4(addr), prefix: Number(len) };
});

const RFC1918 = ['10.0.0.0/8', '172.16.0.0/12', '192.168.0.0/16'];

export function specialUseOf(address: number): SpecialUse | null {
  if ((address >>> 0) === UINT32_MAX) {
    return { cidr: '255.255.255.255/32', labelKey: 'limitedBroadcast', rfc: 'RFC 919', routable: false };
  }
  // Le plus spécifique (préfixe le plus long) gagne.
  let best: (SpecialUse & { prefix: number }) | null = null;
  for (const entry of SPECIAL_USE) {
    const mask = maskFromPrefix(entry.prefix);
    if (((address & mask) >>> 0) === entry.network) {
      if (!best || entry.prefix > best.prefix) best = entry;
    }
  }
  return best;
}

export function isPrivate(address: number): boolean {
  const su = specialUseOf(address);
  return su !== null && RFC1918.includes(su.cidr);
}

export type ClassNoteKey = 'classA' | 'classB' | 'classC' | 'classD' | 'classE';

/** Classe historique (pré-CIDR) — informative uniquement. */
export function classOf(address: number): { letter: string; noteKey: ClassNoteKey } {
  const first = (address >>> 24) & 255;
  if (first < 128) return { letter: 'A', noteKey: 'classA' };
  if (first < 192) return { letter: 'B', noteKey: 'classB' };
  if (first < 224) return { letter: 'C', noteKey: 'classC' };
  if (first < 240) return { letter: 'D', noteKey: 'classD' };
  return { letter: 'E', noteKey: 'classE' };
}

/* ------------------------------------------------------------------ */
/* Analyse d'un sous-réseau                                            */
/* ------------------------------------------------------------------ */

export interface SubnetInfo {
  address: number;
  prefix: number;
  mask: number;
  wildcard: number;
  network: number;
  broadcast: number;
  firstUsable: number | null;
  lastUsable: number | null;
  totalAddresses: number;
  usableHosts: number;
  cidr: string;
  ipClass: { letter: string; noteKey: ClassNoteKey };
  specialUse: SpecialUse | null;
  isPrivate: boolean;
  addressIsNetwork: boolean;
  addressIsBroadcast: boolean;
  hostBits: number;
  noteKey: Note4Key | null;
}

/** Remarque attachée aux préfixes qui échappent à la règle « − 2 ». */
export type Note4Key = 'hostRoute4' | 'pointToPoint4';

/** Additionne un offset à une adresse sans passer par l'arithmétique 32 bits signée. */
function addOffset(base: number, offset: number): number {
  return (base + offset) % 4294967296;
}

export function describeSubnet(address: number, prefix: number): SubnetInfo {
  const mask = maskFromPrefix(prefix);
  const wildcard = ~mask >>> 0;
  const network = (address & mask) >>> 0;
  const broadcast = (network | wildcard) >>> 0;
  const hostBits = 32 - prefix;
  const totalAddresses = Math.pow(2, hostBits);

  let firstUsable: number | null;
  let lastUsable: number | null;
  let usableHosts: number;
  let noteKey: Note4Key | null = null;

  if (prefix === 32) {
    firstUsable = network;
    lastUsable = network;
    usableHosts = 1;
    noteKey = 'hostRoute4';
  } else if (prefix === 31) {
    firstUsable = network;
    lastUsable = broadcast;
    usableHosts = 2;
    noteKey = 'pointToPoint4';
  } else {
    firstUsable = addOffset(network, 1);
    lastUsable = addOffset(broadcast, -1);
    usableHosts = totalAddresses - 2;
  }

  return {
    address,
    prefix,
    mask,
    wildcard,
    network,
    broadcast,
    firstUsable,
    lastUsable,
    totalAddresses,
    usableHosts,
    cidr: `${ipToString(network)}/${prefix}`,
    ipClass: classOf(network),
    specialUse: specialUseOf(network),
    isPrivate: isPrivate(network),
    addressIsNetwork: address === network && prefix <= 30,
    addressIsBroadcast: address === broadcast && prefix <= 30,
    hostBits,
    noteKey,
  };
}

/** Parse « 10.0.0.0/24 », « 10.0.0.0 255.255.255.0 » ou « 10.0.0.0 » (=> /32). */
export function parseCidr(input: string): SubnetInfo {
  const s = String(input).trim();
  if (s === '') throw new IPv4Error('emptyInput');
  const bySlash = s.split('/');
  if (bySlash.length === 2) {
    return describeSubnet(parseIPv4(bySlash[0]), parsePrefixOrMask(bySlash[1]));
  }
  const bySpace = s.split(/\s+/);
  if (bySpace.length === 2) {
    return describeSubnet(parseIPv4(bySpace[0]), parsePrefixOrMask(bySpace[1]));
  }
  if (bySlash.length > 2 || bySpace.length > 2) {
    throw new IPv4Error('invalidCidr4', { input: s });
  }
  return describeSubnet(parseIPv4(s), 32);
}

/* ------------------------------------------------------------------ */
/* Adresse + nombre d'hôtes                                            */
/* ------------------------------------------------------------------ */

/** Plus petit préfixe offrant au moins `hosts` adresses utilisables. */
export function prefixForHosts(hosts: number): number {
  if (!Number.isInteger(hosts) || hosts < 1) {
    throw new IPv4Error('hostsNotInteger');
  }
  if (hosts > 4294967294) {
    throw new IPv4Error('hostsTooLarge');
  }
  if (hosts === 1) return 32; // route hôte
  if (hosts === 2) return 31; // point-à-point RFC 3021
  for (let prefix = 30; prefix >= 0; prefix--) {
    if (Math.pow(2, 32 - prefix) - 2 >= hosts) return prefix;
  }
  return 0;
}

/* ------------------------------------------------------------------ */
/* Plage d'adresses <-> blocs CIDR                                     */
/* ------------------------------------------------------------------ */

export interface RangeResult {
  start: number;
  end: number;
  count: number;
  cidrs: SubnetInfo[];
  /** Plus petit bloc unique contenant toute la plage (souvent plus large qu'elle). */
  enclosing: SubnetInfo;
  exact: boolean;
}

/** Décompose [start, end] en un ensemble minimal de blocs CIDR alignés. */
export function rangeToCidrs(start: number, end: number): Array<{ network: number; prefix: number }> {
  if (start > end) throw new IPv4Error('rangeReversed');
  const blocks: Array<{ network: number; prefix: number }> = [];
  let current = start;
  while (current <= end) {
    // Plus grand bloc aligné sur `current` …
    let prefix = 32;
    while (prefix > 0) {
      const candidate = maskFromPrefix(prefix - 1);
      if (((current & candidate) >>> 0) !== current) break;
      prefix--;
    }
    // … puis on le réduit pour ne pas déborder de `end`.
    const remaining = end - current + 1;
    const maxHostBits = Math.floor(Math.log2(remaining));
    const minPrefix = 32 - maxHostBits;
    if (prefix < minPrefix) prefix = minPrefix;

    blocks.push({ network: current, prefix });
    current += Math.pow(2, 32 - prefix);
  }
  return blocks;
}

export function analyzeRange(start: number, end: number): RangeResult {
  if (start > end) throw new IPv4Error('rangeReversed');
  const blocks = rangeToCidrs(start, end);

  // Bloc englobant : on remonte tant que le préfixe commun ne couvre pas `end`.
  let prefix = 32;
  while (prefix > 0) {
    const mask = maskFromPrefix(prefix);
    if (((start & mask) >>> 0) === ((end & mask) >>> 0)) break;
    prefix--;
  }
  const enclosing = describeSubnet(start, prefix);

  return {
    start,
    end,
    count: end - start + 1,
    cidrs: blocks.map((b) => describeSubnet(b.network, b.prefix)),
    enclosing,
    exact: blocks.length === 1 && blocks[0].network === start && enclosing.broadcast === end,
  };
}

/* ------------------------------------------------------------------ */
/* Découpage en sous-réseaux                                           */
/* ------------------------------------------------------------------ */

export interface SplitResult {
  subnets: SubnetInfo[];
  total: number;
  truncated: boolean;
}

export function splitSubnet(network: number, prefix: number, newPrefix: number, limit = 512): SplitResult {
  if (newPrefix < prefix) {
    throw new IPv4Error('splitWiderThanBlock', { newPrefix, prefix });
  }
  if (newPrefix > 32) throw new IPv4Error('prefixOutOfRange4', { prefix: newPrefix });
  const total = Math.pow(2, newPrefix - prefix);
  const step = Math.pow(2, 32 - newPrefix);
  const shown = Math.min(total, limit);
  const subnets: SubnetInfo[] = [];
  for (let i = 0; i < shown; i++) {
    subnets.push(describeSubnet(addOffset(network, i * step), newPrefix));
  }
  return { subnets, total, truncated: total > shown };
}

/* ------------------------------------------------------------------ */
/* Divers                                                              */
/* ------------------------------------------------------------------ */

export function contains(info: SubnetInfo, address: number): boolean {
  return address >= info.network && address <= info.broadcast;
}

export function formatCount(n: number, locale: string): string {
  return n.toLocaleString(locale);
}
