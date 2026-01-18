import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { spekOrderId, jumlah, metode, bukti } = body;

    const payment = await db.pembayaranSpek.create({
      data: {
        spekOrderId,
        jumlah: parseFloat(jumlah),
        metode,
        bukti,
      },
    });

    // Check if fully paid? Or just mark as paid if any payment exists?
    // User requirement: status transitions to SUDAH_DIBAYAR.
    await db.spekOrder.update({
      where: { id: spekOrderId },
      data: { status: "SUDAH_DIBAYAR" },
    });

    return NextResponse.json({ success: true, data: payment });
  } catch (error) {
    console.error("Error create payment:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create payment" },
      { status: 500 },
    );
  }
}
