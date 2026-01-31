import { NextResponse } from "next/server";
import { InvoiceService } from "@/lib/services/invoice-service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { references } = body;

    const invoice = await InvoiceService.createInvoice(references);
    return NextResponse.json(invoice, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create invoice" },
      { status: 400 },
    );
  }
}
