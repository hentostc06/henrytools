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

  const filteredTools = selectedCategory === 'all'
    ? TOOLS
    : TOOLS.filter((t) => t.category === selectedCategory);

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </main>
  );
}
