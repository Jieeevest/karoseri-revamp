import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const purchaseOrderId = searchParams.get("purchaseOrderId");

    // Check if pagination parameters exist, otherwise return all
    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");
    const sortBy = searchParams.get("sortBy") || "tanggal";
    const sortOrder =
      (searchParams.get("sortOrder") as "asc" | "desc") || "desc";

    const where: any = search
      ? {
          OR: [
            {
              barang: {
                nama: { contains: search, mode: "insensitive" },
              },
            },
            {
              supplier: {
                nama: { contains: search, mode: "insensitive" },
              },
            },
            {
              nomorSuratJalan: { contains: search, mode: "insensitive" },
            },
          ],
        }
      : {};

    if (purchaseOrderId) {
      where.purchaseOrderId = purchaseOrderId;
    }

    if (!pageParam && !limitParam) {
      const barangMasukList = await db.barangMasuk.findMany({
        where: where as any,
        include: {
          barang: true,
          supplier: true,
          purchaseOrder: true,
          receivedBy: true,
        },
        orderBy: { [sortBy]: sortOrder },
      });
      return NextResponse.json({ success: true, data: barangMasukList });
    }

    const page = parseInt(pageParam || "1");
    const limit = parseInt(limitParam || "10");
    const skip = (page - 1) * limit;

    const [barangMasukList, totalCount] = await Promise.all([
      db.barangMasuk.findMany({
        where: where as any,
        skip,
        take: limit,
        include: {
          barang: true,
          supplier: true,
          purchaseOrder: true,
          receivedBy: true,
        },
        orderBy: { [sortBy]: sortOrder },
      }),
      db.barangMasuk.count({ where: where as any }),
    ]);

    return NextResponse.json({
      success: true,
      data: barangMasukList,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching barang masuk:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch barang masuk" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      tanggal,
      supplierId,
      purchaseOrderId,
      hargaSatuan,
      totalHarga,
      nomorSuratJalan,
      keterangan,
      items,
    } = body;

    const session = await getServerSession(authOptions);
    const receivedById = (session?.user as any)?.id as string | undefined;

    const hasItems = Array.isArray(items) && items.length > 0;
    if (!tanggal || !supplierId || !hasItems) {
      return NextResponse.json(
        {
          success: false,
          error: "Tanggal, Supplier, dan item barang wajib diisi",
        },
        { status: 400 },
      );
    }

    // Generate Number (BM-YYYY-XXX)
    const year = new Date().getFullYear();
    const lastRecord = await db.barangMasuk.findFirst({
      where: {
        nomor: {
          startsWith: `BM-${year}-`,
        },
      },
      orderBy: {
        nomor: "desc",
      },
    });

    let sequence = 1;
    if (lastRecord) {
      const parts = lastRecord.nomor.split("-");
      if (parts.length === 3) {
        sequence = parseInt(parts[2]) + 1;
      }
    }

    const lastRetur = await db.barangRetur.findFirst({
      where: {
        nomor: {
          startsWith: `BR-${year}-`,
        },
      },
      orderBy: {
        nomor: "desc",
      },
    });
    let returSeq = 1;
    if (lastRetur) {
      const parts = lastRetur.nomor.split("-");
      if (parts.length === 3) {
        returSeq = parseInt(parts[2]) + 1;
      }
    }

    const result = await db.$transaction(async (prisma) => {
      const po = purchaseOrderId
        ? await prisma.purchaseOrder.findUnique({
            where: { id: purchaseOrderId },
            include: { items: true },
          })
        : null;

      const createdMasuk: any[] = [];
      const createdRetur: any[] = [];

      for (const item of items) {
        const barangId = item.barangId;
        const jumlahDiterima = parseInt(item.jumlahDiterima || item.jumlah || 0);
        const jumlahRetur = parseInt(item.jumlahRetur || 0);
        const kondisi = item.kondisi || "BAIK";

        if (!barangId || (!jumlahDiterima && !jumlahRetur)) {
          continue;
        }

        if (po) {
          const poItem = po.items.find((pi: any) => pi.barangId === barangId);
          if (!poItem) {
            throw new Error("Barang tidak sesuai PO");
          }
          if (jumlahDiterima + jumlahRetur > poItem.jumlah) {
            throw new Error("Jumlah melebihi PO");
          }
        }

        if (jumlahDiterima > 0) {
          const nomor = `BM-${year}-${String(sequence).padStart(3, "0")}`;
          sequence += 1;

          const hargaItem = Number.isFinite(item.hargaSatuan)
            ? parseFloat(item.hargaSatuan)
            : parseFloat(hargaSatuan) || 0;
          const totalItem =
            Number.isFinite(item.totalHarga)
              ? parseFloat(item.totalHarga)
              : hargaItem * jumlahDiterima;

          const barangMasuk = await prisma.barangMasuk.create({
            data: {
              nomor,
              tanggal: new Date(tanggal),
              barangId,
              supplierId,
              purchaseOrderId: purchaseOrderId || null,
              jumlah: jumlahDiterima,
              hargaSatuan: hargaItem || 0,
              totalHarga: totalItem || 0,
              nomorSuratJalan: nomorSuratJalan || "",
              keterangan: keterangan || "",
              kondisi: kondisi === "BAIK" ? "BAIK" : "RUSAK",
              receivedById: receivedById || null,
            },
            include: {
              barang: true,
            },
          });

          await prisma.barang.update({
            where: { id: barangId },
            data: {
              stok: {
                increment: jumlahDiterima,
              },
            },
          });
          createdMasuk.push(barangMasuk);
        }

        if (jumlahRetur > 0) {
          const nomorRetur = `BR-${year}-${String(returSeq).padStart(3, "0")}`;
          returSeq += 1;

          const barangRetur = await prisma.barangRetur.create({
            data: {
              nomor: nomorRetur,
              tanggal: new Date(tanggal),
              purchaseOrderId: purchaseOrderId || null,
              supplierId,
              barangId,
              jumlah: jumlahRetur,
              kondisi: kondisi || "RUSAK",
              alasan: item.alasanRetur || null,
              createdById: receivedById || null,
            },
          });
          createdRetur.push(barangRetur);
        }
      }

      return { barangMasuk: createdMasuk, barangRetur: createdRetur };
    });

    return NextResponse.json({
      success: true,
      data: result,
      message: "Barang masuk berhasil dicatat",
    });
  } catch (error) {
    console.error("Error creating barang masuk:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create barang masuk" },
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

    // Get record to reverse stock
    const existingRecord = await db.barangMasuk.findUnique({
      where: { id },
    });

    if (!existingRecord) {
      return NextResponse.json(
        { success: false, error: "Data tidak ditemukan" },
        { status: 404 },
      );
    }

    await db.$transaction(async (prisma) => {
      // Reverse stock
      await prisma.barang.update({
        where: { id: existingRecord.barangId },
        data: {
          stok: {
            decrement: existingRecord.jumlah,
          },
        },
      });

      // Delete record
      await prisma.barangMasuk.delete({
        where: { id },
      });
    });

    return NextResponse.json({
      success: true,
      message: "Data barang masuk berhasil dihapus (stok dikembalikan)",
    });
  } catch (error) {
    console.error("Error deleting barang masuk:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete barang masuk" },
      { status: 500 },
    );
  }
}
