import { toSvg } from 'html-to-image';
import { saveAs } from 'file-saver';

export interface SvgExportOptions {
  fileName?: string;
  backgroundColor?: string;
}

/**
 * Lossless SVG Exporter
 */
export async function exportElementAsSvg(
  element: HTMLElement,
  options: SvgExportOptions = {}
): Promise<string> {
  const { fileName = 'devpaper-snippet', backgroundColor } = options;

  const dataUrl = await toSvg(element, {
    backgroundColor: backgroundColor || undefined,
    cacheBust: true,
    style: {
      transform: 'none',
    },
  });

  // Convert data URL to Blob for clean SVG download
  const svgContent = decodeURIComponent(dataUrl.replace(/^data:image\/svg\+xml;charset=utf-8,/, ''));
  const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
  saveAs(blob, `${fileName}.svg`);

  return dataUrl;
}
