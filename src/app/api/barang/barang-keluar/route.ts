import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";

    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");
    const sortBy = searchParams.get("sortBy") || "tanggal";
    const sortOrder =
      (searchParams.get("sortOrder") as "asc" | "desc") || "desc";

    const where = search
      ? {
          OR: [
            {
              barang: {
                nama: { contains: search, mode: "insensitive" },
              },
            },
            {
              karyawan: {
                nama: { contains: search, mode: "insensitive" },
              },
            },
            {
              project: {
                nomor: { contains: search, mode: "insensitive" },
              },
            },
          ],
        }
      : {};

    if (!pageParam && !limitParam) {
      const barangKeluarList = await db.barangKeluar.findMany({
        where: where as any,
        include: {
          barang: true,
          karyawan: true,
        },
        orderBy: { [sortBy]: sortOrder },
      });
      return NextResponse.json({ success: true, data: barangKeluarList });
    }

    const page = parseInt(pageParam || "1");
    const limit = parseInt(limitParam || "10");
    const skip = (page - 1) * limit;

    const [barangKeluarList, totalCount] = await Promise.all([
      db.barangKeluar.findMany({
        where: where as any,
        skip,
        take: limit,
        include: {
          barang: true,
          karyawan: true,
        },
        orderBy: { [sortBy]: sortOrder },
      }),
      db.barangKeluar.count({ where: where as any }),
    ]);

    return NextResponse.json({
      success: true,
      data: barangKeluarList,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching barang keluar:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch barang keluar" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tanggal, barangId, jumlah, karyawanId, kendaraanId, deskripsi } =
      body;

    // Validation
    if (!tanggal || !barangId || !jumlah || !karyawanId) {
      return NextResponse.json(
        {
          success: false,
          error: "Tanggal, Barang, Jumlah, dan Karyawan wajib diisi",
        },
        { status: 400 },
      );
    }

    // Check stock availability
    const barang = await db.barang.findUnique({
      where: { id: barangId },
    });

    if (!barang) {
      return NextResponse.json(
        { success: false, error: "Barang tidak ditemukan" },
        { status: 404 },
      );
    }

    if (barang.stok < parseInt(jumlah)) {
      return NextResponse.json(
        {
          success: false,
          error: `Stok tidak mencukupi (Tersedia: ${barang.stok})`,
        },
        { status: 400 },
      );
    }

    // Generate Number (BK-YYYY-XXX) based on last record to handle deletions correctly
    const year = new Date().getFullYear();
    const lastRecord = await db.barangKeluar.findFirst({
      where: {
        nomor: {
          startsWith: `BK-${year}-`,
        },
      },
      orderBy: {
        nomor: "desc",
      },
    });

    let sequence = 1;
    if (lastRecord) {
      const parts = lastRecord.nomor.split("-");
      if (parts.length === 3) {
        sequence = parseInt(parts[2]) + 1;
      }
    }
    const nomor = `BK-${year}-${String(sequence).padStart(3, "0")}`;

    const result = await db.$transaction(async (prisma) => {
      // Create BarangKeluar record
      const barangKeluar = await prisma.barangKeluar.create({
        data: {
          nomor,
          tanggal: new Date(tanggal),
          jenis: body.jenis || "PRODUKSI",
          barangId,
          jumlah: parseInt(jumlah),
          karyawanId,
          kendaraanId: kendaraanId || null,
          deskripsi: deskripsi || "",
        },
        include: {
          barang: true,
          karyawan: true,
          kendaraan: true,
        },
      });

      // Update Barang Stock
      await prisma.barang.update({
        where: { id: barangId },
        data: {
          stok: {
            decrement: parseInt(jumlah),
          },
        },
      });

      return barangKeluar;
    });

    return NextResponse.json({
      success: true,
      data: result,
      message: "Barang keluar berhasil dicatat",
    });
  } catch (error) {
    console.error("Error creating barang keluar:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create barang keluar" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID wajib diisi" },
        { status: 400 },
      );
    }

    // Get record to reverse stock
    const existingRecord = await db.barangKeluar.findUnique({
      where: { id },
    });

    if (!existingRecord) {
      return NextResponse.json(
        { success: false, error: "Data tidak ditemukan" },
        { status: 404 },
      );
    }

    await db.$transaction(async (prisma) => {
      // Reverse stock (add back)
      await prisma.barang.update({
        where: { id: existingRecord.barangId },
        data: {
          stok: {
            increment: existingRecord.jumlah,
          },
        },
      });

      // Delete record
      await prisma.barangKeluar.delete({
        where: { id },
      });
    });

    return NextResponse.json({
      success: true,
      message: "Data barang keluar berhasil dihapus (stok dikembalikan)",
    });
  } catch (error) {
    console.error("Error deleting barang keluar:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete barang keluar" },
      { status: 500 },
    );
  }
}
