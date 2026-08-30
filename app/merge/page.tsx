'use client';

import React, { useState } from 'react';
import { FileUploader } from '../../components/FileUploader';
import { mergePDFs } from '../../lib/pdf-utils';

export default function MergePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);

  const handleMerge = async () => {
    if (files.length < 2) return alert('Pilih minimal 2 file PDF untuk digabungkan.');
    setProcessing(true);
    try {
      const pdfBytes = await mergePDFs(files);
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'merged_henrytools.pdf';
      a.click();
    } catch (err) {
      alert('Gagal menggabungkan file PDF.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black text-[#002248] mb-2">Gabungkan File PDF</h1>
        <p className="text-slate-600">Urutkan dan gabungkan beberapa dokumen PDF menjadi satu file dengan mudah.</p>
      </div>

      <FileUploader onFilesSelected={(selected) => setFiles((prev) => [...prev, ...selected])} />

      {files.length > 0 && (
        <div className="mt-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-[#002248] mb-4">File Terpilih ({files.length}):</h3>
          <ul className="space-y-2 mb-6">
            {files.map((f, i) => (
              <li key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl text-sm border border-slate-100">
                <span className="font-medium text-slate-700">{f.name}</span>
                <span className="text-xs text-slate-400 font-mono">{(f.size / 1024 / 1024).toFixed(2)} MB</span>
              </li>
            ))}
          </ul>
          <button
            onClick={handleMerge}
            disabled={processing}
            className="w-full bg-[#00558E] text-white py-4 rounded-2xl font-black text-lg hover:bg-[#2680BE] transition shadow-lg shadow-blue-900/10"
          >
            {processing ? 'Memproses PDF...' : 'Gabungkan PDF'}
          </button>
        </div>
      )}
    </main>
  );
}
