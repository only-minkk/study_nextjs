# 블로그 스크롤 기능 트러블슈팅

## 문제 상황

블로그 포스트 페이지에 상단/하단 이동 버튼을 구현했지만, 버튼을 클릭해도 스크롤이 동작하지 않는 문제가 발생했습니다.

## 초기 구현 시도

### 1차 시도: 전체 페이지 스크롤

```typescript
const scrollToTop = () => {
  console.log("상단으로 이동 시도");
  try {
    // 여러 방법 시도
    if (document.documentElement.scrollTop > 0) {
      document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
    } else if (document.body.scrollTop > 0) {
      document.body.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    console.log("상단 이동 완료");
  } catch (error) {
    console.error("상단 이동 실패:", error);
    // fallback: 즉시 이동
    window.scrollTo(0, 0);
  }
};

const scrollToBottom = () => {
  console.log("하단으로 이동 시도");
  try {
    const docHeight = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight
    );
    console.log("문서 높이:", docHeight);

    // 여러 방법 시도
    if (document.documentElement.scrollHeight > 0) {
      document.documentElement.scrollTo({
        top: docHeight,
        behavior: "smooth",
      });
    } else if (document.body.scrollHeight > 0) {
      document.body.scrollTo({
        top: docHeight,
        behavior: "smooth",
      });
    } else {
      window.scrollTo({
        top: docHeight,
        behavior: "smooth",
      });
    }
    console.log("하단 이동 완료");
  } catch (error) {
    console.error("하단 이동 실패:", error);
    // fallback: 즉시 이동
    const docHeight = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight
    );
    window.scrollTo(0, docHeight);
  }
};
```

**문제점**: 전체 페이지(`document.documentElement`, `document.body`, `window`)에서 스크롤을 시도했지만 동작하지 않음.

### 2차 시도: 디버깅 로그 추가

버튼 클릭 이벤트가 제대로 발생하는지 확인하기 위해 디버깅 로그를 추가했습니다:

```typescript
<button
  onClick={() => {
    console.log("상단 버튼 클릭됨!");
    scrollToTop();
  }}
  className="w-12 h-12 bg-gray-600 hover:bg-gray-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors cursor-pointer"
  title="상단으로 이동"
>
  <ChevronUpIcon className="w-6 h-6" />
</button>
```

**결과**: 버튼 클릭은 정상적으로 감지되었지만, 스크롤은 여전히 동작하지 않음.

## 문제 원인 발견

사용자가 "전체 페이지의 스크롤을 이동할게 아니라 블로그 포스트 페이지 컴포넌트의 스크롤을 이동해야되는데"라고 지적한 것을 통해 문제를 파악했습니다.

### 블로그 레이아웃 구조 분석

`app/blog/layout.tsx` 파일을 확인한 결과:

```tsx
export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

**핵심 발견**:

- 사이드바는 `flex-none`으로 고정
- 블로그 컨텐츠 영역은 `flex-grow md:overflow-y-auto`로 설정
- **실제 스크롤은 `md:overflow-y-auto`가 적용된 컨테이너에서 발생**

## 해결 방법

### 올바른 스크롤 컨테이너 찾기

CSS 선택자를 사용하여 블로그 컨텐츠 컨테이너를 찾도록 수정:

```typescript
const scrollToTop = () => {
  console.log("상단으로 이동 시도");
  try {
    // 블로그 컨텐츠 컨테이너 찾기
    const blogContainer = document.querySelector(
      ".flex-grow.md\\:overflow-y-auto"
    );
    console.log("블로그 컨테이너:", blogContainer);

    if (blogContainer) {
      // 블로그 컨테이너에서 스크롤
      blogContainer.scrollTo({ top: 0, behavior: "smooth" });
      console.log("블로그 컨테이너 상단 이동 완료");
    } else {
      // fallback: 전체 페이지 스크롤
      window.scrollTo({ top: 0, behavior: "smooth" });
      console.log("전체 페이지 상단 이동 완료");
    }
  } catch (error) {
    console.error("상단 이동 실패:", error);
    // fallback: 즉시 이동
    const blogContainer = document.querySelector(
      ".flex-grow.md\\:overflow-y-auto"
    );
    if (blogContainer) {
      blogContainer.scrollTo(0, 0);
    } else {
      window.scrollTo(0, 0);
    }
  }
};

const scrollToBottom = () => {
  console.log("하단으로 이동 시도");
  try {
    // 블로그 컨텐츠 컨테이너 찾기
    const blogContainer = document.querySelector(
      ".flex-grow.md\\:overflow-y-auto"
    );
    console.log("블로그 컨테이너:", blogContainer);

    if (blogContainer) {
      // 블로그 컨테이너에서 스크롤
      const containerHeight = blogContainer.scrollHeight;
      console.log("컨테이너 높이:", containerHeight);
      blogContainer.scrollTo({
        top: containerHeight,
        behavior: "smooth",
      });
      console.log("블로그 컨테이너 하단 이동 완료");
    } else {
      // fallback: 전체 페이지 스크롤
      const docHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight
      );
      console.log("문서 높이:", docHeight);
      window.scrollTo({
        top: docHeight,
        behavior: "smooth",
      });
      console.log("전체 페이지 하단 이동 완료");
    }
  } catch (error) {
    console.error("하단 이동 실패:", error);
    // fallback: 즉시 이동
    const blogContainer = document.querySelector(
      ".flex-grow.md\\:overflow-y-auto"
    );
    if (blogContainer) {
      blogContainer.scrollTo(0, blogContainer.scrollHeight);
    } else {
      const docHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight
      );
      window.scrollTo(0, docHeight);
    }
  }
};
```

## 적용된 파일들

### 1. `app/ui/blog/floating-buttons.tsx` (모바일용)

- 모바일에서만 표시되는 플로팅 버튼들
- 목차 토글, 상단 이동, 하단 이동 버튼 포함
- 위의 수정된 스크롤 로직 적용

### 2. `app/ui/blog/desktop-scroll-buttons.tsx` (데스크톱용)

- 데스크톱에서만 표시되는 스크롤 버튼들
- 상단 이동, 하단 이동 버튼만 포함
- 동일한 스크롤 로직 적용

## 핵심 학습 포인트

### 1. Next.js 레이아웃 구조 이해

- Next.js의 레이아웃 시스템에서 실제 스크롤이 발생하는 컨테이너를 정확히 파악해야 함
- `overflow-y-auto`가 적용된 컨테이너가 실제 스크롤 컨테이너

### 2. CSS 선택자 사용

- Tailwind CSS 클래스명을 JavaScript에서 사용할 때 이스케이프 처리 필요
- `.flex-grow.md\\:overflow-y-auto` 형태로 사용

### 3. Fallback 처리

- 블로그 컨테이너를 찾지 못할 경우 전체 페이지 스크롤로 fallback
- 에러 발생 시 즉시 이동으로 fallback

### 4. 디버깅 방법

- `console.log`를 통한 단계별 디버깅
- 컨테이너 찾기, 높이 계산, 스크롤 완료 등 각 단계별 로그

## 최종 결과

이제 블로그 포스트 페이지에서 상단/하단 이동 버튼이 정상적으로 작동합니다:

- **모바일**: 우측 하단에 3개의 플로팅 버튼 (목차 토글, 상단 이동, 하단 이동)
- **데스크톱**: 좌측 하단에 2개의 플로팅 버튼 (상단 이동, 하단 이동)
- **스크롤 대상**: 블로그 컨텐츠 영역만 스크롤 (사이드바는 고정)

## 참고 사항

- CSS 선택자에서 `md:` 같은 반응형 클래스는 `\\:` 형태로 이스케이프 처리
- `scrollTo()` 메서드의 `behavior: "smooth"` 옵션으로 부드러운 스크롤 효과
- `scrollHeight` 속성으로 컨테이너의 전체 높이 계산
