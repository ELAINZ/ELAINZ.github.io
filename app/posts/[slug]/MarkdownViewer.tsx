'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeHighlight from 'rehype-highlight'
import rehypeKatex from 'rehype-katex'
import rehypeRaw from 'rehype-raw'
import { Button } from '@/components/ui/button'
import { Eye, Code } from 'lucide-react'
import 'highlight.js/styles/github-dark.css'
import 'katex/dist/katex.min.css'

interface MarkdownViewerProps {
  content: string
  slug: string
}

export default function MarkdownViewer({ content, slug }: MarkdownViewerProps) {
  const [showMarkdown, setShowMarkdown] = useState(false)
  
  // 处理图片路径：将相对路径转换为正确的 URL
  const processImageUrl = (src: string): string => {
    // 如果是绝对路径或 http/https，直接返回
    if (src.startsWith('http://') || src.startsWith('https://')) {
      return src
    }
    // 如果已经是 / 开头的绝对路径，直接返回
    if (src.startsWith('/')) {
      return src
    }
    // 相对路径：统一使用 public 目录（图片已通过构建脚本复制到 public/posts/[slug]/）
    return `/posts/${slug}/${src}`
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowMarkdown(!showMarkdown)}
        >
          {showMarkdown ? (
            <>
              <Eye className="h-4 w-4 mr-2" />
              显示渲染
            </>
          ) : (
            <>
              <Code className="h-4 w-4 mr-2" />
              显示 Markdown
            </>
          )}
        </Button>
      </div>

      {showMarkdown ? (
        <div className="border rounded-lg p-4 bg-muted/50">
          <pre className="whitespace-pre-wrap font-mono text-sm overflow-x-auto">
            <code>{content}</code>
          </pre>
        </div>
      ) : (
        <article className="prose dark:prose-invert max-w-none prose-headings:font-bold prose-h1:text-4xl prose-h1:mt-8 prose-h1:mb-4 prose-h2:text-3xl prose-h2:mt-6 prose-h2:mb-3 prose-h3:text-2xl prose-h3:mt-4 prose-h3:mb-2 prose-h4:text-xl prose-h4:mt-3 prose-h4:mb-2 prose-p:my-4 prose-ul:my-4 prose-ol:my-4 prose-li:my-2 prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-muted prose-pre:p-4 prose-blockquote:border-l-4 prose-blockquote:pl-4 prose-blockquote:italic">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeRaw, rehypeHighlight, rehypeKatex]}
            components={{
              h1: ({node, ...props}) => <h1 className="text-4xl font-bold mt-8 mb-4" {...props} />,
              h2: ({node, ...props}) => <h2 className="text-3xl font-bold mt-6 mb-3" {...props} />,
              h3: ({node, ...props}) => <h3 className="text-2xl font-bold mt-4 mb-2" {...props} />,
              h4: ({node, ...props}) => <h4 className="text-xl font-bold mt-3 mb-2" {...props} />,
              h5: ({node, ...props}) => <h5 className="text-lg font-bold mt-2 mb-2" {...props} />,
              h6: ({node, ...props}) => <h6 className="text-base font-bold mt-2 mb-2" {...props} />,
              p: ({node, ...props}) => <p className="my-4 leading-7" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc list-inside my-4 space-y-2" {...props} />,
              ol: ({node, ...props}) => <ol className="list-decimal list-inside my-4 space-y-2" {...props} />,
              li: ({node, ...props}) => <li className="my-1" {...props} />,
              code: ({node, inline, ...props}: any) => 
                inline ? (
                  <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono" {...props} />
                ) : (
                  <code {...props} />
                ),
              blockquote: ({node, ...props}) => (
                <blockquote className="border-l-4 border-muted-foreground/30 pl-4 italic my-4" {...props} />
              ),
              img: ({node, src, alt, ...props}: any) => (
                <img 
                  src={processImageUrl(src || '')} 
                  alt={alt || ''} 
                  className="max-w-full h-auto my-4 rounded-lg shadow-md"
                  {...props}
                />
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </article>
      )}
    </div>
  )
}

