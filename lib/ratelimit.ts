import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/** IP당 분당 5회 (로그인 여부 무관) */
const LIMIT = 5;
const WINDOW_MS = 60_000;

/* Upstash 설정 시 분산 rate limit, 미설정 시 인메모리 폴백(단일 인스턴스 개발용) */
const upstash =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(LIMIT, "1 m"),
        prefix: "techdoc:rl",
      })
    : null;

const memory = new Map<string, number[]>();
let warnedFallback = false;

export async function checkRateLimit(ip: string): Promise<{ ok: boolean }> {
  if (upstash) {
    try {
      const { success } = await upstash.limit(ip);
      return { ok: success };
    } catch (e) {
      // Redis 장애 시 서비스는 살린다 (fail-open)
      console.warn(`[ratelimit] Upstash 오류 — 통과 처리: ${e instanceof Error ? e.message : e}`);
      return { ok: true };
    }
  }

  if (!warnedFallback) {
    warnedFallback = true;
    console.warn(
      "[ratelimit] Upstash 미설정 — 인메모리 폴백 사용 중 (서버리스 다중 인스턴스에서는 Upstash 필수)"
    );
  }
  const now = Date.now();
  const hits = (memory.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (hits.length >= LIMIT) {
    memory.set(ip, hits);
    return { ok: false };
  }
  hits.push(now);
  memory.set(ip, hits);
  return { ok: true };
}
