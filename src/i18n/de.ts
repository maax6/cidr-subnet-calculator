import type { Translation } from './types';

const de: Translation = {
  meta: { label: 'Deutsch', locale: 'de-DE' },

  labels: {
    cidr: 'CIDR-Notation',
    network: 'Netzadresse',
    broadcast: 'Broadcast-Adresse',
    blockLastAddress: 'Letzte Adresse des Blocks',
    netmask: 'Subnetzmaske',
    wildcard: 'Wildcard-Maske',
    firstUsable: 'Erste nutzbare',
    lastUsable: 'Letzte nutzbare',
    usableHosts: 'Nutzbare Hosts',
    totalAddresses: 'Adressen gesamt',
    prefixHostBits: 'Netz- / Hostbits',
    hex: 'Hexadezimal (Netz)',
    ipClass: 'Historische Klasse',
    addressInput: 'Eingegebene Adresse',
    scopePrivate: 'Privater Adressbereich',
    scopePublic: 'Öffentlicher Adressbereich',
    specialUse: 'Sondernutzung',
    hostInBlock: 'Host innerhalb des Blocks',
    addressIsBroadcast: 'Broadcast-Adresse eingegeben',
    binary: 'Binärdarstellung',
    split: 'Unterteilung in Subnetze',
    compressed: 'Komprimierte Form',
    expanded: 'Vollständige Form',
    hex6: 'Hexadezimal',
    prefix6: 'Präfixlänge',
    prefixIidBits: 'Präfix- / Interface-Bits',
    interfaceId: 'Interface-Identifier',
    lastAddress6: 'Letzte Adresse des Blocks',
    totalAddresses6: 'Adressen gesamt',
    usableAddresses6: 'Zuweisbare Adressen',
    firstUsable6: 'Erste zuweisbare',
    lastUsable6: 'Letzte zuweisbare',
    subnetRouterAnycast: 'Subnet-Router-Anycast',
    ipv6Type: 'Adresstyp',
    multicastScope: 'Multicast-Reichweite',
    solicitedNode: 'Solicited-Node-Multicast',
    embeddedMac: 'Abgeleitete MAC (EUI-64)',
    ula: 'Unique Local Address (ULA)',
    linkLocal: 'Link-lokal',
    split6: 'Unterteilung in Subnetze',
    rangeStart: 'Anfang',
    rangeEnd: 'Ende',
    rangeCount: 'Anzahl Adressen',
    enclosing: 'Umschließender Block',
    overflow: 'Überhang des umschließenden Blocks',
    cidrBlocks: 'CIDR-Blöcke',
    exactBlock: 'Bereich auf einen Block ausgerichtet',
    minimalDecomposition: 'Minimale Zerlegung in CIDR-Blöcke',
  },

  glossary: {
    cidr: {
      terme: 'CIDR-Notation',
      court:
        'Die Schreibweise „Adresse/Länge" eines Blocks: Die Länge gibt an, wie viele führende Bits alle Adressen des Blocks gemeinsam haben.',
      detail:
        '10.0.0.0/24 = die ersten 24 Bits liegen fest, die letzten 8 variieren. Je größer die Zahl, desto kleiner der Block.',
      rfc: 'RFC 4632',
    },
    network: {
      terme: 'Netzadresse',
      court:
        'Die erste Adresse des Blocks, alle Hostbits auf null. Sie benennt den Block in einer Routing-Tabelle.',
      detail:
        'In IPv4 ist sie reserviert und lässt sich keinem Rechner zuweisen (außer bei /31 und /32).',
    },
    broadcast: {
      terme: 'Broadcast-Adresse',
      court:
        'Die letzte Adresse des Blocks, alle Hostbits auf eins. Ein Paket dorthin erreicht jeden Rechner im Netz.',
      detail:
        'Sie ist reserviert und wird deshalb von den nutzbaren Hosts abgezogen. /31- und /32-Blöcke haben keine.',
      rfc: 'RFC 919',
    },
    blockLastAddress: {
      terme: 'Letzte Adresse des Blocks',
      court:
        'Die höchste Adresse des Blocks. Hier bleibt sie zuweisbar: Ein /31 oder /32 reserviert keine Broadcast-Adresse.',
      rfc: 'RFC 3021',
    },
    netmask: {
      terme: 'Subnetzmaske',
      court:
        'Bits auf 1 markieren den Netzanteil der Adresse, Bits auf 0 den Hostanteil. Ein logisches UND aus Adresse und Maske ergibt die Netzadresse.',
      detail:
        'Eine gültige Maske ist eine ununterbrochene Folge von Einsen gefolgt von Nullen: 255.255.240.0 (= /20) ist gültig, 255.0.255.0 nicht.',
    },
    wildcard: {
      terme: 'Wildcard-Maske',
      court: 'Das bitweise Gegenstück zur Subnetzmaske: Bits auf 1 dürfen variieren.',
      detail:
        'Das Format, das Cisco-IOS-Zugriffslisten erwarten: 10.0.0.0 0.0.0.255 bezeichnet dort denselben Block wie 10.0.0.0/24.',
    },
    firstUsable: {
      terme: 'Erste nutzbare Adresse',
      court: 'Die kleinste Adresse, die einem Rechner im Netz zugewiesen werden kann.',
      detail: 'In IPv4 ist das die Netzadresse + 1, da die Netzadresse selbst reserviert ist.',
    },
    lastUsable: {
      terme: 'Letzte nutzbare Adresse',
      court: 'Die größte Adresse, die einem Rechner im Netz zugewiesen werden kann.',
      detail:
        'In IPv4 ist das Broadcast − 1. Sie wird oft für das Gateway gewählt, die erste ebenso: Die Konvention ist eine örtliche Frage.',
    },
    usableHosts: {
      terme: 'Nutzbare Hosts',
      court: 'Wie viele Rechner der Block tatsächlich adressieren kann.',
      detail:
        'In IPv4: Adressen gesamt − 2 (Netz und Broadcast). Ausnahmen: /31 ergibt 2 und /32 ergibt 1.',
    },
    totalAddresses: {
      terme: 'Adressen gesamt',
      court: 'Die Größe des Blocks einschließlich Reservierungen: 2 hoch der Zahl der Hostbits.',
      detail: 'Ein /24 fasst 2^8 = 256 Adressen, davon 254 nutzbare.',
    },
    prefixHostBits: {
      terme: 'Netzbits / Hostbits',
      court:
        'Die Aufteilung der 32 Bits der Adresse: Die vorderen bezeichnen das Netz, die hinteren den Rechner darin.',
      detail: 'Beide ergeben zusammen stets 32. Ein Hostbit mehr verdoppelt die Blockgröße.',
    },
    hex: {
      terme: 'Hexadezimal',
      court:
        'Die Adresse zur Basis 16, so wie sie in Mitschnitten und Systemtabellen erscheint.',
      detail: '10.0.0.0 schreibt sich 0x0A000000.',
    },
    ipClass: {
      terme: 'Historische Klasse',
      court:
        'Die starre Einteilung in Klassen A / B / C vor CIDR: Die ersten Bits der Adresse gaben die Blockgröße vor.',
      detail:
        '1993 zugunsten variabler Präfixlängen aufgegeben. Hier rein informativ, kein modernes Gerät routet danach.',
      rfc: 'RFC 1519',
    },
    addressInput: {
      terme: 'Eingegebene Adresse',
      court: 'Die eingegebene Adresse, bevor die Maske angewandt wird.',
      detail:
        'Trägt sie Hostbits ungleich null, bezeichnet sie einen Rechner im Block, und angezeigt wird der Block, der ihn enthält.',
    },
    scopePrivate: {
      terme: 'Privater Adressbereich',
      court:
        'Ein für interne Netze reservierter Block: Diese Adressen werden im Internet nicht geroutet und verlassen das Netz hinter einem NAT.',
      detail: '10.0.0.0/8, 172.16.0.0/12 und 192.168.0.0/16.',
      rfc: 'RFC 1918',
    },
    scopePublic: {
      terme: 'Öffentlicher Adressbereich',
      court:
        'Ein im Internet routbarer Block, von einer regionalen Vergabestelle (RIPE, ARIN, APNIC…) an einen Betreiber oder eine Organisation zugeteilt.',
    },
    specialUse: {
      terme: 'Sondernutzung',
      court:
        'Ein Block, den die IANA außerhalb der gewöhnlichen Vergabe für eine bestimmte Funktion reserviert: Dokumentation, Loopback, Multicast, Link-lokal…',
      detail:
        'Die vollständige Liste steht im IANA Special-Purpose Address Registry; jeder Eintrag verweist auf die definierende RFC.',
      rfc: 'RFC 6890',
    },
    hostInBlock: {
      terme: 'Host innerhalb des Blocks',
      court:
        'Die eingegebene Adresse hat gesetzte Hostbits: Sie bezeichnet einen Rechner, und angezeigt wird der Block, zu dem er gehört.',
    },
    addressIsBroadcast: {
      terme: 'Broadcast-Adresse eingegeben',
      court:
        'Die eingegebene Adresse ist die letzte des Blocks und dem Broadcast vorbehalten: Keine Schnittstelle kann sie tragen.',
    },
    binary: {
      terme: 'Binärdarstellung',
      court:
        'Die Bits der Adresse, beiderseits der von der Maske gezogenen Grenze eingefärbt: Netzanteil links, Hostanteil rechts.',
      detail:
        'Diese Ansicht macht sichtbar, was die Maske tut: Das logische UND der ersten beiden Zeilen ergibt die dritte.',
    },
    split: {
      terme: 'Unterteilung in Subnetze',
      court:
        'Die Aufteilung eines Blocks in gleich große Teilblöcke durch Verlängern des Präfixes. Jedes zusätzliche Präfixbit halbiert den Block.',
      detail: 'Ein /24, in /26 unterteilt, ergibt 4 Subnetze zu je 62 nutzbaren Hosts.',
    },
    compressed: {
      terme: 'Komprimierte Form',
      court:
        'Die kanonische Schreibweise der Adresse: Hexadezimal in Kleinbuchstaben, führende Nullen entfernt, die längste Folge von Nullgruppen durch „::" ersetzt.',
      detail:
        'Nur ein „::" je Adresse, und nie für eine einzelne Nullgruppe. Das ist die Form für Konfigurationen und Zonendateien.',
      rfc: 'RFC 5952',
    },
    expanded: {
      terme: 'Vollständige Form',
      court:
        'Alle acht Gruppen zu vier Hexadezimalziffern, ohne jede Abkürzung. Die Form für den zeichenweisen Vergleich.',
      detail: '2001:db8::1 schreibt sich 2001:0db8:0000:0000:0000:0000:0000:0001.',
    },
    hex6: {
      terme: 'Hexadezimal',
      court:
        'Die 128 Bits der Adresse als eine einzige Hexadezimalzahl, so wie sie im Speicher oder in einem Mitschnitt erscheint.',
    },
    prefix6: {
      terme: 'Präfixlänge',
      court:
        'Wie viele führende Bits des Blocks festliegen. IPv6 kennt keine Punktnotation für Masken: Die Länge genügt.',
      detail:
        'Übliche Größen: /48 für einen Standort, /56 für einen Anschluss, /64 für ein Link-Segment. Ein /64 ist die Größe, die die automatische Adresskonfiguration (SLAAC) erwartet.',
      rfc: 'RFC 4291',
    },
    prefixIidBits: {
      terme: 'Präfixbits / Interface-Bits',
      court:
        'Die Aufteilung der 128 Bits: Die vorderen bezeichnen das Netz, die hinteren die Schnittstelle darin.',
      detail:
        'Die Standardaufteilung setzt die Grenze bei 64 Bit und lässt damit einen 64-Bit-Interface-Identifier.',
    },
    interfaceId: {
      terme: 'Interface-Identifier (IID)',
      court:
        'Der untere Teil der Adresse, der Schnittstellen innerhalb des Link-Segments unterscheidet.',
      detail:
        'Er kann aus der MAC abgeleitet (modifiziertes EUI-64), zum Schutz der Privatsphäre zufällig gewählt und erneuert (RFC 8981) oder von Hand gesetzt sein.',
      rfc: 'RFC 4291',
    },
    lastAddress6: {
      terme: 'Letzte Adresse des Blocks',
      court:
        'Die höchste Adresse des Blocks, alle freien Bits auf eins. IPv6 kennt keinen Broadcast, diese Adresse bleibt also zuweisbar.',
      detail: 'Alle Knoten des Link-Segments erreicht man stattdessen über den Multicast ff02::1.',
      rfc: 'RFC 4291',
    },
    totalAddresses6: {
      terme: 'Adressen gesamt',
      court: 'Die Größe des Blocks: 2 hoch der Zahl der vom Präfix freigelassenen Bits.',
      detail: 'Ein /64 fasst 2^64 Adressen — mehr als der gesamte IPv4-Raum zum Quadrat.',
    },
    usableAddresses6: {
      terme: 'Zuweisbare Adressen',
      court:
        'Die Adressen, die eine Schnittstelle annehmen kann: alle des Blocks außer der Null-Adresse, die den Routern gehört.',
      detail: 'In der Praxis ist die Grenze in IPv6 nie zahlenmäßig: Ein /64 bleibt unerschöpflich.',
    },
    firstUsable6: {
      terme: 'Erste zuweisbare Adresse',
      court:
        'Die kleinste Adresse, die eine Schnittstelle im Block annehmen kann: die Netzadresse + 1, da die Null-Adresse den Routern zufällt.',
      detail: 'Bei /127 und /128 ist keine reserviert: Der Block beginnt bei seiner Netzadresse.',
    },
    lastUsable6: {
      terme: 'Letzte zuweisbare Adresse',
      court:
        'Die größte Adresse, die eine Schnittstelle annehmen kann: die letzte des Blocks, da IPv6 keine Broadcast-Adresse reserviert.',
      detail:
        'RFC 2526 reserviert allerdings die letzten 128 Adressen jedes Blocks für Anycast-Zwecke.',
    },
    subnetRouterAnycast: {
      terme: 'Subnet-Router-Anycast',
      court:
        'Die Null-Adresse des Blocks, die jeder Router am Link-Segment trägt: Ein Paket dorthin erreicht den nächstgelegenen.',
      detail:
        'RFC 2526 reserviert außerdem die letzten 128 Adressen jedes Blocks für weitere Anycast-Zwecke.',
      rfc: 'RFC 4291',
    },
    ipv6Type: {
      terme: 'Adresstyp',
      court: 'Die Rolle des Blocks im IPv6-Adressplan, bestimmt durch seine ersten Bits.',
      detail:
        'Global Unicast 2000::/3, Unique Local fc00::/7, Link-lokal fe80::/10, Multicast ff00::/8, Dokumentation 2001:db8::/32.',
      rfc: 'RFC 4291',
    },
    multicastScope: {
      terme: 'Multicast-Reichweite',
      court:
        'Wie weit ein Multicast-Paket getragen wird, abzulesen am zweiten Halbbyte der Adresse.',
      detail:
        'ff02:: bleibt auf dem Link-Segment, ff05:: am Standort, ff0e:: durchquert das Internet. ff02::1 meint alle Knoten des Segments, ff02::2 alle Router.',
      rfc: 'RFC 4291',
    },
    solicitedNode: {
      terme: 'Solicited-Node-Multicast',
      court:
        'Die Adresse ff02::1:ff gefolgt von den letzten 24 Bits der Adresse: Sie fragt Neighbor Discovery ab, um einen Nachbarn aufzulösen.',
      detail:
        'Sie ersetzt den ARP-Broadcast von IPv4: Nur die wenigen Schnittstellen mit denselben 24 Bits werden geweckt.',
      rfc: 'RFC 4861',
    },
    embeddedMac: {
      terme: 'Abgeleitete MAC (EUI-64)',
      court:
        'Die aus dem Interface-Identifier rekonstruierte Hardware-Adresse, sofern dieser dem modifizierten EUI-64-Format folgt.',
      detail:
        'Erkennbar am eingeschobenen Muster ff:fe. Dieses Format verrät den Hersteller und folgt dem Gerät von Netz zu Netz — der Grund für die zufälligen Identifier der RFC 8981.',
      rfc: 'RFC 4291',
    },
    ula: {
      terme: 'Unique Local Address (ULA)',
      court:
        'Das fc00::/7 von IPv6: eine interne Adressierung, im Internet nicht geroutet, deren mittlere 40 Bits zufällig gewählt werden, damit zwei Standorte selten kollidieren.',
      rfc: 'RFC 4193',
    },
    linkLocal: {
      terme: 'Link-lokal',
      court:
        'Das fe80::/10: eine nur auf einem Link-Segment gültige Adresse, die jede IPv6-Schnittstelle automatisch konfiguriert und die nie geroutet wird.',
      detail:
        'Sie trägt Nachbarschaftserkennung und Routing. Außerhalb des Segments braucht sie einen Zone-Identifier („fe80::1%eth0"), um eindeutig zu sein.',
      rfc: 'RFC 4291',
    },
    split6: {
      terme: 'Unterteilung in Subnetze',
      court:
        'Die Aufteilung eines Blocks in gleich große Teilblöcke durch Verlängern des Präfixes.',
      detail:
        'Ein Standort-/48, in /64 unterteilt, ergibt 65.536 Link-Segmente — die Segmentgröße, die IPv6 erwartet.',
    },
    rangeStart: {
      terme: 'Bereichsanfang',
      court: 'Die erste Adresse des untersuchten Intervalls, Grenzen eingeschlossen.',
    },
    rangeEnd: {
      terme: 'Bereichsende',
      court: 'Die letzte Adresse des untersuchten Intervalls, Grenzen eingeschlossen.',
    },
    rangeCount: {
      terme: 'Anzahl Adressen',
      court: 'Wie viele Adressen das Intervall umfasst, Grenzen eingeschlossen: Ende − Anfang + 1.',
    },
    enclosing: {
      terme: 'Umschließender Block',
      court:
        'Der kleinste einzelne CIDR-Block, der den gesamten Bereich enthält. Er greift fast immer über den gewünschten Bereich hinaus.',
      detail:
        'Ein CIDR-Block ist auf eine Zweierpotenz ausgerichtet: 192.168.1.5 – 192.168.1.130 passt in 192.168.1.0/24 und in nichts Engeres.',
    },
    overflow: {
      terme: 'Überhang des umschließenden Blocks',
      court:
        'Wie viele Adressen der umschließende Block über den gewünschten Bereich hinaus abdeckt.',
      detail:
        'Das ist der Preis eines Filters aus einem einzigen Präfix. Die Zerlegung in mehrere Blöcke deckt sich dagegen genau mit dem Bereich.',
    },
    cidrBlocks: {
      terme: 'CIDR-Blöcke',
      court: 'Wie viele Präfixe nötig sind, um den Bereich genau abzudecken, ohne überzugreifen.',
    },
    exactBlock: {
      terme: 'Bereich auf einen Block ausgerichtet',
      court:
        'Der Bereich beginnt an einer Blockgrenze und endet auf der letzten Adresse dieses Blocks: Er lässt sich als ein einziges CIDR-Präfix schreiben.',
    },
    minimalDecomposition: {
      terme: 'Minimale Zerlegung in CIDR-Blöcke',
      court:
        'Die kürzeste Menge von Präfixen, die den Bereich genau abdeckt — die Form für eine ACL oder eine Sicherheitsgruppe.',
      detail:
        'Jeder Block ist auf seine eigene Größe ausgerichtet, weshalb die Aufteilung an den Rändern unregelmäßig wirkt.',
    },
  },

  ui: {
    title: 'CIDR- und Netzbereichsrechner',
    intro:
      'Dieses Werkzeug berechnet alles, was aus einem IPv4- oder IPv6-Präfix folgt: Maske, Netzadresse, nutzbarer Bereich, Adressanzahl, Blocktyp und Sondernutzung (RFC 1918, CGNAT, Dokumentation, ULA, Link-lokal…). Die gesamte Berechnung läuft im Browser, es werden keine Daten an einen Server gesendet.',
    step1: 'Protokoll wählen, dann den Berechnungsmodus.',
    step2: 'Das Ergebnis aktualisiert sich beim Tippen, es gibt nichts zu bestätigen.',
    step3: 'Für die Erklärung eines Begriffs mit der Maus über eine Beschriftung fahren.',
    protocol: 'Protokoll',
    footer:
      'Berechnung zu 100 % im Browser · IPv4 (/0 bis /32, mit /31 RFC 3021 und /32) und IPv6 (/0 bis /128, mit /127 RFC 6164 und /128) · kanonische Formen nach RFC 5952.',

    modeLabel4: 'IPv4-Berechnungsmodus',
    modeLabel6: 'IPv6-Berechnungsmodus',
    mode4Cidr: 'CIDR',
    mode4Range: 'IP-Bereich',
    mode4Netmask: 'Adresse + Maske',
    mode4Hosts: 'Adresse + Hosts',
    mode6Cidr: 'CIDR',
    mode6Range: 'IP-Bereich',
    mode6Prefix: 'Adresse + Präfix',

    fieldCidr4Hint: 'Akzeptiert 10.0.0.0/24, 10.0.0.0/255.255.255.0 oder 10.0.0.0 255.255.255.0',
    fieldCidr6Hint:
      'Akzeptiert 2001:db8::/32, die vollständige Form, eingebettetes IPv4 (::ffff:192.0.2.1) und eckige Klammern',
    fieldRangeStart: 'Startadresse',
    fieldRangeEnd: 'Endadresse',
    fieldAddress: 'Adresse',
    fieldNetmask: 'Subnetzmaske',
    fieldNetmaskHint: '255.255.240.0 oder 20',
    fieldHosts: 'Benötigte Hosts',
    fieldHostsHint: 'Der kleinste Block mit mindestens so vielen nutzbaren Hosts',
    fieldPrefix: 'Präfixlänge',
    fieldPrefixHint: '0 bis 128. /64 für ein Link-Segment, /56 für einen Anschluss, /48 für einen Standort',

    result: 'Ergebnis',
    hoverHint:
      'Für die Erklärung eines Begriffs mit der Maus über eine Beschriftung fahren — oder sie mit der Tastatur ansteuern.',
    binaryRowAddress: 'Adresse',
    binaryRowMask: 'Maske',
    binaryRowNetwork: 'Netz',
    binaryRowBroadcast: 'Broadcast',
    binaryRowLast: 'Letzte',
    networkBits: 'Netzbits',
    hostBits: 'Hostbits',
    prefixBits: 'Präfixbits',
    interfaceBits: 'Interface-Bits',

    newPrefix: 'Neues Präfix',
    noSplit: '— keines —',
    splitOption4: '/{prefix} — {count} Subnetze zu je {size} Hosts',
    splitOption6: '/{prefix} — {count} Subnetze zu je {size} Adressen',
    splitTruncated:
      '{total} Subnetze insgesamt — {shown} angezeigt. Der CSV-Export umfasst die angezeigten Zeilen.',
    splitCapped:
      'Unterteilung bis /{prefix} angeboten: darüber hinaus übersteigt die Zahl der Subnetze, was eine Tabelle zeigen kann.',

    exportJson: 'Als JSON exportieren',
    exportCsv: 'Als CSV exportieren',
    copyJson: 'JSON kopieren',
    exportSubnetsCsv: 'Subnetze exportieren (CSV)',
    exportBlocksCsv: 'Blöcke exportieren (CSV)',
    copyCidrList: 'CIDR-Liste kopieren',

    badgePublic: 'Öffentlich / routbar',
    badgeSpecialUse: 'Sondernutzung',
    badgeUnassigned6: 'Nicht zugeteilter Block',
    badgeHostInBlock: 'Host {address} in {cidr}',
    badgeInterfaceInBlock: 'Schnittstelle {address} in {cidr}',
    badgeAddressIsBroadcast:
      'Die eingegebene Adresse ist die Broadcast-Adresse des Netzes — als Host nicht verwendbar',
    badgeAddressCount: '{count} Adressen',
    badgeBlockCount: '{count} CIDR-Block/Blöcke',
    badgeExact: 'Der Bereich ist genau ein CIDR-Block',
    badgeNotExact: 'Der Bereich entspricht keinem einzelnen Block',
    overflowValue: '{count} Adressen',

    csvField: 'Feld',
    csvValue: 'Wert',
    exportAddressInput: 'Eingegebene Adresse',
    exportPrefixLength: 'Präfixlänge',
    exportUsage: 'Nutzung',
    exportNote: 'Hinweis',
  },

  errors: {
    emptyInput: 'Leere Eingabe',
    leadingZero: 'Mehrdeutige führende Null in „{input}" (Oktett „{octet}")',
    octetOutOfRange: 'Oktett außerhalb des Bereichs in „{input}": {octet} > 255',
    rangeReversed: 'Der Bereichsanfang ist größer als das Ende',
    splitWiderThanBlock: '/{newPrefix} ist weiter als das Netz /{prefix}',
    invalidIPv4: 'Ungültige IPv4-Adresse: „{input}"',
    prefixOutOfRange4: 'Präfix außerhalb des Bereichs: /{prefix} (erwartet 0 bis 32)',
    nonContiguousMask: 'Nicht zusammenhängende Maske: {mask}',
    missingMask: 'Maske oder Präfix fehlt',
    invalidCidr4: 'Ungültige CIDR-Notation: „{input}"',
    hostsNotInteger: 'Die Hostanzahl muss eine ganze Zahl ≥ 1 sein',
    hostsTooLarge: 'Die Hostanzahl übersteigt die Kapazität des IPv4-Raums',
    invalidEmbeddedIPv4: 'Ungültiger IPv4-Teil: „{input}"',
    ipv4MustEnd: 'Der IPv4-Teil muss die Adresse abschließen',
    invalidGroup: 'Ungültige Hexadezimalgruppe: „{group}"',
    zoneIdUnsupported: 'Zone-Identifier nicht unterstützt („%eth0"): bitte entfernen',
    unexpectedPrefix: 'Unerwartete Präfixlänge in einer bloßen Adresse',
    doubleColonTwice: '„::" darf nur einmal vorkommen: „{input}"',
    emptyGroupAroundColon: 'Leere Gruppe neben „::": „{input}"',
    doubleColonNoZeros: '„::" ersetzt keine Nullgruppe: „{input}"',
    groupCountMismatch: '8 Gruppen erwartet, {count} gefunden: „{input}"',
    prefixOutOfRange6: 'Präfix außerhalb des Bereichs: /{prefix} (erwartet 0 bis 128)',
    missingPrefix: 'Präfixlänge fehlt',
    invalidPrefix6: 'Ungültige Präfixlänge: „{input}"',
    addressOutOfSpace: 'Adresse außerhalb des IPv6-Raums',
    invalidCidr6: 'Ungültige CIDR-Notation: „{input}"',
    addressCountMin: 'Die Adressanzahl muss eine ganze Zahl ≥ 1 sein',
    addressCountTooLarge: 'Die Adressanzahl übersteigt die Kapazität des IPv6-Raums',
  },

  notes: {
    hostRoute4: 'Host-Route: eine einzige Adresse, ohne Netz und ohne Broadcast.',
    pointToPoint4: 'Punkt-zu-Punkt-Verbindung (RFC 3021): Beide Adressen sind nutzbar.',
    hostRoute6: 'Host-Route: Der Block schrumpft auf eine einzige Adresse.',
    pointToPoint6:
      'Punkt-zu-Punkt-Verbindung (RFC 6164): Beide Adressen sind nutzbar, da IPv6 keine Broadcast-Adresse reserviert.',
    subnetRouterAnycast6:
      'Die Null-Adresse des Blocks ist der Subnet-Router-Anycast, den die Router am Link-Segment tragen. RFC 2526 reserviert außerdem die letzten 128 Adressen des Blocks für weitere Anycasts.',
  },

  specialUse: {
    thisNetwork: 'Dieses Netz („this network")',
    rfc1918: 'Privat (RFC 1918)',
    cgnat: 'CGNAT / Carrier-grade NAT',
    loopback4: 'Loopback',
    linkLocal4: 'Link-lokal (APIPA)',
    ietfProtocol: 'IETF-Protokollzuweisungen',
    testNet1: 'Dokumentation (TEST-NET-1)',
    as112v4: 'AS112-v4',
    amt: 'AMT',
    relay6to4: '6to4-Relay (veraltet)',
    benchmarking: 'Benchmarking',
    testNet2: 'Dokumentation (TEST-NET-2)',
    testNet3: 'Dokumentation (TEST-NET-3)',
    multicast4: 'Multicast',
    reservedFuture: 'Reserviert (künftige Nutzung)',
    limitedBroadcast: 'Begrenzter Broadcast',
  },

  ipv6Types: {
    unspecified: 'Nicht spezifizierte Adresse',
    loopback6: 'Loopback',
    ipv4Compatible: 'IPv4-kompatibel (veraltet)',
    ipv4Mapped: 'IPv4-gemappt',
    nat64WellKnown: 'NAT64 — bekanntes Präfix',
    nat64Local: 'NAT64 — lokale Nutzung',
    discardOnly: 'Discard-only',
    teredo: 'Teredo',
    orchidv2: 'ORCHIDv2',
    documentation6: 'Dokumentation',
    sixToFour: '6to4 (veraltet)',
    globalUnicast: 'Global Unicast',
    ula6: 'Unique Local (ULA)',
    linkLocal6: 'Link-lokal Unicast',
    multicast6: 'Multicast',
  },

  scopes: {
    scopeReserved: 'reserviert',
    scopeInterfaceLocal: 'interface-lokal',
    scopeLinkLocal: 'link-lokal',
    scopeRealmLocal: 'realm-lokal',
    scopeAdminLocal: 'admin-lokal',
    scopeSiteLocal: 'standort-lokal',
    scopeOrgLocal: 'organisations-lokal',
    scopeGlobal: 'global',
    scopeUnassigned: 'nicht zugeteilt',
  },

  classNotes: {
    classA: 'historisches /8-Präfix',
    classB: 'historisches /16-Präfix',
    classC: 'historisches /24-Präfix',
    classD: 'Multicast',
    classE: 'reserviert',
  },
};

export default de;
