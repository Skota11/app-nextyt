'use client'

//React
import { Suspense, useEffect, useState } from "react";
import * as React from 'react'

// Next.js
import { useSearchParams } from "next/navigation";

// スタイル
import "@/styles/player.css"

// コンポーネント
import Player from "@/components/play/play";
import NicoPlayer from "@/components/play/niconico/player";
import List from "@/components/playlist/list";
import { useRouter } from "next/navigation";
import nicoCheck from "@/utils/niconico/nicoid";

function Child(props: { playlistId: string }) {
    const router = useRouter()
    const searchParams = useSearchParams();
    let defaultId: string | undefined = searchParams.get("v")?.toString();
    if (defaultId == undefined) {
        defaultId = ""
    }
    const [ytid, setYtid] = useState(defaultId)
    const [nextYtid, setNextYtid] = useState("")
    const [autoPlay, setAutoPlay] = useState(false)
    useEffect(() => {
        setYtid(defaultId)
    }, [defaultId])
    return (
        <>
            {nicoCheck(ytid) ?
                <NicoPlayer ytid={ytid} onEnd={() => {
                    if (nextYtid && autoPlay) {
                        router.push(`/playlist/${props.playlistId}?v=${nextYtid}`)
                    }
                }} />
                : <Player ytid={ytid} onEnd={() => {
                    if (nextYtid && autoPlay) {
                        router.push(`/playlist/${props.playlistId}?v=${nextYtid}`)
                    }
                }} />}

            <List playlistId={props.playlistId} ytid={ytid} setNextYtid={setNextYtid} setAutoPlay={setAutoPlay} />
        </>
    )
}

export default function Home({ params }: { params: Promise<{ playlistId: string }> }) {
    const { playlistId } = React.use(params)
    return (
        <Suspense>
            <Child playlistId={playlistId} />
        </Suspense>
    )
}