import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/ui/card";
import { Badge } from "@/app/ui/badge";
import { getAllCategories, getAllPosts } from "@/app/lib/blog-loader";
import Link from "next/link";

export default function BlogPage() {
  const categories = getAllCategories();
  const allPosts = getAllPosts();

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">블로그</h1>
        <p className="text-gray-600">
          개발과 기술에 대한 생각과 경험을 공유합니다.
        </p>
      </div>

      {/* 카테고리별 섹션 */}
      {categories.map((category) => {
        const categoryPosts = allPosts.filter(
          (post) => post.category === category.name
        );

        return (
          <div key={category.slug} className="mb-12">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                {category.name}
              </h2>
              <p className="text-gray-600">{category.postCount}개의 포스트</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {categoryPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/dashboard/blog/${post.category}/${post.slug}`}
                  className="block"
                >
                  <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {post.category}
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
          </div>
        );
      })}

      <div className="mt-12 text-center">
        <p className="text-gray-600 mb-4">더 많은 포스트를 기대해주세요!</p>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
          구독하기
        </button>
      </div>
    </div>
  );
}
