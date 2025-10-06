import { type NextRequest } from 'next/server'
import { createClient } from "@/lib/supabase/server";
import nicoCheck from '@/utils/niconico/nicoid';

interface Array {
    videoId: string
}

export async function GET(request: NextRequest) {
    const page = request.nextUrl.searchParams.get('page')
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
        if (page) {
            const pageNum = Number(page)
            const start = 0 + 50 * (pageNum - 1)
            const end = 49 + 50 * (pageNum - 1)
            const { data }: { data: unknown } = await supabase
                .from('watchHistory')
                .select("videoId , videoContent")
                .order("created_at", { ascending: false })
                .range(start, end)
            return Response.json({ data })
        } else {
            const { data }: { data: unknown } = await supabase
                .from('watchHistory')
                .select("videoId , videoContent")
                .order("created_at", { ascending: false })
                .limit(50)
            return Response.json({ data })
        }
    } else {
        return new Response('Not logged in', { status: 404 })
    }
}

export async function POST(request: NextRequest) {
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

        const { data }: { data: Array[] | null } = await supabase.from("watchHistory").select("videoId")
        if (data) {
            const include = data.some((d: { videoId: string }) => {
                return d.videoId == videoIdBody
            })
            if (include) {
                await supabase.from("watchHistory").update({ videoId: body.id, videoContent: about }).eq("videoId", videoIdBody)
            } else {
                await supabase.from("watchHistory").insert({ videoId: body.id, videoContent: about })
            }
        } else {
            await supabase.from("watchHistory").insert({ videoId: body.id, videoContent: about })
        }

        return new Response('', { status: 200 })
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