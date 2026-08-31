"use client";

import { LogOut, Terminal } from "lucide-react";

interface Props {
  /** 남은 무료 횟수 (서버 동기화 값). null이면 미로그인/미설정 → 기본 1회 표시 */
  remaining: number | null;
  userEmail: string | null;
  onLogout: () => void;
}

export default function SiteHeader({ remaining, userEmail, onLogout }: Props) {
  const shown = remaining ?? 1;
  const exhausted = shown <= 0;

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
            <Terminal className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white tracking-tight">
            TechDoc <span className="text-blue-400">AI</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`text-xs px-2.5 py-1 rounded-full border ${
              exhausted
                ? "border-zinc-700 text-zinc-500"
                : "border-blue-800 text-blue-400 bg-blue-950"
            }`}
          >
            오늘 무료 생성 {shown}/1회
          </span>
          {userEmail ? (
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-xs text-zinc-500 max-w-36 truncate">
                {userEmail}
              </span>
              <button
                type="button"
                onClick={onLogout}
                className="text-xs text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 rounded-lg px-2.5 py-1.5 flex items-center gap-1 transition-colors"
              >
                <LogOut className="w-3 h-3" /> 로그아웃
              </button>
            </div>
          ) : (
            <button className="hidden sm:block text-xs font-medium bg-white text-zinc-900 rounded-lg px-3.5 py-1.5 hover:bg-zinc-200 transition-colors">
              무제한 구독 ₩9,900/월
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
