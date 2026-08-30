'use client';

import React, { useState } from 'react';
import { FileUploader } from '../../components/FileUploader';
import { splitPDF } from '../../lib/pdf-utils';

export default function SplitPage() {
  const [file, setFile] = useState<File | null>(null);
  const [range, setRange] = useState('1');
  const [processing, setProcessing] = useState(false);

  const handleSplit = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const pdfBytes = await splitPDF(file, range);
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `split_${file.name}`;
      a.click();
    } catch (err: any) {
      alert(err.message || 'Failed to split PDF.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black text-slate-900 mb-2">Split PDF file</h1>
        <p className="text-slate-600">Separate one page or a whole set for easy conversion into independent PDF files.</p>
      </div>

      {!file ? (
        <FileUploader multiple={false} onFilesSelected={(files) => setFile(files[0])} />
      ) : (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <p className="font-bold text-slate-800">File: {file.name}</p>
          <div>
            <label className="block text-sm font-extrabold text-slate-700 mb-2">
              Page Range (e.g., "1-3, 5" or "2"):
            </label>
            <input
              type="text"
              value={range}
              onChange={(e) => setRange(e.target.value)}
              className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-red-500 outline-none"
            />
          </div>
          <button
            onClick={handleSplit}
            disabled={processing}
            className="w-full bg-red-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-red-700 transition shadow-lg shadow-red-200"
          >
            {processing ? 'Splitting...' : 'Split PDF'}
          </button>
        </div>
      )}
    </main>
  );
}
