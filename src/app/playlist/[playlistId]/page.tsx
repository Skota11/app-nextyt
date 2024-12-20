'use client'
import { Suspense, useEffect, useState } from "react";
import "./play.css"
//components
import Player from "@/components/play/player";
import { useSearchParams } from "next/navigation";
import List from "@/components/playlist/list";
import * as React from 'react'

function Child(props: { playlistId: string }) {
    const searchParams = useSearchParams();
    let defaultId: string | undefined = searchParams.get("v")?.toString();
    if (defaultId == undefined) {
        defaultId = ""
    }
    const [ytid, setYtid] = useState(defaultId)
    //const p_setYtid = (id: string) => { setYtid(id) }
    useEffect(() => {
        setYtid(defaultId)
    }, [defaultId])
    //setYtid={p_setYtid}
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