import { type NextRequest } from 'next/server'
import { createClient } from "@/utils/supabase/server";
import { nanoid } from 'nanoid';

interface Array {
    videoId: string
}

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

export async function DELETE(request: NextRequest) {
    const body = await request.json()
    const supabase = await createClient()
    const videoIdBody = body.id
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
        if (videoIdBody == 'full') {
            await supabase.from("watchHistory").delete().eq("user_id", user.id)
            return new Response('', { status: 200 })
        } else {
            const { data }: { data: Array[] | null } = await supabase.from("watchHistory").select("videoId")
            if (data) {
                const include = data.some((d: { videoId: string }) => {
                    return d.videoId == videoIdBody
                })
                if (include) {
                    await supabase.from("watchHistory").delete().eq("videoId", videoIdBody)
                    return new Response('', { status: 200 })
                } else {
                    return new Response('No result', { status: 404 })
                }
            } else {
                return new Response('Np result', { status: 404 })
            }
        }
    } else {
        return new Response('Not logged in', { status: 404 })
    }
}