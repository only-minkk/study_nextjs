---
title: "Tailwind CSS 실전 팁 10가지"
description: "Tailwind CSS를 더 효율적으로 사용하는 실전 팁들을 공유합니다."
date: "2024-01-08"
readTime: "6분"
tags: ["Tailwind CSS", "CSS", "UI/UX", "Frontend"]
---

# Tailwind CSS 실전 팁 10가지

Tailwind CSS를 사용하면서 발견한 유용한 팁들을 공유합니다.

## 1. 커스텀 클래스 만들기

```css
@layer components {
  .btn-primary {
    @apply bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors;
  }
}
```

## 2. 반응형 디자인 패턴

```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <!-- 반응형 그리드 -->
</div>
```

## 3. 다크모드 지원

```html
<div class="bg-white dark:bg-gray-900 text-black dark:text-white">
  <!-- 다크모드 자동 전환 -->
</div>
```

## 4. 애니메이션 활용

```html
<button class="transform hover:scale-105 transition-transform duration-200">
  호버 시 확대 효과
</button>
```

## 5. 그라데이션 활용

```html
<div class="bg-gradient-to-r from-blue-500 to-purple-600">
  아름다운 그라데이션
</div>
```

## 결론

Tailwind CSS의 유틸리티 클래스를 잘 활용하면 빠르고 일관된 UI를 개발할 수 있습니다.
