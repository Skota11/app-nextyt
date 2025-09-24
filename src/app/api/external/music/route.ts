import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('id')
    const res = await (await fetch(`https://yt-song.deno.dev/track?v=${query}`)).json();
    return NextResponse.json(res, { status: 200 })
}