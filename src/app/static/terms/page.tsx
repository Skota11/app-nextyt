"use client";

import { redirect } from "next/navigation";

export const dynamic = "force-static";

export default function Page() {
    // Redirect static terms page to the new Notion document
    redirect("https://nextyt.notion.site/Terms-of-Service-2b1e48739476806ead73e6bf49310427");
}