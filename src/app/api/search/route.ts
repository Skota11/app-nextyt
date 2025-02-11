import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')
    const get = searchParams.get("get")
    let res;
    let data;
    switch (get) {
        case "video":
            res = await (await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=AIzaSyC1KMsyjrnEfHJ3xnQtPX0DSxWHfyjUBeo&maxResults=50&type=video`)).json();
            break;
        case "channel":
            res = await (await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=AIzaSyC1KMsyjrnEfHJ3xnQtPX0DSxWHfyjUBeo&maxResults=50&type=channel`)).json();
            break;
        case "niconico":
            res = await (await fetch(`https://nico-search.deno.dev/?q=${query}`)).json();
            data = res.data;
            break;
        default:
            res = await (await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=AIzaSyC1KMsyjrnEfHJ3xnQtPX0DSxWHfyjUBeo&maxResults=50&type=video&type=channel`)).json();
            data = res.items;
            break;
    }
    return Response.json({ data })
}