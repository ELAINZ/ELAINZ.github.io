import { loadAllPosts } from "./lib/posts";
import BlogLayout from "@/components/BlogLayout";

export default async function HomePage() {
  const posts = await loadAllPosts(); // 服务端扫描 posts 文件夹
  return <BlogLayout posts={posts} />;
}
