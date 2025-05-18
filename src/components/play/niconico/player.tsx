//React
import { useEffect, useState, useRef } from "react";

//Next.js

//supabase
import { supabase } from "@/utils/supabase/client";

//Material UI
import Drawer from "@mui/material/Drawer";

//Font Awesome Icons
import { faEye, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//Utility Libraries
import dayjs from 'dayjs'
import toJaNum from "@/utils/num2ja";
import { useCookies } from "react-cookie";
import { SiNiconico } from "react-icons/si";
import AddPlaylist from "../addPlaylist";

//Play Components
//import AddPlaylist from "./addPlaylist";

interface VideoAbout { title: string, channelId: string, channelTitle: string, description: string, registeredAt: string, count: { view: string, like: string } }

export default function Home(props: { ytid: string, onEnd?: () => void }) {
    //state
    const [about, setAbout] = useState<VideoAbout | undefined>(undefined);
    const [login, setLogin] = useState(false)
    const observerRef = useRef<HTMLHeadingElement>(null);
    const [isPiP, setIsPiP] = useState(false);
    const [cookies] = useCookies(['pip'])

    useEffect(() => {
        const f = async () => {
            const { data } = await supabase.auth.getSession()
            if (data.session !== null) {
                setLogin(true)
            }
        }
        f()
    }, [])
    useEffect(() => {
        getVideo(props.ytid)
    }, [props.ytid])
    useEffect(() => {
        if (!observerRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting && props.ytid && cookies.pip == "on") {
                        setIsPiP(true);
                    } else {
                        setIsPiP(false);
                    }
                });
            },
            { threshold: 0.5 }
        );

        observer.observe(observerRef.current);

        return () => {
            observer.disconnect();
        };
    }, [props.ytid]);
    const getVideo = async (id: string) => {
        if (id !== "") {
            fetch('/api/database/history', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id }),
            })
            const res = await (await fetch(`/api/niconico/video?id=${props.ytid}`)).json();
            setAbout(res.video)
            console.log(about)
        }
    }
    //drawer
    const [openedDrawer, setOpenedDrawer] = useState(false);
    const toggleOnCloseDrawer = () => {
        setOpenedDrawer(false);
    }
    return (
        <>
            {/* Player */}
            {isPiP ? <>
                <div className='aspect-video w-full max-h-4/5 rounded-lg maxHeightVideo'>
                    <div className='w-full h-full text-white flex place-content-center bg-black'><p className='text-2xl text-center'>PictureInPictureで再生中</p></div>
                </div>
            </> : <></>}
            <div className={isPiP ? "fixed bottom-8 right-4 w-96 aspect-video shadow-lg z-50 bg-white rounded-xl overflow-hidden" : 'aspect-video w-full max-h-4/5 maxHeightVideo'}            >
                {props.ytid ? <>
                    <iframe className="" src={`https://embed.nicovideo.jp/watch/${props.ytid}?persistence=1&oldScript=1&referer=&from=0&allowProgrammaticFullScreen=1`} width={"100%"} height={"100%"} allowFullScreen></iframe>
                    <p onClick={() => {
                        if (isPiP) {
                            window.scrollTo({
                                top: 0,
                                behavior: 'smooth'
                            })
                        }
                    }} className={isPiP ? "cursor-pointer text-center text-sm" : "hidden"}>PiP</p>
                </> : <div className='w-full h-full text-white flex place-content-center bg-black'><p className='text-2xl text-center'>動画が選択されていません</p></div>}
            </div>
            {/* Title&Drawer */}
            <div className='px-2 py-2'>
                <div>
                    <h1 ref={observerRef} className='m-2 break-all text-lg cursor-pointer flex' onClick={() => { setOpenedDrawer(true) }}><SiNiconico className="m-1" /><span>{about?.title}</span></h1>
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
                            <h1 className='text-xl'> {about?.title}</h1>
                            <p className='text-lg text-slate-600' onClick={() => { }}>{about?.channelTitle}</p>
                            <div className='sm:flex gap-x-4 my-4 gap-y-4'>
                                <p className='text-lg'>{dayjs(about?.registeredAt).format('YYYY年MM月DD日')}</p>
                                <p className='text-lg'><FontAwesomeIcon className='mr-2' icon={faEye} />{toJaNum(about?.count.view)}</p>
                                <p className='text-lg'><FontAwesomeIcon className='mr-2' icon={faThumbsUp} /> {toJaNum(about?.count.like)}</p>
                            </div>
                            <div className="my-4">
                                <a className='' href={`https://nico.ms/${props.ytid}`} >◯ ニコニコ動画で開く</a>
                            </div>
                            {login ? <>
                                <div>
                                    <AddPlaylist videoId={props.ytid} />
                                </div>
                            </> : <></>}
                            <div className='p-4 rounded-lg bg-gray-100 '>
                                <div className='text-sm break-all w-full' dangerouslySetInnerHTML={{ __html: about?.description as TrustedHTML }}>
                                </div>
                            </div>
                            <div className='p-4 my-8 rounded-lg bg-gray-100 text-xs'>
                                <p>スマホでniconicoプレイヤーの音量が小さい方は以下をお試しください。</p>
                                <p>①このページをブラウザのデスクトップ用サイトに変更する</p>
                                <p>②プレイヤーの音量ボタンを長押しし、もう片方の指で最大音量に設定する</p>
                                <p>③デスクトップ用サイトを解除する</p>
                            </div>
                        </div>
                    </Drawer>
                </div>
            </div>
        </>
    )
}