import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";

    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = (searchParams.get("sortOrder") || "desc") as
      | "asc"
      | "desc";

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
          ],
        }
      : {};

    if (!pageParam && !limitParam) {
      const hargaList = await db.hargaBarang.findMany({
        where: where as any,
        include: {
          barang: true,
          supplier: true,
          kategoriBarang: true,
        },
        orderBy: { [sortBy]: sortOrder },
      });
      return NextResponse.json({ success: true, data: hargaList });
    }

    const page = parseInt(pageParam || "1");
    const limit = parseInt(limitParam || "10");
    const skip = (page - 1) * limit;

    const [hargaList, totalCount] = await Promise.all([
      db.hargaBarang.findMany({
        where: where as any,
        skip,
        take: limit,
        include: {
          barang: true,
          supplier: true,
          kategoriBarang: true,
        },
        orderBy: { [sortBy]: sortOrder },
      }),
      db.hargaBarang.count({ where: where as any }),
    ]);

    return NextResponse.json({
      success: true,
      data: hargaList,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching harga barang:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch harga barang" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { barangId, supplierId, kategoriId, harga, adalahHargaTerbaik } =
      body;

    if (!barangId || !supplierId || harga === undefined) {
      return NextResponse.json(
        { success: false, error: "Barang, Supplier, dan Harga wajib diisi" },
        { status: 400 },
      );
    }

    // Check if duplicate entry exists (same barang, same supplier)
    const existingHarga = await db.hargaBarang.findFirst({
      where: {
        barangId,
        supplierId,
      },
    });

    if (existingHarga) {
      return NextResponse.json(
        {
          success: false,
          error: "Harga untuk barang dan supplier ini sudah ada",
        },
        { status: 400 },
      );
    }

    // If marked as best price, unset others for the same barang
    if (adalahHargaTerbaik) {
      await db.hargaBarang.updateMany({
        where: { barangId },
        data: { adalahHargaTerbaik: false },
      });
    }

    const newHarga = await db.hargaBarang.create({
      data: {
        barangId,
        supplierId,
        kategoriId: parseInt(kategoriId),
        harga: parseFloat(harga),
        adalahHargaTerbaik: adalahHargaTerbaik || false,
      },
      include: {
        barang: true,
        supplier: true,
      },
    });

    // Create history record
    await db.riwayatHarga.create({
      data: {
        barangId,
        supplierId,
        hargaLama: 0,
        hargaBaru: parseFloat(harga),
        keterangan: "Harga awal",
      },
    });

    return NextResponse.json({
      success: true,
      data: newHarga,
      message: "Harga barang berhasil ditambahkan",
    });
  } catch (error) {
    console.error("Error creating harga barang:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create harga barang" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, barangId, supplierId, kategoriId, harga, adalahHargaTerbaik } =
      body;

    if (!id || !barangId || !supplierId || harga === undefined) {
      return NextResponse.json(
        {
          success: false,
          error: "ID, Barang, Supplier, dan Harga wajib diisi",
        },
        { status: 400 },
      );
    }

    // Check availability (excluding current)
    const existingHarga = await db.hargaBarang.findFirst({
      where: {
        AND: [{ id: { not: id } }, { barangId }, { supplierId }],
      },
    });

    if (existingHarga) {
      return NextResponse.json(
        {
          success: false,
          error: "Harga untuk barang dan supplier ini sudah ada",
        },
        { status: 400 },
      );
    }

    if (adalahHargaTerbaik) {
      await db.hargaBarang.updateMany({
        where: { barangId, id: { not: id } },
        data: { adalahHargaTerbaik: false },
      });
    }

    const currentHarga = await db.hargaBarang.findUnique({
      where: { id },
    });

    const oldPrice = currentHarga ? currentHarga.harga : 0;
    const newPrice = parseFloat(harga);

    const updatedHarga = await db.hargaBarang.update({
      where: { id },
      data: {
        barangId,
        supplierId,
        kategoriId: parseInt(kategoriId),
        harga: newPrice,
        adalahHargaTerbaik: adalahHargaTerbaik || false,
      },
      include: {
        barang: true,
        supplier: true,
      },
    });

    // Record history if price changed
    if (oldPrice !== newPrice) {
      await db.riwayatHarga.create({
        data: {
          barangId,
          supplierId,
          hargaLama: oldPrice,
          hargaBaru: newPrice,
          keterangan: "Update harga",
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: updatedHarga,
      message: "Harga barang berhasil diperbarui",
    });
  } catch (error) {
    console.error("Error updating harga barang:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update harga barang" },
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

    await db.hargaBarang.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Harga barang berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting harga barang:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete harga barang" },
      { status: 500 },
    );
  }
}
