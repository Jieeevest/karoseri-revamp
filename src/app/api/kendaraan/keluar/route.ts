import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.OR = [
        { nomor: { contains: search, mode: "insensitive" } },
        {
          kendaraan: { nomorPolisi: { contains: search, mode: "insensitive" } },
        },
        {
          kendaraan: {
            customer: { nama: { contains: search, mode: "insensitive" } },
          },
        },
      ];
    }

    if (dateFrom || dateTo) {
      where.tanggalKeluar = {};
      if (dateFrom) {
        where.tanggalKeluar.gte = new Date(dateFrom);
      }
      if (dateTo) {
        const end = new Date(dateTo);
        end.setHours(23, 59, 59, 999);
        where.tanggalKeluar.lte = end;
      }
    }

    const [list, total] = await Promise.all([
      db.kendaraanKeluar.findMany({
        where,
        include: {
          kendaraan: {
            include: {
              merekKendaraan: true,
              tipeKendaraan: true,
              customer: true,
            },
          },
          kendaraanMasuk: {
            include: {
              customer: true,
              kendaraan: {
                include: {
                  merekKendaraan: true,
                  tipeKendaraan: true,
                  customer: true,
                },
              },
            },
          },
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: limit,
      }),
      db.kendaraanKeluar.count({ where }),
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
    console.error("Error fetch kendaraan keluar:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch data" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tanggalKeluar, kendaraanMasukId, keterangan } = body;

    if (!kendaraanMasukId) {
      return NextResponse.json(
        { success: false, error: "Kendaraan masuk wajib dipilih" },
        { status: 400 },
      );
    }

    const kendaraanMasuk = await db.kendaraanMasuk.findUnique({
      where: { id: kendaraanMasukId },
      include: { kendaraan: true },
    });
    if (!kendaraanMasuk) {
      return NextResponse.json(
        { success: false, error: "Kendaraan masuk tidak ditemukan" },
        { status: 404 },
      );
    }

    const qcRecord = await db.kendaraanQC.findUnique({
      where: { kendaraanMasukId },
    });

    if (!qcRecord || !qcRecord.layakKeluar) {
      return NextResponse.json(
        { success: false, error: "Kendaraan belum lulus QC" },
        { status: 400 },
      );
    }

    const existingKeluar = await db.kendaraanKeluar.findFirst({
      where: { kendaraanMasukId },
    });
    if (existingKeluar) {
      return NextResponse.json(
        { success: false, error: "Kendaraan ini sudah tercatat keluar" },
        { status: 409 },
      );
    }

    // Robust Number Generation
    const year = new Date().getFullYear();
    const lastRecord = await db.kendaraanKeluar.findFirst({
      where: {
        nomor: {
          startsWith: `KK-${year}-`,
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
    const nomor = `KK-${year}-${String(sequence).padStart(3, "0")}`;

    const newEntry = await db.kendaraanKeluar.create({
      data: {
        nomor,
        tanggalKeluar: new Date(tanggalKeluar),
        kendaraanId: kendaraanMasuk.kendaraanId,
        kendaraanMasukId,
        qcResult: qcRecord.hasil,
        layakKeluar: qcRecord.layakKeluar,
        suratJalan: null,
        keterangan: keterangan || null,
      },
    });

    await db.kendaraan.update({
      where: { id: kendaraanMasuk.kendaraanId },
      data: { status: "KELUAR" },
    });

    return NextResponse.json({ success: true, data: newEntry });
  } catch (error) {
    console.error("Error create kendaraan keluar:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create data" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, tanggalKeluar, keterangan } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID is required" },
        { status: 400 },
      );
    }

    const currentRecord = await db.kendaraanKeluar.findUnique({
      where: { id },
    });

    if (!currentRecord) {
      return NextResponse.json(
        { success: false, error: "Data not found" },
        { status: 404 },
      );
    }

    const updatedEntry = await db.kendaraanKeluar.update({
      where: { id },
      data: {
        tanggalKeluar: new Date(tanggalKeluar),
        keterangan: keterangan || null,
      },
    });

    return NextResponse.json({ success: true, data: updatedEntry });
  } catch (error) {
    console.error("Error update kendaraan keluar:", error);
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

    const record = await db.kendaraanKeluar.findUnique({ where: { id } });
    if (record) {
      // Revert vehicle status if it was marked as KELUAR
      await db.kendaraan.update({
        where: { id: record.kendaraanId },
        data: { status: "SELESAI" },
      });
      await db.kendaraanKeluar.delete({ where: { id } });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error delete kendaraan keluar:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete data" },
      { status: 500 },
    );
  }
}
