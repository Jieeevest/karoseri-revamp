import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import path from "path";
import { mkdir, writeFile } from "fs/promises";

function sanitizeFilename(input: string) {
  return input.replace(/[^a-zA-Z0-9-_]/g, "_");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { kendaraanKeluarId } = body;

    if (!kendaraanKeluarId) {
      return NextResponse.json(
        { success: false, error: "Kendaraan keluar ID required" },
        { status: 400 },
      );
    }

    const kendaraanKeluar = await db.kendaraanKeluar.findUnique({
      where: { id: kendaraanKeluarId },
      include: {
        kendaraan: {
          include: {
            merekKendaraan: true,
            tipeKendaraan: true,
            customer: true,
          },
        },
      },
    });

    if (!kendaraanKeluar) {
      return NextResponse.json(
        { success: false, error: "Data kendaraan keluar tidak ditemukan" },
        { status: 404 },
      );
    }

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]);
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const drawText = (text: string, x: number, y: number, size = 12) => {
      page.drawText(text, { x, y, size, font, color: rgb(0.12, 0.12, 0.12) });
    };
    const drawTextBold = (text: string, x: number, y: number, size = 12) => {
      page.drawText(text, {
        x,
        y,
        size,
        font: fontBold,
        color: rgb(0.1, 0.1, 0.1),
      });
    };

    drawTextBold("SURAT JALAN", width / 2 - 70, height - 70, 20);
    drawText("PT. KAROSERI INDONESIA MAJU", width / 2 - 110, height - 92, 12);

    page.drawLine({
      start: { x: 50, y: height - 110 },
      end: { x: width - 50, y: height - 110 },
      thickness: 1,
      color: rgb(0.2, 0.2, 0.2),
    });

    const leftX = 60;
    let currentY = height - 150;
    const lineGap = 22;

    drawText("Nomor Surat", leftX, currentY);
    drawTextBold(kendaraanKeluar.nomor, leftX + 150, currentY);
    currentY -= lineGap;

    drawText("Tanggal", leftX, currentY);
    drawTextBold(
      kendaraanKeluar.tanggalKeluar
        ? new Date(kendaraanKeluar.tanggalKeluar).toLocaleDateString("id-ID")
        : "-",
      leftX + 150,
      currentY,
    );
    currentY -= lineGap;

    drawText("Kendaraan", leftX, currentY);
    drawTextBold(
      kendaraanKeluar.kendaraan?.nomorPolisi || "-",
      leftX + 150,
      currentY,
    );
    currentY -= lineGap;

    drawText("Merek/Tipe", leftX, currentY);
    const merekTipe = `${kendaraanKeluar.kendaraan?.merekKendaraan?.nama || ""} ${kendaraanKeluar.kendaraan?.tipeKendaraan?.nama || ""}`.trim();
    drawTextBold(merekTipe || "-", leftX + 150, currentY);
    currentY -= lineGap;

    drawText("Customer", leftX, currentY);
    drawTextBold(
      kendaraanKeluar.kendaraan?.customer?.nama || "-",
      leftX + 150,
      currentY,
    );
    currentY -= lineGap;

    drawText("Status QC", leftX, currentY);
    drawTextBold(
      kendaraanKeluar.layakKeluar ? "LAYAK KELUAR" : "TIDAK LAYAK",
      leftX + 150,
      currentY,
    );

    if (kendaraanKeluar.keterangan) {
      currentY -= lineGap;
      drawText("Keterangan", leftX, currentY);
      drawText(
        kendaraanKeluar.keterangan,
        leftX + 150,
        currentY,
        11,
      );
    }

    const signY = 140;
    page.drawLine({
      start: { x: 80, y: signY },
      end: { x: 180, y: signY },
      thickness: 0.8,
      color: rgb(0.6, 0.6, 0.6),
    });
    drawText("Admin", 110, signY - 16, 10);

    page.drawLine({
      start: { x: 260, y: signY },
      end: { x: 360, y: signY },
      thickness: 0.8,
      color: rgb(0.6, 0.6, 0.6),
    });
    drawText("Security", 285, signY - 16, 10);

    page.drawLine({
      start: { x: 440, y: signY },
      end: { x: 540, y: signY },
      thickness: 0.8,
      color: rgb(0.6, 0.6, 0.6),
    });
    drawText("Penerima", 465, signY - 16, 10);

    const pdfBytes = await pdfDoc.save();

    const uploadDir = path.join(process.cwd(), "public", "uploads", "surat-jalan");
    await mkdir(uploadDir, { recursive: true });

    const filename = `surat-jalan-${sanitizeFilename(kendaraanKeluar.nomor)}.pdf`;
    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, Buffer.from(pdfBytes));

    const fileUrl = `/uploads/surat-jalan/${filename}`;

    await db.kendaraanKeluar.update({
      where: { id: kendaraanKeluarId },
      data: { suratJalan: fileUrl },
    });

    return NextResponse.json({ success: true, url: fileUrl });
  } catch (error) {
    console.error("Error generating surat jalan:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate surat jalan" },
      { status: 500 },
    );
  }
}
