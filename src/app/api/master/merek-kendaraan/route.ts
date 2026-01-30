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

    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [{ nama: { contains: search, mode: "insensitive" } }],
        }
      : {};

    const [list, total] = await Promise.all([
      db.merekKendaraan.findMany({
        where: where as any,
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      db.merekKendaraan.count({ where: where as any }),
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
      { success: false, error: "Failed to fetch merek" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { nama } = await request.json();
    if (!nama)
      return NextResponse.json(
        { success: false, error: "Nama required" },
        { status: 400 },
      );

    const newItem = await db.merekKendaraan.create({
      data: { nama },
    });
    return NextResponse.json({ success: true, data: newItem });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create merek" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, nama } = await request.json();
    if (!id || !nama)
      return NextResponse.json(
        { success: false, error: "ID and Nama required" },
        { status: 400 },
      );

    const updatedItem = await db.merekKendaraan.update({
      where: { id },
      data: { nama },
    });
    return NextResponse.json({ success: true, data: updatedItem });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update merek" },
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

    await db.merekKendaraan.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete" },
      { status: 500 },
    );
  }
}
