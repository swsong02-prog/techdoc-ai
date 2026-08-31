import { Zap } from "lucide-react";

export default function Hero() {
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-14 pb-10 text-center">
      <div className="inline-flex items-center gap-1.5 text-xs text-blue-400 bg-blue-950 border border-blue-900 rounded-full px-3 py-1 mb-5">
        <Zap className="w-3 h-3" /> 프로젝트 1개 → 문서 3종, 30초 완성
      </div>
      <h1 className="text-3xl sm:text-5xl font-bold text-white leading-tight tracking-tight">
        만들기만 하고 미뤄둔 프로젝트,
        <br />
        <span className="text-blue-400">포트폴리오</span>가 되게 하세요
      </h1>
      <p className="mt-4 text-zinc-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
        기술 스택과 핵심 기능만 입력하면 GitHub README, 기술 블로그 포스팅, 면접 예상 Q&A까지 한
        번에 생성합니다.
      </p>
    </section>
  );
}
