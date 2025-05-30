import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('id')
    const res = await (await fetch(`${process.env.YOUTUBE_HOST_URL}?v=${query}&quality=highestvideo`)).json();
    return NextResponse.json(res, { status: 200 })
}