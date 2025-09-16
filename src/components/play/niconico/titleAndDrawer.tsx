import { NicoVideoAbout } from "@/types/videoAbout";
import toJaNum from "@/utils/num2ja";
import { faEye, faFolder, faHeart, faRotateRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import AddPlaylist from "../common/addPlaylist";
import dayjs from "dayjs";
import { SiNiconico } from "react-icons/si";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function TitleAndDrawer({ytid , isLogin , observerRef , setRefreshKey} : {ytid: string , isLogin: boolean , observerRef: React.RefObject<HTMLHeadingElement | null>, setRefreshKey: (key: number | ((prevCount: number) => number)) => void}) {
    const [videoAbout , setVideoAbout] = useState<NicoVideoAbout | null>(null);
    
    //動画情報の取得
    const getVideoAbout = async (id: string) => {
        if (id !== "") {
            fetch('/api/database/history', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id }),
            })
            const res = await (await fetch(`/api/external/niconico?id=${ytid}`)).json();
            setVideoAbout({ ...res.video, tags: res.tag.items });
        }
    }
    useEffect(() => {
        setVideoAbout(null)
        getVideoAbout(ytid);
    }, [ytid])
    return(
        <>
        <div className='px-2 py-2'>
            <Sheet>
                <SheetTrigger>
                    <h1 ref={observerRef} className='m-2 break-all text-lg cursor-pointer'>{videoAbout?.title}</h1>
                </SheetTrigger>
                <SheetContent
                    side={'left'}
                    className="w-[90vw] max-w-[512px] md:max-w-[512px] lg:max-w-[512px]"
                >
                    <ScrollArea className='h-full'>
                        <SheetHeader>
                            <SheetTitle>
                                {videoAbout?.title}
                            </SheetTitle>
                            <SheetDescription>
                                {videoAbout?.channelTitle}
                            </SheetDescription>
                        </SheetHeader>
                        
                        <div className='sm:flex gap-x-4 my-4 gap-y-4'>
                            <p className='text-sm'>{dayjs(videoAbout?.registeredAt).format('YYYY年MM月DD日')}</p>
                            <p className='text-sm'><FontAwesomeIcon className='mr-2' icon={faEye} />{toJaNum(videoAbout?.count.view)}</p>
                            <p className='text-sm'><FontAwesomeIcon className='mr-2' icon={faFolder} />{toJaNum(videoAbout?.count.mylist)}</p>
                            <p className='text-sm'><FontAwesomeIcon className='mr-2' icon={faHeart} />{toJaNum(videoAbout?.count.like)}</p>
                        </div>
                        {isLogin ? <>
                            <div>
                                <AddPlaylist videoId={ytid} />
                            </div>
                        </> : <></>}
                        <div className='flex flex-col gap-y-8 my-8'>
                            <div className='p-4 rounded-lg bg-gray-100 shadow-sm'>
                                <p className="text-sm mb-2">概要欄</p>
                                <div className='text-sm break-all w-full' dangerouslySetInnerHTML={{ __html: videoAbout?.description as TrustedHTML }}>
                                </div>
                            </div>
                            <div className='p-4 rounded-lg bg-gray-100 shadow-sm'>
                                <div>
                                    <p className='text-sm mb-2'>タグ</p>
                                    <div className='flex flex-wrap gap-2'>
                                        {videoAbout?.tags?.map((tag, index) => (
                                            <span key={index} className='bg-gray-300 text-gray-800 px-2 py-1 rounded-lg text-xs'>{tag.name}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => { setRefreshKey((prev) => prev + 1) }}><FontAwesomeIcon icon={faRotateRight} className="mr-2" />プレイヤーを再読み込み</button>
                        <div className="my-4">
                            <a className='flex gap-x-2 items-center' href={`https://nico.ms/${ytid}`} ><SiNiconico /> ニコニコ動画で開く</a>
                        </div>
                    </ScrollArea>
                </SheetContent>
            </Sheet>
        </div>
        </>
    )
}