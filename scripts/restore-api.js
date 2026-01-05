const fs = require('fs')
const path = require('path')

// 恢复 API 路由目录
function restoreApiRoutes() {
  const apiDir = path.join(process.cwd(), 'app/api')
  const apiBackupDir = path.join(process.cwd(), 'app/_api_backup')
  
  if (fs.existsSync(apiBackupDir)) {
    // 如果 API 目录已存在，先删除
    if (fs.existsSync(apiDir)) {
      fs.rmSync(apiDir, { recursive: true, force: true })
    }
    // 恢复 API 目录
    fs.renameSync(apiBackupDir, apiDir)
    console.log('API routes restored')
  }
}

restoreApiRoutes()

