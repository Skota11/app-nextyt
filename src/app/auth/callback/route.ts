import { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const supabase = await createClient();

    if (code) {
        // Code → Session 交換（サーバー側で Cookie セット）
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
            console.error("exchangeCodeForSession error:", error);
            // エラーページなどへ飛ばしても良い
        }
    }

    redirect("/");
}