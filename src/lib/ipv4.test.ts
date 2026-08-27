import { describe, it, expect } from 'vitest';
import { codeOf } from './testUtils';
import {
  parseIPv4,
  ipToString,
  ipToBinary,
  maskFromPrefix,
  prefixFromMask,
  parsePrefixOrMask,
  describeSubnet,
  parseCidr,
  prefixForHosts,
  rangeToCidrs,
  analyzeRange,
  splitSubnet,
  classOf,
  isPrivate,
  specialUseOf,
  IPv4Error,
} from './ipv4';

describe('parseIPv4', () => {
  it('parse les adresses valides', () => {
    expect(parseIPv4('0.0.0.0')).toBe(0);
    expect(parseIPv4('255.255.255.255')).toBe(4294967295);
    expect(parseIPv4('192.168.1.1')).toBe(3232235777);
    expect(parseIPv4('  10.0.0.1  ')).toBe(167772161);
  });

  it('refuse les octets hors plage', () => {
    expect(() => parseIPv4('256.0.0.1')).toThrow(IPv4Error);
    expect(() => parseIPv4('1.2.3')).toThrow(IPv4Error);
    expect(() => parseIPv4('1.2.3.4.5')).toThrow(IPv4Error);
  });

  it('refuse les zéros de tête (parser differential / SSRF)', () => {
    expect(codeOf(() => parseIPv4('010.0.0.1'))).toBe('leadingZero');
    expect(parseIPv4('0.0.0.0')).toBe(0); // un « 0 » seul reste valide
  });

  it('fait l aller-retour string <-> uint32', () => {
    for (const ip of ['0.0.0.0', '127.0.0.1', '172.16.31.255', '255.255.255.255']) {
      expect(ipToString(parseIPv4(ip))).toBe(ip);
    }
  });
});

describe('masques', () => {
  it('gère /0 sans déborder sur le décalage modulo 32', () => {
    expect(maskFromPrefix(0)).toBe(0);
    expect(ipToString(maskFromPrefix(0))).toBe('0.0.0.0');
  });

  it('produit des masques non signés', () => {
    expect(maskFromPrefix(1)).toBe(2147483648); // et non -2147483648
    expect(maskFromPrefix(24)).toBe(4294967040);
    expect(maskFromPrefix(32)).toBe(4294967295);
  });

  it('retrouve le préfixe depuis le masque', () => {
    for (let p = 0; p <= 32; p++) {
      expect(prefixFromMask(maskFromPrefix(p))).toBe(p);
    }
  });

  it('refuse les masques non contigus', () => {
    expect(codeOf(() => prefixFromMask(parseIPv4('255.0.255.0')))).toBe('nonContiguousMask');
  });

  it('accepte les trois notations de masque', () => {
    expect(parsePrefixOrMask('24')).toBe(24);
    expect(parsePrefixOrMask('/24')).toBe(24);
    expect(parsePrefixOrMask('255.255.255.0')).toBe(24);
  });
});

describe('describeSubnet', () => {
  it('calcule un /24 classique', () => {
    const s = describeSubnet(parseIPv4('10.0.0.37'), 24);
    expect(ipToString(s.network)).toBe('10.0.0.0');
    expect(ipToString(s.broadcast)).toBe('10.0.0.255');
    expect(ipToString(s.mask)).toBe('255.255.255.0');
    expect(ipToString(s.wildcard)).toBe('0.0.0.255');
    expect(ipToString(s.firstUsable!)).toBe('10.0.0.1');
    expect(ipToString(s.lastUsable!)).toBe('10.0.0.254');
    expect(s.totalAddresses).toBe(256);
    expect(s.usableHosts).toBe(254);
  });

  it('gère /31 (RFC 3021)', () => {
    const s = describeSubnet(parseIPv4('192.0.2.4'), 31);
    expect(s.usableHosts).toBe(2);
    expect(ipToString(s.firstUsable!)).toBe('192.0.2.4');
    expect(ipToString(s.lastUsable!)).toBe('192.0.2.5');
  });

  it('gère /32 (route hôte)', () => {
    const s = describeSubnet(parseIPv4('192.0.2.4'), 32);
    expect(s.totalAddresses).toBe(1);
    expect(s.usableHosts).toBe(1);
    expect(ipToString(s.network)).toBe('192.0.2.4');
    expect(ipToString(s.broadcast)).toBe('192.0.2.4');
  });

  it('gère /0 (route par défaut)', () => {
    const s = describeSubnet(parseIPv4('8.8.8.8'), 0);
    expect(s.totalAddresses).toBe(4294967296);
    expect(s.usableHosts).toBe(4294967294);
    expect(ipToString(s.broadcast)).toBe('255.255.255.255');
  });

  it('ne déborde pas sur les adresses hautes (> 2^31)', () => {
    const s = describeSubnet(parseIPv4('255.255.255.250'), 30);
    expect(ipToString(s.network)).toBe('255.255.255.248');
    expect(ipToString(s.broadcast)).toBe('255.255.255.251');
    expect(ipToString(s.firstUsable!)).toBe('255.255.255.249');
  });
});

describe('parseCidr', () => {
  it('accepte les notations équivalentes', () => {
    expect(parseCidr('10.0.0.0/24').cidr).toBe('10.0.0.0/24');
    expect(parseCidr('10.0.0.0/255.255.255.0').cidr).toBe('10.0.0.0/24');
    expect(parseCidr('10.0.0.0 255.255.255.0').cidr).toBe('10.0.0.0/24');
    expect(parseCidr('10.0.0.1').cidr).toBe('10.0.0.1/32');
  });
});

describe('prefixForHosts', () => {
  it('choisit le plus petit bloc suffisant', () => {
    expect(prefixForHosts(1)).toBe(32);
    expect(prefixForHosts(2)).toBe(31);
    expect(prefixForHosts(3)).toBe(29); // /30 n offre que 2 hôtes
    expect(prefixForHosts(254)).toBe(24);
    expect(prefixForHosts(255)).toBe(23);
    expect(prefixForHosts(1000)).toBe(22);
  });

  it('refuse les entrées absurdes', () => {
    expect(() => prefixForHosts(0)).toThrow(IPv4Error);
    expect(() => prefixForHosts(1.5)).toThrow(IPv4Error);
  });
});

describe('rangeToCidrs', () => {
  it('reconnaît une plage exactement alignée', () => {
    const blocks = rangeToCidrs(parseIPv4('10.0.0.0'), parseIPv4('10.0.0.255'));
    expect(blocks).toHaveLength(1);
    expect(blocks[0].prefix).toBe(24);
  });

  it('décompose une plage non alignée', () => {
    const blocks = rangeToCidrs(parseIPv4('192.168.1.5'), parseIPv4('192.168.1.10'));
    const asText = blocks.map((b) => `${ipToString(b.network)}/${b.prefix}`);
    expect(asText).toEqual([
      '192.168.1.5/32',
      '192.168.1.6/31',
      '192.168.1.8/31',
      '192.168.1.10/32',
    ]);
  });

  it('couvre exactement la plage demandée', () => {
    const start = parseIPv4('172.16.5.13');
    const end = parseIPv4('172.16.9.200');
    const blocks = rangeToCidrs(start, end);
    let covered = 0;
    for (const b of blocks) covered += Math.pow(2, 32 - b.prefix);
    expect(covered).toBe(end - start + 1);
    expect(blocks[0].network).toBe(start);
  });

  it('gère l espace IPv4 complet', () => {
    const blocks = rangeToCidrs(0, 4294967295);
    expect(blocks).toHaveLength(1);
    expect(blocks[0].prefix).toBe(0);
  });

  it('refuse une plage inversée', () => {
    expect(() => rangeToCidrs(10, 1)).toThrow(IPv4Error);
  });
});

describe('analyzeRange', () => {
  it('signale le bloc englobant', () => {
    const r = analyzeRange(parseIPv4('192.168.1.5'), parseIPv4('192.168.1.10'));
    expect(r.count).toBe(6);
    expect(r.enclosing.cidr).toBe('192.168.1.0/28');
    expect(r.exact).toBe(false);
  });

  it('marque les plages exactes', () => {
    const r = analyzeRange(parseIPv4('10.1.0.0'), parseIPv4('10.1.1.255'));
    expect(r.exact).toBe(true);
    expect(r.enclosing.cidr).toBe('10.1.0.0/23');
  });
});

describe('splitSubnet', () => {
  it('découpe un /24 en /26', () => {
    const r = splitSubnet(parseIPv4('10.0.0.0'), 24, 26);
    expect(r.total).toBe(4);
    expect(r.truncated).toBe(false);
    expect(r.subnets.map((s) => s.cidr)).toEqual([
      '10.0.0.0/26',
      '10.0.0.64/26',
      '10.0.0.128/26',
      '10.0.0.192/26',
    ]);
  });

  it('tronque les découpages énormes', () => {
    const r = splitSubnet(parseIPv4('10.0.0.0'), 8, 24, 10);
    expect(r.total).toBe(65536);
    expect(r.subnets).toHaveLength(10);
    expect(r.truncated).toBe(true);
  });

  it('refuse un préfixe plus large que le réseau', () => {
    expect(() => splitSubnet(parseIPv4('10.0.0.0'), 24, 16)).toThrow(IPv4Error);
  });
});

describe('classification', () => {
  it('identifie les classes historiques', () => {
    expect(classOf(parseIPv4('10.0.0.1')).letter).toBe('A');
    expect(classOf(parseIPv4('172.16.0.1')).letter).toBe('B');
    expect(classOf(parseIPv4('192.168.0.1')).letter).toBe('C');
    expect(classOf(parseIPv4('224.0.0.1')).letter).toBe('D');
    expect(classOf(parseIPv4('250.0.0.1')).letter).toBe('E');
  });

  it('identifie les plages RFC 1918', () => {
    expect(isPrivate(parseIPv4('10.255.0.1'))).toBe(true);
    expect(isPrivate(parseIPv4('172.15.0.1'))).toBe(false);
    expect(isPrivate(parseIPv4('172.16.0.1'))).toBe(true);
    expect(isPrivate(parseIPv4('172.31.255.255'))).toBe(true);
    expect(isPrivate(parseIPv4('172.32.0.1'))).toBe(false);
    expect(isPrivate(parseIPv4('192.168.255.1'))).toBe(true);
    expect(isPrivate(parseIPv4('8.8.8.8'))).toBe(false);
  });

  it('identifie les usages spéciaux', () => {
    expect(specialUseOf(parseIPv4('127.0.0.1'))?.rfc).toBe('RFC 1122');
    expect(specialUseOf(parseIPv4('169.254.1.1'))?.labelKey).toBe('linkLocal4');
    expect(specialUseOf(parseIPv4('100.64.0.1'))?.rfc).toBe('RFC 6598');
    expect(specialUseOf(parseIPv4('255.255.255.255'))?.labelKey).toBe('limitedBroadcast');
    expect(specialUseOf(parseIPv4('8.8.8.8'))).toBeNull();
  });

  it('préfère le préfixe le plus spécifique', () => {
    // 192.0.2.0/24 (documentation) est plus spécifique que 192.0.0.0/24 ne l est
    expect(specialUseOf(parseIPv4('192.0.2.1'))?.cidr).toBe('192.0.2.0/24');
  });
});

describe('ipToBinary', () => {
  it('formate 32 bits groupés par octet', () => {
    expect(ipToBinary(parseIPv4('192.168.1.1'))).toBe('11000000.10101000.00000001.00000001');
    expect(ipToBinary(0)).toBe('00000000.00000000.00000000.00000000');
    expect(ipToBinary(4294967295)).toBe('11111111.11111111.11111111.11111111');
  });
});
