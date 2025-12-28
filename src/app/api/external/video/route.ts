import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
    const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
        return Response.json({ error: 'ID parameter is required' }, { status: 400 })
    }

    const res = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=id,snippet,statistics&id=${id}&key=${YOUTUBE_API_KEY}`, {
        next: { revalidate: 86400 * 3 } // 1dayキャッシュ
    });

    const data = await res.json();

    if (!data.items || data.items.length === 0) {
        return Response.json({ error: 'Video not found' }, { status: 404 })
    }

    const video = data.items[0];
    return Response.json({
        snippet: video.snippet,
        statistics: video.statistics
    }, {
        headers: {
            'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=7200'
        }
    })
}