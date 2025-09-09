import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('id')
    
    let res;
    if (query?.charAt(0) == "@") {
        res = await fetch(`https://youtube.googleapis.com/youtube/v3/channels?part=contentDetails&part=snippet&part=statistics&forHandle=${query}&key=AIzaSyC1KMsyjrnEfHJ3xnQtPX0DSxWHfyjUBeo`, {
            next: { revalidate: 86400 } // 1dayキャッシュ
        });
    } else {
        res = await fetch(`https://youtube.googleapis.com/youtube/v3/channels?part=contentDetails&part=snippet&part=statistics&id=${query}&key=AIzaSyC1KMsyjrnEfHJ3xnQtPX0DSxWHfyjUBeo`, {
            next: { revalidate: 86400 } // 1dayキャッシュ
        });
    }
    
    const data = (await res.json()).items;
    
    // レスポンスヘッダーにキャッシュ情報を追加
    return Response.json({ data }, {
        headers: {
            'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=86400'
        }
    })
}