"use client";

import React from "react";

interface Props {
  /** 값이 바뀌면 에러 상태를 리셋 — 스트리밍 중 미완성 마크다운으로 깨져도 다음 청크에서 복구 */
  resetKey: string;
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * 스트리밍 중 미완성 마크다운이 렌더러를 깨뜨려도 화면 전체가 죽지 않게 하는 바운더리.
 * fallback으로 원본 텍스트를 <pre>로 표시하고, 새 청크가 도착하면 자동으로 재시도한다.
 */
export default class MarkdownErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidUpdate(prevProps: Props) {
    if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <pre className="whitespace-pre-wrap text-sm text-zinc-300 leading-relaxed font-mono">
          {this.props.resetKey}
        </pre>
      );
    }
    return this.props.children;
  }
}
