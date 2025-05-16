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
import nicoCheck from "@/utils/nicoid";

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
        <CookiesProvider>
            {nicoCheck(ytid) ?
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