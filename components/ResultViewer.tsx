"use client";

import { useCallback, useState } from "react";
import { Check, Copy, Loader2 } from "lucide-react";
import { TABS, type TabId } from "@/lib/constants";
import Markdown from "./Markdown";

interface Props {
  projectName: string;
  /** 스트리밍 중에는 부분 문자열이 담긴다 — 도착하는 대로 렌더링 */
  docs: Partial<Record<TabId, string | undefined>>;
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  streaming: boolean;
}

export default function ResultViewer({ projectName, docs, activeTab, onTabChange, streaming }: Props) {
  const [copied, setCopied] = useState(false);
  const currentDoc = docs[activeTab] ?? "";

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(currentDoc);
    } catch {
      // clipboard API 미지원/권한 거부 시 폴백
      const ta = document.createElement("textarea");
      ta.value = currentDoc;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }, [currentDoc]);

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden shadow-2xl">
      {/* 에디터 타이틀바 */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800 bg-zinc-950">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500" />
          <span className="w-3 h-3 rounded-full bg-yellow-500" />
          <span className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <span className="ml-2 text-xs text-zinc-500 font-mono truncate">
          techdoc-ai / {projectName.toLowerCase().replace(/\s+/g, "-")}
        </span>
      </div>

      {/* 파일 탭 */}
      <div className="flex border-b border-zinc-800 bg-zinc-950 overflow-x-auto">
        {TABS.map((t) => {
          const Icon = t.icon;
          const on = activeTab === t.id;
          const arrived = (docs[t.id] ?? "").length > 0;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onTabChange(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-mono whitespace-nowrap border-r border-zinc-800 transition-colors ${
                on
                  ? "bg-zinc-900 text-white border-t-2 border-t-blue-500"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {t.file}
              {!arrived && streaming && <Loader2 className="w-3 h-3 animate-spin text-zinc-600" />}
              <span className="hidden sm:inline text-zinc-600">· {t.label}</span>
            </button>
          );
        })}
      </div>

      {/* 툴바 */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800">
        <span className="text-xs text-zinc-500 flex items-center gap-1.5">
          {streaming ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin text-blue-400" /> 생성 중...
            </>
          ) : (
            <>
              <Check className="w-3 h-3 text-emerald-400" /> 생성 완료 ·{" "}
              {currentDoc.length.toLocaleString()}자
            </>
          )}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          disabled={!currentDoc}
          className={`flex items-center gap-1.5 text-xs font-medium rounded-lg px-3 py-1.5 border transition-all ${
            copied
              ? "border-emerald-700 text-emerald-400 bg-emerald-950"
              : "border-zinc-700 text-zinc-300 hover:border-zinc-500 disabled:opacity-40"
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" /> 복사됨!
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" /> 마크다운 복사
            </>
          )}
        </button>
      </div>

      {/* 렌더링 영역 */}
      <div className="p-5 sm:p-8 min-h-96 max-h-screen overflow-y-auto">
        {currentDoc ? (
          <Markdown content={currentDoc} />
        ) : (
          <p className="text-sm text-zinc-600">이 문서는 아직 생성 중입니다...</p>
        )}
        {streaming && currentDoc && (
          <span className="inline-block w-2 h-4 bg-blue-400 animate-pulse ml-0.5 align-text-bottom" />
        )}
      </div>
    </div>
  );
}
