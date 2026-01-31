import { db } from "@/lib/db";
import { InvoiceStatus } from "@prisma/client";

export type ReferenceInput = {
  id: string; // ID of the source document (PO, etc)
  amount: number; // The amount to be invoiced
  type: string; // e.g., "PURCHASE_ORDER"
};

export type PaymentInput = {
  invoiceId: string;
  amount: number;
  method: string;
  proof?: string;
  notes?: string;
};

/**
 * Service to handle Adaptive Invoice Flow
 */
export const InvoiceService = {
  /**
   * Create a new invoice from multiple source references
   */
  async createInvoice(references: ReferenceInput[]) {
    if (!references || references.length === 0) {
      throw new Error("Invoice must have at least one reference.");
    }

    const totalAmount = references.reduce((sum, ref) => sum + ref.amount, 0);

    // Generate Invoice Number (Simple Format: INV/YYYY/MM/RANDOM)
    const date = new Date();
    const invoiceNumber = `INV/${date.getFullYear()}/${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${Math.floor(1000 + Math.random() * 9000)}`;

    return await db.$transaction(async (tx) => {
      // 1. Create Invoice Header
      const newInvoice = await tx.invoice.create({
        data: {
          nomor: invoiceNumber,
          totalTagihan: totalAmount,
          sisaTagihan: totalAmount,
          status: InvoiceStatus.UNPAID,
        },
      });

      // 2. Create References
      await tx.invoiceReference.createMany({
        data: references.map((ref) => ({
          invoiceId: newInvoice.id,
          referenceId: ref.id,
          referenceType: ref.type,
          amount: ref.amount,
        })),
      });

      return newInvoice;
    });
  },

  /**
   * Add a payment transaction to an invoice (Installment support)
   */
  async addPayment(input: PaymentInput) {
    const invoice = await db.invoice.findUnique({
      where: { id: input.invoiceId },
    });

    if (!invoice) throw new Error("Invoice not found");

    // Allow small float tolerance if needed, but strict for now
    if (input.amount > invoice.sisaTagihan) {
      throw new Error(
        `Payment amount (${input.amount}) exceeds remaining balance (${invoice.sisaTagihan}).`,
      );
    }

    return await db.$transaction(async (tx) => {
      // 1. Record Payment
      const payment = await tx.paymentTransaction.create({
        data: {
          invoiceId: input.invoiceId,
          amount: input.amount,
          method: input.method,
          proof: input.proof,
          notes: input.notes,
        },
      });

      // 2. Update Invoice Status & Balance
      const newSisa = invoice.sisaTagihan - input.amount;
      let newStatus = invoice.status;

      if (newSisa <= 0) {
        newStatus = InvoiceStatus.PAID;
      } else {
        newStatus = InvoiceStatus.PARTIAL;
      }

      const updatedInvoice = await tx.invoice.update({
        where: { id: input.invoiceId },
        data: {
          sisaTagihan: newSisa,
          status: newStatus,
        },
      });

      return { payment, invoice: updatedInvoice };
    });
  },

  /**
   * Get invoice details with references and history
   */
  async getInvoiceDetails(id: string) {
    return await db.invoice.findUnique({
      where: { id },
      include: {
        references: true,
        payments: {
          orderBy: { createdAt: "desc" },
        },
      },
    });
  },
};
