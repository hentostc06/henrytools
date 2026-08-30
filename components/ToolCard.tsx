import React from 'react';
import Link from 'next/link';
import { Tool } from '../types/pdf';
import { isBrowserReadyTool } from '../lib/tools-data';

export const ToolCard: React.FC<{ tool: Tool }> = ({ tool }) => {
  const ready = isBrowserReadyTool(tool.id);

  return (
    <Link
      href={tool.route}
      className="group relative bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-[#74AED4] hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
    >
      {(tool.badge || !ready) && (
        <span className={`absolute top-4 right-4 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
          ready ? 'bg-[#74AED4]/20 text-[#00558E]' : 'bg-amber-100 text-amber-700'
        }`}>
          {ready ? tool.badge : 'Perlu layanan'}
        </span>
      )}
      <div>
        <div className={`w-12 h-12 rounded-xl ${tool.iconBg} text-white flex items-center justify-center p-2.5 mb-4 shadow-sm group-hover:scale-110 transition-transform`}>
          <svg className="w-full h-full stroke-current fill-none" strokeWidth="2" viewBox="0 0 24 24" dangerouslySetInnerHTML={{ __html: tool.iconSvg }} />
        </div>
        <h3 className="font-bold text-lg text-[#002248] mb-2 group-hover:text-[#00558E] transition-colors">
          {tool.title}
        </h3>
        <p className="text-sm text-slate-500 leading-relaxed font-normal">
          {tool.description}
        </p>
      </div>
      <span className={`mt-5 text-[11px] font-bold ${ready ? 'text-emerald-600' : 'text-amber-600'}`}>
        {ready ? '● Siap dipakai di browser' : '○ Memerlukan backend atau API'}
      </span>
    </Link>
  );
};
