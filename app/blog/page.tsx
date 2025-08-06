import CardWrapper from "@/app/ui/blog/cards";
import LatestPosts from "@/app/ui/blog/latest-posts";
import BlogStatsChart from "@/app/ui/blog/blog-stats-chart";

export default function BlogPage() {
  return (
    <div className="w-full">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          블로그 대시보드
        </h1>
        <p className="text-sm md:text-base text-gray-600">
          개발과 기술에 대한 생각과 경험을 공유합니다.
        </p>
      </div>

      {/* 통계 카드 */}
      <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <CardWrapper />
      </div>

      {/* 차트와 최근 포스트 */}
      <div className="grid gap-3 md:gap-4 grid-cols-1 lg:grid-cols-7 mt-6 md:mt-8">
        <BlogStatsChart />
        <LatestPosts />
      </div>
    </div>
  );
}
