"use client"

//React
import { useEffect, useState } from "react";

//fontAwesome icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStickyNote } from "@fortawesome/free-solid-svg-icons";

//Next.js
import Image from "next/image"
import Link from "next/link";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
//Types
import {Channel} from "@/types/db";
import { Skeleton } from "@/components/ui/skeleton";

export default function Main() {
    const [result, setResult] = useState<Array<Channel> | undefined>(undefined)
    const getPlaylists = async () => {
        const { data } = await (await fetch('/api/database/channels')).json()
        setResult(data)
    }
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
                                    <Skeleton className='w-[70px] h-[70px] rounded-full' />
                                </div>
                                <div>
                                    <Skeleton className='w-[70px] h-[70px] rounded-full' />
                                </div>
                            </div>
                        </>
                        :

                        result.length == 0 ? <><p>ピン留めされたチャンネルはありません</p></> :
                            <>
                                <div className="flex flex-nowrap overflow-x-auto overflow-y-hidden  content-start justify-start snap-x gap-x-4 pb-4">
                                    {result.map((item: Channel) => {
                                        return (
                                            <Link key={item.channelId} className='snap-start min-w-[70px]' href={`/channel/${item.channelId}`}>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                    <TooltipTrigger>
                                                        <Image alt="channelImage" src={`${item.channelContent.thumbnails.medium.url}`} width={70} height={60} unoptimized className="rounded-full" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        {item.channelContent.title}
                                                    </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </Link>
                                        )
                                    })}
                                </div>
                            </>
                }
            </div>
        </div>)
}