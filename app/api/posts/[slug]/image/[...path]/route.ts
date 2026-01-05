import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// 只在开发模式下可用
export const dynamic = 'auto'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; path: string[] }> }
) {
  try {
    const { slug, path: imagePath } = await params
    const imageFileName = imagePath.join('/')
    
    // 查找对应的文件夹
    const postsBase = path.join(process.cwd(), 'app/posts')
    const entries = fs.readdirSync(postsBase, { withFileTypes: true })
    const folders = entries.filter((e) => e.isDirectory() && !e.name.startsWith('['))
    
    let folderName: string | null = null
    
    // 首先尝试直接匹配文件夹名
    if (folders.some((f) => f.name === slug)) {
      folderName = slug
    } else {
      // 查找 meta.json 中的 slug
      for (const folder of folders) {
        const metaPath = path.join(postsBase, folder.name, 'meta.json')
        if (fs.existsSync(metaPath)) {
          try {
            const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'))
            if (meta.slug === slug) {
              folderName = folder.name
              break
            }
          } catch (error) {
            // 忽略错误
          }
        }
      }
    }
    
    if (!folderName) {
      return new NextResponse('Post not found', { status: 404 })
    }
    
    const imagePath_full = path.join(postsBase, folderName, imageFileName)
    
    // 安全检查：确保文件在 posts 目录内
    if (!imagePath_full.startsWith(postsBase)) {
      return new NextResponse('Invalid path', { status: 403 })
    }
    
    if (!fs.existsSync(imagePath_full)) {
      return new NextResponse('Image not found', { status: 404 })
    }
    
    const imageBuffer = fs.readFileSync(imagePath_full)
    const ext = path.extname(imageFileName).toLowerCase()
    
    // 根据文件扩展名设置 Content-Type
    const contentTypeMap: Record<string, string> = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
    }
    
    const contentType = contentTypeMap[ext] || 'application/octet-stream'
    
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error: any) {
    console.error('Error serving image:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

