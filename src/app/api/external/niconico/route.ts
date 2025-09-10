import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('id')
    
    const res = await fetch(`https://www.nicovideo.jp/api/watch/v3_guest/${query}?actionTrackId=${"skota11_2525"}`, {
        headers: {
            "X-Frontend-Id": "6",
            "X-Frontend-Version": "0"
        },
        next: { revalidate: 86400 } // 1dayキャッシュ
    });
    
    const data = await res.json();
    const video = data.data.video
    const tag = data.data.tag
    
    return Response.json({ video, tag }, {
        headers: {
            'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=7200'
        }
    })
}