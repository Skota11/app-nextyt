'use client'
//React
import { Suspense, useEffect, useState } from "react";
//Next.js
import { useSearchParams } from "next/navigation";
//スタイル
import "@/styles/player.css"
//コンポーネント
import Player from "@/components/play/youtubePlayer";
import NicoPlayer from "@/components/play/niconicoPlayer";
import Search from "@/components/search/search";
import History from "@/components/history/history";

//Utility Libraries
import { CookiesProvider } from "react-cookie";
import nicoCheck from "@/utils/niconico/nicoid";
import { Box, Tab, Tabs } from "@mui/material";
import Playlist from "@/components/home/playlist";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {children}
        </div>
    );
}

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
                <TabPanel value={value} index={0}>
                    <History />
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <Search />
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <Playlist />
                </TabPanel>
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