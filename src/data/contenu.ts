// Tous les textes et toutes les données de la page sont ici.
// Les composants ne font que les afficher : pour changer un prix ou un avis,
// c'est ce fichier qu'on modifie.

// Sur Vercel, l'adresse du site est fournie par une variable d'environnement.
// En local, on retombe sur localhost.
const domaineVercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const site = {
  nom: "Floq",
  url: domaineVercel ? `https://${domaineVercel}` : "http://localhost:3000",
  titre: "Floq, le maillot de foot au flocage qui change avec toi",
  description:
    "Floq est un maillot de foot dont le flocage est un écran d'encre électronique : change le nom et le numéro depuis ton téléphone, en dix secondes.",
  reassurance: "Livraison offerte · 30 jours pour changer d'avis · Garantie 2 ans",
};

// Les sept sections, dans l'ordre imposé. Sert au compteur et au rail de navigation.
export type Chapitre = { id: string; titre: string };

export const chapitres: Chapitre[] = [
  { id: "hero", titre: "Le maillot" },
  { id: "probleme", titre: "Le problème" },
  { id: "histoire", titre: "L'histoire" },
  { id: "solution", titre: "La solution" },
  { id: "tarifs", titre: "Les tarifs" },
  { id: "avis", titre: "Les avis" },
  { id: "questions", titre: "Les questions" },
];

// Les flocages qui défilent sur le maillot du hero.
export type Flocage = { nom: string; numero: string };

// On alterne des légendes lyonnaises des années 2000 et des prénoms de tous les jours :
// c'est la promesse du produit, "tous tes joueurs" sur le même maillot.
export const flocages: Flocage[] = [
  { nom: "RAYAN", numero: "10" },
  { nom: "JUNINHO", numero: "8" },
  { nom: "LINA", numero: "7" },
  { nom: "BENZEMA", numero: "10" },
  { nom: "PAPA", numero: "1" },
  { nom: "CRIS", numero: "3" },
  { nom: "INÈS", numero: "23" },
  { nom: "GOVOU", numero: "14" },
];

// Les exemples proposés sous la démonstration : l'équipe de Lyon de la grande époque.
export const exemples: Flocage[] = [
  { nom: "JUNINHO", numero: "8" },
  { nom: "BENZEMA", numero: "10" },
  { nom: "COUPET", numero: "1" },
  { nom: "CRIS", numero: "3" },
  { nom: "GOVOU", numero: "14" },
  { nom: "ESSIEN", numero: "4" },
  { nom: "ABIDAL", numero: "20" },
];

export type Constat = { chiffre: string; texte: string };

export const constats: Constat[] = [
  { chiffre: "≈ 15 €", texte: "le flocage, à repayer à chaque nouveau maillot" },
  { chiffre: "1 nom", texte: "par maillot, pour toute la vie du maillot" },
  { chiffre: "0", texte: "retour en arrière une fois le flocage posé" },
];

export const histoire = {
  citation:
    "J'avais onze maillots dans un tiroir, et plus un seul que j'avais envie de porter. Alors j'ai arrêté d'en acheter, et j'ai commencé à en fabriquer un qui change avec moi.",
  auteur: "Yanis, fondateur de Floq",
  paragraphes: [
    "Yanis joue milieu droit le dimanche et soude des circuits la semaine. Le jour où son numéro 8 préféré a signé ailleurs, il a démonté une vieille liseuse et cousu l'écran dans le dos d'un maillot.",
    "Le premier prototype tenait avec du ruban adhésif. Le quarante-deuxième est celui que tu vois sur cette page.",
  ],
};

export type Benefice = { titre: string; texte: string };

// Trois bénéfices, pas plus : ce que le client gagne, pas ce que le produit contient.
export const benefices: Benefice[] = [
  {
    titre: "Un seul maillot pour tous tes joueurs",
    texte:
      "Le 10 de ton idole le soir du match, ton prénom pour le five du lundi. Tu ne rachètes plus un maillot pour changer un nom.",
  },
  {
    titre: "Un nouveau nom en dix secondes",
    texte:
      "Tu l'écris dans l'application, le maillot l'affiche. Pas de boutique, pas de fer à repasser, pas d'attente.",
  },
  {
    titre: "Un flocage toujours net",
    texte:
      "Rien n'est collé, donc rien ne craquelle. Le module se déclipse en un geste et le maillot passe en machine.",
  },
];

export type Couche = { numero: string; nom: string; texte: string };

// Les quatre couches du maillot, dans l'ordre où elles se montent dans l'animation.
export const couches: Couche[] = [
  { numero: "01", nom: "Tissu technique", texte: "Un maillot de match, avec un logement cousu dans le dos." },
  { numero: "02", nom: "Circuit flexible", texte: "Il pilote l'affichage et se plie avec le tissu." },
  { numero: "03", nom: "Panneau d'encre", texte: "Souple, mat, lisible en plein soleil." },
  { numero: "04", nom: "Module amovible", texte: "Batterie et Bluetooth. Il se déclipse avant le lavage." },
];

export type Angle = { titre: string; texte: string };

// Les quatre arrêts de la rotation, de dos jusqu'à de face.
export const angles: Angle[] = [
  { titre: "De dos", texte: "Le panneau affiche jusqu'à douze lettres et un numéro de 0 à 99." },
  { titre: "De trois quarts dos", texte: "Il est souple : il suit ton dos quand tu cours, sans faire de pli." },
  { titre: "De trois quarts face", texte: "Une maille respirante, coupée comme un maillot de match." },
  { titre: "De face", texte: "Devant, rien : ni écran, ni câble, ni bouton. Un maillot, tout simplement." },
];

export type Mesure = { valeur: string; texte: string };

export const mesures: Mesure[] = [
  { valeur: "10 s", texte: "pour changer de nom et de numéro" },
  { valeur: "3 sem.", texte: "d'autonomie, recharge en USB-C" },
  { valeur: "30 °C", texte: "en machine, module retiré" },
  { valeur: "12", texte: "lettres au maximum, numéros de 0 à 99" },
];

export type Offre = {
  id: string;
  nom: string;
  pour: string;
  prix: number;
  detailPrix: string;
  inclus: string[];
  miseEnAvant: boolean;
};

export const offres: Offre[] = [
  {
    id: "solo",
    nom: "Solo",
    pour: "Pour le supporter",
    prix: 89,
    detailPrix: "1 maillot",
    inclus: ["1 maillot Floq, taille au choix", "Module et câble USB-C", "Application incluse", "Flocages illimités"],
    miseEnAvant: false,
  },
  {
    id: "duo",
    nom: "Duo",
    pour: "Pour offrir, ou pour jouer à deux",
    prix: 159,
    detailPrix: "2 maillots, soit 79,50 € l'unité",
    inclus: ["2 maillots Floq, tailles au choix", "2 modules et 2 câbles USB-C", "Application incluse", "Flocages illimités", "Coffret cadeau"],
    miseEnAvant: true,
  },
  {
    id: "equipe",
    nom: "Équipe",
    pour: "Pour le club",
    prix: 990,
    detailPrix: "14 maillots, moins de 71 € l'unité",
    inclus: ["14 maillots Floq, tailles au choix", "14 modules et un chargeur groupé", "Tout l'effectif modifié d'un seul geste", "Flocages illimités"],
    miseEnAvant: false,
  },
];

export type Temoignage = { initiales: string; nom: string; role: string; texte: string };

// Avis fictifs : la mention est affichée dans la section.
export const temoignages: Temoignage[] = [
  {
    initiales: "LB",
    nom: "Lina B.",
    role: "Supportrice",
    texte: "J'ai porté trois noms différents en une saison sans racheter un seul maillot. Mon tiroir me dit merci.",
  },
  {
    initiales: "TR",
    nom: "Thomas R.",
    role: "Entraîneur des moins de 13 ans",
    texte:
      "Quatorze gamins, des numéros qui changent chaque samedi. Avant je passais par le fer à repasser, maintenant je passe par mon téléphone.",
  },
  {
    initiales: "IK",
    nom: "Inès K.",
    role: "Joueuse de five",
    texte: "Mon prénom pour le five, le 10 de mon joueur les soirs de match. Même maillot, deux humeurs.",
  },
];

export type Question = { question: string; reponse: string };

export const questions: Question[] = [
  {
    question: "Est-ce que le maillot passe en machine ?",
    reponse:
      "Oui. Tu déclipses le module, puis le maillot se lave à 30 °C comme n'importe quel maillot. Évite seulement le sèche-linge.",
  },
  {
    question: "Combien de temps tient la batterie ?",
    reponse:
      "Environ trois semaines. L'encre électronique ne consomme de l'énergie qu'au moment du changement : une fois affiché, le nom reste en place sans rien consommer. La recharge se fait en USB-C.",
  },
  {
    question: "Et s'il pleut pendant le match ?",
    reponse: "Le panneau et le module sont étanches. Floq est fait pour jouer dehors, pluie comprise.",
  },
  {
    question: "Est-ce que je peux jouer un match officiel avec ?",
    reponse:
      "Pour l'entraînement, le five et les tribunes, oui. Pour un match officiel, vérifie le règlement de ta ligue : certaines imposent un flocage fixe.",
  },
  {
    question: "Et si la taille ne me va pas ?",
    reponse: "Tu as 30 jours pour l'échanger ou te faire rembourser. Le retour est gratuit.",
  },
  {
    question: "Floq existe-t-il vraiment ?",
    reponse:
      "Pas encore. Floq est un projet réalisé dans le cadre d'une formation : le produit, les prix et les avis sont fictifs, et aucune commande n'est enregistrée.",
  },
];
