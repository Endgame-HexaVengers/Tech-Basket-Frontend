"use client";

import React, { useState } from "react";
import { Check, Copy, ExternalLink, Terminal } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

// -------------------------------------------------------------
// Safe Link Sanitizer
// -------------------------------------------------------------
function isSafeUrl(url: string): boolean {
  try {
    const trimmed = url.trim().toLowerCase();
    if (trimmed.startsWith("javascript:") || trimmed.startsWith("data:") || trimmed.startsWith("vbscript:")) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

// -------------------------------------------------------------
// Syntax Highlighting Tokens
// -------------------------------------------------------------
const KEYWORDS = new Set([
  "const", "let", "var", "function", "return", "import", "export", "default",
  "from", "class", "extends", "if", "else", "switch", "case", "break",
  "for", "while", "do", "try", "catch", "finally", "throw", "new", "this",
  "async", "await", "yield", "typeof", "instanceof", "void", "true", "false",
  "null", "undefined", "interface", "type", "enum", "implements", "public",
  "private", "protected", "readonly", "as", "any", "string", "number", "boolean",
  // SQL
  "SELECT", "FROM", "WHERE", "INSERT", "INTO", "UPDATE", "DELETE", "JOIN",
  "LEFT", "RIGHT", "INNER", "OUTER", "GROUP", "BY", "ORDER", "HAVING", "LIMIT",
  "select", "from", "where", "insert", "into", "update", "delete", "join",
]);

function highlightCodeLine(line: string): React.ReactNode[] {
  // Regex to split line into comments, strings, words/identifiers, and symbols
  const tokenRegex = /(\/\/[^\n]*|\/\*.*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\b[a-zA-Z_]\w*\b|[0-9]+(?:\.[0-9]+)?|[{}()[\],;:.=+\-*/%&|^!<>?~])/g;
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(line.slice(lastIndex, match.index));
    }

    const token = match[0];

    if (token.startsWith("//") || token.startsWith("/*")) {
      nodes.push(
        <span key={match.index} className="text-slate-400 dark:text-slate-500 italic">
          {token}
        </span>
      );
    } else if (
      (token.startsWith('"') && token.endsWith('"')) ||
      (token.startsWith("'") && token.endsWith("'")) ||
      (token.startsWith("`") && token.endsWith("`"))
    ) {
      nodes.push(
        <span key={match.index} className="text-emerald-600 dark:text-emerald-400">
          {token}
        </span>
      );
    } else if (/^[0-9]+(?:\.[0-9]+)?$/.test(token)) {
      nodes.push(
        <span key={match.index} className="text-amber-600 dark:text-amber-400">
          {token}
        </span>
      );
    } else if (KEYWORDS.has(token)) {
      nodes.push(
        <span key={match.index} className="text-purple-600 dark:text-purple-400 font-medium">
          {token}
        </span>
      );
    } else {
      nodes.push(token);
    }

    lastIndex = match.index + token.length;
  }

  if (lastIndex < line.length) {
    nodes.push(line.slice(lastIndex));
  }

  return nodes.length > 0 ? nodes : [line];
}

// -------------------------------------------------------------
// Code Block Component with Copy Button
// -------------------------------------------------------------
function CodeBlock({ code, language }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const lines = code.split("\n");

  return (
    <div className="my-3 overflow-hidden rounded-xl border border-slate-700/80 bg-slate-900 text-slate-100 shadow-md">
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/70 px-3.5 py-2 text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <Terminal size={14} className="text-cyan-400" />
          <span className="font-mono font-medium lowercase">
            {language || "code"}
          </span>
        </div>
        <button
          type="button"
          onClick={copyToClipboard}
          className="flex items-center gap-1.5 rounded-lg border border-slate-700/60 bg-slate-800/80 px-2.5 py-1 text-[11px] font-medium text-slate-300 transition hover:bg-slate-700 hover:text-white"
          aria-label="Copy code to clipboard"
        >
          {copied ? (
            <>
              <Check size={12} className="text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="overflow-x-auto p-3.5 font-mono text-[12.5px] leading-relaxed">
        <pre className="m-0">
          <code>
            {lines.map((line, idx) => (
              <div key={idx} className="table-row">
                <span className="table-cell select-none pr-4 text-right text-xs text-slate-600">
                  {idx + 1}
                </span>
                <span className="table-cell">
                  {highlightCodeLine(line)}
                </span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Inline Text Formatter
// -------------------------------------------------------------
function renderInlineFormatting(text: string): React.ReactNode {
  // Regex to match inline code, bold, italic, strikethrough, links
  const pattern = /(`[^`]+`|\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*|_[^_]+_|~~[^~]+~~|\[[^\]]+\]\([^)]+\))/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];

    // Inline code
    if (token.startsWith("`") && token.endsWith("`")) {
      parts.push(
        <code
          key={match.index}
          className="rounded-md border border-slate-200 bg-slate-100 px-1.5 py-0.5 font-mono text-[12px] font-medium text-pink-600 dark:border-slate-700 dark:bg-slate-800/80 dark:text-pink-400"
        >
          {token.slice(1, -1)}
        </code>
      );
    }
    // Bold
    else if (
      (token.startsWith("**") && token.endsWith("**")) ||
      (token.startsWith("__") && token.endsWith("__"))
    ) {
      parts.push(
        <strong key={match.index} className="font-semibold text-slate-900 dark:text-white">
          {token.slice(2, -2)}
        </strong>
      );
    }
    // Italic
    else if (
      (token.startsWith("*") && token.endsWith("*")) ||
      (token.startsWith("_") && token.endsWith("_"))
    ) {
      parts.push(
        <em key={match.index} className="italic text-slate-800 dark:text-slate-200">
          {token.slice(1, -1)}
        </em>
      );
    }
    // Strikethrough
    else if (token.startsWith("~~") && token.endsWith("~~")) {
      parts.push(
        <del key={match.index} className="line-through text-slate-400">
          {token.slice(2, -2)}
        </del>
      );
    }
    // Links [title](url)
    else if (token.startsWith("[") && token.includes("](")) {
      const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) {
        const linkTitle = linkMatch[1];
        const linkUrl = linkMatch[2];
        if (isSafeUrl(linkUrl)) {
          parts.push(
            <a
              key={match.index}
              href={linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-cyan-600 underline underline-offset-2 transition hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300"
            >
              <span>{linkTitle}</span>
              <ExternalLink size={11} className="inline opacity-80" />
            </a>
          );
        } else {
          parts.push(linkTitle);
        }
      } else {
        parts.push(token);
      }
    } else {
      parts.push(token);
    }

    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

// -------------------------------------------------------------
// Markdown Table Renderer
// -------------------------------------------------------------
function MarkdownTable({ lines }: { lines: string[] }) {
  if (lines.length < 2) return null;

  const headerCells = lines[0]
    .split("|")
    .map((c) => c.trim())
    .filter((_, idx, arr) => idx > 0 && idx < arr.length - 1 || arr.length === 1);

  // Check if second line is separator like |---|---|
  const separatorLine = lines[1];
  const hasSeparator = separatorLine.includes("-") && separatorLine.includes("|");
  const dataRowStart = hasSeparator ? 2 : 1;

  const bodyRows = lines.slice(dataRowStart).map((row) =>
    row
      .split("|")
      .map((c) => c.trim())
      .filter((_, idx, arr) => idx > 0 && idx < arr.length - 1 || arr.length === 1)
  );

  return (
    <div className="my-3 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <table className="w-full text-left text-xs">
        <thead className="border-b border-slate-200 bg-slate-50 font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200">
          <tr>
            {headerCells.map((head, i) => (
              <th key={i} className="px-3.5 py-2.5">
                {renderInlineFormatting(head)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-700 dark:divide-slate-800 dark:text-slate-300">
          {bodyRows.map((cells, rowIdx) => (
            <tr
              key={rowIdx}
              className={rowIdx % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-slate-50/50 dark:bg-slate-800/30"}
            >
              {cells.map((cell, cellIdx) => (
                <td key={cellIdx} className="px-3.5 py-2 whitespace-nowrap">
                  {renderInlineFormatting(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// -------------------------------------------------------------
// Master Markdown Parser & Renderer
// -------------------------------------------------------------
export default function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  if (!content) return null;

  const rawLines = content.split("\n");
  const blocks: React.ReactNode[] = [];

  let i = 0;
  while (i < rawLines.length) {
    const line = rawLines[i];
    const trimmed = line.trim();

    // 1. Code Block (```lang)
    if (trimmed.startsWith("```")) {
      const language = trimmed.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < rawLines.length && !rawLines[i].trim().startsWith("```")) {
        codeLines.push(rawLines[i]);
        i++;
      }
      blocks.push(
        <CodeBlock
          key={`code-${blocks.length}`}
          code={codeLines.join("\n")}
          language={language}
        />
      );
      i++; // Skip closing ```
      continue;
    }

    // 2. Table Block (lines starting with |)
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      const tableLines: string[] = [];
      while (i < rawLines.length && rawLines[i].trim().startsWith("|") && rawLines[i].trim().endsWith("|")) {
        tableLines.push(rawLines[i]);
        i++;
      }
      blocks.push(
        <MarkdownTable
          key={`table-${blocks.length}`}
          lines={tableLines}
        />
      );
      continue;
    }

    // 3. Blockquote (> ...)
    if (trimmed.startsWith("> ")) {
      const quoteLines: string[] = [];
      while (i < rawLines.length && rawLines[i].trim().startsWith("> ")) {
        quoteLines.push(rawLines[i].trim().slice(2));
        i++;
      }
      blocks.push(
        <blockquote
          key={`quote-${blocks.length}`}
          className="my-2.5 rounded-r-xl border-l-4 border-cyan-500 bg-cyan-50/60 px-3.5 py-2 text-xs italic text-slate-700 dark:border-cyan-400 dark:bg-cyan-950/20 dark:text-slate-300"
        >
          {quoteLines.map((qLine, qIdx) => (
            <p key={qIdx} className={qIdx > 0 ? "mt-1" : ""}>
              {renderInlineFormatting(qLine)}
            </p>
          ))}
        </blockquote>
      );
      continue;
    }

    // 4. Headings
    if (trimmed.startsWith("#### ")) {
      blocks.push(
        <h4 key={`h4-${blocks.length}`} className="mt-3 mb-1 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
          {renderInlineFormatting(trimmed.slice(5))}
        </h4>
      );
      i++;
      continue;
    }
    if (trimmed.startsWith("### ")) {
      blocks.push(
        <h3 key={`h3-${blocks.length}`} className="mt-3.5 mb-1.5 text-sm font-bold text-slate-900 dark:text-white">
          {renderInlineFormatting(trimmed.slice(4))}
        </h3>
      );
      i++;
      continue;
    }
    if (trimmed.startsWith("## ")) {
      blocks.push(
        <h2 key={`h2-${blocks.length}`} className="mt-4 mb-2 text-base font-bold text-slate-900 dark:text-white">
          {renderInlineFormatting(trimmed.slice(3))}
        </h2>
      );
      i++;
      continue;
    }
    if (trimmed.startsWith("# ")) {
      blocks.push(
        <h1 key={`h1-${blocks.length}`} className="mt-4 mb-2 text-lg font-bold text-slate-900 dark:text-white">
          {renderInlineFormatting(trimmed.slice(2))}
        </h1>
      );
      i++;
      continue;
    }

    // 5. Horizontal Divider
    if (trimmed === "---" || trimmed === "***" || trimmed === "___") {
      blocks.push(
        <hr key={`hr-${blocks.length}`} className="my-3 border-slate-200 dark:border-slate-700" />
      );
      i++;
      continue;
    }

    // 6. Unordered List (- or * or +)
    if (/^[-*+]\s+/.test(trimmed)) {
      const listItems: string[] = [];
      while (i < rawLines.length && /^[-*+]\s+/.test(rawLines[i].trim())) {
        listItems.push(rawLines[i].trim().replace(/^[-*+]\s+/, ""));
        i++;
      }
      blocks.push(
        <ul key={`ul-${blocks.length}`} className="my-2 space-y-1.5 pl-1 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
          {listItems.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-500 dark:bg-cyan-400" />
              <div className="flex-1">{renderInlineFormatting(item)}</div>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // 7. Numbered List (1. 2. etc.)
    if (/^\d+\.\s+/.test(trimmed)) {
      const listItems: { num: string; text: string }[] = [];
      while (i < rawLines.length && /^\d+\.\s+/.test(rawLines[i].trim())) {
        const itemLine = rawLines[i].trim();
        const numMatch = itemLine.match(/^(\d+)\.\s+(.*)$/);
        if (numMatch) {
          listItems.push({ num: numMatch[1], text: numMatch[2] });
        }
        i++;
      }
      blocks.push(
        <ol key={`ol-${blocks.length}`} className="my-2 space-y-1.5 pl-1 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
          {listItems.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="font-semibold text-cyan-600 dark:text-cyan-400">
                {item.num}.
              </span>
              <div className="flex-1">{renderInlineFormatting(item.text)}</div>
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // 8. Empty lines
    if (!trimmed) {
      i++;
      continue;
    }

    // 9. Standard Paragraph
    blocks.push(
      <p key={`p-${blocks.length}`} className="my-1.5 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
        {renderInlineFormatting(trimmed)}
      </p>
    );
    i++;
  }

  return <div className={`space-y-1 ${className}`}>{blocks}</div>;
}
