"use client"

import { Button } from "@/components/ui/button";
import { faShareNodes, faVolumeHigh, faVolumeXmark } from "@fortawesome/free-solid-svg-icons";
import { TbRepeat , TbRepeatOff } from "react-icons/tb";
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
                        <Button
                            variant={playerState.playbackRate === 1 ? "default" : "outline"}
                            title="1倍速"
                            className={`
                                rounded-2xl h-12 w-12 font-semibold transition-all duration-200 hover:scale-105 shadow-sm
                            `}
                            onClick={async () => { setPlayerState({ ...playerState, playbackRate: 1 }) }}
                        >
                            <span className="text-xs font-medium">1×</span>
                        </Button>
                        <Button
                            variant={playerState.playbackRate === 1.5 ? "default" : "outline"}
                            title="1.5倍速"
                            className={`
                                rounded-2xl h-12 w-12 font-semibold transition-all duration-200 hover:scale-105 shadow-sm
                            `}
                            onClick={async () => { setPlayerState({ ...playerState, playbackRate: 1.5 }) }}
                        >
                            <span className="text-xs font-medium">1.5×</span>
                        </Button>
                        <Button
                            variant={playerState.playbackRate === 2 ? "default" : "outline"}
                            title="2倍速"
                            className={`
                                rounded-2xl h-12 w-12 font-semibold transition-all duration-200 hover:scale-105 shadow-sm
                            `}
                            onClick={async () => { setPlayerState({ ...playerState, playbackRate: 2 }) }}
                        >
                            <span className="text-xs font-medium">2×</span>
                        </Button>
                        <Button
                            variant={playerState.muted ? "outline" : "default"}
                            title={playerState.muted ? "音を出す" : "消音にする"}
                            className={`
                                rounded-2xl h-12 w-12 font-semibold transition-all duration-200 hover:scale-105 shadow-sm
                            `}
                            onClick={async () => { setPlayerState({ ...playerState, muted: !playerState.muted }) }}
                        >
                            {playerState.muted ? <FontAwesomeIcon icon={faVolumeXmark} /> : <FontAwesomeIcon icon={faVolumeHigh} />}
                        </Button>
                        <Button
                            variant="outline"
                            title="共有"
                            className="rounded-2xl h-12 w-12 hover:bg-accent transition-all duration-200 hover:scale-105"
                            onClick={async () => { handleShare() }}
                        >
                            <FontAwesomeIcon icon={faShareNodes} />
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
                                {repeat ? <TbRepeat className="text-xl" /> : <TbRepeatOff className="text-xl opacity-50" />}
                            </Button>
                        )}
                    </div>
                    : <div className=""></div>}
            </div>
    );
}