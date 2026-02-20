import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get('url');
  const streamType = searchParams.get('type') || 'direct';
  
  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  const apiKey = process.env.AUDIO_API_KEY;
  
  if (!apiKey) {
    console.error('AUDIO_API_KEY is not set in environment variables');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  try {
    // streamTypeがdirectの場合は、stream-urlエンドポイントからURLを取得してリダイレクト
    if (streamType === 'direct') {
      const streamUrlApiUrl = `https://audio.nextyt.app/stream-url?url=${encodeURIComponent(url)}`;
      
      console.log(apiKey)
      const response = await fetch(streamUrlApiUrl, {
        headers: {
          'x-api-key': apiKey,
        },
      });

      if (!response.ok) {
        console.error(`Audio API returned status ${response.status}`);
        return NextResponse.json(
          { error: 'Failed to fetch stream URL' },
          { status: response.status }
        );
      }

      const data = await response.json() as { streamUrl: string };
      
      if (!data.streamUrl) {
        console.error('Invalid response: streamUrl not found');
        return NextResponse.json(
          { error: 'Invalid API response' },
          { status: 500 }
        );
      }

      // ストリームURLにリダイレクト
      return NextResponse.redirect(data.streamUrl);
    }

    // proxyの場合は、ストリームをプロキシする
    const audioApiUrl = `https://audio.nextyt.app/stream/${streamType}?url=${encodeURIComponent(url)}`;
    
    console.log(apiKey)
    const response = await fetch(audioApiUrl, {
      headers: {
        'x-api-key': apiKey,
      },
    });

    if (!response.ok) {
      console.error(`Audio API returned status ${response.status}`);
      return NextResponse.json(
        { error: 'Failed to fetch audio stream' },
        { status: response.status }
      );
    }

    // ストリーミングレスポンスをそのまま返す
    const headers = new Headers();
    
    // 必要なヘッダーをコピー
    response.headers.forEach((value, key) => {
      if (
        key.toLowerCase() === 'content-type' ||
        key.toLowerCase() === 'content-length' ||
        key.toLowerCase() === 'accept-ranges' ||
        key.toLowerCase() === 'content-range'
      ) {
        headers.set(key, value);
      }
    });

    // キャッシュ制御
    headers.set('Cache-Control', 'public, max-age=3600');

    return new NextResponse(response.body, {
      status: response.status,
      headers,
    });
  } catch (error) {
    console.error('Error proxying audio stream:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
