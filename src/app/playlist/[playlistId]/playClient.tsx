'use client'
//React
import { useState } from "react";
import * as React from 'react'
import "@/styles/player.css"
// コンポーネント
import Player from "@/components/play/youtubePlayer";
import NicoPlayer from "@/components/play/niconicoPlayer";
import List from "@/components/playlist/list";
import { useRouter } from "next/navigation";
import nicoCheck from "@/utils/niconico/nicoid";
import { useQueryState , parseAsString} from "nuqs";

export default function PlayClient(props: { playlistId: string }) {
    const router = useRouter()
    const [ytid , ] = useQueryState('v' , parseAsString.withDefault(''));
    const [nextYtid, setNextYtid] = useState("")
    const [autoPlay, setAutoPlay] = useState(false)
    const handlePlayerEnd = () => {
        if (nextYtid && autoPlay) {
            router.push(`/playlist/${props.playlistId}?v=${nextYtid}`)
        }
    }
    return (
        <>
            {nicoCheck(ytid) ?
                <NicoPlayer ytid={ytid} onEnd={handlePlayerEnd} />
                : 
                <Player ytid={ytid} onEnd={handlePlayerEnd} />
            }
            <List playlistId={props.playlistId} ytid={ytid} setNextYtid={setNextYtid} setAutoPlay={setAutoPlay} />
        </>
    )
}