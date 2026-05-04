import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "匿名組合管理システム",
  description: "匿名組合出資者管理システム",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
