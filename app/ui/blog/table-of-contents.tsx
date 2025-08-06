"use client";

import { useState, useEffect } from "react";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

export default function TableOfContents({ content }: TableOfContentsProps) {
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

  // 활성 ID가 변경될 때 목차를 가운데로 스크롤
  useEffect(() => {
    if (activeId) {
      const tocContainer = document.querySelector(
        ".hidden.lg\\:block.fixed.top-20.right-8"
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
  }, [activeId]);

  if (tocItems.length === 0) {
    return null;
  }

  return (
    <div className="hidden lg:block fixed top-20 right-8 w-64 max-h-[calc(100vh-15rem)] overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10">
      <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center sticky -top-4 bg-white pb-2 border-b border-gray-200 -mx-4 px-4 pt-2">
        <ChevronRightIcon className="w-4 h-4 mr-2" />
        목차
      </h2>
      <nav className="space-y-1">
        {tocItems.map((item, index) => (
          <Link
            key={index}
            href={`#${item.id}`}
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
  );
}
