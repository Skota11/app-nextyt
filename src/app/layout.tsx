import "./globals.css";
import Link from "next/link";
import localFont from 'next/font/local'
import { Metadata } from "next";

const myFont = localFont({ src: '../fonts/LINESeedJP_OTF_Bd.woff2', preload: true });

export const metadata: Metadata = {
  title: 'NextTube',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${myFont.className} text-color-[#333]`}
      >
        <div className="bg-black p-4 flex place-content-center">
          <h1 className="text-white"> <Link href="/">NextTube</Link></h1>
        </div>
        {children}
      </body>
    </html>
  );
}