'use client';

import React, { useState } from 'react';
import { FileUploader } from '../../components/FileUploader';
import { imagesToPDF } from '../../lib/pdf-utils';
import { downloadBytes } from '../../lib/browser-download';

export default function Img2PdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleConvert = async () => {
    if (files.length === 0) return;
    setLoading(true);
    try {
      const bytes = await imagesToPDF(files);
      downloadBytes(bytes, 'converted_images.pdf');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Gagal mengubah gambar ke PDF.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-center mb-2">Konversi Gambar ke PDF</h1>
      <p className="text-center text-gray-600 mb-8">Ubah kumpulan file PNG atau JPG menjadi satu file PDF.</p>

      <FileUploader
        accept="image/png, image/jpeg"
        label="Pilih Gambar (JPG/PNG)"
        helperText="atau tarik dan lepas gambar JPG/PNG di sini"
        onFilesSelected={(selected) => setFiles((prev) => [...prev, ...selected])}
      />

      {files.length > 0 && (
        <div className="mt-6 bg-white p-6 rounded-2xl border space-y-4">
          <h2 className="font-semibold text-gray-700">Gambar Terpilih ({files.length}):</h2>
          <ul className="space-y-2">
            {files.map((f, i) => (
              <li key={`${f.name}-${f.lastModified}-${i}`} className="flex items-center justify-between gap-3 text-sm bg-gray-50 p-2 rounded border">
                <span className="truncate">{f.name}</span>
                <button type="button" onClick={() => setFiles((current) => current.filter((_, index) => index !== i))} className="font-bold text-red-600">Hapus</button>
              </li>
            ))}
          </ul>
          <button
            onClick={handleConvert}
            disabled={loading}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition"
          >
            {loading ? 'Mengonversi...' : 'Ubah ke PDF'}
          </button>
        </div>
      )}
    </main>
  );
}
