import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = (searchParams.get("sortOrder") || "desc") as
      | "asc"
      | "desc";
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            {
              barang: {
                nama: { contains: search, mode: "insensitive" },
              },
            },
            {
              barang: {
                kode: { contains: search, mode: "insensitive" },
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

    const [riwayatList, totalCount] = await Promise.all([
      db.riwayatHarga.findMany({
        where: where as any,
        include: {
          barang: true,
          supplier: true,
        },
        orderBy: {
          [sortBy === "createdAt" ? "tanggal" : sortBy]: sortOrder,
        },
        skip,
        take: limit,
      }),
      db.riwayatHarga.count({ where: where as any }),
    ]);

    return NextResponse.json({
      success: true,
      data: riwayatList,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching riwayat harga:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch riwayat harga" },
      { status: 500 },
    );
  }
}
