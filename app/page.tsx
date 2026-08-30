'use client';

import React, { useState } from 'react';
import { TOOLS } from '../lib/tools-data';
import { ToolCard } from '../components/ToolCard';
import { Category } from '../types/pdf';

const categories: { id: Category; label: string }[] = [
  { id: 'all', label: 'Semua Perkakas' },
  { id: 'organize', label: 'Organisasi PDF' },
  { id: 'optimize', label: 'Optimasi PDF' },
  { id: 'convert', label: 'Konversi PDF' },
  { id: 'edit', label: 'Edit PDF' },
  { id: 'security', label: 'Keamanan PDF' },
  { id: 'intelligence', label: 'AI PDF' },
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [query, setQuery] = useState('');

  const categoryTools = selectedCategory === 'all'
    ? TOOLS
    : TOOLS.filter((t) => t.category === selectedCategory);
  const normalizedQuery = query.trim().toLowerCase();
  const filteredTools = normalizedQuery
    ? categoryTools.filter((tool) =>
        `${tool.title} ${tool.description}`.toLowerCase().includes(normalizedQuery),
      )
    : categoryTools;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <h1 className="text-4xl sm:text-5xl font-black text-[#002248] tracking-tight mb-4">
          Setiap Perkakas PDF yang Anda Butuhkan dalam Satu Tempat
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
          100% Gratis, Cepat, dan Diproses langsung di Browser Anda tanpa mengunggah file ke server luar.
        </p>
      </div>

      <div className="max-w-xl mx-auto mb-5">
        <label htmlFor="tool-search" className="sr-only">Cari perkakas</label>
        <input
          id="tool-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Cari: watermark, putar, gabung..."
          className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm shadow-sm outline-none focus:border-[#00558E] focus:ring-4 focus:ring-[#74AED4]/20"
        />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-5 py-2 rounded-full text-xs font-extrabold transition-all ${
              selectedCategory === cat.id
                ? 'bg-[#002248] text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-[#74AED4]/20 border border-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div id="tools" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 scroll-mt-24">
        {filteredTools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>

      {filteredTools.length === 0 && (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-600">
          Tidak ada perkakas yang cocok dengan pencarian tersebut.
        </div>
      )}

      <section id="privacy" className="mt-16 rounded-3xl bg-[#002248] px-6 py-8 text-white scroll-mt-24">
        <h2 className="text-xl font-black mb-2">Privasi file Anda</h2>
        <p className="text-sm leading-relaxed text-sky-100 max-w-3xl">
          Perkakas berstatus “Siap dipakai di browser” memproses file langsung di perangkat Anda.
          HenryTools tidak mengunggah atau menyimpan dokumen tersebut. Fitur yang membutuhkan layanan
          server diberi label khusus dan tidak menampilkan keberhasilan palsu.
        </p>
      </section>
    </main>
  );
}
