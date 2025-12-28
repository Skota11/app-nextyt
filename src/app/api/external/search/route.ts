import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
    const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')
    const get = searchParams.get("get")
    let res;
    let data;
    
    switch (get) {
        case "video":
            res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=${YOUTUBE_API_KEY}&maxResults=50&type=video&regionCode=jp`, {
                next: { revalidate: 900 } // 10分キャッシュ
            });
            break;
        case "channel":
            res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=${YOUTUBE_API_KEY}&maxResults=50&type=channel&regionCode=jp`, {
                next: { revalidate: 900 } // 10分キャッシュ
            });
            break;
        case "niconico":
            res = await fetch(`https://nico-search.deno.dev/?q=${query}`, {
                next: { revalidate: 900 } // 5分キャッシュ（検索結果は短めに）
            });
            data = (await res.json()).data;
            break;
        default:
            res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=${YOUTUBE_API_KEY}&maxResults=50&type=video&type=channel&regionCode=jp`, {
                next: { revalidate: 900 } // 10分キャッシュ
            });
            
            data = (await res.json()).items;
            break;
    }
    
    return Response.json({ data }, {
        headers: {
            'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=1200'
        }
    })
}
