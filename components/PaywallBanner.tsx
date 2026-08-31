import { ChevronRight } from "lucide-react";

export default function PaywallBanner() {
  return (
    <div className="mt-6 rounded-2xl border border-blue-900 bg-blue-950/40 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <p className="text-sm font-bold text-white">오늘의 무료 생성을 모두 사용했어요</p>
        <p className="text-xs text-zinc-400 mt-1">
          프로젝트당 ₩2,000 또는 월 ₩9,900으로 무제한 이용하세요.
        </p>
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
  );
}
