import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";

    // Check if pagination parameters exist, otherwise return all
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
              supplier: {
                nama: { contains: search, mode: "insensitive" },
              },
            },
            {
              nomorSuratJalan: { contains: search, mode: "insensitive" },
            },
          ],
        }
      : {};

    if (!pageParam && !limitParam) {
      const barangMasukList = await db.barangMasuk.findMany({
        where: where as any,
        include: {
          barang: true,
          supplier: true,
        },
        orderBy: { [sortBy]: sortOrder },
      });
      return NextResponse.json({ success: true, data: barangMasukList });
    }

    const page = parseInt(pageParam || "1");
    const limit = parseInt(limitParam || "10");
    const skip = (page - 1) * limit;

    const [barangMasukList, totalCount] = await Promise.all([
      db.barangMasuk.findMany({
        where: where as any,
        skip,
        take: limit,
        include: {
          barang: true,
          supplier: true,
        },
        orderBy: { [sortBy]: sortOrder },
      }),
      db.barangMasuk.count({ where: where as any }),
    ]);

    return NextResponse.json({
      success: true,
      data: barangMasukList,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching barang masuk:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch barang masuk" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      tanggal,
      barangId,
      supplierId,
      purchaseOrderId,
      jumlah,
      hargaSatuan,
      totalHarga,
      nomorSuratJalan,
      keterangan,
    } = body;

    // Validation
    if (!tanggal || !barangId || !supplierId || !jumlah) {
      return NextResponse.json(
        {
          success: false,
          error: "Tanggal, Barang, Supplier, dan Jumlah wajib diisi",
        },
        { status: 400 },
      );
    }

    const result = await db.$transaction(async (prisma) => {
      // Create BarangMasuk record
      const barangMasuk = await prisma.barangMasuk.create({
        data: {
          tanggal,
          barangId,
          supplierId,
          purchaseOrderId: purchaseOrderId || null,
          jumlah: parseInt(jumlah),
          hargaSatuan: parseFloat(hargaSatuan) || 0,
          totalHarga: parseFloat(totalHarga) || 0,
          nomorSuratJalan: nomorSuratJalan || "",
          keterangan: keterangan || "",
        },
        include: {
          barang: true,
        },
      });

      // Update Barang Stock
      await prisma.barang.update({
        where: { id: barangId },
        data: {
          stok: {
            increment: parseInt(jumlah),
          },
        },
      });

      return barangMasuk;
    });

    return NextResponse.json({
      success: true,
      data: result,
      message: "Barang masuk berhasil dicatat",
    });
  } catch (error) {
    console.error("Error creating barang masuk:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create barang masuk" },
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
    const existingRecord = await db.barangMasuk.findUnique({
      where: { id },
    });

    if (!existingRecord) {
      return NextResponse.json(
        { success: false, error: "Data tidak ditemukan" },
        { status: 404 },
      );
    }

    await db.$transaction(async (prisma) => {
      // Reverse stock
      await prisma.barang.update({
        where: { id: existingRecord.barangId },
        data: {
          stok: {
            decrement: existingRecord.jumlah,
          },
        },
      });

      // Delete record
      await prisma.barangMasuk.delete({
        where: { id },
      });
    });

    return NextResponse.json({
      success: true,
      message: "Data barang masuk berhasil dihapus (stok dikembalikan)",
    });
  } catch (error) {
    console.error("Error deleting barang masuk:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete barang masuk" },
      { status: 500 },
    );
  }
}
