"use client"

//React
import Image from "next/image";
import { useEffect, useState } from "react";

//fontAwesome icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClockRotateLeft, faTrash } from "@fortawesome/free-solid-svg-icons";

//Third party libraries
import CircularProgress from "@mui/material/CircularProgress";
import Link from "next/link";
import InfiniteScroll from "react-infinite-scroll-component";
import { SiNiconico } from "react-icons/si";
import nicoCheck from "@/utils/niconico/nicoid";
import nicoImg from "@/utils/niconico/nicoimg";

interface history { videoId: string, videoContent: { title: string, channelTitle: string, thumbnail: { url: string, middleUrl: string | null, largeUrl: string | null } } }

export default function Main() {
    const [result, setResult] = useState<Array<history> | undefined>(undefined)
    const [page, setPage] = useState(2);
    const [hasMore, setHasMore] = useState(true)
    const [deleteLoading, setDeleteLoading] = useState<Array<string>>([])
    const getHistory = async () => {
        const { data } = await (await fetch(`/api/database/history`)).json()
        setResult(data)
    }
    const getMoreHistory = async () => {
        const { data } = await (await fetch(`/api/database/history?page=${page}`)).json()
        setResult(prevItems => [...(prevItems as Array<history>), ...data]);
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
            <h1 className='text-lg my-4'><FontAwesomeIcon icon={faClockRotateLeft} className='mr-2' />視聴履歴</h1>
            <div className="mx-4">
                {
                    result == undefined ?
                        <><CircularProgress color="primary" size={40} /></>
                        :
                        result.length == 0 ? <><p>視聴履歴はありません</p></> :
                            <>
                                <InfiniteScroll
                                    dataLength={result.length}
                                    next={getMoreHistory}
                                    hasMore={hasMore}
                                    loader={<CircularProgress color="primary" size={40} />}
                                >
                                    {result.map((item: history) => {
                                        return (
                                            <div key={item.videoId}>
                                                {nicoCheck(item.videoId) ?
                                                    <div key={item.videoId} className='relative my-6 break-all sm:flex items-start gap-4 cursor-pointer rounded-lg shadow-md hover:bg-gray-100 transition-colors'>
                                                        <Link href={`/play?v=${item.videoId}`} className="flex-none">
                                                            <div className="relative place-content-center w-full ">
                                                                <Image src={nicoImg(item.videoContent.thumbnail)} alt="" width={120 * 2.5} height={67.5 * 2.5} className='inline sm:rounded-md rounded-t-lg aspect-video object-cover w-full sm:w-[300px]' unoptimized />
                                                                <div className="absolute bottom-2 right-2 bg-white place-content-center p-1 rounded-sm">
                                                                    <p className="flex items-center text-sm"><SiNiconico className="m-1" />ニコニコ動画</p>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                        <div className='sm:inline'>
                                                            <Link href={`/play?v=${item.videoId}`}>
                                                                <p className="py-4 px-2 sm:px-0">{item.videoContent.title}</p>
                                                            </Link>
                                                        </div>
                                                        <div className="absolute sm:top-auto top-2 sm:bottom-2 right-2 bg-red-500 rounded-full w-8 h-8 place-content-center">
                                                            {deleteLoading.includes(item.videoId) ? <>
                                                                <CircularProgress color="primary" size={20} />
                                                            </> : <>
                                                                <p className="flex place-content-center">
                                                                    <button title="動画を削除" onClick={(e) => { e.preventDefault(); deleteHistory(item.videoId) }}><FontAwesomeIcon icon={faTrash} /></button>
                                                                </p>
                                                            </>}
                                                        </div>
                                                    </div>
                                                    :
                                                    <div key={item.videoId} className='relative my-6 break-all sm:flex items-start gap-4 cursor-pointer rounded-lg shadow-md hover:bg-gray-100 transition-colors'>
                                                        <Link href={`/play?v=${item.videoId}`} className="flex-none">
                                                            <div className="flex place-content-center w-full relative">
                                                                <Image src={`https://i.ytimg.com/vi/${item.videoId}/mqdefault.jpg`} alt="" width={120 * 2.5} height={67.5 * 2.5} className='inline sm:rounded-md rounded-t-lg aspect-video object-cover w-full sm:w-[300px]' unoptimized />
                                                            </div>
                                                        </Link>
                                                        <div className='sm:inline'>
                                                            <Link href={`/play?v=${item.videoId}`}>
                                                                <p className="py-4 px-2 sm:px-0">{item.videoContent.title} </p>
                                                            </Link>
                                                        </div>
                                                        <div className="absolute sm:top-auto top-2 sm:bottom-2 right-2 bg-red-500 rounded-full w-8 h-8 place-content-center">
                                                            {deleteLoading.includes(item.videoId) ? <>
                                                                <p className="flex place-content-center">
                                                                    <CircularProgress color="primary" size={20} />
                                                                </p>
                                                            </> : <>
                                                                <p className="flex place-content-center">
                                                                    <button title="動画を削除" onClick={(e) => { e.preventDefault(); deleteHistory(item.videoId) }}><FontAwesomeIcon icon={faTrash} /></button>
                                                                </p>
                                                            </>}
                                                        </div>
                                                    </div>
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