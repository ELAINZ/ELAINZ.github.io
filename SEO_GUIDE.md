# SEO 提交指南

## 为什么 Google 搜索不到？

Google 搜索需要时间索引网站，通常需要几天到几周。以下是加速索引的步骤：

## 1. 提交到 Google Search Console

### 步骤：
1. 访问 [Google Search Console](https://search.google.com/search-console)
2. 点击"添加资源"
3. 选择"网址前缀"，输入：`https://ELAINZ.github.io/personal-blog`
4. 验证网站所有权（选择以下方法之一）：
   - **HTML 标签验证**：在 `app/layout.tsx` 的 `verification` 字段添加验证代码
   - **HTML 文件上传**：下载验证文件并上传到网站根目录
   - **域名提供商**：通过 DNS 记录验证

5. 验证成功后，提交 sitemap：
   - 在左侧菜单选择"站点地图"
   - 输入：`https://ELAINZ.github.io/personal-blog/sitemap.xml`
   - 点击"提交"

## 2. 提交到 Bing Webmaster Tools

1. 访问 [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. 添加网站并验证
3. 提交 sitemap：`https://ELAINZ.github.io/personal-blog/sitemap.xml`

## 3. 提交到百度站长平台

1. 访问 [百度站长平台](https://ziyuan.baidu.com/)
2. 添加网站并验证
3. 提交 sitemap：`https://ELAINZ.github.io/personal-blog/sitemap.xml`

## 4. 检查索引状态

### Google：
- 在 Google Search Console 查看"覆盖率"报告
- 使用 `site:ELAINZ.github.io/personal-blog` 在 Google 搜索

### 手动请求索引：
- 在 Google Search Console 的"网址检查"工具中输入你的 URL
- 点击"请求编入索引"

## 5. 加速索引的技巧

1. **创建外部链接**：
   - 在社交媒体分享你的网站
   - 在其他网站添加链接
   - 在 GitHub README 添加链接

2. **确保网站可访问**：
   - 检查网站是否正常运行
   - 确保 robots.txt 允许爬取
   - 确保 sitemap.xml 可访问

3. **等待时间**：
   - 新网站通常需要 1-4 周才能被索引
   - 定期更新内容有助于更快被索引

## 6. 验证文件配置

如果需要 HTML 标签验证，在 `app/layout.tsx` 中添加：

```typescript
verification: {
  google: 'your-google-verification-code',
},
```

## 常见问题

**Q: 为什么搜索不到？**
A: 可能原因：
- 网站刚部署，Google 还没爬取
- 没有提交到 Google Search Console
- robots.txt 阻止了爬取（已检查，允许爬取）
- 网站内容太少

**Q: 需要多久才能被搜索到？**
A: 通常 1-4 周，提交到 Search Console 可以加速这个过程。

**Q: 如何检查是否被索引？**
A: 在 Google 搜索：`site:ELAINZ.github.io/personal-blog`

