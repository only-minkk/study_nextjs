import {
  getPostBySlug,
  getAllPosts,
  getAllCategories,
  getPostsByCategory,
} from "@/app/lib/blog-loader";
import { Badge } from "@/app/ui/badge";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/ui/card";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import TableOfContents from "@/app/ui/blog/table-of-contents";
import ScrollButtons from "@/app/ui/blog/scroll-buttons";

interface BlogPageProps {
  params: Promise<{
    category: string;
    slug: string[];
  }>;
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { category, slug } = await params;

  // slug 배열을 분석하여 페이지 타입 결정
  if (slug.length === 1) {
    // 단일 slug: /category/slug
    // 먼저 포스트인지 확인
    const post = getPostBySlug(category, slug[0]);

    if (post) {
      // 포스트 페이지
      return (
        <div className="w-full max-w-4xl mx-auto lg:pr-80">
          <article className="prose prose-lg max-w-none">
            {/* 헤더 */}
            <header className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary">
                  {post.subcategory
                    ? `${post.category} / ${post.subcategory}`
                    : post.category}
                </Badge>
                <span className="text-gray-500 text-sm">{post.readTime}</span>
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {post.title}
              </h1>

              <p className="text-xl text-gray-600 mb-6">{post.description}</p>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{post.date}</span>
                <div className="flex gap-2">
                  {post.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </header>

            {/* 목차 */}
            <TableOfContents content={post.content} />

            {/* 플로팅 버튼들 */}
            <ScrollButtons content={post.content} />

            {/* 콘텐츠 */}
            <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-code:text-gray-800 prose-pre:bg-gray-100 prose-pre:border prose-pre:border-gray-200 overflow-hidden">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => {
                    const id = children
                      ?.toString()
                      .toLowerCase()
                      .replace(/[^a-z0-9가-힣\s]/g, "")
                      .replace(/\s+/g, "-");
                    return (
                      <h1
                        id={id}
                        className="text-3xl font-bold text-gray-900 mt-8 mb-4 break-words"
                      >
                        {children}
                      </h1>
                    );
                  },
                  h2: ({ children }) => {
                    const id = children
                      ?.toString()
                      .toLowerCase()
                      .replace(/[^a-z0-9가-힣\s]/g, "")
                      .replace(/\s+/g, "-");
                    return (
                      <h2
                        id={id}
                        className="text-2xl font-bold text-gray-900 mt-6 mb-3 break-words"
                      >
                        {children}
                      </h2>
                    );
                  },
                  h3: ({ children }) => {
                    const id = children
                      ?.toString()
                      .toLowerCase()
                      .replace(/[^a-z0-9가-힣\s]/g, "")
                      .replace(/\s+/g, "-");
                    return (
                      <h3
                        id={id}
                        className="text-xl font-bold text-gray-900 mt-5 mb-2 break-words"
                      >
                        {children}
                      </h3>
                    );
                  },
                  h4: ({ children }) => {
                    const id = children
                      ?.toString()
                      .toLowerCase()
                      .replace(/[^a-z0-9가-힣\s]/g, "")
                      .replace(/\s+/g, "-");
                    return (
                      <h4
                        id={id}
                        className="text-lg font-bold text-gray-900 mt-4 mb-2 break-words"
                      >
                        {children}
                      </h4>
                    );
                  },
                  h5: ({ children }) => {
                    const id = children
                      ?.toString()
                      .toLowerCase()
                      .replace(/[^a-z0-9가-힣\s]/g, "")
                      .replace(/\s+/g, "-");
                    return (
                      <h5
                        id={id}
                        className="text-base font-bold text-gray-900 mt-3 mb-2 break-words"
                      >
                        {children}
                      </h5>
                    );
                  },
                  h6: ({ children }) => {
                    const id = children
                      ?.toString()
                      .toLowerCase()
                      .replace(/[^a-z0-9가-힣\s]/g, "")
                      .replace(/\s+/g, "-");
                    return (
                      <h6
                        id={id}
                        className="text-sm font-bold text-gray-900 mt-3 mb-2 break-words"
                      >
                        {children}
                      </h6>
                    );
                  },
                  p: ({ children }) => (
                    <p className="text-gray-700 mb-4 leading-relaxed break-words">
                      {children}
                    </p>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-bold text-gray-900">
                      {children}
                    </strong>
                  ),
                  em: ({ children }) => (
                    <em className="italic text-gray-700">{children}</em>
                  ),
                  code: ({ className, children }) => {
                    const isInline = !className;
                    return (
                      <code
                        className={`${
                          isInline
                            ? "text-red-600 bg-red-50 px-1 py-0.5 rounded text-sm"
                            : "text-gray-800"
                        } break-words`}
                      >
                        {children}
                      </code>
                    );
                  },
                  pre: ({ children }) => (
                    <pre className="bg-gray-100 border border-gray-200 rounded-lg p-4 mb-4 overflow-x-auto whitespace-pre-wrap break-words">
                      {children}
                    </pre>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside mb-4 space-y-1 [&>li>ul]:ml-4">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside mb-4 space-y-1 [&>li>ol]:ml-4">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-gray-700 break-words">{children}</li>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-gray-300 pl-4 py-2 mb-4 bg-gray-50 italic text-gray-700 break-words">
                      {children}
                    </blockquote>
                  ),
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </article>
        </div>
      );
    } else {
      // 서브카테고리 페이지인지 확인
      const allCategories = getAllCategories();
      const categoryInfo = allCategories.find((cat) => cat.slug === category);
      const subcategoryInfo = categoryInfo?.subcategories?.find(
        (sub) => sub.slug === slug[0]
      );

      if (subcategoryInfo) {
        // 서브카테고리 페이지
        const posts = getPostsByCategory(category, slug[0]);

        return (
          <div className="w-full">
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <Link
                  href="/blog"
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  ← 블로그로 돌아가기
                </Link>
                <span className="text-gray-400">/</span>
                <Link
                  href={`/blog/${category}`}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  {categoryInfo?.name || category}
                </Link>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {subcategoryInfo.name}
              </h1>
              <p className="text-gray-600">
                {subcategoryInfo.postCount}개의 포스트
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.category}/${post.subcategory}/${post.slug}`}
                  className="block"
                >
                  <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {post.category} / {post.subcategory}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {post.readTime}
                        </span>
                      </div>
                      <CardTitle className="text-lg leading-tight">
                        {post.title}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {post.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {post.date}
                        </span>
                        <div className="flex gap-1">
                          {post.tags.slice(0, 2).map((tag, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {posts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600">
                  이 서브카테고리에는 아직 포스트가 없습니다.
                </p>
              </div>
            )}
          </div>
        );
      }
    }
  } else if (slug.length === 2) {
    // 이중 slug: /category/subcategory/slug (서브카테고리 포스트 페이지)
    const post = getPostBySlug(category, slug[1], slug[0]);

    if (!post) {
      notFound();
    }

    return (
      <div className="w-full max-w-4xl mx-auto lg:pr-80">
        <article className="prose prose-lg max-w-none">
          {/* 헤더 */}
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary">
                {post.category} / {post.subcategory}
              </Badge>
              <span className="text-gray-500 text-sm">{post.readTime}</span>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>

            <p className="text-xl text-gray-600 mb-6">{post.description}</p>

            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>{post.date}</span>
              <div className="flex gap-2">
                {post.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </header>

          {/* 목차 */}
          <TableOfContents content={post.content} />

          {/* 플로팅 버튼들 */}
          <ScrollButtons content={post.content} />

          {/* 콘텐츠 */}
          <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-code:text-gray-800 prose-pre:bg-gray-100 prose-pre:border prose-pre:border-gray-200 overflow-hidden">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => {
                  const id = children
                    ?.toString()
                    .toLowerCase()
                    .replace(/[^a-z0-9가-힣\s]/g, "")
                    .replace(/\s+/g, "-");
                  return (
                    <h1
                      id={id}
                      className="text-3xl font-bold text-gray-900 mt-8 mb-4 break-words"
                    >
                      {children}
                    </h1>
                  );
                },
                h2: ({ children }) => {
                  const id = children
                    ?.toString()
                    .toLowerCase()
                    .replace(/[^a-z0-9가-힣\s]/g, "")
                    .replace(/\s+/g, "-");
                  return (
                    <h2
                      id={id}
                      className="text-2xl font-bold text-gray-900 mt-6 mb-3 break-words"
                    >
                      {children}
                    </h2>
                  );
                },
                h3: ({ children }) => {
                  const id = children
                    ?.toString()
                    .toLowerCase()
                    .replace(/[^a-z0-9가-힣\s]/g, "")
                    .replace(/\s+/g, "-");
                  return (
                    <h3
                      id={id}
                      className="text-xl font-bold text-gray-900 mt-5 mb-2 break-words"
                    >
                      {children}
                    </h3>
                  );
                },
                h4: ({ children }) => {
                  const id = children
                    ?.toString()
                    .toLowerCase()
                    .replace(/[^a-z0-9가-힣\s]/g, "")
                    .replace(/\s+/g, "-");
                  return (
                    <h4
                      id={id}
                      className="text-lg font-bold text-gray-900 mt-4 mb-2 break-words"
                    >
                      {children}
                    </h4>
                  );
                },
                h5: ({ children }) => {
                  const id = children
                    ?.toString()
                    .toLowerCase()
                    .replace(/[^a-z0-9가-힣\s]/g, "")
                    .replace(/\s+/g, "-");
                  return (
                    <h5
                      id={id}
                      className="text-base font-bold text-gray-900 mt-3 mb-2 break-words"
                    >
                      {children}
                    </h5>
                  );
                },
                h6: ({ children }) => {
                  const id = children
                    ?.toString()
                    .toLowerCase()
                    .replace(/[^a-z0-9가-힣\s]/g, "")
                    .replace(/\s+/g, "-");
                  return (
                    <h6
                      id={id}
                      className="text-sm font-bold text-gray-900 mt-3 mb-2 break-words"
                    >
                      {children}
                    </h6>
                  );
                },
                p: ({ children }) => (
                  <p className="text-gray-700 mb-4 leading-relaxed break-words">
                    {children}
                  </p>
                ),
                strong: ({ children }) => (
                  <strong className="font-bold text-gray-900">
                    {children}
                  </strong>
                ),
                em: ({ children }) => (
                  <em className="italic text-gray-800">{children}</em>
                ),
                code: ({ children, className }) => {
                  const language = className?.replace("language-", "");
                  const isInlineCode = !className;
                  return (
                    <code
                      className={`bg-gray-100 px-1 py-0.5 rounded text-sm font-mono ${
                        isInlineCode ? "text-red-600" : "text-gray-800"
                      } break-words`}
                    >
                      {children}
                    </code>
                  );
                },
                pre: ({ children }) => (
                  <pre className="bg-gray-100 border border-gray-200 rounded-lg p-4 overflow-x-auto mb-4 text-gray-800 break-words">
                    {children}
                  </pre>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside mb-4 space-y-1 [&>li>ul]:ml-4">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside mb-4 space-y-1 [&>li>ul]:ml-4">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="text-gray-700 break-words">{children}</li>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 mb-4 break-words">
                    {children}
                  </blockquote>
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </article>
      </div>
    );
  }

  notFound();
}

// 정적 생성을 위한 메타데이터
export async function generateStaticParams() {
  const posts = getAllPosts();
  const categories = getAllCategories();
  const params: Array<{ category: string; slug: string[] }> = [];

  // 포스트 페이지들
  posts.forEach((post) => {
    if (post.subcategory) {
      // 서브카테고리가 있는 경우: /category/subcategory/slug
      params.push({
        category: post.category,
        slug: [post.subcategory, post.slug],
      });
    } else {
      // 서브카테고리가 없는 경우: /category/slug
      params.push({
        category: post.category,
        slug: [post.slug],
      });
    }
  });

  // 서브카테고리 페이지들
  categories.forEach((category) => {
    if (category.subcategories) {
      category.subcategories.forEach((subcategory) => {
        params.push({
          category: category.slug,
          slug: [subcategory.slug],
        });
      });
    }
  });

  return params;
}
