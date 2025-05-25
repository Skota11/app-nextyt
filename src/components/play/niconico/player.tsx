//React
import { useEffect, useState, useRef } from "react";

//Next.js

//supabase
import { supabase } from "@/utils/supabase/client";

//Material UI
import Drawer from "@mui/material/Drawer";

//Font Awesome Icons
import { faEye, faShareFromSquare, faThumbsUp, faVolumeHigh, faVolumeXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//Utility Libraries
import dayjs from 'dayjs'
import toJaNum from "@/utils/num2ja";
import { useCookies } from "react-cookie";
import { SiNiconico } from "react-icons/si";
import { LiaCommentSlashSolid, LiaCommentSolid } from "react-icons/lia";
import AddPlaylist from "../addPlaylist";

//Play Components
//import AddPlaylist from "./addPlaylist";

interface VideoAbout { title: string, channelId: string, channelTitle: string, description: string, registeredAt: string, count: { view: string, like: string } }

export default function Home(props: { ytid: string, onEnd?: () => void }) {
    //state
    const [about, setAbout] = useState<VideoAbout | undefined>(undefined);
    const [login, setLogin] = useState(false)
    const observerRef = useRef<HTMLHeadingElement>(null);
    const playerRef = useRef<HTMLIFrameElement>(null);
    const [isPiP, setIsPiP] = useState(false);
    const [cookies] = useCookies(['pip'])
    const [play, setPlay] = useState(0)
    const [muted, setMuted] = useState(false)
    const [showComment, setShowComment] = useState(true)
    //Player関係
    const handleMessage = (event: MessageEvent) => {
        if (event.origin === 'https://embed.nicovideo.jp') {
            switch (event.data.eventName) {
                case "playerStatusChange":
                    setPlay(event.data.data.playerStatus)
                    break;
                case "playerMetadataChange":
                    setMuted(event.data.data.muted)
                    setShowComment(event.data.data.showComment)
                    break;
                default:
                    break;
            }
        }
    }
    useEffect(() => {
        window.addEventListener('message', handleMessage);
        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, [handleMessage]);
    useEffect(() => {
        if (about?.title) {
            playerRef.current?.contentWindow?.postMessage({
                eventName: 'play',
                sourceConnectorType: 1,
                playerId: "nicoPlayer"
            }, "https://embed.nicovideo.jp")
        }
    }, [about])
    useEffect(() => {
        if (play == 4) {
            props.onEnd?.()
        }
    }, [play])
    //login
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
        }
    }
    //drawer
    const [openedDrawer, setOpenedDrawer] = useState(false);
    const toggleOnCloseDrawer = () => {
        setOpenedDrawer(false);
    }
    const handleShare = async () => {
        const data: ShareData = {
            title: `${about?.title}`,
            url: `https://nico.ms/${props.ytid}`
        };
        await navigator.share(data)
    }
    return (
        <>
            {/* Player */}
            {isPiP ? <>
                <div className='aspect-video w-full max-h-4/5 rounded-lg maxHeightVideo'>
                    <div className='w-full h-full text-white flex place-content-center bg-black'><p className='text-2xl text-center'>PictureInPictureで再生中</p></div>
                </div>
            </> : <></>}
            <div className={isPiP ? "fixed bottom-8 right-4 w-96 aspect-video shadow-lg z-50 bg-white rounded-xl overflow-hidden" : 'aspect-video w-full max-h-4/5 maxHeightVideo'}>
                {props.ytid ? <>
                    <iframe ref={playerRef} className="" src={`https://embed.nicovideo.jp/watch/${props.ytid}?persistence=1&oldScript=1&referer=&from=0&allowProgrammaticFullScreen=1&autoplay=1&jsapi=1&playerId=nicoPlayer`} width={"100%"} height={"100%"} allowFullScreen allow="autoplay"></iframe>
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
                                <a className='flex gap-x-2 items-center' href={`https://nico.ms/${props.ytid}`} ><SiNiconico /> ニコニコ動画で開く</a>
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
                                <p>スマホでniconicoプレイヤーの音量調節をする場合は下から</p>
                                <a href="/niconico/player">音量調節</a>
                            </div>
                        </div>
                    </Drawer>
                </div>
            </div>
            {/* Controller */}
            <div className="">
                {props.ytid !== "" ?
                    <div className=' flex place-content-center gap-x-2'>
                        {muted ?
                            <button title="音を出す" className='border-2 p-2 rounded-full text-xs border-current' onClick={async () => {
                                playerRef.current?.contentWindow?.postMessage({
                                    eventName: 'mute',
                                    data: {
                                        mute: false
                                    },
                                    sourceConnectorType: 1,
                                    playerId: "nicoPlayer"
                                }, "https://embed.nicovideo.jp")
                            }}><FontAwesomeIcon icon={faVolumeXmark} /></button>
                            :
                            <button title="消音にする" className='border-2 p-2 rounded-full text-xs border-current' onClick={async () => {
                                playerRef.current?.contentWindow?.postMessage({
                                    eventName: 'mute',
                                    data: {
                                        mute: true
                                    },
                                    sourceConnectorType: 1,
                                    playerId: "nicoPlayer"
                                }, "https://embed.nicovideo.jp")
                            }}><FontAwesomeIcon icon={faVolumeHigh} /></button>
                        }
                        {showComment ?
                            <button title="コメントを非表示にする" className='border-2 p-2 rounded-full border-current' onClick={() => {
                                playerRef.current?.contentWindow?.postMessage({
                                    eventName: 'commentVisibilityChange',
                                    data: {
                                        commentVisibility: false
                                    },
                                    sourceConnectorType: 1,
                                    playerId: "nicoPlayer"
                                }, "https://embed.nicovideo.jp")
                            }}><LiaCommentSolid /></button>
                            :
                            <button title="コメントを表示する" className='border-2 p-2 rounded-full border-current' onClick={() => {
                                playerRef.current?.contentWindow?.postMessage({
                                    eventName: 'commentVisibilityChange',
                                    data: {
                                        commentVisibility: true
                                    },
                                    sourceConnectorType: 1,
                                    playerId: "nicoPlayer"
                                }, "https://embed.nicovideo.jp")
                            }}><LiaCommentSlashSolid /></button>
                        }
                        <button title="共有" className='border-2 p-2 rounded-full text-xs border-current' onClick={async () => { handleShare() }}><FontAwesomeIcon icon={faShareFromSquare} /></button>
                        {/* <button className='border-2 p-2 rounded-full text-xs border-current' onClick={async () => { handleFullScreen() }}><FontAwesomeIcon icon={faExpand} /></button> */}
                    </div>
                    : <></>}
            </div>
        </>
    )
}