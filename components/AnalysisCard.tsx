"use client";

import { useState } from "react";
import { AlertTriangle, ChevronDown, Loader2, ShieldCheck } from "lucide-react";

interface Props {
  /** 스트리밍 중에는 항목이 부분적으로만 담길 수 있다 */
  strengths?: (string | undefined)[];
  gaps?: (string | undefined)[];
  streaming: boolean;
}

/** 결과 화면 상단(탭 위)에 표시되는 포트폴리오 진단 카드 — 접기 가능, 기본 펼침 */
export default function AnalysisCard({ strengths, gaps, streaming }: Props) {
  const [open, setOpen] = useState(true);

  const strengthItems = (strengths ?? []).filter((s): s is string => Boolean(s));
  const gapItems = (gaps ?? []).filter((g): g is string => Boolean(g));
  // 스트리밍이 끝났고 gaps가 비어 있을 때만 "보완점 없음" 확정 표시
  const noGaps = !streaming && gapItems.length === 0;

  return (
    <div className="mb-6 rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden shadow-2xl">
      {/* 헤더 (토글) */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-zinc-800/40 transition-colors"
      >
        <span className="text-sm font-bold text-white flex items-center gap-2">
          🔍 포트폴리오 진단
          {streaming && strengthItems.length === 0 && (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-400" />
          )}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-zinc-500 transition-transform ${open ? "" : "-rotate-90"}`}
        />
      </button>

      {open && (
        <div className="px-5 pb-5 grid gap-5 sm:grid-cols-2">
          {/* 어필 포인트 */}
          <div>
            <p className="text-xs font-bold text-emerald-400 mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> 💪 어필 포인트
            </p>
            <ul className="space-y-2">
              {strengthItems.map((s, i) => (
                <li key={i} className="flex gap-2 text-sm text-zinc-300 leading-relaxed">
                  <span className="text-emerald-400 mt-0.5 select-none">✓</span>
                  <span>{s}</span>
                </li>
              ))}
              {strengthItems.length === 0 && (
                <li className="text-sm text-zinc-600">진단 중...</li>
              )}
            </ul>
          </div>

          {/* 보완점 */}
          <div>
            <p className="text-xs font-bold text-amber-400 mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" /> ⚠️ 보완하면 좋을 3가지
            </p>
            {noGaps ? (
              <p className="text-sm text-zinc-400">
                보완점 없음 — 탄탄한 프로젝트입니다 🎉
              </p>
            ) : (
              <ul className="space-y-2">
                {gapItems.map((g, i) => (
                  <li key={i} className="flex gap-2 text-sm text-zinc-300 leading-relaxed">
                    <span className="text-amber-400 mt-0.5 select-none">{i + 1}.</span>
                    <span>{g}</span>
                  </li>
                ))}
                {gapItems.length === 0 && (
                  <li className="text-sm text-zinc-600">진단 중...</li>
                )}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
