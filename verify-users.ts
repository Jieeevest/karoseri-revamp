import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const usernames = ["superadmin", "admin", "gudang", "qc"];

  console.log("Checking users...");

  for (const username of usernames) {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      console.log(`❌ User ${username} NOT FOUND`);
      continue;
    }

    console.log(`✅ User ${username} found. Role: ${user.role}`);

    const password = `${username}123`;
    const isValid = await bcrypt.compare(password, user.password);

    if (isValid) {
      console.log(`   ✅ Password '${password}' is VALID`);
    } else {
      console.log(`   ❌ Password '${password}' is INVALID`);
      console.log(`      Hash in DB: ${user.password}`);
      const newHash = await bcrypt.hash(password, 10);
      console.log(`      Expected Hash (approx): ${newHash}`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
