'use client'
//React
import { Suspense, useEffect, useState } from "react";
//Next.js
import { useQueryState , parseAsArrayOf, parseAsString } from 'nuqs'
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
import { useMedia } from "react-use";

export default function PlayClient() {
    const [activeTab, setActiveTab] = useState("search")
    const [mountedTabs, setMountedTabs] = useState(new Set(["search"]))
    const [queryQueue , setQueryQueue] = useQueryState('queue' ,parseAsArrayOf(parseAsString , ',').withOptions({ clearOnDefault: true }));
    const [videoId, setVideoId] = useQueryState('v', parseAsString.withDefault(''));
    
    // queue タブトリガーのプレゼンス制御用フラグ
    const [showQueueTrigger, setShowQueueTrigger] = useState(!!queryQueue);
    const hasQueue = !!queryQueue;

    // 追加: ページ先頭では非表示、少しでもスクロールしたら表示
    const [showTabsListBar, setShowTabsListBar] = useState(false);
    const isMobile = useMedia('(max-width: 640px)', false);
    
    useEffect(() => {
        const onScroll = () => {
            // スマホ幅なら常時表示、PC幅は1pxでもスクロールで表示
            setShowTabsListBar(isMobile || window.scrollY > 0);
        };
        onScroll(); // 初期反映
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, [isMobile]);
    
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
        const list = !!queryQueue ? [...queryQueue] : [];
        const nextId = list[0];
        const rest = list.slice(1);
        setQueryQueue(rest.length > 0 ? rest : null);
        if (nextId) {
            setVideoId(nextId);
        }
    };

    // videoIdが空の場合は何も表示しない、または適切なフォールバックを表示
    if (!videoId) {
        return (
            <CookiesProvider>
                <div className="p-4 max-w-screen-xl m-auto">
                    <p>動画が指定されていません</p>
                    <Tabs value={activeTab} onValueChange={handleTabChange} className="mt-4">
                        <div className="mt-4 mb-12">
                            {mountedTabs.has("search") && (
                                <div style={{ display: activeTab === "search" ? "block" : "none" }}>
                                    <Search />
                                </div>
                            )}
                        </div>
                    </Tabs>
                </div>
            </CookiesProvider>
        );
    }

    return (
        <CookiesProvider>
            {nicoCheck(videoId) ?
                <NicoPlayer ytid={videoId} onEnd={handlePlayerEnd}/>
                :
                <Player ytid={videoId} onEnd={handlePlayerEnd} />
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
                <div
                    role="presentation"
                    aria-hidden={!showTabsListBar}
                    className={`fixed bottom-4 left-4 z-50 transition-all duration-300 ${
                        showTabsListBar
                            ? "opacity-100 translate-y-0 pointer-events-auto"
                            : "opacity-0 translate-y-8 pointer-events-none"
                    }`}
                    style={{ willChange: "transform, opacity" }}
                >
                    <TabsList className="shadow-2xl border h-10 flex">
                        <TabsTrigger value="history">履歴</TabsTrigger>
                        <TabsTrigger value="search">検索</TabsTrigger>
                        {showQueueTrigger && (
                            <PresenceSlide
                                in={hasQueue}
                                direction="left"
                                distance={32}
                                duration={280}
                                onExited={() => setShowQueueTrigger(false)}
                                className="flex items-stretch mx-1 relative"
                            >
                                <Badge variant={"destructive"} className="absolute -top-2 -right-2 rounded-full w-7 h-7 place-content-center" >
                                    {queryQueue?.length || 0}
                                </Badge>
                                <TabsTrigger value="queue">再生キュー</TabsTrigger>
                            </PresenceSlide>
                        )}
                    </TabsList>
                </div>
            </Tabs>
        </CookiesProvider>
    )
}