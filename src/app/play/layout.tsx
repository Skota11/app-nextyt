import Link from "next/link";
import { Suspense } from "react";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className=""
            >
                <Suspense>
                    <div className="bg-black p-4 flex place-content-center">
                        <h1 className="text-white"> <Link href="/">NextTube</Link></h1>
                    </div>
                    {children}
                </Suspense>
            </body>
        </html>
    );
}