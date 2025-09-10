"use client"

import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Image from 'next/image';
import dayjs from 'dayjs';

import { Toaster } from 'react-hot-toast';

interface videoList { snippet: { resourceId: { videoId: string, kind: string }, title: string, channelTitle: string, publishedAt: string } }

export default function ChannelList({ channelId }: { channelId: string }) {
    const [videos, setVideos] = useState<Array<videoList> | undefined>(undefined)
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
        setVideos(prevItems => [...(prevItems as Array<videoList>), ...data]);
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
        <div className="flex gap-x-4 my-4 overflow-x-scroll w-full">
            <Chip label={"動画"} onClick={() => { setGet("video") }}
                color="info"
                variant={get == "video" ? "filled" : "outlined"}
            />
            <Chip label={"人気の動画"} onClick={(() => { setGet("popular_video") })}
                color="info"
                variant={get == "popular_video" ? "filled" : "outlined"}
            ></Chip>
            <Chip label={"ライブ配信"} onClick={() => { setGet("live") }}
                color="info"
                variant={get == "live" ? "filled" : "outlined"}
            ></Chip>
            <Chip label={"人気のライブ配信"} onClick={(() => { setGet("popular_live") })}
                color="info"
                variant={get == "popular_live" ? "filled" : "outlined"}
            ></Chip>
            <Chip label={"ショート動画"} onClick={() => { setGet("shorts") }}
                color="info"
                variant={get == "shorts" ? "filled" : "outlined"}
            ></Chip>
            <Chip label={"人気のショート動画"} onClick={(() => { setGet("popular_shorts") })}
                color="info"
                variant={get == "popular_shorts" ? "filled" : "outlined"}
            ></Chip>
        </div>
        {videos == undefined ? <>
            <><CircularProgress color="primary" size={40} /></>
        </> : <>
            <InfiniteScroll
                dataLength={videos.length}
                next={getMoreVideos}
                hasMore={hasMore}
                loader={<CircularProgress color="primary" size={40} />}
            >
                {videos.map((item) => {
                    return (
                        <>
                            <Link key={item.snippet.resourceId.videoId} className='block my-8 break-all sm:flex items-start gap-4 cursor-pointer' onClick={() => { }} href={`/play?v=${item.snippet.resourceId.videoId}`}>
                                <div className="flex place-content-center flex-none">
                                    <Image src={`https://i.ytimg.com/vi/${item.snippet.resourceId.videoId}/mqdefault.jpg`} alt="" width={120 * 2.5} height={67.5 * 2.5} className='inline rounded-md' unoptimized />
                                </div>
                                <div className='inline'>
                                    <p>{item.snippet.title} </p>
                                    <p className='text-slate-600 text-sm'>{item.snippet.channelTitle} ・ {dayjs(item.snippet.publishedAt).format('YYYY年MM月DD日')} </p>
                                </div>
                            </Link>
                        </>
                    )
                })}
            </InfiniteScroll>
        </>}
        <Toaster position="bottom-center" />
    </>)
}