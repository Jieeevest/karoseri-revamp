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

  // Create Superadmin
  await prisma.user.upsert({
    where: { username: "superadmin" },
    update: { role: "SUPERADMIN" },
    create: {
      username: "superadmin",
      email: "superadmin@karoseri.com",
      password: await bcrypt.hash("superadmin123", 10),
      name: "Super Administrator",
      role: "SUPERADMIN",
    },
  });

  // Create QC User
  await prisma.user.upsert({
    where: { username: "qc" },
    update: { role: "QC" },
    create: {
      username: "qc",
      email: "qc@karoseri.com",
      password: await bcrypt.hash("qc123", 10),
      name: "Staff QC",
      role: "QC",
    },
  });

  console.log("✅ Users created successfully:");
  console.log(" - superadmin / superadmin123 (SUPERADMIN)");
  console.log(" - admin / admin123 (ADMIN)");
  console.log(" - gudang / gudang123 (GUDANG)");
  console.log(" - purchasing / purchasing123 (PURCHASING)");
  console.log(" - produksi / produksi123 (PRODUKSI)");
  console.log(" - qc / qc123 (QC)");

  console.log("Seeding master data barang/supplier...");

  const kategoriBahanBaku = await prisma.kategoriBarang.upsert({
    where: { nama: "Bahan Baku" },
    update: {
      deskripsi: "Material utama untuk proses produksi",
    },
    create: {
      nama: "Bahan Baku",
      deskripsi: "Material utama untuk proses produksi",
    },
  });

  const kategoriKomponen = await prisma.kategoriBarang.upsert({
    where: { nama: "Komponen" },
    update: {
      deskripsi: "Komponen pendukung produksi",
    },
    create: {
      nama: "Komponen",
      deskripsi: "Komponen pendukung produksi",
    },
  });

  const satuanLembar = await prisma.satuanBarang.upsert({
    where: { nama: "Lembar" },
    update: {},
    create: { nama: "Lembar" },
  });

  const satuanBatang = await prisma.satuanBarang.upsert({
    where: { nama: "Batang" },
    update: {},
    create: { nama: "Batang" },
  });

  const satuanLiter = await prisma.satuanBarang.upsert({
    where: { nama: "Liter" },
    update: {},
    create: { nama: "Liter" },
  });

  const supplierSteel = await prisma.supplier.upsert({
    where: { kode: "SUP001" },
    update: {
      nama: "PT Baja Nusantara",
      alamat: "Jl. Industri Baja No. 10, Cikarang",
      telepon: "021-8899-1122",
      email: "sales@bajanusantara.co.id",
    },
    create: {
      kode: "SUP001",
      nama: "PT Baja Nusantara",
      alamat: "Jl. Industri Baja No. 10, Cikarang",
      telepon: "021-8899-1122",
      email: "sales@bajanusantara.co.id",
    },
  });

  await prisma.supplierBankAccount.deleteMany({
    where: { supplierId: supplierSteel.id },
  });
  await prisma.supplierBankAccount.createMany({
    data: [
      {
        supplierId: supplierSteel.id,
        nomorRekening: "0140001234567",
        atasNamaRekening: "PT Baja Nusantara",
        namaBank: "BCA",
      },
      {
        supplierId: supplierSteel.id,
        nomorRekening: "9000012345678",
        atasNamaRekening: "PT Baja Nusantara",
        namaBank: "Bank Mandiri",
      },
    ],
  });

  const supplierCat = await prisma.supplier.upsert({
    where: { kode: "SUP002" },
    update: {
      nama: "CV Cat Prima",
      alamat: "Jl. Raya Bogor Km 24, Depok",
      telepon: "021-7755-3344",
      email: "marketing@catprima.id",
    },
    create: {
      kode: "SUP002",
      nama: "CV Cat Prima",
      alamat: "Jl. Raya Bogor Km 24, Depok",
      telepon: "021-7755-3344",
      email: "marketing@catprima.id",
    },
  });

  await prisma.supplierBankAccount.deleteMany({
    where: { supplierId: supplierCat.id },
  });
  await prisma.supplierBankAccount.createMany({
    data: [
      {
        supplierId: supplierCat.id,
        nomorRekening: "1188012345",
        atasNamaRekening: "CV Cat Prima",
        namaBank: "BRI",
      },
    ],
  });

  const supplierKomponen = await prisma.supplier.upsert({
    where: { kode: "SUP003" },
    update: {
      nama: "PT Komponen Jaya",
      alamat: "Jl. Siliwangi No. 88, Bandung",
      telepon: "022-6011-8899",
      email: "procurement@komponenjaya.com",
    },
    create: {
      kode: "SUP003",
      nama: "PT Komponen Jaya",
      alamat: "Jl. Siliwangi No. 88, Bandung",
      telepon: "022-6011-8899",
      email: "procurement@komponenjaya.com",
    },
  });

  await prisma.supplierBankAccount.deleteMany({
    where: { supplierId: supplierKomponen.id },
  });
  await prisma.supplierBankAccount.createMany({
    data: [
      {
        supplierId: supplierKomponen.id,
        nomorRekening: "0288009988776",
        atasNamaRekening: "PT Komponen Jaya",
        namaBank: "BNI",
      },
    ],
  });

  const barangPlatBaja = await prisma.barang.upsert({
    where: { kode: "BRG-PLAT-001" },
    update: {
      nama: "Plat Baja 2mm",
      kategoriId: kategoriBahanBaku.id,
      satuanId: satuanLembar.id,
      stokMinimum: 20,
    },
    create: {
      kode: "BRG-PLAT-001",
      nama: "Plat Baja 2mm",
      kategoriId: kategoriBahanBaku.id,
      satuanId: satuanLembar.id,
      stokMinimum: 20,
    },
  });

  const barangPipa = await prisma.barang.upsert({
    where: { kode: "BRG-PIPA-001" },
    update: {
      nama: "Pipa Hollow 4x4",
      kategoriId: kategoriBahanBaku.id,
      satuanId: satuanBatang.id,
      stokMinimum: 30,
    },
    create: {
      kode: "BRG-PIPA-001",
      nama: "Pipa Hollow 4x4",
      kategoriId: kategoriBahanBaku.id,
      satuanId: satuanBatang.id,
      stokMinimum: 30,
    },
  });

  const barangCat = await prisma.barang.upsert({
    where: { kode: "BRG-CAT-001" },
    update: {
      nama: "Cat Primer Abu",
      kategoriId: kategoriKomponen.id,
      satuanId: satuanLiter.id,
      stokMinimum: 50,
    },
    create: {
      kode: "BRG-CAT-001",
      nama: "Cat Primer Abu",
      kategoriId: kategoriKomponen.id,
      satuanId: satuanLiter.id,
      stokMinimum: 50,
    },
  });

  const barangBaut = await prisma.barang.upsert({
    where: { kode: "BRG-BAUT-001" },
    update: {
      nama: "Baut M10",
      kategoriId: kategoriKomponen.id,
      satuanId: satuanBatang.id,
      stokMinimum: 100,
    },
    create: {
      kode: "BRG-BAUT-001",
      nama: "Baut M10",
      kategoriId: kategoriKomponen.id,
      satuanId: satuanBatang.id,
      stokMinimum: 100,
    },
  });

  const hargaSeed = [
    {
      barangId: barangPlatBaja.id,
      supplierId: supplierSteel.id,
      kategoriId: kategoriBahanBaku.id,
      harga: 325000,
      adalahHargaTerbaik: true,
    },
    {
      barangId: barangPipa.id,
      supplierId: supplierSteel.id,
      kategoriId: kategoriBahanBaku.id,
      harga: 178000,
      adalahHargaTerbaik: true,
    },
    {
      barangId: barangCat.id,
      supplierId: supplierCat.id,
      kategoriId: kategoriKomponen.id,
      harga: 98000,
      adalahHargaTerbaik: true,
    },
    {
      barangId: barangBaut.id,
      supplierId: supplierKomponen.id,
      kategoriId: kategoriKomponen.id,
      harga: 12000,
      adalahHargaTerbaik: true,
    },
    {
      barangId: barangPipa.id,
      supplierId: supplierKomponen.id,
      kategoriId: kategoriBahanBaku.id,
      harga: 182000,
      adalahHargaTerbaik: false,
    },
  ];

  for (const item of hargaSeed) {
    await prisma.hargaBarang.upsert({
      where: {
        barangId_supplierId: {
          barangId: item.barangId,
          supplierId: item.supplierId,
        },
      },
      update: {
        kategoriId: item.kategoriId,
        harga: item.harga,
        adalahHargaTerbaik: item.adalahHargaTerbaik,
      },
      create: item,
    });
  }

  console.log("✅ Master data barang/supplier berhasil disiapkan");
}

main()
  .catch((e) => {
    console.error("Error creating test user:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
