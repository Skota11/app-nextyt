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
    const [value, setValue] = useState(1);
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
            <Box className="pt-4" sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs centered value={value} onChange={handleChange} aria-label="basic tabs example" variant="fullWidth">
                    <Tab label="履歴" />
                    <Tab label="検索" />
                    <Tab label="プレイリスト" />
                </Tabs>
            </Box>
            <div className="p-4 max-w-screen-xl m-auto">
                {value === 0 && <History />}
                {value === 1 && <Search />}
                {value === 2 && <Playlist />}
            </div>
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