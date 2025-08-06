import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface BlogPost {
  id: string;
  title: string;
  description: string;
  content: string;
  date: string;
  category: string;
  subcategory?: string;
  readTime: string;
  tags: string[];
  slug: string;
  published: boolean; // true: 공개, false: 비공개
}

export interface BlogCategory {
  name: string;
  slug: string;
  postCount: number;
  subcategories?: BlogCategory[];
}

const postsDirectory = path.join(process.cwd(), "posts");

// 재귀적으로 디렉토리를 탐색하여 카테고리 구조 생성
function buildCategoryStructure(
  dirPath: string,
  relativePath: string = ""
): BlogCategory[] {
  if (!fs.existsSync(dirPath)) {
    return [];
  }

  const categories: BlogCategory[] = [];
  const items = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const item of items) {
    if (item.isDirectory()) {
      const categoryPath = path.join(dirPath, item.name);
      const categoryRelativePath = relativePath
        ? `${relativePath}/${item.name}`
        : item.name;

      // 해당 디렉토리와 하위 디렉토리의 공개 포스트 수만 계산
      const allPosts = collectAllPosts(categoryPath, categoryRelativePath);
      const publishedPosts = allPosts.filter((post) => post.published);
      const postCount = publishedPosts.length;

      // // 디버깅 로그 추가
      // if (item.name === "nextjs") {
      //   console.log("=== Next.js 카테고리 디버깅 ===");
      //   console.log("전체 포스트:", allPosts.length);
      //   allPosts.forEach((post) => {
      //     console.log(`- ${post.title}: published=${post.published}`);
      //   });
      //   console.log("공개 포스트:", publishedPosts.length);
      //   console.log("최종 카운트:", postCount);
      // }

      // 하위 디렉토리 탐색
      const subcategories = buildCategoryStructure(
        categoryPath,
        categoryRelativePath
      );

      const category: BlogCategory = {
        name: item.name,
        slug: item.name,
        postCount: postCount,
      };

      // 하위 카테고리가 있으면 추가
      if (subcategories.length > 0) {
        category.subcategories = subcategories;
      }

      categories.push(category);
    }
  }

  return categories;
}

// 재귀적으로 모든 포스트 수집
function collectAllPosts(
  dirPath: string,
  relativePath: string = ""
): BlogPost[] {
  if (!fs.existsSync(dirPath)) {
    return [];
  }

  const posts: BlogPost[] = [];
  const items = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const item of items) {
    if (item.isDirectory()) {
      const categoryPath = path.join(dirPath, item.name);
      const categoryRelativePath = relativePath
        ? `${relativePath}/${item.name}`
        : item.name;

      // 하위 디렉토리 재귀 탐색
      const subPosts = collectAllPosts(categoryPath, categoryRelativePath);
      posts.push(...subPosts);
    } else if (item.name.endsWith(".md")) {
      const filePath = path.join(dirPath, item.name);
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(fileContents);

      const slug = item.name.replace(/\.md$/, "");

      // 카테고리 경로 처리 - 완전히 새로 작성
      let category: string;
      let subcategory: string | undefined;

      // postsDirectory에서 시작하는 경우
      if (dirPath === postsDirectory) {
        // 루트 디렉토리에 직접 .md 파일이 있는 경우는 없으므로 이 부분은 실행되지 않음
        category = "unknown";
        subcategory = undefined;
      } else {
        // 하위 디렉토리에 있는 경우
        const pathParts = dirPath.split(path.sep);
        const postsIndex = pathParts.indexOf("posts");

        if (postsIndex !== -1 && postsIndex < pathParts.length - 1) {
          // posts 폴더 다음의 디렉토리가 카테고리
          category = pathParts[postsIndex + 1];

          // posts 폴더 다음에 더 많은 디렉토리가 있으면 첫 번째가 서브카테고리
          if (postsIndex + 2 < pathParts.length) {
            subcategory = pathParts[postsIndex + 2];
          } else {
            subcategory = undefined;
          }
        } else {
          // 폴백: 현재 디렉토리 이름을 카테고리로 사용
          category = path.basename(dirPath);
          subcategory = undefined;
        }
      }

      // published 필드 명시적 처리
      const published =
        data.published === false
          ? false
          : data.published === true
          ? true
          : true;

      posts.push({
        id: `${category}-${subcategory ? `${subcategory}-` : ""}${slug}`,
        title: data.title || "제목 없음",
        description: data.description || "",
        content,
        date: data.date || new Date().toISOString().split("T")[0],
        category,
        subcategory,
        readTime: data.readTime || "5분",
        tags: data.tags || [],
        slug,
        published, // 명시적으로 처리된 값 사용
      });
    }
  }

  return posts;
}

export function getAllCategories(): BlogCategory[] {
  return buildCategoryStructure(postsDirectory);
}

export function getAllPosts(): BlogPost[] {
  const posts = collectAllPosts(postsDirectory);

  // 날짜순으로 정렬 (최신순)
  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

// 공개 포스트만 반환
export function getPublishedPosts(): BlogPost[] {
  const posts = getAllPosts();
  return posts.filter((post) => post.published);
}

// 모든 포스트 반환 (관리자용)
export function getAllPostsIncludingPrivate(): BlogPost[] {
  return getAllPosts();
}

export function getPostsByCategory(
  category: string,
  subcategory?: string
): BlogPost[] {
  const allPosts = getPublishedPosts(); // 공개 포스트만

  if (subcategory) {
    return allPosts.filter(
      (post) => post.category === category && post.subcategory === subcategory
    );
  }

  return allPosts.filter((post) => post.category === category);
}

// 비공개 포스트 포함하여 카테고리별 포스트 반환 (관리자용)
export function getPostsByCategoryIncludingPrivate(
  category: string,
  subcategory?: string
): BlogPost[] {
  const allPosts = getAllPosts(); // 모든 포스트

  if (subcategory) {
    return allPosts.filter(
      (post) => post.category === category && post.subcategory === subcategory
    );
  }

  return allPosts.filter((post) => post.category === category);
}

export function getPostBySlug(
  category: string,
  slug: string,
  subcategory?: string
): BlogPost | null {
  const allPosts = getPublishedPosts(); // 공개 포스트만

  // 먼저 정확한 매칭을 시도
  if (subcategory) {
    const post = allPosts.find(
      (post) =>
        post.category === category &&
        post.subcategory === subcategory &&
        post.slug === slug
    );
    if (post) return post;
  }

  // 서브카테고리가 없는 경우 또는 서브카테고리 매칭이 실패한 경우
  const post = allPosts.find(
    (post) => post.category === category && post.slug === slug
  );
  return post || null;
}

// 비공개 포스트 포함하여 포스트 검색 (관리자용)
export function getPostBySlugIncludingPrivate(
  category: string,
  slug: string,
  subcategory?: string
): BlogPost | null {
  const allPosts = getAllPosts(); // 모든 포스트

  // 먼저 정확한 매칭을 시도
  if (subcategory) {
    const post = allPosts.find(
      (post) =>
        post.category === category &&
        post.subcategory === subcategory &&
        post.slug === slug
    );
    if (post) return post;
  }

  // 서브카테고리가 없는 경우 또는 서브카테고리 매칭이 실패한 경우
  const post = allPosts.find(
    (post) => post.category === category && post.slug === slug
  );
  return post || null;
}
