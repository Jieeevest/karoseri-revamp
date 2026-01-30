import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = (searchParams.get("sortOrder") || "desc") as
      | "asc"
      | "desc";
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { nomor: { contains: search, mode: "insensitive" } },
        { supplier: { nama: { contains: search, mode: "insensitive" } } },
      ];
    }

    if (status) {
      where.status = status;
    }

    const [poList, totalCount] = await Promise.all([
      db.purchaseOrder.findMany({
        where,
        include: {
          supplier: true,
          items: {
            include: {
              barang: true,
            },
          },
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: limit,
      }),
      db.purchaseOrder.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: poList,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching purchase orders:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch purchase orders" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tanggal, supplierId, items } = body;

    if (!tanggal || !supplierId || !items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Tanggal, supplier, dan items wajib diisi" },
        { status: 400 },
      );
    }

    // Generate PO number
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");

    const latestPO = await db.purchaseOrder.findFirst({
      orderBy: { createdAt: "desc" },
      where: {
        nomor: {
          startsWith: `PO-${year}-${month}`,
        },
      },
    });

    let sequence = 1;
    if (latestPO) {
      const latestNumber = parseInt(latestPO.nomor.split("-")[2]);
      sequence = latestNumber + 1;
    }

    const nomor = `PO-${year}-${month}-${String(sequence).padStart(3, "0")}`;

    // Calculate total
    const total = items.reduce((sum: number, item: any) => {
      return sum + item.harga * item.jumlah;
    }, 0);

    const newPO = await db.purchaseOrder.create({
      data: {
        nomor,
        tanggal: new Date(tanggal),
        supplierId,
        status: "DRAFT",
        total,
      },
      include: {
        supplier: true,
      },
    });

    // Create PO items
    const poItems = items.map((item: any) => ({
      purchaseOrderId: newPO.id,
      barangId: item.barangId,
      jumlah: item.jumlah,
      harga: item.harga,
      subtotal: item.harga * item.jumlah,
    }));

    await db.purchaseOrderItem.createMany({
      data: poItems,
    });

    const createdPO = await db.purchaseOrder.findUnique({
      where: { id: newPO.id },
      include: {
        supplier: true,
        items: {
          include: {
            barang: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: createdPO,
      message: "Purchase Order berhasil dibuat",
    });
  } catch (error) {
    console.error("Error creating purchase order:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create purchase order" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: "ID dan status wajib diisi" },
        { status: 400 },
      );
    }

    const updatedPO = await db.purchaseOrder.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({
      success: true,
      data: updatedPO,
      message: "Status Purchase Order berhasil diperbarui",
    });
  } catch (error) {
    console.error("Error updating purchase order:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update purchase order" },
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
        { success: false, error: "ID PO wajib diisi" },
        { status: 400 },
      );
    }

    // Check if PO can be deleted (only DRAFT status)
    const po = await db.purchaseOrder.findUnique({
      where: { id },
    });

    if (!po) {
      return NextResponse.json(
        { success: false, error: "Purchase Order tidak ditemukan" },
        { status: 404 },
      );
    }

    if (po.status !== "DRAFT") {
      return NextResponse.json(
        {
          success: false,
          error: "Hanya PO dengan status DRAFT yang dapat dihapus",
        },
        { status: 400 },
      );
    }

    await db.purchaseOrder.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Purchase Order berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting purchase order:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete purchase order" },
      { status: 500 },
    );
  }
}
