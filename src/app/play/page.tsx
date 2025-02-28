'use client'
//React
import { Suspense, useEffect, useState } from "react";
//Next.js
import { useSearchParams } from "next/navigation";
//スタイル
import "./play.css"
//コンポーネント
import Player from "@/components/play/player";
import Search from "@/components/play/search";



function Child() {
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
            <Search />
        </>
    )
}

export default function Home() {
    return (
        <Suspense>
            <Child />
        </Suspense>
    )
}