import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '博客编辑器',
  description: '创建和编辑博客文章',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

