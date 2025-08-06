"use client";

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  DocumentTextIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import clsx from "clsx";

// 블로그 전용 네비게이션 - 메인 링크는 제거
const mainLinks: any[] = [];

// 임시 카테고리 데이터 (API 호출이 안 될 때 사용)
const fallbackCategories = [
  {
    name: "Next.js",
    slug: "nextjs",
    postCount: 2,
    subcategories: [{ name: "Basics", slug: "basics", postCount: 1 }],
  },
  { name: "TypeScript", slug: "typescript", postCount: 1 },
  { name: "CSS", slug: "css", postCount: 1 },
  { name: "Git", slug: "git", postCount: 1 },
];

interface BlogCategory {
  name: string;
  slug: string;
  postCount: number;
  subcategories?: BlogCategory[];
}

export default function NavLinks() {
  const pathname = usePathname();
  const [blogCategories, setBlogCategories] =
    useState<BlogCategory[]>(fallbackCategories);
  const [isBlogExpanded, setIsBlogExpanded] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );

  // 블로그 카테고리 로드
  useEffect(() => {
    const loadBlogCategories = async () => {
      try {
        const response = await fetch("/api/blog/categories");
        if (response.ok) {
          const categories = await response.json();
          setBlogCategories(categories);
        }
      } catch (error) {
        console.error("Failed to load blog categories:", error);
        // API 호출이 실패하면 fallback 데이터 사용
        setBlogCategories(fallbackCategories);
      }
    };

    loadBlogCategories();
  }, []);

  // 블로그 관련 경로인지 확인
  const isBlogPath = pathname.startsWith("/blog");

  // 카테고리 토글 함수
  const toggleCategory = (categorySlug: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categorySlug)) {
      newExpanded.delete(categorySlug);
    } else {
      newExpanded.add(categorySlug);
    }
    setExpandedCategories(newExpanded);
  };

  // 중첩 카테고리 렌더링 함수
  const renderSubcategories = (
    subcategories: BlogCategory[],
    parentSlug: string,
    level: number = 1
  ) => {
    return subcategories.map((subcategory) => {
      const isExpanded = expandedCategories.has(
        `${parentSlug}-${subcategory.slug}`
      );
      const hasSubcategories =
        subcategory.subcategories && subcategory.subcategories.length > 0;

      return (
        <div key={`${parentSlug}-${subcategory.slug}`}>
          <div className="flex items-center">
            {hasSubcategories ? (
              <button
                onClick={() =>
                  toggleCategory(`${parentSlug}-${subcategory.slug}`)
                }
                className={clsx(
                  "flex h-[36px] w-full items-center gap-2 rounded-md px-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600",
                  {
                    "bg-sky-100 text-blue-600": pathname.startsWith(
                      `/dashboard/blog/${parentSlug}/${subcategory.slug}`
                    ),
                  }
                )}
              >
                <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                <span>{subcategory.name}</span>
                <span className="ml-auto text-xs text-gray-500">
                  ({subcategory.postCount})
                </span>
                {isExpanded ? (
                  <ChevronDownIcon className="w-3" />
                ) : (
                  <ChevronRightIcon className="w-3" />
                )}
              </button>
            ) : (
              <Link
                href={`/blog/${parentSlug}/${subcategory.slug}`}
                className={clsx(
                  "flex h-[36px] w-full items-center gap-2 rounded-md px-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600",
                  {
                    "bg-sky-100 text-blue-600": pathname.startsWith(
                      `/blog/${parentSlug}/${subcategory.slug}`
                    ),
                  }
                )}
              >
                <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                <span>{subcategory.name}</span>
                <span className="ml-auto text-xs text-gray-500">
                  ({subcategory.postCount})
                </span>
              </Link>
            )}
          </div>

          {hasSubcategories && isExpanded && (
            <div className="ml-4 mt-1 space-y-1">
              {renderSubcategories(
                subcategory.subcategories!,
                `${parentSlug}/${subcategory.slug}`,
                level + 1
              )}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <>
      {/* 블로그 섹션 */}
      <div>
        {/* 블로그 메인 링크 */}
        <button
          onClick={() => setIsBlogExpanded(!isBlogExpanded)}
          className={clsx(
            "flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3",
            {
              "bg-sky-100 text-blue-600": isBlogPath,
            }
          )}
        >
          <DocumentTextIcon className="w-6" />
          <p className="hidden md:block">Blog</p>
          {isBlogExpanded ? (
            <ChevronDownIcon className="w-4 ml-auto" />
          ) : (
            <ChevronRightIcon className="w-4 ml-auto" />
          )}
        </button>

        {/* 블로그 하위 카테고리들 */}
        {isBlogExpanded && (
          <div className="ml-4 mt-2 space-y-1">
            <Link
              href="/blog"
              className={clsx(
                "flex h-[40px] items-center gap-2 rounded-md px-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600",
                {
                  "bg-sky-100 text-blue-600": pathname === "/blog",
                }
              )}
            >
              <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
              <span>전체 보기</span>
            </Link>

            {blogCategories.map((category) => {
              const isExpanded = expandedCategories.has(category.slug);
              const hasSubcategories =
                category.subcategories && category.subcategories.length > 0;

              return (
                <div key={category.slug}>
                  <div className="flex items-center">
                    <div className="flex-1">
                      <Link
                        href={`/blog/${category.slug}`}
                        className={clsx(
                          "flex h-[40px] w-full items-center gap-2 rounded-md px-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600",
                          {
                            "bg-sky-100 text-blue-600": pathname.startsWith(
                              `/blog/${category.slug}`
                            ),
                          }
                        )}
                      >
                        <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                        <span>{category.name}</span>
                        <span className="ml-auto text-xs text-gray-500">
                          ({category.postCount})
                        </span>
                      </Link>
                    </div>

                    {hasSubcategories && (
                      <button
                        onClick={() => toggleCategory(category.slug)}
                        className="ml-1 p-1 hover:bg-sky-100 rounded"
                      >
                        {isExpanded ? (
                          <ChevronDownIcon className="w-3" />
                        ) : (
                          <ChevronRightIcon className="w-3" />
                        )}
                      </button>
                    )}
                  </div>

                  {hasSubcategories && isExpanded && (
                    <div className="ml-4 mt-1 space-y-1">
                      {renderSubcategories(
                        category.subcategories!,
                        category.slug
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
