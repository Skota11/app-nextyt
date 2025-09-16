"use client"

//React
import { useEffect, useState } from "react";

//Third party libraries

import InfiniteScroll from "react-infinite-scroll-component";
import nicoCheck from "@/utils/niconico/nicoid";

//Types
import { VideoAbout } from "@/types/db";
import NicoVideoCard from "./cards/nicoVideoCard";
import VideoCard from "./cards/youtubeVideoCard";
import { Spinner } from "@/components/ui/shadcn-io/spinner";

export default function Main() {
    const [result, setResult] = useState<Array<VideoAbout> | undefined>(undefined)
    const [page, setPage] = useState(2);
    const [hasMore, setHasMore] = useState(true)
    const [deleteLoading, setDeleteLoading] = useState<Array<string>>([])
    const getHistory = async () => {
        const { data } = await (await fetch(`/api/database/history`)).json()
        setResult(data)
    }
    const getMoreHistory = async () => {
        const { data } = await (await fetch(`/api/database/history?page=${page}`)).json()
        setResult(prevItems => [...(prevItems as Array<VideoAbout>), ...data]);
        setPage(prevPage => prevPage + 1);
        if (data.length < 50) {
            setHasMore(false)
        }
    }
    const deleteHistory = async (id: string) => {
        let array = [...deleteLoading]
        array.push(id)
        setDeleteLoading(array)
        await fetch('/api/database/history', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id }),
        })
        await getHistory()
        array = [...deleteLoading]
        array.splice(array.indexOf(id), array.indexOf(id))
        setDeleteLoading(array)
    }
    useEffect(() => {
        getHistory()
    }, [])
    return (
        <div className='mt-2'>
            <div className="mx-4">
                {
                    result == undefined ?
                        <><Spinner variant="ring"/></>
                        :
                        result.length == 0 ? <><p>視聴履歴はありません</p></> :
                            <>
                                <InfiniteScroll
                                    dataLength={result.length}
                                    next={getMoreHistory}
                                    hasMore={hasMore}
                                    loader={<Spinner variant="ring" />}
                                >
                                    {result.map((item: VideoAbout) => {
                                        return (
                                            <div key={item.videoId}>
                                                {nicoCheck(item.videoId) ?
                                                    <NicoVideoCard item={item} deleteHistory={deleteHistory} deleteLoading={deleteLoading} />
                                                    :
                                                    <VideoCard item={item} deleteHistory={deleteHistory} deleteLoading={deleteLoading} />
                                                }
                                            </div>
                                        )
                                    })}
                                </InfiniteScroll>
                            </>
                }
            </div>
        </div>)
}