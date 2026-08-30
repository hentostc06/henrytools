'use client';

import React, { useState } from 'react';
import { FileUploader } from '../../components/FileUploader';
import { protectPDF } from '../../lib/pdf-utils';

export default function ProtectPage() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleProtect = async () => {
    if (!file || !password) return alert("Pilih file dan tentukan kata sandi.");
    setLoading(true);
    try {
      const bytes = await protectPDF(file, password);
      const blob = new Blob([bytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `protected_${file.name}`;
      a.click();
    } catch (err) {
      alert("Gagal mengunci dokumen PDF.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-center mb-2">Amankan PDF dengan Kata Sandi</h1>
      <p className="text-center text-gray-600 mb-8">Enkripsi dokumen PDF Anda agar tidak dapat dibuka sembarangan.</p>

      {!file ? (
        <FileUploader multiple={false} onFilesSelected={(files) => setFile(files[0])} />
      ) : (
        <div className="bg-white p-6 rounded-2xl border space-y-4">
          <p className="font-semibold text-gray-700">File: {file.name}</p>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Kata Sandi Dokumen:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-500 outline-none"
              placeholder="Masukkan kata sandi..."
            />
          </div>
          <button
            onClick={handleProtect}
            disabled={loading}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition"
          >
            {loading ? 'Mengunci...' : 'Kunci Dokumen PDF'}
          </button>
        </div>
      )}
    </main>
  );
}
