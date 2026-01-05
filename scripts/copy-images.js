const fs = require('fs')
const path = require('path')

// 将 app/posts 下的图片复制到 public/posts 目录
function copyPostImages() {
  const postsDir = path.join(process.cwd(), 'app/posts')
  const publicPostsDir = path.join(process.cwd(), 'public/posts')
  
  // 创建 public/posts 目录
  if (!fs.existsSync(publicPostsDir)) {
    fs.mkdirSync(publicPostsDir, { recursive: true })
  }
  
  if (!fs.existsSync(postsDir)) {
    console.log('Posts directory not found')
    return
  }
  
  const entries = fs.readdirSync(postsDir, { withFileTypes: true })
  const folders = entries.filter((e) => e.isDirectory() && !e.name.startsWith('['))
  
  folders.forEach((folder) => {
    const sourceDir = path.join(postsDir, folder.name)
    const targetDir = path.join(publicPostsDir, folder.name)
    
    // 创建目标目录
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true })
    }
    
    // 读取源目录中的所有文件
    const files = fs.readdirSync(sourceDir)
    
    files.forEach((file) => {
      // 只复制图片文件
      const ext = path.extname(file).toLowerCase()
      const imageExts = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg']
      
      if (imageExts.includes(ext)) {
        const sourceFile = path.join(sourceDir, file)
        const targetFile = path.join(targetDir, file)
        
        // 复制文件
        fs.copyFileSync(sourceFile, targetFile)
        console.log(`Copied: ${file} to ${targetDir}`)
      }
    })
  })
  
  console.log('Image copying completed!')
}

copyPostImages()

