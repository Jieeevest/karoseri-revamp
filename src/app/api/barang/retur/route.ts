import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const sortBy = searchParams.get("sortBy") || "tanggal";
    const sortOrder = (searchParams.get("sortOrder") || "desc") as
      | "asc"
      | "desc";
    const skip = (page - 1) * limit;

    const where: any = search
      ? {
          OR: [
            { nomor: { contains: search, mode: "insensitive" } },
            { barang: { nama: { contains: search, mode: "insensitive" } } },
            { supplier: { nama: { contains: search, mode: "insensitive" } } },
          ],
        }
      : {};

    const [list, total] = await Promise.all([
      db.barangRetur.findMany({
        where,
        include: {
          barang: true,
          supplier: true,
          purchaseOrder: true,
          createdBy: true,
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      db.barangRetur.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: list,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching retur barang:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch retur barang" },
      { status: 500 },
    );
  }
}
