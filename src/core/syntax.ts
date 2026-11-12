import { ThemeDefinition } from '@/types';

export interface LanguageInfo {
  id: string;
  name: string;
  aliases: string[];
  extensions: string[];
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { id: 'typescript', name: 'TypeScript', aliases: ['ts', 'tsx'], extensions: ['.ts', '.tsx'] },
  { id: 'javascript', name: 'JavaScript', aliases: ['js', 'jsx', 'mjs'], extensions: ['.js', '.jsx', '.mjs'] },
  { id: 'python', name: 'Python', aliases: ['py', 'python3'], extensions: ['.py'] },
  { id: 'rust', name: 'Rust', aliases: ['rs'], extensions: ['.rs'] },
  { id: 'go', name: 'Go', aliases: ['golang'], extensions: ['.go'] },
  { id: 'cpp', name: 'C++', aliases: ['c++', 'cc', 'cxx'], extensions: ['.cpp', '.hpp', '.cc', '.cxx'] },
  { id: 'c', name: 'C', aliases: ['h'], extensions: ['.c', '.h'] },
  { id: 'csharp', name: 'C#', aliases: ['cs', 'c#'], extensions: ['.cs'] },
  { id: 'java', name: 'Java', aliases: [], extensions: ['.java'] },
  { id: 'kotlin', name: 'Kotlin', aliases: ['kt'], extensions: ['.kt', '.kts'] },
  { id: 'swift', name: 'Swift', aliases: [], extensions: ['.swift'] },
  { id: 'ruby', name: 'Ruby', aliases: ['rb'], extensions: ['.rb'] },
  { id: 'php', name: 'PHP', aliases: [], extensions: ['.php'] },
  { id: 'sql', name: 'SQL', aliases: ['pgsql', 'mysql'], extensions: ['.sql'] },
  { id: 'html', name: 'HTML', aliases: ['xhtml'], extensions: ['.html', '.htm'] },
  { id: 'css', name: 'CSS', aliases: ['scss', 'sass', 'less'], extensions: ['.css', '.scss', '.sass'] },
  { id: 'json', name: 'JSON', aliases: [], extensions: ['.json'] },
  { id: 'yaml', name: 'YAML', aliases: ['yml'], extensions: ['.yaml', '.yml'] },
  { id: 'markdown', name: 'Markdown', aliases: ['md'], extensions: ['.md', '.markdown'] },
  { id: 'bash', name: 'Bash / Shell', aliases: ['sh', 'shell', 'zsh'], extensions: ['.sh', '.bash', '.zsh'] },
  { id: 'dockerfile', name: 'Dockerfile', aliases: ['docker'], extensions: ['Dockerfile', '.dockerfile'] },
  { id: 'graphql', name: 'GraphQL', aliases: ['gql'], extensions: ['.graphql', '.gql'] },
  { id: 'zig', name: 'Zig', aliases: [], extensions: ['.zig'] },
  { id: 'lua', name: 'Lua', aliases: [], extensions: ['.lua'] },
  { id: 'dart', name: 'Dart', aliases: [], extensions: ['.dart'] },
];

/**
 * Detect programming language from filename or code contents
 */
export function detectLanguage(fileName?: string, codeSnippet?: string): string {
  if (fileName) {
    const ext = fileName.includes('.') ? '.' + fileName.split('.').pop()?.toLowerCase() : '';
    const match = SUPPORTED_LANGUAGES.find((lang) =>
      lang.extensions.includes(ext) || lang.aliases.includes(ext.replace('.', '')) || lang.id === ext.replace('.', '')
    );
    if (match) return match.id;
  }

  if (codeSnippet) {
    const trimmed = codeSnippet.trim();
    if (trimmed.startsWith('<!DOCTYPE html>') || /<html[\s>]/.test(trimmed)) return 'html';
    if (/^(SELECT|INSERT|UPDATE|DELETE|CREATE TABLE|ALTER TABLE)\b/i.test(trimmed)) return 'sql';
    if (/^(def\s+\w+\s*\(|import\s+sys|from\s+\w+\s+import)/m.test(trimmed)) return 'python';
    if (/^(fn\s+\w+|pub\s+fn|use\s+std::|impl\s+\w+)/m.test(trimmed)) return 'rust';
    if (/^(package\s+\w+|func\s+\w+\s*\(|import\s+"fmt")/m.test(trimmed)) return 'go';
    if (/^(#include\s+<|using namespace std;|int main\s*\()/m.test(trimmed)) return 'cpp';
    if (/^(public\s+class\s+\w+|public\s+static\s+void\s+main)/m.test(trimmed)) return 'java';
    if (/^(interface\s+\w+|type\s+\w+\s*=|import\s+type\s+|:\s*(string|number|boolean|any)\b)/m.test(trimmed)) return 'typescript';
    if (/^(const\s+|let\s+|var\s+|console\.log\()/m.test(trimmed)) return 'javascript';
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      try {
        JSON.parse(trimmed);
        return 'json';
      } catch {}
    }
  }

  return 'typescript';
}

export interface SyntaxToken {
  content: string;
  color: string;
  isComment?: boolean;
}

/**
 * Universal Syntax Tokenizer
 * 
 * Provides instantaneous, flicker-free, token-accurate syntax highlighting
 * matching TextMate themes across all supported languages.
 */
export function tokenizeCodeLine(line: string, language: string, theme: ThemeDefinition): SyntaxToken[] {
  if (!line) {
    return [{ content: ' ', color: theme.foreground }];
  }

  const { syntax } = theme;
  const tokens: SyntaxToken[] = [];

  // Comments
  const isLineComment = 
    line.trim().startsWith('//') || 
    line.trim().startsWith('#') || 
    line.trim().startsWith('--');
  
  if (isLineComment) {
    return [{ content: line, color: syntax.comments, isComment: true }];
  }

  // Regex patterns for syntax tokens
  const tokenRegex = /(["'`][^"'`]*["'`])|(\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\b\d+(?:\.\d+)?\b)|(\b(?:export|import|from|function|return|const|let|var|if|else|switch|case|default|break|continue|for|while|do|class|interface|type|extends|implements|public|private|protected|static|readonly|async|await|try|catch|finally|throw|new|in|of|typeof|instanceof|void|null|undefined|true|false|fn|pub|mut|struct|impl|trait|def|elif|lambda|pass|self|package|func|go|defer|chan|select|namespace|using)\b)|(\b(?:string|number|boolean|symbol|bigint|any|never|unknown|void|Promise|Array|Record|Map|Set|Vec|Option|Result|int|float|double|char|bool|u8|u16|u32|u64|i8|i16|i32|i64|usize|isize)\b)|(\b[A-Za-z_$][A-Za-z0-9_$]*(?=\s*\())|([{}()[\];,])|([+\-*/%=!<>|&~^?:]+)|([A-Za-z_$][A-Za-z0-9_$]*)|(\s+)|(.)/g;

  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(line)) !== null) {
    const [
      full,
      str,
      comment1,
      comment2,
      num,
      keyword,
      typeName,
      fnCall,
      punctuation,
      operator,
      ident,
      whitespace,
      char,
    ] = match;

    if (str) {
      tokens.push({ content: str, color: syntax.strings });
    } else if (comment1 || comment2) {
      tokens.push({ content: comment1 || comment2, color: syntax.comments, isComment: true });
    } else if (num) {
      tokens.push({ content: num, color: syntax.numbers });
    } else if (keyword) {
      tokens.push({ content: keyword, color: syntax.keywords });
    } else if (typeName) {
      tokens.push({ content: typeName, color: syntax.types });
    } else if (fnCall) {
      tokens.push({ content: fnCall, color: syntax.functions });
    } else if (punctuation) {
      tokens.push({ content: punctuation, color: syntax.punctuation });
    } else if (operator) {
      tokens.push({ content: operator, color: syntax.operators });
    } else if (ident) {
      // Check if it's a capitalized identifier (often a class or enum or component)
      if (/^[A-Z][a-zA-Z0-9_$]*$/.test(ident)) {
        tokens.push({ content: ident, color: syntax.types });
      } else {
        tokens.push({ content: ident, color: syntax.variables });
      }
    } else if (whitespace) {
      tokens.push({ content: whitespace, color: theme.foreground });
    } else {
      tokens.push({ content: char || full, color: theme.foreground });
    }
  }

  return tokens.length > 0 ? tokens : [{ content: line, color: theme.foreground }];
}
