import { CalendarIcon } from "@heroicons/react/24/outline";
import { lusitana } from "@/app/ui/fonts";
import { getAllPosts } from "@/app/lib/blog-loader";

interface MonthlyPostCount {
  month: string;
  count: number;
}

export default async function BlogStatsChart() {
  const allPosts = getAllPosts();

  // 최근 12개월의 포스트 수 계산
  const monthlyData: MonthlyPostCount[] = [];
  const currentDate = new Date();

  for (let i = 11; i >= 0; i--) {
    const targetDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - i,
      1
    );
    const monthKey = targetDate.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "short",
    });

    const monthStart = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth(),
      1
    );
    const monthEnd = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth() + 1,
      0
    );

    const postCount = allPosts.filter((post) => {
      const postDate = new Date(post.date);
      return postDate >= monthStart && postDate <= monthEnd;
    }).length;

    monthlyData.push({
      month: monthKey,
      count: postCount,
    });
  }

  const chartHeight = 350;

  // Y축 라벨 생성 (최대값 기준)
  const yAxisLabels = [];
  const highestCount = Math.max(...monthlyData.map((month) => month.count));
  const topLabel = Math.ceil(highestCount / 1) * 1;

  for (let i = topLabel; i >= 0; i -= 1) {
    yAxisLabels.push(`${i}개`);
  }

  if (!monthlyData || monthlyData.length === 0) {
    return <p className="mt-4 text-gray-400">데이터가 없습니다.</p>;
  }

  return (
    <div className="w-full md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        월별 포스트 통계
      </h2>
      <div className="rounded-xl bg-gray-50 p-4">
        <div className="sm:grid-cols-13 mt-0 grid grid-cols-12 items-end gap-2 rounded-md bg-white p-4 md:gap-4">
          <div
            className="mb-6 hidden flex-col justify-between text-sm text-gray-400 sm:flex"
            style={{ height: `${chartHeight}px` }}
          >
            {yAxisLabels.map((label) => (
              <p key={label}>{label}</p>
            ))}
          </div>

          {monthlyData.map((month) => (
            <div key={month.month} className="flex flex-col items-center gap-2">
              <div
                className="w-full rounded-md bg-blue-300"
                style={{
                  height: `${(chartHeight / topLabel) * month.count}px`,
                }}
              ></div>
              <p className="-rotate-90 text-sm text-gray-400 sm:rotate-0">
                {month.month}
              </p>
            </div>
          ))}
        </div>
        <div className="flex items-center pb-2 pt-6">
          <CalendarIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500">최근 12개월</h3>
        </div>
      </div>
    </div>
  );
}
