import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: Promise<{ channelId: string }> }) {
    const { channelId } = await params
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('get')
    const next = searchParams.get("nextPageToken")
    const base_channelId = channelId.slice(2)
    let playlistId;
    switch (query) {
        case "video":
            playlistId = `UULF${base_channelId}`
            break;
        case "live":
            playlistId = `UULV${base_channelId}`
            break;
        case "shorts":
            playlistId = `UUSH${base_channelId}`
            break;
        case "popular_video":
            playlistId = `UULP${base_channelId}`
            break;
        case "popular_live":
            playlistId = `UUPV${base_channelId}`
            break;
        case "popular_shorts":
            playlistId = `UUPS${base_channelId}`
            break;
        default:
            playlistId = `UU${base_channelId}`
            break;
    }
    let res;
    if (next) {
        res = await (await fetch(`https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&pageToken=${next}&key=AIzaSyC1KMsyjrnEfHJ3xnQtPX0DSxWHfyjUBeo`)).json();
    } else {
        res = await (await fetch(`https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=AIzaSyC1KMsyjrnEfHJ3xnQtPX0DSxWHfyjUBeo`)).json();
    }
    const data = res.items
    return Response.json({ data: data, nextPageToken: res.nextPageToken })
}