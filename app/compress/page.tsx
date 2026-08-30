'use client';

import React, { useState } from 'react';
import { FileUploader } from '../../components/FileUploader';
import { compressPDF } from '../../lib/pdf-utils';

export default function CompressPage() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleCompress = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const pdfBytes = await compressPDF(file);
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `compressed_${file.name}`;
      a.click();
    } catch (err) {
      alert('Gagal mengompres PDF.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black text-[#002248] mb-2">Kompres File PDF</h1>
        <p className="text-slate-600">Kecilkan ukuran file PDF Anda tanpa mengurangi kualitas dokumen.</p>
      </div>

      {!file ? (
        <FileUploader multiple={false} onFilesSelected={(files) => setFile(files[0])} />
      ) : (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <p className="font-bold text-[#002248]">File: {file.name}</p>
          <p className="text-sm text-slate-500">Ukuran Awal: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
          <button
            onClick={handleCompress}
            disabled={processing}
            className="w-full bg-[#00558E] text-white py-4 rounded-2xl font-black text-lg hover:bg-[#2680BE] transition shadow-lg shadow-blue-900/10"
          >
            {processing ? 'Mengompres...' : 'Kompres PDF Sekarang'}
          </button>
        </div>
      )}
    </main>
  );
}
