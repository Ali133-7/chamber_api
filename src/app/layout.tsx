import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "نظام التحقق من الهويات - غرفة تجارة صلاح الدين",
  description: "نظام للتحقق من هويات التجار وصلاحيتها",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-full antialiased text-gray-900 bg-gray-50">{children}</body>
    </html>
  );
}
