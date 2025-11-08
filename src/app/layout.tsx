import "@/styles/globals.css";
import Link from "next/link";
import Image from "next/image";
import localFont from 'next/font/local'
import { Metadata } from "next";

import { SpeedInsights } from '@vercel/speed-insights/next';
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { ThemeProvider } from "@/components/theme-provider";
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { ToggleTheme } from "@/components/toggleTheme";
config.autoAddCss = false

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
    <html lang="ja">
      <body
        className={`${myFont.className} text-color-[#333]`}
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
          <NuqsAdapter>
          {/* <div className="bg-black p-4 grid grid-cols-3">
            <h1 className="col-start-2 col-end-3 flex place-content-center text-white "><Link href="/">NextTube</Link></h1>
            <div className="col-end-4 flex place-content-end">
              <ToggleTheme />
            </div>
          </div> */}
          <header className="bg-white/80 backdrop-blur-2xl border-b border-slate-200/60 shadow-lg shadow-slate-900/5 dark:bg-popover dark:border-gray-700 dark:shadow-none sticky top-0 z-50">
            <div className="max-w-screen-xl mx-auto flex items-center justify-between p-4">
              <h1 className="flex gap-x-1 items-center place-content-center">
                <Image src={"/icon.png"} alt="NextTube" width={32} height={32} />
                <Link href="/" className="text-xl text-bold">NextTube</Link>
              </h1>
              <div className="flex place-content-end">
                <ToggleTheme />
              </div>
            </div>
          </header>
          {children}
          </NuqsAdapter>
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}