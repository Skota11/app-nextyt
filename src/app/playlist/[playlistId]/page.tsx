'use client'

//React
import { Suspense, useEffect, useState } from "react";
import * as React from 'react'

// Next.js
import { useSearchParams } from "next/navigation";

// スタイル
import "./play.css"

// コンポーネント
import Player from "@/components/play/player";
import List from "@/components/playlist/list";

function Child(props: { playlistId: string }) {
    const searchParams = useSearchParams();
    let defaultId: string | undefined = searchParams.get("v")?.toString();
    if (defaultId == undefined) {
        defaultId = ""
    }
    const [ytid, setYtid] = useState(defaultId)
    useEffect(() => {
        setYtid(defaultId)
    }, [defaultId])
    return (
        <>
            <Player ytid={ytid} />
            <List playlistId={props.playlistId} />
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