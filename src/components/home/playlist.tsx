"use client";

//React
import { useEffect, useState } from "react";

//Next.js
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

interface playlist { playlistId: string, playlistName: string }

export default function Main() {
    const [result, setResult] = useState<Array<playlist> | undefined>(undefined)
    const getPlaylists = async () => {
        const { data } = await (await fetch('/api/database/playlist')).json()
        setResult(data)
    }
    useEffect(() => {
        getPlaylists()
    }, [])
    return (
        <div className='mt-2'>
            <div className="mx-4 flex flex-col gap-y-2 max-w-md">
                {
                    result == undefined ?
                        <>
                            <div className="grid grid-rows-1 gap-y-2">
                                <Skeleton className='w-[210px] h-[20px] animate-pulse' />
                                <Skeleton className='w-[210px] h-[20px] animate-pulse' />
                            </div>
                        </>
                        :
                        result.length == 0 ? <><p>Playlistはありません</p></> : result.map((item: playlist) => {
                            return (
                                <Link key={item.playlistId} href={`/playlist/${item.playlistId}`}>
                                    <div className="rounded-lg px-4 py-2 shadow hover:bg-gray-100 transition-colors cursor-pointer border border-gray-200">
                                        <p>{item.playlistName}</p>
                                    </div>
                                </Link>
                            )
                        })
                }
            </div>
        </div>)
}