"use client"

//React
import { useEffect, useState } from "react";

//fontAwesome icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStickyNote } from "@fortawesome/free-solid-svg-icons";

//Next.js
import Image from "next/image"
import Link from "next/link";
import Skeleton from "@mui/material/Skeleton";
import Tooltip from "@mui/material/Tooltip";

interface playlist { channelId: string, channelContent: { title: string, thumbnails: { medium: { url: string } } } }

export default function Main() {
    const [result, setResult] = useState<Array<playlist> | undefined>(undefined)
    const getPlaylists = async () => {
        const { data } = await (await fetch('/api/database/channels')).json()
        setResult(data)
    }
    // const omit = (str: string) => {
    //     if (str.length > 6) {
    //         return str.substring(0, 6) + '...';
    //     } else {
    //         return str
    //     }
    // }
    useEffect(() => {
        getPlaylists()
    }, [])
    return (
        <div className='mt-2'>
            <h1 className='text-lg my-4'><FontAwesomeIcon icon={faStickyNote} className='mr-2' />ピン留めチャンネル</h1>
            <div className="mx-4">
                {
                    result == undefined ?
                        <>
                            <div className="flex gap-x-4">
                                <div>
                                    <Skeleton variant="circular" width={70} height={70} />
                                    <Skeleton variant="rounded" width={70} height={20} animation="wave" className="my-2" />
                                </div>
                                <div>
                                    <Skeleton variant="circular" width={70} height={70} />
                                    <Skeleton variant="rounded" width={70} height={20} animation="wave" className="my-2" />
                                </div>
                            </div>
                        </>
                        :

                        result.length == 0 ? <><p>ピン留めされたチャンネルはありません</p></> :
                            <>
                                <div className="flex flex-nowrap overflow-x-auto overflow-y-hidden  content-start justify-start snap-x gap-x-4 pb-4">
                                    {result.map((item: playlist) => {
                                        return (
                                            <Link key={item.channelId} className='snap-start min-w-[70px]' href={`/channel/${item.channelId}`}>
                                                <Tooltip title={item.channelContent.title}>
                                                    <Image alt="channelImage" src={`${item.channelContent.thumbnails.medium.url}`} width={70} height={60} unoptimized className="rounded-full" />
                                                    {/* <p className="text-center text-sm my-2">{omit(item.channelContent.title)}</p> */}
                                                </Tooltip>
                                            </Link>
                                        )
                                    })}
                                </div>
                            </>
                }
            </div>
        </div>)
}