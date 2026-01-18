import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";

    const where: any = {};
    if (search) {
      where.OR = [
        { nomorPolisi: { contains: search, mode: "insensitive" } },
        { nomorChasis: { contains: search, mode: "insensitive" } },
        { customer: { nama: { contains: search, mode: "insensitive" } } },
        { merekKendaraan: { nama: { contains: search, mode: "insensitive" } } },
      ];
    }

    const list = await db.kendaraan.findMany({
      where,
      include: {
        merekKendaraan: true,
        tipeKendaraan: true,
        customer: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: list });
  } catch (error) {
    console.error("Error fetch kendaraan:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch kendaraan" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      nomorPolisi,
      nomorChasis,
      nomorMesin,
      merekId,
      tipeId,
      customerId,
      status, // Optional, defaults to MASUK
    } = body;

    if (!nomorPolisi || !nomorChasis || !merekId || !customerId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    const newItem = await db.kendaraan.create({
      data: {
        nomorPolisi,
        nomorChasis,
        nomorMesin,
        merekId,
        tipeId,
        customerId,
        status: status || "MASUK",
      },
    });

    return NextResponse.json({ success: true, data: newItem });
  } catch (error) {
    console.error("Error create kendaraan:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create kendaraan" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id)
      return NextResponse.json(
        { success: false, error: "ID required" },
        { status: 400 },
      );

    const updated = await db.kendaraan.update({
      where: { id },
      data,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update" },
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

    await db.kendaraan.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete" },
      { status: 500 },
    );
  }
}
