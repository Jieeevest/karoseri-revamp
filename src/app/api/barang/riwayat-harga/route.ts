import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";

    // Sort logic (default: latest first)
    // Filter logic can be added later

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

    const riwayatList = await db.riwayatHarga.findMany({
      where: where as any,
      include: {
        barang: true,
        supplier: true,
      },
      orderBy: { tanggal: "desc" },
      take: 100, // Limit for now
    });

    return NextResponse.json({ success: true, data: riwayatList });
  } catch (error) {
    console.error("Error fetching riwayat harga:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch riwayat harga" },
      { status: 500 },
    );
  }
}
