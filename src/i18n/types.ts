import type { ErrorCode } from '../lib/errors';
import type { ClassNoteKey, Note4Key, SpecialUseKey } from '../lib/ipv4';
import type { Ipv6TypeKey, Note6Key, ScopeKey } from '../lib/ipv6';

/**
 * Contrat de traduction.
 *
 * Chaque dictionnaire est un `Record` fermé sur une union de clés : ajouter un
 * terme sans le traduire dans les six langues casse la compilation. Avec un
 * `Record<string, …>`, une entrée manquante compilerait et ne s'afficherait
 * simplement pas — `Term` rend ses enfants tels quels quand l'entrée est
 * absente, ce qui rend l'oubli invisible.
 */

/** Identifiant de terme du glossaire — la clé partagée par le libellé et sa définition. */
export type TermId =
  /* Commun */
  | 'cidr'
  | 'network'
  | 'broadcast'
  | 'blockLastAddress'
  | 'netmask'
  | 'wildcard'
  | 'firstUsable'
  | 'lastUsable'
  | 'usableHosts'
  | 'totalAddresses'
  | 'prefixHostBits'
  | 'hex'
  | 'ipClass'
  | 'addressInput'
  | 'scopePrivate'
  | 'scopePublic'
  | 'specialUse'
  | 'hostInBlock'
  | 'addressIsBroadcast'
  | 'binary'
  | 'split'
  /* IPv6 */
  | 'compressed'
  | 'expanded'
  | 'hex6'
  | 'prefix6'
  | 'prefixIidBits'
  | 'interfaceId'
  | 'lastAddress6'
  | 'totalAddresses6'
  | 'usableAddresses6'
  | 'firstUsable6'
  | 'lastUsable6'
  | 'subnetRouterAnycast'
  | 'ipv6Type'
  | 'multicastScope'
  | 'solicitedNode'
  | 'embeddedMac'
  | 'ula'
  | 'linkLocal'
  | 'split6'
  /* Mode plage */
  | 'rangeStart'
  | 'rangeEnd'
  | 'rangeCount'
  | 'enclosing'
  | 'overflow'
  | 'cidrBlocks'
  | 'exactBlock'
  | 'minimalDecomposition';

export interface GlossaryEntry {
  /** Titre de l'info-bulle. */
  terme: string;
  /** Définition en une phrase. */
  court: string;
  /** Précision, exemple ou cas limite. Les adresses citées restent identiques
   *  d'une langue à l'autre : seule la prose autour est traduite. */
  detail?: string;
  /** Référence normative, non traduite. */
  rfc?: string;
}

export interface Translation {
  meta: {
    /** Nom de la langue, écrit dans cette langue. */
    label: string;
    /** Étiquette BCP 47 : sert à `Intl` et à l'attribut `lang` du document. */
    locale: string;
  };

  /** Libellé court affiché partout où le terme apparaît. */
  labels: Record<TermId, string>;

  /** Définitions du glossaire, ouvertes au survol. */
  glossary: Record<TermId, GlossaryEntry>;

  ui: {
    title: string;
    intro: string;
    step1: string;
    step2: string;
    step3: string;
    protocol: string;
    footer: string;

    modeLabel4: string;
    modeLabel6: string;
    mode4Cidr: string;
    mode4Range: string;
    mode4Netmask: string;
    mode4Hosts: string;
    mode6Cidr: string;
    mode6Range: string;
    mode6Prefix: string;

    fieldCidr4Hint: string;
    fieldCidr6Hint: string;
    fieldRangeStart: string;
    fieldRangeEnd: string;
    fieldAddress: string;
    fieldNetmask: string;
    fieldNetmaskHint: string;
    fieldHosts: string;
    fieldHostsHint: string;
    fieldPrefix: string;
    fieldPrefixHint: string;

    result: string;
    hoverHint: string;
    binaryRowAddress: string;
    binaryRowMask: string;
    binaryRowNetwork: string;
    binaryRowBroadcast: string;
    binaryRowLast: string;
    networkBits: string;
    hostBits: string;
    prefixBits: string;
    interfaceBits: string;

    newPrefix: string;
    noSplit: string;
    /** « /{prefix} — {count} sous-réseaux de {size} hôtes » */
    splitOption4: string;
    /** « /{prefix} — {count} sous-réseaux de {size} adresses » */
    splitOption6: string;
    /** « {total} sous-réseaux au total — {shown} affichés. … » */
    splitTruncated: string;
    /** « Découpage proposé jusqu'à /{prefix} : … » */
    splitCapped: string;

    exportJson: string;
    exportCsv: string;
    copyJson: string;
    exportSubnetsCsv: string;
    exportBlocksCsv: string;
    copyCidrList: string;

    badgePublic: string;
    badgeSpecialUse: string;
    badgeUnassigned6: string;
    /** « Hôte {address} dans {cidr} » */
    badgeHostInBlock: string;
    /** « Interface {address} dans {cidr} » */
    badgeInterfaceInBlock: string;
    badgeAddressIsBroadcast: string;
    /** « {count} adresses » */
    badgeAddressCount: string;
    /** « {count} bloc(s) CIDR » */
    badgeBlockCount: string;
    badgeExact: string;
    badgeNotExact: string;
    /** « {count} adresses » */
    overflowValue: string;

    csvField: string;
    csvValue: string;
    exportAddressInput: string;
    exportPrefixLength: string;
    exportUsage: string;
    exportNote: string;
  };

  errors: Record<ErrorCode, string>;
  notes: Record<Note4Key | Note6Key, string>;
  specialUse: Record<SpecialUseKey, string>;
  ipv6Types: Record<Ipv6TypeKey, string>;
  scopes: Record<ScopeKey, string>;
  classNotes: Record<ClassNoteKey, string>;
}

/** Remplace les `{jetons}` d'un modèle par les valeurs fournies. */
export function format(template: string, params: Record<string, string | number> = {}): string {
  return template.replace(/\{(\w+)\}/g, (whole, key: string) =>
    key in params ? String(params[key]) : whole,
  );
}
