import React from 'react';
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-5 gap-8 text-sm text-slate-600">
        <div>
          <h4 className="font-black text-[#002248] mb-4 tracking-wider text-xs uppercase">SOLUSI</h4>
          <ul className="space-y-2">
            <li><Link href="/merge" className="hover:text-[#00558E]">Bisnis</Link></li>
            <li><Link href="/split" className="hover:text-[#00558E]">Edukasi</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-black text-[#002248] mb-4 tracking-wider text-xs uppercase">FITUR UTAMA</h4>
          <ul className="space-y-2">
            <li><Link href="/merge" className="hover:text-[#00558E]">Merge PDF</Link></li>
            <li><Link href="/split" className="hover:text-[#00558E]">Split PDF</Link></li>
            <li><Link href="/compress" className="hover:text-[#00558E]">Compress PDF</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-black text-[#002248] mb-4 tracking-wider text-xs uppercase">TENTANG</h4>
          <ul className="space-y-2">
            <li><Link href="/#privacy" className="hover:text-[#00558E]">Privasi File</Link></li>
            <li><a href="https://github.com/hentostc06/henrytools" target="_blank" rel="noreferrer" className="hover:text-[#00558E]">Kode Sumber</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-black text-[#002248] mb-4 tracking-wider text-xs uppercase">PEMROSESAN</h4>
          <ul className="space-y-2">
            <li><span>100% di browser</span></li>
            <li><span>Tanpa unggah file</span></li>
          </ul>
        </div>
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 text-xl font-black text-[#002248] mb-3">
            <div className="w-6 h-6 rounded-lg bg-[#00558E] text-white flex items-center justify-center text-xs font-bold">H</div>
            <span>Henry<span className="text-[#00558E]">Tools</span></span>
          </div>
          <p className="text-xs text-slate-400">© {new Date().getFullYear()} HenryTools. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
