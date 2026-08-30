'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { TOOLS } from '../lib/tools-data';

export const Navbar = () => {
  const [activeDropdown, setActiveDropdown] = useState<'convert' | 'all' | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const convertToTools = TOOLS.filter((t) => t.subCategory === 'to_pdf');
  const convertFromTools = TOOLS.filter((t) => t.subCategory === 'from_pdf');

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand Logo HenryTools */}
        <Link href="/" className="flex items-center gap-2 text-2xl font-black text-[#002248] tracking-tight">
          <div className="w-8 h-8 rounded-xl bg-[#00558E] text-white flex items-center justify-center text-lg font-bold shadow-md shadow-blue-900/20">
            H
          </div>
          <span>Henry<span className="text-[#00558E]">Tools</span></span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1 font-bold text-xs uppercase tracking-wider text-slate-700">
          <Link href="/merge" className="px-3 py-2 rounded-lg hover:text-[#00558E] hover:bg-slate-50 transition">
            MERGE PDF
          </Link>
          <Link href="/split" className="px-3 py-2 rounded-lg hover:text-[#00558E] hover:bg-slate-50 transition">
            SPLIT PDF
          </Link>
          <Link href="/compress" className="px-3 py-2 rounded-lg hover:text-[#00558E] hover:bg-slate-50 transition">
            COMPRESS PDF
          </Link>

          {/* CONVERT PDF Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown('convert')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className="px-3 py-2 rounded-lg hover:text-[#00558E] hover:bg-slate-50 transition flex items-center gap-1">
              CONVERT PDF
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </button>

            {activeDropdown === 'convert' && (
              <div className="absolute top-full left-0 w-[500px] bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 grid grid-cols-2 gap-6 z-50">
                <div>
                  <h4 className="text-xs font-black text-[#00558E] mb-3 tracking-widest uppercase">CONVERT TO PDF</h4>
                  <div className="space-y-1">
                    {convertToTools.map((t) => (
                      <Link key={t.id} href={t.route} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 text-slate-800 hover:text-[#00558E] transition normal-case font-medium text-sm">
                        <div className={`w-7 h-7 rounded-lg ${t.iconBg} text-white flex items-center justify-center p-1.5`}>
                          <svg className="w-full h-full stroke-current fill-none" strokeWidth="2" viewBox="0 0 24 24" dangerouslySetInnerHTML={{ __html: t.iconSvg }} />
                        </div>
                        {t.title}
                      </Link>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#00558E] mb-3 tracking-widest uppercase">CONVERT FROM PDF</h4>
                  <div className="space-y-1">
                    {convertFromTools.map((t) => (
                      <Link key={t.id} href={t.route} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 text-slate-800 hover:text-[#00558E] transition normal-case font-medium text-sm">
                        <div className={`w-7 h-7 rounded-lg ${t.iconBg} text-white flex items-center justify-center p-1.5`}>
                          <svg className="w-full h-full stroke-current fill-none" strokeWidth="2" viewBox="0 0 24 24" dangerouslySetInnerHTML={{ __html: t.iconSvg }} />
                        </div>
                        {t.title}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ALL PDF TOOLS Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown('all')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className="px-3 py-2 rounded-lg hover:text-[#00558E] hover:bg-slate-50 transition flex items-center gap-1">
              ALL PDF TOOLS
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </button>

            {activeDropdown === 'all' && (
              <div className="absolute top-full -right-20 w-[950px] bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 grid grid-cols-4 gap-6 z-50">
                <div>
                  <h4 className="text-xs font-black text-[#00558E] mb-3 tracking-widest uppercase">ORGANIZE PDF</h4>
                  {TOOLS.filter(t => t.category === 'organize').map((t) => (
                    <Link key={t.id} href={t.route} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 text-slate-800 hover:text-[#00558E] text-xs font-medium normal-case">
                      {t.title}
                    </Link>
                  ))}
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#00558E] mb-3 tracking-widest uppercase">OPTIMIZE & CONVERT</h4>
                  {TOOLS.filter(t => t.category === 'optimize' || t.category === 'convert').slice(0, 7).map((t) => (
                    <Link key={t.id} href={t.route} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 text-slate-800 hover:text-[#00558E] text-xs font-medium normal-case">
                      {t.title}
                    </Link>
                  ))}
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#00558E] mb-3 tracking-widest uppercase">EDIT PDF</h4>
                  {TOOLS.filter(t => t.category === 'edit').map((t) => (
                    <Link key={t.id} href={t.route} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 text-slate-800 hover:text-[#00558E] text-xs font-medium normal-case">
                      {t.title}
                    </Link>
                  ))}
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#00558E] mb-3 tracking-widest uppercase">SECURITY & AI</h4>
                  {TOOLS.filter(t => t.category === 'security' || t.category === 'intelligence').map((t) => (
                    <Link key={t.id} href={t.route} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 text-slate-800 hover:text-[#00558E] text-xs font-medium normal-case">
                      {t.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Link href="/#tools" className="hidden sm:block bg-[#00558E] text-white font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-[#2680BE] shadow-md shadow-blue-900/10 transition">
            Semua Perkakas
          </Link>
          
          <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="lg:hidden p-2 text-slate-600">
            ☰
          </button>
        </div>

      </div>

      {isMobileOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 p-4 space-y-2">
          {TOOLS.slice(0, 10).map((t) => (
            <Link key={t.id} href={t.route} onClick={() => setIsMobileOpen(false)} className="block px-3 py-2 text-sm font-semibold text-slate-700 hover:text-[#00558E]">
              {t.title}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};
