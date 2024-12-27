//react
import Image from "next/image";
//supabase
//font
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClockRotateLeft, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Link from "next/link";
import InfiniteScroll from "react-infinite-scroll-component";

interface history { videoId: string, videoContent: { title: string, channelTitle: string } }

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
        setResult(prevItems => [...prevItems, ...data]);
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
            <h1 className='text-lg my-4'><FontAwesomeIcon icon={faClockRotateLeft} className='mr-2' />WatchHistory</h1>
            <div className="mx-4">
                {
                    result == undefined ?
                        <><CircularProgress color="error" size={40} /></>
                        :
                        result.length == 0 ? <><p>WatchHistoryはありません</p></> :
                            <>
                                <InfiniteScroll
                                    dataLength={result.length}
                                    next={getMoreHistory}
                                    hasMore={hasMore}
                                    loader={<CircularProgress color="error" size={40} />}
                                >
                                    {result.map((item: history) => {
                                        return (

                                            <div key={item.videoId} className='block my-2 break-all sm:flex items-start gap-4 cursor-pointer'>
                                                <Link href={`/play?v=${item.videoId}`}>
                                                    <div className="flex place-content-center">
                                                        <Image src={`https://i.ytimg.com/vi/${item.videoId}/mqdefault.jpg`} alt="" width={120 * 2.5} height={67.5 * 2.5} className='inline rounded-md' />
                                                    </div>
                                                </Link>
                                                <div className='inline'>
                                                    <Link href={`/play?v=${item.videoId}`}>
                                                        <p>{item.videoContent.title} </p>
                                                        <p className='text-slate-600 text-sm'>{item.videoContent.channelTitle} </p>
                                                    </Link>
                                                    <div>
                                                        {deleteLoading.includes(item.videoId) ? <>
                                                            <CircularProgress color="error" size={20} />
                                                        </> : <>
                                                            <button onClick={() => { deleteHistory(item.videoId) }}><FontAwesomeIcon icon={faTrash} /></button>
                                                        </>}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </InfiniteScroll>
                            </>
                }
            </div>
        </div>)
}