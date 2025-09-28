import { type NextRequest } from 'next/server'
import { createClient } from "@/utils/supabase/server";
import { nanoid } from 'nanoid';

export async function GET(request: NextRequest) {
    const id = request.nextUrl.searchParams.get("id")
    const supabase = await createClient()
    if (id) {
        const { data }: { data: unknown } = await supabase
            .from('user_playlists')
            .select("playlistId , playlistName")
            .eq("playlistId", id)
        return Response.json({ data })
    } else {

        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            const { data }: { data: unknown } = await supabase
                .from('user_playlists')
                .select("playlistId , playlistName")
                .order("created_at", { ascending: false })
            return Response.json({ data })
        } else {
            return new Response('Not logged in', { status: 404 })
        }
    }
}

export async function POST() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
        const id = nanoid()
        await supabase.from("user_playlists").insert({ playlistId: id, playlistName: "新しいプレイリスト" })
        return Response.json({ id: id })
    } else {
        return new Response('Not logged in', { status: 404 })
    }
}