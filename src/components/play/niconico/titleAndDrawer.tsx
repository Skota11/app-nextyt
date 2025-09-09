import { NicoVideoAbout } from "@/types/videoAbout";
import toJaNum from "@/utils/num2ja";
import { faEye, faFolder, faHeart, faRotateRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Drawer from "@mui/material/Drawer"
import { useEffect, useState } from "react";
import AddPlaylist from "../common/addPlaylist";
import dayjs from "dayjs";
import { SiNiconico } from "react-icons/si";

export default function TitleAndDrawer({ytid , isLogin , observerRef , setRefreshKey} : {ytid: string , isLogin: boolean , observerRef: React.RefObject<HTMLHeadingElement | null>, setRefreshKey: (key: number | ((prevCount: number) => number)) => void}) {
    const [videoAbout , setVideoAbout] = useState<NicoVideoAbout | null>(null);
    const [openedDrawer, setOpenedDrawer] = useState(false);
    const toggleOnCloseDrawer = () => {
        setOpenedDrawer(false);
    }
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
        <div className='px-2 py-2'>
                        <div>
                            <h1 ref={observerRef} className='m-2 break-all text-lg cursor-pointer' onClick={() => { setOpenedDrawer(true) }}>{videoAbout?.title}</h1>
                            <Drawer
                                anchor={'left'}
                                open={openedDrawer}
                                onClose={toggleOnCloseDrawer}
                                PaperProps={{
                                    sx: { width: "90%", maxWidth: "512px" },
                                }}
                            >
                                <p className='mt-4 text-center cursor-pointer' onClick={() => { setOpenedDrawer(false) }}>閉じる</p>
                                <div className='p-8'>
                                    <h1 className='text-xl'> {videoAbout?.title}</h1>
                                    <p className='text-lg text-slate-600' onClick={() => { }}>{videoAbout?.channelTitle}</p>
                                    <div className='flex gap-x-2 my-4 gap-y-4 text-sm'>
                                        <p className=''>{dayjs(videoAbout?.registeredAt).format('YYYY年MM月DD日')}</p>
                                        <p className=''><FontAwesomeIcon className='mr-1' icon={faEye} />{toJaNum(videoAbout?.count.view)}</p>
                                        <p className=''><FontAwesomeIcon className='mr-1' icon={faFolder} />{toJaNum(videoAbout?.count.mylist)}</p>
                                        <p className=''><FontAwesomeIcon className='mr-1' icon={faHeart} />{toJaNum(videoAbout?.count.like)}</p>
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
                                </div>
                            </Drawer>
                        </div>
                    </div>
    )
}