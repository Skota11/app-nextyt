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
import PresenceSlide from "@/components/animation/presenceSlide";
import { Badge } from "@/components/ui/badge";

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
    // queue タブトリガーのプレゼンス制御用フラグ
    const [showQueueTrigger, setShowQueueTrigger] = useState(!!searchParams.get('queue'));
    // 実際に表示要求されているか (URL に queue= が存在するか)
    const hasQueue = !!searchParams.get('queue');
    
    useEffect(() => {
        setYtid(defaultId)
    }, [defaultId])
    
    const handleTabChange = (value: string) => {
        setActiveTab(value)
        setMountedTabs(prev => new Set([...prev, value]))
    }
    // queue が無くなったら検索タブへ戻す + トリガー退場アニメーション制御
    useEffect(() => {
        // queue パラメータが無くなったら検索タブへ戻す
        if (!hasQueue && activeTab === 'queue') {
            setActiveTab('search');
        }
        // 表示要求が来たらマウント
        if (hasQueue && !showQueueTrigger) {
            setShowQueueTrigger(true);
        }
        // 非表示要求 (hasQueue=false) の場合は PresenceSlide 側の exit 完了後に onExited でアンマウント
    }, [hasQueue, activeTab, showQueueTrigger]);
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
                <TabsList className="fixed bottom-4 left-4 shadow-2xl border h-10 flex">
                    <TabsTrigger value="history">履歴</TabsTrigger>
                    <TabsTrigger value="search">検索</TabsTrigger>
                    {showQueueTrigger && (
                        <PresenceSlide
                            in={hasQueue}
                            direction="left" // 左からスライドイン (必要に応じて調整)
                            distance={32}
                            duration={280}
                            onExited={() => setShowQueueTrigger(false)}
                            className="flex items-stretch mx-1"
                        >
                            <Badge variant={"destructive"} className="absolute -top-2 -right-2 rounded-full w-7 h-7 place-content-center" >
                                {searchParams.get('queue')?.split(',').filter(Boolean).length || 0}
                            </Badge>
                            <TabsTrigger value="queue">再生キュー</TabsTrigger>
                        </PresenceSlide>
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