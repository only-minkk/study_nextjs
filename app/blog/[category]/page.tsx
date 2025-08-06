import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/ui/card";
import { Badge } from "@/app/ui/badge";
import { getPostsByCategory, getAllCategories } from "@/app/lib/blog-loader";
import Link from "next/link";
import { notFound } from "next/navigation";

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const posts = getPostsByCategory(category);
  const allCategories = getAllCategories();

  // 카테고리가 존재하는지 확인
  const categoryExists = allCategories.some((cat) => cat.slug === category);
  if (!categoryExists) {
    notFound();
  }

  const categoryInfo = allCategories.find((cat) => cat.slug === category);

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
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {categoryInfo?.name}
        </h1>
        <p className="text-gray-600">{categoryInfo?.postCount}개의 포스트</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.category}${
              post.subcategory ? `/${post.subcategory}` : ""
            }/${post.slug}`}
            className="block"
          >
            <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {post.subcategory
                      ? `${post.category} / ${post.subcategory}`
                      : post.category}
                  </Badge>
                  <span className="text-xs text-gray-500">{post.readTime}</span>
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
                  <span className="text-xs text-gray-500">{post.date}</span>
                  <div className="flex gap-1">
                    {post.tags.slice(0, 2).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
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
            이 카테고리에는 아직 포스트가 없습니다.
          </p>
        </div>
      )}
    </div>
  );
}

// 정적 생성을 위한 메타데이터
export async function generateStaticParams() {
  const categories = getAllCategories();

  return categories.map((category) => ({
    category: category.slug,
  }));
}
