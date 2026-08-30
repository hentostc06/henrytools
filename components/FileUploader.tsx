'use client';

import React, { useId, useState } from 'react';

interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  label?: string;
  helperText?: string;
  capture?: 'user' | 'environment';
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onFilesSelected,
  accept = "application/pdf",
  multiple = true,
  label = "Pilih file PDF",
  helperText = "atau tarik dan lepas file di sini",
  capture,
}) => {
  const inputId = useId();
  const [dragging, setDragging] = useState(false);

  const sendFiles = (files: FileList | File[]) => {
    const selected = Array.from(files);
    if (selected.length > 0) onFilesSelected(multiple ? selected : selected.slice(0, 1));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      sendFiles(e.target.files);
      e.target.value = '';
    }
  };

  return (
    <div
      onDragEnter={(event) => { event.preventDefault(); setDragging(true); }}
      onDragOver={(event) => event.preventDefault()}
      onDragLeave={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDragging(false);
      }}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        sendFiles(event.dataTransfer.files);
      }}
      className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center bg-white transition-all shadow-sm ${
        dragging ? 'border-[#00558E] bg-sky-50 scale-[1.01]' : 'border-[#74AED4] hover:border-[#00558E] hover:bg-sky-50/40'
      }`}
    >
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        capture={capture}
        onChange={handleFileChange}
        className="hidden"
        id={inputId}
      />
      <label htmlFor={inputId} className="cursor-pointer block">
        <div className="w-20 h-20 bg-[#00558E] text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-900/20 hover:scale-105 transition-transform">
          <svg className="w-10 h-10 fill-current" viewBox="0 0 24 24">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>
        </div>
        <span className="inline-block bg-[#00558E] text-white font-bold text-lg px-8 py-3.5 rounded-2xl hover:bg-[#2680BE] transition shadow-md shadow-blue-900/10 mb-3">
          {label}
        </span>
        <p className="text-sm text-slate-500 font-medium mt-2">{helperText}</p>
        <p className="text-xs text-slate-400 mt-1">File diproses lokal dan tidak diunggah ke server.</p>
      </label>
    </div>
  );
};
