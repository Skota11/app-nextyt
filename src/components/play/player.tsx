//React
import { useEffect, useState, useRef, useCallback } from "react";
import ReactPlayer from "react-player";

//Next.js
import Link from "next/link";

//supabase
import { supabase } from "@/utils/supabase/client";

//Material UI
import Drawer from "@mui/material/Drawer";

//Font Awesome Icons
import { faYoutube } from "@fortawesome/free-brands-svg-icons";
import { faDownload, faEye, faMusic, faRepeat, faRotateRight, faShareFromSquare, faThumbsUp, faVolumeHigh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//Utility Libraries
import dayjs from 'dayjs'
import toJaNum from "@/utils/num2ja";
import Linkify from "linkify-react";
import toast, { Toaster } from 'react-hot-toast';

//Play Components
import AddPlaylist from "./addPlaylist";
import { useLocalStorage, useNetworkState } from "react-use";

interface VideoAbout { title: string, channelId: string, channelTitle: string, description: string, publishedAt: string }
interface VideoStatistics { viewCount: "", likeCount: "" };
interface SongAbout { song: boolean, title?: string, artist?: string, thumbnail?: string }

export default function Home(props: { ytid: string, onEnd?: () => void }) {
    //state
    const [playing, setPlaying] = useState(true)
    const [muted, setMuted] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1)
    const [about, setAbout] = useState<VideoAbout | undefined>(undefined);
    const [statistics, setStatistic] = useState<VideoStatistics | undefined>(undefined);
    const [songAbout, setSongAbout] = useState<SongAbout | undefined>(undefined)
    const [login, setLogin] = useState(false)
    const observerRef = useRef<HTMLHeadingElement>(null);
    const playerRef = useRef<ReactPlayer>(null);
    const [isPiP, setIsPiP] = useState(false);
    const [isAudio, setIsAudio] = useState(false);
    const [audioUrl, setAudioUrl] = useState("");
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [repeat, setRepeat] = useState(false);
    const [PiP] = useLocalStorage("pip");
    const networkState = useNetworkState();
    const playerContainerRef = useRef<HTMLDivElement>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const handleKeyPress = useCallback((event: KeyboardEvent) => {
        // 入力要素でのキー入力を無視
        if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
            return;
        }

        switch (event.key.toLowerCase()) {
            case ' ':
            case 'space':
                event.preventDefault();
                setPlaying(prev => !prev);
                break;
            case 'm':
                event.preventDefault();
                setMuted(prev => !prev);
                break;
            case '1':
                event.preventDefault();
                setPlaybackRate(1);
                break;
            case '2':
                event.preventDefault();
                setPlaybackRate(2);
                break;
            case '3':
                event.preventDefault();
                setPlaybackRate(1.5);
                break;
            case 'arrowleft':
                event.preventDefault();
                playerRef.current?.seekTo(playerRef.current?.getCurrentTime() - 5, 'seconds');
                break;
            case 'arrowright':
                event.preventDefault();
                playerRef.current?.seekTo(playerRef.current?.getCurrentTime() + 5, 'seconds');
                break;
        }
    }, []);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleKeyPress]);

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
        setSongAbout(undefined)
        setVideoUrl(null);
        setPlaying(true);
    }, [props.ytid])
    useEffect(() => {
        if (!observerRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting && props.ytid && PiP) {
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
            const res = await (await fetch(`https://www.googleapis.com/youtube/v3/videos?part=id,snippet,statistics&id=${id}&key=AIzaSyC1KMsyjrnEfHJ3xnQtPX0DSxWHfyjUBeo`)).json();
            setAbout(res.items[0].snippet)
            setStatistic(res.items[0].statistics);
            const res_ = await (await fetch(`/api/external/music?id=${id}`)).json()
            setSongAbout(res_)
        }
    }
    const onEnd = () => {
        if (repeat) {
            playerRef.current?.seekTo(0, 'seconds');
            setPlaying(true);
        } else if (props.onEnd) {
            props.onEnd();
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
            url: `https://youtu.be/${props.ytid}`
        };
        await navigator.share(data)
    }
    const getAudioUrl = async (id: string) => {
        const toastId = toast.loading("ダウンロード中")
        const res = await fetch(`/api/download/audio?id=${id}`)
        const data = await res.json()
        console.log(data)
        setAudioUrl(data.downloadUrl)
        toast.dismiss(toastId)
    }
    useEffect(() => {
        if (isAudio) {
            setAudioUrl("")
            getAudioUrl(props.ytid)
        }
    }, [props.ytid, isAudio])
    return (
        <>
            {/* Player */}
            {isPiP ? <>
                <div className='rounded-lg sm:rounded-none aspect-video w-full max-h-4/5 rounded-lg maxHeightVideo'>
                    <div className='w-full h-full text-white flex place-content-center bg-black'><p className='text-2xl text-center'>PictureInPictureで再生中</p></div>
                </div>
            </> : <></>}
            <div className={isPiP ? "fixed bottom-8 right-4 w-96 aspect-video shadow-lg z-50 bg-white rounded-xl overflow-hidden" : 'aspect-video w-full max-h-4/5 maxHeightVideo fullscreen-container'}
                style={isAudio ? { backgroundImage: `url(https://i.ytimg.com/vi/${props.ytid}/hqdefault.jpg)`, backgroundRepeat: "no-repeat", backgroundPosition: "center", backgroundSize: "cover" } : { backgroundImage: "none" }}
                ref={playerContainerRef}
            >
                {props.ytid ? <>
                    <ReactPlayer
                        key={refreshKey}
                        className={isPiP ? "react-player" : "react-player"}
                        url={isAudio ? audioUrl : `https://www.youtube.com/watch?v=${props.ytid}`}
                        playing={playing}
                        playbackRate={playbackRate}
                        muted={muted}
                        width={"100%"}
                        height={"100%"}
                        controls={true}
                        ref={playerRef}
                        onPause={() => { setPlaying(false) }}
                        onPlay={() => { setPlaying(true) }}
                        onEnded={onEnd}
                        config={{
                            youtube: {
                                playerVars: {
                                    vq: networkState.type === 'wifi' ? 'hd1080' : 'small',
                                }
                            },
                        }}
                    />

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
                    <h1 ref={observerRef} className='m-2 break-all text-lg cursor-pointer' onClick={() => { setOpenedDrawer(true) }}>{about?.title}</h1>
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
                            <h1 className='text-xl'>{about?.title}</h1>
                            <Link href={`/channel/${about?.channelId}`}><p className='text-lg text-slate-600' onClick={() => { }}>{about?.channelTitle}</p></Link>
                            <div className='sm:flex gap-x-4 my-4 gap-y-4'>
                                <p className='text-sm'>{dayjs(about?.publishedAt).format('YYYY年MM月DD日')}</p>
                                <p className='text-sm'><FontAwesomeIcon className='mr-2' icon={faEye} />{toJaNum(statistics?.viewCount)}</p>
                                <p className='text-sm'><FontAwesomeIcon className='mr-2' icon={faThumbsUp} /> {toJaNum(statistics?.likeCount)}</p>
                            </div>
                            {login ? <>
                                <div>
                                    <AddPlaylist videoId={props.ytid} />
                                </div>
                            </> : <></>}
                            <div className='flex flex-col gap-y-8 my-8'>
                                {songAbout?.song && (
                                    <div className='p-4 rounded-lg bg-gray-100 shadow-sm'>
                                        <p className="text-sm mb-2">曲情報</p>
                                        <div className='flex gap-x-4'>
                                            <div className="w-1/4">
                                                <img src={songAbout.thumbnail} />
                                            </div>
                                            <div>
                                                <p>{songAbout.title}</p>
                                                <p className="text-sm text-slate-600">{songAbout.artist}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className='p-4 rounded-lg bg-gray-100 shadow-sm'>
                                    <p className="text-sm mb-2">概要欄</p>
                                    <div className='text-sm break-all w-full'>
                                        <Linkify options={{ className: "text-blue-600" }}>
                                            {about?.description.split(/(\n)/).map((v: string, i: number) => (i & 1 ? <br key={i} /> : v))}
                                        </Linkify>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => { setRefreshKey(refreshKey + 1) }}><FontAwesomeIcon icon={faRotateRight} className="mr-2" />プレイヤーを再読み込み</button>
                            <div className="my-4">
                                <a className='' href={`https://youtu.be/${props.ytid}`} ><FontAwesomeIcon className='mr-2' icon={faYoutube} />Youtubeで開く</a>
                            </div>
                        </div>
                    </Drawer>
                </div>
            </div>
            {/* Controller */}
            <div className="">
                {props.ytid !== "" ?
                    <div className='flex justify-center items-center gap-x-3'>
                        <button
                            title="1倍速"
                            className={`
                                w-12 h-12 border-2 rounded-full text-xs border-current 
                                flex items-center justify-center gap-1 flex-shrink-0
                                hover:bg-gray-100 transition-colors duration-200
                                ${playbackRate === 1 ? 'bg-gray-200' : ''}
                            `}
                            onClick={async () => { setPlaybackRate(1) }}
                        >
                            <span className="text-xs font-medium">1×</span>
                        </button>
                        <button
                            title="1.5倍速"
                            className={`
                                w-12 h-12 border-2 rounded-full text-xs border-current 
                                flex items-center justify-center gap-1 flex-shrink-0
                                hover:bg-gray-100 transition-colors duration-200
                                ${playbackRate === 1.5 ? 'bg-gray-200' : ''}
                            `}
                            onClick={async () => { setPlaybackRate(1.5) }}
                        >
                            <span className="text-xs font-medium">1.5×</span>
                        </button>
                        <button
                            title="2倍速"
                            className={`
                                w-12 h-12 border-2 rounded-full text-xs border-current 
                                flex items-center justify-center gap-1 flex-shrink-0
                                hover:bg-gray-100 transition-colors duration-200
                                ${playbackRate === 2 ? 'bg-gray-200' : ''}
                            `}
                            onClick={async () => { setPlaybackRate(2) }}
                        >
                            <span className="text-xs font-medium">2×</span>
                        </button>
                        <button
                            title={muted ? "音を出す" : "消音にする"}
                            className={`
                                w-12 h-12 border-2 rounded-full text-xs border-current 
                                flex items-center justify-center flex-shrink-0 relative
                                hover:bg-gray-100 transition-colors duration-200
                                ${muted ? 'bg-red-100 border-red-500 text-red-700' : ''}
                            `}
                            onClick={async () => { setMuted(!muted) }}
                        >
                            <FontAwesomeIcon icon={faVolumeHigh} />
                            {muted && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-8 h-0.5 bg-current rotate-45 transform"></div>
                                </div>
                            )}
                        </button>
                        <button
                            title="共有"
                            className="w-12 h-12 border-2 rounded-full text-xs border-current flex items-center justify-center flex-shrink-0 hover:bg-gray-100 transition-colors duration-200"
                            onClick={async () => { handleShare() }}
                        >
                            <FontAwesomeIcon icon={faShareFromSquare} />
                        </button>
                        <button
                            title="リピート"
                            className={`
                                w-12 h-12 border-2 rounded-full text-xs border-current 
                                flex items-center justify-center flex-shrink-0 relative
                                hover:bg-gray-100 transition-colors duration-200
                                ${repeat ? 'bg-green-100 border-green-500 text-green-700' : 'opacity-60'}
                            `}
                            onClick={async () => { setRepeat(!repeat) }}
                        >
                            <FontAwesomeIcon icon={faRepeat} />
                            {!repeat && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-8 h-0.5 bg-current rotate-45 transform"></div>
                                </div>
                            )}
                        </button>
                        <button title="音声のみで再生" className='hidden w-12 h-12 border-2 rounded-full text-xs border-current flex items-center justify-center flex-shrink-0 hover:bg-gray-100 transition-colors duration-200' onClick={async () => { setIsAudio(prev => !prev) }}>{isAudio ? <FontAwesomeIcon icon={faYoutube} /> : <FontAwesomeIcon icon={faMusic} />}</button>
                        <a
                            title="ダウンロード"
                            className="hidden w-12 h-12 border-2 rounded-full text-xs border-current flex items-center justify-center flex-shrink-0 hover:bg-gray-100 transition-colors duration-200"
                            href={videoUrl || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={async (e) => {
                                if (!videoUrl) {
                                    e.preventDefault()
                                    toast.success("ダウンロードを開始します")
                                    const res = await fetch(`/api/download/video?id=${props.ytid}`)
                                    const data = await res.json()
                                    setVideoUrl(data.downloadUrl)
                                    toast.success("もう一度クリックしてダウンロードを開始してください")
                                } else {
                                    setPlaying(false)
                                }
                            }}
                        >
                            <FontAwesomeIcon icon={faDownload} />
                        </a>
                    </div>
                    : <div className=""></div>}
            </div>
            <Toaster position="bottom-center" />
        </>
    )
}
