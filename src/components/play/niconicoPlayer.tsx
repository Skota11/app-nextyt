//React
import { useEffect, useState, useRef } from "react";

//Next.js

//supabase
import { supabase } from "@/utils/supabase/client";

//Utility Libraries
import { useLocalStorage } from "react-use";
import TitleAndDrawer from "./niconico/titleAndDrawer";
import Controller from "./niconico/controller";
import { Toaster } from "react-hot-toast";

export default function Home(props: { ytid: string, onEnd?: () => void }) {
    //state
    const [playerState , setPlayerState] = useState({muted: false , showComment: true});
    const [isLogin, setIsLogin] = useState(false)
    const observerRef = useRef<HTMLHeadingElement>(null);
    const playerRef = useRef<HTMLIFrameElement>(null);
    const [autoPlay] = useLocalStorage<boolean>('autoPlay', true);
    const [isPiP, setIsPiP] = useState(false);
    const [PiP] = useLocalStorage("pip");
    const [repeat , setRepeat] = useLocalStorage("repeat", false);
    const [refreshKey, setRefreshKey] = useState(0);
    //Player関係
    const handleMessage = (event: MessageEvent) => {
        if (event.origin === 'https://embed.nicovideo.jp') {
            switch (event.data.eventName) {
                case "loadComplete":
                    if (autoPlay) {
                        playerRef.current?.contentWindow?.postMessage({
                            eventName: 'play',
                            sourceConnectorType: 1,
                            playerId: "nicoPlayer"
                        }, "https://embed.nicovideo.jp")
                    }
                    break;
                case "playerStatusChange":
                    if (event.data.data.playerStatus == 4) {
                        if (repeat) {
                            playerRef.current?.contentWindow?.postMessage({
                                eventName: 'play',
                                sourceConnectorType: 1,
                                playerId: "nicoPlayer"
                            }, "https://embed.nicovideo.jp")
                        } else if (props.onEnd) {
                            props.onEnd();
                        }
                    }
                    break;
                case "playerMetadataChange":
                    setPlayerState({
                        muted: event.data.data.muted,
                        showComment: event.data.data.showComment
                    });
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
    //login
    useEffect(() => {
        const f = async () => {
            const { data } = await supabase.auth.getSession()
            if (data.session !== null) {
                setIsLogin(true)
            }
        }
        f()
    }, [])
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
    return (
        <>
            {/* Player */}
            {isPiP ? <>
                <div className='aspect-video w-full max-h-4/5 rounded-lg maxHeightVideo'>
                    <div className='w-full h-full text-white flex place-content-center bg-black'><p className='text-2xl text-center'>PictureInPictureで再生中</p></div>
                </div>
            </> : <></>}
            <div className={isPiP ? "fixed md:bottom-4 bottom-16 right-4 w-96 aspect-video shadow-lg z-50 bg-white rounded-xl overflow-hidden" : 'aspect-video w-full max-h-4/5 maxHeightVideo fullscreen-container'}
            >
                {props.ytid ? <>
                    <iframe ref={playerRef} key={refreshKey} src={`https://embed.nicovideo.jp/watch/${props.ytid}?persistence=1&oldScript=1&referer=&from=0&allowProgrammaticFullScreen=1&autoplay=1&jsapi=1&playerId=nicoPlayer`} width={"100%"} height={"100%"} allowFullScreen allow="autoplay"></iframe>
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
            <TitleAndDrawer ytid={props.ytid} isLogin={isLogin} observerRef={observerRef} setRefreshKey={setRefreshKey} />
            {/* Controller */}
            <Controller ytid={props.ytid} playerState={playerState} playerRef={playerRef} repeat={repeat} setRepeat={setRepeat}/>
            <Toaster position="bottom-center" />
        </>
    )
}
