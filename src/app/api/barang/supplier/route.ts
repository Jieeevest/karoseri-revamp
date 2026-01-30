import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateNextCode } from "@/lib/code-generator";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";

    // Check if pagination parameters exist, otherwise return all
    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = (searchParams.get("sortOrder") || "desc") as
      | "asc"
      | "desc";

    // Default filter
    const where = search
      ? {
          OR: [
            { nama: { contains: search, mode: "insensitive" } },
            { kode: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    // If pagination is not requested, return all (for dropdowns etc)
    if (!pageParam && !limitParam) {
      const suppliers = await db.supplier.findMany({
        where: where as any,
        orderBy: { [sortBy]: sortOrder },
      });
      return NextResponse.json({ success: true, data: suppliers });
    }

    const page = parseInt(pageParam || "1");
    const limit = parseInt(limitParam || "10");
    const skip = (page - 1) * limit;

    const [suppliers, totalCount] = await Promise.all([
      db.supplier.findMany({
        where: where as any,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      db.supplier.count({ where: where as any }),
    ]);

    return NextResponse.json({
      success: true,
      data: suppliers,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch suppliers" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let { kode, nama, alamat, telepon, email } = body;

    // Validation
    if (!nama) {
      return NextResponse.json(
        { success: false, error: "Nama Supplier wajib diisi" },
        { status: 400 },
      );
    }

    if (!kode) {
      kode = await generateNextCode("SUP", "supplier", "kode");
    }

    // Check if kode already exists
    const existingKode = await db.supplier.findFirst({
      where: { kode: { equals: kode, mode: "insensitive" } },
    });

    if (existingKode) {
      return NextResponse.json(
        { success: false, error: "Kode supplier sudah ada" },
        { status: 400 },
      );
    }

    const newSupplier = await db.supplier.create({
      data: {
        kode: kode.trim(),
        nama: nama.trim(),
        alamat: alamat || "",
        telepon: telepon || "",
        email: email || "",
      },
    });

    return NextResponse.json({
      success: true,
      data: newSupplier,
      message: "Supplier berhasil ditambahkan",
    });
  } catch (error) {
    console.error("Error creating supplier:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create supplier" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, kode, nama, alamat, telepon, email } = body;

    if (!id || !kode || !nama) {
      return NextResponse.json(
        { success: false, error: "ID, Kode, dan Nama wajib diisi" },
        { status: 400 },
      );
    }

    // Check if kode already exists (excluding current record)
    const existingKode = await db.supplier.findFirst({
      where: {
        AND: [
          { id: { not: id } },
          { kode: { equals: kode, mode: "insensitive" } },
        ],
      },
    });

    if (existingKode) {
      return NextResponse.json(
        { success: false, error: "Kode supplier sudah digunakan" },
        { status: 400 },
      );
    }

    const updatedSupplier = await db.supplier.update({
      where: { id },
      data: {
        kode: kode.trim(),
        nama: nama.trim(),
        alamat: alamat || "",
        telepon: telepon || "",
        email: email || "",
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedSupplier,
      message: "Supplier berhasil diperbarui",
    });
  } catch (error) {
    console.error("Error updating supplier:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update supplier" },
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
        { success: false, error: "ID supplier wajib diisi" },
        { status: 400 },
      );
    }

    // Check if supplier is referenced in other tables
    // Common references: HargaBarang, PurchaseOrder
    const supplierInUse = await Promise.all([
      db.hargaBarang.findFirst({ where: { supplierId: id } }),
      db.purchaseOrder.findFirst({ where: { supplierId: id } }),
    ]);

    const isInUse = supplierInUse.some((ref) => ref !== null);

    if (isInUse) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Supplier tidak dapat dihapus karena masih digunakan dalam data (Barang/PO)",
        },
        { status: 400 },
      );
    }

    await db.supplier.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Supplier berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting supplier:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete supplier" },
      { status: 500 },
    );
  }
}
