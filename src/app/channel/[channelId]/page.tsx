import Image from 'next/image'
import num2ja from "@/utils/num2ja";

import AddUserChannels from "@/components/channel/addUserChannels";
import ChannelList from "@/components/channel/channelList";
import { Skeleton } from '@/components/ui/skeleton';

export default async function Child({ params }: { params: Promise<{ channelId: string }> }) {
    //
    const { channelId } = await params;
    let res;
    if (decodeURIComponent(channelId).charAt(0) == "@") {
        res = await fetch(`https://youtube.googleapis.com/youtube/v3/channels?part=contentDetails&part=snippet&part=statistics&forHandle=${channelId}&key=AIzaSyC1KMsyjrnEfHJ3xnQtPX0DSxWHfyjUBeo`, {
            next: { revalidate: 86400 } // 1dayキャッシュ
        });
    } else {
        res = await fetch(`https://youtube.googleapis.com/youtube/v3/channels?part=contentDetails&part=snippet&part=statistics&id=${channelId}&key=AIzaSyC1KMsyjrnEfHJ3xnQtPX0DSxWHfyjUBeo`, {
            next: { revalidate: 86400 } // 1dayキャッシュ
        });
    }
    const data = (await res.json()).items;
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
                        <Skeleton className='w-[120px] h-[120px]' />
                    </>}
                    <div>
                        {channel ? <>
                            <h1 className="text-xl font-bold my-2">{channel?.snippet.title}</h1>
                        </> : <></>}
                        <p className="text-sm">登録者数 {num2ja(channel?.statistics.subscriberCount)}人 / {num2ja(channel?.statistics.videoCount)}本の動画</p>
                        <p className="text-sm text-gray-400">{channel ? <>{omit(channel.snippet.description)}</> : <></>}</p>
                    </div>
                </div>
                <AddUserChannels id={channelId} />
                <ChannelList channelId={data[0].id} />
            </div>
        </>
    )
}