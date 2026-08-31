"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import type { User } from "@supabase/supabase-js";
import SiteHeader from "@/components/SiteHeader";
import Hero from "@/components/Hero";
import InputForm from "@/components/InputForm";
import AnalysisCard from "@/components/AnalysisCard";
import LoginModal from "@/components/LoginModal";
import ResultViewer from "@/components/ResultViewer";
import PaywallBanner from "@/components/PaywallBanner";
import { LOADING_STEPS, type TabId } from "@/lib/constants";
import { docsSchema, type GenerateInput } from "@/lib/schema";
import { getBrowserSupabase } from "@/lib/supabase/client";

const AUTH_ENABLED = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home() {
  const [projectName, setProjectName] = useState("");
  const [activeTab, setActiveTab] = useState<TabId>("readme");
  const [loadingStep, setLoadingStep] = useState(0);
  const [qualityError, setQualityError] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const resultRef = useRef<HTMLElement>(null);

  /* 서버의 무료 횟수와 동기화 */
  const refreshUsage = useCallback(async () => {
    try {
      const res = await fetch("/api/usage");
      const data = await res.json();
      setRemaining(typeof data.remaining === "number" ? data.remaining : null);
    } catch {
      /* 조회 실패 시 표시만 기본값 유지 — 서버가 최종 검증 */
    }
  }, []);

  /* 세션 구독 */
  useEffect(() => {
    const supabase = getBrowserSupabase();
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      refreshUsage();
    });
    refreshUsage();
    return () => sub.subscription.unsubscribe();
  }, [refreshUsage]);

  const handleLogout = useCallback(async () => {
    await getBrowserSupabase()?.auth.signOut();
    setRemaining(null);
  }, []);

  const { object, submit, isLoading, error } = useObject({
    api: "/api/generate",
    schema: docsSchema,
    // object가 undefined면 스키마(min 800) 검증 실패 = 저품질 생성
    onFinish: ({ object: finished }) => {
      setQualityError(!finished);
      refreshUsage(); // 차감 결과를 서버 값으로 동기화 (저품질이면 차감 안 됨)
    },
    onError: () => {
      refreshUsage(); // 402 등 거절 응답 후에도 표시 동기화
    },
  });

  const handleGenerate = (input: GenerateInput) => {
    // 비로그인: 폼은 자유롭게 쓰되 생성 시점에 로그인 요구
    if (AUTH_ENABLED && !user) {
      setShowLogin(true);
      return;
    }
    setProjectName(input.name);
    setActiveTab("readme");
    setQualityError(false);
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

  const exhausted = remaining === 0;

  return (
    <div className="min-h-screen">
      <SiteHeader
        remaining={remaining}
        userEmail={user?.email ?? null}
        onLogout={handleLogout}
      />
      <Hero />
      <InputForm
        generating={isLoading}
        loadingLabel={LOADING_STEPS[loadingStep]}
        onGenerate={handleGenerate}
      />

      {/* 무료 소진: 결과 화면이 없어도 폼 아래에 페이월 노출 */}
      {exhausted && !isLoading && !object && (
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-8 -mt-10">
          <PaywallBanner />
        </section>
      )}

      {error && (
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-8 -mt-10">
          <div className="rounded-xl border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-300">
            문서 생성에 실패했습니다. 잠시 후 다시 시도해주세요. ({error.message})
          </div>
        </section>
      )}

      {qualityError && !error && (
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-8 -mt-10">
          <div className="rounded-xl border border-amber-900 bg-amber-950/40 px-4 py-3 text-sm text-amber-300">
            생성 품질이 기준 미달이라 재시도가 필요합니다. 같은 입력으로 다시 생성해주세요.
            (무료 횟수는 차감되지 않았습니다)
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
          {exhausted && !isLoading && <PaywallBanner />}
        </section>
      )}

      <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />

      <footer className="border-t border-zinc-900 py-8 text-center text-xs text-zinc-600">
        TechDoc AI — 실서비스에서는 MOCK_MODE=false로 LLM API가 사용됩니다
      </footer>
    </div>
  );
}
