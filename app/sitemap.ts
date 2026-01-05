import { MetadataRoute } from 'next'
import { loadAllPosts } from './lib/posts'

export const dynamic = 'force-static'

const baseUrl = 'https://ELAINZ.github.io/personal-blog'

export default function sitemap(): MetadataRoute.Sitemap {
  // 获取所有博客文章
  const posts = loadAllPosts()
  
  // 静态页面
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]

  // 博客文章页面
  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/posts/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...postPages]
}

