---
title: "Next.js App Router 완전 가이드"
description: "Next.js 13부터 도입된 App Router의 모든 것을 알아봅니다."
date: "2024-01-15"
readTime: "8분"
tags: ["Next.js", "App Router", "React"]
---

# Next.js App Router 완전 가이드

Next.js 13부터 도입된 App Router는 웹 개발의 새로운 패러다임을 제시합니다.

## App Router란?

App Router는 Next.js의 새로운 라우팅 시스템으로, 파일 시스템 기반의 직관적인 라우팅을 제공합니다.

### 주요 특징

- **파일 시스템 기반 라우팅**: 폴더 구조가 곧 URL 구조
- **Server Components 기본 지원**: 더 나은 성능과 SEO
- **레이아웃 시스템**: 중첩된 레이아웃 지원
- **로딩 및 에러 처리**: 자동 로딩 상태와 에러 처리

## 기본 구조

```
app/
├── layout.tsx      # 루트 레이아웃
├── page.tsx        # 홈페이지
├── about/
│   └── page.tsx    # /about 페이지
└── blog/
    ├── layout.tsx  # 블로그 레이아웃
    └── [slug]/
        └── page.tsx # 동적 블로그 포스트
```

## Server Components vs Client Components

App Router에서는 Server Components가 기본값입니다.

```tsx
// Server Component (기본값)
export default function ServerComponent() {
  return <div>서버에서 렌더링됩니다</div>;
}

// Client Component
("use client");
export default function ClientComponent() {
  return <div>클라이언트에서 렌더링됩니다</div>;
}
```

## 결론

App Router는 Next.js의 미래이며, 더 나은 개발 경험과 성능을 제공합니다.
