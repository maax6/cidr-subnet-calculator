import type { Translation } from './types';

const fr: Translation = {
  meta: { label: 'Français', locale: 'fr-FR' },

  labels: {
    cidr: 'Notation CIDR',
    network: 'Adresse réseau',
    broadcast: 'Adresse de broadcast',
    blockLastAddress: 'Dernière adresse du bloc',
    netmask: 'Masque de sous-réseau',
    wildcard: 'Masque générique',
    firstUsable: 'Première utilisable',
    lastUsable: 'Dernière utilisable',
    usableHosts: 'Hôtes utilisables',
    totalAddresses: 'Adresses totales',
    prefixHostBits: 'Bits réseau / hôte',
    hex: 'Hexadécimal (réseau)',
    ipClass: 'Classe historique',
    addressInput: 'Adresse saisie',
    scopePrivate: 'Adressage privé',
    scopePublic: 'Adressage public',
    specialUse: 'Usage spécial',
    hostInBlock: 'Hôte dans le bloc',
    addressIsBroadcast: 'Adresse de broadcast saisie',
    binary: 'Représentation binaire',
    split: 'Découpage en sous-réseaux',
    compressed: 'Forme compressée',
    expanded: 'Forme complète',
    hex6: 'Hexadécimal',
    prefix6: 'Longueur de préfixe',
    prefixIidBits: 'Bits préfixe / interface',
    interfaceId: "Identifiant d'interface",
    lastAddress6: 'Dernière adresse du bloc',
    totalAddresses6: 'Adresses totales',
    usableAddresses6: 'Adresses assignables',
    firstUsable6: 'Première assignable',
    lastUsable6: 'Dernière assignable',
    subnetRouterAnycast: 'Anycast Subnet-Router',
    ipv6Type: "Type d'adresse",
    multicastScope: 'Portée multicast',
    solicitedNode: 'Multicast sollicité',
    embeddedMac: 'MAC dérivée (EUI-64)',
    ula: 'Unicast unique local (ULA)',
    linkLocal: 'Lien-local',
    split6: 'Découpage en sous-réseaux',
    rangeStart: 'Début',
    rangeEnd: 'Fin',
    rangeCount: "Nombre d'adresses",
    enclosing: 'Bloc englobant',
    overflow: 'Débordement du bloc englobant',
    cidrBlocks: 'Blocs CIDR',
    exactBlock: 'Plage alignée sur un bloc',
    minimalDecomposition: 'Décomposition minimale en blocs CIDR',
  },

  glossary: {
    cidr: {
      terme: 'Notation CIDR',
      court:
        "L'écriture « adresse/longueur » d'un bloc : la longueur donne le nombre de bits de tête communs à toutes les adresses du bloc.",
      detail:
        '10.0.0.0/24 = les 24 premiers bits sont fixes, les 8 derniers varient. Plus le nombre est grand, plus le bloc est petit.',
      rfc: 'RFC 4632',
    },
    network: {
      terme: 'Adresse réseau',
      court:
        "La première adresse du bloc : tous les bits d'hôte à zéro. C'est elle qui désigne le bloc dans une table de routage.",
      detail:
        "En IPv4 elle est réservée et n'est pas attribuable à une machine (sauf en /31 et /32).",
    },
    broadcast: {
      terme: 'Adresse de broadcast',
      court:
        "La dernière adresse du bloc : tous les bits d'hôte à un. Un paquet qui lui est envoyé est reçu par toutes les machines du réseau.",
      detail:
        "Réservée, donc soustraite du nombre d'hôtes utilisables. Les blocs /31 et /32 n'en ont pas.",
      rfc: 'RFC 919',
    },
    blockLastAddress: {
      terme: 'Dernière adresse du bloc',
      court:
        "La plus grande adresse du bloc. Ici elle reste attribuable : un /31 ou un /32 ne réserve pas d'adresse de broadcast.",
      rfc: 'RFC 3021',
    },
    netmask: {
      terme: 'Masque de sous-réseau',
      court:
        "Les bits à 1 marquent la partie réseau de l'adresse, les bits à 0 la partie hôte. Un ET logique entre l'adresse et le masque donne l'adresse réseau.",
      detail:
        "Un masque valide est une suite continue de 1 suivie d'une suite de 0 : 255.255.240.0 (= /20) est valide, 255.0.255.0 ne l'est pas.",
    },
    wildcard: {
      terme: 'Masque générique (wildcard)',
      court:
        "L'inverse bit à bit du masque de sous-réseau : les bits à 1 sont ceux qui peuvent varier.",
      detail:
        "Format attendu par les listes de contrôle d'accès Cisco IOS : 10.0.0.0 0.0.0.255 y désigne le même bloc que 10.0.0.0/24.",
    },
    firstUsable: {
      terme: 'Première adresse utilisable',
      court: 'La plus petite adresse attribuable à une machine du réseau.',
      detail: "En IPv4 c'est l'adresse réseau + 1, l'adresse réseau elle-même étant réservée.",
    },
    lastUsable: {
      terme: 'Dernière adresse utilisable',
      court: 'La plus grande adresse attribuable à une machine du réseau.',
      detail:
        "En IPv4 c'est le broadcast − 1. C'est souvent l'adresse choisie pour la passerelle, la première l'étant tout autant : la convention est locale.",
    },
    usableHosts: {
      terme: 'Hôtes utilisables',
      court: 'Le nombre de machines réellement adressables dans le bloc.',
      detail:
        "En IPv4 : adresses totales − 2 (réseau et broadcast). Exceptions : /31 en donne 2 et /32 en donne 1.",
    },
    totalAddresses: {
      terme: 'Adresses totales',
      court:
        "La taille du bloc, réservations comprises : 2 puissance le nombre de bits d'hôte.",
      detail: 'Un /24 contient 2^8 = 256 adresses, dont 254 utilisables.',
    },
    prefixHostBits: {
      terme: "Bits de réseau / bits d'hôte",
      court:
        "Le partage des 32 bits de l'adresse : les premiers identifient le réseau, les suivants la machine à l'intérieur.",
      detail: "Les deux totalisent toujours 32. Un bit d'hôte de plus double la taille du bloc.",
    },
    hex: {
      terme: 'Hexadécimal',
      court:
        "L'adresse écrite en base 16, telle qu'elle apparaît dans les captures réseau et les tables système.",
      detail: "10.0.0.0 s'écrit 0x0A000000.",
    },
    ipClass: {
      terme: 'Classe historique',
      court:
        "Le découpage rigide en classes A / B / C qui précédait CIDR : les premiers bits de l'adresse imposaient la taille du bloc.",
      detail:
        "Abandonné en 1993 au profit des préfixes de longueur variable. Purement informatif ici, aucun équipement moderne ne s'en sert pour router.",
      rfc: 'RFC 1519',
    },
    addressInput: {
      terme: 'Adresse saisie',
      court: "L'adresse fournie en entrée, avant application du masque.",
      detail:
        "Si elle porte des bits d'hôte non nuls, elle désigne une machine à l'intérieur du bloc, et le bloc affiché est celui qui la contient.",
    },
    scopePrivate: {
      terme: 'Adressage privé',
      court:
        "Un bloc réservé aux réseaux internes : ces adresses ne sont pas routées sur Internet et sortent derrière un NAT.",
      detail: '10.0.0.0/8, 172.16.0.0/12 et 192.168.0.0/16.',
      rfc: 'RFC 1918',
    },
    scopePublic: {
      terme: 'Adressage public',
      court:
        "Un bloc routable sur Internet, alloué par un registre régional (RIPE, ARIN, APNIC…) à un opérateur ou une organisation.",
    },
    specialUse: {
      terme: 'Usage spécial',
      court:
        "Un bloc que l'IANA réserve à une fonction précise, hors allocation ordinaire : documentation, boucle locale, multicast, lien-local…",
      detail:
        "Le registre complet vit dans le IANA Special-Purpose Address Registry ; chaque entrée renvoie à la RFC qui la définit.",
      rfc: 'RFC 6890',
    },
    hostInBlock: {
      terme: 'Hôte dans le bloc',
      court:
        "L'adresse saisie porte des bits d'hôte à 1 : elle désigne une machine, et le bloc affiché est celui auquel elle appartient.",
    },
    addressIsBroadcast: {
      terme: 'Adresse de broadcast saisie',
      court:
        "L'adresse saisie est la dernière du bloc, réservée au broadcast : aucune interface ne peut la porter.",
    },
    binary: {
      terme: 'Représentation binaire',
      court:
        "Les bits de l'adresse, colorés selon la frontière posée par le masque : partie réseau à gauche, partie hôte à droite.",
      detail:
        "C'est la vue qui rend visible ce que fait le masque : le ET logique entre les deux premières lignes donne la troisième.",
    },
    split: {
      terme: 'Découpage en sous-réseaux',
      court:
        "La division d'un bloc en sous-blocs de taille égale, en allongeant le préfixe. Chaque bit ajouté au préfixe divise le bloc en deux.",
      detail: 'Un /24 découpé en /26 donne 4 sous-réseaux de 62 hôtes utilisables chacun.',
    },
    compressed: {
      terme: 'Forme compressée',
      court:
        "L'écriture canonique de l'adresse : hexadécimal minuscule, zéros de tête retirés, plus longue suite de groupes nuls remplacée par « :: ».",
      detail:
        "Une seule « :: » par adresse, et jamais pour un unique groupe nul. C'est la forme à écrire dans une configuration ou un fichier de zone.",
      rfc: 'RFC 5952',
    },
    expanded: {
      terme: 'Forme complète',
      court:
        "Les huit groupes de quatre chiffres hexadécimaux, sans aucune abréviation. La forme à comparer caractère par caractère.",
      detail: "2001:db8::1 s'écrit 2001:0db8:0000:0000:0000:0000:0000:0001.",
    },
    hex6: {
      terme: 'Hexadécimal',
      court:
        "Les 128 bits de l'adresse en un seul nombre hexadécimal, tel qu'il apparaît en mémoire ou dans une capture.",
    },
    prefix6: {
      terme: 'Longueur de préfixe',
      court:
        "Le nombre de bits de tête fixes du bloc. IPv6 n'utilise pas de masque en notation pointée : la longueur suffit.",
      detail:
        "Les tailles usuelles : /48 pour un site, /56 pour un abonné, /64 pour un lien. Un /64 est la taille attendue par la configuration automatique d'adresse (SLAAC).",
      rfc: 'RFC 4291',
    },
    prefixIidBits: {
      terme: "Bits de préfixe / bits d'interface",
      court:
        "Le partage des 128 bits : les premiers identifient le réseau, les suivants l'interface à l'intérieur.",
      detail:
        "Le découpage standard place la frontière à 64 bits, ce qui laisse un identifiant d'interface de 64 bits.",
    },
    interfaceId: {
      terme: "Identifiant d'interface (IID)",
      court: "La partie basse de l'adresse, qui distingue une interface à l'intérieur du lien.",
      detail:
        "Il peut être dérivé de la MAC (EUI-64 modifié), tiré au sort et renouvelé pour la vie privée (RFC 8981), ou configuré à la main.",
      rfc: 'RFC 4291',
    },
    lastAddress6: {
      terme: 'Dernière adresse du bloc',
      court:
        "La plus grande adresse du bloc : tous les bits libres à un. IPv6 supprime la diffusion générale, cette adresse reste donc attribuable.",
      detail: 'La diffusion à tout le lien passe par le multicast ff02::1.',
      rfc: 'RFC 4291',
    },
    totalAddresses6: {
      terme: 'Adresses totales',
      court: 'La taille du bloc : 2 puissance le nombre de bits laissés libres par le préfixe.',
      detail:
        "Un /64 contient 2^64 adresses, soit plus que l'espace IPv4 tout entier élevé au carré.",
    },
    usableAddresses6: {
      terme: 'Adresses assignables',
      court:
        "Les adresses attribuables à une interface : toutes celles du bloc moins l'adresse tout-à-zéro, réservée aux routeurs.",
      detail:
        "En pratique la contrainte n'est jamais numérique en IPv6 : un /64 reste inépuisable.",
    },
    firstUsable6: {
      terme: 'Première adresse assignable',
      court:
        "La plus petite adresse attribuable à une interface du bloc : l'adresse réseau + 1, la tout-à-zéro revenant aux routeurs.",
      detail: "En /127 et /128, aucune adresse n'est réservée : le bloc commence à son adresse réseau.",
    },
    lastUsable6: {
      terme: 'Dernière adresse assignable',
      court:
        "La plus grande adresse attribuable à une interface : la dernière du bloc, IPv6 ne réservant pas d'adresse de diffusion.",
      detail:
        'RFC 2526 réserve toutefois les 128 dernières adresses de chaque bloc à des usages anycast.',
    },
    subnetRouterAnycast: {
      terme: 'Anycast Subnet-Router',
      court:
        "L'adresse tout-à-zéro du bloc, portée par tous les routeurs du lien : un paquet qui lui est envoyé atteint le plus proche.",
      detail:
        "RFC 2526 réserve en outre les 128 dernières adresses de chaque bloc à d'autres usages anycast.",
      rfc: 'RFC 4291',
    },
    ipv6Type: {
      terme: "Type d'adresse",
      court: "Le rôle du bloc dans le plan d'adressage IPv6, déterminé par ses premiers bits.",
      detail:
        'Unicast global 2000::/3, unique local fc00::/7, lien-local fe80::/10, multicast ff00::/8, documentation 2001:db8::/32.',
      rfc: 'RFC 4291',
    },
    multicastScope: {
      terme: 'Portée multicast',
      court:
        "Jusqu'où un paquet multicast est propagé, lu dans le second demi-octet de l'adresse.",
      detail:
        'ff02:: reste sur le lien, ff05:: sur le site, ff0e:: traverse Internet. ff02::1 désigne toutes les machines du lien, ff02::2 tous les routeurs.',
      rfc: 'RFC 4291',
    },
    solicitedNode: {
      terme: 'Multicast de sollicitation de voisin',
      court:
        "L'adresse ff02::1:ff suivie des 24 derniers bits de l'adresse : celle que Neighbor Discovery interroge pour résoudre un voisin.",
      detail:
        "Elle remplace le broadcast ARP d'IPv4 : seules les rares interfaces partageant ces 24 bits sont réveillées.",
      rfc: 'RFC 4861',
    },
    embeddedMac: {
      terme: 'MAC dérivée (EUI-64)',
      court:
        "L'adresse matérielle reconstituée à partir de l'identifiant d'interface, quand celui-ci suit le format EUI-64 modifié.",
      detail:
        "Reconnaissable au motif ff:fe inséré au milieu. Ce format expose le constructeur et suit la machine de réseau en réseau, ce qui a motivé les identifiants aléatoires de la RFC 8981.",
      rfc: 'RFC 4291',
    },
    ula: {
      terme: 'Unicast unique local (ULA)',
      court:
        "Le fc00::/7 d'IPv6 : un adressage interne, non routé sur Internet, dont les 40 bits centraux sont tirés au sort pour éviter les collisions entre sites.",
      rfc: 'RFC 4193',
    },
    linkLocal: {
      terme: 'Lien-local',
      court:
        "Le fe80::/10 : une adresse valable sur un seul lien, configurée automatiquement par toute interface IPv6 et jamais routée.",
      detail:
        "Elle porte le voisinage et le routage : hors du lien, elle exige un identifiant de zone (« fe80::1%eth0 ») pour lever l'ambiguïté.",
      rfc: 'RFC 4291',
    },
    split6: {
      terme: 'Découpage en sous-réseaux',
      court: "La division d'un bloc en sous-blocs de taille égale, en allongeant le préfixe.",
      detail:
        "Un /48 de site découpé en /64 donne 65 536 liens, la taille de lien attendue par IPv6.",
    },
    rangeStart: {
      terme: 'Début de plage',
      court: "La première adresse de l'intervalle analysé, bornes comprises.",
    },
    rangeEnd: {
      terme: 'Fin de plage',
      court: "La dernière adresse de l'intervalle analysé, bornes comprises.",
    },
    rangeCount: {
      terme: "Nombre d'adresses",
      court: "Le nombre d'adresses de l'intervalle, bornes comprises : fin − début + 1.",
    },
    enclosing: {
      terme: 'Bloc englobant',
      court:
        "Le plus petit bloc CIDR unique qui contient toute la plage. Il déborde presque toujours de la plage demandée.",
      detail:
        "Un bloc CIDR est aligné sur une puissance de deux : 192.168.1.5 – 192.168.1.130 tient dans 192.168.1.0/24, jamais dans quelque chose de plus serré.",
    },
    overflow: {
      terme: 'Débordement du bloc englobant',
      court:
        "Le nombre d'adresses que le bloc englobant couvre en trop, hors de la plage demandée.",
      detail:
        "C'est le prix d'un filtre écrit en un seul préfixe. La décomposition en plusieurs blocs, elle, colle exactement à la plage.",
    },
    cidrBlocks: {
      terme: 'Blocs CIDR',
      court: 'Le nombre de préfixes nécessaires pour couvrir la plage exactement, sans déborder.',
    },
    exactBlock: {
      terme: 'Plage alignée sur un bloc',
      court:
        "La plage commence sur une frontière de bloc et se termine sur la dernière adresse de ce bloc : elle s'écrit en un seul préfixe CIDR.",
    },
    minimalDecomposition: {
      terme: 'Décomposition minimale en blocs CIDR',
      court:
        "L'ensemble le plus court de préfixes couvrant la plage exactement — la forme à écrire dans une ACL ou un groupe de sécurité.",
      detail:
        'Chaque bloc est aligné sur sa propre taille, ce qui explique que la découpe soit irrégulière aux extrémités.',
    },
  },

  ui: {
    title: 'Calculateur CIDR & de portée réseau',
    intro:
      "Cet outil calcule tout ce qui découle d'un préfixe IPv4 ou IPv6 : masque, adresse réseau, plage utilisable, nombre d'adresses, type de bloc et usage spécial (RFC 1918, CGNAT, documentation, ULA, lien-local…). Tout le calcul se fait dans le navigateur, aucune donnée n'est envoyée à un serveur.",
    step1: 'Choisir le protocole, puis le mode de calcul.',
    step2: "Le résultat se met à jour à la frappe, il n'y a rien à valider.",
    step3: "Survoler un intitulé de résultat pour l'explication du terme.",
    protocol: 'Protocole',
    footer:
      'Calcul 100 % côté client · IPv4 (/0 à /32, avec /31 RFC 3021 et /32) et IPv6 (/0 à /128, avec /127 RFC 6164 et /128) · formes canoniques RFC 5952.',

    modeLabel4: 'Mode de calcul IPv4',
    modeLabel6: 'Mode de calcul IPv6',
    mode4Cidr: 'CIDR',
    mode4Range: "Plage d'IP",
    mode4Netmask: 'Adresse + Masque',
    mode4Hosts: 'Adresse + Hôtes',
    mode6Cidr: 'CIDR',
    mode6Range: "Plage d'IP",
    mode6Prefix: 'Adresse + Préfixe',

    fieldCidr4Hint: 'Accepte 10.0.0.0/24, 10.0.0.0/255.255.255.0 ou 10.0.0.0 255.255.255.0',
    fieldCidr6Hint:
      "Accepte 2001:db8::/32, la forme complète, l'IPv4 embarquée (::ffff:192.0.2.1) et les crochets",
    fieldRangeStart: 'Adresse de début',
    fieldRangeEnd: 'Adresse de fin',
    fieldAddress: 'Adresse',
    fieldNetmask: 'Masque de sous-réseau',
    fieldNetmaskHint: '255.255.240.0 ou 20',
    fieldHosts: "Nombre d'hôtes requis",
    fieldHostsHint: "Le plus petit bloc offrant au moins ce nombre d'hôtes utilisables",
    fieldPrefix: 'Longueur de préfixe',
    fieldPrefixHint: '0 à 128. /64 pour un lien, /56 pour un abonné, /48 pour un site',

    result: 'Résultat',
    hoverHint: "Survolez un intitulé — ou atteignez-le au clavier — pour l'explication du terme.",
    binaryRowAddress: 'Adresse',
    binaryRowMask: 'Masque',
    binaryRowNetwork: 'Réseau',
    binaryRowBroadcast: 'Broadcast',
    binaryRowLast: 'Dernière',
    networkBits: 'bits de réseau',
    hostBits: "bits d'hôte",
    prefixBits: 'bits de préfixe',
    interfaceBits: "bits d'interface",

    newPrefix: 'Nouveau préfixe',
    noSplit: '— aucun —',
    splitOption4: '/{prefix} — {count} sous-réseaux de {size} hôtes',
    splitOption6: '/{prefix} — {count} sous-réseaux de {size} adresses',
    splitTruncated:
      "{total} sous-réseaux au total — {shown} affichés. L'export CSV reprend les lignes affichées.",
    splitCapped:
      "Découpage proposé jusqu'à /{prefix} : au-delà, le nombre de sous-réseaux dépasse ce qu'une table peut montrer.",

    exportJson: 'Exporter en JSON',
    exportCsv: 'Exporter en CSV',
    copyJson: 'Copier le JSON',
    exportSubnetsCsv: 'Exporter les sous-réseaux (CSV)',
    exportBlocksCsv: 'Exporter les blocs (CSV)',
    copyCidrList: 'Copier la liste CIDR',

    badgePublic: 'Publique / routable',
    badgeSpecialUse: 'Usage spécial',
    badgeUnassigned6: 'Bloc non affecté',
    badgeHostInBlock: 'Hôte {address} dans {cidr}',
    badgeInterfaceInBlock: 'Interface {address} dans {cidr}',
    badgeAddressIsBroadcast:
      "L'adresse saisie est le broadcast du réseau — inutilisable comme hôte",
    badgeAddressCount: '{count} adresses',
    badgeBlockCount: '{count} bloc(s) CIDR',
    badgeExact: 'La plage est un bloc CIDR exact',
    badgeNotExact: 'La plage ne correspond pas à un bloc unique',
    overflowValue: '{count} adresses',

    csvField: 'champ',
    csvValue: 'valeur',
    exportAddressInput: 'Adresse saisie',
    exportPrefixLength: 'Longueur de préfixe',
    exportUsage: 'Usage',
    exportNote: 'Remarque',
  },

  errors: {
    emptyInput: 'Saisie vide',
    leadingZero: 'Zéro de tête ambigu dans « {input} » (octet « {octet} »)',
    octetOutOfRange: 'Octet hors plage dans « {input} » : {octet} > 255',
    rangeReversed: 'Le début de plage est supérieur à la fin',
    splitWiderThanBlock: '/{newPrefix} est plus large que le réseau /{prefix}',
    invalidIPv4: 'Adresse IPv4 invalide : « {input} »',
    prefixOutOfRange4: 'Préfixe hors plage : /{prefix} (attendu 0 à 32)',
    nonContiguousMask: 'Masque non contigu : {mask}',
    missingMask: 'Masque ou préfixe manquant',
    invalidCidr4: 'Notation CIDR invalide : « {input} »',
    hostsNotInteger: "Le nombre d'hôtes doit être un entier ≥ 1",
    hostsTooLarge: "Le nombre d'hôtes dépasse la capacité de l'espace IPv4",
    invalidEmbeddedIPv4: 'Partie IPv4 invalide : « {input} »',
    ipv4MustEnd: "La partie IPv4 doit terminer l'adresse",
    invalidGroup: 'Groupe hexadécimal invalide : « {group} »',
    zoneIdUnsupported: 'Identifiant de zone non pris en charge (« %eth0 ») : retirez-le',
    unexpectedPrefix: 'Longueur de préfixe inattendue dans une adresse seule',
    doubleColonTwice: "« :: » ne peut apparaître qu'une fois : « {input} »",
    emptyGroupAroundColon: 'Groupe vide autour de « :: » : « {input} »',
    doubleColonNoZeros: '« :: » ne remplace aucun groupe de zéros : « {input} »',
    groupCountMismatch: '8 groupes attendus, {count} trouvé(s) : « {input} »',
    prefixOutOfRange6: 'Préfixe hors plage : /{prefix} (attendu 0 à 128)',
    missingPrefix: 'Longueur de préfixe manquante',
    invalidPrefix6: 'Longueur de préfixe invalide : « {input} »',
    addressOutOfSpace: "Adresse hors de l'espace IPv6",
    invalidCidr6: 'Notation CIDR invalide : « {input} »',
    addressCountMin: "Le nombre d'adresses doit être un entier ≥ 1",
    addressCountTooLarge: "Le nombre d'adresses dépasse la capacité de l'espace IPv6",
  },

  notes: {
    hostRoute4: 'Route hôte : une seule adresse, ni réseau ni broadcast.',
    pointToPoint4: 'Liaison point-à-point (RFC 3021) : les deux adresses sont utilisables.',
    hostRoute6: 'Route hôte : le bloc se réduit à une adresse.',
    pointToPoint6:
      "Liaison point-à-point (RFC 6164) : les deux adresses sont utilisables, IPv6 ne réserve pas d'adresse de diffusion.",
    subnetRouterAnycast6:
      "L'adresse tout-à-zéro du bloc est l'anycast Subnet-Router, portée par les routeurs du lien. RFC 2526 réserve en outre les 128 dernières adresses du bloc à d'autres anycasts.",
  },

  specialUse: {
    thisNetwork: 'Ce réseau (« this network »)',
    rfc1918: 'Privée (RFC 1918)',
    cgnat: 'CGNAT / Carrier-grade NAT',
    loopback4: 'Boucle locale (loopback)',
    linkLocal4: 'Lien-local (APIPA)',
    ietfProtocol: 'Assignations de protocole IETF',
    testNet1: 'Documentation (TEST-NET-1)',
    as112v4: 'AS112-v4',
    amt: 'AMT',
    relay6to4: 'Relais 6to4 (déprécié)',
    benchmarking: 'Bancs de test (benchmarking)',
    testNet2: 'Documentation (TEST-NET-2)',
    testNet3: 'Documentation (TEST-NET-3)',
    multicast4: 'Multicast',
    reservedFuture: 'Réservée (usage futur)',
    limitedBroadcast: 'Broadcast limité',
  },

  ipv6Types: {
    unspecified: 'Adresse non spécifiée',
    loopback6: 'Boucle locale (loopback)',
    ipv4Compatible: 'IPv4-compatible (dépréciée)',
    ipv4Mapped: 'IPv4-mappée',
    nat64WellKnown: 'NAT64 — préfixe bien connu',
    nat64Local: 'NAT64 — usage local',
    discardOnly: 'Trou noir (discard-only)',
    teredo: 'Teredo',
    orchidv2: 'ORCHIDv2',
    documentation6: 'Documentation',
    sixToFour: '6to4 (déprécié)',
    globalUnicast: 'Unicast global',
    ula6: 'Unicast unique local (ULA)',
    linkLocal6: 'Lien-local unicast',
    multicast6: 'Multicast',
  },

  scopes: {
    scopeReserved: 'réservée',
    scopeInterfaceLocal: 'interface-locale',
    scopeLinkLocal: 'lien-locale',
    scopeRealmLocal: 'realm-locale',
    scopeAdminLocal: 'admin-locale',
    scopeSiteLocal: 'site-locale',
    scopeOrgLocal: 'organisation-locale',
    scopeGlobal: 'globale',
    scopeUnassigned: 'non affectée',
  },

  classNotes: {
    classA: 'préfixe historique /8',
    classB: 'préfixe historique /16',
    classC: 'préfixe historique /24',
    classD: 'multicast',
    classE: 'réservée',
  },
};

export default fr;
