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

    const where: any = search
      ? {
          OR: [
            { nomor: { contains: search, mode: "insensitive" } },
            { customer: { nama: { contains: search, mode: "insensitive" } } },
            {
              kendaraan: {
                nomorPolisi: { contains: search, mode: "insensitive" },
              },
            },
          ],
        }
      : {};

    const [kendaraanMasukList, totalCount] = await Promise.all([
      db.kendaraanMasuk.findMany({
        where,
        include: {
          customer: true,
          kendaraan: true,
          kendaraanQC: true,
          pengerjaan: true,
          kelengkapan: true,
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: limit,
      }),
      db.kendaraanMasuk.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: kendaraanMasukList,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching kendaraan masuk:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch kendaraan masuk" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      tanggalMasuk,
      jenisMasuk,
      showroom,
      namaJasaPengiriman,
      namaSupir,
      customerId,
      kendaraanId,
      nomorPolisi,
      nomorChasis,
      nomorMesin,
      merekId,
      tipeId,
      pengerjaan,
      kelengkapan,
    } = body;

    // Validation
    if (!tanggalMasuk || !showroom) {
      return NextResponse.json(
        { success: false, error: "Field wajib harus diisi" },
        { status: 400 },
      );
    }

    // Generate nomor
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");

    const latestKM = await db.kendaraanMasuk.findFirst({
      orderBy: { createdAt: "desc" },
      where: {
        nomor: {
          startsWith: `KM-${year}-${month}`,
        },
      },
    });

    let sequence = 1;
    if (latestKM) {
      const latestNumber = parseInt(latestKM.nomor.split("-")[2]);
      sequence = latestNumber + 1;
    }

    const nomor = `KM-${year}-${month}-${String(sequence).padStart(3, "0")}`;

    let kendaraanRecord = null;
    let resolvedCustomerId = customerId;
    const resolvedJenisMasuk = jenisMasuk || "PASANG_BARU";

    if (resolvedJenisMasuk === "SERVICE") {
      if (!kendaraanId) {
        return NextResponse.json(
          { success: false, error: "Kendaraan wajib dipilih untuk service" },
          { status: 400 },
        );
      }

      kendaraanRecord = await db.kendaraan.findUnique({
        where: { id: kendaraanId },
      });

      if (!kendaraanRecord) {
        return NextResponse.json(
          { success: false, error: "Kendaraan tidak ditemukan" },
          { status: 404 },
        );
      }

      resolvedCustomerId = kendaraanRecord.customerId;

      await db.kendaraan.update({
        where: { id: kendaraanRecord.id },
        data: { status: "MASUK" },
      });
    } else {
      if (
        !customerId ||
        !nomorChasis ||
        !nomorMesin ||
        !merekId ||
        !tipeId ||
        !namaSupir
      ) {
        return NextResponse.json(
          { success: false, error: "Field wajib harus diisi" },
          { status: 400 },
        );
      }

      const customerRecord = await db.customer.findUnique({
        where: { id: customerId },
      });

      if (!customerRecord) {
        return NextResponse.json(
          { success: false, error: "Customer tidak ditemukan" },
          { status: 404 },
        );
      }

      if (nomorPolisi) {
        const existingVehicle = await db.kendaraan.findUnique({
          where: { nomorPolisi },
        });

        if (existingVehicle) {
          return NextResponse.json(
            {
              success: false,
              error:
                "Nomor polisi sudah terdaftar. Gunakan jenis Service untuk kendaraan yang sudah ada.",
            },
            { status: 409 },
          );
        }
      }

      kendaraanRecord = await db.kendaraan.create({
        data: {
          nomorPolisi: nomorPolisi || null,
          nomorChasis,
          nomorMesin,
          merekId,
          tipeId,
          customerId,
          status: "MASUK",
        },
      });
    }

    const newKendaraanMasuk = await db.kendaraanMasuk.create({
      data: {
        nomor,
        jenisMasuk: resolvedJenisMasuk,
        tanggalMasuk: new Date(tanggalMasuk),
        showroom: showroom.trim(),
        namaJasaPengiriman: namaJasaPengiriman?.trim() || null,
        namaSupir: namaSupir?.trim() || null,
        customerId: resolvedCustomerId,
        kendaraanId: kendaraanRecord.id,
      },
      include: {
        customer: true,
        kendaraan: true,
      },
    });

    // Create pengerjaan records
    if (pengerjaan && pengerjaan.length > 0) {
      const pengerjaanData = pengerjaan.map((p: any) => ({
        kendaraanMasukId: newKendaraanMasuk.id,
        jenis: p.jenis,
        deskripsi: p.deskripsi || null,
      }));

      await db.pengerjaan.createMany({
        data: pengerjaanData,
      });
    }

    // Create kelengkapan records
    if (kelengkapan && kelengkapan.length > 0) {
      const kelengkapanData = kelengkapan.map((k: any) => ({
        kendaraanMasukId: newKendaraanMasuk.id,
        area: k.area,
        nama: k.nama,
        jumlah: k.jumlah || null,
        kondisi: k.kondisi,
        deskripsi: k.deskripsi || null,
      }));

      await db.kelengkapanAlat.createMany({
        data: kelengkapanData,
      });
    }

    // Return complete record with all relations
    const completeRecord = await db.kendaraanMasuk.findUnique({
      where: { id: newKendaraanMasuk.id },
      include: {
        customer: true,
        kendaraan: true,
        pengerjaan: true,
        kelengkapan: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: completeRecord,
      message: "Kendaraan masuk berhasil dicatat",
    });
  } catch (error) {
    console.error("Error creating kendaraan masuk:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create kendaraan masuk" },
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
        { success: false, error: "ID kendaraan masuk wajib diisi" },
        { status: 400 },
      );
    }

    // Check if kendaraan masuk is referenced in other tables
    const kendaraanMasukInUse = await db.kendaraanKeluar.findFirst({
      where: { kendaraanMasukId: id },
    });

    if (kendaraanMasukInUse) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Data kendaraan masuk tidak dapat dihapus karena sudah ada proses keluar",
        },
        { status: 400 },
      );
    }

    await db.kendaraanMasuk.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Data kendaraan masuk berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting kendaraan masuk:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete kendaraan masuk" },
      { status: 500 },
    );
  }
}
