import {
  ArrowPathIcon,
  CalendarIcon,
  FolderIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import Link from "next/link";
import { lusitana } from "@/app/ui/fonts";
import { getAllPosts } from "@/app/lib/blog-loader";

export default async function LatestPosts() {
  const allPosts = getAllPosts();

  // 최근 5개 포스트만 가져오기 (날짜순 정렬)
  const latestPosts = allPosts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="flex w-full flex-col md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        최근 포스트
      </h2>
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
        <div className="bg-white px-6">
          {latestPosts.map((post, i) => {
            const postDate = new Date(post.date);
            const formattedDate = postDate.toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "short",
              day: "numeric",
            });

            return (
              <Link
                key={post.slug}
                href={`/blog/${post.category}${
                  post.subcategory ? `/${post.subcategory}` : ""
                }/${post.slug}`}
                className="block"
              >
                <div
                  className={clsx(
                    "flex flex-row items-center justify-between py-4 hover:bg-gray-50 transition-colors rounded-lg px-2",
                    {
                      "border-t": i !== 0,
                    }
                  )}
                >
                  <div className="flex items-center flex-1 min-w-0">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold md:text-base text-gray-900 hover:text-blue-600">
                        {post.title}
                      </p>
                      <div className="flex items-center mt-1 space-x-2">
                        <div className="flex items-center text-xs text-gray-500">
                          <FolderIcon className="h-3 w-3 mr-1" />
                          <span className="truncate">
                            {post.category}
                            {post.subcategory && ` > ${post.subcategory}`}
                          </span>
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <CalendarIcon className="h-3 w-3 mr-1" />
                          <span>{formattedDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        <div className="flex items-center pb-2 pt-6">
          <ArrowPathIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500">최근 업데이트</h3>
        </div>
      </div>
    </div>
  );
}
