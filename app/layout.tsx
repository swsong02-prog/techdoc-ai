import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TechDoc AI",
  description:
    "기술 스택과 핵심 기능만 입력하면 GitHub README, 기술 블로그 포스팅, 면접 예상 Q&A까지 한 번에 생성합니다.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased">{children}</body>
    </html>
  );
}
