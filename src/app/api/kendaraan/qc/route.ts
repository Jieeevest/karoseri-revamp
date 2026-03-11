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
    const layak = searchParams.get("layak");
    const pending = searchParams.get("pending");
    const skip = (page - 1) * limit;

    const where: any = {};
    if (layak === "true") {
      where.layakKeluar = true;
    }
    if (layak === "false") {
      where.layakKeluar = false;
    }

    if (pending === "true") {
      where.kendaraanMasuk = {
        kendaraanKeluar: {
          none: {},
        },
      };
    }

    if (search) {
      where.OR = [
        { kendaraan: { nomorPolisi: { contains: search, mode: "insensitive" } } },
        { kendaraan: { customer: { nama: { contains: search, mode: "insensitive" } } } },
        { kendaraanMasuk: { customer: { nama: { contains: search, mode: "insensitive" } } } },
      ];
    }

    const [list, total] = await Promise.all([
      db.kendaraanQC.findMany({
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
            },
          },
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: limit,
      }),
      db.kendaraanQC.count({ where }),
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
    console.error("Error fetch kendaraan QC:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch QC" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { kendaraanMasukId, tanggalQC, hasil, layakKeluar, checklist } = body;

    if (!kendaraanMasukId || !tanggalQC || !hasil) {
      return NextResponse.json(
        { success: false, error: "Field wajib harus diisi" },
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

    const existing = await db.kendaraanQC.findUnique({
      where: { kendaraanMasukId },
    });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "QC untuk kendaraan ini sudah ada" },
        { status: 409 },
      );
    }

    const newQC = await db.kendaraanQC.create({
      data: {
        kendaraanMasukId,
        kendaraanId: kendaraanMasuk.kendaraanId,
        tanggalQC: new Date(tanggalQC),
        hasil,
        layakKeluar: !!layakKeluar,
        checklist: checklist || null,
      },
      include: {
        kendaraan: true,
        kendaraanMasuk: true,
      },
    });

    return NextResponse.json({ success: true, data: newQC });
  } catch (error) {
    console.error("Error create kendaraan QC:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create QC" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, tanggalQC, hasil, layakKeluar, checklist } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID required" },
        { status: 400 },
      );
    }

    const updated = await db.kendaraanQC.update({
      where: { id },
      data: {
        tanggalQC: tanggalQC ? new Date(tanggalQC) : undefined,
        hasil,
        layakKeluar,
        checklist,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error update kendaraan QC:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update QC" },
      { status: 500 },
    );
  }
}
