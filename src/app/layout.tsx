import "./globals.css";
import Link from "next/link";
import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={``}
      >
        <div className="bg-black p-4 flex place-content-center">
          <h1 className="text-white"> <Link href="/">NextTube</Link></h1>
        </div>
        {children}
        <Script src="./node_modules/preline/dist/preline.js"></Script>
      </body>
    </html>
  );
}