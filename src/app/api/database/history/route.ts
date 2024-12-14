import { type NextRequest } from 'next/server'
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
        console.log(user.id)
        let { data }: { data: any } = await supabase
            .from('watchHistory')
            .select("videoId , videoContent")
            .order("created_at", { ascending: false })
            .limit(50)
        return Response.json({ data })
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
        const res = await (await fetch(`https://www.googleapis.com/youtube/v3/videos?part=id,snippet,statistics&id=${body.id}&key=AIzaSyC1KMsyjrnEfHJ3xnQtPX0DSxWHfyjUBeo`)).json();
        const about = (res.items[0].snippet)
        const { data }: { data: any } = await supabase.from("watchHistory").select("videoId")
        const include = data.some((d: { videoId: string }) => {
            return d.videoId == videoIdBody
        })
        if (include) {
            const { error } = await supabase.from("watchHistory").update({ videoId: body.id, videoContent: about }).eq("videoId", videoIdBody)
            console.log(error)
        } else {
            const { error } = await supabase.from("watchHistory").insert({ videoId: body.id, videoContent: about })
            console.log(error)
        }
        return new Response('', { status: 200 })
    } else {
        return new Response('Not logged in', { status: 404 })
    }
}