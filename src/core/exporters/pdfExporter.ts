import { jsPDF } from 'jspdf';
import { toJpeg } from 'html-to-image';
import { PaperPreset, PageOrientation, DocumentMetadata } from '@/types';
import { downloadBlob, yieldToEventLoop, FAST_EXPORT_OPTIONS } from './downloadHelper';

export interface PdfExportOptions {
  paperSize: PaperPreset;
  orientation?: PageOrientation;
  fileName?: string;
  metadata?: Partial<DocumentMetadata>;
  pixelRatio?: number;
  onProgress?: (current: number, total: number) => void;
}

/**
 * Ultra-Fast Non-Blocking Multi-Page PDF Exporter
 * 
 * Uses chunked event-loop yielding and native JPEG stream embedding in jsPDF.
 * Eliminates browser thread freezes ("Page Unresponsive") and renders
 * long multi-page documents (15-50+ pages) smoothly in real-time.
 */
export async function exportElementsAsPdf(
  pageElements: HTMLElement[],
  options: PdfExportOptions
): Promise<Blob> {
  const {
    paperSize,
    orientation = 'portrait',
    fileName = 'devpaper-document',
    metadata = {},
    pixelRatio = 2,
    onProgress,
  } = options;

  if (pageElements.length === 0) {
    throw new Error('No pages provided for PDF export.');
  }

  if (typeof document !== 'undefined' && 'fonts' in document) {
    await document.fonts.ready;
  }

  // Calculate millimeter dimensions
  let widthMm = paperSize.widthMm || (paperSize.widthPx * 25.4) / paperSize.dpi;
  let heightMm = paperSize.heightMm || (paperSize.heightPx * 25.4) / paperSize.dpi;

  if (orientation === 'landscape' && widthMm < heightMm) {
    const temp = widthMm;
    widthMm = heightMm;
    heightMm = temp;
  } else if (orientation === 'portrait' && widthMm > heightMm) {
    const temp = widthMm;
    widthMm = heightMm;
    heightMm = temp;
  }

  const pdf = new jsPDF({
    orientation,
    unit: 'mm',
    format: [widthMm, heightMm],
    compress: true,
  });

  pdf.setProperties({
    title: metadata.title || fileName,
    author: metadata.author || 'DevPaper',
    subject: 'Code Typesetting Document',
    creator: 'DevPaper (https://github.com/DevPaper/devpaper)',
  });

  const total = pageElements.length;

  // Process pages sequentially with event-loop yielding to guarantee 60fps UI responsiveness
  for (let i = 0; i < total; i++) {
    // Yield to the browser event loop so Chrome stays responsive
    await yieldToEventLoop();

    if (onProgress) {
      onProgress(i + 1, total);
    }

    const element = pageElements[i];

    // toJpeg at 0.95 quality embeds directly into PDF via DCT stream with zero JS re-compression overhead
    const dataUrl = await toJpeg(element, {
      ...FAST_EXPORT_OPTIONS,
      quality: 0.95,
      pixelRatio,
    });

    if (i > 0) {
      pdf.addPage([widthMm, heightMm], orientation);
    }

    // Embed image into page
    pdf.addImage(dataUrl, 'JPEG', 0, 0, widthMm, heightMm, undefined, 'FAST');
  }

  // Final yield before PDF assembly and download
  await yieldToEventLoop();

  const blob = pdf.output('blob');
  downloadBlob(blob, `${fileName}.pdf`);
  return blob;
}
