"use client";

import { useState } from "react";
import { Loader2, Plus, Sparkles, X } from "lucide-react";
import { PRESET_STACKS } from "@/lib/constants";
import type { GenerateInput } from "@/lib/schema";

interface Props {
  generating: boolean;
  loadingLabel: string;
  onGenerate: (input: GenerateInput) => void;
}

export default function InputForm({ generating, loadingLabel, onGenerate }: Props) {
  const [projectName, setProjectName] = useState("");
  const [stacks, setStacks] = useState<string[]>([]);
  const [customStack, setCustomStack] = useState("");
  const [features, setFeatures] = useState("");
  const [trouble, setTrouble] = useState("");

  const canGenerate = Boolean(projectName.trim() && features.trim() && stacks.length > 0);

  const toggleStack = (s: string) =>
    setStacks((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const addCustomStack = () => {
    const v = customStack.trim();
    if (v && !stacks.includes(v)) setStacks((p) => [...p, v]);
    setCustomStack("");
  };

  const handleGenerate = () => {
    if (!canGenerate || generating) return;
    onGenerate({ name: projectName.trim(), stacks, features, trouble });
  };

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 sm:p-8 shadow-2xl">
        {/* 프로젝트 이름 */}
        <label htmlFor="project-name" className="block text-sm font-semibold text-zinc-300 mb-2">
          프로젝트 이름 <span className="text-blue-400">*</span>
        </label>
        <input
          id="project-name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="예: 클라우드 비용 모니터링 대시보드"
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-blue-600 transition-colors"
        />

        {/* 기술 스택 */}
        <label className="block text-sm font-semibold text-zinc-300 mt-6 mb-2">
          사용한 기술 스택 <span className="text-blue-400">*</span>
          <span className="ml-2 text-xs font-normal text-zinc-500">{stacks.length}개 선택됨</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {PRESET_STACKS.map((s) => {
            const on = stacks.includes(s);
            return (
              <button
                key={s}
                type="button"
                onClick={() => toggleStack(s)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                  on
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-600"
                }`}
              >
                {s}
              </button>
            );
          })}
          {stacks
            .filter((s) => !(PRESET_STACKS as readonly string[]).includes(s))
            .map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => toggleStack(s)}
                className="text-xs px-3 py-1.5 rounded-full border bg-blue-600 border-blue-600 text-white flex items-center gap-1"
              >
                {s} <X className="w-3 h-3" />
              </button>
            ))}
        </div>
        <div className="flex gap-2 mt-3">
          <input
            value={customStack}
            onChange={(e) => setCustomStack(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCustomStack()}
            placeholder="직접 입력 (예: FastAPI)"
            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-blue-600 transition-colors"
          />
          <button
            type="button"
            onClick={addCustomStack}
            className="px-4 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors"
            aria-label="스택 추가"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* 핵심 기능 */}
        <label htmlFor="features" className="block text-sm font-semibold text-zinc-300 mt-6 mb-2">
          핵심 기능 요약 <span className="text-blue-400">*</span>
        </label>
        <textarea
          id="features"
          value={features}
          onChange={(e) => setFeatures(e.target.value)}
          rows={4}
          placeholder={
            "한 줄에 하나씩 적어주세요.\n예:\nAWS 비용을 실시간으로 수집해 대시보드로 시각화\n예산 초과 시 Slack 알림 발송"
          }
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-blue-600 transition-colors resize-none leading-relaxed"
        />

        {/* 트러블슈팅 */}
        <label htmlFor="trouble" className="block text-sm font-semibold text-zinc-300 mt-6 mb-2">
          트러블슈팅 경험{" "}
          <span className="text-xs font-normal text-zinc-500">
            (선택 — 채우면 면접 Q&A 품질이 올라갑니다)
          </span>
        </label>
        <textarea
          id="trouble"
          value={trouble}
          onChange={(e) => setTrouble(e.target.value)}
          rows={3}
          placeholder="예: Lambda 콜드스타트로 응답이 3초 이상 걸리는 문제를 프로비저닝된 동시성 설정으로 해결"
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-blue-600 transition-colors resize-none leading-relaxed"
        />

        {/* CTA */}
        <button
          type="button"
          onClick={handleGenerate}
          disabled={!canGenerate || generating}
          className={`mt-7 w-full rounded-xl py-3.5 text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            canGenerate && !generating
              ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg"
              : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
          }`}
        >
          {generating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> {loadingLabel}
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" /> 문서 3종 자동 생성하기
            </>
          )}
        </button>
        {!canGenerate && (
          <p className="mt-2 text-center text-xs text-zinc-600">
            프로젝트 이름 · 기술 스택 · 핵심 기능은 필수 입력입니다
          </p>
        )}
      </div>
    </section>
  );
}
