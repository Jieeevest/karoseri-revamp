import { NextResponse } from "next/server";
import { InvoiceService } from "@/lib/services/invoice-service";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }, // Match Next.js 15 async params
) {
  const { id } = await params;
  try {
    const body = await req.json();
    const { amount, method, proof, notes } = body;

    const result = await InvoiceService.addPayment({
      invoiceId: id,
      amount,
      method,
      proof,
      notes,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Payment failed" },
      { status: 400 },
    );
  }
}
