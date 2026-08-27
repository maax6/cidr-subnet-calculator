import type { SubnetInfo } from './ipv4';
import { ipToString, formatCount } from './ipv4';
import type { Ipv6SubnetInfo } from './ipv6';
import { compressIPv6, formatBigCount } from './ipv6';
import type { Translation } from '../i18n/types';
import { format } from '../i18n/types';

export interface ExportRow {
  champ: string;
  valeur: string;
}

/** Les exports reprennent les intitulés de l'interface, dans la langue active. */
export function subnetToRows(info: SubnetInfo, t: Translation, locale: string): ExportRow[] {
  const l = t.labels;
  const lastIsBroadcast = info.prefix <= 30;
  const rows: ExportRow[] = [
    { champ: l.cidr, valeur: info.cidr },
    { champ: t.ui.exportAddressInput, valeur: ipToString(info.address) },
    { champ: l.network, valeur: ipToString(info.network) },
    {
      champ: lastIsBroadcast ? l.broadcast : l.blockLastAddress,
      valeur: ipToString(info.broadcast),
    },
    { champ: l.netmask, valeur: ipToString(info.mask) },
    { champ: l.wildcard, valeur: ipToString(info.wildcard) },
    { champ: t.ui.exportPrefixLength, valeur: `/${info.prefix}` },
    { champ: l.prefixHostBits, valeur: `${info.prefix} / ${info.hostBits}` },
    {
      champ: l.firstUsable,
      valeur: info.firstUsable === null ? '—' : ipToString(info.firstUsable),
    },
    { champ: l.lastUsable, valeur: info.lastUsable === null ? '—' : ipToString(info.lastUsable) },
    { champ: l.totalAddresses, valeur: formatCount(info.totalAddresses, locale) },
    { champ: l.usableHosts, valeur: formatCount(info.usableHosts, locale) },
    {
      champ: l.ipClass,
      valeur: `${info.ipClass.letter} (${t.classNotes[info.ipClass.noteKey]})`,
    },
    {
      champ: t.ui.exportUsage,
      valeur: info.specialUse
        ? `${t.specialUse[info.specialUse.labelKey]} — ${info.specialUse.rfc}`
        : t.ui.badgePublic,
    },
  ];
  if (info.noteKey) rows.push({ champ: t.ui.exportNote, valeur: t.notes[info.noteKey] });
  return rows;
}

export function toJson(info: SubnetInfo, t: Translation): string {
  // Les clés restent en anglais : le JSON est destiné à être relu par un
  // programme, alors que les valeurs descriptives suivent la langue affichée.
  return JSON.stringify(
    {
      cidr: info.cidr,
      address: ipToString(info.address),
      network: ipToString(info.network),
      broadcast: ipToString(info.broadcast),
      netmask: ipToString(info.mask),
      wildcard: ipToString(info.wildcard),
      prefixLength: info.prefix,
      hostBits: info.hostBits,
      firstUsable: info.firstUsable === null ? null : ipToString(info.firstUsable),
      lastUsable: info.lastUsable === null ? null : ipToString(info.lastUsable),
      totalAddresses: info.totalAddresses,
      usableHosts: info.usableHosts,
      class: info.ipClass.letter,
      private: info.isPrivate,
      specialUse: info.specialUse && {
        cidr: info.specialUse.cidr,
        label: t.specialUse[info.specialUse.labelKey],
        rfc: info.specialUse.rfc,
        routable: info.specialUse.routable,
      },
    },
    null,
    2,
  );
}

function csvCell(value: string): string {
  return /[";\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

export function toCsv(rows: ExportRow[], t: Translation): string {
  const header = `${csvCell(t.ui.csvField)};${csvCell(t.ui.csvValue)}`;
  return [header, ...rows.map((r) => `${csvCell(r.champ)};${csvCell(r.valeur)}`)].join('\r\n');
}

/** En-tête CSV des tableaux de blocs, repris des intitulés de colonne. */
function tableHeader(labels: string[]): string {
  return labels.map(csvCell).join(';');
}

export function subnetsToCsv(subnets: SubnetInfo[], t: Translation, locale: string): string {
  const l = t.labels;
  const header = tableHeader([
    l.cidr,
    l.network,
    l.firstUsable,
    l.lastUsable,
    l.broadcast,
    l.netmask,
    l.usableHosts,
  ]);
  const lines = subnets.map((s) =>
    [
      s.cidr,
      ipToString(s.network),
      s.firstUsable === null ? '' : ipToString(s.firstUsable),
      s.lastUsable === null ? '' : ipToString(s.lastUsable),
      ipToString(s.broadcast),
      ipToString(s.mask),
      formatCount(s.usableHosts, locale),
    ]
      .map(csvCell)
      .join(';'),
  );
  return [header, ...lines].join('\r\n');
}

/* ------------------------------------------------------------------ */
/* IPv6                                                                */
/* ------------------------------------------------------------------ */

export function subnet6ToRows(info: Ipv6SubnetInfo, t: Translation, locale: string): ExportRow[] {
  const l = t.labels;
  const rows: ExportRow[] = [
    { champ: l.cidr, valeur: info.cidr },
    { champ: t.ui.exportAddressInput, valeur: info.compressed },
    { champ: l.expanded, valeur: info.expanded },
    { champ: l.network, valeur: compressIPv6(info.network) },
    { champ: l.lastAddress6, valeur: compressIPv6(info.lastAddress) },
    { champ: t.ui.exportPrefixLength, valeur: `/${info.prefix}` },
    { champ: l.prefixIidBits, valeur: `${info.prefix} / ${info.hostBits}` },
    { champ: l.firstUsable6, valeur: compressIPv6(info.firstUsable) },
    { champ: l.lastUsable6, valeur: compressIPv6(info.lastUsable) },
    { champ: l.totalAddresses6, valeur: formatBigCount(info.totalAddresses, locale) },
    { champ: l.usableAddresses6, valeur: formatBigCount(info.usableAddresses, locale) },
    { champ: l.interfaceId, valeur: '0x' + info.interfaceId.toString(16) },
    { champ: l.hex6, valeur: info.hex },
    {
      champ: l.ipv6Type,
      valeur: info.type
        ? `${t.ipv6Types[info.type.labelKey]} — ${info.type.rfc}`
        : t.ui.badgeUnassigned6,
    },
    { champ: l.solicitedNode, valeur: compressIPv6(info.solicitedNode) },
  ];
  if (info.scope) {
    rows.push({
      champ: l.multicastScope,
      valeur: `${t.scopes[info.scope.key]} (0x${info.scope.value.toString(16)})`,
    });
  }
  if (info.subnetRouterAnycast !== null) {
    rows.push({ champ: l.subnetRouterAnycast, valeur: compressIPv6(info.subnetRouterAnycast) });
  }
  if (info.embeddedMac) rows.push({ champ: l.embeddedMac, valeur: info.embeddedMac });
  if (info.noteKey) rows.push({ champ: t.ui.exportNote, valeur: t.notes[info.noteKey] });
  return rows;
}

export function toJson6(info: Ipv6SubnetInfo, t: Translation): string {
  // BigInt n'est pas sérialisable par JSON.stringify : les compteurs sortent
  // en chaîne, ce qui préserve les 128 bits qu'un `number` perdrait.
  return JSON.stringify(
    {
      cidr: info.cidr,
      address: info.compressed,
      addressExpanded: info.expanded,
      network: compressIPv6(info.network),
      lastAddress: compressIPv6(info.lastAddress),
      prefixLength: info.prefix,
      interfaceBits: info.hostBits,
      firstUsable: compressIPv6(info.firstUsable),
      lastUsable: compressIPv6(info.lastUsable),
      totalAddresses: info.totalAddresses.toString(),
      usableAddresses: info.usableAddresses.toString(),
      interfaceId: '0x' + info.interfaceId.toString(16),
      hex: info.hex,
      type: info.type && {
        cidr: info.type.cidr,
        label: t.ipv6Types[info.type.labelKey],
        rfc: info.type.rfc,
        routable: info.type.routable,
      },
      multicastScope: info.scope && {
        value: info.scope.value,
        label: t.scopes[info.scope.key],
      },
      subnetRouterAnycast:
        info.subnetRouterAnycast === null ? null : compressIPv6(info.subnetRouterAnycast),
      solicitedNodeMulticast: compressIPv6(info.solicitedNode),
      embeddedMac: info.embeddedMac,
    },
    null,
    2,
  );
}

export function subnets6ToCsv(
  subnets: Ipv6SubnetInfo[],
  t: Translation,
  locale: string,
): string {
  const l = t.labels;
  const header = tableHeader([
    l.cidr,
    l.network,
    l.firstUsable6,
    l.lastAddress6,
    l.prefixIidBits,
    l.totalAddresses6,
  ]);
  const lines = subnets.map((s) =>
    [
      s.cidr,
      compressIPv6(s.network),
      compressIPv6(s.firstUsable),
      compressIPv6(s.lastAddress),
      `${s.prefix} / ${s.hostBits}`,
      formatBigCount(s.totalAddresses, locale),
    ]
      .map(csvCell)
      .join(';'),
  );
  return [header, ...lines].join('\r\n');
}

export function download(filename: string, content: string, mime: string): void {
  const blob = new Blob([content], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export { format };
