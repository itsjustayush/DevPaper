import { toPng, toJpeg, toBlob } from 'html-to-image';
import { saveAs } from 'file-saver';

export interface ImageExportOptions {
  pixelRatio?: number;
  quality?: number;
  backgroundColor?: string;
  fileName?: string;
  format?: 'png' | 'jpeg';
}

/**
 * High-DPI Image Exporter (PNG / JPEG)
 */
export async function exportElementAsImage(
  element: HTMLElement,
  options: ImageExportOptions = {}
): Promise<string> {
  const {
    pixelRatio = 2,
    quality = 0.95,
    backgroundColor,
    fileName = 'devpaper-snippet',
    format = 'png',
  } = options;

  const exportOptions = {
    pixelRatio,
    quality,
    backgroundColor: backgroundColor || undefined,
    cacheBust: true,
    style: {
      transform: 'none',
    },
  };

  let dataUrl: string;

  if (format === 'jpeg') {
    dataUrl = await toJpeg(element, exportOptions);
    saveAs(dataUrl, `${fileName}.jpg`);
  } else {
    dataUrl = await toPng(element, exportOptions);
    saveAs(dataUrl, `${fileName}.png`);
  }

  return dataUrl;
}

/**
 * Copy High-DPI PNG Image directly to system clipboard
 */
export async function copyImageToClipboard(
  element: HTMLElement,
  pixelRatio: number = 2
): Promise<boolean> {
  try {
    const blob = await toBlob(element, {
      pixelRatio,
      cacheBust: true,
      style: {
        transform: 'none',
      },
    });

    if (!blob) {
      throw new Error('Failed to generate image blob for clipboard.');
    }

    if (navigator.clipboard && typeof ClipboardItem !== 'undefined') {
      const item = new ClipboardItem({ 'image/png': blob });
      await navigator.clipboard.write([item]);
      return true;
    } else {
      throw new Error('Clipboard API with ClipboardItem is not supported on this browser.');
    }
  } catch (err) {
    console.error('Failed to copy image to clipboard:', err);
    throw err;
  }
}

