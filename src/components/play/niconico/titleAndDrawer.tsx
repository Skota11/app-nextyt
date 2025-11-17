import { NicoVideoAbout } from "@/types/videoAbout";
import toJaNum from "@/utils/num2ja";
import { faChevronDown, faChevronRight, faEye, faFolder, faHeart, faRotateRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useMemo, useState, Ref } from "react";
import AddPlaylist from "../common/addPlaylist";
import dayjs from "dayjs";
import { SiNiconico } from "react-icons/si";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMedia } from "react-use";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import useSWR from "swr";
import { jsonFetcher } from "@/lib/swr";

export default function TitleAndDrawer({ ytid, isLogin, observerRef, setRefreshKey }: { ytid: string, isLogin: boolean, observerRef: Ref<HTMLHeadingElement | null>, setRefreshKey: (key: number | ((prevCount: number) => number)) => void }) {
    const { data: nicoData } = useSWR(
        ytid ? `/api/external/niconico?id=${ytid}` : null,
        jsonFetcher,
        { dedupingInterval: 86_400_000, revalidateOnFocus: false }
    );
    const videoAbout: NicoVideoAbout | null = useMemo(() => {
        if (!nicoData) return null;
        return { ...nicoData.video, tags: nicoData?.tag?.items } as NicoVideoAbout;
    }, [nicoData]);
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
        return( <></> )
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
                                    role="button"
                                    tabIndex={0}
                                    aria-expanded={open}
                                    aria-label="動画の詳細を表示"
                                    className='group m-2 break-all text-lg cursor-pointer focus:outline-none rounded inline-flex items-center gap-x-2'
                                >
                                    <span className='flex-1 font-bold'>{videoAbout?.title}</span>
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
                                    <div className='p-4 rounded-lg bg-gray-100 dark:bg-popover shadow-sm'>
                                        <p className="text-sm mb-2">概要欄</p>
                                        <div className='text-sm break-all w-full [&_a]:text-primary [&_a]:underline-offset-4' dangerouslySetInnerHTML={{ __html: videoAbout?.description as TrustedHTML }}>
                                        </div>
                                    </div>
                                    <div className='p-4 rounded-lg bg-gray-100 dark:bg-popover shadow-sm'>
                                        <div>
                                            <p className='text-sm mb-2'>タグ</p>
                                            <div className='flex flex-wrap gap-2'>
                                                {videoAbout?.tags?.map((tag, index) => (
                                                    <span key={index} className='bg-gray-300 dark:bg-slate-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-lg text-xs'>{tag.name}</span>
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
                ) : (
                    <Drawer open={open} onOpenChange={setOpen}>
                        <DrawerContent className="h-[90vh] p-4">
                            <ScrollArea className='h-full pt-4'>
                                <DrawerHeader>
                                    <DrawerTitle>
                                        {videoAbout?.title}
                                    </DrawerTitle>
                                </DrawerHeader>
                                <div className='flex gap-x-4 my-4 gap-y-4 flex-nowrap'>
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
                                    <div className='p-4 rounded-lg bg-gray-100 dark:bg-popover shadow-sm'>
                                        <p className="text-sm mb-2">概要欄</p>
                                        <div className='text-sm break-all w-full [&_a]:text-primary [&_a]:underline-offset-4' dangerouslySetInnerHTML={{ __html: videoAbout?.description as TrustedHTML }}>
                                        </div>
                                    </div>
                                    <div className='p-4 rounded-lg bg-gray-100 dark:bg-popover shadow-sm'>
                                        <div>
                                            <p className='text-sm mb-2'>タグ</p>
                                            <div className='flex flex-wrap gap-2'>
                                                {videoAbout?.tags?.map((tag, index) => (
                                                    <span key={index} className='bg-gray-300 dark:bg-slate-700 text-gray-800 px-2 py-1 rounded-lg text-xs'>{tag.name}</span>
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
                        </DrawerContent>
                    </Drawer>
                )}
            </div>
        </>
    )
}