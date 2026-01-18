import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";

    const where: any = {};
    if (search) {
      where.OR = [
        { kode: { contains: search, mode: "insensitive" } },
        { nama: { contains: search, mode: "insensitive" } },
        { telepon: { contains: search, mode: "insensitive" } },
      ];
    }

    const customers = await db.customer.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: customers,
    });
  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch customers" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { kode, nama, alamat, telepon, email } = body;

    if (!kode || !nama) {
      return NextResponse.json(
        { success: false, error: "Kode and Naa are required" },
        { status: 400 },
      );
    }

    const existing = await db.customer.findUnique({ where: { kode } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "Kode already exists" },
        { status: 400 },
      );
    }

    const newCustomer = await db.customer.create({
      data: {
        kode,
        nama,
        alamat,
        telepon,
        email,
      },
    });

    return NextResponse.json({
      success: true,
      data: newCustomer,
    });
  } catch (error) {
    console.error("Error creating customer:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create customer" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    const updated = await db.customer.update({
      where: { id },
      data,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update customer" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ success: false }, { status: 400 });

    await db.customer.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete" },
      { status: 500 },
    );
  }
}
