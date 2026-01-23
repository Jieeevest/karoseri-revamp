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

    const list = await db.kendaraanKeluar.findMany({
      where,
      include: {
        kendaraan: {
          include: {
            merekKendaraan: true,
            tipeKendaraan: true,
            customer: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: list });
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
    const { tanggalKeluar, kendaraanId, qcResult, layakKeluar, suratJalan } =
      body;

    if (!kendaraanId) {
      return NextResponse.json(
        { success: false, error: "Kendaraan ID required" },
        { status: 400 },
      );
    }

    const vehicle = await db.kendaraan.findUnique({
      where: { id: kendaraanId },
    });
    if (!vehicle) {
      return NextResponse.json(
        { success: false, error: "Kendaraan not found" },
        { status: 404 },
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
        kendaraanId,
        qcResult,
        layakKeluar,
        suratJalan,
      },
    });

    if (layakKeluar) {
      await db.kendaraan.update({
        where: { id: kendaraanId },
        data: { status: "KELUAR" },
      });
    }

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
    const { id, tanggalKeluar, qcResult, layakKeluar, suratJalan } = body;

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
        qcResult,
        layakKeluar,
        suratJalan,
      },
    });

    // Update vehicle status logic
    // If it WAS layakKeluar and now is NOT, revert to SELESAI
    // If it WAS NOT layakKeluar and now IS, set to KELUAR
    if (currentRecord.layakKeluar !== layakKeluar) {
      const newStatus = layakKeluar ? "KELUAR" : "SELESAI";
      await db.kendaraan.update({
        where: { id: currentRecord.kendaraanId },
        data: { status: newStatus },
      });
    }

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
      if (record.layakKeluar) {
        await db.kendaraan.update({
          where: { id: record.kendaraanId },
          data: { status: "SELESAI" },
        });
      }
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
