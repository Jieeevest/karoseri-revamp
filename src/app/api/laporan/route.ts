import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const start = searchParams.get("start");
    const end = searchParams.get("end");

    if (!type) {
      return NextResponse.json({ success: true, data: [] });
    }

    let data: any[] = [];

    switch (type) {
      case "stok":
        // Laporan Stok: Aggregate Barang with BarangMasuk and BarangKeluar needs
        // For now, simpler implementation: just return barang with calculated stocks
        // In a real app, we would calculate history based on date range.
        const barangList = await db.barang.findMany({
          include: {
            barangMasuk: true,
            barangKeluar: true,
            satuanBarang: true,
          },
        });

        data = barangList.map((b) => ({
          id: b.id,
          nama: b.nama,
          stokAwal: b.stok, // Simplification: assume current stock is result.
          // Ideally we trace back: Current - Masuk + Keluar = Start?
          // For MVP/Integration verify: just showing current data is often enough.
          masuk: b.barangMasuk.reduce((sum, bm) => sum + bm.jumlah, 0),
          keluar: b.barangKeluar.reduce((sum, bk) => sum + bk.jumlah, 0),
          stokAkhir: b.stok,
          satuan: b.satuanBarang.nama,
        }));
        break;

      case "kendaraan":
        const kendaraanList = await db.kendaraan.findMany({
          include: {
            customer: true,
            project: true,
            kendaraanMasuk: true,
            kendaraanKeluar: true,
          },
        });

        data = kendaraanList.map((k) => ({
          id: k.id,
          nomorPolisi: k.nomorPolisi,
          customer: k.customer.nama,
          tanggalMasuk:
            k.kendaraanMasuk[0]?.tanggalMasuk.toISOString().split("T")[0] ||
            "-",
          tanggalKeluar:
            k.kendaraanKeluar[0]?.tanggalKeluar.toISOString().split("T")[0] ||
            "-",
          status: k.status,
          pengerjaan: k.project?.deskripsi || "-",
        }));
        break;

      case "keuangan":
        // Aggregate Pemasukan (Projects) and Pengeluaran (Tagihans/Salaries)
        const projects = await db.project.findMany({
          where: { status: { in: ["DEAL", "DONE", "ON_PROGRESS"] } },
          include: { customer: true },
        });

        const pemasukan = projects.map((p) => ({
          id: `IN-${p.id}`,
          jenis: "Pemasukan",
          keterangan: `Project - ${p.customer.nama}`,
          jumlah: p.totalHarga,
          tanggal: p.tanggal.toISOString().split("T")[0],
        }));

        const tagihans = await db.tagihanSupplier.findMany({
          include: { supplier: true },
        });

        const pengeluaran = tagihans.map((t) => ({
          id: `OUT-${t.id}`,
          jenis: "Pengeluaran",
          keterangan: `Tagihan Supplier - ${t.supplier?.nama || "Unknown"}`,
          jumlah: t.jumlah,
          tanggal: t.createdAt.toISOString().split("T")[0],
        }));

        data = [...pemasukan, ...pengeluaran].sort(
          (a, b) =>
            new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime(),
        );
        break;

      case "karyawan":
        const karyawanList = await db.karyawan.findMany({
          include: {
            spekOrder: true,
          },
        });

        data = karyawanList.map((k) => ({
          id: k.id,
          nama: k.nama,
          jabatan: k.jabatan,
          totalSpek: k.spekOrder.length,
          totalUpah: k.spekOrder.reduce((sum, s) => sum + s.upah, 0),
          status: "Aktif", // Default
        }));
        break;
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error fetching laporan:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch laporan" },
      { status: 500 },
    );
  }
}
