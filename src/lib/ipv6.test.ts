import { describe, it, expect } from 'vitest';
import { codeOf } from './testUtils';
import {
  IPv6Error,
  UINT128_MAX,
  parseIPv6,
  expandIPv6,
  compressIPv6,
  ipv6ToHex,
  maskFromPrefix6,
  parsePrefix6,
  typeOf,
  multicastScope,
  macFromInterfaceId,
  solicitedNodeMulticast,
  describeSubnet6,
  parseCidr6,
  prefixForAddresses6,
  rangeToCidrs6,
  analyzeRange6,
  splitSubnet6,
  formatBigCount,
} from './ipv6';

describe('parseIPv6', () => {
  it('lit la forme complète', () => {
    expect(parseIPv6('2001:0db8:0000:0000:0000:0000:0000:0001')).toBe(
      0x20010db8000000000000000000000001n,
    );
  });

  it('lit la forme abrégée', () => {
    expect(parseIPv6('2001:db8::1')).toBe(0x20010db8000000000000000000000001n);
    expect(parseIPv6('::')).toBe(0n);
    expect(parseIPv6('::1')).toBe(1n);
    expect(parseIPv6('ff02::1')).toBe(parseIPv6('ff02:0:0:0:0:0:0:1'));
  });

  it('accepte les zéros de tête dans un groupe', () => {
    expect(parseIPv6('2001:0db8::0001')).toBe(parseIPv6('2001:db8::1'));
  });

  it('lit une IPv4 embarquée', () => {
    expect(parseIPv6('::ffff:192.0.2.1')).toBe(0xffffc0000201n);
    expect(parseIPv6('64:ff9b::192.0.2.33')).toBe(parseIPv6('64:ff9b::c000:221'));
  });

  it('accepte les crochets de la notation URL', () => {
    expect(parseIPv6('[2001:db8::1]')).toBe(parseIPv6('2001:db8::1'));
  });

  it('refuse deux « :: »', () => {
    expect(() => parseIPv6('2001::db8::1')).toThrow(IPv6Error);
  });

  it('refuse un « :: » qui ne remplace aucun groupe', () => {
    expect(() => parseIPv6('1:2:3:4:5:6:7::8')).toThrow(IPv6Error);
  });

  it('refuse un nombre de groupes incorrect', () => {
    expect(() => parseIPv6('1:2:3:4:5:6:7')).toThrow(IPv6Error);
    expect(() => parseIPv6('1:2:3:4:5:6:7:8:9')).toThrow(IPv6Error);
  });

  it('refuse un groupe hors format', () => {
    expect(() => parseIPv6('2001:db8::gggg')).toThrow(IPv6Error);
    expect(() => parseIPv6('2001:db8::12345')).toThrow(IPv6Error);
  });

  it('refuse un identifiant de zone', () => {
    expect(codeOf(() => parseIPv6('fe80::1%eth0'))).toBe('zoneIdUnsupported');
  });

  it('refuse une IPv4 embarquée ailleurs qu\'en fin d\'adresse', () => {
    expect(() => parseIPv6('::192.0.2.1:1')).toThrow(IPv6Error);
  });

  it('refuse un octet IPv4 hors plage ou à zéro de tête', () => {
    expect(() => parseIPv6('::ffff:192.0.2.300')).toThrow(IPv6Error);
    expect(() => parseIPv6('::ffff:192.0.2.01')).toThrow(IPv6Error);
  });

  it('refuse une saisie vide ou un préfixe collé', () => {
    expect(() => parseIPv6('  ')).toThrow(IPv6Error);
    expect(() => parseIPv6('2001:db8::/32')).toThrow(IPv6Error);
  });
});

describe('compressIPv6 — exemples RFC 5952', () => {
  const cases: Array<[string, string]> = [
    ['2001:0db8:0000:0000:0000:0000:0000:0001', '2001:db8::1'],
    ['2001:db8:0:0:1:0:0:1', '2001:db8::1:0:0:1'], // la plus longue suite gagne
    ['2001:0:0:1:0:0:0:1', '2001:0:0:1::1'], // la suite de 3 l'emporte sur celle de 2
    ['0:0:0:0:0:0:0:0', '::'],
    ['0:0:0:0:0:0:0:1', '::1'],
    ['2001:db8:aaaa:bbbb:cccc:dddd:eeee:0001', '2001:db8:aaaa:bbbb:cccc:dddd:eeee:1'],
  ];
  it.each(cases)('%s -> %s', (input, expected) => {
    expect(compressIPv6(parseIPv6(input))).toBe(expected);
  });

  it('ne compresse pas une suite d\'un seul groupe nul', () => {
    expect(compressIPv6(parseIPv6('2001:db8:0:1:1:1:1:1'))).toBe('2001:db8:0:1:1:1:1:1');
  });

  it('choisit la suite la plus à gauche à longueur égale', () => {
    expect(compressIPv6(parseIPv6('2001:0:0:1:2:0:0:1'))).toBe('2001::1:2:0:0:1');
  });

  it('écrit les IPv4-mappées en notation pointée', () => {
    expect(compressIPv6(parseIPv6('::ffff:192.0.2.1'))).toBe('::ffff:192.0.2.1');
  });

  it('sort du minuscule', () => {
    expect(compressIPv6(parseIPv6('2001:DB8::AB'))).toBe('2001:db8::ab');
  });
});

describe('expandIPv6 / ipv6ToHex', () => {
  it('développe en huit groupes de quatre chiffres', () => {
    expect(expandIPv6(parseIPv6('2001:db8::1'))).toBe('2001:0db8:0000:0000:0000:0000:0000:0001');
    expect(expandIPv6(0n)).toBe('0000:0000:0000:0000:0000:0000:0000:0000');
  });

  it('rend 32 chiffres hexadécimaux', () => {
    expect(ipv6ToHex(1n)).toBe('0x00000000000000000000000000000001');
    expect(ipv6ToHex(UINT128_MAX)).toBe('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF');
  });
});

describe('masques et préfixes', () => {
  it('construit le masque sans déborder de 128 bits', () => {
    expect(maskFromPrefix6(0)).toBe(0n);
    expect(maskFromPrefix6(128)).toBe(UINT128_MAX);
    expect(maskFromPrefix6(64)).toBe(0xffffffffffffffff0000000000000000n);
  });

  it('refuse un préfixe hors plage', () => {
    expect(() => maskFromPrefix6(129)).toThrow(IPv6Error);
    expect(() => parsePrefix6('129')).toThrow(IPv6Error);
    expect(() => parsePrefix6('abc')).toThrow(IPv6Error);
    expect(() => parsePrefix6('')).toThrow(IPv6Error);
  });

  it('accepte « 64 » comme « /64 »', () => {
    expect(parsePrefix6('/64')).toBe(64);
    expect(parsePrefix6('64')).toBe(64);
  });
});

describe('classification', () => {
  it('retient le préfixe le plus spécifique', () => {
    expect(typeOf(parseIPv6('::1'))?.labelKey).toBe('loopback6');
    expect(typeOf(parseIPv6('::'))?.labelKey).toBe('unspecified');
    expect(typeOf(parseIPv6('2001:db8::1'))?.cidr).toBe('2001:db8::/32');
    expect(typeOf(parseIPv6('2001:4860::1'))?.cidr).toBe('2000::/3');
    expect(typeOf(parseIPv6('fd00::1'))?.cidr).toBe('fc00::/7');
    expect(typeOf(parseIPv6('fe80::1'))?.cidr).toBe('fe80::/10');
    expect(typeOf(parseIPv6('ff02::1'))?.cidr).toBe('ff00::/8');
  });

  it('décode la portée multicast', () => {
    expect(multicastScope(parseIPv6('ff02::1'))).toEqual({ key: 'scopeLinkLocal', value: 2 });
    expect(multicastScope(parseIPv6('ff0e::1'))).toEqual({ key: 'scopeGlobal', value: 0xe });
    expect(multicastScope(parseIPv6('2001:db8::1'))).toBeNull();
  });

  it('reconstruit la MAC d\'un identifiant EUI-64 modifié', () => {
    expect(macFromInterfaceId(0x0210_5aff_fe0a_a9c6n)).toBe('00:10:5a:0a:a9:c6');
    expect(macFromInterfaceId(0x0000_0000_0000_0001n)).toBeNull();
  });

  it('calcule le multicast de sollicitation de voisin', () => {
    expect(compressIPv6(solicitedNodeMulticast(parseIPv6('2001:db8::0a:a9c6')))).toBe(
      'ff02::1:ff0a:a9c6',
    );
  });
});

describe('describeSubnet6', () => {
  it('analyse un /64 ordinaire', () => {
    const info = describeSubnet6(parseIPv6('2001:db8:1:2::abcd'), 64);
    expect(info.cidr).toBe('2001:db8:1:2::/64');
    expect(compressIPv6(info.network)).toBe('2001:db8:1:2::');
    expect(compressIPv6(info.lastAddress)).toBe('2001:db8:1:2:ffff:ffff:ffff:ffff');
    expect(info.totalAddresses).toBe(1n << 64n);
    expect(info.usableAddresses).toBe((1n << 64n) - 1n);
    expect(info.subnetRouterAnycast).toBe(info.network);
    expect(info.firstUsable).toBe(info.network + 1n);
    expect(info.interfaceId).toBe(0xabcdn);
    expect(info.hostBits).toBe(64);
  });

  it('traite /128 comme une route hôte', () => {
    const info = describeSubnet6(parseIPv6('2001:db8::1'), 128);
    expect(info.totalAddresses).toBe(1n);
    expect(info.usableAddresses).toBe(1n);
    expect(info.firstUsable).toBe(info.network);
    expect(info.lastUsable).toBe(info.network);
    expect(info.subnetRouterAnycast).toBeNull();
    expect(info.noteKey).toBe('hostRoute6');
  });

  it('traite /127 comme une liaison point-à-point', () => {
    const info = describeSubnet6(parseIPv6('2001:db8::1'), 127);
    expect(info.totalAddresses).toBe(2n);
    expect(info.usableAddresses).toBe(2n);
    expect(info.subnetRouterAnycast).toBeNull();
    expect(info.noteKey).toBe('pointToPoint6');
  });

  it('ne réserve pas d\'anycast dans un bloc multicast', () => {
    const info = describeSubnet6(parseIPv6('ff02::1'), 16);
    expect(info.subnetRouterAnycast).toBeNull();
    expect(info.usableAddresses).toBe(info.totalAddresses);
    expect(info.scope?.key).toBe('scopeLinkLocal');
  });

  it('couvre tout l\'espace en /0', () => {
    const info = describeSubnet6(0n, 0);
    expect(info.totalAddresses).toBe(1n << 128n);
    expect(info.lastAddress).toBe(UINT128_MAX);
  });

  it('refuse un préfixe hors plage', () => {
    expect(() => describeSubnet6(0n, 129)).toThrow(IPv6Error);
  });
});

describe('parseCidr6', () => {
  it('lit les trois notations', () => {
    expect(parseCidr6('2001:db8::/32').prefix).toBe(32);
    expect(parseCidr6('2001:db8:: 32').prefix).toBe(32);
    expect(parseCidr6('2001:db8::1').prefix).toBe(128);
  });

  it('refuse une notation malformée', () => {
    expect(() => parseCidr6('2001:db8::/32/2')).toThrow(IPv6Error);
    expect(() => parseCidr6('')).toThrow(IPv6Error);
  });
});

describe('prefixForAddresses6', () => {
  it('rend le plus petit préfixe suffisant', () => {
    expect(prefixForAddresses6(1n)).toBe(128);
    expect(prefixForAddresses6(2n)).toBe(127);
    expect(prefixForAddresses6(3n)).toBe(126);
    expect(prefixForAddresses6(1n << 64n)).toBe(64);
    expect(prefixForAddresses6((1n << 64n) + 1n)).toBe(63);
  });

  it('refuse une demande hors plage', () => {
    expect(() => prefixForAddresses6(0n)).toThrow(IPv6Error);
    expect(() => prefixForAddresses6((1n << 128n) + 1n)).toThrow(IPv6Error);
  });
});

describe('plages', () => {
  it('rend un bloc unique pour une plage alignée', () => {
    const blocks = rangeToCidrs6(parseIPv6('2001:db8::'), parseIPv6('2001:db8::ff'));
    expect(blocks).toHaveLength(1);
    expect(blocks[0].prefix).toBe(120);
  });

  it('décompose une plage non alignée', () => {
    const start = parseIPv6('2001:db8::5');
    const end = parseIPv6('2001:db8::82');
    const blocks = rangeToCidrs6(start, end);
    // Couverture exacte, sans trou ni recouvrement.
    let cursor = start;
    for (const b of blocks) {
      expect(b.network).toBe(cursor);
      cursor += 1n << BigInt(128 - b.prefix);
    }
    expect(cursor - 1n).toBe(end);
  });

  it('signale le débordement du bloc englobant', () => {
    const r = analyzeRange6(parseIPv6('2001:db8::5'), parseIPv6('2001:db8::82'));
    expect(r.count).toBe(126n);
    expect(r.exact).toBe(false);
    expect(r.enclosing.cidr).toBe('2001:db8::/120');
    expect(r.enclosing.totalAddresses).toBe(256n);
  });

  it('reconnaît une plage exactement alignée', () => {
    const r = analyzeRange6(parseIPv6('2001:db8::'), parseIPv6('2001:db8::ffff'));
    expect(r.exact).toBe(true);
    expect(r.cidrs).toHaveLength(1);
    expect(r.cidrs[0].cidr).toBe('2001:db8::/112');
  });

  it('supporte la plage complète sans déborder', () => {
    const r = analyzeRange6(0n, UINT128_MAX);
    expect(r.count).toBe(1n << 128n);
    expect(r.cidrs).toHaveLength(1);
    expect(r.cidrs[0].prefix).toBe(0);
  });

  it('refuse une plage inversée', () => {
    expect(() => analyzeRange6(2n, 1n)).toThrow(IPv6Error);
  });
});

describe('splitSubnet6', () => {
  it('découpe un /48 en /52', () => {
    const r = splitSubnet6(parseIPv6('2001:db8:1::'), 48, 52);
    expect(r.total).toBe(16n);
    expect(r.truncated).toBe(false);
    expect(r.subnets[0].cidr).toBe('2001:db8:1::/52');
    expect(r.subnets[1].cidr).toBe('2001:db8:1:1000::/52');
    expect(r.subnets[15].cidr).toBe('2001:db8:1:f000::/52');
  });

  it('tronque au-delà de la limite', () => {
    const r = splitSubnet6(parseIPv6('2001:db8::'), 32, 64, 8);
    expect(r.total).toBe(1n << 32n);
    expect(r.subnets).toHaveLength(8);
    expect(r.truncated).toBe(true);
  });

  it('refuse un préfixe plus large que le bloc', () => {
    expect(() => splitSubnet6(0n, 64, 48)).toThrow(IPv6Error);
  });
});

describe('formatBigCount', () => {
  it('groupe les petits nombres selon la locale', () => {
    expect(formatBigCount(254n, 'fr-FR')).toBe('254');
    expect(formatBigCount(65536n, 'fr-FR').replace(/\s/g, ' ')).toBe('65 536');
    expect(formatBigCount(65536n, 'en-US')).toBe('65,536');
  });

  it('rend les grandes puissances de deux en exposant', () => {
    expect(formatBigCount(1n << 64n, 'fr-FR')).toMatch(/^2\^64 /);
    expect(formatBigCount(1n << 128n, 'fr-FR')).toMatch(/^2\^128 /);
  });

  it('localise le séparateur décimal de l\'ordre de grandeur', () => {
    expect(formatBigCount((1n << 64n) + 1n, 'fr-FR')).toBe('≈ 1,84 × 10^19');
    expect(formatBigCount((1n << 64n) + 1n, 'en-US')).toBe('≈ 1.84 × 10^19');
  });
});
