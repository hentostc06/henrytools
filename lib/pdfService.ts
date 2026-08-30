import { PDFDocument, degrees, rgb, StandardFonts } from "pdf-lib";

/**
 * 1. PENGGABUNGAN PDF (MERGE)
 */
export async function mergePDFs(files: File[]): Promise<Uint8Array> {
  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  return await mergedPdf.save();
}

/**
 * 2. PEMISAHAN PDF (SPLIT BY PAGE RANGE)
 * example pageRange: "1-3, 5" (1-indexed)
 */
export async function splitPDF(file: File, pageRangeStr: string): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const newPdf = await PDFDocument.create();
  const totalPages = pdfDoc.getPageCount();

  const pagesToExtract = parsePageRanges(pageRangeStr, totalPages);
  const copiedPages = await newPdf.copyPages(pdfDoc, pagesToExtract);
  copiedPages.forEach((page) => newPdf.addPage(page));

  return await newPdf.save();
}

/**
 * 3. ROTASI HALAMAN (ROTATE)
 * angle: 90, 180, 270
 */
export async function rotatePDF(file: File, angleDegrees: number): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const pages = pdfDoc.getPages();

  pages.forEach((page) => {
    const currentRotation = page.getRotation().angle;
    page.setRotation(degrees((currentRotation + angleDegrees) % 360));
  });

  return await pdfDoc.save();
}

/**
 * 4. HAPUS HALAMAN (DELETE PAGES)
 * pageNumbersToRemove: array berisi nomor halaman (1-indexed), contoh: [2, 4]
 */
export async function removePagesFromPDF(file: File, pageNumbersToRemove: number[]): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const newPdf = await PDFDocument.create();
  const totalPages = pdfDoc.getPageCount();

  const pagesToKeep: number[] = [];
  for (let i = 0; i < totalPages; i++) {
    if (!pageNumbersToRemove.includes(i + 1)) {
      pagesToKeep.push(i);
    }
  }

  const copiedPages = await newPdf.copyPages(pdfDoc, pagesToKeep);
  copiedPages.forEach((page) => newPdf.addPage(page));

  return await newPdf.save();
}

/**
 * 5. TAMBAH WATERMARK TEKS
 */
export async function addWatermarkToPDF(file: File, watermarkText: string): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const pages = pdfDoc.getPages();

  pages.forEach((page) => {
    const { width, height } = page.getSize();
    page.drawText(watermarkText, {
      x: width / 4,
      y: height / 2,
      size: 48,
      font: font,
      color: rgb(0.75, 0.75, 0.75),
      opacity: 0.4,
      rotate: degrees(45),
    });
  });

  return await pdfDoc.save();
}

/**
 * HELPER: PARSER RENTANG HALAMAN (Contoh: "1-3, 5" -> [0, 1, 2, 4])
 */
function parsePageRanges(rangeStr: string, totalPages: number): number[] {
  const pageIndices = new Set<number>();
  const parts = rangeStr.split(",").map((s) => s.trim());

  for (const part of parts) {
    if (part.includes("-")) {
      const [start, end] = part.split("-").map((n) => parseInt(n, 10));
      if (!isNaN(start) && !isNaN(end)) {
        for (let i = Math.max(1, start); i <= Math.min(totalPages, end); i++) {
          pageIndices.add(i - 1);
        }
      }
    } else {
      const pageNum = parseInt(part, 10);
      if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
        pageIndices.add(pageNum - 1);
      }
    }
  }

  return Array.from(pageIndices).sort((a, b) => a - b);
}
