"use client";

import { useEffect, useRef, useState } from "react";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import SiteHeader from "@/components/SiteHeader";
import Hero from "@/components/Hero";
import InputForm from "@/components/InputForm";
import AnalysisCard from "@/components/AnalysisCard";
import ResultViewer from "@/components/ResultViewer";
import PaywallBanner from "@/components/PaywallBanner";
import { LOADING_STEPS, type TabId } from "@/lib/constants";
import { docsSchema, type GenerateInput } from "@/lib/schema";

export default function Home() {
  const [projectName, setProjectName] = useState("");
  const [activeTab, setActiveTab] = useState<TabId>("readme");
  const [freeUsed, setFreeUsed] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const resultRef = useRef<HTMLElement>(null);

  const { object, submit, isLoading, error } = useObject({
    api: "/api/generate",
    schema: docsSchema,
    onFinish: () => setFreeUsed(true),
  });

  const handleGenerate = (input: GenerateInput) => {
    setProjectName(input.name);
    setActiveTab("readme");
    submit(input);
  };

  /* 첫 청크 도착 전까지 로딩 단계 연출 */
  const waitingFirstChunk = isLoading && !object;
  useEffect(() => {
    if (!waitingFirstChunk) {
      setLoadingStep(0);
      return;
    }
    const t = setInterval(
      () => setLoadingStep((s) => Math.min(s + 1, LOADING_STEPS.length - 1)),
      420
    );
    return () => clearInterval(t);
  }, [waitingFirstChunk]);

  /* 결과 도착 시 스크롤 */
  const hasResult = Boolean(object);
  useEffect(() => {
    if (hasResult && resultRef.current)
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [hasResult]);

  return (
    <div className="min-h-screen">
      <SiteHeader freeUsed={freeUsed} />
      <Hero />
      <InputForm
        generating={isLoading}
        loadingLabel={LOADING_STEPS[loadingStep]}
        onGenerate={handleGenerate}
      />

      {error && (
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-8 -mt-10">
          <div className="rounded-xl border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-300">
            문서 생성에 실패했습니다. 잠시 후 다시 시도해주세요. ({error.message})
          </div>
        </section>
      )}

      {object && (
        <section ref={resultRef} className="max-w-4xl mx-auto px-4 sm:px-6 pb-24">
          {/* 진단 카드 — 스키마 첫 필드라 스트리밍 시 가장 먼저 채워진다 */}
          <AnalysisCard
            strengths={object.analysis?.strengths}
            gaps={object.analysis?.gaps}
            streaming={isLoading}
          />
          <ResultViewer
            projectName={projectName}
            docs={object}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            streaming={isLoading}
          />
          {freeUsed && !isLoading && <PaywallBanner />}
        </section>
      )}

      <footer className="border-t border-zinc-900 py-8 text-center text-xs text-zinc-600">
        TechDoc AI — 실서비스에서는 MOCK_MODE=false로 LLM API가 사용됩니다
      </footer>
    </div>
  );
}
