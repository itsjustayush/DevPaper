import JSZip from 'jszip';
import { toBlob, toSvg } from 'html-to-image';
import { downloadBlob, yieldToEventLoop, FAST_EXPORT_OPTIONS } from './downloadHelper';

export interface ZipExportOptions {
  fileName?: string;
  format?: 'png' | 'svg';
  pixelRatio?: number;
  onProgress?: (current: number, total: number) => void;
}

export interface FileArchiveItem {
  fileName: string;
  pageElements: HTMLElement[];
}

/**
 * Ultra-Fast Non-Blocking Sequential ZIP Archive Exporter
 * 
 * Uses chunked event-loop yielding and instant 'STORE' binary packaging.
 */
export async function exportElementsAsZip(
  pageElements: HTMLElement[],
  options: ZipExportOptions = {}
): Promise<Blob> {
  const {
    fileName = 'devpaper-pages',
    format = 'png',
    pixelRatio = 2,
    onProgress,
  } = options;

  if (typeof document !== 'undefined' && 'fonts' in document) {
    await document.fonts.ready;
  }

  const zip = new JSZip();
  const folder = zip.folder(fileName) || zip;
  const total = pageElements.length;

  for (let i = 0; i < total; i++) {
    // Yield to browser event loop
    await yieldToEventLoop();

    if (onProgress) {
      onProgress(i + 1, total);
    }

    const pageElement = pageElements[i];
    const pageIndexStr = String(i + 1).padStart(2, '0');

    if (format === 'svg') {
      const dataUrl = await toSvg(pageElement, FAST_EXPORT_OPTIONS);
      const svgText = decodeURIComponent(dataUrl.replace(/^data:image\/svg\+xml;charset=utf-8,/, ''));
      folder.file(`${fileName}-page-${pageIndexStr}.svg`, svgText);
    } else {
      const blob = await toBlob(pageElement, {
        ...FAST_EXPORT_OPTIONS,
        pixelRatio,
      });
      if (blob) {
        folder.file(`${fileName}-page-${pageIndexStr}.png`, blob);
      }
    }
  }

  await yieldToEventLoop();

  // Fast ZIP creation: PNGs are already compressed, so STORE is virtually instant (<20ms)
  const content = await zip.generateAsync({
    type: 'blob',
    compression: 'STORE',
  });

  downloadBlob(content, `${fileName}.zip`);
  return content;
}

/**
 * Multi-File Project ZIP Exporter
 */
export async function exportProjectAsZip(
  files: FileArchiveItem[],
  zipName: string = 'devpaper-project',
  pixelRatio: number = 2
): Promise<Blob> {
  if (typeof document !== 'undefined' && 'fonts' in document) {
    await document.fonts.ready;
  }

  const zip = new JSZip();

  for (const fileItem of files) {
    const fileFolder = zip.folder(fileItem.fileName) || zip;
    for (let i = 0; i < fileItem.pageElements.length; i++) {
      await yieldToEventLoop();
      const pageIndexStr = String(i + 1).padStart(2, '0');
      const blob = await toBlob(fileItem.pageElements[i], {
        ...FAST_EXPORT_OPTIONS,
        pixelRatio,
      });
      if (blob) {
        fileFolder.file(`${fileItem.fileName}-page-${pageIndexStr}.png`, blob);
      }
    }
  }

  await yieldToEventLoop();

  const content = await zip.generateAsync({
    type: 'blob',
    compression: 'STORE',
  });

  downloadBlob(content, `${zipName}.zip`);
  return content;
}
