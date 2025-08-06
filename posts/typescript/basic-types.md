---
title: "TypeScript 기본 타입 완벽 가이드"
description: "TypeScript의 기본 타입들을 자세히 알아보고 실제 사용법을 배워봅니다."
date: "2024-01-10"
readTime: "6분"
tags: ["TypeScript", "JavaScript", "Programming"]
---

# TypeScript 기본 타입 완벽 가이드

TypeScript는 JavaScript에 정적 타입 검사를 추가한 프로그래밍 언어입니다.

## 기본 타입들

### 1. 원시 타입 (Primitive Types)

```typescript
let name: string = "홍길동";
let age: number = 25;
let isStudent: boolean = true;
let nothing: null = null;
let undefinedValue: undefined = undefined;
let bigNumber: bigint = 100n;
let symbol: symbol = Symbol("description");
```

### 2. 배열 타입

```typescript
let numbers: number[] = [1, 2, 3, 4, 5];
let strings: Array<string> = ["hello", "world"];
let mixed: (string | number)[] = ["hello", 123, "world"];
```

### 3. 객체 타입

```typescript
let person: {
  name: string;
  age: number;
  email?: string; // 선택적 속성
} = {
  name: "홍길동",
  age: 25,
};
```

## 타입 추론

TypeScript는 자동으로 타입을 추론합니다.

```typescript
let message = "Hello World"; // string으로 자동 추론
let count = 42; // number로 자동 추론
let isActive = true; // boolean으로 자동 추론
```

## 유니온 타입

여러 타입을 허용할 수 있습니다.

```typescript
let id: string | number = "abc123";
id = 123; // 가능

function processId(id: string | number) {
  if (typeof id === "string") {
    return id.toUpperCase();
  } else {
    return id.toString();
  }
}
```

## 결론

TypeScript의 기본 타입을 이해하면 더 안전하고 유지보수하기 쉬운 코드를 작성할 수 있습니다.
