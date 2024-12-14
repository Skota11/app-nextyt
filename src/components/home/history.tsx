//react
import { useRouter } from "next/navigation";
import Image from "next/image";
//supabase
import { supabase } from "../../utils/supabase/client";
//font
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket, faClockRotateLeft, faTrash, faUser } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";

export default function Main() {
    const router = useRouter()
    const [result, setResult] = useState<Array<{ videoId: string, videoContent: any }> | undefined>(undefined)
    const getHistory = async () => {
        const { data }: any = await (await fetch('/api/database/history')).json()
        console.log(data)
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
                        result.length == 0 ? <><p>WatchHistoryはありません</p></> : result.map((item: any) => {
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