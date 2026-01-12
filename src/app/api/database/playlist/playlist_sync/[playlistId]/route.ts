import { type NextRequest } from 'next/server'
import { createClient } from "@/lib/supabase/server";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

export async function POST(request: NextRequest, { params }: { params: Promise<{ playlistId: string }> }) {
    const { playlistId } = await params
    const body = await request.json()
    const supabase = await createClient()
    const mylistId = body.mylistId
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
        let about;
        const res = await await fetch(`https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${mylistId}&key=${YOUTUBE_API_KEY}`)
        if(res.status !== 200){
            return new Response('Error', { status: 500 })
        }
        const items = (await res.json()).items;
        if(items.length > 30){
            return new Response('Over limit', { status: 500 })
        }
        //プレイリストの中身を全削除
        await supabase.from("playlists").delete().eq("playlistId", playlistId)
        //itemsをループして追加
        for (const item of items) {
            const videoId = item.snippet.resourceId.videoId
            const videoRes = await (await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${YOUTUBE_API_KEY}`)).json();
            about = videoRes.items[0].snippet
            await supabase.from("playlists").insert({ playlistId: playlistId, videoId: videoId, videoContent: about })
        }
        await supabase.from("user_playlists").update({ videos: items.length}).eq("playlistId", playlistId)
        return new Response('Success', { status: 200 })
    } else {
        return new Response('Not logged in', { status: 404 })
    }
}