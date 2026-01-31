import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const skip = (page - 1) * limit;

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

    const [list, total] = await Promise.all([
      db.spekOrder.findMany({
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
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: limit,
      }),
      db.spekOrder.count({ where }),
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

    // Robust Number Generation
    const year = new Date().getFullYear();
    const lastRecord = await db.spekOrder.findFirst({
      where: {
        nomor: {
          startsWith: `SO-${year}-`,
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
    const nomor = `SO-${year}-${String(sequence).padStart(3, "0")}`;

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

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, kendaraanId, karyawanId, jenis, deskripsi, upah } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID is required" },
        { status: 400 },
      );
    }

    const updatedItem = await db.spekOrder.update({
      where: { id },
      data: {
        kendaraanId,
        karyawanId,
        jenis,
        deskripsi,
        upah: parseFloat(upah),
      },
    });

    return NextResponse.json({ success: true, data: updatedItem });
  } catch (error) {
    console.error("Error update spek order:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update data" },
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
