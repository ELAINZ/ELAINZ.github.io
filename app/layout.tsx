import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Yiheng Zhang's Home Page",
    template: "%s | Yiheng Zhang's Blog",
  },
  description: "Personal blog and portfolio of Yiheng Zhang. Sharing insights on AI, machine learning, and technology.",
  keywords: ["Yiheng Zhang", "blog", "AI", "machine learning", "technology", "research"],
  authors: [{ name: "Yiheng Zhang" }],
  creator: "Yiheng Zhang",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ELAINZ.github.io/personal-blog",
    siteName: "Yiheng Zhang's Blog",
    title: "Yiheng Zhang's Home Page",
    description: "Personal blog and portfolio of Yiheng Zhang. Sharing insights on AI, machine learning, and technology.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yiheng Zhang's Home Page",
    description: "Personal blog and portfolio of Yiheng Zhang. Sharing insights on AI, machine learning, and technology.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // 你可以在这里添加搜索引擎验证代码
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
