'use client'
//React
import { Suspense, useEffect, useState } from "react";
//Next.js
import { useSearchParams, useRouter } from "next/navigation";
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
import QueueList from "@/components/play/queue";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

function Child() {
    const searchParams = useSearchParams();
    let defaultId: string | undefined = searchParams.get("v")?.toString();
    const router = useRouter();
    if (defaultId == undefined) {
        defaultId = ""
    }
    const [ytid, setYtid] = useState(defaultId)
    const [activeTab, setActiveTab] = useState("search")
    const [mountedTabs, setMountedTabs] = useState(new Set(["search"]))
    const [showQueueTrigger, setShowQueueTrigger] = useState(!!searchParams.get('queue'));
    
    useEffect(() => {
        setYtid(defaultId)
    }, [defaultId])
    
    const handleTabChange = (value: string) => {
        setActiveTab(value)
        setMountedTabs(prev => new Set([...prev, value]))
    }
    // queue が無くなったら検索タブへ戻す + トリガー退場アニメーション制御
    useEffect(() => {
        const hasQueue = !!searchParams.get('queue');
        if (hasQueue && !showQueueTrigger) {
            setShowQueueTrigger(true); // 即座に表示(入場アニメ)
        }
        if (!hasQueue && activeTab === 'queue') {
            setActiveTab('search');
        }
        if (!hasQueue && showQueueTrigger) {
            // 退場アニメ後に非表示へ (300ms == duration-300)
            const t = setTimeout(() => setShowQueueTrigger(false), 300);
            return () => clearTimeout(t);
        }
    }, [searchParams, activeTab, showQueueTrigger]);
    // 再生終了時に queue の先頭を再生し、消費した要素を削除
    const handlePlayerEnd = () => {
        // 最新の検索パラメータを取得（クロージャで古い queue を参照しないため）
        const currentQueue = searchParams.get('queue')?.toString();
        if (!currentQueue) return;
        const list = currentQueue.split(',').filter(Boolean);
        if (list.length === 0) return;
        const nextId = list[0];
        const rest = list.slice(1);
        // URLSearchParams を現在の searchParams から複製
        const params = new URLSearchParams(searchParams);
        params.set('v', nextId);
        if (rest.length > 0) {
            params.set('queue', rest.join(','));
        } else {
            params.delete('queue');
        }
        // 即時反映用のローカル state 更新（URL 変更を待たないため）
        setYtid(nextId);
        const qs = params.toString();
        const basePath = '/play';
        const newUrl = qs ? `${basePath}?${qs}` : basePath;
        router.replace(newUrl);
    };

    return (
        <CookiesProvider>
            {nicoCheck(ytid) ?
                <NicoPlayer ytid={ytid} onEnd={handlePlayerEnd}/>
                :
                <Player ytid={ytid} onEnd={handlePlayerEnd} />
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
                    {mountedTabs.has("queue") && (
                        <div style={{ display: activeTab === "queue" ? "block" : "none" }}>
                            <QueueList />
                        </div>
                    )}
                </div>
                <TabsList className="fixed bottom-4 left-4 shadow-2xl backdrop-blur-sm bg-background/95 border h-10 flex">
                    <TabsTrigger value="history">履歴</TabsTrigger>
                    <TabsTrigger value="search">検索</TabsTrigger>
                    {showQueueTrigger && (
                        <div
                            className={`transition-all duration-300 ease-in-out flex items-stretch mx-1 ${searchParams.get('queue') ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}
                            aria-hidden={!searchParams.get('queue')}
                        >
                            <TabsTrigger value="queue">再生キュー</TabsTrigger>
                        </div>
                    )}
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