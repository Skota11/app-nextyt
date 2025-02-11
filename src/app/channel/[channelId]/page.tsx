'use client'
import { Suspense, useCallback, useEffect, useState } from "react";
//components
import Image from 'next/image'
import * as React from 'react'
import num2ja from "@/utils/num2ja";
import InfiniteScroll from "react-infinite-scroll-component";
import CircularProgress from "@mui/material/CircularProgress";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import dayjs from "dayjs";
import { Button, Chip, Skeleton } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStickyNote, faTrash } from "@fortawesome/free-solid-svg-icons";
import { supabase } from "@/utils/supabase/client";


interface channelList { id: string, snippet: { title: string, description: string, thumbnails: { medium: { url: string } } }, statistics: { subscriberCount: string, videoCount: string } }
interface videoList { snippet: { resourceId: { videoId: string, kind: string }, title: string, channelTitle: string, publishedAt: string } }

function Child(props: { channelId: string }) {
    const searchParams = useSearchParams()
    const [channel, setChannel] = useState<channelList | undefined>()
    const [videos, setVideos] = useState<Array<videoList> | undefined>(undefined)
    const [get, setGet] = useState("video")
    const [state_nextPageToken, state_setNextPageToken] = useState("")
    const [hasMore, setHasMore] = useState(true)
    const [login, setLogin] = useState(false)
    const getChannel = async () => {
        const { data } = await (await fetch(`/api/channel?id=${props.channelId}`)).json()
        setChannel(data[0])
        const id = data[0].id
        getChannelPlaylist(id)
    }
    const getChannelPlaylist = async (id: string) => {
        const { data, nextPageToken } = await (await fetch(`/api/channel/${id}?get=${get}`)).json()
        if (nextPageToken == undefined) {
            setHasMore(false)
        } else {
            state_setNextPageToken(nextPageToken)
            console.log(nextPageToken)
        }
        setVideos(data)
    }
    const getMoreVideos = async () => {
        const { data, nextPageToken } = await (await fetch(`/api/channel/${channel?.id}?get=${get}&nextPageToken=${state_nextPageToken}`)).json()
        // const { data } = await (await fetch(`/api/channel/${channel?.id}`)).json()
        setVideos(prevItems => [...(prevItems as Array<videoList>), ...data]);
        if (nextPageToken == undefined) {
            setHasMore(false)
        } else {
            state_setNextPageToken(nextPageToken)
            console.log(nextPageToken)
        }

    }
    const omit = (str: string) => {
        if (str.length > 36) {
            return str.substring(0, 36) + '...';
        } else {
            return str
        }
    }
    const addUserChannels = async () => {
        fetch('/api/database/channels', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: channel?.id }),
        })
    }
    const deleteUserChannels = async () => {
        await fetch('/api/database/channels', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: channel?.id }),
        })
    }
    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString())
            params.set(name, value)

            return params.toString()
        },
        [searchParams]
    )
    useEffect(() => {
        getChannel()
    }, [])
    useEffect(() => {
        const f = async () => {
            const { data } = await supabase.auth.getSession()
            if (data.session !== null) {
                setLogin(true)
            }
        }
        f()
    }, [])
    useEffect(() => {
        getChannel()
        state_setNextPageToken("")
        setHasMore(true)
        setVideos(undefined)
    }, [get])
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
                        </> : <>
                            <Skeleton animation="wave" variant="text" sx={{ fontSize: '1.25rem' }} />
                        </>}
                        <p className="text-sm">登録者数 {num2ja(channel?.statistics.subscriberCount)}人 / {num2ja(channel?.statistics.videoCount)}本の動画</p>
                        <p className="text-sm text-gray-400">{channel ? <>{omit(channel.snippet.description)}</> : <></>}</p>
                    </div>
                </div>
                {channel && login ? <>
                    <div className="my-4 flex gap-x-4">
                        <Button color="success" startIcon={<FontAwesomeIcon icon={faStickyNote} />} onClick={addUserChannels}>ピン留め</Button>
                        <Button color="warning" startIcon={<FontAwesomeIcon icon={faTrash} />} onClick={deleteUserChannels}>解除</Button>
                    </div>
                </> : <></>}
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
                    <><CircularProgress color="error" size={40} /></>
                </> : <>
                    <InfiniteScroll
                        dataLength={videos.length}
                        next={getMoreVideos}
                        hasMore={hasMore}
                        loader={<CircularProgress color="error" size={40} />}
                    >
                        {videos.map((item) => {
                            return (
                                <>
                                    <Link key={item.snippet.resourceId.videoId} className='block my-8 break-all sm:flex items-start gap-4 cursor-pointer' onClick={() => { }} href={`/play?${createQueryString('v', item.snippet.resourceId.videoId)}`}>
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
                    <p>test</p>
                </>}

            </div>
        </>
    )
}

export default function Home({ params }: { params: Promise<{ channelId: string }> }) {
    const { channelId } = React.use(params)
    return (
        <Suspense>
            <Child channelId={channelId} />
        </Suspense>
    )
}