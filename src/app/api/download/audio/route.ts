import { NextResponse, NextRequest } from 'next/server';
import ytdl from '@distube/ytdl-core';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const url = searchParams.get('url')

        if (!url) {
            return NextResponse.json(
                { error: 'URL is required' },
                { status: 400 }
            );
        }

        if (!ytdl.validateURL(url)) {
            return NextResponse.json(
                { error: 'Invalid YouTube URL' },
                { status: 400 }
            );
        }

        const info = await ytdl.getInfo(url);
        const format = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' });

        console.log(info)
        console.log(format)
        return NextResponse.json({
            title: info.videoDetails.title,
            downloadUrl: format.url,
            thumbnail: info.videoDetails.thumbnails[0].url,
        });
    } catch (error) {
        console.error('Download error:', error);
        return NextResponse.json(
            { error: 'Failed to process video' },
            { status: 500 }
        );
    }
}