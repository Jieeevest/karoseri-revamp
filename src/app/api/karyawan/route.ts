import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateNextCode } from "@/lib/code-generator";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const jabatan = searchParams.get("jabatan") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { nama: { contains: search, mode: "insensitive" } },
        { nik: { contains: search, mode: "insensitive" } },
        { jabatan: { contains: search, mode: "insensitive" } },
      ];
    }

    if (jabatan) {
      where.jabatan = jabatan;
    }

    const [karyawanList, totalCount] = await Promise.all([
      db.karyawan.findMany({
        where,
        include: {
          barangKeluar: {
            select: {
              id: true,
            },
          },
          spekOrder: {
            select: {
              id: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      db.karyawan.count({ where }),
    ]);

    // Add statistics to each employee
    const karyawanWithStats = karyawanList.map((karyawan) => ({
      ...karyawan,
      totalBarangKeluar: karyawan.barangKeluar.length,
      totalSpekOrder: karyawan.spekOrder.length,
    }));

    return NextResponse.json({
      success: true,
      data: karyawanWithStats,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching karyawan:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch karyawan" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let { nik, nama, jabatan, telepon, alamat } = body;

    // Validation
    if (!nama || !jabatan) {
      return NextResponse.json(
        { success: false, error: "Nama dan jabatan wajib diisi" },
        { status: 400 },
      );
    }

    if (!nik) {
      nik = await generateNextCode("KRY", "karyawan", "nik");
    }

    // Validate NIK format (16 digits) - REMOVED to allow custom auto codes
    // if (!/^\d{16}$/.test(nik)) {
    //   return NextResponse.json(
    //     { success: false, error: 'Format NIK tidak valid (harus 16 digit angka)' },
    //     { status: 400 }
    //   )
    // }

    // Check if NIK already exists
    const existingNIK = await db.karyawan.findFirst({
      where: { nik },
    });

    if (existingNIK) {
      return NextResponse.json(
        { success: false, error: "NIK sudah terdaftar" },
        { status: 400 },
      );
    }

    const newKaryawan = await db.karyawan.create({
      data: {
        nik,
        nama: nama.trim(),
        jabatan: jabatan.trim(),
        telepon: telepon?.trim() || null,
        alamat: alamat?.trim() || null,
      },
    });

    return NextResponse.json({
      success: true,
      data: newKaryawan,
      message: "Karyawan berhasil ditambahkan",
    });
  } catch (error) {
    console.error("Error creating karyawan:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create karyawan" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, nik, nama, jabatan, telepon, alamat } = body;

    if (!id || !nik || !nama || !jabatan) {
      return NextResponse.json(
        { success: false, error: "ID, NIK, nama, dan jabatan wajib diisi" },
        { status: 400 },
      );
    }

    // Validate NIK format - REMOVED
    // if (!/^\d{16}$/.test(nik)) {
    //   return NextResponse.json(
    //     { success: false, error: 'Format NIK tidak valid (harus 16 digit angka)' },
    //     { status: 400 }
    //   )
    // }

    // Check if NIK already exists (excluding current record)
    const existingNIK = await db.karyawan.findFirst({
      where: {
        AND: [{ id: { not: id } }, { nik }],
      },
    });

    if (existingNIK) {
      return NextResponse.json(
        { success: false, error: "NIK sudah digunakan" },
        { status: 400 },
      );
    }

    const updatedKaryawan = await db.karyawan.update({
      where: { id },
      data: {
        nik,
        nama: nama.trim(),
        jabatan: jabatan.trim(),
        telepon: telepon?.trim() || null,
        alamat: alamat?.trim() || null,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedKaryawan,
      message: "Data karyawan berhasil diperbarui",
    });
  } catch (error) {
    console.error("Error updating karyawan:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update karyawan" },
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
        { success: false, error: "ID karyawan wajib diisi" },
        { status: 400 },
      );
    }

    // Check if karyawan is referenced in other tables
    const karyawanInUse = await Promise.all([
      db.barangKeluar.findFirst({ where: { karyawanId: id } }),
      db.spekOrder.findFirst({ where: { karyawanId: id } }),
    ]);

    const isInUse = karyawanInUse.some((ref) => ref !== null);

    if (isInUse) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Karyawan tidak dapat dihapus karena masih memiliki transaksi aktif",
        },
        { status: 400 },
      );
    }

    await db.karyawan.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Karyawan berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting karyawan:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete karyawan" },
      { status: 500 },
    );
  }
}
