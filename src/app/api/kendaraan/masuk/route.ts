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
        { showroom: { contains: search, mode: "insensitive" } },
        { customer: { nama: { contains: search, mode: "insensitive" } } },
        {
          kendaraan: { nomorPolisi: { contains: search, mode: "insensitive" } },
        },
      ];
    }

    const list = await db.kendaraanMasuk.findMany({
      where,
      include: {
        customer: true,
        kendaraan: {
          include: {
            merekKendaraan: true,
            tipeKendaraan: true,
            project: true,
          },
        },
        pengerjaan: true,
        kelengkapan: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: list });
  } catch (error) {
    console.error("Error fetch kendaraan masuk:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch data" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      tanggalMasuk,
      showroom,
      customerId,
      kendaraanId,
      nomorPolisi,
      merek,
      tipe,
      projectId,
      pengerjaan,
      kelengkapan,
    } = body;

    let targetKendaraanId = kendaraanId;

    if (!targetKendaraanId && nomorPolisi) {
      const existingKendaraan = await db.kendaraan.findUnique({
        where: { nomorPolisi },
      });

      if (existingKendaraan) {
        targetKendaraanId = existingKendaraan.id;
      } else {
        if (!body.merekId || !body.tipeId) {
          return NextResponse.json(
            {
              success: false,
              error: "Merek and Tipe are required for new vehicles",
            },
            { status: 400 },
          );
        }
        const newKendaraan = await db.kendaraan.create({
          data: {
            nomorPolisi,
            nomorChasis: body.nomorChasis || "-",
            nomorMesin: body.nomorMesin || "-",
            merekId: body.merekId,
            tipeId: body.tipeId,
            customerId,
            projectId,
            status: "MASUK",
          },
        });
        targetKendaraanId = newKendaraan.id;
      }
    }

    if (!targetKendaraanId) {
      return NextResponse.json(
        {
          success: false,
          error: "Kendaraan ID or valid vehicle details required",
        },
        { status: 400 },
      );
    }

    const count = await db.kendaraanMasuk.count();
    const nomor = `KM-${new Date().getFullYear()}-${String(count + 1).padStart(3, "0")}`;

    const newEntry = await db.kendaraanMasuk.create({
      data: {
        nomor,
        tanggalMasuk: new Date(tanggalMasuk),
        showroom,
        customerId,
        kendaraanId: targetKendaraanId,
        pengerjaan: {
          create: pengerjaan?.map((p: any) => ({
            jenis: p.jenis,
            deskripsi: p.deskripsi,
          })),
        },
        kelengkapan: {
          create: kelengkapan?.map((k: any) => ({
            area: k.area,
            nama: k.nama,
            jumlah: k.jumlah ? parseInt(k.jumlah) : null,
            kondisi: k.kondisi,
            deskripsi: k.deskripsi,
          })),
        },
      },
      include: {
        pengerjaan: true,
        kelengkapan: true,
      },
    });

    await db.kendaraan.update({
      where: { id: targetKendaraanId },
      data: { status: "MASUK", projectId: projectId || undefined },
    });

    return NextResponse.json({ success: true, data: newEntry });
  } catch (error) {
    console.error("Error create kendaraan masuk:", error);
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

    // Must delete related records first because schema doesn't specify cascade on all relations automatically?
    // Actually, Pengerjaan and KelengkapanAlat have relations to KendaraanMasuk.
    // If we use Prisma's nested delete or just transaction, we are safe.
    // However, explicit deletion ensures safety against constraint errors.

    await db.$transaction(async (tx) => {
      await tx.pengerjaan.deleteMany({ where: { kendaraanMasukId: id } });
      await tx.kelengkapanAlat.deleteMany({ where: { kendaraanMasukId: id } });
      await tx.kendaraanMasuk.delete({ where: { id } });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error delete kendaraan masuk:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete data" },
      { status: 500 },
    );
  }
}
