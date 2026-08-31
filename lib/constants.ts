import { FileText, BookOpen, MessageSquareText, type LucideIcon } from "lucide-react";
import type { Docs } from "./schema";

export const PRESET_STACKS = [
  "AWS", "Next.js", "React", "TypeScript", "Docker",
  "Kubernetes", "Python", "Node.js", "Spring Boot", "MySQL",
  "Redis", "Terraform", "GitHub Actions", "Nginx", "Lambda",
] as const;

/** 문서 탭 id — analysis(진단)는 탭이 아니라 상단 카드로 표시 */
export type TabId = Exclude<keyof Docs, "analysis">;

export interface TabDef {
  id: TabId;
  file: string;
  label: string;
  icon: LucideIcon;
}

export const TABS: TabDef[] = [
  { id: "readme", file: "README.md", label: "포트폴리오 문서", icon: FileText },
  { id: "blog", file: "blog-post.md", label: "기술 블로그", icon: BookOpen },
  { id: "qa", file: "interview-qa.md", label: "면접 Q&A", icon: MessageSquareText },
];

export const LOADING_STEPS = [
  "프로젝트 구조 분석 중...",
  "기술 스택 컨텍스트 매핑 중...",
  "포트폴리오 문서 작성 중...",
  "블로그 포스팅 생성 중...",
  "면접 예상 질문 추출 중...",
];
