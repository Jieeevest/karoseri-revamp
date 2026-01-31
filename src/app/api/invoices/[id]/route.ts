import { NextResponse } from "next/server";
import { InvoiceService } from "@/lib/services/invoice-service";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }, // Match Next.js 15 async params
) {
  const { id } = await params;
  try {
    const invoice = await InvoiceService.getInvoiceDetails(id);

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    return NextResponse.json(invoice);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch invoice" },
      { status: 500 },
    );
  }
}
