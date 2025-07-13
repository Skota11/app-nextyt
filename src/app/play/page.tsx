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
import History from "@/components/home/history";

//Utility Libraries
import { CookiesProvider } from "react-cookie";
import nicoCheck from "@/utils/niconico/nicoid";
import { Box, Tab, Tabs } from "@mui/material";
import Playlist from "@/components/home/playlist";

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
    //tabs
    const [value, setValue] = useState(0);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    return (
        <CookiesProvider>
            {nicoCheck(ytid) ?
                <NicoPlayer ytid={ytid} />
                :
                <Player ytid={ytid} />
            }
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="検索" />
                    <Tab label="履歴" />
                    <Tab label="プレイリスト" />
                </Tabs>
            </Box>
            {value === 0 && <Search />}
            {value === 1 && <History />}
            {value === 2 && <Playlist />}
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