# understand-CIDR

Calculateur CIDR & de portée réseau IPv4 et IPv6, en six langues — Vite + React + TypeScript,
100 % côté client.

## Fonctionnalités

Un sélecteur choisit le protocole, chacun avec ses modes de calcul.

### IPv4 — quatre modes

| Mode | Entrée | Sortie |
|---|---|---|
| **CIDR** | `10.0.0.0/24`, `10.0.0.0/255.255.255.0`, `10.0.0.0 255.255.255.0` | analyse complète du bloc |
| **Plage d'IP** | début + fin | décomposition minimale en blocs CIDR, bloc englobant, débordement |
| **Adresse + Masque** | adresse + masque (`255.255.240.0` ou `20`) | analyse complète |
| **Adresse + Hôtes** | adresse + nombre d'hôtes requis | plus petit préfixe suffisant |

Pour chaque bloc : masque, masque générique (wildcard), adresse réseau, broadcast,
première/dernière adresse utilisable, nombre d'hôtes, adresses totales, hexadécimal,
classe historique, usage spécial (RFC 1918, RFC 6598 CGNAT, RFC 3927 lien-local,
RFC 5737 documentation, multicast, réservé…).

### IPv6 — trois modes

| Mode | Entrée | Sortie |
|---|---|---|
| **CIDR** | `2001:db8:1:2::/64`, `2001:db8:: 32`, adresse seule (`/128`) | analyse complète du bloc |
| **Plage d'IP** | début + fin | décomposition minimale en blocs CIDR, bloc englobant, débordement |
| **Adresse + Préfixe** | adresse + longueur (0 à 128) | analyse complète |

Pour chaque bloc : forme compressée (RFC 5952) et forme complète, adresse réseau,
dernière adresse, première/dernière assignable, adresses totales et assignables,
identifiant d'interface, hexadécimal 128 bits, anycast Subnet-Router (RFC 4291),
multicast de sollicitation de voisin (RFC 4861), portée multicast, MAC dérivée d'un
identifiant EUI-64 modifié, et type de bloc (unicast global, ULA, lien-local,
multicast, documentation, NAT64, Teredo, 6to4, IPv4-mappée…).

### Six langues

Français, anglais, espagnol, allemand, portugais et chinois simplifié. Le sélecteur
est en haut de page ; le choix est retenu dans `localStorage`, et la première visite
suit `navigator.languages` (anglais à défaut). L'attribut `lang` du document suit la
langue active, et les nombres sont formatés par `Intl` avec l'étiquette BCP 47 de la
locale — `65 536` en français, `65,536` en anglais.

La traduction couvre tout ce qui s'affiche : intitulés, glossaire, badges, remarques,
messages d'erreur des moteurs, en-têtes des exports CSV. Les clés du JSON exporté
restent en anglais, ce fichier étant destiné à être relu par un programme.

### Communs

Représentation binaire avec séparation bits de réseau / bits d'hôte (32 ou 128 bits),
découpage en sous-réseaux avec table, export JSON / CSV, copie presse-papier.

**Glossaire au survol** (48 termes × 6 langues) : chaque intitulé de résultat — grille, en-tête de tableau,
ligne de vue binaire, badge — ouvre une info-bulle qui définit le terme, avec un
exemple ou un cas limite et la RFC de référence. L'info-bulle s'ouvre au survol
*et* au focus clavier, se ferme au départ du pointeur, à la perte de focus, à
Échap et au défilement. Elle est rendue dans un portail sur `document.body` :
les conteneurs de résultat portent `overflow: hidden` ou `auto` et rogneraient un
élément positionné à l'intérieur.

## Cas particuliers traités

### IPv4

- `/31` — liaison point-à-point RFC 3021 : 2 adresses utilisables, pas de broadcast.
- `/32` — route hôte : 1 adresse.
- `/0` — route par défaut : 2^32 adresses.
- Arithmétique 32 bits non signée partout (`>>> 0`) : pas de débordement sur les
  adresses ≥ 128.0.0.0, et `maskFromPrefix(0)` ne retombe pas sur le décalage
  modulo 32 de JavaScript.
- Zéros de tête (`010.0.0.1`) refusés : source classique de *parser differential*
  (lecture octale vs décimale) et de contournement de filtre SSRF.
- Masques non contigus (`255.0.255.0`) refusés.

### IPv6

- Arithmétique en `BigInt` de bout en bout : un `number` JS ne porte que 53 bits
  de mantisse entière, insuffisant pour 128.
- Compression canonique RFC 5952 : hexadécimal minuscule, plus longue suite de
  groupes nuls remplacée par `::`, la plus à gauche à longueur égale, jamais pour
  un unique groupe nul, IPv4-mappées écrites en notation pointée.
- `::` refusé en double, et refusé quand il ne remplace aucun groupe
  (`1:2:3:4:5:6:7::8`).
- `/127` — liaison point-à-point RFC 6164 ; `/128` — route hôte. Ni l'un ni l'autre
  ne réserve l'anycast Subnet-Router.
- Pour les autres blocs unicast, l'adresse tout-à-zéro est signalée comme anycast
  Subnet-Router (RFC 4291 §2.6.1) et retirée des adresses assignables. Les blocs
  multicast n'en réservent aucune.
- Identifiant de zone (`fe80::1%eth0`) refusé avec un message explicite : il
  désigne une interface locale et n'a pas de sens hors de la machine qui l'écrit.
- Découpage proposé jusqu'à 12 bits empruntés : au-delà, le nombre de sous-réseaux
  dépasse ce qu'une table peut montrer.

## Internationalisation

Les moteurs de calcul sont purs et sans locale : ils signalent *ce qui* se passe par
un code, et l'interface choisit la langue au rendu.

- Les erreurs portent un `code` et des `params` (`errors.ts`) plutôt qu'un message.
- Les remarques exposent un `noteKey`, les usages spéciaux un `labelKey`, les portées
  multicast une `ScopeKey`, la classe historique un `noteKey`.
- `formatCount` et `formatBigCount` prennent la locale en paramètre.

Chaque dictionnaire de `Translation` est un `Record` fermé sur une union de clés.
Ajouter un terme sans le traduire dans les six langues casse la compilation. Avec un
`Record<string, …>`, l'entrée manquante compilerait et ne s'afficherait simplement
pas — `Term` rendrait ses enfants tels quels, et l'oubli passerait inaperçu.

Trois tests par locale gardent ce que le typage ne voit pas : aucune chaîne vide,
les `{jetons}` d'interpolation conservés depuis le français, et les adresses des
exemples identiques d'une langue à l'autre — une adresse « traduite » serait une
coquille invisible à la relecture.

## Développement

```bash
npm install
npm run dev      # serveur de dev
npm test         # Vitest sur la logique pure et les locales (118 tests)
npm run build    # -> dist/
npm run preview
```

## Déploiement

`vite.config.ts` utilise `base: './'`, donc `dist/` est déployable tel quel à la
racine d'un domaine **ou** dans un sous-chemin (`/outils/cidr/`) sans reconfiguration.
Aucun backend, aucun appel réseau à l'exécution.

## Structure

```
src/
  lib/ipv4.ts        moteur IPv4 (pur, sans DOM) — entiers 32 bits
  lib/ipv6.ts        moteur IPv6 (pur, sans DOM) — BigInt 128 bits
  lib/errors.ts      erreurs à code, communes aux deux moteurs
  lib/*.test.ts      tests Vitest (32 + 54)
  lib/export.ts      sérialisation JSON/CSV + téléchargement
  i18n/types.ts      contrat Translation + union des identifiants de terme
  i18n/{fr,en,es,de,pt,zh}.ts   les six dictionnaires
  i18n/index.tsx     détection, persistance, contexte React
  i18n/i18n.test.ts  intégrité des locales (32 tests)
  components/        Term (info-bulle), ResultGrid, DataTable, BinaryView,
                     Field, LanguageSwitcher
  views/Ipv4Panel    onglets, formulaires et résultats IPv4
  views/Ipv6Panel    onglets, formulaires et résultats IPv6
  App.tsx            sélecteur de protocole
  styles.css         thème clair + sombre (prefers-color-scheme)
```

Le glossaire est indexé par identifiant plutôt que par libellé : « Broadcast »
apparaît dans la grille, dans la vue binaire et en en-tête de tableau pour une
seule définition ; un même libellé peut recouvrir deux concepts selon le préfixe
(« Adresse de broadcast » devient « Dernière adresse du bloc » en /31 et /32,
qui n'ont pas de broadcast) ; et le libellé change avec la langue là où
l'identifiant, lui, ne bouge pas.

Les six dictionnaires sont embarqués dans le bundle plutôt que chargés à la
demande : le glossaire *est* le produit, et un changement de langue qui laisserait
la page vide un instant coûterait plus que les kilo-octets gagnés.

Les deux moteurs restent séparés : les champs diffèrent réellement (IPv6 n'a ni
broadcast, ni masque générique, ni classe historique) et BigInt contaminerait
chaque fonction IPv4 sans rien apporter à des entiers de 32 bits.
