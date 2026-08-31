"use client";

import React from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import MarkdownErrorBoundary from "./MarkdownErrorBoundary";

/* 프로토타입의 다크 에디터 톤을 react-markdown 컴포넌트 매핑으로 재현 */
const components: Components = {
  h1: ({ children }) => (
    <h1 className="text-2xl font-bold text-white mt-2 mb-4 leading-snug">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-lg font-bold text-white mt-6 mb-2 flex items-center gap-2">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-base font-bold text-white mt-5 mb-2">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="text-zinc-300 text-sm leading-relaxed my-1.5">{children}</p>
  ),
  strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-blue-500 pl-4 my-3 text-zinc-400 italic">
      {children}
    </blockquote>
  ),
  ul: ({ children }) => <ul className="my-2 space-y-1">{children}</ul>,
  ol: ({ children }) => <ol className="my-2 space-y-1 list-decimal pl-5">{children}</ol>,
  li: ({ children }) => (
    <li className="flex gap-2 text-zinc-300 text-sm leading-relaxed">
      <span className="text-blue-400 mt-0.5 select-none">•</span>
      <span className="flex-1 min-w-0">{children}</span>
    </li>
  ),
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">
      {children}
    </a>
  ),
  img: ({ src, alt }) => (
    // README 뱃지(shields.io 등)용 — 인라인으로 흐르게
    // eslint-disable-next-line @next/next/no-img-element
    <img src={typeof src === "string" ? src : undefined} alt={alt ?? ""} className="inline-block max-w-full align-middle my-0.5 mr-1" />
  ),
  pre: ({ children }) => (
    <pre className="bg-black rounded-lg p-4 my-3 overflow-x-auto border border-zinc-800 text-sm font-mono [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-emerald-300">
      {children}
    </pre>
  ),
  code: ({ className, children }) => (
    <code
      className={`${className ?? ""} bg-zinc-800 text-blue-300 rounded px-1.5 py-0.5 text-sm font-mono`}
    >
      {children}
    </code>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto my-3">
      <table className="w-full text-sm border-collapse">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead>{children}</thead>,
  tr: ({ children }) => <tr className="border-b border-zinc-800 first:border-zinc-700">{children}</tr>,
  th: ({ children }) => (
    <th className="py-2 px-3 text-left font-semibold text-zinc-200">{children}</th>
  ),
  td: ({ children }) => <td className="py-2 px-3 text-zinc-400">{children}</td>,
  hr: () => <hr className="border-zinc-800 my-4" />,
};

interface Props {
  content: string;
}

export default function Markdown({ content }: Props) {
  return (
    <MarkdownErrorBoundary resetKey={content}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]} components={components}>
        {content}
      </ReactMarkdown>
    </MarkdownErrorBoundary>
  );
}
