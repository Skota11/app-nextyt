import { RefObject, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faRotateRight, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import toJaNum from "@/utils/num2ja";
import { VideoAbout } from "@/types/videoAbout";
import dayjs from "dayjs";
import { faYoutube } from "@fortawesome/free-brands-svg-icons";
import AddPlaylist from "../common/addPlaylist";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMedia } from 'react-use'
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";

export default function TitleAndDrawer({ isLogin, observerRef, setRefreshKey, ytid }: { isLogin: boolean, observerRef: RefObject<HTMLHeadingElement | null>, setRefreshKey: (key: number | ((prevCount: number) => number)) => void, ytid: string }) {
    const [videoAbout, setVideoAbout] = useState<VideoAbout | null>(null);
    const [channelInfo, setChannelInfo] = useState<{ snippet: { title: string, thumbnails: { default: { url: string } } } } | null>(null);
    const [songInfo, setSongInfo] = useState<{ song: boolean, title: string, artist: string, thumbnail: string } | null>(null);
    //チャンネル情報の取得
    const getChannelInfo = async (channelId: string) => {
        try {
            const res = await fetch(`/api/external/channel?id=${channelId}`);
            const data = await res.json();
            if (data.data && data.data.length > 0) {
                setChannelInfo(data.data[0]);
            }
        } catch (error) {
            console.error('Failed to fetch channel data:', error);
        }
    };

    //動画情報の取得
    const getVideoAbout = async (id: string) => {
        if (id !== "") {
            // 履歴に追加
            fetch('/api/database/history', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id }),
            })
            // 動画情報
            try {
                const res = await fetch(`/api/external/video?id=${id}`);
                const data = await res.json();

                if (data.snippet && data.statistics) {
                    setVideoAbout(data)
                    // チャンネル情報も取得
                    if (data.snippet.channelId) {
                        getChannelInfo(data.snippet.channelId);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch video data:', error);
            }
            try {
                const res_song = await fetch(`/api/external/music?id=${id}`);
                const data_song = await res_song.json();
                setSongInfo(data_song);
            } catch (error) {
                console.error('Failed to fetch music data:', error);
            }
        }
    }
    useEffect(() => {
        setVideoAbout(null)
        setChannelInfo(null)
        getVideoAbout(ytid)
    }, [ytid])
    //レスポンシブ
    const [open, setOpen] = useState(false)
    const isWide = useMedia('(min-width: 512px)')
    return (
        <>
            <div className='px-2 py-2'>
                <h1 onClick={() => {
                    setOpen(true)
                }} ref={observerRef} className='m-2 break-all text-lg cursor-pointer'>{videoAbout?.snippet.title}</h1>
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
                                    {songInfo?.song ? <>
                                        <div className="p-4 rounded-lg bg-gray-100 shadow-sm">
                                            <p className="text-sm mb-2">音楽</p>
                                            <div className="flex items-center gap-x-4">
                                                <Image alt="songThumbnail" src={songInfo.thumbnail} width={80} height={80} unoptimized className="rounded-md" />
                                                <div>
                                                    <p className="font-bold">{songInfo.title}</p>
                                                    <p className="text-sm">{songInfo.artist}</p>
                                                </div>
                                            </div>
                                        </div></> : <></>}
                                    <div className='p-4 rounded-lg bg-gray-100 shadow-sm'>
                                        <p className="text-sm mb-2">概要欄</p>
                                        <div className='text-sm break-all w-full'>
                                            {videoAbout?.snippet.description.split(/(\n)/).map((v: string, i: number) => (i & 1 ? <br key={i} /> : v))}
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
                                    {songInfo?.song ? <>
                                        <div className="p-4 rounded-lg bg-gray-100 shadow-sm">
                                            <p className="text-sm mb-2">音楽</p>
                                            <div className="flex items-center gap-x-4">
                                                <Image alt="songThumbnail" src={songInfo.thumbnail} width={80} height={80} unoptimized className="rounded-md" />
                                                <div>
                                                    <p className="font-bold">{songInfo.title}</p>
                                                    <p className="text-sm">{songInfo.artist}</p>
                                                </div>
                                            </div>
                                        </div></> : <></>}
                                    <div className='p-4 rounded-lg bg-gray-100 shadow-sm'>
                                        <p className="text-sm mb-2">概要欄</p>
                                        <div className='text-sm break-all w-full'>
                                            {videoAbout?.snippet.description.split(/(\n)/).map((v: string, i: number) => (i & 1 ? <br key={i} /> : v))}
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