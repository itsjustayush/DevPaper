import { toSvg } from 'html-to-image';
import { downloadBlob, FAST_EXPORT_OPTIONS } from './downloadHelper';

export interface SvgExportOptions {
  fileName?: string;
  backgroundColor?: string;
}

/**
 * Ultra-Fast Lossless SVG Exporter
 */
export async function exportElementAsSvg(
  element: HTMLElement,
  options: SvgExportOptions = {}
): Promise<string> {
  const { fileName = 'devpaper-snippet', backgroundColor } = options;

  if (typeof document !== 'undefined' && 'fonts' in document) {
    await document.fonts.ready;
  }

  const dataUrl = await toSvg(element, {
    ...FAST_EXPORT_OPTIONS,
    backgroundColor: backgroundColor || undefined,
  });

  // Extract clean SVG text
  const svgContent = decodeURIComponent(dataUrl.replace(/^data:image\/svg\+xml;charset=utf-8,/, ''));
  const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
  downloadBlob(blob, `${fileName}.svg`);

  return dataUrl;
}
