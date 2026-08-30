import {
  degrees,
  PDFDocument,
  PDFPage,
  rgb,
  StandardFonts,
} from 'pdf-lib';

export type PdfPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export interface PdfSummary {
  name: string;
  size: number;
  pages: number;
  title: string;
  author: string;
}

async function loadPDF(file: File, ignoreEncryption = false) {
  try {
    return await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption });
  } catch {
    throw new Error('File PDF tidak valid, rusak, atau menggunakan enkripsi yang belum didukung.');
  }
}

export function parsePageRange(range: string, totalPages: number): number[] {
  if (!range.trim()) {
    return Array.from({ length: totalPages }, (_, index) => index);
  }

  const result: number[] = [];
  const seen = new Set<number>();

  for (const rawPart of range.split(',')) {
    const part = rawPart.trim();
    if (!part) continue;

    if (part.includes('-')) {
      const values = part.split('-').map((value) => Number(value.trim()));
      if (values.length !== 2 || values.some((value) => !Number.isInteger(value))) {
        throw new Error(`Rentang halaman "${part}" tidak valid.`);
      }

      const [start, end] = values;
      if (start < 1 || end < start || end > totalPages) {
        throw new Error(`Rentang ${part} harus berada antara 1 dan ${totalPages}.`);
      }

      for (let page = start; page <= end; page += 1) {
        if (!seen.has(page - 1)) {
          seen.add(page - 1);
          result.push(page - 1);
        }
      }
    } else {
      const page = Number(part);
      if (!Number.isInteger(page) || page < 1 || page > totalPages) {
        throw new Error(`Halaman ${part} harus berada antara 1 dan ${totalPages}.`);
      }
      if (!seen.has(page - 1)) {
        seen.add(page - 1);
        result.push(page - 1);
      }
    }
  }

  if (result.length === 0) throw new Error('Masukkan minimal satu halaman yang valid.');
  return result;
}

export async function mergePDFs(files: File[]): Promise<Uint8Array> {
  if (files.length < 2) throw new Error('Pilih minimal dua file PDF.');
  const mergedPDF = await PDFDocument.create();

  for (const file of files) {
    const source = await loadPDF(file);
    const pages = await mergedPDF.copyPages(source, source.getPageIndices());
    pages.forEach((page) => mergedPDF.addPage(page));
  }

  return mergedPDF.save({ useObjectStreams: true });
}

export async function splitPDF(file: File, range: string): Promise<Uint8Array> {
  const source = await loadPDF(file);
  const output = await PDFDocument.create();
  const indices = parsePageRange(range, source.getPageCount());
  const pages = await output.copyPages(source, indices);
  pages.forEach((page) => output.addPage(page));
  return output.save({ useObjectStreams: true });
}

export async function compressPDF(file: File): Promise<Uint8Array> {
  const original = new Uint8Array(await file.arrayBuffer());
  const source = await PDFDocument.load(original, { ignoreEncryption: true });
  const optimized = await source.save({ useObjectStreams: true, objectsPerTick: 50 });
  return optimized.length < original.length ? optimized : original;
}

export async function imagesToPDF(files: File[]): Promise<Uint8Array> {
  if (files.length === 0) throw new Error('Pilih minimal satu gambar.');
  const output = await PDFDocument.create();

  for (const file of files) {
    const buffer = await file.arrayBuffer();
    const image = file.type === 'image/png'
      ? await output.embedPng(buffer)
      : file.type === 'image/jpeg' || file.type === 'image/jpg'
        ? await output.embedJpg(buffer)
        : null;

    if (!image) throw new Error(`${file.name} bukan gambar JPG atau PNG.`);

    const portrait = image.height >= image.width;
    const pageWidth = portrait ? 595.28 : 841.89;
    const pageHeight = portrait ? 841.89 : 595.28;
    const margin = 24;
    const scale = Math.min(
      (pageWidth - margin * 2) / image.width,
      (pageHeight - margin * 2) / image.height,
    );
    const width = image.width * scale;
    const height = image.height * scale;
    const page = output.addPage([pageWidth, pageHeight]);
    page.drawImage(image, {
      x: (pageWidth - width) / 2,
      y: (pageHeight - height) / 2,
      width,
      height,
    });
  }

  return output.save({ useObjectStreams: true });
}

export async function rotatePDF(
  file: File,
  angle: number,
  range = '',
): Promise<Uint8Array> {
  if (![90, 180, 270].includes(angle)) throw new Error('Rotasi harus 90°, 180°, atau 270°.');
  const document = await loadPDF(file);
  const pages = document.getPages();
  const indices = parsePageRange(range, pages.length);
  indices.forEach((index) => {
    const page = pages[index];
    page.setRotation(degrees((page.getRotation().angle + angle) % 360));
  });
  return document.save({ useObjectStreams: true });
}

export async function watermarkPDF(
  file: File,
  text: string,
  opacity = 0.25,
): Promise<Uint8Array> {
  if (!text.trim()) throw new Error('Teks watermark belum diisi.');
  const document = await loadPDF(file);
  const font = await document.embedFont(StandardFonts.HelveticaBold);

  document.getPages().forEach((page) => {
    const { width, height } = page.getSize();
    const size = Math.max(24, Math.min(64, width / Math.max(text.length * 0.7, 8)));
    const textWidth = font.widthOfTextAtSize(text, size);
    page.drawText(text, {
      x: Math.max(18, (width - textWidth) / 2),
      y: height / 2,
      size,
      font,
      color: rgb(0.15, 0.2, 0.3),
      opacity: Math.min(0.8, Math.max(0.05, opacity)),
      rotate: degrees(35),
    });
  });

  return document.save({ useObjectStreams: true });
}

export async function removePDFPages(file: File, range: string): Promise<Uint8Array> {
  const document = await loadPDF(file);
  const indices = parsePageRange(range, document.getPageCount()).sort((a, b) => b - a);
  if (indices.length >= document.getPageCount()) {
    throw new Error('Minimal satu halaman harus tetap berada di dalam PDF.');
  }
  indices.forEach((index) => document.removePage(index));
  return document.save({ useObjectStreams: true });
}

function positionFor(
  page: PDFPage,
  textWidth: number,
  fontSize: number,
  position: PdfPosition,
) {
  const { width, height } = page.getSize();
  const margin = 28;
  const x = position.endsWith('left')
    ? margin
    : position.endsWith('right')
      ? width - textWidth - margin
      : (width - textWidth) / 2;
  const y = position.startsWith('top') ? height - fontSize - margin : margin;
  return { x: Math.max(margin, x), y };
}

export async function addPageNumbers(
  file: File,
  startNumber = 1,
  position: PdfPosition = 'bottom-center',
): Promise<Uint8Array> {
  const document = await loadPDF(file);
  const font = await document.embedFont(StandardFonts.Helvetica);
  const size = 11;
  document.getPages().forEach((page, index) => {
    const label = String(startNumber + index);
    const coordinates = positionFor(page, font.widthOfTextAtSize(label, size), size, position);
    page.drawText(label, { ...coordinates, size, font, color: rgb(0.2, 0.25, 0.32) });
  });
  return document.save({ useObjectStreams: true });
}

export async function cropPDF(file: File, margin: number): Promise<Uint8Array> {
  if (!Number.isFinite(margin) || margin < 0) throw new Error('Margin crop tidak valid.');
  const document = await loadPDF(file);
  document.getPages().forEach((page) => {
    const { width, height } = page.getSize();
    if (margin * 2 >= width || margin * 2 >= height) {
      throw new Error('Margin terlalu besar untuk ukuran halaman PDF.');
    }
    page.setCropBox(margin, margin, width - margin * 2, height - margin * 2);
  });
  return document.save({ useObjectStreams: true });
}

export async function repairPDF(file: File): Promise<Uint8Array> {
  const document = await loadPDF(file, true);
  document.setProducer('HenryTools browser repair');
  document.setModificationDate(new Date());
  return document.save({ useObjectStreams: true, updateFieldAppearances: true });
}

export async function addTextToPDF(
  file: File,
  text: string,
  pageNumber: number,
  position: PdfPosition,
): Promise<Uint8Array> {
  if (!text.trim()) throw new Error('Teks belum diisi.');
  const document = await loadPDF(file);
  if (pageNumber < 1 || pageNumber > document.getPageCount()) {
    throw new Error(`Nomor halaman harus antara 1 dan ${document.getPageCount()}.`);
  }
  const page = document.getPage(pageNumber - 1);
  const font = await document.embedFont(StandardFonts.Helvetica);
  const size = 15;
  const coordinates = positionFor(page, font.widthOfTextAtSize(text, size), size, position);
  page.drawText(text, { ...coordinates, size, font, color: rgb(0.05, 0.1, 0.18) });
  return document.save({ useObjectStreams: true });
}

export async function signPDF(
  file: File,
  signature: string,
  pageNumber: number,
  position: PdfPosition,
): Promise<Uint8Array> {
  if (!signature.trim()) throw new Error('Nama atau teks tanda tangan belum diisi.');
  const document = await loadPDF(file);
  if (pageNumber < 1 || pageNumber > document.getPageCount()) {
    throw new Error(`Nomor halaman harus antara 1 dan ${document.getPageCount()}.`);
  }
  const page = document.getPage(pageNumber - 1);
  const font = await document.embedFont(StandardFonts.TimesRomanItalic);
  const size = 24;
  const coordinates = positionFor(page, font.widthOfTextAtSize(signature, size), size, position);
  page.drawText(signature, { ...coordinates, size, font, color: rgb(0.05, 0.18, 0.42) });
  return document.save({ useObjectStreams: true });
}

export async function summarizePDF(file: File): Promise<PdfSummary> {
  const document = await loadPDF(file, true);
  return {
    name: file.name,
    size: file.size,
    pages: document.getPageCount(),
    title: document.getTitle() || '-',
    author: document.getAuthor() || '-',
  };
}
