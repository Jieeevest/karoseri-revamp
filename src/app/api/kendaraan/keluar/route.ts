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

    const count = await db.kendaraanKeluar.count();
    const nomor = `KK-${new Date().getFullYear()}-${String(count + 1).padStart(3, "0")}`;

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

    await db.kendaraanKeluar.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error delete kendaraan keluar:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete data" },
      { status: 500 },
    );
  }
}
