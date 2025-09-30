'use client';
import Image from "next/image";

//Types
import { VideoAbout } from "@/types/db";
import nicoImg from "@/utils/niconico/nicoimg";
import Link from "next/link";
import { SiNiconico } from "react-icons/si";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import AddPlaylist from "@/components/play/common/addPlaylist";
import { useAddQueue } from "@/hooks/queue/useAddQueue";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function NicoVideoCard({item , deleteHistory , isPlayerPage} : {item: VideoAbout, deleteHistory: (id: string) => void , isPlayerPage?: boolean}) {
    const addQueue = useAddQueue();
    const [addedState, setAddedState] = useState<"idle" | "added" | "exists">("idle");
    const triggerFeedback = (state: "added" | "exists") => {
        setAddedState(state);
        setTimeout(() => setAddedState("idle"), 1200);
    };
    const searchParams = useSearchParams();
    const queueParam = searchParams.get('queue');
    const playHref = `/play?v=${item.videoId}${queueParam ? `&queue=${encodeURIComponent(queueParam)}` : ''}`;
    return (
        <div
            key={item.videoId}
            className="relative my-6 break-all sm:flex items-start gap-4 cursor-pointer rounded-lg shadow-md hover:bg-gray-100 transition-colors"
        >
            <Link href={playHref} className="flex-none">
            <div className="relative place-content-center w-full">
                <Image
                src={nicoImg(item.videoContent.thumbnail)}
                alt=""
                width={120 * 2.5}
                height={67.5 * 2.5}
                className="inline sm:rounded-md rounded-t-lg aspect-video object-cover w-full sm:w-[300px]"
                unoptimized
                />
                <div className="absolute bottom-2 right-2 bg-white place-content-center p-1 rounded-sm">
                <p className="flex items-center text-sm">
                    <SiNiconico className="m-1" />
                    ニコニコ動画
                </p>
                </div>
            </div>
            </Link>
            <div className="sm:inline">
            <Link href={playHref}>
                <p className="py-4 px-2 sm:px-0">{item.videoContent.title}</p>
            </Link>
            </div>
            <Popover>
                <PopoverTrigger asChild>
                    <button className="absolute sm:top-auto top-2 sm:bottom-2 right-2 w-8 h-8 bg-gray-300 rounded-full flex place-content-center items-center hover:bg-gray-400">
                        <FontAwesomeIcon icon={faEllipsis} />
                    </button>
                </PopoverTrigger>
                <PopoverContent className="border bg-white rounded-lg p-4 z-[120] shadow-lg" asChild>
                    <div className="flex flex-col gap-4">
                        {isPlayerPage && (
                            <Button onClick={() => {
                                const ok = addQueue(item.videoId);
                                triggerFeedback(ok ? "added" : "exists");
                            }}
                                variant={addedState === 'exists' ? 'secondary' : undefined}
                            >
                                {addedState === 'added' && '追加しました ✓'}
                                {addedState === 'exists' && '既に追加済み'}
                                {addedState === 'idle' && '再生キューに追加'}
                            </Button>
                        )}
                        <Button onClick={() => deleteHistory(item.videoId)} variant={"destructive"}>履歴から削除</Button>
                        
                        <div className="flex flex-col gap-1">
                            <p className="text-sm">プレイリストに追加</p>
                            <AddPlaylist videoId={item.videoId} />
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}