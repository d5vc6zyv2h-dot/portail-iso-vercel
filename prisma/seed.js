const { PrismaClient } = require("@prisma/client");
const { PrismaMariaDb } = require("@prisma/adapter-mariadb");

const adapter = new PrismaMariaDb({
  host: "localhost",
  port: 3306,
  user: "portail",
  password: "",
  database: "portail_iso27001",
});

const prisma = new PrismaClient({
  adapter,
});

const questions = [
  {
    texte:
      "Les accès aux systèmes d'information sont-ils attribués selon les responsabilités des utilisateurs ?",
    categorie: "Gestion des accès",
    type: "choix",
  },
  {
    texte:
      "Les comptes des utilisateurs qui quittent l'organisation sont-ils désactivés rapidement ?",
    categorie: "Gestion des accès",
    type: "choix",
  },
  {
    texte:
      "Les droits d'accès sont-ils régulièrement vérifiés ?",
    categorie: "Gestion des accès",
    type: "choix",
  },
  {
    texte:
      "Une politique de mots de passe est-elle appliquée ?",
    categorie: "Authentification",
    type: "choix",
  },
  {
    texte:
      "Une authentification renforcée est-elle utilisée pour les comptes sensibles ?",
    categorie: "Authentification",
    type: "choix",
  },
  {
    texte:
      "Les données importantes sont-elles sauvegardées régulièrement ?",
    categorie: "Sauvegardes",
    type: "choix",
  },
  {
    texte:
      "Les sauvegardes font-elles régulièrement l'objet de tests de restauration ?",
    categorie: "Sauvegardes",
    type: "choix",
  },
  {
    texte:
      "Le réseau de l'organisation est-il protégé contre les accès non autorisés ?",
    categorie: "Sécurité réseau",
    type: "choix",
  },
  {
    texte:
      "Les équipements réseau sont-ils régulièrement mis à jour ?",
    categorie: "Sécurité réseau",
    type: "choix",
  },
  {
    texte:
      "Existe-t-il une procédure de gestion des incidents de sécurité ?",
    categorie: "Gestion des incidents",
    type: "choix",
  },
  {
    texte:
      "Les incidents de sécurité sont-ils enregistrés et analysés ?",
    categorie: "Gestion des incidents",
    type: "choix",
  },
  {
    texte:
      "L'accès aux locaux contenant des équipements informatiques est-il contrôlé ?",
    categorie: "Sécurité physique",
    type: "choix",
  },
  {
    texte:
      "Les équipements critiques sont-ils protégés contre les dommages physiques ?",
    categorie: "Sécurité physique",
    type: "choix",
  },
  {
    texte:
      "Les utilisateurs reçoivent-ils une sensibilisation à la sécurité de l'information ?",
    categorie: "Sensibilisation",
    type: "choix",
  },
  {
    texte:
      "Les utilisateurs sont-ils informés des risques liés aux mots de passe et au phishing ?",
    categorie: "Sensibilisation",
    type: "choix",
  },
];

async function main() {
  await prisma.question.deleteMany();

  await prisma.question.createMany({
    data: questions,
  });

  console.log(`${questions.length} questions ont été ajoutées.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
