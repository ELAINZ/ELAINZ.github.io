'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Save, Download, Send, Eye, FileText } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeHighlight from 'rehype-highlight'
import rehypeKatex from 'rehype-katex'
import 'highlight.js/styles/github-dark.css'
import 'katex/dist/katex.min.css'
import RichTextEditor from '@/components/editor/RichTextEditor'

interface BlogData {
  slug: string
  title: string
  date: string
  tags: string[]
  summary: string
  category: string
  content: string
}

export default function AdminPage() {
  const [blogData, setBlogData] = useState<BlogData>({
    slug: '',
    title: '',
    date: new Date().toISOString().split('T')[0],
    tags: [],
    summary: '',
    category: '',
    content: '',
  })
  const [markdownContent, setMarkdownContent] = useState('')
  const [htmlContent, setHtmlContent] = useState('')
  const [tagsInput, setTagsInput] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [message, setMessage] = useState('')
  const [isDevelopment, setIsDevelopment] = useState(false)

  useEffect(() => {
    const isDev = 
      typeof window !== 'undefined' && 
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    setIsDevelopment(isDev)
  }, [])

  const handleTagsChange = (value: string) => {
    setTagsInput(value)
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
    setBlogData({ ...blogData, tags })
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleTitleChange = (title: string) => {
    setBlogData({ ...blogData, title })
    if (!blogData.slug || blogData.slug === generateSlug(blogData.title)) {
      setBlogData(prev => ({ ...prev, slug: generateSlug(title) }))
    }
  }

  const downloadFiles = () => {
    if (!blogData.slug || !blogData.title) {
      setMessage('请填写标题和slug')
      return
    }

    const content = markdownContent || blogData.content
    if (!content) {
      setMessage('请填写博客内容')
      return
    }

    // 生成 meta.json
    const meta = {
      slug: blogData.slug,
      title: blogData.title,
      date: blogData.date,
      tags: blogData.tags,
      summary: blogData.summary,
      category: blogData.category || '',
    }

    // 下载 meta.json
    const metaBlob = new Blob([JSON.stringify(meta, null, 2)], { type: 'application/json' })
    const metaUrl = URL.createObjectURL(metaBlob)
    const metaLink = document.createElement('a')
    metaLink.href = metaUrl
    metaLink.download = 'meta.json'
    metaLink.click()
    URL.revokeObjectURL(metaUrl)

    // 下载 content.md
    const contentBlob = new Blob([content], { type: 'text/markdown' })
    const contentUrl = URL.createObjectURL(contentBlob)
    const contentLink = document.createElement('a')
    contentLink.href = contentUrl
    contentLink.download = 'content.md'
    contentLink.click()
    URL.revokeObjectURL(contentUrl)

    setMessage(`文件已下载！请将 meta.json 和 content.md 放到 app/posts/${blogData.slug}/ 文件夹中`)
  }

  const saveToServer = async (publish: boolean = false) => {
    if (!blogData.slug || !blogData.title) {
      setMessage('请填写标题和slug')
      return
    }

    const content = markdownContent || blogData.content
    if (!content) {
      setMessage('请填写博客内容')
      return
    }

    if (publish) {
      setIsPublishing(true)
    } else {
      setIsSaving(true)
    }
    setMessage('')

    try {
      const postData = {
        ...blogData,
        content: content,
      }

      const response = await fetch('/api/admin/save-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      })

      const result = await response.json()

      if (response.ok) {
        if (publish) {
          setMessage(`✅ 博客已发布到 app/posts/${blogData.slug}/，可以立即访问！`)
          // 延迟跳转到新文章
          setTimeout(() => {
            window.location.href = `/posts/${blogData.slug}`
          }, 2000)
        } else {
          setMessage(`✅ 博客已保存到 app/posts/${blogData.slug}/`)
        }
      } else {
        setMessage(`❌ ${publish ? '发布' : '保存'}失败: ${result.error || '未知错误'}`)
      }
    } catch (error: any) {
      setMessage(`❌ ${publish ? '发布' : '保存'}失败: ${error.message}`)
    } finally {
      setIsSaving(false)
      setIsPublishing(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">博客编辑器</h1>
          <p className="text-muted-foreground">
            {isDevelopment 
              ? '开发模式：可以直接保存并发布到本地文件' 
              : '生产模式：请下载文件后手动放置到相应文件夹'}
          </p>
        </div>

        {message && (
          <div className={`mb-4 p-4 rounded-md ${
            message.startsWith('✅') 
              ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
              : message.startsWith('❌')
              ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
              : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
          }`}>
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 左侧：编辑表单 */}
          <Card>
            <CardHeader>
              <CardTitle>编辑博客</CardTitle>
              <CardDescription>填写博客信息和内容</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">标题 *</label>
                <Input
                  value={blogData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="输入博客标题"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Slug *</label>
                <Input
                  value={blogData.slug}
                  onChange={(e) => setBlogData({ ...blogData, slug: e.target.value })}
                  placeholder="URL友好的标识符（自动生成）"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">日期 *</label>
                <Input
                  type="date"
                  value={blogData.date}
                  onChange={(e) => setBlogData({ ...blogData, date: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">标签（用逗号分隔）</label>
                <Input
                  value={tagsInput}
                  onChange={(e) => handleTagsChange(e.target.value)}
                  placeholder="例如: AI, machine learning, research"
                />
                {blogData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {blogData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary/10 text-primary rounded-md text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">分类</label>
                <Input
                  value={blogData.category}
                  onChange={(e) => setBlogData({ ...blogData, category: e.target.value })}
                  placeholder="例如: AI, Research"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">摘要</label>
                <Textarea
                  value={blogData.summary}
                  onChange={(e) => setBlogData({ ...blogData, summary: e.target.value })}
                  placeholder="博客摘要"
                  rows={3}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">内容 *</label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPreview(!showPreview)}
                  >
                    {showPreview ? <FileText className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                    {showPreview ? '编辑' : '预览'}
                  </Button>
                </div>
                {showPreview ? (
                  <div className="border rounded-md p-4 min-h-[400px] prose dark:prose-invert max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm, remarkMath]}
                      rehypePlugins={[rehypeHighlight, rehypeKatex]}
                    >
                      {markdownContent || blogData.content || '*暂无内容*'}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <RichTextEditor
                    content={htmlContent}
                    onChange={(html) => {
                      setHtmlContent(html)
                      setBlogData({ ...blogData, content: html })
                    }}
                    onMarkdownChange={(markdown) => {
                      setMarkdownContent(markdown)
                    }}
                  />
                )}
              </div>

              <div className="flex gap-2 pt-4">
                {isDevelopment ? (
                  <>
                    <Button
                      onClick={() => saveToServer(false)}
                      disabled={isSaving || isPublishing}
                      variant="outline"
                      className="flex-1"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isSaving ? '保存中...' : '保存'}
                    </Button>
                    <Button
                      onClick={() => saveToServer(true)}
                      disabled={isSaving || isPublishing}
                      className="flex-1"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {isPublishing ? '发布中...' : '发布'}
                    </Button>
                  </>
                ) : null}
                <Button
                  onClick={downloadFiles}
                  variant={isDevelopment ? 'outline' : 'default'}
                  className={isDevelopment ? '' : 'w-full'}
                >
                  <Download className="h-4 w-4 mr-2" />
                  下载文件
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 右侧：实时预览 */}
          <Card>
            <CardHeader>
              <CardTitle>实时预览</CardTitle>
              <CardDescription>博客预览效果</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{blogData.title || '标题'}</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    {blogData.date || '日期'} | {blogData.category || '分类'}
                  </p>
                  {blogData.summary && (
                    <p className="text-muted-foreground mb-4">{blogData.summary}</p>
                  )}
                  {blogData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {blogData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-primary/10 text-primary rounded-md text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="border-t pt-4">
                  <div className="prose dark:prose-invert max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm, remarkMath]}
                      rehypePlugins={[rehypeHighlight, rehypeKatex]}
                    >
                      {markdownContent || blogData.content || '*暂无内容*'}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

