import { loadAllPosts } from "./lib/posts";
import BlogLayout from "@/components/BlogLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to Yiheng Zhang's personal blog. Explore articles on AI, machine learning, and technology.",
  openGraph: {
    title: "Yiheng Zhang's Home Page",
    description: "Welcome to Yiheng Zhang's personal blog. Explore articles on AI, machine learning, and technology.",
    url: "https://ELAINZ.github.io/personal-blog",
  },
  twitter: {
    title: "Yiheng Zhang's Home Page",
    description: "Welcome to Yiheng Zhang's personal blog. Explore articles on AI, machine learning, and technology.",
  },
};

export default async function HomePage() {
  const posts = await loadAllPosts(); // 服务端扫描 posts 文件夹
  return <BlogLayout posts={posts} />;
}
