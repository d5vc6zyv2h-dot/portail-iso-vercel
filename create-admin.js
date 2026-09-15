require("dotenv/config");

const { PrismaClient } = require("@prisma/client");
const { PrismaMariaDb } = require("@prisma/adapter-mariadb");
const bcrypt = require("bcryptjs");

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

async function main() {
  const password = await bcrypt.hash("Admin@2026", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Administrateur",
      email: "admin@portail-iso27001.com",
      password,
      role: "Administrateur",
    },
  });

  console.log("Administrateur créé :", admin.email);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
