import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import type { LanguageModel } from "ai";

/**
 * 프로바이더 선택 (서버 전용):
 * - LLM_PROVIDER: "anthropic"(기본) | "openai"
 * - 모델: CLAUDE_MODEL / OPENAI_MODEL 로 각각 오버라이드
 * 프롬프트·few-shot·스키마는 프로바이더와 무관하게 공유된다.
 */

export type LlmProvider = "anthropic" | "openai";

/**
 * 기본 모델은 비용 안전을 위해 중간 티어로 설정 (Sonnet급 가격대끼리 맞춤):
 * - claude-sonnet-5: $2/$10 per 1M tokens
 * - gpt-5.6-terra: $2/$12 per 1M tokens (OpenAI 현 라인업의 mid-tier)
 * 최상위 모델이 필요하면 CLAUDE_MODEL=claude-opus-5 / OPENAI_MODEL=gpt-5.6-sol 로 오버라이드.
 */
const DEFAULT_MODELS: Record<LlmProvider, string> = {
  anthropic: "claude-sonnet-5",
  openai: "gpt-5.6-terra",
};

export type ProviderConfig =
  | { ok: true; provider: LlmProvider; modelId: string; model: LanguageModel }
  | { ok: false; error: string };

export function getProviderConfig(): ProviderConfig {
  const provider = (process.env.LLM_PROVIDER ?? "anthropic").toLowerCase();

  if (provider === "anthropic") {
    if (!process.env.ANTHROPIC_API_KEY) {
      return { ok: false, error: "ANTHROPIC_API_KEY가 설정되지 않았습니다. MOCK_MODE=true로 테스트하세요." };
    }
    const modelId = process.env.CLAUDE_MODEL ?? DEFAULT_MODELS.anthropic;
    return { ok: true, provider: "anthropic", modelId, model: anthropic(modelId) };
  }

  if (provider === "openai") {
    if (!process.env.OPENAI_API_KEY) {
      return { ok: false, error: "OPENAI_API_KEY가 설정되지 않았습니다. MOCK_MODE=true로 테스트하세요." };
    }
    const modelId = process.env.OPENAI_MODEL ?? DEFAULT_MODELS.openai;
    return { ok: true, provider: "openai", modelId, model: openai(modelId) };
  }

  return { ok: false, error: `알 수 없는 LLM_PROVIDER: "${provider}" (anthropic | openai 중 하나여야 합니다)` };
}
