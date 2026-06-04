import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Sidebar from "@/components/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Quản lý Xuất Nhập Hàng",
  description: "Hệ thống quản lý kho và đơn hàng",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={inter.variable}>
      <body>
        <div className="app-shell">
          <Sidebar />
          <main className="main-content">
            <div className="content-area">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
