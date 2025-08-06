export interface BlogPost {
  id: number;
  title: string;
  description: string;
  content?: string;
  date: string;
  category: string;
  readTime: string;
  tags: string[];
  slug?: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Next.js 14의 새로운 기능들",
    description:
      "App Router, Server Components, 그리고 더 많은 새로운 기능들을 살펴봅니다.",
    content: `
# Next.js 14의 새로운 기능들

Next.js 14는 웹 개발을 더욱 빠르고 효율적으로 만들어주는 많은 새로운 기능들을 제공합니다.

## App Router
App Router는 Next.js 13에서 도입된 새로운 라우팅 시스템입니다...

## Server Components
Server Components는 서버에서 렌더링되는 React 컴포넌트입니다...

## 결론
Next.js 14의 새로운 기능들을 활용하면 더욱 빠르고 효율적인 웹 애플리케이션을 구축할 수 있습니다.
    `,
    date: "2024-01-15",
    category: "Next.js",
    readTime: "5분",
    tags: ["Next.js", "React", "Web Development"],
    slug: "nextjs-14-new-features",
  },
  {
    id: 2,
    title: "TypeScript와 함께하는 안전한 개발",
    description:
      "TypeScript를 사용하여 더 안전하고 유지보수하기 쉬운 코드를 작성하는 방법을 알아봅니다.",
    content: `
# TypeScript와 함께하는 안전한 개발

TypeScript는 JavaScript에 정적 타입 검사를 추가한 프로그래밍 언어입니다.

## 타입 안전성
TypeScript의 가장 큰 장점은 컴파일 타임에 타입 오류를 잡아낼 수 있다는 것입니다...

## 인터페이스와 타입
TypeScript에서는 인터페이스와 타입을 사용하여 객체의 구조를 정의할 수 있습니다...

## 결론
TypeScript를 사용하면 더 안전하고 유지보수하기 쉬운 코드를 작성할 수 있습니다.
    `,
    date: "2024-01-10",
    category: "TypeScript",
    readTime: "7분",
    tags: ["TypeScript", "JavaScript", "Programming"],
    slug: "typescript-safe-development",
  },
  {
    id: 3,
    title: "Tailwind CSS로 빠른 UI 개발하기",
    description:
      "Tailwind CSS를 활용하여 효율적이고 아름다운 사용자 인터페이스를 만드는 팁들을 공유합니다.",
    content: `
# Tailwind CSS로 빠른 UI 개발하기

Tailwind CSS는 유틸리티 우선 CSS 프레임워크로, 빠르고 효율적인 UI 개발을 가능하게 합니다.

## 유틸리티 클래스
Tailwind CSS의 핵심은 유틸리티 클래스입니다...

## 반응형 디자인
Tailwind CSS는 반응형 디자인을 쉽게 구현할 수 있도록 도와줍니다...

## 결론
Tailwind CSS를 사용하면 빠르고 일관된 UI를 개발할 수 있습니다.
    `,
    date: "2024-01-05",
    category: "CSS",
    readTime: "4분",
    tags: ["Tailwind CSS", "CSS", "UI/UX"],
    slug: "tailwind-css-fast-ui-development",
  },
  {
    id: 4,
    title: "Git과 GitHub로 협업하기",
    description:
      "Git을 사용한 버전 관리와 GitHub를 통한 협업 워크플로우에 대해 알아봅니다.",
    content: `
# Git과 GitHub로 협업하기

Git은 분산 버전 관리 시스템으로, 소프트웨어 개발에서 필수적인 도구입니다.

## Git 기본 개념
Git은 파일의 변경사항을 추적하고 관리하는 시스템입니다...

## GitHub 협업
GitHub는 Git 저장소를 호스팅하고 협업을 위한 플랫폼을 제공합니다...

## 결론
Git과 GitHub를 활용하면 효율적인 협업이 가능합니다.
    `,
    date: "2024-01-01",
    category: "Git",
    readTime: "6분",
    tags: ["Git", "GitHub", "Collaboration"],
    slug: "git-github-collaboration",
  },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getBlogPostsByCategory(category: string): BlogPost[] {
  return blogPosts.filter((post) => post.category === category);
}
