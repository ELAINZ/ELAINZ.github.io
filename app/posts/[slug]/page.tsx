import fs from "fs";
import path from "path";
import BackButton from "./BackButton"; 
import MarkdownViewer from "./MarkdownViewer";
import type { Metadata } from "next";

const baseUrl = 'https://ELAINZ.github.io/personal-blog';    

// 明确告诉 Next.js 这些路径是静态的
export const dynamicParams = false;

// 根据 slug 查找对应的文件夹
function findPostFolderBySlug(slug: string): string | null {
  const base = path.join(process.cwd(), "app/posts");
  if (!fs.existsSync(base)) {
    return null;
  }

  const entries = fs.readdirSync(base, { withFileTypes: true });
  const folders = entries.filter((e) => e.isDirectory() && !e.name.startsWith("["));

  // 首先尝试直接匹配文件夹名
  if (folders.some((f) => f.name === slug)) {
    return slug;
  }

  // 然后查找 meta.json 中的 slug
  for (const folder of folders) {
    const metaPath = path.join(base, folder.name, "meta.json");
    if (fs.existsSync(metaPath)) {
      try {
        const meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
        if (meta.slug === slug) {
          return folder.name;
        }
      } catch (error) {
        // 忽略读取错误，继续查找
      }
    }
  }

  return null;
}

export async function generateStaticParams() {
  const base = path.join(process.cwd(), "app/posts");

  if (!fs.existsSync(base)) {
    console.error("posts 目录不存在:", base);
    return [];
  }

  // 获取所有目录，读取 meta.json 中的 slug
  const entries = fs.readdirSync(base, { withFileTypes: true });
  const folders = entries.filter((e) => e.isDirectory() && !e.name.startsWith("["));

  const slugs = folders.map((folder) => {
    const metaPath = path.join(base, folder.name, "meta.json");
    if (fs.existsSync(metaPath)) {
      try {
        const meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
        return meta.slug || folder.name; // 使用 meta.json 中的 slug，如果没有则使用文件夹名
      } catch (error) {
        console.warn(`Failed to read meta.json for ${folder.name}:`, error);
        return folder.name;
      }
    }
    return folder.name;
  });

  console.log("Found slugs:", slugs);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(props: any): Promise<Metadata> {
  const params = await props.params;
  const { slug } = params || {};
  
  if (!slug) {
    return {
      title: "Post Not Found",
    };
  }

  // 根据 slug 查找对应的文件夹
  const folderName = findPostFolderBySlug(slug);
  if (!folderName) {
    return {
      title: "Post Not Found",
    };
  }

  const base = path.join(process.cwd(), "app/posts", folderName);
  const metaPath = path.join(base, "meta.json");

  if (!fs.existsSync(metaPath)) {
    return {
      title: "Post Not Found",
    };
  }

  const meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
  const url = `${baseUrl}/posts/${slug}`;

  return {
    title: meta.title,
    description: meta.summary || meta.title,
    keywords: meta.tags || [],
    authors: [{ name: "Yiheng Zhang" }],
    openGraph: {
      title: meta.title,
      description: meta.summary || meta.title,
      url: url,
      type: "article",
      publishedTime: meta.date,
      tags: meta.tags || [],
      authors: ["Yiheng Zhang"],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.summary || meta.title,
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function BlogPostPage(props: any) {
  const params = await props.params;
  const { slug } = params || {};

  if (!slug) {
    console.error("Missing slug param:", params);
    return <div className="p-10 text-center">Missing slug param</div>;
  }

  // 根据 slug 查找对应的文件夹
  const folderName = findPostFolderBySlug(slug);
  if (!folderName) {
    console.error("Post not found for slug:", slug);
    return <div className="p-10 text-center">Post not found: {slug}</div>;
  }

  const base = path.join(process.cwd(), "app/posts", folderName);
  const metaPath = path.join(base, "meta.json");
  const contentPath = path.join(base, "content.md");

  if (!fs.existsSync(metaPath) || !fs.existsSync(contentPath)) {
    console.error("Post files not found:", folderName);
    return <div className="p-10 text-center">Post files not found: {slug}</div>;
  }

  const meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
  const content = fs.readFileSync(contentPath, "utf-8");

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
       <BackButton />

      <h1 className="text-3xl font-bold mb-4">{meta.title}</h1>
      <p className="text-sm text-neutral-500 mb-8">{meta.date}</p>

      <MarkdownViewer content={content} slug={slug} />
    </div>
  );
}
