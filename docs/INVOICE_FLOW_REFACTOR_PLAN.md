# Adaptive Flow: Multi-Source Invoice & Installment Payments

Dokumen ini menjelaskan perubahan flow untuk mendukung sistem invoice yang lebih fleksibel. Desain ini **tidak mengikat pada nama tabel tertentu** tetapi memberikan pola yang dapat diadopsi ke sistem existing.

## 1. Konsep & Perubahan Struktur (Minimal Addition)

Sistem saat ini mungkin memiliki relasi 1-to-1 antara Invoice (Tagihan) dan Sumber (Reference). Kita perlu memisahkan relasi ini menjadi **1-to-Many**.

### Schema Tambahan (Pseudo-Code)

Kita membutuhkan dua entitas tambahan (atau penyesuaian entitas existing) untuk menyimpan relasi referensi dan riwayat pembayaran.

```prisma
// Entitas Utama: INVOICE (Tagihan)
// Merepresentasikan satu dokumen tagihan yang menagih pembayaran untuk beberapa item/ref
model Invoice {
  id              String   @id
  nomor           String   @unique
  totalTagihan    Float    // Diset saat pembuatan, hasil sum dari refs
  sisaTagihan     Float    // totalTagihan - totalPembayaran
  status          String   // UNPAID | PARTIAL | PAID

  // Relasi
  references      InvoiceReference[] // Sumber tagihan (misal: PO-001, PO-002)
  payments        PaymentTransaction[] // Riwayat pembayaran (Cicilan)
}

// Entitas Penghubung: INVOICE REFERENCE
// Menyimpan ID dokumen sumber yang ditagihkan dalam invoice ini
model InvoiceReference {
  id              String  @id
  invoiceId       String  // Link ke Invoice
  referenceId     String  // ID dokumen sumber (misal: PurchaseOrderID)
  referenceType   String  // Tipe dokumen (misal: "PURCHASE_ORDER")
  amount          Float   // Nilai dari referensi yang ditagihkan
}

// Entitas Transaksi: PAYMENT TRANSACTION
// Mencatat setiap kali pembayaran dilakukan (Installment)
model PaymentTransaction {
  id              String   @id
  invoiceId       String   // Link ke Invoice
  amount          Float    // Jumlah yang dibayar
  paymentDate     DateTime
  method          String   // TRANSFER, CASH, GIRO
  proof           String?  // URL Bukti
  notes           String?
}
```

---

## 2. Service Logic (Flow Function)

Berikut adalah contoh implementasi logic (TypeScript) yang aman dan adaptif. Logic ini bisa ditempatkan di Controller atau Service Layer.

### A. Membuat Invoice dari Banyak Referensi

```typescript
type ReferenceInput = {
  id: string; // ID dari PO atau dokumen sumber
  amount: number; // Nilai nominal dokumen tersebut
};

async function createInvoice(references: ReferenceInput[]) {
  // 1. Validasi Input
  if (!references || references.length === 0) {
    throw new Error("Invoice must have at least one reference.");
  }

  // 2. Hitung Total Tagihan
  const totalAmount = references.reduce((sum, ref) => sum + ref.amount, 0);

  // 3. Simpan Invoice & Relasi (Transaction Atomic)
  const invoice = await db.transaction(async (tx) => {
    // Buat Header Invoice
    const newInvoice = await tx.invoice.create({
      data: {
        nomor: generateInvoiceNumber(),
        totalTagihan: totalAmount,
        sisaTagihan: totalAmount, // Awalnya sisa = total
        status: "UNPAID",
      },
    });

    // Simpan Referensi (Bulk Insert)
    const refData = references.map((ref) => ({
      invoiceId: newInvoice.id,
      referenceId: ref.id,
      amount: ref.amount,
      referenceType: "PURCHASE_ORDER", // Sesuaikan dengan konteks
    }));

    await tx.invoiceReference.createMany({ data: refData });

    return newInvoice;
  });

  return invoice;
}
```

### B. Input Pembayaran (Cicilan)

```typescript
type PaymentInput = {
  invoiceId: string;
  amount: number;
  method: string;
  proof?: string;
};

async function addPayment(input: PaymentInput) {
  // 1. Ambil Data Invoice Terkini
  const invoice = await db.invoice.findUnique({
    where: { id: input.invoiceId },
  });

  if (!invoice) throw new Error("Invoice not found");

  // 2. Validasi Overpayment
  // Pastikan pembayaran tidak melebihi sisa tagihan
  // Toleransi floating point kecil bisa ditambahkan jika perlu
  if (input.amount > invoice.sisaTagihan) {
    throw new Error(
      `Payment amount (${input.amount}) exceeds remaining balance (${invoice.sisaTagihan}).`,
    );
  }

  // 3. Proses Pembayaran (Atomic)
  const result = await db.transaction(async (tx) => {
    // Catat Transaksi Pembayaran
    const payment = await tx.paymentTransaction.create({
      data: {
        invoiceId: input.invoiceId,
        amount: input.amount,
        method: input.method,
        proof: input.proof,
        paymentDate: new Date(),
      },
    });

    // 4. Hitung Status Baru
    const newSisa = invoice.sisaTagihan - input.amount;
    let newStatus = invoice.status;

    if (newSisa <= 0) {
      newStatus = "PAID";
    } else {
      newStatus = "PARTIAL";
    }

    // Update Header Invoice
    const updatedInvoice = await tx.invoice.update({
      where: { id: input.invoiceId },
      data: {
        sisaTagihan: newSisa,
        status: newStatus,
      },
    });

    return { payment, invoice: updatedInvoice };
  });

  return result;
}
```

---

## 3. Contoh Request & Response

### Skenario 1: Membuat Invoice Gabungan 2 PO

**Request (POST /api/invoices)**

```json
{
  "references": [
    { "id": "ref-po-001", "amount": 5000000 },
    { "id": "ref-po-002", "amount": 3000000 }
  ],
  "notes": "Tagihan Maret 2026"
}
```

**Response (201 Created)**

```json
{
  "success": true,
  "data": {
    "id": "inv-12345",
    "nomor": "INV/2026/03/001",
    "totalTagihan": 8000000,
    "sisaTagihan": 8000000,
    "status": "UNPAID",
    "createdAt": "2026-03-15T10:00:00Z"
  }
}
```

### Skenario 2: Pembayaran Cicilan Pertama

**Request (POST /api/invoices/inv-12345/payments)**

```json
{
  "amount": 3000000,
  "method": "TRANSFER",
  "proof": "https://storage.com/proof-1.jpg"
}
```

**Response (200 OK)**

```json
{
  "success": true,
  "data": {
    "invoice": {
      "id": "inv-12345",
      "totalTagihan": 8000000,
      "sisaTagihan": 5000000, // Berkurang
      "status": "PARTIAL" // Berubah otomatis
    },
    "payment": {
      "id": "pay-999",
      "amount": 3000000,
      "date": "2026-03-20T14:30:00Z"
    }
  }
}
```

### Skenario 3: Pelunasan (Pembayaran Kedua)

**Request (POST /api/invoices/inv-12345/payments)**

```json
{
  "amount": 5000000,
  "method": "TRANSFER"
}
```

**Response (200 OK)**

```json
{
  "success": true,
  "data": {
    "invoice": {
      "id": "inv-12345",
      "totalTagihan": 8000000,
      "sisaTagihan": 0,
      "status": "PAID" // Lunas
    },
    "payment": {
      "id": "pay-1000",
      "amount": 5000000
    }
  }
}
```

### Skenario 4: Pembayaran Berlebih (Ditolak)

**Request**

```json
{
  "amount": 6000000 // Sisa hanya 5.000.000
}
```

**Response (400 Bad Request)**

```json
{
  "success": false,
  "error": "Payment amount (6000000) exceeds remaining balance (5000000)."
}
```
