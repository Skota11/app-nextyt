"use client";

import { redirect } from "next/navigation";

export const dynamic = "force-static";

export default function Page() {
    // Redirect static privacy page to the new Notion document
    redirect("https://nextyt.notion.site/Privacy-Policy-2b1e4873947680febaefdf20dc087108");
}
