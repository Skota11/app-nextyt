// Next.js
import Image from 'next/image'
import { Skeleton } from "@mui/material";
// Font Awesome icons
// Custom utilities
import num2ja from "@/utils/num2ja";
// supabase
import { createClient } from "@/utils/supabase/server";

import AddUserChannels from "@/components/channel/addUserChannels";
import ChannelList from "@/components/channel/channelList";
import { headers } from 'next/headers';



export default async function Child({ params }: { params: Promise<{ channelId: string }> }) {
    //
    const { channelId } = await params;
    const headersData = await headers()
    const host = headersData.get('host')
    const protocol = headersData.get('x-forwarded-proto') ?? host?.startsWith('localhost') ? 'http' : 'https'
    const apiBase = `${protocol}://${host}`
    //load
    const supabase = await createClient();
    const supabase_data = await supabase.auth.getUser()
    const currentUser: { login: boolean } | null = supabase_data.data.user ? {
        login: true
    } : null;
    const { data } = await (await fetch(`${apiBase}/api/external/channel?id=${channelId}`)).json()
    const channel = data[0]
    const omit = (str: string) => {
        if (str.length > 36) {
            return str.substring(0, 36) + '...';
        } else {
            return str
        }
    }
    return (
        <>
            <div className="p-4 max-w-screen-xl m-auto">
                <div className="flex gap-x-4 items-center">
                    {channel ? <>
                        <Image alt="channelImage" src={`${channel?.snippet.thumbnails.medium.url}`} width={120} height={120} unoptimized className="rounded-full" />
                    </> : <>
                        <Skeleton animation="wave" variant="circular" width={120} height={120} />
                    </>}
                    <div>
                        {channel ? <>
                            <h1 className="text-xl">{channel?.snippet.title}</h1>
                        </> : <></>}
                        <p className="text-sm">登録者数 {num2ja(channel?.statistics.subscriberCount)}人 / {num2ja(channel?.statistics.videoCount)}本の動画</p>
                        <p className="text-sm text-gray-400">{channel ? <>{omit(channel.snippet.description)}</> : <></>}</p>
                    </div>
                </div>
                {channel && currentUser?.login ? <>
                    <AddUserChannels id={channelId} />
                </> : <></>}
                <ChannelList channelId={channelId} />
            </div>
        </>
    )
}