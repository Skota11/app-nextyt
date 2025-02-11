import { type NextRequest } from 'next/server'
import { createClient } from "@/utils/supabase/server";

interface Array { channelId: string }

export async function GET() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
        const { data }: { data: unknown } = await supabase
            .from('user_channels')
            .select("channelId , channelContent")
            .order("created_at", { ascending: false })

        return Response.json({ data })
    } else {
        return new Response('Not logged in', { status: 404 })
    }
}

export async function POST(request: NextRequest) {
    const body = await request.json()
    const supabase = await createClient()
    const channelIdBody = body.id
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
        const res = await (await fetch(`https://youtube.googleapis.com/youtube/v3/channels?part=contentDetails&part=snippet&part=statistics&id=${channelIdBody}&key=AIzaSyC1KMsyjrnEfHJ3xnQtPX0DSxWHfyjUBeo`)).json();
        const about = res.items[0].snippet
        const { data }: { data: Array[] | null } = await supabase.from("user_channels").select("channelId")
        if (data?.length) {
            const include = data.some((d: { channelId: string }) => {
                return d.channelId == channelIdBody
            })
            if (include) {
                await supabase.from("user_channels").update({ channelId: body.id, channelContent: about }).eq("channelId", channelIdBody)
            } else {
                await supabase.from("user_channels").insert({ channelId: body.id, channelContent: about })
            }
        } else {
            await supabase.from("user_channels").insert({ channelId: body.id, channelContent: about })
        }
        return new Response('', { status: 200 })
    } else {
        return new Response('Not logged in', { status: 404 })
    }
}

export async function DELETE(request: NextRequest) {
    const body = await request.json()
    const supabase = await createClient()
    const channelIdBody = body.id
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
        if (channelIdBody == 'full') {
            await supabase.from("user_channels").delete().eq("user_id", user.id)
            return new Response('', { status: 200 })
        } else {
            const { data }: { data: Array[] | null } = await supabase.from("user_channels").select("channelId")
            if (data) {
                const include = data.some((d: { channelId: string }) => {
                    return d.channelId == channelIdBody
                })
                if (include) {
                    await supabase.from("user_channels").delete().eq("channelId", channelIdBody)
                    return new Response('', { status: 200 })
                } else {
                    return new Response('No result', { status: 404 })
                }
            } else {
                return new Response('No result', { status: 404 })
            }
        }
    } else {
        return new Response('Not logged in', { status: 404 })
    }
}