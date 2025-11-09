import { type NextRequest } from 'next/server'
import { createClient } from "@/lib/supabase/server";
import nicoCheck from '@/utils/niconico/nicoid';
interface Array {
    videoId: string
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ playlistId: string }> }) {
    const { playlistId } = await params
    const supabase = await createClient()
    const { data }: { data: unknown } = await supabase
        .from('playlists')
        .select("videoId , videoContent")
        .eq("playlistId", playlistId)
        .order("created_at", { ascending: false })
    return Response.json({ data })
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ playlistId: string }> }) {
    const { playlistId } = await params
    const body = await request.json()
    const supabase = await createClient()
    const videoIdBody = body.id
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
        let about;
        if (nicoCheck(videoIdBody)) {
            const res = await (await fetch(`https://www.nicovideo.jp/api/watch/v3_guest/${videoIdBody}?actionTrackId=${"skota11_2525"}`, {
                headers: {
                    "X-Frontend-Id": "6",
                    "X-Frontend-Version": "0"
                }
            })).json();
            about = res.data.video
        } else {
            const res = await (await fetch(`https://www.googleapis.com/youtube/v3/videos?part=id,snippet,statistics&id=${body.id}&key=AIzaSyC1KMsyjrnEfHJ3xnQtPX0DSxWHfyjUBeo`)).json();
            about = (res.items[0].snippet)
        }
        const { data }: { data: Array[] | null } = await supabase.from("playlists").select("videoId").eq("playlistId", playlistId)
        if (data) {
            const include = data.some((d: { videoId: string }) => {
                return d.videoId == videoIdBody
            })
            if (include) {
                return new Response('Error', { status: 500 })
            } else {
                await supabase.from("playlists").insert({ playlistId: playlistId, videoId: body.id, videoContent: about })
            }
        } else {
            await supabase.from("playlists").insert({ playlistId: playlistId, videoId: body.id, videoContent: about })
        }
        await supabase.from("user_playlists").update({ videos: data ? data.length + 1 : 1 }).eq("playlistId", playlistId)
        return new Response('Success', { status: 200 })
    } else {
        return new Response('Not logged in', { status: 404 })
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ playlistId: string }> }) {
    const body = await request.json()
    const supabase = await createClient()
    const videoIdBody = body.id
    const { playlistId } = await params
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
        const { data }: { data: Array[] | null } = await supabase.from("playlists").select("videoId").eq("playlistId", playlistId)
        if (videoIdBody == 'full') {
            await supabase.from("playlists").delete().eq("playlistId", playlistId)
            await supabase.from("user_playlists").delete().eq("playlistId", playlistId)
            return new Response('', { status: 200 })
        } else {
            await supabase.from("playlists").delete().match({ playlistId: playlistId, videoId: videoIdBody })
            await supabase.from("user_playlists").update({ videos: data ? data.length - 1 : 0 }).eq("playlistId", playlistId)
            return new Response('', { status: 200 })
        }
    } else {
        return new Response('Not logged in', { status: 404 })
    }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ playlistId: string }> }) {
    const body = await request.json()
    const supabase = await createClient()
    const NameBody = body.name
    const { playlistId } = await params
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
        await supabase.from("user_playlists").update({ playlistName: NameBody }).eq("playlistId", playlistId)
        return new Response('', { status: 200 })
    } else {
        return new Response('Not logged in', { status: 404 })
    }
}