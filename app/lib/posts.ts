import fs from "fs";
import path from "path";

export function loadAllPosts() {
  const base = path.join(process.cwd(), "app/posts");
  const folders = fs.readdirSync(base).filter(
    (dir) => !dir.startsWith("[") 
  );

  return folders.map((dir) => {
    const metaPath = path.join(base, dir, "meta.json");
    const contentPath = path.join(base, dir, "content.md");

    if (!fs.existsSync(metaPath) || !fs.existsSync(contentPath)) {
      console.warn(`⚠️ Skipping invalid post folder: ${dir}`);
      return null;
    }

    const meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
    const content = fs.readFileSync(contentPath, "utf-8");

    return { ...meta, content };
  }).filter(Boolean);
}
