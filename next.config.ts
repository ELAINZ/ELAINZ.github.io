/** @type {import('next').NextConfig} */
const nextConfig = {
  // 只在生产环境使用静态导出，开发环境保留 API routes
  ...(process.env.NODE_ENV === 'production' && { output: 'export' }),
  images: { unoptimized: true },
  assetPrefix: process.env.NODE_ENV === 'production' ? './' : undefined,
};
export default nextConfig;
