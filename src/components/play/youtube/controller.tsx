import { faRepeat, faShareFromSquare, faVolumeHigh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

export default function Controller({ytid , playerState , setPlayerState , repeat ,setRepeat} : {ytid: string , playerState: { playing: boolean; muted: boolean; playbackRate: number }, setPlayerState: React.Dispatch<React.SetStateAction<{ playing: boolean; muted: boolean; playbackRate: number }>>, setRepeat: React.Dispatch<React.SetStateAction<boolean | undefined>> , repeat: boolean|undefined}) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, [])
    const handleShare = async () => {
            const data: ShareData = {
                url: `https://youtu.be/${ytid}`
            };
            await navigator.share(data)
        }
    return (
        <div className="">
                {ytid !== "" ?
                    <div className='flex justify-center items-center gap-x-3'>
                        <button
                            title="1倍速"
                            className={`
                                w-12 h-12 border-2 rounded-full text-xs border-current 
                                flex items-center justify-center gap-1 flex-shrink-0
                                hover:bg-gray-100 transition-colors duration-200
                                ${playerState.playbackRate === 1 ? 'bg-gray-200' : ''}
                            `}
                            onClick={async () => { setPlayerState({ ...playerState, playbackRate: 1 }) }}
                        >
                            <span className="text-xs font-medium">1×</span>
                        </button>
                        <button
                            title="1.5倍速"
                            className={`
                                w-12 h-12 border-2 rounded-full text-xs border-current 
                                flex items-center justify-center gap-1 flex-shrink-0
                                hover:bg-gray-100 transition-colors duration-200
                                ${playerState.playbackRate === 1.5 ? 'bg-gray-200' : ''}
                            `}
                            onClick={async () => { setPlayerState({ ...playerState, playbackRate: 1.5 }) }}
                        >
                            <span className="text-xs font-medium">1.5×</span>
                        </button>
                        <button
                            title="2倍速"
                            className={`
                                w-12 h-12 border-2 rounded-full text-xs border-current 
                                flex items-center justify-center gap-1 flex-shrink-0
                                hover:bg-gray-100 transition-colors duration-200
                                ${playerState.playbackRate === 2 ? 'bg-gray-200' : ''}
                            `}
                            onClick={async () => { setPlayerState({ ...playerState, playbackRate: 2 }) }}
                        >
                            <span className="text-xs font-medium">2×</span>
                        </button>
                        <button
                            title={playerState.muted ? "音を出す" : "消音にする"}
                            className={`
                                w-12 h-12 border-2 rounded-full text-xs border-current 
                                flex items-center justify-center flex-shrink-0 relative
                                hover:bg-gray-100 transition-colors duration-200
                                ${playerState.muted ? 'bg-red-100 border-red-500 text-red-700' : ''}
                            `}
                            onClick={async () => { setPlayerState({ ...playerState, muted: !playerState.muted }) }}
                        >
                            <FontAwesomeIcon icon={faVolumeHigh} />
                            {playerState.muted && (
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
    );
}