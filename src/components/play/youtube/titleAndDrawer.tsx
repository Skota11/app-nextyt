import { RefObject, useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faRotateRight, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import toJaNum from "@/utils/num2ja";
import Linkify from "linkify-react";
import { VideoAbout } from "@/types/videoAbout";
import dayjs from "dayjs";
import { faYoutube } from "@fortawesome/free-brands-svg-icons";
import AddPlaylist from "../common/addPlaylist";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function TitleAndDrawer({isLogin , observerRef , setRefreshKey , ytid} : {isLogin: boolean, observerRef: RefObject<HTMLHeadingElement | null>, setRefreshKey: (key: number | ((prevCount: number) => number)) => void , ytid:string}) {
    const [videoAbout , setVideoAbout] = useState<VideoAbout | null>(null);
    //動画情報の取得
    const getVideoAbout = async (id:string) => {
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
                }
            } catch (error) {
                console.error('Failed to fetch video data:', error);
            }
        }
    }
    useEffect(() => {
        setVideoAbout(null)
        getVideoAbout(ytid)
    } , [ytid])
    return (
        <>
        <div className='px-2 py-2'>
                        <Sheet>
                            <SheetTrigger>
                                <h1 ref={observerRef} className='m-2 break-all text-lg cursor-pointer'>{videoAbout?.snippet.title}</h1>
                            </SheetTrigger>
                            <SheetContent
                                side={'left'}
                                className="w-[90vw] max-w-[512px] md:max-w-[512px] lg:max-w-[512px]"
                            >
                                <ScrollArea className='h-full'>
                                    <SheetHeader>
                                        <SheetTitle>
                                            {videoAbout?.snippet.title}
                                        </SheetTitle>
                                        <SheetDescription>
                                            <Link href={`/channel/${videoAbout?.snippet.channelId}`}>{videoAbout?.snippet.channelTitle}</Link>
                                        </SheetDescription>
                                    </SheetHeader>
                                    
                                    <div className='sm:flex gap-x-4 my-4 gap-y-4'>
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
                                        <div className='p-4 rounded-lg bg-gray-100 shadow-sm'>
                                            <p className="text-sm mb-2">概要欄</p>
                                            <div className='text-sm break-all w-full'>
                                                <Linkify options={{ className: "text-blue-600" }}>
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
                    </div>
        </>
    )
}