---
title: "Next.js App Router 강의 1강~6강"
description: "Next.js 13부터 도입된 App Router의 모든 것을 알아봅니다."
date: "2024-01-15"
readTime: "8분"
tags: ["Next.js", "App Router", "React"]
---

# Chapter 1 : Getting Started

## Creating a new project

패키지 관리자로는 `npm`이나 `yarn`보다 빠르고 효율적인 `pnpm`을 사용 하는 것이 좋다.

```
npm install -g pnpm
```

해당 과정은 Next.js 앱 라우터 과정의 스타터 템플릿을 사용한다.

```
npx create-next-app@latest nextjs-dashboard --example "https://github.com/vercel/next-learn/tree/main/dashboard/starter-example" --use-pnpm
```

이 명령은 Next.js 애플리케이션을 설정하는 명령줄 인터페이스(CLI) 도구인 `create-next-app`을 사용한다. 위의 명령에서는 이 강좌의 시작 예제와 함께 `--example` 플래그를 사용하고 있다.

## Exploring the project

처음부터 코드를 작성하게 하는 튜토리얼과 달리 이 강좌의 코드 대부분은 이미 작성되어 있다. 이는 기존 코드베이스로 작업하게 될 가능성이 높은 실제 개발 환경을 더 잘 반영한다고 한다. 모든 애플리케이션 코드를 작성할 필요 없이 Next.js의 주요 기능을 학습하는 데 집중할 수 있도록 돕는 것이 목표라고한다.

### 프로젝트 구조

- `/app` : 애플리케이션의 모든 경로, 구성 요소 및 로직이 포함되어 있으며, 대부분 이곳에서 작업하게 됩니다.
  - `/app/lib` : 재사용 가능한 유틸리티 함수 및 데이터 가져오기 함수 등 애플리케이션에서 사용되는 함수가 포함되어 있습니다.
  - `/app/ui` : 카드, 표, 양식 등 애플리케이션의 모든 UI 구성 요소가 포함되어 있습니다. 시간을 절약하기 위해 이러한 구성 요소는 미리 스타일이 지정되어 있습니다.
- `/public` : 이미지와 같은 애플리케이션의 모든 정적 에셋을 포함합니다.
- `Config Files` : 또한 애플리케이션의 루트에서 `next.config.ts`와 같은 구성 파일을 확인할 수 있습니다. 이러한 파일의 대부분은 `create-next-app`을 사용하여 새 프로젝트를 시작할 때 생성되고 미리 구성됩니다. 이 과정에서는 이러한 파일을 수정할 필요가 없습니다.

### Placeholder data

**실제 데이터가 준비되기 전에, UI를 먼저 만들거나 테스트하기 위해 임시로 사용하는 가짜 데이터**로 데이터베이스 또는 API를 아직 사용할 수 없는 경우 아래의 방법을 사용할 수 있다.

- 플레이스홀더 데이터를 JSON 형식 또는 JS 객체로 사용한다.
- mockAPI와 같은 타사 서비스를 사용한다.

이 프로젝트의 경우 `app/lib/placeholder-data.js`에 플레이스홀더 데이터가 있다. 파일의 각 JS 객체는 데이터베이스의 테이블을 나타낸다. 아래는 인보이스 테이블이다.

```
// /app/lib/placeholder-data.js

const invoices = [
  {
    customer_id: customers[0].id,
    amount: 15795,
    status: 'pending',
    date: '2022-12-06',
  },
  {
    customer_id: customers[1].id,
    amount: 20348,
    status: 'pending',
    date: '2022-11-14',
  },
  // ...
];
```

### TypeScript

해당 강좌는 최신 웹 환경을 반영하기에 TypeScript로 작성되어 있다.

여기에서는 데이터베이스에서 반환할 유형을 수동으로 정의하고 있다. 아래는 인보이스 테이블의 경우이다.

```
// /app/lib/definitions.ts

export type Invoice = {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
  status: 'pending' | 'paid';
};
```

**TS를 사용하면 인보이스 금액에 숫자 대신 문자열을 전달하는 등 실수로 잘못된 데이터 형식을 구성 요소나 데이터베이스에 전달하지 않도록 할 수 있다.**

# Chapter 2 : CSS Styling

이 장에서는 전역 CSS 파일을 추가하는 방법, 테일윈드 및 CSS 모듈 : 두 가지 다른 스타일 지정 방법, `clsx` 유틸리티 패키지로 클래스 이름을 조건부로 추가하는 방법을 설명한다.

## Global styles

`app/ui` 폴더를 살펴보면 **`global.css`라는 파일을 볼 수 있는데 이 파일을 사용하여 애플리케이션의 모든 경로에 CSS 재설정 규칙, 링크과 같은 HTML 요소에 대한 사이트 전체 스타일 등 CSS 규칙을 추가할 수 있다.**
애플리케이션의 모든 컴포넌트에서 `global.css`를 가져올 수 있지만 일반적으로 최상위 컴포넌트에 추가하는 것이 좋다. Next.js에서는 이것이 루트 레이아웃이다. 아래는 `app/layout.tsx`로 이동해서 `global.css` 파일을 가져와 애플리케이션에 전역 스타일을 추가한다.

```
// /app/layout.tsx

import '@/app/ui/global.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

## Tailwind

**Tailwind는 React 코드에서 유틸리티 클래스를 직접 빠르게 작성할 수 있도록 하여 개발 프로세스의 속도를 높여주는 CSS 프레임워크**이다.

Tailwind에서는 **클래스 이름을 추가하여 요소의 스타일을 지정**한다.

```
<h1 className="text-blue-500">I'm blue!</h1>
// "text-blue-500"을 추가하면 <h1> 텍스트가 파란색으로 바뀐다.
```

CSS 스타일은 전역으로 공유되지만 **각 클래스는 각 요소에 개별적으로 적용된다. 즉 요소를 추가하거나 삭제할 때 별도의 스타일 시트를 유지하거나 스타일 충돌 또는 애플리케이션 확장에 따라 커지는 CSS 번들의 크기에 대해 걱정할 필요가 없다.**

`create-next-app`을 사용하여 프로젝트를 생성하면 `Next.js`에서 `Tailwind`를 사용할 지 묻는 메시지가 표시되는데 `yes`를 선택하면 `Next.js`가 필요한 패키지를 자동으로 설치하고 애플리케이션서 `Tailwind`를 구성한다.

```
// /app/page.tsx

import AcmeLogo from '@/app/ui/acme-logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function Page() {
  return (
    // These are Tailwind classes:
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-52">
    // ...
  )
}
```

기존 CSS 규칙을 작성하거나 스타일을 JSX와 별도로 유지하는 것을 선호한다면 CSS 모듈이 훌륭한 대안이 될 수 있다.

## CSS Modules

CSS 모듈을 사용하면 고유한 클래스 이름을 자동으로 생성하여 컴포넌트에 CSS의 범위를 지정할 수 있으므로 스타일 충돌에 대해 걱정할 필요가 없다.

이 강좌에서는 Tailwind를 계속 사용하겠지만, CSS 모듈을 사용하여 위와 동일한 결과를 얻을 수 있는 방법을 살펴보고 있다. `app/ui`에 `home.module.css`라는 새 파일을 만들고 다음 CSS 규칙을 추가한다.

```
// /app/ui/home.module.css

.shape {
  height: 0;
  width: 0;
  border-bottom: 30px solid black;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;
}
```

그런 다음 `/app/page.tsx` 파일 내에서 스타일을 가져오고 추가한 <div>에서 Tailwind 클래스 이름을 styles.shape로 바꾼다.

```
// /app/page.tsx

import AcmeLogo from '@/app/ui/acme-logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import styles from '@/app/ui/home.module.css';

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className={styles.shape} />
    // ...
  )
}
```

Tailwind와 CSS 모듈은 Next.js 애플리케이션의 스타일을 지정하는 가장 일반적인 두 가지 방법이이다. 둘 중 하나를 사용할지 여부는 선호도에 따라 결정할 수 있으며 동일한 애플리케이션에서 두 가지를 모두 사용할 수도 있다.

CSS 모듈을 사용하면 기본적으로 CSS 클래스를 컴포넌트로 로컬 범위 지정하여 스타일 충돌의 위험을 줄이는 방법을 제공한다.

올바른 CSS 모듈은 각 컴포넌트에 대해 고유한 클래스 이름을 생성하므로 스타일 충돌에 대해 걱정할 필요가 없다.

## Using the 'clsx' library to toggle class name

상태 또는 다른 조건에 따라 조건부로 요소의 스타일을 지정해야 하는 경우가 있다.

`clsx`는 클래스 이름을 쉽게 토글할 수 있는 라이브러리이다.

```
/app/ui/invoices/status.tsx

import clsx from 'clsx';

export default function InvoiceStatus({ status }: { status: string }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-1 text-sm',
        {
          'bg-gray-100 text-gray-500': status === 'pending',
          'bg-green-500 text-white': status === 'paid',
        },
      )}
    >
    // ...
)}
```

- 상태를 받는 InvoiceStatus 컴포넌트를 만들고 싶다고 가정해 보겠습니다. 상태는 '보류 중' 또는 '결제됨'일 수 있습니다. - '결제됨'인 경우 색상을 녹색으로 지정합니다. '보류 중'인 경우 색상을 회색으로 지정합니다. 다음과 같이 clsx를 사용하여 클래스를 조건부로 적용할 수 있습니다:

다른 방식으로도 Next.js 애플리케이션의 스타일을 지정할 수 있다.

- `.css` 및 `.scss` 파일을 가져올 수 있는 `Sass`.
- `styled-jsx`, `styled-components` 및 `emotion`과 같은 `CSS-in-JS` 라이브러리.

# Chapter 3 : Optimizing Fonts and Images

이 장에서는 `next/front`로 사용자 정의 글꼴을 추가하는 방법, `next/image`로 이미지를 추가하는 방법을 다룬다. 그리고 `Next.js`에서 글꼴과 이미지를 최적화하는 방법을 다룬다.

## 글꼴을 최적화 하는 이유

글꼴은 웹사이트 디자인에서 중요한 역할을 하지만 프로젝트에서 사용자 정의 글꼴을 사용하면 글꼴 파일을 가져와 로드해야 하는 경우 성능에 영향을 줄 수 있다.

누적 레이아웃 이동은 Google에서 웹사이트의 성능과 사용자 경험을 평가하는 데 사용하는 지표이다.

글꼴의 경우 레이아웃 이동은 브라우저가 처음에 폴백 또는 시스템 글꼴로 텍스트를 렌더링한 다음 로드된 후 사용자 정의 글꼴로 교체할 때 발생한다. 이 교체로 인해 텍스트 크기, 간격 또는 레이아웃이 변경되어 주변의 요소가 이동할 수 있다.

Next.js는 **`next/front` 모듈을 사용할 때 애플리케이션의 글꼴을 자동으로 최적화**합니다. **빌드 시점에 글꼴 파일을 다운로드하고 다른 정적 에셋과 함께 호스팅**합니다. 즉, 사용자가 애플리케이션을 방문할 때 **성능에 영향을 줄 수 있는 글꼴에 대한 추가 네트워크 요청이 없다**.

## Adding a primary font

**`app/ui` 폴더에 `fonts.ts`라는 새 파일을 만들고 사용하여 애플리케이션 전체에서 사용할 글꼴을 유지할 수 있다.**
inter 글꼴을 가져와서 로드할 하위 집합을 지정하여 기본 글꼴을 추가할 수 있다.

```
// /app/ui/fonts.ts

import { Inter } from 'next/font/google';

export const inter = Inter({ subsets: ['latin'] });
```

마지막으로 `/app/layout.tsx`의 <body> 요소에 글꼴을 추가한다.

```
// /app/layout.tsx

import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
```

`<body>` 요소에 `inter`를 추가하면 글꼴이 애플리케이션 전체에 적용된다. 글꼴을 부드럽게 처리하는 Tailwind `antialiased` 클래스도 추가한다.

## Adding a secondary font

애플리케이션의 특정 요소에 글꼴을 추가할 수도 있다. `fonts.ts` 파일에서 `Lusitana`라는 보조 글꼴을 가져와서 `/app/page.tsx` 파일의 <p> 요소에 전달한다. 이전과 같이 하위 집합을 지정하는 것 외에도 다른 글꼴 가중치를 지정해야 한다. 예를 들어 400(일반) 및 700(굵게)이 있습니다.

## Why optimize images?

**Next.js는 이미지와 같은 정적 자산을 최상위 폴더인 `/public `폴더에 제공할 수 있다.** public 폴더에 있는 파일은 애플리케이션에서 참조할 수 있다.

일반 HTML을 사용하면 다음과 같이 이미지를 추가할 수 있다.

```
<img
  src="/hero.png"
  alt="Screenshots of the dashboard project showing desktop version"
/>
```

하지만 이는 이미지가 다양한 화면 크기에서 반응하는지 확인하고, 다양한 디바이스에 맞는 크기를 지정해야 하며, 이미지 로드시 레이아웃이 이동하지 않도록 해야한다. 또 사용자 뷰포트 외부에 있는 이미지를 지연 로딩해야한다.

**이미지 최적화**는 웹 개발의 큰 주제이며 그 자체로 하나의 전문 분야로 간주될 수 있다. 이러한 최적화를 수동으로 구현하는 대신 **`next/image` 컴포넌트를 사용하여 자동으로 최적화할 수 있다.**

## The <Image> component

**<Image> 컴포넌트는 HTML <img> 태그의 확장으로, 다음과 같은 자동 이미지 최적화 기능을 제공한다.**

- 이미지가 로드될 때 레이아웃이 자동으로 바뀌는 것을 방지.
- 뷰포트가 작은 디바이스에 큰 이미지가 전송되지 않도록 이미지 크기 조정.
- 기본적으로 이미지 지연 로딩(이미지가 뷰포트에 들어갈 때 이미지가 로드됨).
- 브라우저에서 WebP 및 AVIF와 같은 최신 형식을 지원하는 경우 이미지를 제공한다.

## Adding the desktop hero image

public 폴더 내부에 hero-desktop.png와 hero-mobile.png가 있다. 두 이미지는 사용자의 기기가 데스크탑인지 모바일인지에 따라 표시해야하는 완전히 다른 이미지이다.
`app/page.tsx`파일에서 `next/image`로부터 컴포넌트를 가져와서 적용한다.

```
// /app/page.tsx

// ...
import Image from 'next/image';

export default function Page() {
  return (
    // ...
    <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
      {/* Add Hero Images Here */}
      <Image
        src="/hero-desktop.png"
        width={1000}
        height={760}
        className="hidden md:block"
        alt="Screenshots of the dashboard project showing desktop version"
      />
    </div>
    //...
  );
}
```

너비를 1000, 높이를 760픽셀로 설정한다. 레이아웃이 바뀌지 않도록 이미지의 너비와 높이를 설정하는 것이 좋으며, 소스 이미지와 동일한 가로 세로 비율이어야 한다.
이 값은 이미지가 렌더링되는 크기가 아니라 가로 세로 비율을 이해하는데 사용되는 실제 이미지 파일의 크기이다.
또한 모바일 화면의 DOM에서 이미지를 제거하려면 `hidden`클래스를, 데스크톱 화면에서 이미지를 표시하려면 `md:block`를 사용한다.

## Adding the mobile hero image

```
// /app/page.tsx

// ...
import Image from 'next/image';

export default function Page() {
  return (
    // ...
    <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
      {/* Add Hero Images Here */}
      <Image
        src="/hero-desktop.png"
        width={1000}
        height={760}
        className="hidden md:block"
        alt="Screenshots of the dashboard project showing desktop version"
      />
      <Image
        src="/hero-mobile.png"
        width={560}
        height={620}
        className="block md:hidden"
        alt="Screenshot of the dashboard project showing mobile version"
      />
    </div>
    //...
  );
}
```

모바일 화면의 DOM에서 이미지가 표시되어야 하기에 `block`클래스와 데스크 탑에서 이미지를 제거하기 위해 `md:hidden`을 사용한다.

```
md는 Tailwind에서 기본적으로 정의한 브레이크 포인트로
md는 해상도 기준 768px이상을 의미한다. 즉 768이상에서 block이면 보이기, hidden이면 숨기기이다.
```

| 코드              | 의미                                               |
| ----------------- | -------------------------------------------------- |
| `hidden md:block` | 작은 화면에서는 숨기고, 데스크탑 화면에서는 보여줌 |
| `block md:hidden` | 작은 화면에서는 보여주고, 데스크탑 화면에서는 숨김 |

# Chapter 4 : Creating Layouts and Pages

이 장에서는 파일 시스템 라우팅을 사용하여 대시보드 경로 만들기, 새 경로 세그먼트를 만들 때 폴더 및 파일의 역할 이해하기, 여러 대시보드 페이지 간에 공유할 수 있는 중첩 레이아웃 만들기, 코로케이션 및 부분 렌더링 및 루트 레이아웃이 뭔지 이해하는 시간을 가진다.

## Nested routing

Next.js는 폴더를 사용하여 중첩 경로를 생성하는 `file-system` 라우팅을 사용한다. 각 폴더는 URL 세그먼트에 매핑되는 경로 세그먼트를 나타낸다.

`layout.tsx` 및 `page.tsx` 파일을 사용하여 각 경로에 대해 별도의 UI를 만들 수 있다.
`page.tsx`는 React 컴포넌트를 내보내는 특별한 Next.js 파일이며, 경로에 엑세스하려면 이 파일이 필요하다. 이 파일은 `/`경로와 연결된 홈페이지이다.
중첩된 경로를 만들려면 폴더를 서로 중첩하고 그 안에 `page.tsx`를 추가하면 된다.

| URL                         | DIRECTORY                         | page                            |
| --------------------------- | --------------------------------- | ------------------------------- |
| acme.com                    | app 폴더                          | app/page.tsx                    |
| acme.com/dashboard          | app 폴더 안에 dashboard 폴더      | app/dashboard/page.tsx          |
| acme.com/dashboard/invoices | dashboard 폴더 안에 invoices 폴더 | app/dashboard/invoices/page.tsx |

## Creating the dashboard page

`app` 폴더 내에 `dashboard`라는 폴더를 만들고 `dashboard` 폴더 안에 `page.tsx`파일을 만든다.

```
// /app/dashboard/page.tsx

export default function Page() {
  return <p>Dashboard Page</p>;
}
```

폴더를 사용하여 새 경로 세그먼트를 만들고 그 안에 페이지 파일을 추가하는 것이 Next.js에서 다양한 페이지를 만드는 방법이다.

페이지 파일에 특별한 이름을 지정하여 Next.js를 사용하면 UI 구성 요소, 테스트 파일 및 기타 관련 코드를 경로와 함께 배치할 수 있다.
페이지 파일 내부의 콘텐츠만 공개적으로 액세스할 수 있다.
예를 들어 `/ui` 및 `/lib` 폴더는 경로와 함께 `/app` 폴더 안에 배치된다.

# Creating the dashboard layout

대시보드에는 여러 페이지에서 공유되는 일종의 탐색 기능이 있다.
Next.js에서는 특별한 `layout.tsx` 파일을 사용하여 여러 페이지 간에 공유되는 UI를 만들 수 있다.
대시보드 폴더에 `layout.tsx`라는 새 파일을 추가하고 아래의 코드를 붙여넣는다.

```
// /app/dashboard/layout.tsx

import SideNav from '@/app/ui/dashboard/sidenav';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}
```

`<SideNav/>` 컴포넌트를 레이아웃으로 가져오고 있다. 이 파일로 가져오는 모든 컴포넌트는 레이아웃의 일부가 된다.
`<Layout />` 컴포넌트는 자식 프로퍼티를 받는다. 이 자식은 페이지 또는 다른 레이아웃일 수 있다. 해당 프로젝트의 경우, `/dashboard` 내의 페이지는 다음과 같이 `<Layout />` 안에 자동으로 중첩된다.

- dashboard (폴더)
  - **layout.tsx (파일)**
  - page.tsx (파일) **←**
  - customers (폴더)
    - page.tsx (파일) **←**
  - invoices (폴더)
    - page.tsx (파일) **←**

Next.js에서 레이아웃을 사용하면 탐색 시 페이지 구성 요소만 업데이트되고 레이아웃은 다시 렌더링되지 않는다는 이점이 있다.

이를 부분 렌더링이라고 하며, 페이지 간 전환 시 레이아웃에서 클라이언트 측 React 상태를 유지한다.

## Root layout

3장에서는 `Inter` 글꼴을 다른 레이아웃으로 가져왔다: `/app/layout.tsx`.

```
// /app/layout.tsx

import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
```

이를 루트 레이아웃이라고 하며 모든 Next.js 애플리케이션에 필요하다. 루트 레이아웃에 추가하는 모든 UI는 애플리케이션의 모든 페이지에서 공유된다. 루트 레이아웃을 사용하여 `<html>` 및 `<body>` 태그를 수정하고 메타데이터를 추가할 수 있다.

방금 만든 새 레이아웃(`/app/dashboard/layout.tsx`)은 대시보드 페이지에 고유한 레이아웃이므로 위의 루트 레이아웃에 UI를 추가할 필요가 없다.

# Chapter 5 : Navigating Between Pages

이 장에서는 `next/link` 컴포넌트를 사용하는 방법을 다룬다.
`usePathname()` 훅으로 활성 링크를 표시하는 방법, Next.js에서 탐색이 작동하는 방식을 배운다.

## Why optimize navigation?

페이지 간에 링크하려면 일반적으로 `<a>` HTML 요소를 사용한다.
하지만 `<a>`는 각 페이지 탐색에 전체 페이지 새로고침을 하고 있다.

## The <Link> component

Next.js에서는 `<Link />` 컴포넌트를 사용하여 애플리케이션의 페이지 간에 링크를 연결할 수 있다. `<Link />`를 사용하면 자바스크립트로 클라이언트 측 탐색을 수행할 수 있다.

`<Link />` 컴포넌트를 사용하려면 `/app/ui/dashboard/nav-links.tsx`를 열고 `next/link`에서 `Link` 컴포넌트를 가져온 뒤 `<a>` 태그를 `<Link>`로 바꾼다.

```
// /app/ui/dashboard/nav-links.tsx

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';

// ...

export default function NavLinks() {
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
```

`Link` 구성요소는 `<a>` 태그를 사용하는 것과 비슷하지만 `<a href="...">` 대신 `<Link href="...">`를 사용한다.

작동을 확인해 보면 이제 전체 새로고침 없이 페이지들을 탐색할 수 있게 된다.
애플리케이션의 일부가 서버에서 렌더링되지만 전체 페이지 새로고침이 없으므로 네이티브 웹 앱처럼 느껴진다.

## Automatic code-splitting and prefetching

탐색 환경을 개선하기 위해 Next.js는 경로 세그먼트별로 애플리케이션을 자동으로 코드 분할한다.
이는 브라우저가 초기 페이지 로드 시 모든 애플리케이션 코드를 로드하는 기존의 React SPA와는 다르다.

**경로별로 코드를 분할하면 페이지가 격리**된다. 특정 페이지에서 오류가 발생해도 나머지 애플리케이션은 계속 작동한다. 또한 브라우저가 파싱해야 할 코드가 줄어들어 애플리케이션 속도가 빨라진다. 또한 프**로덕션 환경에서 `<Link>` 컴포넌트가 브라우저의 뷰포트에 나타날 때마다 Next.js는 백그라운드에서 링크된 경로에 대한 코드를 자동으로 prefetching**한다. 사용자가 링크를 클릴할 때쯤이면 대상 페이지의 코드가 이미 백그라운드에서 로드되어 있으므로 페이지 전환이 거의 즉각적으로 이루어진다.

## Pattern : Showing active links

일반적인 UI 패턴은 사용자가 현재 어떤 페이지에 있는지 알려주는 활성 링크를 표시한다. 이렇게 하려면 URL에서 사용자의 현재 경로를 가져와야 한다. Next.js는 경로를 확인하고 이 패턴을 구현하는 데 사용할 수 있는 `usePathname()`이라는 훅을 제공한다.

`usePathname()`은 React 훅이므로 `nav-links.tsx`를 클라이언트 컴포넌트로 전환해야 한다. 파일 상단에 React의 "use client" 지시문을 추가한 다음, `next/navigation`에서 `usePathname()`를 import한다.

```
// /app/ui/dashboard/nav-links.tsx

'use client';

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// ...
```

다음으로, `<NavLinks />` 컴포넌트 내부의 `pathname`이라는 변수에 경로를 할당한다.

```
// /app/ui/dashboard/nav-links.tsx

export default function NavLinks() {
  const pathname = usePathname();
  // ...
}
```

CSS 스타일링 장에서 소개한 clsx 라이브러리를 사용하여 링크가 활성화되어 있을 때 클래스 이름을 조건부로 적용할 수 있다. link.href가 경로명과 일치하면 링크는 파란색 텍스트와 하늘색 배경으로 표시되어야 한다.

```
// /app/ui/dashboard/nav-links.tsx

'use client';

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

// ...

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100 text-blue-600': pathname === link.href,
              },
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
```
