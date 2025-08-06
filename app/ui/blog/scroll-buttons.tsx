"use client";

import { useState, useEffect } from "react";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  ListBulletIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface ScrollButtonsProps {
  content: string;
}

export default function ScrollButtons({ content }: ScrollButtonsProps) {
  const [showToc, setShowToc] = useState(false);
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  // 마크다운에서 헤딩 추출
  useEffect(() => {
    const headings = content
      .split("\n")
      .filter((line) => line.startsWith("#"))
      .map((line) => {
        const level = line.match(/^#+/)?.[0].length || 1;
        const text = line.replace(/^#+\s*/, "").trim();
        const id = text
          .toLowerCase()
          .replace(/[^a-z0-9가-힣\s]/g, "")
          .replace(/\s+/g, "-");
        return { id, text, level };
      })
      .filter((item) => item.text.length > 0);

    setTocItems(headings);
  }, [content]);

  // 스크롤 시 활성 헤딩 감지
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0px -35% 0px",
      }
    );

    tocItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [tocItems]);

  // 활성 ID가 변경될 때 모바일 목차를 가운데로 스크롤
  useEffect(() => {
    if (activeId && showToc) {
      const tocContainer = document.querySelector(
        ".fixed.bottom-20.left-4.right-4.bg-white"
      );
      const activeLink = tocContainer?.querySelector(
        `a[href="#${activeId}"]`
      ) as HTMLElement;

      if (tocContainer && activeLink) {
        const containerRect = tocContainer.getBoundingClientRect();
        const linkRect = activeLink.getBoundingClientRect();
        const containerCenter = containerRect.height / 2;
        const linkCenter =
          linkRect.top - containerRect.top + linkRect.height / 2;
        const scrollOffset = linkCenter - containerCenter;

        tocContainer.scrollTo({
          top: tocContainer.scrollTop + scrollOffset,
          behavior: "smooth",
        });
      }
    }
  }, [activeId, showToc]);

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

  const toggleToc = () => {
    setShowToc(!showToc);
  };

  const closeToc = () => {
    setShowToc(false);
  };

  return (
    <>
      {/* 모바일용 목차 오버레이 */}
      <div className="lg:hidden">
        {showToc && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={closeToc}
          >
            <div
              className="fixed bottom-20 left-4 right-4 bg-white rounded-lg shadow-lg p-4 max-h-96 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">목차</h3>
                <button
                  onClick={closeToc}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <XMarkIcon className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <nav className="space-y-1">
                {tocItems.map((item, index) => (
                  <Link
                    key={index}
                    href={`#${item.id}`}
                    onClick={closeToc}
                    className={`block text-sm transition-colors hover:text-blue-600 ${
                      activeId === item.id
                        ? "text-blue-700 font-bold bg-blue-50 border-l-4 border-blue-600 pl-3 py-1 rounded-r"
                        : "text-gray-600"
                    }`}
                    style={{ paddingLeft: `${(item.level - 1) * 12}px` }}
                  >
                    {item.text}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        )}
      </div>

      {/* 플로팅 버튼들 - 모든 화면에서 우측 하단 */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        {/* 모바일에서만 목차 토글 버튼 표시 */}
        <div className="lg:hidden">
          <button
            onClick={toggleToc}
            className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors"
            title="목차 보기"
          >
            <ListBulletIcon className="w-6 h-6" />
          </button>
        </div>

        {/* 상단 이동 버튼 - 모든 화면에서 표시 */}
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

        {/* 하단 이동 버튼 - 모든 화면에서 표시 */}
        <button
          onClick={() => {
            console.log("하단 버튼 클릭됨!");
            scrollToBottom();
          }}
          className="w-12 h-12 bg-gray-600 hover:bg-gray-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors cursor-pointer"
          title="하단으로 이동"
        >
          <ChevronDownIcon className="w-6 h-6" />
        </button>
      </div>
    </>
  );
}
