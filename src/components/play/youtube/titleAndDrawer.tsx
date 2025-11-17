import { Ref, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronRight, faEye, faRotateRight, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import toJaNum from "@/utils/num2ja";
import { SongInfo, VideoAbout } from "@/types/videoAbout";
import dayjs from "dayjs";
import { faYoutube } from "@fortawesome/free-brands-svg-icons";
import AddPlaylist from "../common/addPlaylist";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMedia } from 'react-use'
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import SongSection from "./drawer/song";
import Linkify from "linkify-react";
import useSWR from "swr";
import { dataFetcher, jsonFetcher } from "@/lib/swr";

export default function TitleAndDrawer({ isLogin, observerRef, setRefreshKey, ytid }: { isLogin: boolean, observerRef: Ref<HTMLHeadingElement | null>, setRefreshKey: (key: number | ((prevCount: number) => number)) => void, ytid: string }) {
    // 動画情報（SWRでキャッシュ）
    const { data: videoAbout } = useSWR<VideoAbout>(
        ytid ? `/api/external/video?id=${ytid}` : null,
        jsonFetcher,
        { dedupingInterval: 86_400_000, revalidateOnFocus: false }
    );

    // チャンネル情報（動画情報に依存）
    const channelId = videoAbout?.snippet?.channelId;
    const { data: channelItems } = useSWR(
        channelId ? `/api/external/channel?id=${channelId}` : null,
        dataFetcher,
        { dedupingInterval: 604_800_000, revalidateOnFocus: false }
    );
    const channelInfo = channelItems?.[0] ?? null;

    // 楽曲情報（外部API）
    const { data: songInfo } = useSWR<SongInfo>(
        ytid ? `https://yt-song.deno.dev/track?v=${ytid}` : null,
        jsonFetcher,
        { dedupingInterval: 604_800_000, revalidateOnFocus: false }
    );

    // 履歴追加は副作用として一度だけ
    useEffect(() => {
        if (!ytid) return;
        fetch('/api/database/history', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: ytid }),
        }).catch(() => {});
    }, [ytid]);
    //レスポンシブ
    const [open, setOpen] = useState(false)
    const isWide = useMedia('(min-width: 512px)')
    if(!videoAbout){
        return( <></>)
    }
    return (
        <>
            <div className='px-2 py-2'>
                <h1
                    onClick={() => setOpen(true)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setOpen(true);
                        }
                    }}
                    ref={observerRef}
                    className='group m-2 break-all text-lg cursor-pointer focus:outline-none rounded inline-flex items-center gap-x-2'
                >
                    <span className='flex-1 font-bold'>{videoAbout?.snippet.title}</span>
                    <span className='w-8 h-8 flex place-content-center items-center rounded-full bg-blue-100 text-blue-600 border border-blue-200 group-hover:bg-blue-200 transition-colors'>
                        {isWide ? <FontAwesomeIcon icon={faChevronRight}/> : <FontAwesomeIcon icon={faChevronDown}/> }
                    </span>
                </h1>
                {isWide ? (
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetContent
                            side={'left'}
                            className="w-[90vw] max-w-[512px] md:max-w-[512px] lg:max-w-[512px]"
                        >
                            <ScrollArea className='h-full pt-4'>
                                <SheetHeader>
                                    <SheetTitle className="">
                                        {videoAbout?.snippet.title}
                                    </SheetTitle>
                                    <SheetDescription>
                                        <Link href={`/channel/${videoAbout?.snippet.channelId}`} className="flex items-center gap-x-2 pt-2">
                                            <Image alt="channelImage" src={channelInfo?.snippet?.thumbnails?.default?.url || '/icon-192x192.png'} width={40} height={40} unoptimized className="rounded-full" />
                                            <span>{videoAbout?.snippet.channelTitle}</span>
                                        </Link>
                                    </SheetDescription>
                                </SheetHeader>

                                <div className='flex gap-x-4 my-4 gap-y-4 flex-nowrap'>
                                    <p className='text-sm'>{dayjs(videoAbout?.snippet.publishedAt).format('YYYY年MM月DD日')}</p>
                                    <p className='text-sm'><FontAwesomeIcon className='mr-2' icon={faEye} />{toJaNum(videoAbout?.statistics.viewCount)}</p>
                                    <p className='text-sm'><FontAwesomeIcon className='mr-2' icon={faThumbsUp} /> {toJaNum(videoAbout?.statistics.likeCount)}</p>
                                </div>
                                {isLogin ? <>
                                    <div>
                                        <AddPlaylist videoId={ytid} />
                                    </div>
                                </> : <></>}
                                <div className='flex flex-col gap-y-8 my-8'>
                                    {songInfo?.song ? <SongSection songInfo={songInfo} /> : <></>}
                                    <div className='p-4 rounded-lg bg-gray-100 dark:bg-popover shadow-sm'>
                                        <p className="text-sm mb-2">概要欄</p>
                                        <div className='text-sm break-all w-full'>
                                            <Linkify options={{
                                                 target: '_blank', 
                                                 rel: 'noopener noreferrer' , 
                                                 className: 'text-primary underline-offset-4'
                                                 }}>
                                                {videoAbout?.snippet.description.split(/(\n)/).map((v: string, i: number) => (i & 1 ? <br key={i} /> : v))}
                                            </Linkify>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => { setRefreshKey((prevCount) => prevCount + 1) }}><FontAwesomeIcon icon={faRotateRight} className="mr-2" />プレイヤーを再読み込み</button>
                                <div className="my-4">
                                    <a className='' href={`https://youtu.be/${ytid}`} ><FontAwesomeIcon className='mr-2' icon={faYoutube} />Youtubeで開く</a>
                                </div>
                            </ScrollArea>
                        </SheetContent>
                    </Sheet>
                ) : (
                    <Drawer open={open} onOpenChange={setOpen}>
                        <DrawerContent className="h-[90vh] p-4">
                            <ScrollArea className='h-full pt-4'>
                                <DrawerHeader>
                                    <DrawerTitle>
                                        {videoAbout?.snippet.title}
                                    </DrawerTitle>
                                    <DrawerDescription>
                                        <Link href={`/channel/${videoAbout?.snippet.channelId}`} className="flex items-center gap-x-2 place-content-center pt-2">
                                            <Image alt="channelImage" src={channelInfo?.snippet?.thumbnails?.default?.url || '/icon-192x192.png'} width={40} height={40} unoptimized className="rounded-full" />
                                            <span>{videoAbout?.snippet.channelTitle}</span>
                                        </Link>
                                    </DrawerDescription>
                                </DrawerHeader>
                                <div className='flex gap-x-4 my-4 gap-y-4 flex-nowrap'>
                                    <p className='text-sm'>{dayjs(videoAbout?.snippet.publishedAt).format('YYYY年MM月DD日')}</p>
                                    <p className='text-sm'><FontAwesomeIcon className='mr-2' icon={faEye} />{toJaNum(videoAbout?.statistics.viewCount)}</p>
                                    <p className='text-sm'><FontAwesomeIcon className='mr-2' icon={faThumbsUp} /> {toJaNum(videoAbout?.statistics.likeCount)}</p>
                                </div>
                                {isLogin ? <>
                                    <div>
                                        <AddPlaylist videoId={ytid} />
                                    </div>
                                </> : <></>}
                                <div className='flex flex-col gap-y-8 my-8'>
                                    {songInfo?.song ? <SongSection songInfo={songInfo} /> : <></>}
                                    <div className='p-4 rounded-lg bg-gray-100 dark:bg-popover shadow-sm'>
                                        <p className="text-sm mb-2">概要欄</p>
                                        <div className='text-sm break-all w-full'>
                                            <Linkify options={{ target: '_blank', rel: 'noopener noreferrer' , className: 'text-primary underline-offset-4' }}>
                                                {videoAbout?.snippet.description.split(/(\n)/).map((v: string, i: number) => (i & 1 ? <br key={i} /> : v))}
                                            </Linkify>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => { setRefreshKey((prevCount) => prevCount + 1) }}><FontAwesomeIcon icon={faRotateRight} className="mr-2" />プレイヤーを再読み込み</button>
                                <div className="my-4">
                                    <a className='' href={`https://youtu.be/${ytid}`} ><FontAwesomeIcon className='mr-2' icon={faYoutube} />Youtubeで開く</a>
                                </div>
                            </ScrollArea>
                        </DrawerContent>
                    </Drawer>
                )}
            </div >
        </>
    )
}