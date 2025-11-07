import fs from "fs";
import path from "path";

const postsDir = path.join(process.cwd(), "app/posts");

const posts = fs
  .readdirSync(postsDir, { withFileTypes: true })
  .filter((d) => d.isDirectory() && !d.name.startsWith("["))
  .map((dir) => {
    const metaPath = path.join(postsDir, dir.name, "meta.json");
    const contentPath = path.join(postsDir, dir.name, "content.md");
    if (!fs.existsSync(metaPath)) return null;

    const meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
    return {
      slug: dir.name,
      title: meta.title,
      date: meta.date,
      summary: meta.summary || "",
      tags: meta.tags || [],
      category: meta.category || "Uncategorized",
    };
  })
  .filter(Boolean);

// 按日期倒序
posts.sort((a, b) => new Date(b.date) - new Date(a.date));

fs.writeFileSync(
  path.join(process.cwd(), "public/posts.json"),
  JSON.stringify(posts, null, 2)
);

console.log("✅ Generated public/posts.json with", posts.length, "posts");
