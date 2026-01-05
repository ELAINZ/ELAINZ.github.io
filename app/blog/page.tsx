export const dynamic = "force-static"; // ✅ 确保是静态渲染

import { loadAllPosts } from "../lib/posts";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Browse all blog posts by Yiheng Zhang on AI, machine learning, and technology.",
  openGraph: {
    title: "Blog | Yiheng Zhang",
    description: "Browse all blog posts by Yiheng Zhang on AI, machine learning, and technology.",
    url: "https://ELAINZ.github.io/personal-blog/blog",
  },
  twitter: {
    title: "Blog | Yiheng Zhang",
    description: "Browse all blog posts by Yiheng Zhang on AI, machine learning, and technology.",
  },
};
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { FileText, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function BlogPage() {
  const posts = await loadAllPosts();

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* 顶部标题和返回主界面按钮 */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <FileText className="h-6 w-6" /> Blog
        </h1>

        {/* 🔙 返回主页 */}
        <Button asChild variant="outline">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back Home
          </Link>
        </Button>
      </div>

      <div className="space-y-6">
        {posts.map((p) => (
          <Card key={p.slug} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl">
                <Link href={`/posts/${p.slug}`} className="hover:underline">
                  {p.title}
                </Link>
              </CardTitle>
              <CardDescription>
                {new Date(p.date).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-neutral-600 dark:text-neutral-300">
                {p.summary}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
