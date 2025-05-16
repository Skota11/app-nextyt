'use client'
//React
import { Suspense, useEffect, useState } from "react";
//Next.js
import { useSearchParams } from "next/navigation";
//スタイル
import "./play.css"
//コンポーネント
import Player from "@/components/play/player";
import NicoPlayer from "@/components/play/niconico/player";
import Search from "@/components/play/search";

//Utility Libraries
import { CookiesProvider } from "react-cookie";

function Child() {
    const searchParams = useSearchParams();
    let defaultId: string | undefined = searchParams.get("v")?.toString();
    const playerId: string | undefined = searchParams.get("player")?.toString();
    if (defaultId == undefined) {
        defaultId = ""
    }
    const [ytid, setYtid] = useState(defaultId)
    useEffect(() => {
        setYtid(defaultId)
    }, [defaultId])
    return (
        <CookiesProvider>
            {playerId == "niconico" ?
                <NicoPlayer ytid={ytid} />
                :
                <Player ytid={ytid} />
            }
            <Search />
        </CookiesProvider>
    )
}

export default function Home() {
    return (
        <Suspense>
            <Child />
        </Suspense>
    )
}