const { PrismaClient } = require("../src/generated/prisma");
const { PrismaPg } = require("@prisma/adapter-pg");
const pg = require("pg");

const connectionString = "postgres://d29c0119148b1a89d88877c891f7586376359a24769da33a05b0e92dfa6db52d:sk_LVkZzBdS0bIm_G0BqYkid@db.prisma.io:5432/postgres?sslmode=require";

async function main() {
  const pool = new pg.Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  // Delete matching resources from DB
  const idsToDelete = ["res-1", "res-2", "res-3", "res-4", "res-5", "res-6"];
  const titlesToDelete = [
    "Crop Production and Management",
    "Cell Structure & Organisation",
    "Linear Equations in One Variable",
    "The Solar System — Diagram Pack",
    "Algebraic Expressions Revision Notes",
    "Photosynthesis Exam Prep Pack"
  ];

  const deleteById = await prisma.resource.deleteMany({
    where: {
      id: { in: idsToDelete }
    }
  });

  const deleteByTitle = await prisma.resource.deleteMany({
    where: {
      title: { in: titlesToDelete }
    }
  });

  console.log(`Deleted ${deleteById.count} resources by ID.`);
  console.log(`Deleted ${deleteByTitle.count} resources by Title.`);

  await prisma.$disconnect();
  await pool.end();
}

main().catch(console.error);
