"use client";

import { useRef } from "react"
import "./play.css"

export default function Main() {
    const playerRef = useRef<HTMLIFrameElement>(null)
    //Player
    return (
        <>
            <div className={'aspect-video w-full max-h-4/5 maxHeightVideo'}>
                <iframe ref={playerRef} className="" src={`https://embed.nicovideo.jp/watch/${"sm9"}?persistence=1&oldScript=1&referer=&from=0&allowProgrammaticFullScreen=1&autoplay=1&jsapi=1&playerId=nicoPlayer`} width={"100%"} height={"100%"} allowFullScreen allow="autoplay"></iframe>
            </div>
            <div className="flex place-content-center gap-x-4">
                <picture>音量調節</picture>
                <input onChange={(e) => {
                    playerRef.current?.contentWindow?.postMessage({
                        eventName: 'volumeChange',
                        data: {
                            volume: Number(e.target.value) / 100
                        },
                        sourceConnectorType: 1,
                        playerId: "nicoPlayer"
                    }, "https://embed.nicovideo.jp")
                }} type={"range"} />
            </div>
            <p className="my-4 text-center"><button onClick={() => { history.back() }}>前のページに戻る</button></p>
        </>
    )
}
