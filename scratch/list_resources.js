const { PrismaClient } = require("../src/generated/prisma");
const { PrismaPg } = require("@prisma/adapter-pg");
const pg = require("pg");

const connectionString = "postgres://d29c0119148b1a89d88877c891f7586376359a24769da33a05b0e92dfa6db52d:sk_LVkZzBdS0bIm_G0BqYkid@db.prisma.io:5432/postgres?sslmode=require";

async function main() {
  const pool = new pg.Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const resources = await prisma.resource.findMany();
  console.log(JSON.stringify(resources, null, 2));

  await prisma.$disconnect();
  await pool.end();
}

main().catch(console.error);
