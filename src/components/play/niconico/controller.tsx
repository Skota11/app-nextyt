import { faRepeat, faShareFromSquare, faVolumeHigh, faVolumeXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react";
import { LiaCommentSolid } from "react-icons/lia"
import { Button } from "@/components/ui/button";

export default function Controller({ytid , playerState , playerRef , repeat , setRepeat}: {ytid: string , playerState: {muted: boolean , showComment: boolean} , setPlayerState: React.Dispatch<React.SetStateAction<{ muted: boolean; showComment: boolean }>>, playerRef: React.RefObject<HTMLIFrameElement | null> , repeat: boolean|undefined , setRepeat: React.Dispatch<React.SetStateAction<boolean | undefined>>}) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);
    const handleShare = async () => {
        const data: ShareData = {
            url: `https://nico.ms/${ytid}`
        };
        await navigator.share(data)
    }
    return (
        <div className="">
                {ytid !== "" ?
                    <div className='flex justify-center items-center gap-x-3'>
                        <Button
                            variant={playerState.muted ? "outline" : "default"}
                            title={playerState.muted ? "音を出す" : "消音にする"}
                            className={`
                                rounded-2xl h-12 w-12 font-semibold transition-all duration-200 hover:scale-105 shadow-sm
                            `}
                            onClick={async () => {
                                playerRef.current?.contentWindow?.postMessage({
                                    eventName: 'mute',
                                    data: {
                                        mute: !playerState.muted
                                    },
                                    sourceConnectorType: 1,
                                    playerId: "nicoPlayer"
                                }, "https://embed.nicovideo.jp")
                            }}
                        >
                            {playerState.muted ? <FontAwesomeIcon icon={faVolumeXmark} /> : <FontAwesomeIcon icon={faVolumeHigh} />}
                        </Button>
                        <Button
                            variant={!playerState.showComment ? "outline" : "default"}
                            title={playerState.showComment ? "コメントを非表示にする" : "コメントを表示する"}
                            className={`
                                rounded-2xl h-12 w-12 font-semibold transition-all duration-200 hover:scale-105 shadow-sm
                            `}
                            onClick={() => {
                                playerRef.current?.contentWindow?.postMessage({
                                    eventName: 'commentVisibilityChange',
                                    data: {
                                        commentVisibility: !playerState.showComment
                                    },
                                    sourceConnectorType: 1,
                                    playerId: "nicoPlayer"
                                }, "https://embed.nicovideo.jp")
                            }}
                        >
                            <LiaCommentSolid />
                        </Button>
                        <Button
                            variant="outline"
                            title="共有"
                            className="rounded-2xl h-12 w-12 hover:bg-accent transition-all duration-200 hover:scale-105"
                            onClick={async () => { handleShare() }}
                        >
                            <FontAwesomeIcon icon={faShareFromSquare} />
                        </Button>
                        {mounted && (
                            <Button
                                variant={repeat ? "default" : "outline"}
                                title="リピート"
                                className={`
                                    rounded-2xl h-12 w-12 transition-all duration-200 hover:scale-105 shadow-sm
                                `}
                                onClick={async () => { setRepeat(!repeat) }}
                            >
                                <FontAwesomeIcon icon={faRepeat} />
                            </Button>
                        )}
                    </div>
                    : <div className=""></div>}
            </div>
    )
}