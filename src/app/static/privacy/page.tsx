"use client"

import Content from "@/content/privacy.mdx";

export const dynamic = "force-static";

export default function Page() {
    return (
        <div className="p-4 prose">
            <Content />
        </div>
    );
}
