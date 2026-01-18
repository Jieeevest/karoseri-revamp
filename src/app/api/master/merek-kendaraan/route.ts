import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const list = await db.merekKendaraan.findMany({
      orderBy: { nama: "asc" },
    });
    return NextResponse.json({ success: true, data: list });
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
