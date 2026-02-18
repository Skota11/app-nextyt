"use client"

import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Toaster } from 'react-hot-toast';
import { Spinner } from '@/components/ui/shadcn-io/spinner';
import { Badge } from '../ui/badge';
import { ChannelVideosList } from '@/types/channnel';
import YouTubeVideoCard from './youtubeVideoCard';

export default function ChannelList({ channelId }: { channelId: string }) {
    const [videos, setVideos] = useState<Array<ChannelVideosList> | undefined>(undefined)
    const [get, setGet] = useState("video")
    const [state_nextPageToken, state_setNextPageToken] = useState("")
    const [hasMore, setHasMore] = useState(true)
    const getChannelPlaylist = async (id: string) => {
        const { data, nextPageToken } = await (await fetch(`/api/external/channel/${id}?get=${get}`)).json()
        if (nextPageToken == undefined) {
            setHasMore(false)
        } else {
            state_setNextPageToken(nextPageToken)
        }
        setVideos(data)
    }
    const getMoreVideos = async () => {
        const { data, nextPageToken } = await (await fetch(`/api/external/channel/${channelId}?get=${get}&nextPageToken=${state_nextPageToken}`)).json()
        setVideos(prevItems => [...(prevItems as Array<ChannelVideosList>), ...data]);
        if (nextPageToken == undefined) {
            setHasMore(false)
        } else {
            state_setNextPageToken(nextPageToken)
        }
    }
    useEffect(() => {
        getChannelPlaylist(channelId)
        state_setNextPageToken("")
        setHasMore(true)
        setVideos(undefined)
    }, [get])
    useEffect(() => {
        getChannelPlaylist(channelId)
    }, [])
    return (<>
        <div className="flex flex-nowarp gap-x-4 my-4 overflow-x-auto w-full content-start justify-start snap-x pb-2">
            <Badge onClick={() => { setGet("video") }}
                className="flex-shrink-0 snap-start"
                variant={get == "video" ? "default" : "outline"}
            >
                動画
            </Badge>
            <Badge onClick={(() => { setGet("popular_video") })}
                className="flex-shrink-0 snap-start"
                variant={get == "popular_video" ? "default" : "outline"}
            >
                人気の動画
            </Badge>
            <Badge onClick={() => { setGet("live") }}
                className="flex-shrink-0 snap-start"
                variant={get == "live" ? "default" : "outline"}
            >
                ライブ配信
            </Badge>
            <Badge onClick={(() => { setGet("popular_live") })}
                className="flex-shrink-0 snap-start"
                variant={get == "popular_live" ? "default" : "outline"}
            >
                人気のライブ配信
            </Badge>
            <Badge onClick={() => { setGet("shorts") }}
                className="flex-shrink-0 snap-start"
                variant={get == "shorts" ? "default" : "outline"}
            >
                ショート動画
            </Badge>
            <Badge onClick={(() => { setGet("popular_shorts") })}
                className="flex-shrink-0 snap-start"
                variant={get == "popular_shorts" ? "default" : "outline"}
            >
                人気のショート動画
            </Badge>
        </div>
        {videos == undefined ? <>
            <><Spinner variant="ring" /></>
        </> : <>
            <InfiniteScroll
                dataLength={videos.length}
                next={getMoreVideos}
                hasMore={hasMore}
                loader={<Spinner variant="ring" />}
            >
                {videos.map((item) => {
                    return (
                        <YouTubeVideoCard key={item.snippet.resourceId.videoId} item={item} />
                    )
                })}
            </InfiniteScroll>
        </>}
        <Toaster position="bottom-center" />
    </>)
}