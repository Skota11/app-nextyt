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
import Playlist from "@/components/home/playlist";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

function Child() {
    const searchParams = useSearchParams();
    let defaultId: string | undefined = searchParams.get("v")?.toString();
    if (defaultId == undefined) {
        defaultId = ""
    }
    const [ytid, setYtid] = useState(defaultId)
    const [activeTab, setActiveTab] = useState("search")
    const [mountedTabs, setMountedTabs] = useState(new Set(["search"]))
    
    useEffect(() => {
        setYtid(defaultId)
    }, [defaultId])
    
    const handleTabChange = (value: string) => {
        setActiveTab(value)
        setMountedTabs(prev => new Set([...prev, value]))
    }
    
    return (
        <CookiesProvider>
            {nicoCheck(ytid) ?
                <NicoPlayer ytid={ytid} />
                :
                <Player ytid={ytid} />
            }
            <Tabs value={activeTab} onValueChange={handleTabChange} className="p-4 max-w-screen-xl m-auto">
                <div className="mt-4 mb-12">
                    {mountedTabs.has("history") && (
                        <div style={{ display: activeTab === "history" ? "block" : "none" }}>
                            <History isActive={activeTab === "history"}/>
                        </div>
                    )}
                    {mountedTabs.has("search") && (
                        <div style={{ display: activeTab === "search" ? "block" : "none" }}>
                            <Search />
                        </div>
                    )}
                    {mountedTabs.has("playlist") && (
                        <div style={{ display: activeTab === "playlist" ? "block" : "none" }}>
                            <Playlist />
                        </div>
                    )}
                </div>
                <TabsList className="fixed bottom-4 left-4 shadow-2xl backdrop-blur-sm bg-background/95 border h-10">
                    <TabsTrigger value="history">履歴</TabsTrigger>
                    <TabsTrigger value="search">検索</TabsTrigger>
                    <TabsTrigger value="playlist">プレイリスト</TabsTrigger>
                </TabsList>
            </Tabs>
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