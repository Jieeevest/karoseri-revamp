import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const merekId = searchParams.get("merekId");

    // If merekId is provided, filter by it, otherwise list all (or limited)
    const where = merekId ? { merekId } : {};

    const list = await db.tipeKendaraan.findMany({
      where,
      orderBy: { nama: "asc" },
      include: { merekKendaraan: true },
    });
    return NextResponse.json({ success: true, data: list });
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
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create tipe" },
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
