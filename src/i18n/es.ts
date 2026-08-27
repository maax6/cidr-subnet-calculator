import type { Translation } from './types';

const es: Translation = {
  meta: { label: 'Español', locale: 'es-ES' },

  labels: {
    cidr: 'Notación CIDR',
    network: 'Dirección de red',
    broadcast: 'Dirección de difusión',
    blockLastAddress: 'Última dirección del bloque',
    netmask: 'Máscara de subred',
    wildcard: 'Máscara comodín',
    firstUsable: 'Primera utilizable',
    lastUsable: 'Última utilizable',
    usableHosts: 'Hosts utilizables',
    totalAddresses: 'Direcciones totales',
    prefixHostBits: 'Bits de red / host',
    hex: 'Hexadecimal (red)',
    ipClass: 'Clase histórica',
    addressInput: 'Dirección introducida',
    scopePrivate: 'Direccionamiento privado',
    scopePublic: 'Direccionamiento público',
    specialUse: 'Uso especial',
    hostInBlock: 'Host dentro del bloque',
    addressIsBroadcast: 'Dirección de difusión introducida',
    binary: 'Representación binaria',
    split: 'División en subredes',
    compressed: 'Forma comprimida',
    expanded: 'Forma completa',
    hex6: 'Hexadecimal',
    prefix6: 'Longitud de prefijo',
    prefixIidBits: 'Bits de prefijo / interfaz',
    interfaceId: 'Identificador de interfaz',
    lastAddress6: 'Última dirección del bloque',
    totalAddresses6: 'Direcciones totales',
    usableAddresses6: 'Direcciones asignables',
    firstUsable6: 'Primera asignable',
    lastUsable6: 'Última asignable',
    subnetRouterAnycast: 'Anycast Subnet-Router',
    ipv6Type: 'Tipo de dirección',
    multicastScope: 'Alcance multicast',
    solicitedNode: 'Multicast de nodo solicitado',
    embeddedMac: 'MAC derivada (EUI-64)',
    ula: 'Dirección local única (ULA)',
    linkLocal: 'Enlace-local',
    split6: 'División en subredes',
    rangeStart: 'Inicio',
    rangeEnd: 'Fin',
    rangeCount: 'Número de direcciones',
    enclosing: 'Bloque contenedor',
    overflow: 'Exceso del bloque contenedor',
    cidrBlocks: 'Bloques CIDR',
    exactBlock: 'Rango alineado con un bloque',
    minimalDecomposition: 'Descomposición mínima en bloques CIDR',
  },

  glossary: {
    cidr: {
      terme: 'Notación CIDR',
      court:
        'La escritura «dirección/longitud» de un bloque: la longitud indica cuántos bits iniciales comparten todas las direcciones del bloque.',
      detail:
        '10.0.0.0/24 = los 24 primeros bits son fijos, los 8 últimos varían. Cuanto mayor es el número, menor es el bloque.',
      rfc: 'RFC 4632',
    },
    network: {
      terme: 'Dirección de red',
      court:
        'La primera dirección del bloque, con todos los bits de host a cero. Es la que designa el bloque en una tabla de enrutamiento.',
      detail: 'En IPv4 está reservada y no puede asignarse a una máquina (salvo en /31 y /32).',
    },
    broadcast: {
      terme: 'Dirección de difusión',
      court:
        'La última dirección del bloque, con todos los bits de host a uno. Un paquete enviado a ella lo reciben todas las máquinas de la red.',
      detail:
        'Está reservada, por eso se resta del número de hosts utilizables. Los bloques /31 y /32 no tienen ninguna.',
      rfc: 'RFC 919',
    },
    blockLastAddress: {
      terme: 'Última dirección del bloque',
      court:
        'La dirección más alta del bloque. Aquí sigue siendo asignable: un /31 o un /32 no reserva dirección de difusión.',
      rfc: 'RFC 3021',
    },
    netmask: {
      terme: 'Máscara de subred',
      court:
        'Los bits a 1 marcan la parte de red de la dirección, los bits a 0 la parte de host. Un AND lógico entre dirección y máscara da la dirección de red.',
      detail:
        'Una máscara válida es una serie continua de unos seguida de una serie de ceros: 255.255.240.0 (= /20) es válida, 255.0.255.0 no lo es.',
    },
    wildcard: {
      terme: 'Máscara comodín (wildcard)',
      court: 'El inverso bit a bit de la máscara de subred: los bits a 1 son los que pueden variar.',
      detail:
        'Es el formato que esperan las listas de control de acceso de Cisco IOS: allí 10.0.0.0 0.0.0.255 designa el mismo bloque que 10.0.0.0/24.',
    },
    firstUsable: {
      terme: 'Primera dirección utilizable',
      court: 'La dirección más baja asignable a una máquina de la red.',
      detail: 'En IPv4 es la dirección de red + 1, ya que la propia dirección de red está reservada.',
    },
    lastUsable: {
      terme: 'Última dirección utilizable',
      court: 'La dirección más alta asignable a una máquina de la red.',
      detail:
        'En IPv4 es la de difusión − 1. Suele elegirse para la puerta de enlace, igual que la primera: la convención es local.',
    },
    usableHosts: {
      terme: 'Hosts utilizables',
      court: 'Cuántas máquinas puede direccionar realmente el bloque.',
      detail:
        'En IPv4: direcciones totales − 2 (red y difusión). Excepciones: /31 da 2 y /32 da 1.',
    },
    totalAddresses: {
      terme: 'Direcciones totales',
      court: 'El tamaño del bloque, reservas incluidas: 2 elevado al número de bits de host.',
      detail: 'Un /24 contiene 2^8 = 256 direcciones, de las cuales 254 son utilizables.',
    },
    prefixHostBits: {
      terme: 'Bits de red / bits de host',
      court:
        'El reparto de los 32 bits de la dirección: los primeros identifican la red, los siguientes la máquina dentro de ella.',
      detail: 'Los dos suman siempre 32. Un bit de host más duplica el tamaño del bloque.',
    },
    hex: {
      terme: 'Hexadecimal',
      court:
        'La dirección escrita en base 16, tal como aparece en las capturas de red y en las tablas del sistema.',
      detail: '10.0.0.0 se escribe 0x0A000000.',
    },
    ipClass: {
      terme: 'Clase histórica',
      court:
        'El reparto rígido en clases A / B / C anterior a CIDR: los primeros bits de la dirección imponían el tamaño del bloque.',
      detail:
        'Abandonado en 1993 en favor de los prefijos de longitud variable. Aquí es solo informativo; ningún equipo moderno enruta con ello.',
      rfc: 'RFC 1519',
    },
    addressInput: {
      terme: 'Dirección introducida',
      court: 'La dirección facilitada como entrada, antes de aplicar la máscara.',
      detail:
        'Si lleva bits de host distintos de cero, designa una máquina dentro del bloque, y el bloque mostrado es el que la contiene.',
    },
    scopePrivate: {
      terme: 'Direccionamiento privado',
      court:
        'Un bloque reservado a las redes internas: estas direcciones no se enrutan en Internet y salen tras un NAT.',
      detail: '10.0.0.0/8, 172.16.0.0/12 y 192.168.0.0/16.',
      rfc: 'RFC 1918',
    },
    scopePublic: {
      terme: 'Direccionamiento público',
      court:
        'Un bloque enrutable en Internet, asignado por un registro regional (RIPE, ARIN, APNIC…) a un operador o una organización.',
    },
    specialUse: {
      terme: 'Uso especial',
      court:
        'Un bloque que la IANA reserva para una función concreta, fuera de la asignación ordinaria: documentación, bucle local, multicast, enlace-local…',
      detail:
        'El registro completo está en el IANA Special-Purpose Address Registry; cada entrada remite a la RFC que la define.',
      rfc: 'RFC 6890',
    },
    hostInBlock: {
      terme: 'Host dentro del bloque',
      court:
        'La dirección introducida tiene bits de host a 1: designa una máquina, y el bloque mostrado es aquel al que pertenece.',
    },
    addressIsBroadcast: {
      terme: 'Dirección de difusión introducida',
      court:
        'La dirección introducida es la última del bloque, reservada a la difusión: ninguna interfaz puede llevarla.',
    },
    binary: {
      terme: 'Representación binaria',
      court:
        'Los bits de la dirección, coloreados a ambos lados de la frontera que marca la máscara: parte de red a la izquierda, parte de host a la derecha.',
      detail:
        'Es la vista que hace visible el trabajo de la máscara: el AND lógico de las dos primeras filas da la tercera.',
    },
    split: {
      terme: 'División en subredes',
      court:
        'Dividir un bloque en subbloques del mismo tamaño alargando el prefijo. Cada bit añadido al prefijo parte el bloque en dos.',
      detail: 'Un /24 dividido en /26 da 4 subredes de 62 hosts utilizables cada una.',
    },
    compressed: {
      terme: 'Forma comprimida',
      court:
        'La escritura canónica de la dirección: hexadecimal en minúsculas, ceros iniciales suprimidos, la serie más larga de grupos nulos sustituida por «::».',
      detail:
        'Un solo «::» por dirección, y nunca para un único grupo nulo. Es la forma que se escribe en una configuración o en un archivo de zona.',
      rfc: 'RFC 5952',
    },
    expanded: {
      terme: 'Forma completa',
      court:
        'Los ocho grupos de cuatro dígitos hexadecimales, sin ninguna abreviatura. La forma que se compara carácter a carácter.',
      detail: '2001:db8::1 se escribe 2001:0db8:0000:0000:0000:0000:0000:0001.',
    },
    hex6: {
      terme: 'Hexadecimal',
      court:
        'Los 128 bits de la dirección en un solo número hexadecimal, tal como aparece en memoria o en una captura.',
    },
    prefix6: {
      terme: 'Longitud de prefijo',
      court:
        'Cuántos bits iniciales del bloque son fijos. IPv6 no usa máscara en notación con puntos: basta la longitud.',
      detail:
        'Tamaños habituales: /48 para un sitio, /56 para un abonado, /64 para un enlace. Un /64 es el tamaño que espera la autoconfiguración de direcciones (SLAAC).',
      rfc: 'RFC 4291',
    },
    prefixIidBits: {
      terme: 'Bits de prefijo / bits de interfaz',
      court:
        'El reparto de los 128 bits: los primeros identifican la red, los siguientes la interfaz dentro de ella.',
      detail:
        'El reparto estándar sitúa la frontera en 64 bits, lo que deja un identificador de interfaz de 64 bits.',
    },
    interfaceId: {
      terme: 'Identificador de interfaz (IID)',
      court: 'La parte baja de la dirección, que distingue una interfaz dentro del enlace.',
      detail:
        'Puede derivarse de la MAC (EUI-64 modificado), sortearse y renovarse por privacidad (RFC 8981), o configurarse a mano.',
      rfc: 'RFC 4291',
    },
    lastAddress6: {
      terme: 'Última dirección del bloque',
      court:
        'La dirección más alta del bloque, con todos los bits libres a uno. IPv6 suprime la difusión general, así que esta dirección sigue siendo asignable.',
      detail: 'Alcanzar a todo el enlace se hace mediante el multicast ff02::1.',
      rfc: 'RFC 4291',
    },
    totalAddresses6: {
      terme: 'Direcciones totales',
      court: 'El tamaño del bloque: 2 elevado al número de bits que el prefijo deja libres.',
      detail: 'Un /64 contiene 2^64 direcciones, más que todo el espacio IPv4 elevado al cuadrado.',
    },
    usableAddresses6: {
      terme: 'Direcciones asignables',
      court:
        'Las direcciones que puede tomar una interfaz: todas las del bloque menos la de todo ceros, reservada a los routers.',
      detail: 'En la práctica el límite en IPv6 nunca es numérico: un /64 sigue siendo inagotable.',
    },
    firstUsable6: {
      terme: 'Primera dirección asignable',
      court:
        'La dirección más baja que puede tomar una interfaz del bloque: la dirección de red + 1, ya que la de todo ceros queda para los routers.',
      detail: 'En /127 y /128 no se reserva ninguna: el bloque empieza en su dirección de red.',
    },
    lastUsable6: {
      terme: 'Última dirección asignable',
      court:
        'La dirección más alta que puede tomar una interfaz: la última del bloque, ya que IPv6 no reserva dirección de difusión.',
      detail:
        'La RFC 2526 sí reserva las 128 últimas direcciones de cada bloque para usos anycast.',
    },
    subnetRouterAnycast: {
      terme: 'Anycast Subnet-Router',
      court:
        'La dirección de todo ceros del bloque, que llevan todos los routers del enlace: un paquete enviado a ella llega al más cercano.',
      detail:
        'La RFC 2526 reserva además las 128 últimas direcciones de cada bloque para otros usos anycast.',
      rfc: 'RFC 4291',
    },
    ipv6Type: {
      terme: 'Tipo de dirección',
      court: 'El papel del bloque en el plan de direccionamiento IPv6, fijado por sus primeros bits.',
      detail:
        'Unicast global 2000::/3, local única fc00::/7, enlace-local fe80::/10, multicast ff00::/8, documentación 2001:db8::/32.',
      rfc: 'RFC 4291',
    },
    multicastScope: {
      terme: 'Alcance multicast',
      court: 'Hasta dónde se propaga un paquete multicast, leído en el segundo nibble de la dirección.',
      detail:
        'ff02:: se queda en el enlace, ff05:: en el sitio, ff0e:: atraviesa Internet. ff02::1 designa a todas las máquinas del enlace, ff02::2 a todos los routers.',
      rfc: 'RFC 4291',
    },
    solicitedNode: {
      terme: 'Multicast de nodo solicitado',
      court:
        'La dirección ff02::1:ff seguida de los 24 últimos bits de la dirección: la que consulta Neighbor Discovery para resolver un vecino.',
      detail:
        'Sustituye a la difusión ARP de IPv4: solo se despiertan las pocas interfaces que comparten esos 24 bits.',
      rfc: 'RFC 4861',
    },
    embeddedMac: {
      terme: 'MAC derivada (EUI-64)',
      court:
        'La dirección física reconstruida a partir del identificador de interfaz, cuando este sigue el formato EUI-64 modificado.',
      detail:
        'Se reconoce por el patrón ff:fe insertado en el medio. Este formato revela el fabricante y sigue a la máquina de red en red, lo que motivó los identificadores aleatorios de la RFC 8981.',
      rfc: 'RFC 4291',
    },
    ula: {
      terme: 'Dirección local única (ULA)',
      court:
        'El fc00::/7 de IPv6: un direccionamiento interno, no enrutado en Internet, cuyos 40 bits centrales se sortean para evitar colisiones entre sitios.',
      rfc: 'RFC 4193',
    },
    linkLocal: {
      terme: 'Enlace-local',
      court:
        'El fe80::/10: una dirección válida en un solo enlace, configurada automáticamente por toda interfaz IPv6 y nunca enrutada.',
      detail:
        'Sostiene el descubrimiento de vecinos y el enrutamiento. Fuera del enlace exige un identificador de zona («fe80::1%eth0») para no ser ambigua.',
      rfc: 'RFC 4291',
    },
    split6: {
      terme: 'División en subredes',
      court: 'Dividir un bloque en subbloques del mismo tamaño alargando el prefijo.',
      detail: 'Un /48 de sitio dividido en /64 da 65 536 enlaces, el tamaño de enlace que espera IPv6.',
    },
    rangeStart: {
      terme: 'Inicio del rango',
      court: 'La primera dirección del intervalo analizado, límites incluidos.',
    },
    rangeEnd: {
      terme: 'Fin del rango',
      court: 'La última dirección del intervalo analizado, límites incluidos.',
    },
    rangeCount: {
      terme: 'Número de direcciones',
      court: 'Cuántas direcciones contiene el intervalo, límites incluidos: fin − inicio + 1.',
    },
    enclosing: {
      terme: 'Bloque contenedor',
      court:
        'El bloque CIDR único más pequeño que contiene todo el rango. Casi siempre se pasa del rango pedido.',
      detail:
        'Un bloque CIDR está alineado con una potencia de dos: 192.168.1.5 – 192.168.1.130 cabe en 192.168.1.0/24 y en nada más ajustado.',
    },
    overflow: {
      terme: 'Exceso del bloque contenedor',
      court: 'Cuántas direcciones cubre el bloque contenedor más allá del rango pedido.',
      detail:
        'Es el precio de un filtro escrito con un solo prefijo. La descomposición en varios bloques, en cambio, se ajusta exactamente al rango.',
    },
    cidrBlocks: {
      terme: 'Bloques CIDR',
      court: 'Cuántos prefijos hacen falta para cubrir el rango exactamente, sin pasarse.',
    },
    exactBlock: {
      terme: 'Rango alineado con un bloque',
      court:
        'El rango empieza en una frontera de bloque y acaba en la última dirección de ese bloque: se escribe con un solo prefijo CIDR.',
    },
    minimalDecomposition: {
      terme: 'Descomposición mínima en bloques CIDR',
      court:
        'El conjunto más corto de prefijos que cubre el rango exactamente: la forma que se escribe en una ACL o un grupo de seguridad.',
      detail:
        'Cada bloque está alineado con su propio tamaño, y por eso el corte parece irregular en los extremos.',
    },
  },

  ui: {
    title: 'Calculadora CIDR y de rangos de red',
    intro:
      'Esta herramienta calcula todo lo que se deriva de un prefijo IPv4 o IPv6: máscara, dirección de red, rango utilizable, número de direcciones, tipo de bloque y uso especial (RFC 1918, CGNAT, documentación, ULA, enlace-local…). Todo el cálculo ocurre en el navegador; no se envía ningún dato a un servidor.',
    step1: 'Elige el protocolo y luego el modo de cálculo.',
    step2: 'El resultado se actualiza mientras escribes; no hay nada que validar.',
    step3: 'Pasa el ratón sobre un rótulo del resultado para ver la explicación del término.',
    protocol: 'Protocolo',
    footer:
      'Cálculo 100 % en el cliente · IPv4 (/0 a /32, con /31 RFC 3021 y /32) e IPv6 (/0 a /128, con /127 RFC 6164 y /128) · formas canónicas RFC 5952.',

    modeLabel4: 'Modo de cálculo IPv4',
    modeLabel6: 'Modo de cálculo IPv6',
    mode4Cidr: 'CIDR',
    mode4Range: 'Rango de IP',
    mode4Netmask: 'Dirección + Máscara',
    mode4Hosts: 'Dirección + Hosts',
    mode6Cidr: 'CIDR',
    mode6Range: 'Rango de IP',
    mode6Prefix: 'Dirección + Prefijo',

    fieldCidr4Hint: 'Acepta 10.0.0.0/24, 10.0.0.0/255.255.255.0 o 10.0.0.0 255.255.255.0',
    fieldCidr6Hint:
      'Acepta 2001:db8::/32, la forma completa, la IPv4 incrustada (::ffff:192.0.2.1) y los corchetes',
    fieldRangeStart: 'Dirección inicial',
    fieldRangeEnd: 'Dirección final',
    fieldAddress: 'Dirección',
    fieldNetmask: 'Máscara de subred',
    fieldNetmaskHint: '255.255.240.0 o 20',
    fieldHosts: 'Número de hosts necesarios',
    fieldHostsHint: 'El bloque más pequeño que ofrezca al menos ese número de hosts utilizables',
    fieldPrefix: 'Longitud de prefijo',
    fieldPrefixHint: '0 a 128. /64 para un enlace, /56 para un abonado, /48 para un sitio',

    result: 'Resultado',
    hoverHint:
      'Pasa el ratón por un rótulo —o alcánzalo con el teclado— para ver la explicación del término.',
    binaryRowAddress: 'Dirección',
    binaryRowMask: 'Máscara',
    binaryRowNetwork: 'Red',
    binaryRowBroadcast: 'Difusión',
    binaryRowLast: 'Última',
    networkBits: 'bits de red',
    hostBits: 'bits de host',
    prefixBits: 'bits de prefijo',
    interfaceBits: 'bits de interfaz',

    newPrefix: 'Nuevo prefijo',
    noSplit: '— ninguno —',
    splitOption4: '/{prefix} — {count} subredes de {size} hosts',
    splitOption6: '/{prefix} — {count} subredes de {size} direcciones',
    splitTruncated:
      '{total} subredes en total — {shown} mostradas. La exportación CSV recoge las filas mostradas.',
    splitCapped:
      'División ofrecida hasta /{prefix}: más allá, el número de subredes supera lo que una tabla puede mostrar.',

    exportJson: 'Exportar a JSON',
    exportCsv: 'Exportar a CSV',
    copyJson: 'Copiar el JSON',
    exportSubnetsCsv: 'Exportar las subredes (CSV)',
    exportBlocksCsv: 'Exportar los bloques (CSV)',
    copyCidrList: 'Copiar la lista CIDR',

    badgePublic: 'Pública / enrutable',
    badgeSpecialUse: 'Uso especial',
    badgeUnassigned6: 'Bloque sin asignar',
    badgeHostInBlock: 'Host {address} en {cidr}',
    badgeInterfaceInBlock: 'Interfaz {address} en {cidr}',
    badgeAddressIsBroadcast:
      'La dirección introducida es la de difusión de la red: ningún host puede usarla',
    badgeAddressCount: '{count} direcciones',
    badgeBlockCount: '{count} bloque(s) CIDR',
    badgeExact: 'El rango es exactamente un bloque CIDR',
    badgeNotExact: 'El rango no corresponde a un bloque único',
    overflowValue: '{count} direcciones',

    csvField: 'campo',
    csvValue: 'valor',
    exportAddressInput: 'Dirección introducida',
    exportPrefixLength: 'Longitud de prefijo',
    exportUsage: 'Uso',
    exportNote: 'Nota',
  },

  errors: {
    emptyInput: 'Entrada vacía',
    leadingZero: 'Cero inicial ambiguo en «{input}» (octeto «{octet}»)',
    octetOutOfRange: 'Octeto fuera de rango en «{input}»: {octet} > 255',
    rangeReversed: 'El inicio del rango es mayor que el fin',
    splitWiderThanBlock: '/{newPrefix} es más amplio que la red /{prefix}',
    invalidIPv4: 'Dirección IPv4 no válida: «{input}»',
    prefixOutOfRange4: 'Prefijo fuera de rango: /{prefix} (se esperaba 0 a 32)',
    nonContiguousMask: 'Máscara no contigua: {mask}',
    missingMask: 'Falta la máscara o el prefijo',
    invalidCidr4: 'Notación CIDR no válida: «{input}»',
    hostsNotInteger: 'El número de hosts debe ser un entero ≥ 1',
    hostsTooLarge: 'El número de hosts supera la capacidad del espacio IPv4',
    invalidEmbeddedIPv4: 'Parte IPv4 no válida: «{input}»',
    ipv4MustEnd: 'La parte IPv4 debe cerrar la dirección',
    invalidGroup: 'Grupo hexadecimal no válido: «{group}»',
    zoneIdUnsupported: 'Identificador de zona no admitido («%eth0»): retíralo',
    unexpectedPrefix: 'Longitud de prefijo inesperada en una dirección suelta',
    doubleColonTwice: '«::» solo puede aparecer una vez: «{input}»',
    emptyGroupAroundColon: 'Grupo vacío junto a «::»: «{input}»',
    doubleColonNoZeros: '«::» no sustituye ningún grupo de ceros: «{input}»',
    groupCountMismatch: 'Se esperaban 8 grupos, se encontraron {count}: «{input}»',
    prefixOutOfRange6: 'Prefijo fuera de rango: /{prefix} (se esperaba 0 a 128)',
    missingPrefix: 'Falta la longitud de prefijo',
    invalidPrefix6: 'Longitud de prefijo no válida: «{input}»',
    addressOutOfSpace: 'Dirección fuera del espacio IPv6',
    invalidCidr6: 'Notación CIDR no válida: «{input}»',
    addressCountMin: 'El número de direcciones debe ser un entero ≥ 1',
    addressCountTooLarge: 'El número de direcciones supera la capacidad del espacio IPv6',
  },

  notes: {
    hostRoute4: 'Ruta de host: una sola dirección, sin red ni difusión.',
    pointToPoint4: 'Enlace punto a punto (RFC 3021): las dos direcciones son utilizables.',
    hostRoute6: 'Ruta de host: el bloque se reduce a una sola dirección.',
    pointToPoint6:
      'Enlace punto a punto (RFC 6164): las dos direcciones son utilizables, ya que IPv6 no reserva dirección de difusión.',
    subnetRouterAnycast6:
      'La dirección de todo ceros del bloque es el anycast Subnet-Router, que llevan los routers del enlace. La RFC 2526 reserva además las 128 últimas direcciones del bloque para otros anycast.',
  },

  specialUse: {
    thisNetwork: 'Esta red («this network»)',
    rfc1918: 'Privada (RFC 1918)',
    cgnat: 'CGNAT / NAT de operador',
    loopback4: 'Bucle local (loopback)',
    linkLocal4: 'Enlace-local (APIPA)',
    ietfProtocol: 'Asignaciones de protocolo del IETF',
    testNet1: 'Documentación (TEST-NET-1)',
    as112v4: 'AS112-v4',
    amt: 'AMT',
    relay6to4: 'Relé 6to4 (obsoleto)',
    benchmarking: 'Bancos de pruebas (benchmarking)',
    testNet2: 'Documentación (TEST-NET-2)',
    testNet3: 'Documentación (TEST-NET-3)',
    multicast4: 'Multicast',
    reservedFuture: 'Reservada (uso futuro)',
    limitedBroadcast: 'Difusión limitada',
  },

  ipv6Types: {
    unspecified: 'Dirección no especificada',
    loopback6: 'Bucle local (loopback)',
    ipv4Compatible: 'Compatible con IPv4 (obsoleta)',
    ipv4Mapped: 'IPv4 mapeada',
    nat64WellKnown: 'NAT64 — prefijo bien conocido',
    nat64Local: 'NAT64 — uso local',
    discardOnly: 'Descarte (discard-only)',
    teredo: 'Teredo',
    orchidv2: 'ORCHIDv2',
    documentation6: 'Documentación',
    sixToFour: '6to4 (obsoleto)',
    globalUnicast: 'Unicast global',
    ula6: 'Local única (ULA)',
    linkLocal6: 'Unicast enlace-local',
    multicast6: 'Multicast',
  },

  scopes: {
    scopeReserved: 'reservado',
    scopeInterfaceLocal: 'interfaz-local',
    scopeLinkLocal: 'enlace-local',
    scopeRealmLocal: 'realm-local',
    scopeAdminLocal: 'admin-local',
    scopeSiteLocal: 'sitio-local',
    scopeOrgLocal: 'organización-local',
    scopeGlobal: 'global',
    scopeUnassigned: 'sin asignar',
  },

  classNotes: {
    classA: 'prefijo histórico /8',
    classB: 'prefijo histórico /16',
    classC: 'prefijo histórico /24',
    classD: 'multicast',
    classE: 'reservada',
  },
};

export default es;
