import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  FileText, Sparkles, Copy, Check, Plus, X, Terminal,
  BookOpen, MessageSquareText, Loader2, ChevronRight, Zap
} from "lucide-react";

/* ─────────────────────────────────────────────
   TechDoc AI — Mock Prototype (API 키 불필요)
   Next.js 이관 시: 이 파일의 generateMockDocs()를
   /api/generate 라우트 호출로 교체하면 됩니다.
───────────────────────────────────────────── */

const PRESET_STACKS = [
  "AWS", "Next.js", "React", "TypeScript", "Docker",
  "Kubernetes", "Python", "Node.js", "Spring Boot", "MySQL",
  "Redis", "Terraform", "GitHub Actions", "Nginx", "Lambda",
];

/* ── Mock 문서 생성기 (실서비스에서는 LLM API로 교체) ── */
function generateMockDocs({ name, stacks, features, trouble }) {
  const stackList = stacks.length ? stacks : ["미입력 스택"];
  const mainStack = stackList[0];
  const featureText = features.trim() || "핵심 기능 요약이 입력되지 않았습니다.";
  const hasTrouble = trouble.trim().length > 0;

  const readme = `# ${name}

> ${featureText.split("\n")[0].slice(0, 80)}

## 📌 프로젝트 개요

**${name}** 프로젝트는 ${stackList.slice(0, 3).join(", ")} 기반으로 구축된 서비스입니다.

${featureText}

## 🛠 기술 스택

| 분류 | 기술 |
| --- | --- |
| Core | ${stackList.slice(0, 3).join(", ")} |
| Infra / Etc | ${stackList.slice(3).join(", ") || "—"} |

## 🏗 아키텍처

\`\`\`
[Client] → [${stackList.includes("Nginx") ? "Nginx" : "Load Balancer"}] → [${mainStack} App] → [DB / Cache]
\`\`\`

## ✨ 주요 기능

${featureText.split("\n").filter(Boolean).map((f) => `- ${f.replace(/^[-*]\s*/, "")}`).join("\n")}

${hasTrouble ? `## 🔧 트러블슈팅

${trouble}

**해결 과정에서 배운 점**: 문제를 단순히 해결하는 데 그치지 않고, 재발 방지를 위한 모니터링 체계까지 함께 고민했습니다.
` : ""}
## 🚀 실행 방법

\`\`\`bash
git clone https://github.com/username/${name.toLowerCase().replace(/\s+/g, "-")}
cd ${name.toLowerCase().replace(/\s+/g, "-")}
docker compose up -d
\`\`\`
`;

  const blog = `# [개발 후기] ${name}을(를) 만들며 배운 것들

안녕하세요! 오늘은 최근에 진행한 **${name}** 프로젝트 개발 경험을 공유하려고 합니다.

## 왜 이 프로젝트를 시작했나

${featureText.split("\n")[0]}

이 문제를 직접 해결해보고 싶어서 ${mainStack}을(를) 중심으로 프로젝트를 시작하게 되었습니다.

## 기술 선택의 이유

이번 프로젝트에서는 **${stackList.join(", ")}** 을(를) 사용했습니다.

특히 **${mainStack}** 을(를) 선택한 이유는 다음과 같습니다:

- 러닝커브 대비 생산성이 높고, 커뮤니티 자료가 풍부함
- 실무에서 가장 많이 쓰이는 스택이라 취업 준비와 직결됨
- ${stackList.length > 1 ? `${stackList[1]}와(과)의 궁합이 검증되어 있음` : "확장성이 검증되어 있음"}

## 구현하면서 겪은 시행착오

${hasTrouble ? trouble : `처음에는 모든 게 순조로울 줄 알았지만, 실제로 구현을 시작하니 예상치 못한 문제들이 나타났습니다. 특히 ${mainStack} 환경 설정 과정에서 공식 문서만으로는 해결되지 않는 부분이 있어 여러 이슈 트래커를 뒤져가며 해결했습니다.`}

## 마치며

이번 프로젝트를 통해 단순히 "돌아가는 코드"가 아니라 **"운영 가능한 시스템"** 을 만드는 것의 차이를 배웠습니다. 다음 글에서는 배포 자동화 과정을 더 자세히 다뤄보겠습니다.

읽어주셔서 감사합니다! 🙌
`;

  const qa = `# ${name} — 면접 예상 질문 & 모범 답안

## Q1. ${mainStack}을(를) 선택한 이유는 무엇인가요?

**모범 답안**: 단순히 유행이라서가 아니라, 프로젝트 요구사항(${featureText.split("\n")[0].slice(0, 40)}...)을 분석했을 때 ${mainStack}이(가) 제공하는 생태계와 안정성이 가장 적합하다고 판단했습니다. 대안으로 검토했던 기술과의 트레이드오프도 함께 설명할 수 있습니다.

## Q2. 이 프로젝트에서 가장 어려웠던 기술적 문제는 무엇이었나요?

**모범 답안**: ${hasTrouble ? `${trouble.split("\n")[0].slice(0, 100)} — 이 문제를 해결하며 원인 분석 → 가설 수립 → 검증의 순서로 접근하는 디버깅 프로세스를 체득했습니다.` : "문제 상황을 STAR 기법(상황-과제-행동-결과)으로 구조화해서 답변하세요. 트러블슈팅 입력란을 채우면 맞춤 답안이 생성됩니다."}

## Q3. 트래픽이 10배 증가한다면 어떤 부분을 개선하시겠습니까?

**모범 답안**: 현재 구조에서 병목이 될 지점을 먼저 짚고(예: DB 커넥션, 단일 인스턴스), ${stackList.includes("Redis") ? "이미 도입한 Redis 캐시 레이어를 확장하고" : "캐시 레이어 도입과"} 수평 확장이 가능하도록 무상태(stateless) 설계로 개선하겠다고 답변합니다.

## Q4. ${stackList.length > 1 ? `${stackList[1]}` : "협업 도구"}를 사용하며 느낀 장단점은?

**모범 답안**: 장점만 나열하지 말고, 실제로 겪은 한계와 그것을 어떻게 보완했는지 언급하면 실무 경험처럼 보입니다.

## Q5. 이 프로젝트를 다시 만든다면 무엇을 바꾸시겠습니까?

**모범 답안**: "완벽했다"는 답변은 감점 요인입니다. 테스트 코드 커버리지, 초기 설계 단계에서의 문서화 등 구체적인 개선점 1-2가지와 그 이유를 준비하세요.
`;

  return { readme, blog, qa };
}

/* ── 초경량 마크다운 렌더러 ── */
function renderMarkdown(md) {
  const lines = md.split("\n");
  const out = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("```")) {
      const code = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        code.push(lines[i]);
        i++;
      }
      i++;
      out.push(
        <pre key={key++} className="bg-black rounded-lg p-4 my-3 overflow-x-auto border border-zinc-800">
          <code className="text-sm text-emerald-300 font-mono">{code.join("\n")}</code>
        </pre>
      );
      continue;
    }

    if (line.startsWith("| ")) {
      const tableLines = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      const rows = tableLines
        .filter((l) => !/^\|[\s\-|]+\|$/.test(l))
        .map((l) => l.split("|").slice(1, -1).map((c) => c.trim()));
      out.push(
        <div key={key++} className="overflow-x-auto my-3">
          <table className="w-full text-sm border-collapse">
            <tbody>
              {rows.map((r, ri) => (
                <tr key={ri} className={ri === 0 ? "border-b border-zinc-700" : "border-b border-zinc-800"}>
                  {r.map((c, ci) => (
                    <td key={ci} className={`py-2 px-3 ${ri === 0 ? "font-semibold text-zinc-200" : "text-zinc-400"}`}>
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    const inline = (text) => {
      const parts = [];
      let rest = text;
      let k = 0;
      while (rest.length) {
        const bold = rest.match(/\*\*(.+?)\*\*/);
        const code = rest.match(/`([^`]+)`/);
        const first =
          bold && (!code || bold.index <= code.index) ? { m: bold, type: "b" }
          : code ? { m: code, type: "c" } : null;
        if (!first) { parts.push(rest); break; }
        if (first.m.index > 0) parts.push(rest.slice(0, first.m.index));
        if (first.type === "b")
          parts.push(<strong key={k++} className="text-white font-semibold">{first.m[1]}</strong>);
        else
          parts.push(<code key={k++} className="bg-zinc-800 text-blue-300 rounded px-1.5 py-0.5 text-sm font-mono">{first.m[1]}</code>);
        rest = rest.slice(first.m.index + first.m[0].length);
      }
      return parts;
    };

    if (line.startsWith("# ")) out.push(<h1 key={key++} className="text-2xl font-bold text-white mt-2 mb-4 leading-snug">{inline(line.slice(2))}</h1>);
    else if (line.startsWith("## ")) out.push(<h2 key={key++} className="text-lg font-bold text-white mt-6 mb-2 flex items-center gap-2">{inline(line.slice(3))}</h2>);
    else if (line.startsWith("> ")) out.push(<blockquote key={key++} className="border-l-2 border-blue-500 pl-4 my-3 text-zinc-400 italic">{inline(line.slice(2))}</blockquote>);
    else if (line.startsWith("- ")) out.push(<div key={key++} className="flex gap-2 my-1 text-zinc-300 text-sm leading-relaxed"><span className="text-blue-400 mt-0.5">•</span><span>{inline(line.slice(2))}</span></div>);
    else if (line.trim() === "") out.push(<div key={key++} className="h-2" />);
    else out.push(<p key={key++} className="text-zinc-300 text-sm leading-relaxed my-1.5">{inline(line)}</p>);
    i++;
  }
  return out;
}

/* ── 탭 정의 ── */
const TABS = [
  { id: "readme", file: "README.md", label: "포트폴리오 문서", icon: FileText },
  { id: "blog", file: "blog-post.md", label: "기술 블로그", icon: BookOpen },
  { id: "qa", file: "interview-qa.md", label: "면접 Q&A", icon: MessageSquareText },
];

const LOADING_STEPS = [
  "프로젝트 구조 분석 중...",
  "기술 스택 컨텍스트 매핑 중...",
  "포트폴리오 문서 작성 중...",
  "블로그 포스팅 생성 중...",
  "면접 예상 질문 추출 중...",
];

export default function TechDocAI() {
  const [projectName, setProjectName] = useState("");
  const [stacks, setStacks] = useState([]);
  const [customStack, setCustomStack] = useState("");
  const [features, setFeatures] = useState("");
  const [trouble, setTrouble] = useState("");

  const [phase, setPhase] = useState("input"); // input | loading | result
  const [loadingStep, setLoadingStep] = useState(0);
  const [docs, setDocs] = useState(null);
  const [activeTab, setActiveTab] = useState("readme");
  const [copied, setCopied] = useState(false);
  const [freeUsed, setFreeUsed] = useState(false);
  const [revealLen, setRevealLen] = useState(0);
  const resultRef = useRef(null);

  const canGenerate = projectName.trim() && features.trim() && stacks.length > 0;

  const toggleStack = (s) =>
    setStacks((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const addCustomStack = () => {
    const v = customStack.trim();
    if (v && !stacks.includes(v)) setStacks((p) => [...p, v]);
    setCustomStack("");
  };

  const handleGenerate = () => {
    if (!canGenerate) return;
    setPhase("loading");
    setLoadingStep(0);
    setRevealLen(0);
    setActiveTab("readme");
  };

  /* 로딩 단계 연출 */
  useEffect(() => {
    if (phase !== "loading") return;
    if (loadingStep >= LOADING_STEPS.length) {
      const result = generateMockDocs({ name: projectName, stacks, features, trouble });
      setDocs(result);
      setFreeUsed(true);
      setPhase("result");
      return;
    }
    const t = setTimeout(() => setLoadingStep((s) => s + 1), 420);
    return () => clearTimeout(t);
  }, [phase, loadingStep]); // eslint-disable-line

  /* 타자기 스트리밍 연출 */
  const currentDoc = docs ? docs[activeTab === "qa" ? "qa" : activeTab] : "";
  useEffect(() => {
    if (phase !== "result" || !docs) return;
    setRevealLen(0);
    const total = currentDoc.length;
    const interval = setInterval(() => {
      setRevealLen((l) => {
        if (l >= total) { clearInterval(interval); return total; }
        return Math.min(total, l + 60);
      });
    }, 16);
    return () => clearInterval(interval);
  }, [phase, activeTab, docs]); // eslint-disable-line

  useEffect(() => {
    if (phase === "result" && resultRef.current)
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [phase]);

  const handleCopy = useCallback(() => {
    const ta = document.createElement("textarea");
    ta.value = currentDoc;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }, [currentDoc]);

  const streaming = revealLen < currentDoc.length;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100" style={{ fontFamily: "'Pretendard', -apple-system, 'Apple SD Gothic Neo', system-ui, sans-serif" }}>

      {/* ── Header ── */}
      <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950 bg-opacity-80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
              <Terminal className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white tracking-tight">TechDoc <span className="text-blue-400">AI</span></span>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-xs px-2.5 py-1 rounded-full border ${freeUsed ? "border-zinc-700 text-zinc-500" : "border-blue-800 text-blue-400 bg-blue-950"}`}>
              오늘 무료 생성 {freeUsed ? "0" : "1"}/1회
            </span>
            <button className="hidden sm:block text-xs font-medium bg-white text-zinc-900 rounded-lg px-3.5 py-1.5 hover:bg-zinc-200 transition-colors">
              무제한 구독 ₩9,900/월
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-14 pb-10 text-center">
        <div className="inline-flex items-center gap-1.5 text-xs text-blue-400 bg-blue-950 border border-blue-900 rounded-full px-3 py-1 mb-5">
          <Zap className="w-3 h-3" /> 프로젝트 1개 → 문서 3종, 30초 완성
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold text-white leading-tight tracking-tight">
          만들기만 하고 미뤄둔 프로젝트,<br />
          <span className="text-blue-400">포트폴리오</span>가 되게 하세요
        </h1>
        <p className="mt-4 text-zinc-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          기술 스택과 핵심 기능만 입력하면 GitHub README, 기술 블로그 포스팅,
          면접 예상 Q&A까지 한 번에 생성합니다.
        </p>
      </section>

      {/* ── Input Form ── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 sm:p-8 shadow-2xl">

          {/* 프로젝트 이름 */}
          <label className="block text-sm font-semibold text-zinc-300 mb-2">
            프로젝트 이름 <span className="text-blue-400">*</span>
          </label>
          <input
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
            {stacks.filter((s) => !PRESET_STACKS.includes(s)).map((s) => (
              <button
                key={s}
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
              onClick={addCustomStack}
              className="px-4 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors"
              aria-label="스택 추가"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* 핵심 기능 */}
          <label className="block text-sm font-semibold text-zinc-300 mt-6 mb-2">
            핵심 기능 요약 <span className="text-blue-400">*</span>
          </label>
          <textarea
            value={features}
            onChange={(e) => setFeatures(e.target.value)}
            rows={4}
            placeholder={"한 줄에 하나씩 적어주세요.\n예:\nAWS 비용을 실시간으로 수집해 대시보드로 시각화\n예산 초과 시 Slack 알림 발송"}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-blue-600 transition-colors resize-none leading-relaxed"
          />

          {/* 트러블슈팅 */}
          <label className="block text-sm font-semibold text-zinc-300 mt-6 mb-2">
            트러블슈팅 경험 <span className="text-xs font-normal text-zinc-500">(선택 — 채우면 면접 Q&A 품질이 올라갑니다)</span>
          </label>
          <textarea
            value={trouble}
            onChange={(e) => setTrouble(e.target.value)}
            rows={3}
            placeholder="예: Lambda 콜드스타트로 응답이 3초 이상 걸리는 문제를 프로비저닝된 동시성 설정으로 해결"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-blue-600 transition-colors resize-none leading-relaxed"
          />

          {/* CTA */}
          <button
            onClick={handleGenerate}
            disabled={!canGenerate || phase === "loading"}
            className={`mt-7 w-full rounded-xl py-3.5 text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              canGenerate && phase !== "loading"
                ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg"
                : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
            }`}
          >
            {phase === "loading" ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> {LOADING_STEPS[Math.min(loadingStep, LOADING_STEPS.length - 1)]}</>
            ) : (
              <><Sparkles className="w-4 h-4" /> 문서 3종 자동 생성하기</>
            )}
          </button>
          {!canGenerate && (
            <p className="mt-2 text-center text-xs text-zinc-600">
              프로젝트 이름 · 기술 스택 · 핵심 기능은 필수 입력입니다
            </p>
          )}
        </div>
      </section>

      {/* ── Result: 에디터 스타일 출력 ── */}
      {phase === "result" && docs && (
        <section ref={resultRef} className="max-w-4xl mx-auto px-4 sm:px-6 pb-24">
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
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 text-xs font-mono whitespace-nowrap border-r border-zinc-800 transition-colors ${
                      on ? "bg-zinc-900 text-white border-t-2 border-t-blue-500" : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {t.file}
                    <span className="hidden sm:inline text-zinc-600">· {t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* 툴바 */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800">
              <span className="text-xs text-zinc-500 flex items-center gap-1.5">
                {streaming
                  ? <><Loader2 className="w-3 h-3 animate-spin text-blue-400" /> 생성 중...</>
                  : <><Check className="w-3 h-3 text-emerald-400" /> 생성 완료 · {currentDoc.length.toLocaleString()}자</>}
              </span>
              <button
                onClick={handleCopy}
                className={`flex items-center gap-1.5 text-xs font-medium rounded-lg px-3 py-1.5 border transition-all ${
                  copied
                    ? "border-emerald-700 text-emerald-400 bg-emerald-950"
                    : "border-zinc-700 text-zinc-300 hover:border-zinc-500"
                }`}
              >
                {copied ? <><Check className="w-3.5 h-3.5" /> 복사됨!</> : <><Copy className="w-3.5 h-3.5" /> 마크다운 복사</>}
              </button>
            </div>

            {/* 렌더링 영역 */}
            <div className="p-5 sm:p-8 min-h-96 max-h-screen overflow-y-auto">
              {renderMarkdown(currentDoc.slice(0, revealLen))}
              {streaming && <span className="inline-block w-2 h-4 bg-blue-400 animate-pulse ml-0.5 align-text-bottom" />}
            </div>
          </div>

          {/* 결제 유도 배너 (Mock) */}
          <div className="mt-6 rounded-2xl border border-blue-900 bg-blue-950 bg-opacity-40 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-white">오늘의 무료 생성을 모두 사용했어요</p>
              <p className="text-xs text-zinc-400 mt-1">프로젝트당 ₩2,000 또는 월 ₩9,900으로 무제한 이용하세요.</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button className="text-xs font-medium border border-zinc-700 text-zinc-300 rounded-lg px-4 py-2 hover:border-zinc-500 transition-colors">
                1회 결제 ₩2,000
              </button>
              <button className="text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-4 py-2 flex items-center gap-1 transition-colors">
                무제한 구독 <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ── Footer ── */}
      <footer className="border-t border-zinc-900 py-8 text-center text-xs text-zinc-600">
        TechDoc AI — Mock Prototype · 실서비스에서는 이 화면의 생성 로직이 LLM API로 교체됩니다
      </footer>
    </div>
  );
}
