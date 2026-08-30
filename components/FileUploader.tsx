'use client';

import React from 'react';

interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  label?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onFilesSelected,
  accept = "application/pdf",
  multiple = true,
  label = "Pilih file PDF"
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(Array.from(e.target.files));
    }
  };

  return (
    <div className="border-2 border-dashed border-[#74AED4] hover:border-[#00558E] rounded-3xl p-12 text-center bg-white hover:bg-sky-50/40 transition-all shadow-sm">
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
        className="hidden"
        id="file-upload-input"
      />
      <label htmlFor="file-upload-input" className="cursor-pointer block">
        <div className="w-20 h-20 bg-[#00558E] text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-900/20 hover:scale-105 transition-transform">
          <svg className="w-10 h-10 fill-current" viewBox="0 0 24 24">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>
        </div>
        <span className="inline-block bg-[#00558E] text-white font-bold text-lg px-8 py-3.5 rounded-2xl hover:bg-[#2680BE] transition shadow-md shadow-blue-900/10 mb-3">
          {label}
        </span>
        <p className="text-sm text-slate-500 font-medium mt-2">atau tarik dan lepas file PDF di sini</p>
      </label>
    </div>
  );
};
