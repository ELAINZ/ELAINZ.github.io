"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sun, Moon, Github, Linkedin, Mail, FileText } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import NovatrixBackground from "@/components/ui/novatrix-background";
import Link from "next/link";

export default function BlogLayout({ posts }: { posts: any[] }) {
  const profile = {
    name: "Yiheng Zhang",
    tagline: "Machine Learning · LLMs · Trustworthy AI",
    bio: "I’m a CS student at UW–Madison, researching LLMs, diffusion language models, and trustworthy AI. This blog records my thoughts and projects.",
    avatar: "/avator.png",
    socials: {
      github: "https://github.com/ELAINZ",
      linkedin: "https://www.linkedin.com/in/yiheng-zhang-4a7023329/",
      email: "zhang2968@wisc.edu"
    }
  };

  const [dark, setDark] = useState(false);
  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const grouped: Record<string, any[]> = posts.reduce((acc, p) => {
    const cat = p.category || "Uncategorized";
    (acc[cat] ??= []).push(p);
    return acc;
  }, {});

  return (
    <div className="relative min-h-screen text-neutral-900 dark:text-neutral-50">
      <div className="fixed inset-0 -z-20 opacity-70">
        <NovatrixBackground color={[0.7, 0.7, 0.7]} speed={0.6} amplitude={0.03} mouseReact />
      </div>

      <div className="relative z-20 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-sm min-h-screen">
        {/* 顶部导航 */}
        <div className="sticky top-0 z-40 backdrop-blur border-b bg-white/70 dark:bg-neutral-900/70">
          <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
            <a href="#home" className="font-semibold">{profile.name}</a>
            <div className="flex items-center gap-4 text-sm">
              <Link href="/blog" className="hover:text-blue-600 dark:hover:text-blue-400">
                Blog
              </Link>
              <a href="#about" className="hover:text-blue-600 dark:hover:text-blue-400">About</a>
              <button className="p-2 rounded-xl border" onClick={() => setDark(v => !v)}>
                {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* 主体部分 */}
        <main className="max-w-6xl mx-auto flex flex-col md:flex-row">
          {/* 左栏 */}
          <aside className="w-full md:w-64 lg:w-72 xl:w-80 shrink-0 border-r dark:border-neutral-800 p-6 sticky top-14 self-start">
            <motion.img
              src={profile.avatar}
              alt={profile.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full aspect-[4/5] object-cover rounded-lg border shadow-md mb-4"
            />
            <h1 className="text-xl font-bold mb-1">{profile.name}</h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-3">{profile.tagline}</p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4 leading-relaxed">{profile.bio}</p>
            <div className="flex flex-wrap gap-2">
              <a href={`mailto:${profile.socials.email}`} className="inline-flex items-center gap-1 text-sm px-3 py-1.5 rounded-xl border">
                <Mail className="h-4 w-4" /> Email
              </a>
              <a href={profile.socials.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm px-3 py-1.5 rounded-xl border">
                <Github className="h-4 w-4" /> GitHub
              </a>
              <a href={profile.socials.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm px-3 py-1.5 rounded-xl border">
                <Linkedin className="h-4 w-4" /> LinkedIn
              </a>
            </div>
          </aside>

          {/* 右栏文章 */}
           <section id="blog" className="flex-1 px-6 py-10">
            <h2 className="text-2xl font-semibold mb-8 flex items-center gap-2">
              <FileText className="h-5 w-5" /> Latest Posts
            </h2>
            {Object.entries(grouped).map(([category, items]) => (
              <div key={category} className="mb-10">
                <h3 className="text-xl font-bold mb-4 text-[#2c4176] dark:text-[#94a3b8]">{category}</h3>
                <div className="space-y-6">
                  {items.map((p) => (
                    <Card key={p.slug} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-lg">
                          <Link href={`/posts/${p.slug}`} className="hover:underline">
                            {p.title}
                          </Link>
                        </CardTitle>
                        <CardDescription>{new Date(p.date).toLocaleDateString("en-CA")}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-3">{p.summary}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </section>
        </main>

        {/* 底部 */}
        <footer className="py-8 text-center text-sm text-neutral-500 dark:text-neutral-400 border-t">
          © {new Date().getFullYear()} {profile.name}. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
