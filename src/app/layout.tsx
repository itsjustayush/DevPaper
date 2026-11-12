import type { Metadata } from 'next';
import './globals.css';
import { AstryxProvider } from '@/components/ui/AstryxProvider';

export const metadata: Metadata = {
  title: 'DevPaper — Code Presentation & Typesetting Studio',
  description:
    'An open-source, web-based code presentation and typesetting studio. Merging the visual polish of ray.so, Carbon, and Glyph with a document-grade pagination engine for beautiful code snippets and multi-page documents.',
  keywords: [
    'code screenshot',
    'code pagination',
    'ray.so alternative',
    'carbon alternative',
    'glyph alternative',
    'code to pdf',
    'syntax highlighter',
    'astryx',
  ],
  authors: [{ name: 'DevPaper Contributors' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-zinc-950 text-white selection:bg-emerald-500/30 selection:text-white">
        <AstryxProvider>{children}</AstryxProvider>
      </body>
    </html>
  );
}

