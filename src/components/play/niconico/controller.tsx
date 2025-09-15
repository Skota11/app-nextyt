import { faRepeat, faShareFromSquare, faVolumeHigh } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react";
import { LiaCommentSolid } from "react-icons/lia"

export default function Controller({ytid , playerState , playerRef , repeat , setRepeat}: {ytid: string , playerState: {muted: boolean , showComment: boolean} , playerRef: React.RefObject<HTMLIFrameElement | null> , repeat: boolean|undefined , setRepeat: React.Dispatch<React.SetStateAction<boolean | undefined>>}) {
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
                        <button
                            title={playerState.muted ? "音を出す" : "消音にする"}
                            className={`
                                w-12 h-12 border-2 rounded-full text-xs border-current 
                                flex items-center justify-center flex-shrink-0 relative
                                hover:bg-gray-100 transition-colors duration-200
                                ${playerState.muted ? 'bg-red-100 border-red-500 text-red-700' : ''}
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
                            <FontAwesomeIcon icon={faVolumeHigh} />
                            {playerState.muted && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-8 h-0.5 bg-current rotate-45 transform"></div>
                                </div>
                            )}
                        </button>
                        <button
                            title={playerState.showComment ? "コメントを非表示にする" : "コメントを表示する"}
                            className={`
                                w-12 h-12 border-2 rounded-full border-current 
                                flex items-center justify-center flex-shrink-0 relative
                                hover:bg-gray-100 transition-colors duration-200
                                ${!playerState.showComment ? 'bg-gray-100 border-gray-500 text-gray-700' : ''}
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
                            {!playerState.showComment && (
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
                        {mounted && (
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
                        )}
                    </div>
                    : <div className=""></div>}
            </div>
    )
}