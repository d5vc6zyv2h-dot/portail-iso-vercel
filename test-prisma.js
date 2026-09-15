require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const { PrismaMariaDb } = require("@prisma/adapter-mariadb");

const adapter = new PrismaMariaDb({
  host: "localhost",
  port: 3306,
  user: "portail",
  password: "",
  database: "portail_iso27001",
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const count = await prisma.user.count();
  console.log("Utilisateurs :", count);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
