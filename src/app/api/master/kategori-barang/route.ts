import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const kategoriList = await db.kategoriBarang.findMany({
      orderBy: {
        nama: "asc",
      },
      include: {
        barang: true,
        hargaBarang: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: kategoriList,
    });
  } catch (error) {
    console.error("Error fetching kategori barang:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch kategori barang" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nama, deskripsi } = body;

    if (!nama) {
      return NextResponse.json(
        { success: false, error: "Nama kategori wajib diisi" },
        { status: 400 },
      );
    }

    const existingKategori = await db.kategoriBarang.findFirst({
      where: {
        nama: {
          equals: nama,
          mode: "insensitive",
        },
      },
    });

    if (existingKategori) {
      return NextResponse.json(
        { success: false, error: "Data sudah terdaftar/sudah ada" },
        { status: 400 },
      );
    }

    const newKategori = await db.kategoriBarang.create({
      data: {
        nama: nama.trim(),
        deskripsi: deskripsi?.trim() || null,
      },
    });

    return NextResponse.json({
      success: true,
      data: newKategori,
      message: "Kategori barang berhasil ditambahkan",
    });
  } catch (error) {
    console.error("Error creating kategori barang:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create kategori barang" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, nama, deskripsi } = body;

    if (!id || !nama) {
      return NextResponse.json(
        { success: false, error: "ID dan nama kategori wajib diisi" },
        { status: 400 },
      );
    }

    const existingKategori = await db.kategoriBarang.findFirst({
      where: {
        AND: [
          { id: { not: parseInt(id) } },
          {
            nama: {
              equals: nama,
              mode: "insensitive",
            },
          },
        ],
      },
    });

    if (existingKategori) {
      return NextResponse.json(
        { success: false, error: "Data sudah terdaftar/sudah ada" },
        { status: 400 },
      );
    }

    const updatedKategori = await db.kategoriBarang.update({
      where: { id: parseInt(id) },
      data: {
        nama: nama.trim(),
        deskripsi: deskripsi?.trim() || null,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedKategori,
      message: "Kategori barang berhasil diperbarui",
    });
  } catch (error) {
    console.error("Error updating kategori barang:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update kategori barang" },
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
        { success: false, error: "ID kategori wajib diisi" },
        { status: 400 },
      );
    }

    // Check if kategori is being used by any barang
    const kategoriInUse = await db.barang.findFirst({
      where: {
        kategoriId: parseInt(id),
      },
    });

    if (kategoriInUse) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Kategori tidak dapat dihapus karena masih digunakan oleh barang",
        },
        { status: 400 },
      );
    }

    await db.kategoriBarang.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({
      success: true,
      message: "Kategori barang berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting kategori barang:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete kategori barang" },
      { status: 500 },
    );
  }
}
