'use client';

import Link from 'next/link';
import { type ReactNode, useState } from 'react';
import { Tool } from '../types/pdf';
import { FileUploader } from './FileUploader';
import { downloadBytes } from '../lib/browser-download';
import { isBrowserReadyTool } from '../lib/tools-data';
import {
  addPageNumbers,
  addTextToPDF,
  cropPDF,
  imagesToPDF,
  PdfPosition,
  PdfSummary,
  removePDFPages,
  repairPDF,
  rotatePDF,
  signPDF,
  summarizePDF,
  watermarkPDF,
} from '../lib/pdf-utils';

const positionLabels: Record<PdfPosition, string> = {
  'top-left': 'Kiri atas',
  'top-center': 'Tengah atas',
  'top-right': 'Kanan atas',
  'bottom-left': 'Kiri bawah',
  'bottom-center': 'Tengah bawah',
  'bottom-right': 'Kanan bawah',
};

const serviceRequirements: Record<string, string> = {
  pdf2word: 'Konversi DOCX yang akurat membutuhkan mesin konversi dokumen di server.',
  pdf2powerpoint: 'Konversi PPTX membutuhkan mesin konversi dokumen di server.',
  pdf2excel: 'Ekstraksi tabel ke Excel membutuhkan parser tabel dan layanan konversi.',
  word2pdf: 'Pembacaan DOC/DOCX membutuhkan LibreOffice atau layanan konversi server.',
  powerpoint2pdf: 'Pembacaan PPT/PPTX membutuhkan LibreOffice atau layanan konversi server.',
  excel2pdf: 'Perenderan spreadsheet membutuhkan LibreOffice atau layanan konversi server.',
  pdf2jpg: 'Perenderan halaman PDF membutuhkan PDF.js dan worker tambahan.',
  html2pdf: 'Mengambil halaman web dari URL memerlukan backend untuk mengatasi CORS dan keamanan URL.',
  unlock: 'Membuka PDF terenkripsi memerlukan mesin enkripsi PDF yang belum tersedia di browser ini.',
  protect: 'Enkripsi kata sandi tidak didukung oleh pdf-lib; fitur ini tidak akan berpura-pura mengunci file.',
  pdf2pdfa: 'Validasi dan konversi PDF/A membutuhkan Ghostscript atau mesin PDF/A khusus.',
  ocr: 'OCR membutuhkan model bahasa dan worker yang cukup besar.',
  redact: 'Redaksi aman harus menghapus konten asli, bukan hanya menutupinya dengan kotak hitam.',
  'pdf-forms': 'Editor formulir lengkap membutuhkan renderer dan editor koordinat interaktif.',
  'ai-summarizer': 'Ringkasan isi membutuhkan ekstraksi teks serta layanan AI yang dikonfigurasi.',
  translate: 'Terjemahan yang mempertahankan tata letak membutuhkan ekstraksi teks dan layanan AI.',
};

function formatSize(size: number) {
  return `${(size / 1024 / 1024).toFixed(2)} MB`;
}

export function DynamicPdfTool({ tool }: { tool: Tool }) {
  const ready = isBrowserReadyTool(tool.id);
  const [file, setFile] = useState<File | null>(null);
  const [secondFile, setSecondFile] = useState<File | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [comparison, setComparison] = useState<PdfSummary[] | null>(null);
  const [text, setText] = useState(tool.id === 'watermark' ? 'DRAFT' : '');
  const [range, setRange] = useState(tool.id === 'organize' ? '2' : '');
  const [angle, setAngle] = useState(90);
  const [pageNumber, setPageNumber] = useState(1);
  const [position, setPosition] = useState<PdfPosition>('bottom-right');
  const [startNumber, setStartNumber] = useState(1);
  const [margin, setMargin] = useState(24);
  const [opacity, setOpacity] = useState(25);

  const resetMessages = () => {
    setError('');
    setSuccess('');
    setComparison(null);
  };

  const process = async () => {
    resetMessages();
    setBusy(true);
    try {
      if (tool.id === 'scan') {
        if (images.length === 0) throw new Error('Pilih atau ambil minimal satu foto.');
        const bytes = await imagesToPDF(images);
        downloadBytes(bytes, 'scan_henrytools.pdf');
        setSuccess(`${images.length} gambar berhasil dijadikan PDF.`);
        return;
      }

      if (tool.id === 'compare') {
        if (!file || !secondFile) throw new Error('Pilih dua file PDF yang ingin dibandingkan.');
        setComparison(await Promise.all([summarizePDF(file), summarizePDF(secondFile)]));
        setSuccess('Perbandingan struktur dasar selesai.');
        return;
      }

      if (!file) throw new Error('Pilih file PDF terlebih dahulu.');
      let bytes: Uint8Array;
      let filename: string;

      switch (tool.id) {
        case 'rotate':
          bytes = await rotatePDF(file, angle, range);
          filename = `rotated_${file.name}`;
          break;
        case 'watermark':
          bytes = await watermarkPDF(file, text, opacity / 100);
          filename = `watermarked_${file.name}`;
          break;
        case 'organize':
          bytes = await removePDFPages(file, range);
          filename = `organized_${file.name}`;
          break;
        case 'repair':
          bytes = await repairPDF(file);
          filename = `repaired_${file.name}`;
          break;
        case 'page-numbers':
          bytes = await addPageNumbers(file, startNumber, position);
          filename = `numbered_${file.name}`;
          break;
        case 'crop':
          bytes = await cropPDF(file, margin);
          filename = `cropped_${file.name}`;
          break;
        case 'edit':
          bytes = await addTextToPDF(file, text, pageNumber, position);
          filename = `edited_${file.name}`;
          break;
        case 'sign':
          bytes = await signPDF(file, text, pageNumber, position);
          filename = `signed_${file.name}`;
          break;
        default:
          throw new Error('Mode pemrosesan belum tersedia.');
      }

      downloadBytes(bytes, filename);
      setSuccess('PDF berhasil diproses dan unduhan sudah dimulai.');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Terjadi kesalahan saat memproses file.');
    } finally {
      setBusy(false);
    }
  };

  if (!ready) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-14">
        <div className="rounded-3xl border border-amber-200 bg-white p-8 sm:p-10 shadow-sm">
          <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-black uppercase tracking-wider text-amber-700">
            Memerlukan layanan tambahan
          </span>
          <h1 className="mt-4 text-3xl sm:text-4xl font-black text-[#002248]">{tool.title}</h1>
          <p className="mt-3 text-slate-600 leading-relaxed">{tool.description}</p>
          <div className="mt-6 rounded-2xl bg-amber-50 p-5 text-sm leading-relaxed text-amber-900">
            {serviceRequirements[tool.id] || 'Fitur ini membutuhkan komponen tambahan sebelum dapat digunakan dengan aman.'}
          </div>
          <p className="mt-4 text-sm text-slate-500">
            Halaman ini menggantikan route 404 dan simulasi keberhasilan. File tidak diminta sebelum mesin pemrosesnya benar-benar tersedia.
          </p>
          <Link href="/#tools" className="mt-8 inline-flex rounded-xl bg-[#00558E] px-5 py-3 text-sm font-bold text-white hover:bg-[#2680BE]">
            Kembali ke perkakas yang siap
          </Link>
        </div>
      </main>
    );
  }

  if (tool.id === 'scan') {
    return (
      <ToolShell tool={tool}>
        <FileUploader
          accept="image/png,image/jpeg"
          label="Ambil atau pilih foto"
          helperText="Gunakan kamera ponsel atau pilih beberapa gambar JPG/PNG"
          capture="environment"
          onFilesSelected={(selected) => {
            resetMessages();
            setImages((current) => [...current, ...selected]);
          }}
        />
        {images.length > 0 && (
          <SelectedImages images={images} onChange={setImages} />
        )}
        <ActionButton busy={busy} disabled={images.length === 0} onClick={process} label="Jadikan PDF" />
        <Feedback error={error} success={success} />
      </ToolShell>
    );
  }

  if (tool.id === 'compare') {
    return (
      <ToolShell tool={tool}>
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <p className="mb-2 text-sm font-bold text-slate-700">Dokumen A</p>
            <FileUploader multiple={false} label="Pilih PDF A" onFilesSelected={(files) => { resetMessages(); setFile(files[0]); }} />
            {file && <FilePill file={file} onRemove={() => setFile(null)} />}
          </div>
          <div>
            <p className="mb-2 text-sm font-bold text-slate-700">Dokumen B</p>
            <FileUploader multiple={false} label="Pilih PDF B" onFilesSelected={(files) => { resetMessages(); setSecondFile(files[0]); }} />
            {secondFile && <FilePill file={secondFile} onRemove={() => setSecondFile(null)} />}
          </div>
        </div>
        <ActionButton busy={busy} disabled={!file || !secondFile} onClick={process} label="Bandingkan Struktur" />
        <Feedback error={error} success={success} />
        {comparison && <ComparisonTable summaries={comparison} />}
      </ToolShell>
    );
  }

  return (
    <ToolShell tool={tool}>
      {!file ? (
        <FileUploader multiple={false} onFilesSelected={(files) => { resetMessages(); setFile(files[0]); }} />
      ) : (
        <FilePill file={file} onRemove={() => { resetMessages(); setFile(null); }} />
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {tool.id === 'rotate' && (
          <>
            <SelectField label="Sudut rotasi" value={String(angle)} onChange={(value) => setAngle(Number(value))} options={[
              ['90', '90° searah jarum jam'], ['180', '180°'], ['270', '270° searah jarum jam'],
            ]} />
            <TextField label="Halaman (kosong = semua)" value={range} onChange={setRange} placeholder="1-3, 5" />
          </>
        )}
        {tool.id === 'watermark' && (
          <>
            <TextField label="Teks watermark" value={text} onChange={setText} placeholder="DRAFT" />
            <NumberField label="Opacity (%)" value={opacity} onChange={setOpacity} min={5} max={80} />
          </>
        )}
        {tool.id === 'organize' && (
          <TextField label="Halaman yang dihapus" value={range} onChange={setRange} placeholder="2, 4-6" />
        )}
        {tool.id === 'page-numbers' && (
          <>
            <NumberField label="Mulai dari nomor" value={startNumber} onChange={setStartNumber} min={0} />
            <PositionField value={position} onChange={setPosition} />
          </>
        )}
        {tool.id === 'crop' && (
          <NumberField label="Margin yang dipotong (point)" value={margin} onChange={setMargin} min={0} max={200} />
        )}
        {(tool.id === 'edit' || tool.id === 'sign') && (
          <>
            <TextField
              label={tool.id === 'sign' ? 'Nama/tanda tangan visual' : 'Teks yang ditambahkan'}
              value={text}
              onChange={setText}
              placeholder={tool.id === 'sign' ? 'Henri Ardianto' : 'Teks dokumen'}
            />
            <NumberField label="Nomor halaman" value={pageNumber} onChange={setPageNumber} min={1} />
            <PositionField value={position} onChange={setPosition} />
          </>
        )}
      </div>

      {tool.id === 'sign' && (
        <p className="rounded-xl bg-blue-50 p-4 text-xs leading-relaxed text-blue-800">
          Ini adalah tanda tangan visual, bukan sertifikat tanda tangan digital atau permintaan tanda tangan kepada pihak lain.
        </p>
      )}

      <ActionButton busy={busy} disabled={!file} onClick={process} label="Proses dan Unduh" />
      <Feedback error={error} success={success} />
    </ToolShell>
  );
}

function ToolShell({ tool, children }: { tool: Tool; children: ReactNode }) {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-black uppercase tracking-wider text-emerald-700">Diproses di browser</span>
        <h1 className="mt-3 text-3xl sm:text-4xl font-black text-[#002248]">{tool.title}</h1>
        <p className="mt-2 text-slate-600">{tool.description}</p>
      </div>
      <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-5 sm:p-8 shadow-sm">{children}</div>
    </main>
  );
}

function FilePill({ file, onRemove }: { file: File; onRemove: () => void }) {
  return (
    <div className="mt-3 flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm">
      <div className="min-w-0">
        <p className="truncate font-bold text-slate-700">{file.name}</p>
        <p className="text-xs text-slate-400">{formatSize(file.size)}</p>
      </div>
      <button type="button" onClick={onRemove} className="rounded-lg px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50">Hapus</button>
    </div>
  );
}

function SelectedImages({ images, onChange }: { images: File[]; onChange: (files: File[]) => void }) {
  return (
    <div className="space-y-2">
      {images.map((image, index) => (
        <div key={`${image.name}-${image.lastModified}-${index}`} className="flex items-center justify-between rounded-xl bg-slate-50 p-3 text-sm">
          <span className="truncate font-medium text-slate-700">{index + 1}. {image.name}</span>
          <button type="button" onClick={() => onChange(images.filter((_, itemIndex) => itemIndex !== index))} className="text-xs font-bold text-red-600">Hapus</button>
        </div>
      ))}
    </div>
  );
}

function TextField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
  return (
    <label className="block text-sm font-bold text-slate-700">
      {label}
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="mt-2 w-full rounded-xl border border-slate-300 p-3 font-normal outline-none focus:border-[#00558E] focus:ring-4 focus:ring-sky-100" />
    </label>
  );
}

function NumberField({ label, value, onChange, min, max }: { label: string; value: number; onChange: (value: number) => void; min?: number; max?: number }) {
  return (
    <label className="block text-sm font-bold text-slate-700">
      {label}
      <input type="number" value={value} min={min} max={max} onChange={(event) => onChange(Number(event.target.value))} className="mt-2 w-full rounded-xl border border-slate-300 p-3 font-normal outline-none focus:border-[#00558E] focus:ring-4 focus:ring-sky-100" />
    </label>
  );
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[][] }) {
  return (
    <label className="block text-sm font-bold text-slate-700">
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 bg-white p-3 font-normal outline-none focus:border-[#00558E] focus:ring-4 focus:ring-sky-100">
        {options.map(([optionValue, optionLabel]) => <option key={optionValue} value={optionValue}>{optionLabel}</option>)}
      </select>
    </label>
  );
}

function PositionField({ value, onChange }: { value: PdfPosition; onChange: (value: PdfPosition) => void }) {
  return <SelectField label="Posisi" value={value} onChange={(next) => onChange(next as PdfPosition)} options={Object.entries(positionLabels)} />;
}

function ActionButton({ busy, disabled, onClick, label }: { busy: boolean; disabled: boolean; onClick: () => void; label: string }) {
  return (
    <button type="button" onClick={onClick} disabled={busy || disabled} className="w-full rounded-2xl bg-[#00558E] px-5 py-4 text-base font-black text-white shadow-lg shadow-blue-900/10 transition hover:bg-[#2680BE] disabled:cursor-not-allowed disabled:bg-slate-300">
      {busy ? 'Memproses...' : label}
    </button>
  );
}

function Feedback({ error, success }: { error: string; success: string }) {
  if (!error && !success) return null;
  return <p role="status" className={`rounded-xl p-4 text-sm font-semibold ${error ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>{error || success}</p>;
}

function ComparisonTable({ summaries }: { summaries: PdfSummary[] }) {
  const [first, second] = summaries;
  const rows = [
    ['Nama', first.name, second.name],
    ['Ukuran', formatSize(first.size), formatSize(second.size)],
    ['Jumlah halaman', String(first.pages), String(second.pages)],
    ['Judul metadata', first.title, second.title],
    ['Penulis metadata', first.author, second.author],
  ];
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-100 text-slate-700"><tr><th className="p-3">Properti</th><th className="p-3">Dokumen A</th><th className="p-3">Dokumen B</th></tr></thead>
        <tbody>{rows.map(([label, a, b]) => <tr key={label} className="border-t border-slate-100"><th className="p-3 font-bold text-slate-600">{label}</th><td className="p-3">{a}</td><td className="p-3">{b}</td></tr>)}</tbody>
      </table>
    </div>
  );
}
