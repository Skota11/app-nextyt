import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('id')
    const res = await (await fetch(`https://www.nicovideo.jp/api/watch/v3_guest/${query}?actionTrackId=${"skota11_2525"}`, {
        headers: {
            "X-Frontend-Id": "6",
            "X-Frontend-Version": "0"
        }
    })).json();
    const video = res.data.video
    const tag = res.data.tag
    return Response.json({ video, tag })
}