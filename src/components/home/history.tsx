//react
import Image from "next/image";
//supabase
//font
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClockRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";

interface history { videoId: string, videoContent: { title: string, channelTitle: string } }

export default function Main() {
    const [result, setResult] = useState<Array<history> | undefined>(undefined)
    const getHistory = async () => {
        const { data } = await (await fetch('/api/database/history')).json()
        setResult(data)
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
                        result.length == 0 ? <><p>WatchHistoryはありません</p></> : result.map((item: history) => {
                            return (
                                <div key={item.videoId} className='block my-2 break-all sm:flex items-start gap-4 cursor-pointer' onClick={() => { }}>
                                    <div className="flex place-content-center">
                                        <Image src={`https://i.ytimg.com/vi/${item.videoId}/mqdefault.jpg`} alt="" width={120 * 2.5} height={67.5 * 2.5} className='inline rounded-md' />
                                    </div>
                                    <div className='inline'>
                                        <p>{item.videoContent.title} </p>
                                        <p className='text-slate-600 text-sm'>{item.videoContent.channelTitle} </p>
                                    </div>
                                </div>
                            )
                        })
                }
            </div>
        </div>)
}