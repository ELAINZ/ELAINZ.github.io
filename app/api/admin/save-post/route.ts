import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  // 只在开发模式下允许
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: '此功能仅在开发模式下可用' },
      { status: 403 }
    )
  }

  try {
    const blogData = await request.json()

    // 验证必需字段
    if (!blogData.slug || !blogData.title || !blogData.content) {
      return NextResponse.json(
        { error: '缺少必需字段：slug, title, content' },
        { status: 400 }
      )
    }

    // 创建博客目录
    const postsDir = path.join(process.cwd(), 'app', 'posts')
    const postDir = path.join(postsDir, blogData.slug)

    // 确保 posts 目录存在
    if (!fs.existsSync(postsDir)) {
      fs.mkdirSync(postsDir, { recursive: true })
    }

    // 创建博客文件夹
    if (!fs.existsSync(postDir)) {
      fs.mkdirSync(postDir, { recursive: true })
    }

    // 生成 meta.json
    const meta = {
      slug: blogData.slug,
      title: blogData.title,
      date: blogData.date || new Date().toISOString().split('T')[0],
      tags: blogData.tags || [],
      summary: blogData.summary || '',
      category: blogData.category || '',
    }

    // 保存 meta.json
    const metaPath = path.join(postDir, 'meta.json')
    fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2), 'utf-8')

    // 保存 content.md
    const contentPath = path.join(postDir, 'content.md')
    fs.writeFileSync(contentPath, blogData.content, 'utf-8')

    return NextResponse.json({
      success: true,
      message: `博客已保存到 ${postDir}`,
      path: postDir,
    })
  } catch (error: any) {
    console.error('保存博客失败:', error)
    return NextResponse.json(
      { error: error.message || '保存失败' },
      { status: 500 }
    )
  }
}

