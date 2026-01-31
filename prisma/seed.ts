import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Creating test user...");

  const hashedPassword = await bcrypt.hash("admin123", 10);

  // Create Admin
  const admin = await prisma.user.upsert({
    where: { username: "admin" },
    update: { role: "ADMIN" },
    create: {
      username: "admin",
      email: "admin@karoseri.com",
      password: hashedPassword,
      name: "Administrator",
      role: "ADMIN",
    },
  });

  // Create Gudang User
  await prisma.user.upsert({
    where: { username: "gudang" },
    update: { role: "GUDANG" },
    create: {
      username: "gudang",
      email: "gudang@karoseri.com",
      password: await bcrypt.hash("gudang123", 10),
      name: "Staff Gudang",
      role: "GUDANG",
    },
  });

  // Create Purchasing User
  await prisma.user.upsert({
    where: { username: "purchasing" },
    update: { role: "PURCHASING" },
    create: {
      username: "purchasing",
      email: "purchasing@karoseri.com",
      password: await bcrypt.hash("purchasing123", 10),
      name: "Staff Purchasing",
      role: "PURCHASING",
    },
  });

  // Create Produksi User
  await prisma.user.upsert({
    where: { username: "produksi" },
    update: { role: "PRODUKSI" },
    create: {
      username: "produksi",
      email: "produksi@karoseri.com",
      password: await bcrypt.hash("produksi123", 10),
      name: "Staff Produksi",
      role: "PRODUKSI",
    },
  });

  console.log("✅ Users created successfully:");
  console.log(" - admin / admin123 (ADMIN)");
  console.log(" - gudang / gudang123 (GUDANG)");
  console.log(" - purchasing / purchasing123 (PURCHASING)");
  console.log(" - produksi / produksi123 (PRODUKSI)");
}

main()
  .catch((e) => {
    console.error("Error creating test user:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
