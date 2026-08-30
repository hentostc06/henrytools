"use client";

import { useState } from "react";

export default function PdfToWordPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleConvert = async () => {
    if (!file) return alert("Pilih file PDF terlebih dahulu!");
    setLoading(true);
    // Logika konversi PDF ke Word dapat dihubungkan ke API/Library
    setTimeout(() => {
      alert("Fitur konversi PDF ke Word sedang diproses.");
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-center">
      <h1 className="text-3xl font-bold mb-3 text-gray-800">PDF ke Word</h1>
      <p className="text-gray-600 mb-8">Konversi dokumen PDF Anda menjadi file Microsoft Word (.docx) yang dapat diedit.</p>
      
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 bg-gray-50 flex flex-col items-center justify-center mb-6">
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="block w-full max-w-xs text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {file && <p className="mt-4 text-sm text-emerald-600 font-medium">Terpilih: {file.name}</p>}
      </div>

      <button
        onClick={handleConvert}
        disabled={!file || loading}
        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold px-8 py-3 rounded-lg shadow transition-colors"
      >
        {loading ? "Mengoversi..." : "Konversi ke Word"}
      </button>
    </div>
  );
}
