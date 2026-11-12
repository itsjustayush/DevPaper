import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { toPng, toSvg } from 'html-to-image';

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
 * Multi-Page Sequential ZIP Archive Exporter
 */
export async function exportElementsAsZip(
  pageElements: HTMLElement[],
  options: ZipExportOptions = {}
): Promise<Blob> {
  const {
    fileName = 'devpaper-pages',
    format = 'png',
    pixelRatio = 2.5,
    onProgress,
  } = options;

  const zip = new JSZip();
  const folder = zip.folder(fileName) || zip;
  const total = pageElements.length;

  for (let i = 0; i < total; i++) {
    if (onProgress) {
      onProgress(i + 1, total);
    }

    const pageElement = pageElements[i];
    const pageIndexStr = String(i + 1).padStart(2, '0');

    if (format === 'svg') {
      const dataUrl = await toSvg(pageElement, {
        cacheBust: true,
        style: { transform: 'none' },
      });
      const svgText = decodeURIComponent(dataUrl.replace(/^data:image\/svg\+xml;charset=utf-8,/, ''));
      folder.file(`${fileName}-page-${pageIndexStr}.svg`, svgText);
    } else {
      const dataUrl = await toPng(pageElement, {
        pixelRatio,
        cacheBust: true,
        style: { transform: 'none' },
      });
      const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
      folder.file(`${fileName}-page-${pageIndexStr}.png`, base64Data, { base64: true });
    }
  }

  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, `${fileName}.zip`);
  return content;
}

/**
 * Multi-File Project ZIP Exporter
 * 
 * Archives multiple source files and their respective rendered sheets into structured directories.
 */
export async function exportProjectAsZip(
  files: FileArchiveItem[],
  zipName: string = 'devpaper-project',
  pixelRatio: number = 2.5
): Promise<Blob> {
  const zip = new JSZip();

  for (const fileItem of files) {
    const fileFolder = zip.folder(fileItem.fileName) || zip;
    for (let i = 0; i < fileItem.pageElements.length; i++) {
      const pageIndexStr = String(i + 1).padStart(2, '0');
      const dataUrl = await toPng(fileItem.pageElements[i], {
        pixelRatio,
        cacheBust: true,
        style: { transform: 'none' },
      });
      const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
      fileFolder.file(`${fileItem.fileName}-page-${pageIndexStr}.png`, base64Data, { base64: true });
    }
  }

  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, `${zipName}.zip`);
  return content;
}

