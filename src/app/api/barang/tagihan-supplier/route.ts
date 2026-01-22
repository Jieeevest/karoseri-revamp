import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status");

    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");

    const where: any = {};

    if (search) {
      where.OR = [
        { nomorInvoice: { contains: search, mode: "insensitive" } },
        { purchaseOrder: { nomor: { contains: search, mode: "insensitive" } } },
        { supplier: { nama: { contains: search, mode: "insensitive" } } },
      ];
    }

    if (status && status !== "ALL") {
      where.status = status;
    }

    if (!pageParam && !limitParam) {
      const bills = await db.tagihanSupplier.findMany({
        where,
        include: {
          supplier: true,
          purchaseOrder: true,
        },
        orderBy: { tanggalJatuhTempo: "asc" },
      });
      return NextResponse.json({ success: true, data: bills });
    }

    const page = parseInt(pageParam || "1");
    const limit = parseInt(limitParam || "10");
    const skip = (page - 1) * limit;

    const [bills, totalCount] = await Promise.all([
      db.tagihanSupplier.findMany({
        where,
        skip,
        take: limit,
        include: {
          supplier: true,
          purchaseOrder: true,
        },
        orderBy: { tanggalJatuhTempo: "asc" },
      }),
      db.tagihanSupplier.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: bills,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching tagihan supplier:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch tagihan supplier" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      supplierId,
      purchaseOrderId,
      nomorInvoice,
      tanggalTagihan,
      tanggalJatuhTempo,
      jumlahTagihan,
      keterangan,
      status,
    } = body;

    if (!supplierId || !nomorInvoice || !jumlahTagihan) {
      return NextResponse.json(
        {
          success: false,
          error: "Supplier, No Invoice, dan Jumlah wajib diisi",
        },
        { status: 400 },
      );
    }

    const newBill = await db.tagihanSupplier.create({
      data: {
        supplierId,
        purchaseOrderId: purchaseOrderId || null,
        nomorInvoice,
        tanggalTagihan: tanggalTagihan ? new Date(tanggalTagihan) : new Date(),
        tanggalJatuhTempo: tanggalJatuhTempo
          ? new Date(tanggalJatuhTempo)
          : new Date(),
        jumlahTagihan: parseFloat(jumlahTagihan),
        sisaTagihan: parseFloat(jumlahTagihan), // Initially same as total
        status: status || "BELUM_DIBAYAR",
        keterangan: keterangan || "",
      },
    });

    return NextResponse.json({
      success: true,
      data: newBill,
      message: "Tagihan berhasil dicatat",
    });
  } catch (error) {
    console.error("Error creating tagihan:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create tagihan" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, jumlahBayar } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID wajib diisi" },
        { status: 400 },
      );
    }

    // Logic for payment update
    if (jumlahBayar !== undefined) {
      const currentBill = await db.tagihanSupplier.findUnique({
        where: { id },
      });
      if (!currentBill) {
        return NextResponse.json(
          { success: false, error: "Tagihan not found" },
          { status: 404 },
        );
      }

      const newSisa = currentBill.sisaTagihan - parseFloat(jumlahBayar);
      const newStatus = newSisa <= 0 ? "LUNAS" : "SEBAGIAN";

      const updated = await db.tagihanSupplier.update({
        where: { id },
        data: {
          sisaTagihan: newSisa,
          status: newStatus,
        },
      });

      return NextResponse.json({
        success: true,
        data: updated,
        message: "Pembayaran berhasil dicatat",
      });
    }

    // Generic update
    const updated = await db.tagihanSupplier.update({
      where: { id },
      data: { status }, // simplistic update for now
    });

    return NextResponse.json({
      success: true,
      data: updated,
      message: "Tagihan diperbarui",
    });
  } catch (error) {
    console.error("Error updating tagihan:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update tagihan" },
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
        { success: false, error: "ID wajib diisi" },
        { status: 400 },
      );
    }

    await db.tagihanSupplier.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Tagihan berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting tagihan:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete tagihan" },
      { status: 500 },
    );
  }
}
