import type { Metadata } from "next";
import { Be_Vietnam_Pro, Merriweather } from "next/font/google";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  weight: ["400", "500", "600", "700"],
  subsets: ["vietnamese", "latin"],
  variable: "--font-be-vietnam",
  display: "swap",
});

const merriweather = Merriweather({
  weight: ["400", "700"],
  subsets: ["vietnamese", "latin"],
  variable: "--font-merriweather",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bảo Tàng Lịch Sử Đảng 3D",
  description: "Không gian trải nghiệm 3D Bảo Tàng Lịch Sử Đảng Cộng Sản Việt Nam",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${beVietnamPro.variable} ${merriweather.variable}`}>
      <body className="w-screen h-screen overflow-hidden bg-black text-white font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
