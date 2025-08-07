export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <h1>📚 블로그</h1>
      <nav>카테고리 / 검색 / 최신 글</nav>
      <div>{children}</div> {/* page.tsx의 내용이 여기에 들어감 */}
    </section>
  );
}
