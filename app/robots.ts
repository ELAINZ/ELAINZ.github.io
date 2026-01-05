import { MetadataRoute } from 'next'

export const dynamic = 'force-static'

const baseUrl = 'https://ELAINZ.github.io/personal-blog'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}

