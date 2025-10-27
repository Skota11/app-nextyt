import PlayClient from "./playClient";

export default async function Page({ params }: { params: Promise<{ playlistId: string }> }){
    //params
    const { playlistId } = await params;
    return (
        <PlayClient playlistId={playlistId} />
    )
}