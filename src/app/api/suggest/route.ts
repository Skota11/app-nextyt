import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')
    const res = await (await fetch(`https://www.google.com/complete/search?hl=ja&output=toolbar&ie=utf-8&oe=utf-8&client=firefox&ds=yt&q=${query}`)).json();
    const data = res[1];
    return Response.json({ data })
}