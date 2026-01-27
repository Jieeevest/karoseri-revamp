import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = (searchParams.get("sortOrder") || "asc") as
      | "asc"
      | "desc";
    const merekId = searchParams.get("merekId");

    const skip = (page - 1) * limit;

    const where: any = {};
    if (merekId) where.merekId = merekId;
    if (search) {
      where.OR = [
        { nama: { contains: search, mode: "insensitive" } },
        { merekKendaraan: { nama: { contains: search, mode: "insensitive" } } },
      ];
    }

    const [list, total] = await Promise.all([
      db.tipeKendaraan.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
        include: { merekKendaraan: true },
      }),
      db.tipeKendaraan.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: list,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch tipe" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { nama, merekId } = await request.json();
    if (!nama || !merekId)
      return NextResponse.json(
        { success: false, error: "Nama and MerekId required" },
        { status: 400 },
      );

    const newItem = await db.tipeKendaraan.create({
      data: { nama, merekId },
    });
    return NextResponse.json({ success: true, data: newItem });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { success: false, error: "Data sudah terdaftar/sudah ada" },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to create tipe" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, nama, merekId } = body;

    if (!id || !nama || !merekId) {
      return NextResponse.json(
        { success: false, error: "ID, Nama, and MerekId required" },
        { status: 400 },
      );
    }

    const updatedItem = await db.tipeKendaraan.update({
      where: { id },
      data: { nama, merekId },
    });

    return NextResponse.json({ success: true, data: updatedItem });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { success: false, error: "Data sudah terdaftar/sudah ada" },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to update tipe" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id)
      return NextResponse.json(
        { success: false, error: "ID required" },
        { status: 400 },
      );

    await db.tipeKendaraan.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete" },
      { status: 500 },
    );
  }
}
