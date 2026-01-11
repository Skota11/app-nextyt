import { type NextRequest } from 'next/server'
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest, { params }: { params: Promise<{ playlistId: string }> }) {
    const { playlistId } = await params
    const body = await request.json()
    const supabase = await createClient()
    const mylistId = body.mylistId
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
        let about;
        const res = await (await fetch(`https://nvapi.nicovideo.jp/v2/mylists/${mylistId}?actionTrackId=${"skota11_2525"}`, {
            headers: {
                "X-Frontend-Id": "6",
                "X-Frontend-Version": "0"
            }
        })).json();
        if(res.meta.status !== 200){
            return new Response('Error', { status: 500 })
        }
        //プレイリストの中身を全削除
        await supabase.from("playlists").delete().eq("playlistId", playlistId)
        //itemsをループして追加
        const items = res.data.mylist.items
        for (const item of items) {
            const videoId = item.watchId
            const videoRes = await (await fetch(`https://www.nicovideo.jp/api/watch/v3_guest/${videoId}?actionTrackId=${"skota11_2525"}`, {
                headers: {
                    "X-Frontend-Id": "6",
                    "X-Frontend-Version": "0"
                }
            })).json();
            about = videoRes.data.video
            await supabase.from("playlists").insert({ playlistId: playlistId, videoId: videoId, videoContent: about })
        }
        await supabase.from("user_playlists").update({ videos: items.length}).eq("playlistId", playlistId)
        return new Response('Success', { status: 200 })
    } else {
        return new Response('Not logged in', { status: 404 })
    }
}