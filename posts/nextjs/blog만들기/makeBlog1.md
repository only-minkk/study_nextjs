---
title: "Next.js로 블로그 만들기 1"
description: "next.js 공부하면서 블로그 만들기"
date: "2025-08-07"
published: true
readTime: "6분"
tags: ["Next.js", "JavaScript", "Programming"]
---

# 라우트 만들기

## blog 세그먼트 만들기

이 블로그는 `App Router` 방식으로 제작된다.

`App Router` 기반의 디렉토리 구조에서는 `app` 폴더 내부의 중첩된 폴더들이 곧 URL 경로를 정의한다.

즉 `app`폴더에 `blog`폴더를 만들면 `/blog`경로가 자동으로 매핑된다.

하지만 주의할 점은, 폴더를 만든다고 해서 해당 경로가 바로 접근 가능한 라우트가 되는 것은 아니라는 점이다.

해당 폴더(세그먼트)에 `page.tsx` 파일이 존재해야만 실제 브라우저에서 접근 가능한 라우트가 된다.

예를 들어:

```bash
app/
└── blog/
    └── page.tsx     ✅ /blog 경로로 접근 가능
```

반면, 아래처럼 page.tsx 없이 폴더만 존재할 경우, URL 경로는 생성되지 않는다:

```bash
app/
└── blog/            ❌ /blog 경로 접근 불가 (page.tsx 없음)
```

이처럼 Next.js의 `App Router`는 디렉토리 구조 자체를 라우팅 체계로 삼지만, 최종적으로 해당 경로가 "활성화"되기 위해서는 라우트 파일(`page.tsx`, `route.ts`)이 반드시 존재해야 한다는 점을 기억해야 한다.

### Colocation: 관련 리소스의 구조적 배치

Next.js `App Router`의 또 다른 중요한 특징 중 하나는 colocation 개념을 자연스럽게 지원한다는 점이다.

#### Colocation이란?

**기능과 목적이 연관된 파일들을 하나의 폴더(세그먼트) 안에 모아서 함께 관리하는 구조 패턴**이다.

예를 들어 `/blog` 경로를 구성할 때, 해당 경로에 필요한 모든 UI, 로딩 상태, 에러 처리, 메타데이터, 관련 컴포넌트를 아래처럼 함께 배치할 수 있다:

```bash
app/
└── blog/
├── page.tsx // 페이지 컴포넌트
├── loading.tsx // 로딩 UI
├── error.tsx // 에러 UI
├── layout.tsx // (선택) 중첩 레이아웃
├── head.tsx // (선택) head 메타데이터 설정
└── components/ // blog 페이지 전용 컴포넌트들
└── BlogCard.tsx
```

이러한 구조는 다음과 같은 이점을 제공한다:

- 가독성 향상 : 관련 파일이 한곳에 모여 있어 유지보수 용이.
- 모듈성 강화 : 각 경로가 독립적인 기능 단위처럼 구성됨.
- 컴포넌트 재사용 관리 용이 : 전역 컴포넌트와 로컬 컴포넌트를 명확히 구분 가능

_*즉, Segment가 Route가 되기 위해선 `page.tsx`가 필요*_
_*(Segment: `app` 폴더 안의 각 하위 폴더)*_
_*(Route: 브라우저에서 접근 가능한 경로)*_

## blog 경로 만들기

`blog` 폴더 내에 `page.tsx`와 `layout.tsx`를 만들어준다.

### blog.tsx : 해당 경로의 실제 페이지

`page.tsx`는 해당 세그먼트(/blog)의 실제 콘텐츠를 렌더링하는 페이지 컴포넌트이다.

Next.js는 `app` 디렉토리 안의 파일들을 자동으로 인식해서 라우팅과 레이아웃 시스템을 구성한다.

`page.tsx`는 해당 URL(/blog)에 접근했을 때 사용자에게 보여지는 메인 콘텐츠이며 React 컴포넌트 형태로 작성되고 반드시 `default export` 되어야 한다.

```tsx
// app/blog/page.tsx
export default function BlogPage() {
  return (
    <main>
      <h1>블로그 목록</h1>
      <p>여기에 블로그 글들이 나열됩니다.</p>
    </main>
  );
}
```

내부적으로 Next.js는 "이 폴더에 있는 `page.tsx`파일에서 export된 **기본 컴포넌트(default export)**를 이 경로(/blog 등)의 페이지로 렌더링해야겠다."라고 생각한다.

즉, Next.js는 컴파일 단계에서 다음처럼 코드 없이 자동으로 해석한다.

```typescript
const PageComponent = require("app/blog/page.tsx").default;
```

만약 `default export`가 없다면 위 코드에서 `.default`를 찾을 수 없어 오류가 발생하게 된다.

### layout.tsx : 경로의 공통 레이아웃

`layout.tsx`는 현재 세그먼트와 그 하위 세그먼트들에 공통으로 적용할 레이아웃을 정의하는 컴포넌트이다.

해당 세그먼트(/blog)와 그 하위 경로(/blog/[id] 등)에 공통 UI(예: 상단 바, 사이드바, 배경 등)를 적용한다.
`children`을 받아서 그 자리에 하위 경로의 실제 페이지(`page.tsx`)가 렌더링 된다.
마찬가지로 `default export`가 필요하다.

```tsx
// app/blog/layout.tsx
export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <h1>📚 블로그</h1>
      <nav>카테고리 / 검색 / 최신 글</nav>
      <div>{children}</div> {/* page.tsx의 내용이 여기에 들어감 */}
    </section>
  );
}
```

`page.tsx`는 필수로 필요하지만 `layout.tsx`는 선택사항이다.

## 흐름

```bash
app/
└── blog/
    ├── layout.tsx   ← 공통 UI (타이틀, nav 등)
    └── page.tsx     ← /blog 접근 시 보여줄 메인 콘텐츠
```

사용자가 `/blog`로 접근하면 `layout.tsx`가 먼저 적용되고 그 안에 `page.tsx`가 `children`으로 삽입된다.

## 결과

![결과](/blog-images/blog1.png)
