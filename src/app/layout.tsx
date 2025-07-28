import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تطبيق بحث الأفلام",
  description: "اكتشف عالم السينما واستكشف آلاف الأفلام من جميع أنحاء العالم",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body >{children}</body>
    </html>
  );
}