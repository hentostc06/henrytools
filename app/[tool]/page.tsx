import { notFound } from 'next/navigation';
import { DynamicPdfTool } from '../../components/DynamicPdfTool';
import { TOOLS } from '../../lib/tools-data';

export function generateStaticParams() {
  const routesWithDedicatedPages = new Set(['merge', 'split', 'compress', 'img2pdf']);
  return TOOLS
    .filter((tool) => !routesWithDedicatedPages.has(tool.id))
    .map((tool) => ({ tool: tool.id }));
}

export default function ToolPage({ params }: { params: { tool: string } }) {
  const tool = TOOLS.find((candidate) => candidate.id === params.tool);
  if (!tool) notFound();
  return <DynamicPdfTool tool={tool} />;
}
