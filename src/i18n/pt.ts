import type { Translation } from './types';

const pt: Translation = {
  meta: { label: 'Português', locale: 'pt-BR' },

  labels: {
    cidr: 'Notação CIDR',
    network: 'Endereço de rede',
    broadcast: 'Endereço de broadcast',
    blockLastAddress: 'Último endereço do bloco',
    netmask: 'Máscara de sub-rede',
    wildcard: 'Máscara curinga',
    firstUsable: 'Primeiro utilizável',
    lastUsable: 'Último utilizável',
    usableHosts: 'Hosts utilizáveis',
    totalAddresses: 'Endereços totais',
    prefixHostBits: 'Bits de rede / host',
    hex: 'Hexadecimal (rede)',
    ipClass: 'Classe histórica',
    addressInput: 'Endereço informado',
    scopePrivate: 'Endereçamento privado',
    scopePublic: 'Endereçamento público',
    specialUse: 'Uso especial',
    hostInBlock: 'Host dentro do bloco',
    addressIsBroadcast: 'Endereço de broadcast informado',
    binary: 'Representação binária',
    split: 'Divisão em sub-redes',
    compressed: 'Forma comprimida',
    expanded: 'Forma completa',
    hex6: 'Hexadecimal',
    prefix6: 'Comprimento do prefixo',
    prefixIidBits: 'Bits de prefixo / interface',
    interfaceId: 'Identificador de interface',
    lastAddress6: 'Último endereço do bloco',
    totalAddresses6: 'Endereços totais',
    usableAddresses6: 'Endereços atribuíveis',
    firstUsable6: 'Primeiro atribuível',
    lastUsable6: 'Último atribuível',
    subnetRouterAnycast: 'Anycast Subnet-Router',
    ipv6Type: 'Tipo de endereço',
    multicastScope: 'Escopo multicast',
    solicitedNode: 'Multicast de nó solicitado',
    embeddedMac: 'MAC derivado (EUI-64)',
    ula: 'Endereço local único (ULA)',
    linkLocal: 'Link-local',
    split6: 'Divisão em sub-redes',
    rangeStart: 'Início',
    rangeEnd: 'Fim',
    rangeCount: 'Número de endereços',
    enclosing: 'Bloco englobante',
    overflow: 'Excedente do bloco englobante',
    cidrBlocks: 'Blocos CIDR',
    exactBlock: 'Faixa alinhada a um bloco',
    minimalDecomposition: 'Decomposição mínima em blocos CIDR',
  },

  glossary: {
    cidr: {
      terme: 'Notação CIDR',
      court:
        'A escrita "endereço/comprimento" de um bloco: o comprimento diz quantos bits iniciais todos os endereços do bloco têm em comum.',
      detail:
        '10.0.0.0/24 = os 24 primeiros bits são fixos, os 8 últimos variam. Quanto maior o número, menor o bloco.',
      rfc: 'RFC 4632',
    },
    network: {
      terme: 'Endereço de rede',
      court:
        'O primeiro endereço do bloco, com todos os bits de host em zero. É ele que nomeia o bloco numa tabela de roteamento.',
      detail: 'No IPv4 é reservado e não pode ser atribuído a uma máquina (exceto em /31 e /32).',
    },
    broadcast: {
      terme: 'Endereço de broadcast',
      court:
        'O último endereço do bloco, com todos os bits de host em um. Um pacote enviado a ele chega a todas as máquinas da rede.',
      detail:
        'É reservado, por isso sai da contagem de hosts utilizáveis. Blocos /31 e /32 não têm nenhum.',
      rfc: 'RFC 919',
    },
    blockLastAddress: {
      terme: 'Último endereço do bloco',
      court:
        'O maior endereço do bloco. Aqui ele continua atribuível: um /31 ou um /32 não reserva endereço de broadcast.',
      rfc: 'RFC 3021',
    },
    netmask: {
      terme: 'Máscara de sub-rede',
      court:
        'Os bits em 1 marcam a parte de rede do endereço, os bits em 0 a parte de host. Um E lógico entre endereço e máscara dá o endereço de rede.',
      detail:
        'Uma máscara válida é uma sequência contínua de uns seguida de uma sequência de zeros: 255.255.240.0 (= /20) é válida, 255.0.255.0 não é.',
    },
    wildcard: {
      terme: 'Máscara curinga (wildcard)',
      court: 'O inverso bit a bit da máscara de sub-rede: os bits em 1 são os que podem variar.',
      detail:
        'É o formato que as listas de controle de acesso do Cisco IOS esperam: ali 10.0.0.0 0.0.0.255 nomeia o mesmo bloco que 10.0.0.0/24.',
    },
    firstUsable: {
      terme: 'Primeiro endereço utilizável',
      court: 'O menor endereço atribuível a uma máquina da rede.',
      detail: 'No IPv4 é o endereço de rede + 1, já que o próprio endereço de rede é reservado.',
    },
    lastUsable: {
      terme: 'Último endereço utilizável',
      court: 'O maior endereço atribuível a uma máquina da rede.',
      detail:
        'No IPv4 é o broadcast − 1. Costuma ser escolhido para o gateway, tanto quanto o primeiro: a convenção é local.',
    },
    usableHosts: {
      terme: 'Hosts utilizáveis',
      court: 'Quantas máquinas o bloco consegue de fato endereçar.',
      detail:
        'No IPv4: endereços totais − 2 (rede e broadcast). Exceções: /31 dá 2 e /32 dá 1.',
    },
    totalAddresses: {
      terme: 'Endereços totais',
      court: 'O tamanho do bloco, reservas incluídas: 2 elevado ao número de bits de host.',
      detail: 'Um /24 contém 2^8 = 256 endereços, dos quais 254 utilizáveis.',
    },
    prefixHostBits: {
      terme: 'Bits de rede / bits de host',
      court:
        'A repartição dos 32 bits do endereço: os primeiros identificam a rede, os seguintes a máquina dentro dela.',
      detail: 'Os dois somam sempre 32. Um bit de host a mais dobra o tamanho do bloco.',
    },
    hex: {
      terme: 'Hexadecimal',
      court:
        'O endereço escrito na base 16, como aparece nas capturas de rede e nas tabelas do sistema.',
      detail: '10.0.0.0 escreve-se 0x0A000000.',
    },
    ipClass: {
      terme: 'Classe histórica',
      court:
        'A divisão rígida em classes A / B / C anterior ao CIDR: os primeiros bits do endereço impunham o tamanho do bloco.',
      detail:
        'Abandonada em 1993 em favor dos prefixos de comprimento variável. Aqui é apenas informativa; nenhum equipamento moderno roteia por ela.',
      rfc: 'RFC 1519',
    },
    addressInput: {
      terme: 'Endereço informado',
      court: 'O endereço fornecido na entrada, antes de aplicar a máscara.',
      detail:
        'Se carrega bits de host não nulos, ele nomeia uma máquina dentro do bloco, e o bloco exibido é o que a contém.',
    },
    scopePrivate: {
      terme: 'Endereçamento privado',
      court:
        'Um bloco reservado às redes internas: esses endereços não são roteados na Internet e saem atrás de um NAT.',
      detail: '10.0.0.0/8, 172.16.0.0/12 e 192.168.0.0/16.',
      rfc: 'RFC 1918',
    },
    scopePublic: {
      terme: 'Endereçamento público',
      court:
        'Um bloco roteável na Internet, alocado por um registro regional (RIPE, ARIN, APNIC, LACNIC…) a um operador ou a uma organização.',
    },
    specialUse: {
      terme: 'Uso especial',
      court:
        'Um bloco que a IANA reserva para uma função específica, fora da alocação comum: documentação, loopback, multicast, link-local…',
      detail:
        'O registro completo está no IANA Special-Purpose Address Registry; cada entrada remete à RFC que a define.',
      rfc: 'RFC 6890',
    },
    hostInBlock: {
      terme: 'Host dentro do bloco',
      court:
        'O endereço informado tem bits de host em 1: ele nomeia uma máquina, e o bloco exibido é aquele a que ela pertence.',
    },
    addressIsBroadcast: {
      terme: 'Endereço de broadcast informado',
      court:
        'O endereço informado é o último do bloco, reservado ao broadcast: nenhuma interface pode carregá-lo.',
    },
    binary: {
      terme: 'Representação binária',
      court:
        'Os bits do endereço, coloridos dos dois lados da fronteira traçada pela máscara: parte de rede à esquerda, parte de host à direita.',
      detail:
        'É a vista que torna visível o que a máscara faz: o E lógico das duas primeiras linhas dá a terceira.',
    },
    split: {
      terme: 'Divisão em sub-redes',
      court:
        'Dividir um bloco em sub-blocos de mesmo tamanho, alongando o prefixo. Cada bit acrescentado ao prefixo parte o bloco em dois.',
      detail: 'Um /24 dividido em /26 dá 4 sub-redes de 62 hosts utilizáveis cada.',
    },
    compressed: {
      terme: 'Forma comprimida',
      court:
        'A escrita canônica do endereço: hexadecimal minúsculo, zeros iniciais removidos, a maior sequência de grupos nulos substituída por "::".',
      detail:
        'Um único "::" por endereço, e nunca para um só grupo nulo. É a forma a escrever numa configuração ou num arquivo de zona.',
      rfc: 'RFC 5952',
    },
    expanded: {
      terme: 'Forma completa',
      court:
        'Os oito grupos de quatro dígitos hexadecimais, sem nenhuma abreviação. A forma a comparar caractere por caractere.',
      detail: '2001:db8::1 escreve-se 2001:0db8:0000:0000:0000:0000:0000:0001.',
    },
    hex6: {
      terme: 'Hexadecimal',
      court:
        'Os 128 bits do endereço num único número hexadecimal, como aparece na memória ou numa captura.',
    },
    prefix6: {
      terme: 'Comprimento do prefixo',
      court:
        'Quantos bits iniciais do bloco são fixos. O IPv6 não usa máscara em notação pontilhada: o comprimento basta.',
      detail:
        'Tamanhos usuais: /48 para um site, /56 para um assinante, /64 para um enlace. Um /64 é o tamanho que a autoconfiguração de endereços (SLAAC) espera.',
      rfc: 'RFC 4291',
    },
    prefixIidBits: {
      terme: 'Bits de prefixo / bits de interface',
      court:
        'A repartição dos 128 bits: os primeiros identificam a rede, os seguintes a interface dentro dela.',
      detail:
        'A divisão padrão põe a fronteira em 64 bits, deixando um identificador de interface de 64 bits.',
    },
    interfaceId: {
      terme: 'Identificador de interface (IID)',
      court: 'A parte baixa do endereço, que distingue uma interface dentro do enlace.',
      detail:
        'Pode ser derivado do MAC (EUI-64 modificado), sorteado e renovado por privacidade (RFC 8981), ou configurado à mão.',
      rfc: 'RFC 4291',
    },
    lastAddress6: {
      terme: 'Último endereço do bloco',
      court:
        'O maior endereço do bloco, com todos os bits livres em um. O IPv6 elimina o broadcast, então esse endereço continua atribuível.',
      detail: 'Alcançar todo o enlace passa pelo multicast ff02::1.',
      rfc: 'RFC 4291',
    },
    totalAddresses6: {
      terme: 'Endereços totais',
      court: 'O tamanho do bloco: 2 elevado ao número de bits que o prefixo deixa livres.',
      detail: 'Um /64 contém 2^64 endereços, mais que todo o espaço IPv4 elevado ao quadrado.',
    },
    usableAddresses6: {
      terme: 'Endereços atribuíveis',
      court:
        'Os endereços que uma interface pode assumir: todos os do bloco menos o de tudo-zeros, reservado aos roteadores.',
      detail: 'Na prática o limite no IPv6 nunca é numérico: um /64 permanece inesgotável.',
    },
    firstUsable6: {
      terme: 'Primeiro endereço atribuível',
      court:
        'O menor endereço que uma interface do bloco pode assumir: o endereço de rede + 1, já que o de tudo-zeros cabe aos roteadores.',
      detail: 'Em /127 e /128 nada é reservado: o bloco começa no seu endereço de rede.',
    },
    lastUsable6: {
      terme: 'Último endereço atribuível',
      court:
        'O maior endereço que uma interface pode assumir: o último do bloco, já que o IPv6 não reserva endereço de broadcast.',
      detail:
        'A RFC 2526 reserva, porém, os 128 últimos endereços de cada bloco para usos anycast.',
    },
    subnetRouterAnycast: {
      terme: 'Anycast Subnet-Router',
      court:
        'O endereço de tudo-zeros do bloco, carregado por todos os roteadores do enlace: um pacote enviado a ele chega ao mais próximo.',
      detail:
        'A RFC 2526 reserva ainda os 128 últimos endereços de cada bloco para outros usos anycast.',
      rfc: 'RFC 4291',
    },
    ipv6Type: {
      terme: 'Tipo de endereço',
      court: 'O papel do bloco no plano de endereçamento IPv6, determinado pelos seus primeiros bits.',
      detail:
        'Unicast global 2000::/3, local único fc00::/7, link-local fe80::/10, multicast ff00::/8, documentação 2001:db8::/32.',
      rfc: 'RFC 4291',
    },
    multicastScope: {
      terme: 'Escopo multicast',
      court: 'Até onde um pacote multicast se propaga, lido no segundo nibble do endereço.',
      detail:
        'ff02:: fica no enlace, ff05:: no site, ff0e:: atravessa a Internet. ff02::1 designa todas as máquinas do enlace, ff02::2 todos os roteadores.',
      rfc: 'RFC 4291',
    },
    solicitedNode: {
      terme: 'Multicast de nó solicitado',
      court:
        'O endereço ff02::1:ff seguido dos 24 últimos bits do endereço: aquele que o Neighbor Discovery consulta para resolver um vizinho.',
      detail:
        'Substitui o broadcast ARP do IPv4: só as poucas interfaces que partilham esses 24 bits são acordadas.',
      rfc: 'RFC 4861',
    },
    embeddedMac: {
      terme: 'MAC derivado (EUI-64)',
      court:
        'O endereço físico reconstituído a partir do identificador de interface, quando este segue o formato EUI-64 modificado.',
      detail:
        'Reconhecível pelo padrão ff:fe inserido no meio. Esse formato revela o fabricante e segue a máquina de rede em rede, o que motivou os identificadores aleatórios da RFC 8981.',
      rfc: 'RFC 4291',
    },
    ula: {
      terme: 'Endereço local único (ULA)',
      court:
        'O fc00::/7 do IPv6: um endereçamento interno, não roteado na Internet, cujos 40 bits centrais são sorteados para evitar colisões entre sites.',
      rfc: 'RFC 4193',
    },
    linkLocal: {
      terme: 'Link-local',
      court:
        'O fe80::/10: um endereço válido num único enlace, configurado automaticamente por toda interface IPv6 e nunca roteado.',
      detail:
        'Sustenta a descoberta de vizinhos e o roteamento. Fora do enlace exige um identificador de zona ("fe80::1%eth0") para não ser ambíguo.',
      rfc: 'RFC 4291',
    },
    split6: {
      terme: 'Divisão em sub-redes',
      court: 'Dividir um bloco em sub-blocos de mesmo tamanho, alongando o prefixo.',
      detail: 'Um /48 de site dividido em /64 dá 65.536 enlaces, o tamanho de enlace que o IPv6 espera.',
    },
    rangeStart: {
      terme: 'Início da faixa',
      court: 'O primeiro endereço do intervalo analisado, limites incluídos.',
    },
    rangeEnd: {
      terme: 'Fim da faixa',
      court: 'O último endereço do intervalo analisado, limites incluídos.',
    },
    rangeCount: {
      terme: 'Número de endereços',
      court: 'Quantos endereços o intervalo contém, limites incluídos: fim − início + 1.',
    },
    enclosing: {
      terme: 'Bloco englobante',
      court:
        'O menor bloco CIDR único que contém toda a faixa. Quase sempre ultrapassa a faixa pedida.',
      detail:
        'Um bloco CIDR é alinhado a uma potência de dois: 192.168.1.5 – 192.168.1.130 cabe em 192.168.1.0/24 e em nada mais justo.',
    },
    overflow: {
      terme: 'Excedente do bloco englobante',
      court: 'Quantos endereços o bloco englobante cobre além da faixa pedida.',
      detail:
        'É o preço de um filtro escrito com um único prefixo. A decomposição em vários blocos, por sua vez, adere exatamente à faixa.',
    },
    cidrBlocks: {
      terme: 'Blocos CIDR',
      court: 'Quantos prefixos são necessários para cobrir a faixa exatamente, sem ultrapassá-la.',
    },
    exactBlock: {
      terme: 'Faixa alinhada a um bloco',
      court:
        'A faixa começa numa fronteira de bloco e termina no último endereço desse bloco: escreve-se com um único prefixo CIDR.',
    },
    minimalDecomposition: {
      terme: 'Decomposição mínima em blocos CIDR',
      court:
        'O conjunto mais curto de prefixos que cobre a faixa exatamente — a forma a escrever numa ACL ou num grupo de segurança.',
      detail:
        'Cada bloco é alinhado ao seu próprio tamanho, e é por isso que o corte parece irregular nas pontas.',
    },
  },

  ui: {
    title: 'Calculadora CIDR e de faixas de rede',
    intro:
      'Esta ferramenta calcula tudo o que decorre de um prefixo IPv4 ou IPv6: máscara, endereço de rede, faixa utilizável, número de endereços, tipo de bloco e uso especial (RFC 1918, CGNAT, documentação, ULA, link-local…). Todo o cálculo acontece no navegador; nenhum dado é enviado a um servidor.',
    step1: 'Escolha o protocolo e depois o modo de cálculo.',
    step2: 'O resultado se atualiza enquanto você digita; não há nada a confirmar.',
    step3: 'Passe o mouse sobre um rótulo do resultado para ver a explicação do termo.',
    protocol: 'Protocolo',
    footer:
      'Cálculo 100 % no cliente · IPv4 (/0 a /32, com /31 RFC 3021 e /32) e IPv6 (/0 a /128, com /127 RFC 6164 e /128) · formas canônicas RFC 5952.',

    modeLabel4: 'Modo de cálculo IPv4',
    modeLabel6: 'Modo de cálculo IPv6',
    mode4Cidr: 'CIDR',
    mode4Range: 'Faixa de IP',
    mode4Netmask: 'Endereço + Máscara',
    mode4Hosts: 'Endereço + Hosts',
    mode6Cidr: 'CIDR',
    mode6Range: 'Faixa de IP',
    mode6Prefix: 'Endereço + Prefixo',

    fieldCidr4Hint: 'Aceita 10.0.0.0/24, 10.0.0.0/255.255.255.0 ou 10.0.0.0 255.255.255.0',
    fieldCidr6Hint:
      'Aceita 2001:db8::/32, a forma completa, o IPv4 embutido (::ffff:192.0.2.1) e os colchetes',
    fieldRangeStart: 'Endereço inicial',
    fieldRangeEnd: 'Endereço final',
    fieldAddress: 'Endereço',
    fieldNetmask: 'Máscara de sub-rede',
    fieldNetmaskHint: '255.255.240.0 ou 20',
    fieldHosts: 'Número de hosts necessários',
    fieldHostsHint: 'O menor bloco que ofereça pelo menos esse número de hosts utilizáveis',
    fieldPrefix: 'Comprimento do prefixo',
    fieldPrefixHint: '0 a 128. /64 para um enlace, /56 para um assinante, /48 para um site',

    result: 'Resultado',
    hoverHint:
      'Passe o mouse sobre um rótulo — ou alcance-o pelo teclado — para ver a explicação do termo.',
    binaryRowAddress: 'Endereço',
    binaryRowMask: 'Máscara',
    binaryRowNetwork: 'Rede',
    binaryRowBroadcast: 'Broadcast',
    binaryRowLast: 'Último',
    networkBits: 'bits de rede',
    hostBits: 'bits de host',
    prefixBits: 'bits de prefixo',
    interfaceBits: 'bits de interface',

    newPrefix: 'Novo prefixo',
    noSplit: '— nenhum —',
    splitOption4: '/{prefix} — {count} sub-redes de {size} hosts',
    splitOption6: '/{prefix} — {count} sub-redes de {size} endereços',
    splitTruncated:
      '{total} sub-redes no total — {shown} exibidas. A exportação CSV cobre as linhas exibidas.',
    splitCapped:
      'Divisão oferecida até /{prefix}: além disso, o número de sub-redes ultrapassa o que uma tabela consegue mostrar.',

    exportJson: 'Exportar em JSON',
    exportCsv: 'Exportar em CSV',
    copyJson: 'Copiar o JSON',
    exportSubnetsCsv: 'Exportar as sub-redes (CSV)',
    exportBlocksCsv: 'Exportar os blocos (CSV)',
    copyCidrList: 'Copiar a lista CIDR',

    badgePublic: 'Pública / roteável',
    badgeSpecialUse: 'Uso especial',
    badgeUnassigned6: 'Bloco não atribuído',
    badgeHostInBlock: 'Host {address} em {cidr}',
    badgeInterfaceInBlock: 'Interface {address} em {cidr}',
    badgeAddressIsBroadcast:
      'O endereço informado é o broadcast da rede — inutilizável como host',
    badgeAddressCount: '{count} endereços',
    badgeBlockCount: '{count} bloco(s) CIDR',
    badgeExact: 'A faixa é exatamente um bloco CIDR',
    badgeNotExact: 'A faixa não corresponde a um bloco único',
    overflowValue: '{count} endereços',

    csvField: 'campo',
    csvValue: 'valor',
    exportAddressInput: 'Endereço informado',
    exportPrefixLength: 'Comprimento do prefixo',
    exportUsage: 'Uso',
    exportNote: 'Observação',
  },

  errors: {
    emptyInput: 'Entrada vazia',
    leadingZero: 'Zero inicial ambíguo em "{input}" (octeto "{octet}")',
    octetOutOfRange: 'Octeto fora da faixa em "{input}": {octet} > 255',
    rangeReversed: 'O início da faixa é maior que o fim',
    splitWiderThanBlock: '/{newPrefix} é mais amplo que a rede /{prefix}',
    invalidIPv4: 'Endereço IPv4 inválido: "{input}"',
    prefixOutOfRange4: 'Prefixo fora da faixa: /{prefix} (esperado 0 a 32)',
    nonContiguousMask: 'Máscara não contígua: {mask}',
    missingMask: 'Máscara ou prefixo ausente',
    invalidCidr4: 'Notação CIDR inválida: "{input}"',
    hostsNotInteger: 'O número de hosts deve ser um inteiro ≥ 1',
    hostsTooLarge: 'O número de hosts excede a capacidade do espaço IPv4',
    invalidEmbeddedIPv4: 'Parte IPv4 inválida: "{input}"',
    ipv4MustEnd: 'A parte IPv4 deve encerrar o endereço',
    invalidGroup: 'Grupo hexadecimal inválido: "{group}"',
    zoneIdUnsupported: 'Identificador de zona não suportado ("%eth0"): remova-o',
    unexpectedPrefix: 'Comprimento de prefixo inesperado num endereço isolado',
    doubleColonTwice: '"::" só pode aparecer uma vez: "{input}"',
    emptyGroupAroundColon: 'Grupo vazio ao lado de "::": "{input}"',
    doubleColonNoZeros: '"::" não substitui nenhum grupo de zeros: "{input}"',
    groupCountMismatch: '8 grupos esperados, {count} encontrado(s): "{input}"',
    prefixOutOfRange6: 'Prefixo fora da faixa: /{prefix} (esperado 0 a 128)',
    missingPrefix: 'Comprimento do prefixo ausente',
    invalidPrefix6: 'Comprimento de prefixo inválido: "{input}"',
    addressOutOfSpace: 'Endereço fora do espaço IPv6',
    invalidCidr6: 'Notação CIDR inválida: "{input}"',
    addressCountMin: 'O número de endereços deve ser um inteiro ≥ 1',
    addressCountTooLarge: 'O número de endereços excede a capacidade do espaço IPv6',
  },

  notes: {
    hostRoute4: 'Rota de host: um único endereço, sem rede nem broadcast.',
    pointToPoint4: 'Enlace ponto a ponto (RFC 3021): os dois endereços são utilizáveis.',
    hostRoute6: 'Rota de host: o bloco se reduz a um único endereço.',
    pointToPoint6:
      'Enlace ponto a ponto (RFC 6164): os dois endereços são utilizáveis, já que o IPv6 não reserva endereço de broadcast.',
    subnetRouterAnycast6:
      'O endereço de tudo-zeros do bloco é o anycast Subnet-Router, carregado pelos roteadores do enlace. A RFC 2526 reserva ainda os 128 últimos endereços do bloco para outros anycasts.',
  },

  specialUse: {
    thisNetwork: 'Esta rede ("this network")',
    rfc1918: 'Privada (RFC 1918)',
    cgnat: 'CGNAT / NAT de operadora',
    loopback4: 'Loopback',
    linkLocal4: 'Link-local (APIPA)',
    ietfProtocol: 'Atribuições de protocolo da IETF',
    testNet1: 'Documentação (TEST-NET-1)',
    as112v4: 'AS112-v4',
    amt: 'AMT',
    relay6to4: 'Relé 6to4 (obsoleto)',
    benchmarking: 'Bancadas de teste (benchmarking)',
    testNet2: 'Documentação (TEST-NET-2)',
    testNet3: 'Documentação (TEST-NET-3)',
    multicast4: 'Multicast',
    reservedFuture: 'Reservada (uso futuro)',
    limitedBroadcast: 'Broadcast limitado',
  },

  ipv6Types: {
    unspecified: 'Endereço não especificado',
    loopback6: 'Loopback',
    ipv4Compatible: 'Compatível com IPv4 (obsoleto)',
    ipv4Mapped: 'IPv4 mapeado',
    nat64WellKnown: 'NAT64 — prefixo bem conhecido',
    nat64Local: 'NAT64 — uso local',
    discardOnly: 'Descarte (discard-only)',
    teredo: 'Teredo',
    orchidv2: 'ORCHIDv2',
    documentation6: 'Documentação',
    sixToFour: '6to4 (obsoleto)',
    globalUnicast: 'Unicast global',
    ula6: 'Local único (ULA)',
    linkLocal6: 'Unicast link-local',
    multicast6: 'Multicast',
  },

  scopes: {
    scopeReserved: 'reservado',
    scopeInterfaceLocal: 'interface-local',
    scopeLinkLocal: 'link-local',
    scopeRealmLocal: 'realm-local',
    scopeAdminLocal: 'admin-local',
    scopeSiteLocal: 'site-local',
    scopeOrgLocal: 'organização-local',
    scopeGlobal: 'global',
    scopeUnassigned: 'não atribuído',
  },

  classNotes: {
    classA: 'prefixo histórico /8',
    classB: 'prefixo histórico /16',
    classC: 'prefixo histórico /24',
    classD: 'multicast',
    classE: 'reservada',
  },
};

export default pt;
