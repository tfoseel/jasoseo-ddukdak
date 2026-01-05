import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "자소서 뚝딱 | 10분 만에 끝내는 자소서 인터뷰",
  description: "글을 쓰지 않아도, 선택만 하면 자소서 초안이 완성됩니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="stylesheet" as="style" crossOrigin="" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
        <script src="https://js.stripe.com/v3/" async></script>
      </head>

      <body className="antialiased text-foreground bg-background">
        {children}
      </body>
    </html>
  );
}
