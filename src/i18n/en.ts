import type { Translation } from './types';

const en: Translation = {
  meta: { label: 'English', locale: 'en-US' },

  labels: {
    cidr: 'CIDR notation',
    network: 'Network address',
    broadcast: 'Broadcast address',
    blockLastAddress: 'Last address in block',
    netmask: 'Subnet mask',
    wildcard: 'Wildcard mask',
    firstUsable: 'First usable',
    lastUsable: 'Last usable',
    usableHosts: 'Usable hosts',
    totalAddresses: 'Total addresses',
    prefixHostBits: 'Network / host bits',
    hex: 'Hexadecimal (network)',
    ipClass: 'Historical class',
    addressInput: 'Address entered',
    scopePrivate: 'Private address space',
    scopePublic: 'Public address space',
    specialUse: 'Special-purpose',
    hostInBlock: 'Host inside the block',
    addressIsBroadcast: 'Broadcast address entered',
    binary: 'Binary view',
    split: 'Subnetting',
    compressed: 'Compressed form',
    expanded: 'Expanded form',
    hex6: 'Hexadecimal',
    prefix6: 'Prefix length',
    prefixIidBits: 'Prefix / interface bits',
    interfaceId: 'Interface identifier',
    lastAddress6: 'Last address in block',
    totalAddresses6: 'Total addresses',
    usableAddresses6: 'Assignable addresses',
    firstUsable6: 'First assignable',
    lastUsable6: 'Last assignable',
    subnetRouterAnycast: 'Subnet-Router anycast',
    ipv6Type: 'Address type',
    multicastScope: 'Multicast scope',
    solicitedNode: 'Solicited-node multicast',
    embeddedMac: 'Derived MAC (EUI-64)',
    ula: 'Unique local address (ULA)',
    linkLocal: 'Link-local',
    split6: 'Subnetting',
    rangeStart: 'Start',
    rangeEnd: 'End',
    rangeCount: 'Address count',
    enclosing: 'Enclosing block',
    overflow: 'Enclosing block overshoot',
    cidrBlocks: 'CIDR blocks',
    exactBlock: 'Range aligned to a block',
    minimalDecomposition: 'Minimal CIDR decomposition',
  },

  glossary: {
    cidr: {
      terme: 'CIDR notation',
      court:
        'The "address/length" way of writing a block: the length is how many leading bits every address in the block shares.',
      detail:
        '10.0.0.0/24 = the first 24 bits are fixed, the last 8 vary. The larger the number, the smaller the block.',
      rfc: 'RFC 4632',
    },
    network: {
      terme: 'Network address',
      court:
        'The first address in the block, with every host bit at zero. This is what names the block in a routing table.',
      detail: 'In IPv4 it is reserved and cannot be assigned to a machine (except in /31 and /32).',
    },
    broadcast: {
      terme: 'Broadcast address',
      court:
        'The last address in the block, with every host bit at one. A packet sent to it reaches every machine on the network.',
      detail: 'Reserved, so it is subtracted from the usable host count. /31 and /32 blocks have none.',
      rfc: 'RFC 919',
    },
    blockLastAddress: {
      terme: 'Last address in block',
      court:
        'The highest address in the block. Here it stays assignable: a /31 or /32 reserves no broadcast address.',
      rfc: 'RFC 3021',
    },
    netmask: {
      terme: 'Subnet mask',
      court:
        'Bits set to 1 mark the network part of the address, bits set to 0 the host part. A logical AND of address and mask yields the network address.',
      detail:
        'A valid mask is an unbroken run of 1s followed by a run of 0s: 255.255.240.0 (= /20) is valid, 255.0.255.0 is not.',
    },
    wildcard: {
      terme: 'Wildcard mask',
      court: 'The bitwise inverse of the subnet mask: bits set to 1 are the ones allowed to vary.',
      detail:
        'The form Cisco IOS access control lists expect: 10.0.0.0 0.0.0.255 there names the same block as 10.0.0.0/24.',
    },
    firstUsable: {
      terme: 'First usable address',
      court: 'The lowest address assignable to a machine on the network.',
      detail: 'In IPv4 that is the network address + 1, the network address itself being reserved.',
    },
    lastUsable: {
      terme: 'Last usable address',
      court: 'The highest address assignable to a machine on the network.',
      detail:
        'In IPv4 that is broadcast − 1. It is a common choice for the gateway, as is the first one: the convention is a local matter.',
    },
    usableHosts: {
      terme: 'Usable hosts',
      court: 'How many machines the block can actually address.',
      detail:
        'In IPv4: total addresses − 2 (network and broadcast). Exceptions: /31 gives 2 and /32 gives 1.',
    },
    totalAddresses: {
      terme: 'Total addresses',
      court: 'The size of the block, reservations included: 2 to the power of the host bits.',
      detail: 'A /24 holds 2^8 = 256 addresses, of which 254 are usable.',
    },
    prefixHostBits: {
      terme: 'Network bits / host bits',
      court:
        'How the 32 bits of the address are split: the leading ones identify the network, the rest the machine inside it.',
      detail: 'The two always add up to 32. One more host bit doubles the size of the block.',
    },
    hex: {
      terme: 'Hexadecimal',
      court:
        'The address written in base 16, the way it shows up in packet captures and system tables.',
      detail: '10.0.0.0 is written 0x0A000000.',
    },
    ipClass: {
      terme: 'Historical class',
      court:
        'The rigid A / B / C split that predates CIDR: the leading bits of the address dictated the size of the block.',
      detail:
        'Dropped in 1993 in favour of variable-length prefixes. Shown here for information only; no modern device routes by it.',
      rfc: 'RFC 1519',
    },
    addressInput: {
      terme: 'Address entered',
      court: 'The address given as input, before the mask is applied.',
      detail:
        'If it carries non-zero host bits it names a machine inside the block, and the block shown is the one containing it.',
    },
    scopePrivate: {
      terme: 'Private address space',
      court:
        'A block reserved for internal networks: these addresses are not routed on the Internet and leave through a NAT.',
      detail: '10.0.0.0/8, 172.16.0.0/12 and 192.168.0.0/16.',
      rfc: 'RFC 1918',
    },
    scopePublic: {
      terme: 'Public address space',
      court:
        'A block routable on the Internet, allocated by a regional registry (RIPE, ARIN, APNIC…) to an operator or an organisation.',
    },
    specialUse: {
      terme: 'Special-purpose block',
      court:
        'A block IANA reserves for a specific function outside ordinary allocation: documentation, loopback, multicast, link-local…',
      detail:
        'The full list lives in the IANA Special-Purpose Address Registry; each entry points to the RFC that defines it.',
      rfc: 'RFC 6890',
    },
    hostInBlock: {
      terme: 'Host inside the block',
      court:
        'The address entered has host bits set: it names a machine, and the block shown is the one it belongs to.',
    },
    addressIsBroadcast: {
      terme: 'Broadcast address entered',
      court:
        'The address entered is the last in the block, reserved for broadcast: no interface can carry it.',
    },
    binary: {
      terme: 'Binary view',
      court:
        'The bits of the address, coloured either side of the boundary the mask draws: network part on the left, host part on the right.',
      detail:
        'This is the view that makes the mask visible: a logical AND of the first two rows gives the third.',
    },
    split: {
      terme: 'Subnetting',
      court:
        'Dividing a block into equal-sized sub-blocks by lengthening the prefix. Each bit added to the prefix halves the block.',
      detail: 'A /24 split into /26 gives 4 subnets of 62 usable hosts each.',
    },
    compressed: {
      terme: 'Compressed form',
      court:
        'The canonical way to write the address: lowercase hex, leading zeros dropped, the longest run of zero groups replaced by "::".',
      detail:
        'Only one "::" per address, and never for a single zero group. This is the form to write in a config file or a zone file.',
      rfc: 'RFC 5952',
    },
    expanded: {
      terme: 'Expanded form',
      court:
        'All eight groups of four hex digits, with no abbreviation. The form to compare character by character.',
      detail: '2001:db8::1 is written 2001:0db8:0000:0000:0000:0000:0000:0001.',
    },
    hex6: {
      terme: 'Hexadecimal',
      court:
        'The 128 bits of the address as a single hexadecimal number, the way it appears in memory or in a capture.',
    },
    prefix6: {
      terme: 'Prefix length',
      court:
        'How many leading bits of the block are fixed. IPv6 has no dotted mask notation: the length alone says it.',
      detail:
        'Common sizes: /48 for a site, /56 for a subscriber, /64 for a link. A /64 is the size stateless address autoconfiguration (SLAAC) expects.',
      rfc: 'RFC 4291',
    },
    prefixIidBits: {
      terme: 'Prefix bits / interface bits',
      court:
        'How the 128 bits are split: the leading ones identify the network, the rest the interface inside it.',
      detail:
        'The standard split puts the boundary at 64 bits, leaving a 64-bit interface identifier.',
    },
    interfaceId: {
      terme: 'Interface identifier (IID)',
      court: 'The low part of the address, which tells interfaces apart on the link.',
      detail:
        'It may be derived from the MAC (modified EUI-64), drawn at random and rotated for privacy (RFC 8981), or set by hand.',
      rfc: 'RFC 4291',
    },
    lastAddress6: {
      terme: 'Last address in block',
      court:
        'The highest address in the block, every free bit at one. IPv6 drops broadcast entirely, so this address stays assignable.',
      detail: 'Reaching every node on the link goes through multicast ff02::1 instead.',
      rfc: 'RFC 4291',
    },
    totalAddresses6: {
      terme: 'Total addresses',
      court: 'The size of the block: 2 to the power of the bits the prefix leaves free.',
      detail: 'A /64 holds 2^64 addresses — more than the whole IPv4 space squared.',
    },
    usableAddresses6: {
      terme: 'Assignable addresses',
      court:
        'Addresses an interface can take: every address in the block except the all-zeros one, which belongs to the routers.',
      detail: 'In practice the limit in IPv6 is never numeric: a /64 stays inexhaustible.',
    },
    firstUsable6: {
      terme: 'First assignable address',
      court:
        'The lowest address an interface on the block can take: the network address + 1, the all-zeros one going to the routers.',
      detail: 'In /127 and /128 nothing is reserved: the block starts at its network address.',
    },
    lastUsable6: {
      terme: 'Last assignable address',
      court:
        'The highest address an interface can take: the last in the block, IPv6 reserving no broadcast address.',
      detail: 'RFC 2526 does reserve the last 128 addresses of every block for anycast uses.',
    },
    subnetRouterAnycast: {
      terme: 'Subnet-Router anycast',
      court:
        'The all-zeros address of the block, carried by every router on the link: a packet sent to it reaches the nearest one.',
      detail:
        'RFC 2526 further reserves the last 128 addresses of every block for other anycast uses.',
      rfc: 'RFC 4291',
    },
    ipv6Type: {
      terme: 'Address type',
      court: "The block's role in the IPv6 addressing plan, decided by its leading bits.",
      detail:
        'Global unicast 2000::/3, unique local fc00::/7, link-local fe80::/10, multicast ff00::/8, documentation 2001:db8::/32.',
      rfc: 'RFC 4291',
    },
    multicastScope: {
      terme: 'Multicast scope',
      court: 'How far a multicast packet travels, read from the second nibble of the address.',
      detail:
        'ff02:: stays on the link, ff05:: on the site, ff0e:: crosses the Internet. ff02::1 means every node on the link, ff02::2 every router.',
      rfc: 'RFC 4291',
    },
    solicitedNode: {
      terme: 'Solicited-node multicast',
      court:
        'The address ff02::1:ff followed by the low 24 bits of the address: the one Neighbor Discovery queries to resolve a neighbour.',
      detail:
        'It replaces the IPv4 ARP broadcast: only the few interfaces sharing those 24 bits are woken up.',
      rfc: 'RFC 4861',
    },
    embeddedMac: {
      terme: 'Derived MAC (EUI-64)',
      court:
        'The hardware address reconstructed from the interface identifier, when that identifier follows the modified EUI-64 format.',
      detail:
        'Recognisable by the ff:fe pattern inserted in the middle. This format exposes the vendor and follows the machine from network to network, which is what motivated the random identifiers of RFC 8981.',
      rfc: 'RFC 4291',
    },
    ula: {
      terme: 'Unique local address (ULA)',
      court:
        "IPv6's fc00::/7: internal addressing, never routed on the Internet, whose 40 middle bits are drawn at random so that two sites rarely collide.",
      rfc: 'RFC 4193',
    },
    linkLocal: {
      terme: 'Link-local',
      court:
        'The fe80::/10: an address valid on one link only, configured automatically by every IPv6 interface and never routed.',
      detail:
        'It carries neighbour discovery and routing. Off the link it needs a zone identifier ("fe80::1%eth0") to be unambiguous.',
      rfc: 'RFC 4291',
    },
    split6: {
      terme: 'Subnetting',
      court: 'Dividing a block into equal-sized sub-blocks by lengthening the prefix.',
      detail: 'A site /48 split into /64 gives 65,536 links, the link size IPv6 expects.',
    },
    rangeStart: {
      terme: 'Range start',
      court: 'The first address of the interval under analysis, bounds included.',
    },
    rangeEnd: {
      terme: 'Range end',
      court: 'The last address of the interval under analysis, bounds included.',
    },
    rangeCount: {
      terme: 'Address count',
      court: 'How many addresses the interval holds, bounds included: end − start + 1.',
    },
    enclosing: {
      terme: 'Enclosing block',
      court:
        'The smallest single CIDR block containing the whole range. It almost always overshoots the range asked for.',
      detail:
        'A CIDR block is aligned on a power of two: 192.168.1.5 – 192.168.1.130 fits in 192.168.1.0/24 and nothing tighter.',
    },
    overflow: {
      terme: 'Enclosing block overshoot',
      court: 'How many addresses the enclosing block covers beyond the range asked for.',
      detail:
        'That is the price of a filter written as a single prefix. The multi-block decomposition, by contrast, matches the range exactly.',
    },
    cidrBlocks: {
      terme: 'CIDR blocks',
      court: 'How many prefixes it takes to cover the range exactly, without overshooting.',
    },
    exactBlock: {
      terme: 'Range aligned to a block',
      court:
        'The range starts on a block boundary and ends on that block\'s last address: it writes as a single CIDR prefix.',
    },
    minimalDecomposition: {
      terme: 'Minimal CIDR decomposition',
      court:
        'The shortest set of prefixes covering the range exactly — the form to write into an ACL or a security group.',
      detail:
        'Each block is aligned on its own size, which is why the split looks irregular at the ends.',
    },
  },

  ui: {
    title: 'CIDR & network range calculator',
    intro:
      'This tool works out everything that follows from an IPv4 or IPv6 prefix: mask, network address, usable range, address count, block type and special purpose (RFC 1918, CGNAT, documentation, ULA, link-local…). All computation happens in the browser; no data is sent to a server.',
    step1: 'Pick the protocol, then the calculation mode.',
    step2: 'Results update as you type — there is nothing to submit.',
    step3: 'Hover a result label for an explanation of the term.',
    protocol: 'Protocol',
    footer:
      '100% client-side · IPv4 (/0 to /32, with /31 RFC 3021 and /32) and IPv6 (/0 to /128, with /127 RFC 6164 and /128) · RFC 5952 canonical forms.',

    modeLabel4: 'IPv4 calculation mode',
    modeLabel6: 'IPv6 calculation mode',
    mode4Cidr: 'CIDR',
    mode4Range: 'IP range',
    mode4Netmask: 'Address + Mask',
    mode4Hosts: 'Address + Hosts',
    mode6Cidr: 'CIDR',
    mode6Range: 'IP range',
    mode6Prefix: 'Address + Prefix',

    fieldCidr4Hint: 'Accepts 10.0.0.0/24, 10.0.0.0/255.255.255.0 or 10.0.0.0 255.255.255.0',
    fieldCidr6Hint:
      'Accepts 2001:db8::/32, the expanded form, embedded IPv4 (::ffff:192.0.2.1) and brackets',
    fieldRangeStart: 'Start address',
    fieldRangeEnd: 'End address',
    fieldAddress: 'Address',
    fieldNetmask: 'Subnet mask',
    fieldNetmaskHint: '255.255.240.0 or 20',
    fieldHosts: 'Hosts required',
    fieldHostsHint: 'The smallest block offering at least this many usable hosts',
    fieldPrefix: 'Prefix length',
    fieldPrefixHint: '0 to 128. /64 for a link, /56 for a subscriber, /48 for a site',

    result: 'Result',
    hoverHint: 'Hover a label — or reach it with the keyboard — for an explanation of the term.',
    binaryRowAddress: 'Address',
    binaryRowMask: 'Mask',
    binaryRowNetwork: 'Network',
    binaryRowBroadcast: 'Broadcast',
    binaryRowLast: 'Last',
    networkBits: 'network bits',
    hostBits: 'host bits',
    prefixBits: 'prefix bits',
    interfaceBits: 'interface bits',

    newPrefix: 'New prefix',
    noSplit: '— none —',
    splitOption4: '/{prefix} — {count} subnets of {size} hosts',
    splitOption6: '/{prefix} — {count} subnets of {size} addresses',
    splitTruncated: '{total} subnets in total — {shown} shown. The CSV export covers the rows shown.',
    splitCapped:
      'Split offered down to /{prefix}: beyond that, the number of subnets exceeds what a table can show.',

    exportJson: 'Export as JSON',
    exportCsv: 'Export as CSV',
    copyJson: 'Copy JSON',
    exportSubnetsCsv: 'Export subnets (CSV)',
    exportBlocksCsv: 'Export blocks (CSV)',
    copyCidrList: 'Copy CIDR list',

    badgePublic: 'Public / routable',
    badgeSpecialUse: 'Special-purpose',
    badgeUnassigned6: 'Unassigned block',
    badgeHostInBlock: 'Host {address} in {cidr}',
    badgeInterfaceInBlock: 'Interface {address} in {cidr}',
    badgeAddressIsBroadcast:
      'The address entered is the broadcast address — no host can use it',
    badgeAddressCount: '{count} addresses',
    badgeBlockCount: '{count} CIDR block(s)',
    badgeExact: 'The range is exactly one CIDR block',
    badgeNotExact: 'The range does not match a single block',
    overflowValue: '{count} addresses',

    csvField: 'field',
    csvValue: 'value',
    exportAddressInput: 'Address entered',
    exportPrefixLength: 'Prefix length',
    exportUsage: 'Usage',
    exportNote: 'Note',
  },

  errors: {
    emptyInput: 'Empty input',
    leadingZero: 'Ambiguous leading zero in "{input}" (octet "{octet}")',
    octetOutOfRange: 'Octet out of range in "{input}": {octet} > 255',
    rangeReversed: 'The start of the range is greater than the end',
    splitWiderThanBlock: '/{newPrefix} is wider than the /{prefix} network',
    invalidIPv4: 'Invalid IPv4 address: "{input}"',
    prefixOutOfRange4: 'Prefix out of range: /{prefix} (0 to 32 expected)',
    nonContiguousMask: 'Non-contiguous mask: {mask}',
    missingMask: 'Missing mask or prefix',
    invalidCidr4: 'Invalid CIDR notation: "{input}"',
    hostsNotInteger: 'The host count must be an integer ≥ 1',
    hostsTooLarge: 'The host count exceeds the capacity of the IPv4 space',
    invalidEmbeddedIPv4: 'Invalid IPv4 part: "{input}"',
    ipv4MustEnd: 'The IPv4 part must end the address',
    invalidGroup: 'Invalid hexadecimal group: "{group}"',
    zoneIdUnsupported: 'Zone identifier not supported ("%eth0"): remove it',
    unexpectedPrefix: 'Unexpected prefix length in a bare address',
    doubleColonTwice: '"::" may appear only once: "{input}"',
    emptyGroupAroundColon: 'Empty group next to "::": "{input}"',
    doubleColonNoZeros: '"::" replaces no zero group: "{input}"',
    groupCountMismatch: '8 groups expected, {count} found: "{input}"',
    prefixOutOfRange6: 'Prefix out of range: /{prefix} (0 to 128 expected)',
    missingPrefix: 'Missing prefix length',
    invalidPrefix6: 'Invalid prefix length: "{input}"',
    addressOutOfSpace: 'Address outside the IPv6 space',
    invalidCidr6: 'Invalid CIDR notation: "{input}"',
    addressCountMin: 'The address count must be an integer ≥ 1',
    addressCountTooLarge: 'The address count exceeds the capacity of the IPv6 space',
  },

  notes: {
    hostRoute4: 'Host route: a single address, with no network and no broadcast.',
    pointToPoint4: 'Point-to-point link (RFC 3021): both addresses are usable.',
    hostRoute6: 'Host route: the block narrows to a single address.',
    pointToPoint6:
      'Point-to-point link (RFC 6164): both addresses are usable, IPv6 reserving no broadcast address.',
    subnetRouterAnycast6:
      'The all-zeros address of the block is the Subnet-Router anycast, carried by the routers on the link. RFC 2526 further reserves the last 128 addresses of the block for other anycasts.',
  },

  specialUse: {
    thisNetwork: '"This network"',
    rfc1918: 'Private (RFC 1918)',
    cgnat: 'CGNAT / Carrier-grade NAT',
    loopback4: 'Loopback',
    linkLocal4: 'Link-local (APIPA)',
    ietfProtocol: 'IETF protocol assignments',
    testNet1: 'Documentation (TEST-NET-1)',
    as112v4: 'AS112-v4',
    amt: 'AMT',
    relay6to4: '6to4 relay (deprecated)',
    benchmarking: 'Benchmarking',
    testNet2: 'Documentation (TEST-NET-2)',
    testNet3: 'Documentation (TEST-NET-3)',
    multicast4: 'Multicast',
    reservedFuture: 'Reserved (future use)',
    limitedBroadcast: 'Limited broadcast',
  },

  ipv6Types: {
    unspecified: 'Unspecified address',
    loopback6: 'Loopback',
    ipv4Compatible: 'IPv4-compatible (deprecated)',
    ipv4Mapped: 'IPv4-mapped',
    nat64WellKnown: 'NAT64 — well-known prefix',
    nat64Local: 'NAT64 — local use',
    discardOnly: 'Discard-only',
    teredo: 'Teredo',
    orchidv2: 'ORCHIDv2',
    documentation6: 'Documentation',
    sixToFour: '6to4 (deprecated)',
    globalUnicast: 'Global unicast',
    ula6: 'Unique local (ULA)',
    linkLocal6: 'Link-local unicast',
    multicast6: 'Multicast',
  },

  scopes: {
    scopeReserved: 'reserved',
    scopeInterfaceLocal: 'interface-local',
    scopeLinkLocal: 'link-local',
    scopeRealmLocal: 'realm-local',
    scopeAdminLocal: 'admin-local',
    scopeSiteLocal: 'site-local',
    scopeOrgLocal: 'organization-local',
    scopeGlobal: 'global',
    scopeUnassigned: 'unassigned',
  },

  classNotes: {
    classA: 'historical /8 prefix',
    classB: 'historical /16 prefix',
    classC: 'historical /24 prefix',
    classD: 'multicast',
    classE: 'reserved',
  },
};

export default en;
