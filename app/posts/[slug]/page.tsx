import fs from "fs";
import path from "path";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import BackButton from "./BackButton"; 
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css"; 
import remarkMath from "remark-math";  
import rehypeKatex from "rehype-katex"; 
import "katex/dist/katex.min.css";    

// 明确告诉 Next.js 这些路径是静态的
export const dynamicParams = false;

export async function generateStaticParams() {
  const base = path.join(process.cwd(), "app/posts");

  if (!fs.existsSync(base)) {
    console.error("posts 目录不存在:", base);
    return [];
  }

  // 获取所有目录名作为 slug
  const entries = fs.readdirSync(base, { withFileTypes: true });
  const slugs = entries
    .filter((e) => e.isDirectory() && !e.name.startsWith("["))
    .map((e) => e.name);

  console.log("Found slugs:", slugs);
  return slugs.map((slug) => ({ slug }));
}

export default async function BlogPostPage(props: any) {
  const params = await props.params;
  const { slug } = params || {};

  if (!slug) {
    console.error("Missing slug param:", params);
    return <div className="p-10 text-center">Missing slug param</div>;
  }

  const base = path.join(process.cwd(), "app/posts", slug);
  const metaPath = path.join(base, "meta.json");
  const contentPath = path.join(base, "content.md");

  if (!fs.existsSync(metaPath) || !fs.existsSync(contentPath)) {
    console.error("Post not found:", slug);
    return <div className="p-10 text-center">Post not found: {slug}</div>;
  }

  const meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
  const content = fs.readFileSync(contentPath, "utf-8");

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
       <BackButton />

      <h1 className="text-3xl font-bold mb-4">{meta.title}</h1>
      <p className="text-sm text-neutral-500 mb-8">{meta.date}</p>

      <article className="prose dark:prose-invert">
        <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}                    // ✅ 支持 $ 和 $$ 数学语法
        rehypePlugins={[rehypeRaw, rehypeHighlight, rehypeKatex]}  // ✅ 渲染公式
        >
        {content}
        </ReactMarkdown>
      </article>
    </div>
  );
}
