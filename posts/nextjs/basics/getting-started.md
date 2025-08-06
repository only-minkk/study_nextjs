---
title: "Next.js 시작하기 - 첫 번째 프로젝트"
description: "Next.js로 첫 번째 프로젝트를 시작하는 방법을 단계별로 알아봅니다."
date: "2024-01-12"
readTime: "4분"
tags: ["Next.js", "React", "Getting Started", "Tutorial"]
---

# Next.js 시작하기 - 첫 번째 프로젝트

Next.js로 첫 번째 프로젝트를 만들어보겠습니다.

## 1. 프로젝트 생성

```bash
npx create-next-app@latest my-nextjs-app
cd my-nextjs-app
```

## 2. 개발 서버 실행

```bash
npm run dev
```

## 3. 기본 구조 이해

```
my-nextjs-app/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── public/
├── package.json
└── next.config.js
```

## 4. 첫 번째 페이지 만들기

```tsx
// app/page.tsx
export default function Home() {
  return (
    <main>
      <h1>안녕하세요, Next.js!</h1>
    </main>
  );
}
```

## 결론

이제 Next.js로 웹 개발을 시작할 준비가 완료되었습니다!
