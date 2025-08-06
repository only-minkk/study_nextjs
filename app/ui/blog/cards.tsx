import {
  DocumentTextIcon,
  FolderIcon,
  CalendarIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { lusitana } from "@/app/ui/fonts";
import { getAllPosts, getAllCategories } from "@/app/lib/blog-loader";

const iconMap = {
  posts: DocumentTextIcon,
  categories: FolderIcon,
  monthly: CalendarIcon,
  views: EyeIcon,
};

export default async function CardWrapper() {
  const posts = getAllPosts();
  const categories = getAllCategories();

  // 이번 달 포스트 수 계산
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyPosts = posts.filter((post) => {
    const postDate = new Date(post.date);
    return (
      postDate.getMonth() === currentMonth &&
      postDate.getFullYear() === currentYear
    );
  }).length;

  // 총 조회수 (임시 데이터 - 나중에 실제 데이터로 교체)
  const totalViews = posts.length * 10; // 임시 계산

  return (
    <>
      <Card title="총 포스트" value={posts.length} type="posts" />
      <Card title="카테고리" value={categories.length} type="categories" />
      <Card title="이번 달" value={monthlyPosts} type="monthly" />
      <Card
        title="총 조회수"
        value={totalViews.toLocaleString()}
        type="views"
      />
    </>
  );
}

export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: "posts" | "categories" | "monthly" | "views";
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`${lusitana.className}
          truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
        {value}
      </p>
    </div>
  );
}
