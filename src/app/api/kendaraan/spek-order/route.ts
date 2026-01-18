import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";

    const where: any = {};
    if (search) {
      where.OR = [
        { nomor: { contains: search, mode: "insensitive" } },
        { deskripsi: { contains: search, mode: "insensitive" } },
        {
          kendaraan: { nomorPolisi: { contains: search, mode: "insensitive" } },
        },
        { karyawan: { nama: { contains: search, mode: "insensitive" } } },
      ];
    }

    const list = await db.spekOrder.findMany({
      where,
      include: {
        kendaraan: {
          include: {
            merekKendaraan: true,
            tipeKendaraan: true,
          },
        },
        karyawan: true,
        pembayaran: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: list });
  } catch (error) {
    console.error("Error fetch spek order:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch data" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { kendaraanId, karyawanId, jenis, deskripsi, upah } = body;

    const count = await db.spekOrder.count();
    const nomor = `SO-${new Date().getFullYear()}-${String(count + 1).padStart(3, "0")}`;

    const newItem = await db.spekOrder.create({
      data: {
        nomor,
        kendaraanId,
        karyawanId,
        jenis,
        deskripsi,
        upah: parseFloat(upah),
        status: "BELUM_DIBAYAR",
      },
    });

    return NextResponse.json({ success: true, data: newItem });
  } catch (error) {
    console.error("Error create spek order:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create data" },
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
        { success: false, error: "ID is required" },
        { status: 400 },
      );
    }

    // Delete related payments first
    await db.$transaction(async (tx) => {
      await tx.pembayaranSpek.deleteMany({ where: { spekOrderId: id } });
      await tx.spekOrder.delete({ where: { id } });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error delete spek order:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete data" },
      { status: 500 },
    );
  }
}
