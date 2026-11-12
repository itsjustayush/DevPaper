import { jsPDF } from 'jspdf';
import { toPng } from 'html-to-image';
import { PaperPreset, PageOrientation, DocumentMetadata } from '@/types';

export interface PdfExportOptions {
  paperSize: PaperPreset;
  orientation?: PageOrientation;
  fileName?: string;
  metadata?: Partial<DocumentMetadata>;
  pixelRatio?: number;
  onProgress?: (current: number, total: number) => void;
}

/**
 * Multi-Page Vector/High-DPI PDF Exporter
 * 
 * Generates exact physical dimension PDF documents matching A4, Letter, A3, etc.
 * without degradation, scaling each paginated sheet to its native millimeter bounds.
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
    pixelRatio = 2.5,
    onProgress,
  } = options;

  if (pageElements.length === 0) {
    throw new Error('No pages provided for PDF export.');
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
    creator: 'DevPaper (https://github.com/meta/astryx + ray.so engine)',
  });

  const total = pageElements.length;

  for (let i = 0; i < total; i++) {
    if (i > 0) {
      pdf.addPage([widthMm, heightMm], orientation);
    }

    if (onProgress) {
      onProgress(i + 1, total);
    }

    const element = pageElements[i];
    const dataUrl = await toPng(element, {
      pixelRatio,
      cacheBust: true,
      style: {
        transform: 'none',
      },
    });

    // Add image with exact page dimensions
    pdf.addImage(dataUrl, 'PNG', 0, 0, widthMm, heightMm, undefined, 'FAST');
  }

  pdf.save(`${fileName}.pdf`);
  return pdf.output('blob');
}

