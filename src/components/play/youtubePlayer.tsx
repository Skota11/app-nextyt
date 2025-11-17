//React
import { useEffect, useState, useRef } from "react";

//supabase
import { createClient } from "@/lib/supabase/client";

//Utility Libraries
import ReactPlayer from "react-player";
import { Toaster } from 'react-hot-toast';
import { useLocalStorage } from "react-use";

//Player Components
import TitleAndDrawer from "./youtube/titleAndDrawer";
import KeyPress from "./youtube/keypress";
import Controller from "./youtube/controller";

export default function Home(props: { ytid: string, onEnd?: () => void }) {
    const supabase = createClient();
    //state
    const [playerState , setPlayerState] = useState({playing : false , muted: false , playbackRate: 1});
    const [repeat , setRepeat] = useLocalStorage("repeat", false);
    const [autoPlay] = useLocalStorage<boolean>('autoPlay', true);
    const [PiP] = useLocalStorage("pip");
    const [isLogin, setIsLogin] = useState(false)
    const observerRef = useRef<HTMLHeadingElement | null>(null);
    const [observerNode, setObserverNode] = useState<HTMLHeadingElement | null>(null);
    const observerRefCallback = (el: HTMLHeadingElement | null) => { observerRef.current = el; setObserverNode(el); };
    const playerRef = useRef<ReactPlayer>(null);
    const [isPiP, setIsPiP] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    //login check
    useEffect(() => {
        const f = async () => {
            const { data } = await supabase.auth.getSession()
            if (data.session !== null) {
                setIsLogin(true)
            }
        }
        f()
    }, [])
    //AutoPlay
    useEffect(() => {
        if (autoPlay) { setPlayerState({ ...playerState, playing: true }); } else { setPlayerState({ ...playerState, playing: false }); }
    }, [props.ytid])
    //PiP observer
    useEffect(() => {
        console.log("PiP Observer Set");
        if (!observerNode) return;
        console.log("observerNode:", observerNode);
        const observer = new IntersectionObserver(
            (entries) => {
                console.log("IntersectionObserver entries:", entries);
                entries.forEach((entry) => {
                    if (!entry.isIntersecting && props.ytid && PiP) {
                        setIsPiP(true);
                    } else {
                        setIsPiP(false);
                    }
                });
            },
            { threshold: 1 }
        );
        observer.observe(observerNode);
        return () => {
            observer.disconnect();
        };
    }, [observerNode, props.ytid, PiP])
    //fullscreen observer
    useEffect(() => {
        const handleFullscreenChange = () => {
            if (document.fullscreenElement == playerRef.current?.getInternalPlayer()?.getIframe()) {
                const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                if (isMobile && screen.orientation && 'lock' in screen.orientation) {
                    (screen.orientation as ScreenOrientation & { lock: (orientation: string) => Promise<void> }).lock("landscape").catch((error: Error) => {
                        console.error("Screen orientation lock failed:", error);
                    });
                }
            } else {
                // フルスクリーンを終了した時に画面の向きのロックを解除
                if (screen.orientation) {
                    screen.orientation.unlock();
                }
            }
        }
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
        }
    }, [])
    //Player OnEnd
    const onEnd = () => {
        if (repeat) {
            playerRef.current?.seekTo(0, 'seconds');
            setPlayerState({ ...playerState, playing: true });
        } else if (props.onEnd) {
            props.onEnd();
        }
    }
    return (
        <>
            {/* KeyPress */}
            <KeyPress playerRef={playerRef} setPlayerState={setPlayerState} />
            {/* Player */}
            {isPiP && (
                <div className='rounded-lg sm:rounded-none aspect-video w-full max-h-4/5 maxHeightVideo'>
                    <div className='w-full h-full text-white flex place-content-center items-center bg-black'><p className='text-2xl text-center'>PictureInPictureで再生中</p></div>
                </div>
            )}
            {props.ytid ? (
                <div className={
                    `aspect-video
                    ${isPiP ? "fixed md:bottom-4 bottom-16 right-4 w-96 shadow-lg z-50 bg-white rounded-xl overflow-hidden" : 'w-full max-h-4/5 maxHeightVideo fullscreen-container'}
                    `
                }>
                    {isPiP && (
                        <div className="absolute top-2 left-2 z-10 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded cursor-pointer" onClick={
                            () => {window.scrollTo({ top: 0, behavior: 'smooth' });}
                        }>上部へ戻る</div>
                    )}
                    <ReactPlayer
                        key={refreshKey}
                        className={isPiP ? "react-player" : "react-player"}
                        url={`https://www.youtube.com/watch?v=${props.ytid}`}
                        playing={playerState.playing}
                        playbackRate={playerState.playbackRate}
                        muted={playerState.muted}
                        width={"100%"}
                        height={"100%"}
                        controls={true}
                        ref={playerRef}
                        onPause={() => { setPlayerState({ ...playerState, playing: false }) }}
                        onPlay={() => { setPlayerState({ ...playerState, playing: true }) }}
                        onEnded={onEnd}
                    />
                </div>
            ) : (
                <div className='aspect-video w-full maxHeightVideo text-white flex place-content-center items-center bg-black'>
                    <p className='text-2xl text-center'>動画が選択されていません</p>
                </div>
            )}
            
            {/* Title&Drawer */}
            <TitleAndDrawer isLogin={isLogin} observerRef={observerRefCallback} setRefreshKey={setRefreshKey} ytid={props.ytid}/>
            {/* Controller */}
            <Controller ytid={props.ytid} playerState={playerState} setPlayerState={setPlayerState} setRepeat={setRepeat} repeat={repeat}/>
            <Toaster position="bottom-center" />
        </>
    )
}
